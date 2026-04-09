console.log("🔥 THIS IS THE ACTIVE ROUTES FILE");

const express = require('express');
const router = express.Router();

const controller = require('./controller');

router.get('/test', (req, res) => {
  console.log("🔥 TEST ROUTE HIT");
  res.send("Route working ✅");
});

router.post('/send-otp', controller.sendEmailOTP);
router.post('/verify-otp', controller.verifyOTP);

module.exports = router;