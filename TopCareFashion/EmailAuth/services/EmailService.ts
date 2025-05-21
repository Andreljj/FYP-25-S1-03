import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD?.replace(/\s/g, ''), // Remove any spaces from the app password
  },
  tls: {
    rejectUnauthorized: false // Allow self-signed certificates
  }
});

export const sendPasswordResetEmail = async (email: string, resetToken: string) => {
  try {
    // Verify connection
    await transporter.verify();
    console.log('SMTP connection verified');

    // Use the correct frontend URL where your reset password page is hosted
    const resetLink = `https://topcare-fashion-backend.onrender.com/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"Top Care Fashion" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset - Top Care Fashion',
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" style="background-color: #0077b3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Email sending error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};