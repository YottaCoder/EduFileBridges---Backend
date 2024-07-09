import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'edufilebridge1@gmail.com',
    pass: 'lskz rraa nraf sneh',
  },
  tls: {
    rejectUnauthorized: false // This may be necessary if you encounter certificate issues
  }
});

const sendOTP = async (req, res) => {
  // const { email } = req.body;

  // if (!email) {
  //   console.log('No email provided');
  //   return res.status(400).json({ message: 'Email is required' });
  // }

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
  console.log('Generated OTP:', otp);

  const mailOptions = {
    from: 'edufilebridge1@gmail.com',
    to: 'solankirohit8703@gmail.com',
    subject: 'Your OTP Code',
    html: `<h1>Your OTP Code is ${otp}</h1>`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    res.status(200).json({ message: 'OTP sent', otp });
  } catch (err) {
    console.error('Error while sending email:', err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

export { sendOTP };
