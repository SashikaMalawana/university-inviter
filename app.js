const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('university');
});

app.post('/send', (req, res) => {
  const mailBody = `
    <p>You have a new university invitation</p>
    <h3>University Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>University: ${req.body.university}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  let mailOptions = {
    from: '"Nodemailer University" <mitsolutions@gmail.com>', // sender address
    to: req.body.email, // list of receivers
    subject: 'Node University Invitation', // Subject line
    text: 'Hello?', // plain text body
    html: mailBody // html body
  };

  let transporter = nodemailer.createTransport({
    host: 'mail.mitsolutions.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'mitsolutions@gmail.com', // generated ethereal user
      pass: 'its@mit$password'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);   
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    res.render('university', {msg:'Email has been sent'});
  });
});

app.listen(3000, () => console.log('Server started...'));
