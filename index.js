// dotenv
const dotenv = require('dotenv');
dotenv.config();

// modules/plugins
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

// initiliaze express app
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// email configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    // mail message
    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: process.env.SMTP_RMAIL,
        subject: 'New Contact Form Submission',
        html: `
      <p>Name: ${name}</p>
      <p>Email: ${email}</p>
      <p>Message: ${message}</p>
    `,
    };

    // send email
    if (name && email && message) {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                // console.error(error);
                res.status(500).send({ message: 'Error sending E-Mail', error: error });
            } else {
                // console.log('Email sent: ' + info.response);
                res.status(200).send({ message: 'Email sent successfully' });
            }
        });
    }
    else {
        res.status(500).send({ message: 'Error sending E-Mail' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});