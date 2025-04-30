const functions = require('firebase-functions');
const admin = require('firebase-admin');
const mailer = require('./src/mailer');

admin.initializeApp();

// Export email functions
exports.sendWaitlistConfirmation = mailer.sendWaitlistConfirmation;
exports.sendFeedback = mailer.sendFeedback;
EOF < /dev/null