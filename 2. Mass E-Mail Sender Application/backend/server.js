import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Set up Multer for form data processing (memory storage for simple attachments)
const upload = multer({ storage: multer.memoryStorage() });

// Validation helper
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    );
};

// Cache transporters to reuse connections
const transportersMap = new Map();

// Available sender accounts configuration
const getTransporter = (senderEmail) => {
  const allowedEmails = [
    'email1@example.com',
    'email2@example.com',
    'email3@example.com'
  ];

  if (!allowedEmails.includes(senderEmail)) {
    throw new Error('Invalid sender email. Must be one of: ' + allowedEmails.join(', '));
  }

  // Return cached transporter if it exists
  if (transportersMap.has(senderEmail)) {
    return transportersMap.get(senderEmail);
  }

  // Choose environment variable based on sender
  let pass;
  if (senderEmail === 'email1@example.com') pass = process.env.EMAIL_1_PASS;
  else if (senderEmail === 'email2@example.com') pass = process.env.EMAIL_2_PASS;
  else if (senderEmail === 'email3@example.com') pass = process.env.EMAIL_3_PASS;

  if (!pass) {
    throw new Error(`Password not configured for ${senderEmail}`);
  }

  const transporter = nodemailer.createTransport({
    pool: true, // Use a pool of connections instead of creating a new connection for every email
    maxConnections: 5, // Maximum number of connections to keep open
    maxMessages: 100, // Maximum number of messages to send per connection
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: senderEmail,
      pass: pass
    }
  });

  transportersMap.set(senderEmail, transporter);

  return transporter;
};

app.post('/api/send', upload.array('attachments'), async (req, res) => {
  try {
    const { sender, recipients, subject, body } = req.body;

    if (!sender || !recipients || !subject || !body) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Parse recipients (comma separated, newline separated, space separated, semicolon separated, or JSON array)
    let recipientList = [];
    if (typeof recipients === 'string') {
      // Split by commas, newlines, spaces, or semicolons
      recipientList = recipients.split(/[\n,\s;]+/).map(r => r.trim()).filter(r => r !== '');
    } else if (Array.isArray(recipients)) {
      recipientList = recipients;
    }

    const validRecipients = recipientList.filter(validateEmail);
    if (validRecipients.length === 0) {
      return res.status(400).json({ success: false, error: 'No valid recipient emails provided' });
    }

    // Format attachments for Nodemailer
    const attachments = req.files ? req.files.map(file => ({
      filename: file.originalname,
      content: file.buffer,
      contentType: file.mimetype
    })) : [];

    // Get the appropriate transporter based on sender selection
    const transporter = getTransporter(sender);

    // Verify connection configuration
    await transporter.verify();

    // Send the email (We can send one email to multiple BCC or send individual emails)
    // Sending individuals is usually better for mass emails to avoid showing other recipients

    // For large lists, consider batching or sending via BCC instead of looping to prevent timeouts.
    // Given the request for mass emails, we'll send it as BCC to not expose emails, 
    // or we can send individually. User asked for a "simple UI for mass emails".
    // Sending individually is nicer for the recipient.
    let successCount = 0;
    let successfulEmails = [];
    let errors = [];

    // If there are many recipients, we'll send individually in a Promise.all or sequentially
    // But since it's a simple local app, we'll do sequentially to avoid hitting rate limits too hard simultaneously.
    for (const email of validRecipients) {
      try {
        await transporter.sendMail({
          from: `"App Name" <${sender}>`,
          to: email,
          subject: subject,
          html: body, // Assume HTML body
          text: body.replace(/<[^>]*>?/gm, ''), // Plain text fallback
          attachments: attachments
        });
        successCount++;
        successfulEmails.push(email);
      } catch (err) {
        errors.push({ email, error: err.message });
      }
    }

    if (successCount === 0) {
      return res.status(500).json({
        success: false,
        error: 'Failed to send to all recipients.',
        details: errors
      });
    }

    res.status(200).json({
      success: true,
      message: `Successfully sent to ${successCount} recipients.`,
      sentEmails: successfulEmails,
      failed: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Email Sender Backend running on port ${port}`);
});
