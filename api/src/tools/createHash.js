const crypto = require('crypto');

const createHashString = (str, maxLength = undefined) => {
  const hashedString = crypto.createHash('sha256').update(str).digest('hex');

  if (maxLength) {
    return hashedString.substring(0, maxLength);
  }

  return hashedString;
};

exports.createHashString = createHashString;

exports.createHashFromObj = (obj) => {
  const sortedObj = Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});

  const objString = JSON.stringify(sortedObj);

  return createHashString(objString, 50);
};
