# broccoli-preprocess-tree

Broccoli plugin around [preprocess](https://github.com/jsoverson/preprocess) npm module

## Installation

`npm install broccoli-preprocess-tree --save-dev`

## Usage

```javascript
var preprocess = require('broccoli-preprocess-tree');

var public = preprocess('public', {
  context: {
    // insert your vars here...
  }
});

```

See [preprocess](https://github.com/jsoverson/preprocess) documentation for more information
