import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { sendPasswordResetEmail } from '../services/emailService';

const router = Router();

router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Generate reset token
    const resetToken = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send reset email
    await sendPasswordResetEmail(email, resetToken);

    res.json({ message: 'Reset instructions sent successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Failed to send reset instructions' });
  }
});

export default router;