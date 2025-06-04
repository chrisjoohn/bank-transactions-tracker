const csv = require('csv-parser');
const stream = require('stream');

module.exports = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const results = [];

    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileBuffer);

    bufferStream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
};
