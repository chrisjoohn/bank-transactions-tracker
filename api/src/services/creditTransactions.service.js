const { Op } = require('sequelize');
const PdfParse = require('pdf-parse');
const { parse, format } = require('date-fns');

const { createHashFromObj } = require('../tools/createHash');

const models = require('../models');

const accountsService = require('./accounts.service');

// required name to be used on exporting services on index
exports.serviceName = 'creditTransactionsService';

exports.create = async ({
  account_id,
  description,
  transaction_date,
  post_date,
}) => {
  try {
    const creditTransactionsModel = models.credit_transactions;

    const account = await accountsService.findOne(account_id);

    if (!account) {
      throw new Error(`Cannot find account: ${account_id}`);
    }

    const postData = {
      account_id: account.id,
      description,
      transaction_date,
      post_date,
    };

    const data = await creditTransactionsModel.create(postData);

    return data;
  } catch (err) {
    console.log('Error in create credit_transactions service: ', err);
    throw err;
  }
};

exports.bulkCreate = async ({ records = [], account_id }) => {
  try {
    if (!account_id) {
      throw new Error("Account ID is required");
    }

    const creditTransactionsModel = models.credit_transactions;

    const toCreate = records.map((item) => {
      const unique_code = createHashFromObj({ ...item, account_id });

      return {
        ...item,
        account_id,
        unique_code,
      };
    });

    const data = await creditTransactionsModel.bulkCreate(toCreate);

    return data;
  } catch (err) {
    console.log(`Error in bulkCreate credit transactions service: `, err);
    throw err;
  }
};

exports.findAll = async ({ filters = {} }) => {
  try {
    const creditTransactionsModel = models.credit_transactions;

    const whereCondition = {};

    const filterKeys = Object.keys(filters);
    for (const filterKey of filterKeys) {
      switch (filterKey) {
        // add filters here
        case 'account_id':
          const accountId = filters[filterKey];
          const account = await accountsService.findOne(accountId);

          if (!account) {
            throw new Error(`Cannot find account: ${accountId}`);
          }

          whereCondition['account_id'] = {
            [Op.eq]: account.id,
          };
          break;
      }
    }

    const data = await creditTransactionsModel.findAll({
      where: whereCondition,
    });
    return data;
  } catch (err) {
    console.log('Error in find all credit_transactions service: ', err);
    throw err;
  }
};

exports.findOne = async (id) => {
  try {
    const creditTransactionsModel = models.credit_transactions;

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const data = await creditTransactionsModel.findOne({
      where: { [keyField]: id },
    });

    return data;
  } catch (err) {
    console.log('Error in find one credit_transactions service: ', err);
    throw err;
  }
};

exports.update = async (
  id,
  { account_id, description, transaction_date, post_date }
) => {
  try {
    const creditTransactionsModel = models.credit_transactions;

    const putData = { account_id, description, transaction_date, post_date };

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const [updated] = await creditTransactionsModel.update(putData, {
      where: {
        [keyField]: id,
      },
    });

    if (!updated) {
      throw 'Not found!';
    }

    const data = await creditTransactionsModel.findOne({
      where: { [keyField]: id },
    });

    return data;
  } catch (err) {
    console.log('Error in update credit_transactions service: ', err);
    throw err;
  }
};

exports.delete = async (id) => {
  try {
    const creditTransactionsModel = models.credit_transactions;

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const data = await creditTransactionsModel.destroy({
      where: { [keyField]: id },
    });

    return data;
  } catch (err) {
    console.log('Error in delete credit_transactions service: ', err);
    throw err;
  }
};

/**
 * @param {string} transactionStr
 * e.g. BeyondTheBox-UptwnBTa:23/241,478.75
 *
 * returns an object
 * {
 *  transactionDate: string;
 *  postDate: string;
 * }
 */
const extractDates = (transactionStr) => {
  const datePattern = /([A-Za-z]+\d{1,2})/g; // Matches "August28" or "July29"
  let transactionDate;
  let postDate;

  // Extract transaction date and post date
  const dateMatches = transactionStr.match(datePattern);
  if (dateMatches && dateMatches.length >= 2) {
    transactionDate = dateMatches[0];
    postDate = dateMatches[1];
  }

  return {
    transactionDate,
    postDate,
  };
};

/**
 * @param {string} billerAndAmountStr
 * @returns {
 *  amount: string;
 *  biller: string;
 * }
 */
const extractBillerAndAmount = (billerAndAmountStr) => {
  let amount;
  let biller;

  const amountMatch = billerAndAmountStr.match(
    /(\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\.\d{2})$/
  );

  if (!amountMatch) {
    throw 'Amount not found';
  }

  amount = amountMatch[0];

  /**
   * CUSTOM extracting
   * TODO: Refactor this custom cleaners
   */
  // for items with :21/24<amount>
  if (billerAndAmountStr.includes(':')) {
    amount = billerAndAmountStr.split(':')[1].slice(5);
  }

  // for items with `0` as prefix. e.g. BpSunlif082923500016,000.00
  if (amount.startsWith(0)) {
    amount = amount.slice(1);
  }

  // Extract the biller part by removing the amount from the input
  biller = billerAndAmountStr.slice(0, -amount.length).trim();

  return {
    amount,
    biller,
  };
};

/**
 * @param {String[]} data
 * @returns  {
 *  transaction_date: string;
 *  post_date: string;
 *  amount: number;
 *  description: string
 * }
 */
const parseTransactionData = (data) => {
  return data.map((item) => {
    // Extract transaction and post dates
    const { transactionDate, postDate } = extractDates(item);

    // Extract biller and amount
    const datesString = `${transactionDate}${postDate}`;
    const billerAndAmountStr = item.substring(datesString.length);

    const { amount, biller } = extractBillerAndAmount(billerAndAmountStr);

    const transactionYear = new Date().getFullYear();
    const dateFormat = 'yyyy-MM-dd';

    return {
      transaction_date: format(
        parse(transactionDate, 'MMMMd', new Date(transactionYear, 0, 1)),
        dateFormat
      ),
      post_date: format(
        parse(postDate, 'MMMMd', new Date(transactionYear, 0, 1)),
        dateFormat
      ),
      amount: parseFloat(amount.replace(',', '')),
      description: biller,
    };
  });
};

exports.parseStatement = async (file) => {
  const pdfData = await PdfParse(file.buffer);

  const splittedPdfText = pdfData.text.split('\n');

  const initial = splittedPdfText.findIndex((item) =>
    item.toLowerCase().includes('installmentamortization')
  );
  const end = splittedPdfText.findIndex((item) =>
    item.toLowerCase().includes('balancesummary')
  );

  const pdfTextArr = splittedPdfText.slice(initial + 1, end);

  const data = parseTransactionData(pdfTextArr);

  return data;
};
