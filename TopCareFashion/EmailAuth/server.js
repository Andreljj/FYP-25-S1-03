const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

// Add this after require('dotenv').config();
console.log('Email User:', process.env.EMAIL_USER);
console.log('Email Pass exists:', !!process.env.EMAIL_PASS);

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'login',
    user: 'topcarefashion03@gmail.com',
    pass: 'ihwh jbbs ufbt znom'
  },
  debug: true,
  logger: true
});

// Add this right after creating the transporter
console.log('Transporter configuration:', {
  host: transporter.options.host,
  port: transporter.options.port,
  auth: {
    user: transporter.options.auth.user,
    passExists: !!transporter.options.auth.pass
  }
});

// Add this to verify credentials
transporter.verify(function(error, success) {
  if (error) {
    console.log('SMTP Error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

// Add this before the POST endpoint
app.get('/api/reset-password', (req, res) => {
  res.json({ message: 'Reset password endpoint is working' });
});

app.post('/api/reset-password', async (req, res) => {
  const { email } = req.body;
  console.log('Received reset password request for:', email);
  
  try {
    const resetToken = Math.random().toString(36).substring(2, 15);
    console.log('Generated reset token:', resetToken);
    
    await transporter.sendMail({
      from: 'topcarefashion03@gmail.com',
      to: email,
      subject: 'TopCare Fashion - Password Reset Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0077b3;">Password Reset Code</h1>
          <p>Hello,</p>
          <p>We received a request to reset your password for your TopCare Fashion account.</p>
          <p>Here is your password reset code:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
              ${resetToken}
            </div>
          </div>
          <p>Enter this code in the app to reset your password.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>This code will expire in 1 hour for security reasons.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">TopCare Fashion Team</p>
        </div>
      `
    });

    console.log('Email sent successfully to:', email);
    res.json({ message: 'Reset email sent successfully' });
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ error: 'Failed to send reset email' });
  }
});

// Add this new endpoint
app.put('/api/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Here you would:
    // 1. Verify the token is valid and not expired
    // 2. Update the user's password in your database
    // 3. Invalidate the token

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(400).json({ error: 'Failed to reset password' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '172.20.10.3', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server accessible at http://172.20.10.3:${PORT}`);
});