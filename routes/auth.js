const express = require("express"),
  router = express.Router(),
  bcrypt = require("bcryptjs"),
  jwt = require("jsonwebtoken"),
  validateRegisterInput = require("../validation/register"),
  validateLoginInput = require("../validation/login"),
  User = require("../models/User");
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
      const newUser = new User({
        email: req.body.email,
        password: req.body.password
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

    //Check password
    bcrypt.compare(userInput.password, user.password).then(isMatch => {
      if (isMatch) {
        //create user information object
        const payload = {
          email: user.email
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

module.exports = router;
