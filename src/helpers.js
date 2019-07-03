const path = require('path');
const crypto = require('crypto');
const mime = require('mime-types');

function getStringMd5Sum(string) {
  return crypto.createHash('md5').update(string).digest('hex');
}

function getFileType(filePath) {
  const fileExt = path.extname(filePath);

  switch (fileExt) {
    case '.tpl': {
      return filePath.search('layout.tpl') > -1 ? 'layout' : 'component'
    }
    default: {
      return mime.lookup(filePath) || 'application/octet-stream';
    }
  }
}

function getResourceType(fileName) {
  return (fileName.search(/.tpl/i) > -1) ? 'layouts' : 'layout_assets'
}

function createChunks(arr, chunkSize) {
  let results = [];

  while (arr.length) {
    results.push(arr.splice(0, chunkSize))
  }

  return results;
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

module.exports = {
  getStringMd5Sum,
  getFileType,
  getResourceType,
  createChunks,
  asyncForEach
};
