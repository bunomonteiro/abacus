var browserSync = require("browser-sync");

// Start the server
browserSync({
    server: true,
    online: false,
    files: ['./**.*', './images/**.*', './scripts/**.*', './styles/**.*', './audio/**.*'],
    notify: false
  }
);