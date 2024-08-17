const express = require('express');

const router = express.Router();

module.exports = (app) => {
  const route = 'credit_transaction_tags';

  const controller = require(`../controllers/creditTransactionTags.controller`);

  router.get(`/${route}`, controller.findAll);
  router.get(`/${route}/:id`, controller.findOne);
  router.post(`/${route}`, controller.create);
  router.put(`/${route}/:id`, controller.update);
  router.delete(`/${route}/:id`, controller.delete);

  app.use(`/`, router);
};
