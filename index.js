// Process lodash templates in YFM
// use whatever `merge` you prefer, but anything that
// "deep merges" might be best for this
var expander = require('expander');
var merge    = require('lodash.merge');

// Used for renameKey function
var path  = require('path');

function expand(data, assemble) {
  // `data` is front-matter
  var ctx = merge({}, assemble.cache.data, data);
  return expander.process(ctx, data);
}

module.exports = function(assemble) {

    // Register external data
    assemble.data('bower_components/iucomm-foundation/templates/data/*.yaml');

    // Register external layouts
    assemble.layouts('bower_components/iucomm-foundation/templates/layouts/*.hbs');

    // Register external partials
    assemble.partials('bower_components/iucomm-foundation/templates/partials/**/*.hbs');
    assemble.partials('bower_components/iu-brand/dist/2.x/*.html');
    assemble.partials('bower_components/iu-search/dist/2.x/*.html');

    // Define a middleware for using lodash templates in YFM
    assemble.preRender(/\.(hbs|html)$/, function (view, next) {
      view.data = expand(view.data, assemble);
      next();
    });

    // Set layout/partials/page key names
    assemble.option('renameKey', function(filepath) {

        // Default from assemble/lib/index.js
        var basename = path.basename(filepath, path.extname(filepath));

        // Handle pages differently (so we can use multiple index.hbs)
        if (filepath.indexOf('pages') !== -1) {
            filepath = filepath.split('pages/').pop(1);
            return path.join(path.dirname(filepath), basename);
        }

        return basename;
    });
}
