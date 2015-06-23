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
  this.inputTree = inputTree;
}

PreprocessFilter.prototype = Object.create(Writer.prototype);
PreprocessFilter.prototype.constructor = PreprocessFilter;

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

      preprocess.preprocessFileSync(filename, filename, self.options.context);
    });
  });
};

module.exports = PreprocessFilter;
