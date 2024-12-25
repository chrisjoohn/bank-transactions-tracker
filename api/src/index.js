const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// auth middleware
const { firebaseAuth } = require('./firebase');

const { loadRoutes } = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

// auth
app.use(firebaseAuth);

loadRoutes(app);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
