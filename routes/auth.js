const express = require("express"),
  router = express.Router(),
  bcrypt = require("bcryptjs"),
  jwt = require("jsonwebtoken"),
  validateRegisterInput = require("../validation/register"),
  validateLoginInput = require("../validation/login"),
  validatePasswordInput = require("../validation/changePassword"),
  nodemailer = require("nodemailer"),
  User = require("../models/User"),
  { totp } = require("node-otp");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "andregoh1996@gmail.com",
    pass: "chaostar123"
  }
});
//Register Route
router.post("/register", (req, res) => {
  //validate userinput and get errors if any
  const { errors, isValid } = validateRegisterInput(req.body);

  //if invalid, return with error 400 and error messages
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" }); //check DB for existing email and return error message if exists
    } else {
      //send verification email
      const payload = {
        email: req.body.email
      };

      let verificationToken = jwt.sign(payload, "secret", { expiresIn: 30000 });
      const textToSend = `<h3>Thanks for registering with us.</h3><h5>Please click on the following link to verify your account: </h5><p>http://localhost:5000/api/verification?token=${verificationToken}&email=${
        req.body.email
      }</p>`;
      const mailOptions = {
        from: "andregoh1996@gmail.com",
        to: req.body.email,
        subject: "Verify Your Account",
        html: textToSend
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.log(err);
        else console.log("sent");
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        verToken: verificationToken,
        isVerified: false
      });

      //hash password before saving user in DB
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;

          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

router.post("/login", (req, res) => {
  //validate userinput and get errors if any
  const { errors, isValid } = validateLoginInput(req.body);

  //if invalid, return with error 400 and error messages
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const userInput = {
    email: req.body.email,
    password: req.body.password
  };

  User.findOne({ email: userInput.email }).then(user => {
    //check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    console.log(user.name);
    //Check password
    bcrypt.compare(userInput.password, user.password).then(isMatch => {
      if (isMatch) {
        //create user information object
        const payload = {
          user: {
            name: user.name,
            email: user.email
          }
        };
        //create and sign JSON Web Token
        jwt.sign(payload, "secret", { expiresIn: 300000 }, (err, token) => {
          res.json({ success: true, token });
        });
      } else {
        return res
          .status(400)
          .json({ passwordIncorrect: "Password is incorrect" });
      }
    });
  });
});

router.get("/verification", (req, res) => {
  console.log(req.query.email);
  User.findOne({ email: req.query.email }).then(user => {
    console.log(user);
    if (user.verToken == req.query.token) {
      user.isVerified = true;
      user.save().then(user => res.send("verified!"));
    }
  });
});

router.get("/forget", (req, res) => {
  const email = req.query.email;

  let forgetOtp = totp({ secret: email, time: Date.now() });

  const textToSend = `<h3>To change your password, please provide the following OTP on the webpage: <h1>${forgetOtp}</h1></h3><h5>Please click on the following link to change your password: </h5><p>http://localhost:3000/change-password</p>`;
  const mailOptions = {
    from: "andregoh1996@gmail.com",
    to: email,
    subject: "Change your account password",
    html: textToSend
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log(err);
    else console.log("sent");
  });

  User.findOne({ email }).then(user => {
    user.resetToken = forgetOtp;
    user.save().then(res.json({ success: "success!", otp: forgetOtp }));
  });
});

router.post("/change-password", (req, res) => {
  //validate userinput and get errors if any
  const { errors, isValid } = validatePasswordInput(req.body);

  //if invalid, return with error 400 and error messages
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (!user) {
      return res.status(400).json({ email: "User does not exists!" }); //check DB for existing email and return error message if exists
    } else {
      if (user.resetToken == req.body.otp) {
        //hash password before saving user in DB
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) throw err;

            user.password = hash;
            user
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    }
  });
});
module.exports = router;
