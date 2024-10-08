const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

exports.loadRoutes = (app) => {
  fs.readdirSync(__dirname)
    .filter((file) => {
      return (
        file.indexOf('.') !== 0 &&
        file !== basename &&
        file.slice(-9) === 'routes.js'
      );
    })
    .forEach((file) => {
      const route = require(path.join(__dirname, file));

      route(app);
    });
};
