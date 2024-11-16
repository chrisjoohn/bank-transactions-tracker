const pdfJsLib = require('pdfjs-dist');

const colPositions = {
  date: [30, 60],
  desc: [60, 115],
  ref: [195, 216],
  details: [220, 360],
  debitAmount: [400, 435],
  creditAmount: [470, 500],
};

const sortObjKey = (obj) => {
  const sortedKeys = Object.keys(obj).sort((a, b) => Number(a) - Number(b));

  const sortedObj = {};
  sortedKeys.forEach((key) => {
    if (Number.isInteger(Number(key))) {
      // adding .0 here
      sortedObj[`${key}.0`] = obj[key];
    } else {
      sortedObj[key] = obj[key];
    }
  });

  return sortedObj;
};

const inRange = (position, range) => {
  return position >= range[0] && position < range[1];
};

const getAttribute = (position) => {
  const colPositionKeys = Object.keys(colPositions);

  for (let i = 0; i < colPositionKeys.length; i++) {
    const key = colPositionKeys[i];
    const range = colPositions[key];

    if (inRange(parseFloat(position), range)) {
      return key;
    }
  }
};

const extractDataPerLine = (lineObj) => {
  const dataObj = {};

  const sortedObj = sortObjKey(lineObj);

  const sortObjKeys = Object.keys(sortedObj);
  sortObjKeys.forEach((key) => {
    const word = sortedObj[key];

    if (!word) {
      return;
    }

    const objAttr = getAttribute(key);

    if (objAttr) {
      if (!dataObj[objAttr]) {
        dataObj[objAttr] = '';
      }
      dataObj[objAttr] = `${dataObj[objAttr]} ${word}`.trim();
    }
  });

  return dataObj;
};

const getPageData = (page) => {
  const pageObj = {};

  page.items.forEach((item) => {
    const itemCoords = [...item.transform];
    // item position
    const itemPos = itemCoords.splice(4, 1);

    const lineId = JSON.stringify(itemCoords);

    if (!pageObj[lineId]) {
      pageObj[lineId] = {};
    }

    pageObj[lineId] = {
      ...pageObj[lineId],
      [itemPos]: item.str.replaceAll(' ', ''), // item string content
    };
  });

  return pageObj;
};

/**
 * TODO:
 *   - refactor this one. simplify complex logic
 */
const parseDataPerPage = (pageTextContent, options = {}) => {
  const { keywordsToSkip, startKeywords, endKeywords } = options;

  const pageData = getPageData(pageTextContent);
  const lines = Object.values(pageData);

  const data = [];

  // flag
  let extractData = false;

  for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
    /**
     * TODO
     *   - create parsing data per line function
     *   - create a common checker if should skip
     */
    const line = lines[lineNumber];
    const lineStr = Object.values(line)
      .filter((item) => item !== '')
      .join(' ');

    const upperLineStr = lineStr.toUpperCase();

    // checkers
    const startDataExtract = startKeywords.every((keyword) => {
      return upperLineStr.includes(keyword);
    });
    const endDataExtract = endKeywords.every((keyword) => {
      return upperLineStr.includes(keyword);
    });

    if (startDataExtract && !extractData) {
      extractData = true;
      continue;
    }

    if (endDataExtract && extractData) {
      extractData = false;
      continue;
    }

    // check if extractData flag is true
    if (!extractData) {
      continue;
    }

    // check for keywords to skip
    const skipLine = keywordsToSkip.every((keyword) =>
      upperLineStr.includes(keyword)
    );

    // if line contains keywords to skip, we'll skip
    if (skipLine) {
      continue;
    }

    // extracting of data per line
    const lineData = extractDataPerLine(line);
    data.push(lineData);
  }

  return data;
};

module.exports = async (fileBuffer, options = {}) => {
  // read pdf file content
  const data = new Uint8Array(fileBuffer);
  const loadingTask = pdfJsLib.getDocument(data);
  const pdfDocument = await loadingTask.promise;

  const numPages = pdfDocument.numPages;

  // object to return
  const parsedDataPerPage = {};

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDocument.getPage(pageNum);
    const pageTextContent = await page.getTextContent();

    const parsedData = parseDataPerPage(pageTextContent, options);

    parsedDataPerPage[pageNum] = parsedData;
  }

  return parsedDataPerPage;
};
