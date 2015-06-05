var Writer = require('broccoli-writer');
var fs = require('fs-extra');
var preprocess = require('preprocess');
var glob = require('glob');
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
    fs.copySync(srcDir, destDir);

    var files = glob.sync('**/*.*', {
      cwd: srcDir,
      nodir: true
    });

    _.forEach(files, function (file) {
      preprocess.preprocessFileSync(destDir + '/' + file, destDir + '/' + file, self.options.context);
    });
  });
};

module.exports = PreprocessFilter;
