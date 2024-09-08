var admin = require('firebase-admin');

var serviceAccount = require('../../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// middleware for authentication
exports.firebaseAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.sendStatus(401);
      return;
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;

    next();
  } catch (err) {
    res.sendStatus(401);
  }
};
