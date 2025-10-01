const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'malekiabolfazl20@gmail.com',
    pass: 'zhgg kmto ldsr vcuc',
  },
});

async function testEmail() {
  try {
    const info = await transporter.sendMail({
      from: '"Test" <your.email@gmail.com>',
      to: 'your.email@gmail.com',
      subject: 'Test Email from NestJS',
      text: 'This is a test email from your NestJS application!',
    });

    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

testEmail();