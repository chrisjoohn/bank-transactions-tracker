const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
