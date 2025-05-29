const models = require('../models');

// required name to be used on exporting services on index
exports.serviceName = 'creditTransactionTagsService';

exports.create = async ({ tag_id, credit_transaction_id }) => {
  try {
    const creditTransactionTagsModel = models.credit_transaction_tags;

    const postData = {
      tag_id,
      credit_transaction_id,
    };

    const data = await creditTransactionTagsModel.create(postData);

    return data;
  } catch (err) {
    console.log('Error in create credit transaction tags service: ', err);
    throw err;
  }
};

exports.findAll = async () => {
  try {
    const creditTransactionTagsModel = models.credit_transaction_tags;

    const data = await creditTransactionTagsModel.findAll();
    return data;
  } catch (err) {
    console.log('Error in find all credit transaction tags service: ', err);
    throw err;
  }
};

exports.findOne = async (id) => {
  try {
    const creditTransactionTagsModel = models.credit_transaction_tags;

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const data = await creditTransactionTagsModel.findOne({
      where: { [keyField]: id },
    });

    return data;
  } catch (err) {
    console.log('Error in find one credit transaction tags service: ', err);
    throw err;
  }
};

exports.update = async (id, { tag_id, credit_transaction_id }) => {
  try {
    const creditTransactionTagsModel = models.credit_transaction_tags;

    const putData = {
      tag_id,
      credit_transaction_id,
    };

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const [updated] = await creditTransactionTagsModel.update(putData, {
      where: {
        [keyField]: id,
      },
    });

    if (!updated) {
      throw 'Not found!';
    }

    const data = await creditTransactionTagsModel.findOne({
      where: { [keyField]: id },
    });

    return data;
  } catch (err) {
    console.log('Error in update credit transaction tags service: ', err);
    throw err;
  }
};

exports.delete = async (id) => {
  try {
    const creditTransactionTagsModel = models.credit_transaction_tags;

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const data = await creditTransactionTagsModel.destroy({
      where: { [keyField]: id },
    });

    return data;
  } catch (err) {
    console.log('Error in delete credit transaction tags service: ', err);
    throw err;
  }
};

exports.deleteByTransactionAndTag = async ({ transactionId, tagId }) => {
  try {
    const creditTransactionTagsModel = models.credit_transaction_tags;
    const tagsModel = models.tags;
    const creditTransactionsModel = models.credit_transactions;

    const ccTrxKeyField = isNaN(transactionId) ? 'unique_code' : 'id';
    const ccTrx = await creditTransactionsModel.findOne({
      where: { [ccTrxKeyField]: transactionId },
    });

    const tagKeyField = isNaN(tagId) ? 'unique_code' : 'id';
    const tag = await tagsModel.findOne({ where: { [tagKeyField]: tagId } });

    if (!ccTrx) {
      throw new Error('Cannot find transaction');
    }

    if (!tag) {
      throw new Error('Cannot find tag');
    }

    const data = await creditTransactionTagsModel.destroy({
      where: {
        credit_transaction_id: ccTrx.id,
        tag_id: tag.id,
      },
    });

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
