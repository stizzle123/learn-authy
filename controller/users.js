const User = require("../model/User");
const bcrypt = require("bcryptjs");
const authy = require("authy")(process.env.AUTHY_API);

exports.register = async (req, res) => {
  const data = { ...req.body };

  try {
    const existedUser = await User.findOne({ username: data.username });
    if (existedUser) {
      res.status(409).json(`User already registered`);
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(data.password, salt);

    const user = await new User({
      email: data.email,
      password: hash,
      phone: data.phone,
      username: data.username,
      countryCode: data.countryCode
    });

    user.save((err, doc) => {
      if (err) throw err;
      authy.register_user(
        doc.email,
        doc.phone,
        doc.countryCode,
        (err, response) => {
          if (err) throw err;

          user.authyId = response.user.id;
          user.save((err, doc) => {
            if (err) throw err;
            // authy.request_sms(doc.authyId, true, result => {
            //   res.status(200).json({ result, id: doc._id });
            // });
            res.status(200).json(doc._id);
          });
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

exports.verify = async (req, res) => {
  const id = req.params.id;
  const token = req.body.token;
  try {
    const user = await User.findById({ _id: id });

    await authy.verify(user.authyId, token, true, (err, result) => {
      if (err) {
        res.status(500).json({ message: err.errors.message });
        return;
      }
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

exports.getHome = (req, res) => {
  res.send("Hello...");
};
