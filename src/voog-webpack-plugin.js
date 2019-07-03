const fs = require('fs');
const md5File = require('md5-file');
const VoogApi = require('./voog-api');
const { getStringMd5Sum, getFileType, getResourceType, createChunks, asyncForEach } = require('./helpers');

class VoogWebpackPlugin {

  constructor(options) {
    this.baseDir = null;
    this.cache = null;
    this.buildFiles = null;

    this.voogApi = new VoogApi({
      host: options.voogApiHost,
      token: options.voogApiToken
    });
  }

  apply(compiler) {
    compiler.hooks.done.tapPromise('VoogDevUpdatePlugin', async () => {
      this.baseDir = compiler.outputPath;
      this.buildFiles = {};

      this.loadBuildFiles(this.baseDir);
      await this.loadCache();

      await this.filterChangedFiles();
    });
  }

  async filterChangedFiles() {
    console.log('DEBUG: Looking for files that have changed or are new');

    const fileUpdates = [];
    const fileCreates = [];

    Object.keys(this.buildFiles).forEach((fileName) => {
      if (!(fileName in this.cache)) {
        console.log('DEBUG: File missing from Voog. Creating new file', fileName);
        fileCreates.push(
          this.voogApi.createResource(this.buildFiles[fileName].resourceType,
            fileName.replace('.tpl', ''),
            this.buildFiles[fileName].fileType, this.buildFiles[fileName].path)
            .then((result) =>
              this.addToCache(fileName, getResourceType(fileName), result.id,
                this.buildFiles[fileName].md5sum, result.editable)));
      } else if (this.cache[fileName].editable && this.buildFiles[fileName].md5sum !== this.cache[fileName].md5sum) {
        console.log('DEBUG: File exists, but md5sum is different. Updating file', fileName);
        fileUpdates.push(
          this.voogApi.updateResource(this.cache[fileName].resourceType,
            this.cache[fileName].id, fs.readFileSync(this.buildFiles[fileName].path, 'utf8'))
            .then(() => this.updateCacheItemMd5(fileName, this.buildFiles[fileName].md5sum)));
      }
    });

    return await Promise.all(fileCreates.concat(fileUpdates));
  }

  async loadCache() {
    if (this.isCacheLoaded()) {
      console.log(`DEBUG: Voog cache loaded. Skipping`);
    } else {
      console.log(`DEBUG: Voog cache doesn't exist. Loading data from API`, this.voogApi.host);
      await this.initCache();
    }
  }

  async initCache() {
    this.cache = {};

    return await Promise.all([
      this.initCacheLayouts(),
      this.initCacheLayoutAssets()
    ]).then(() => console.log('DEBUG: Cache initialized. Items:', Object.keys(this.cache).length));
  }

  async initCacheLayouts() {
    const layouts = await this.voogApi.getLayouts();

    const chunks = createChunks(layouts, 10);

    await asyncForEach(chunks, async (chunk) => await Promise.all(
      chunk
        .filter((layout) => this.buildFiles[layout.layout_name + '.tpl'] !== undefined)
        .map((layout) => this.voogApi.getLayout(layout.id))
      ).then(
      (details) => details.forEach((detail) =>
        this.addToCache(
          detail.layout_name + '.tpl',
          'layouts',
          detail.id,
          getStringMd5Sum(detail.body))
      ))
    );

    return await Promise.resolve();
  }

  async initCacheLayoutAssets() {
    const layoutAssets = await this.voogApi.getLayoutAssets();

    const chunks = createChunks(layoutAssets, 10);

    await asyncForEach(chunks, async (chunk) => await Promise.all(
      chunk
        .filter((layoutAsset) => this.buildFiles[layoutAsset.filename] !== undefined)
        .filter((layoutAsset) => {
          if (layoutAsset.editable) {
            return true;
          } else {
            this.addToCache(layoutAsset.filename, 'layout_assets', layoutAsset.id, null, false);
            return false;
          }
        })
        .map((layoutAsset) => this.voogApi.getLayoutAsset(layoutAsset.id))
      ).then(
      (details) => details.forEach((detail) =>
        this.addToCache(detail.filename, 'layout_assets', detail.id, getStringMd5Sum(detail.data))
      ))
    );

    return await Promise.resolve();
  }

  addToCache(fileName, resourceType, id, md5sum, editable) {
    this.cache[fileName] = {
      id: id,
      md5sum: md5sum,
      resourceType: resourceType,
      editable: (editable === undefined) ? true : editable
    }
  }

  updateCacheItemMd5(fileName, md5sum) {
    console.log('DEBUG: Updating file md5 in cache', fileName, md5sum);
    this.cache[fileName].md5sum = md5sum;
  }

  isCacheLoaded() {
    return !!this.cache;
  }

  loadBuildFiles(dir) {
    var files = fs.readdirSync(dir);
    for (let i in files) {
      if (!files.hasOwnProperty(i)) continue;
      let filePath = dir + '/' + files[i];
      if (fs.statSync(filePath).isDirectory()) {
        this.loadBuildFiles(filePath);
      } else {
        this.buildFiles[files[i]] = {
          resourceType: getResourceType(files[i]),
          fileType: getFileType(filePath),
          fileName: files[i],
          fileNameWithFolder: filePath.replace(this.baseDir, ''),
          path: filePath,
          md5sum: md5File.sync(filePath)
        };
      }
    }
  }
}

module.exports = VoogWebpackPlugin;
