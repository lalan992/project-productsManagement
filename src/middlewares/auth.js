const jwt = require("jsonwebtoken");
const userModel = require("../Models/userModel");
const validator = require("../validator/validators");

const Authentication = async function (req, res, next) {
  try {
    let token = req.headers["authorization"].split(" ")[1];
    if (!token) {
      return res.send({ status: false, message: "Enter token in the headers" });
    }
    jwt.verify(token, "secretkey", function (err, decodedToken) {
      if (err) {
        return res.status(401).send({ status: false, message: err.message });
      } else {
        req["x-api-key"] = decodedToken;
        next();
      }
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const Authorisation = async function (req, res, next) {
  try {
    let decodedToken = req["x-api-key"];
    //blog id validation

    let userId = req.params.userId;
    if (!validator.isValidObjectId(userId)) {
      return res
        .status(403)
        .send({ status: false, message: " invalid userId.." });
    }
    let validUser = await userModel.findOne({ _id: userId });

    if (!validUser)
      return res
        .status(404)
        .send({ status: false, message: "Requested user not found.." });
    if (decodedToken.userId !== validUser._id.toString()) {
      return res
        .status(403)
        .send({ status: false, message: " Not authorised .." });
    } else {
      next();
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
  Authentication,
  Authorisation,
};
