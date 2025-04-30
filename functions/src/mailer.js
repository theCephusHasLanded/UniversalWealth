const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Create a transporter using Mailtrap credentials
const transporter = nodemailer.createTransport({
  host: functions.config().mailtrap.host,
  port: functions.config().mailtrap.port,
  auth: {
    user: functions.config().mailtrap.user,
    pass: functions.config().mailtrap.pass,
  },
});

// Function to send waitlist confirmation emails
exports.sendWaitlistConfirmation = functions.https.onCall(async (data, context) => {
  const { email, name } = data;
  
  if (!email) {
    throw new functions.https.HttpsError('invalid-argument', 'Email is required');
  }
  
  const mailOptions = {
    from: '"LKHN Universal Wealth" <notifications@universalwealth.com>',
    to: email,
    subject: 'Welcome to the LKHN Universal Wealth Waitlist!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://universalwealth.vercel.app/images/logo.svg" alt="LKHN Universal Wealth" style="width: 120px;">
        </div>
        
        <h2 style="color: #C9A861; margin-bottom: 20px;">Welcome to the Exclusive Waitlist!</h2>
        
        <p>Hello ${name || 'there'},</p>
        
        <p>Thank you for joining the LKHN Universal Wealth waitlist. We're thrilled to have you as part of our growing community of forward-thinking individuals.</p>
        
        <p>As a waitlist member, you'll be among the first to:</p>
        
        <ul>
          <li>Receive early access to our platform features</li>
          <li>Get exclusive offers and opportunities</li>
          <li>Be invited to special events and webinars</li>
        </ul>
        
        <p>We're working hard to create a revolutionary wealth building platform that serves everyone, and we can't wait to share it with you.</p>
        
        <p>Stay tuned for updates!</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777;">
          <p>LKHN Universal Wealth</p>
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    `,
  };
  
  // Also send a notification to the admin
  const adminNotification = {
    from: '"LKHN Waitlist System" <notifications@universalwealth.com>',
    to: 'christinacephus@pursuit.org',
    subject: 'New Waitlist Signup',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h3>New Waitlist Signup</h3>
        <p><strong>Name:</strong> ${name || 'Not provided'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      </div>
    `,
  };
  
  try {
    // Send email to user
    await transporter.sendMail(mailOptions);
    
    // Send notification to admin
    await transporter.sendMail(adminNotification);
    
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new functions.https.HttpsError('internal', 'Error sending email');
  }
});

// Function to send feedback emails
exports.sendFeedback = functions.https.onCall(async (data, context) => {
  const { message, rating, email } = data;
  
  if (!message) {
    throw new functions.https.HttpsError('invalid-argument', 'Message is required');
  }
  
  const mailOptions = {
    from: '"LKHN Feedback System" <feedback@universalwealth.com>',
    to: 'christinacephus@pursuit.org',
    subject: `New Feedback (Rating: ${rating || 'N/A'})`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h3>New Feedback Submission</h3>
        <p><strong>Rating:</strong> ${rating || 'Not provided'}</p>
        <p><strong>Email:</strong> ${email || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <div style="padding: 15px; background: #f7f7f7; border-left: 4px solid #C9A861; margin-top: 10px;">
          ${message}
        </div>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      </div>
    `,
  };
  
  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending feedback email:', error);
    throw new functions.https.HttpsError('internal', 'Error sending feedback');
  }
});