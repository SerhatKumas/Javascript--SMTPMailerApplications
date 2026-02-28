const express = require('express'); // Web framework for Node.js to handle HTTP requests/routes
const nodemailer = require('nodemailer'); // Library to send emails via SMTP
const cors = require('cors'); // Enables Cross-Origin Resource Sharing (allows frontend to communicate with backend)
const path = require('path'); // Node.js built-in module for handling file/directory paths

const app = express(); // Creates an Express application instance
const PORT = process.env.PORT || 3000; // Uses environment variable if set, otherwise defaults to port 3000

// These are fundamental middlewares that most Express applications need to handle common web development scenarios
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public'))); // This tells my static file like HTML CSS and JS files are in public file

// Environment variables from .env file are injected into the code
const smtpConfig = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
};

// Create transport -> setting up email sending in a Node.js application using the Nodemailer library.
const transporter = nodemailer.createTransport(smtpConfig);

// Contact form endpoint
app.post('/send-email', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid email address' 
      });
    }

    // Email content
    const mailOptions = {
      from: email, // Client's Email
      to: process.env.CONTACT_EMAIL, // Your email
      replyTo: email, // You can can reply directly to sender
      subject: `Contact Form Message from ${name}`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; background-color: #f4f7f6; padding: 20px 0; margin: 0; width: 100%;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
            
            <!-- Header Section -->
            <div style="background-color: #4f46e5; padding: 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">New Inquiry Received</h1>
            </div>

            <!-- Content Body -->
            <div style="padding: 25px;">
              <p style="font-size: 16px; color: #333333; line-height: 1.6;">
                You have received a new submission from your website's contact form.
              </p>
              
              <!-- Sender Details Table -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 20px; margin-bottom: 20px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; background-color: #eff6ff; border-radius: 6px 6px 0 0;">
                    <p style="font-size: 14px; color: #1e40af; margin: 0; font-weight: 700;">SENDER DETAILS</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #e5e7eb; border-top: none;">
                    <p style="font-size: 14px; color: #555555; margin: 0;"><strong>Name:</strong> ${name}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #e5e7eb; border-top: none;">
                    <p style="font-size: 14px; color: #555555; margin: 0;"><strong>Subject:</strong> ${subject}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 6px 6px;">
                    <p style="font-size: 14px; color: #555555; margin: 0;">
                      <strong>Email:</strong> 
                      <a href="mailto:${email}" style="color: #4f46e5; text-decoration: none;">${email}</a>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Message Content Block -->
              <h4 style="color: #333333; margin-top: 25px; margin-bottom: 10px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">Message Content</h4>
              <div style="background-color: #f9fafb; border-left: 5px solid #4f46e5; padding: 15px; border-radius: 4px; font-size: 15px; color: #333333;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>

            <!-- Footer Section -->
            <div style="background-color: #f4f7f6; padding: 15px 25px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 11px; margin: 0;">
                This message was sent automatically from your website contact form.
              </p>
              <p style="color: #9ca3af; font-size: 11px; margin: 5px 0 0 0;">
                Received on: ${new Date().toLocaleString()}
              </p>
            </div>
            
          </div>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);
    
    console.log(`✅ Email sent from: ${email}`);
    
    res.json({ 
      success: true, 
      message: 'Message sent successfully! We will get back to you soon.' 
    });
    
  } catch (error) {
    console.error('❌ Email sending error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again or contact us directly.' 
    });
  }

});

// Serve HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'contact.html'));
});

// It starts the server and makes it accessible
app.listen(PORT, () => {
  console.log(`Server running successfully on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});