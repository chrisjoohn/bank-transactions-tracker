
/**
 * 
 * REQUIREMENTS:
 *   - create controller for this one
 * TODO:
 *   - find and replace [routeName]; should be the same name as defined on controllers e.g. users
 */

const express = require('express');

const router = express.Router();

module.exports = (app) => {
  const route = '[routeName]';

  const controller = require(`../controllers/[routeName].controller`);

  router.get(`/${route}`, controller.findAll);
  router.get(`/${route}/:id`, controller.findOne);
  router.post(`/${route}`, controller.create);
  router.put(`/${route}/:id`, controller.update);
  router.delete(`/${route}/:id`, controller.delete);

  app.use(`/`, router);
};
