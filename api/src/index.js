const express = require('express');
const bodyParser = require('body-parser');

// auth middleware
const { firebaseAuth } = require('./firebase');

const { loadRoutes } = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// auth
app.use(firebaseAuth);

loadRoutes(app);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
