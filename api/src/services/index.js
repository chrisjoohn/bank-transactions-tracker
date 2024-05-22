const fs = require('fs');
const path = require('path');

const basename = path.basename(__filename);

const services = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.endsWith('.service.js') && file !== basename;
  })
  .forEach((file) => {
    const serviceModule = require(path.join(__dirname, file));

    services[serviceModule.serviceName] = serviceModule;
  });

module.exports = services;
