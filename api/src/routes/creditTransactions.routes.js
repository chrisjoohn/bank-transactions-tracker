const express = require('express');
const multer = require('multer')

const router = express.Router();

module.exports = (app) => {
  const route = 'credit_transactions';

  const controller = require(`../controllers/creditTransactions.controller`);

  const upload = multer({ storage: multer.memoryStorage() });

  router.get(`/${route}`, controller.findAll);
  router.get(`/${route}/:id`, controller.findOne);
  router.post(`/${route}`, controller.create);
  router.post(`/${route}/bulk`, controller.bulkCreate);
  router.post(`/${route}/statement-upload`, upload.single('file'), controller.parseStatement)
  router.put(`/${route}/:id`, controller.update);
  router.delete(`/${route}/:id`, controller.delete);

  app.use(`/`, router);
};
