var Writer = require('broccoli-writer');
var fs = require('fs-extra');
var copyDereferenceSync = require('copy-dereference').sync;
var preprocess = require('preprocess');
var glob = require('glob');
var path = require('path');
var _ = require('lodash-node');

function PreprocessFilter(inputTree, options) {
  if (!(this instanceof PreprocessFilter)) {
    return new PreprocessFilter(inputTree, options);
  }

  this.options = options || {};
  this.options.context = this.options.context || {};
  this.options.extensions = this.options.extensions || ['html', 'js', 'css'];
  this.inputTree = inputTree;
}

PreprocessFilter.prototype = Object.create(Writer.prototype);
PreprocessFilter.prototype.constructor = PreprocessFilter;

PreprocessFilter.prototype.getFileExtension = function (filename) {
  var result = path.extname(filename);
  if (result.length> 0) {
    result = result.substr(1, result.length);
  }

  return result;
};

PreprocessFilter.prototype.write = function (readTree, destDir) {
  var self = this;

  return readTree(self.inputTree).then(function (srcDir) {

    var files = glob.sync('**/*.*', {
      cwd: srcDir,
      nodir: true
    });

    _.forEach(files, function (file) {
      var filename = destDir + '/' + file;
      fs.ensureDirSync(path.dirname(filename));
      copyDereferenceSync(srcDir + '/' + file, filename);

      var extname = self.getFileExtension(filename);

      if (self.options.extensions.indexOf(extname) > -1) {
        preprocess.preprocessFileSync(filename, filename, self.options.context);
      }

    });
  });
};

module.exports = PreprocessFilter;
