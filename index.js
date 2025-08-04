const express = require("express");
const bodyParser = require("body-parser");
const nodemailer =
  process.env.NODE_ENV === "test"
    ? require("nodemailer-mock")
    : require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({ credentials: true, origin: "https://bobai.netlify.app" }));

const PORT = process.env.PORT || 6001;

let transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  })
);

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Mail Is Ready");
    console.log(success);
  }
});

app.get("/", (req, res) => {
  res.status(200).json({
    status: "SEE MUMU",
    message: "Wetin you dey look for?",
  });
});

app.post("/bobai/sendmail", async (req, res) => {
  try {
    let { name, email, subject, message } = req.body;
    email = email.trim();
    name = name.trim();

    let mailOptions = {
      from: "Mr Bobai <joelisaiahbobai@gmail.com>",
      to: ["joelisaiahbobai@gmail.com", "joelbobai43@gmail.com"],
      subject: `Message from ${
        name[0].toUpperCase() + name.slice(1)
      } : ${subject}`,
      html: `<!DOCTYPE html>
      <html>
      <head>
        <title>Email Template</title>
        <style>
          /* CSS styling for the email template */
          body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
            margin: 0;
            padding: 0;
          }
      
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #e8e8e8;
            border-radius: 5px;
            overflow: hidden;
          }
      
          .header {
            background-color: #007bff;
            color: #fff;
            padding: 20px;
          }
      
          .content {
            padding: 20px;
          }
      
          .form-group {
            margin-bottom: 20px;
          }
      
          .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #333;
          }
      
          .form-group p {
            margin: 0;
            font-weight: normal;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Joel Isaiah Bobai</h1>
          </div>
          <div class="content">
            <div class="form-group">
              <label for="name">Name:</label>
              <p>${name[0].toUpperCase() + name.slice(1)}</p>
            </div>
      
            <div class="form-group">
              <label for="email">Email:</label>
              <p>${email}</p>
            </div>
      
            <div class="form-group">
              <label for="subject">Subject:</label>
              <p>${subject}</p>
            </div>
      
            <div class="form-group">
              <label for="message">Message:</label>
              <p>${message}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
      `,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      status: "Message Sent",
      message: "Thanks for your message! I'll get back to you within 24 hours",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "FAILED",
      message: "An error occurred. Check your network and try again",
      error: error,
    });
  }
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
}

module.exports = app;
