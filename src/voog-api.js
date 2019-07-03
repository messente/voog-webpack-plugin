const request = require('request-promise');
const fs = require('fs');

const endpoints = {
  layouts: '/layouts',
  layoutAssets: '/layout_assets'
};

const returnWithHeadersTransformer = function (body, response) {
  return {'headers': response.headers, 'data': body};
};

class VoogApi {

  constructor(options) {
    this.host = options.host;
    this.token = options.token;
  }

  async createResource(resourceType, fileName, fileType, filePath) {
    switch (resourceType) {
      case "layouts": {
        return this.createLayout(fileName, fileType, fs.readFileSync(filePath, 'utf8'));
      }
      case "layout_assets": {
        switch (fileType) {
          case 'application/javascript':
          case 'text/css':
          case 'text/html': {
            return this.createLayoutTextAsset(fileName, fs.readFileSync(filePath, 'utf8'));
          }
          default: {
            return this.createLayoutMultipartAsset(fileName, fileType, fs.createReadStream(filePath));
          }
        }
      }
    }
  }

  async updateResource(resourceType, id, data) {
    switch (resourceType) {
      case "layouts": {
        return this.updateLayout(id, data);
      }
      case "layout_assets": {
        return this.updateLayoutAsset(id, data);
      }
    }
  }

  async getLayouts() {
    const url = this.getFullEndpoint(endpoints.layouts) +
      `?per_page=250`;

    const responses = [];
    const firstPage = await this.request({ url, json: true, transform: returnWithHeadersTransformer }).catch(
      (err) => console.error('ERROR: GET', url, err.statusCode,  err.message, err.error));
    const totalPages = firstPage.headers['x-total-pages'];

    responses.push(firstPage.data);
    for (let i = 2; i <= totalPages; i++) {
      let pageUrl = `${url}&page=${i}`;
      responses.push(this.request({ url: pageUrl, json: true }).catch(
        (err) => console.error('ERROR: GET', pageUrl, err.statusCode,  err.message, err.error)));
    }

    return Promise.all(responses).then(
      (responseValues) => responseValues.reduce((merged, responseVal) => merged.concat(responseVal)));
  }

  async getLayout(id) {
    const url = this.getFullEndpoint(endpoints.layouts, id);

    return this.request({ url, json: true }).catch(
      (err) => console.error('ERROR: GET', url, err.statusCode,  err.message, err.error));
  }

  async updateLayout(id, body) {
    const url = this.getFullEndpoint(endpoints.layouts, id);

    console.log('DEBUG: Updating layout', id, url);
    return this.request({ method: 'put', url, json: { body } }).catch(
      (err) => console.error('ERROR: PUT', url, err.statusCode,  err.message, err.error));
  }

  async createLayout(fileName, fileType, body) {
    const url = this.getFullEndpoint(endpoints.layouts);

    console.log('DEBUG: Creating layout', fileName, fileType, url);
    return this.request({ method: 'post', url, json: { filename: fileName, title: fileName,
        component: fileType === 'component', body, content_type: 'page' } }).catch(
      (err) => console.error('ERROR: POST', url, err.statusCode,  err.message, err.error));
  }

  async deleteLayout(id) {
    const url = this.getFullEndpoint(endpoints.layouts, id);

    console.log('DEBUG: Deleting layout', id, url);
    return this.request({ method: 'delete', url }).catch(
      (err) => console.error('ERROR: DELETE', url, err.statusCode,  err.message, err.error));
  }

  async getLayoutAssets() {
    const url = this.getFullEndpoint(endpoints.layoutAssets) +
      `?per_page=250`;

    const responses = [];
    const firstPage = await this.request({ url, json: true, transform: returnWithHeadersTransformer }).catch(
      (err) => console.error('ERROR: GET', url, err.statusCode,  err.message, err.error));
    const totalPages = firstPage.headers['x-total-pages'];

    responses.push(firstPage.data);
    for (let i = 2; i <= totalPages; i++) {
      let pageUrl = `${url}&page=${i}`;
      responses.push(this.request({ url: pageUrl, json: true }).catch(
        (err) => console.error('ERROR: GET', pageUrl, err.statusCode,  err.message, err.error)));
    }

    return Promise.all(responses).then(
      (responseValues) => responseValues.reduce((merged, responseVal) => merged.concat(responseVal)));
  }

  async getLayoutAsset(id) {
    const url = this.getFullEndpoint(endpoints.layoutAssets, id);

    return this.request({ url, json: true }).catch(
      (err) => console.error('ERROR: GET', url, err.statusCode,  err.message, err.error));
  }

  async updateLayoutAsset(id, data) {
    const url = this.getFullEndpoint(endpoints.layoutAssets, id);

    console.log('DEBUG: Updating asset', id, url);
    return this.request({ method: 'patch', url, json: { data } }).catch(
      (err) => console.error('ERROR: PATCH', url, err.statusCode,  err.message, err.error));
  }

  async deleteLayoutAsset(id) {
    const url = this.getFullEndpoint(endpoints.layoutAssets, id);

    console.log('DEBUG: Deleting asset', id, url);
    return this.request({ method: 'delete', url }).catch(
      (err) => console.error('ERROR: DELETE', url, err.statusCode,  err.message, err.error));
  }

  async createLayoutTextAsset(fileName, data) {
    const url = this.getFullEndpoint(endpoints.layoutAssets);

    console.log('DEBUG: Creating asset', fileName, url);
    return this.request({ method: 'post', url, json: { filename: fileName, data } }).catch(
      (err) => console.error('ERROR: POST', url, err.statusCode,  err.message, err.error));
  }

  async createLayoutMultipartAsset(fileName, contentType, data) {
    const url = this.getFullEndpoint(endpoints.layoutAssets);

    const options = {
      url,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      formData: {
        filename: fileName,
        content_type: contentType,
        file: data
      }
    };

    console.log('DEBUG: Creating multipart asset', fileName, contentType, url);
    return this.request(options).catch(
      (err) => console.error('ERROR: POST', url, err.statusCode,  err.message, err.error));
  }

  async request(options) {
    const apiToken = {
      headers: {
        'X-API-TOKEN': this.token
      }
    };
    return request({ ...options, ...apiToken });
  }

  getFullEndpoint(endpoint, id) {
    return `${this.host}/admin/api${endpoint}/${id || ''}`;
  }
}

module.exports = VoogApi;
