// See http://brunch.io for documentation.
exports.files = {
  javascripts: {
    joinTo: {
      'vendor.js': /^(?!app)/, // Files that are not in `app` dir.
      'app.js': /^app/
    }
  },
  stylesheets: {joinTo: {'app.css': /^app/}}
};

exports.plugins = {
  babel: {presets: ['env']},
  uglify: {
      mangle: false,
      compress: {
        global_defs: {
          DEBUG: true
        }
      }
    }
};
