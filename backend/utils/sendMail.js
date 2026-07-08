const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

    const msg = {
      from: process.env.SENDGRID_SENDER || process.env.EMAIL_USER,
      to,
      subject,
      text
    };

    const info = await sgMail.send(msg);

    console.log(`Email sent to ${to}`);
    return info;
  } catch (error) {
    console.error('Error sending email:', error.response ? error.response.body : error.message || error);
    throw error;
  }
};

module.exports = sendEmail;