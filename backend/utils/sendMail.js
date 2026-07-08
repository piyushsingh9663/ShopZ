const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    let to;
    let subject = '';
    let text = '';

    // Support calling with a single options object: { email, subject, message }
    if (typeof options === 'object' && options !== null) {
      const opts = options;
      to = opts.email || opts.to;
      subject = opts.subject || opts.title || '';
      text = opts.message || opts.text || opts.body || '';
    }

    if (!to) {
      throw new Error('No recipient specified for email');
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      family: 4, // Use IPv4
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });

    console.log(`Email sent to ${to} (messageId=${info && info.messageId})`);
    return info;
  } catch (error) {
    console.error('Error sending email:', error.message || error);
    throw error;
  }
};

module.exports = sendEmail ;