const UserModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const validator = require("../validator/validators");
const userModel = require("../Models/userModel");
const { uploadFile } = require("../validator/linkGenerator");

const createUser = async function (req, res) {
  try {
    if (!validator.isValidRequestBody(req.body)) {
      return res.status(400).send({
        status: false,
        message: "Invalid request parameters. Please provide Book details",
      });
    }
    let mandetory = ["fname", "lname", "email", "password", "phone", "address"];
    const data = req.body;
    // console.log(data)
    let keys = Object.keys(req.body);
    let requireList = [];
    for (element of mandetory) {
      if (!keys.includes(element) && !data[element]) {
        requireList.push(element);
      }
    }
    if (requireList.length > 0) {
      return res.status(400).send({
        status: false,
        message: `These are mandetory field, please provide. => ${requireList}`,
      });
    }

    let { fname, lname, email, password, phone, address } = data;

    // Validation of fname
    if (!validator.isValidName(fname)) {
      return res.status(400).send({ status: false, msg: "Invalid fname" });
    }

    // Validation of lname
    if (!validator.isValidName(lname)) {
      return res.status(400).send({ status: false, msg: "Invalid lname" });
    }

    // Validation of email id
    if (!validator.isValidEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid email id" });
    }

    // Validation of password
    if (!validator.isValidPassword(password)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid password" });
    }

    // Validation of phone number
    if (!validator.isValidMobile(phone)) {
      return res
        .status(400)
        .send({ status: false, msg: "Invalid phone number" });
    }
    shippingAddress = address.shipping;
    billingAddress = address.billing;
    if (!validator.isValidAddress(shippingAddress)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid shipping address" });
    }
    if (!validator.isValidAddress(billingAddress)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid billing address" });
    }
    bcrypt.hash(password, 10, function (err, hash) {
      if (err) console.log(err.message);
      if (hash) data.password = hash;
    });
    let invalidEmail = await userModel.findOne({ email: email });
    if (invalidEmail) {
      return res.status(400).send({
        status: false,
        message: "Email already exists...",
      });
    }
    let invalidPhone = await userModel.findOne({ phone: phone });
    if (invalidPhone) {
      return res.status(400).send({
        status: false,
        message: "Phone already exists...",
      });
    }
    profileImage = req.files;
    if (profileImage && profileImage.length > 0) {
      //upload to s3 and get the uploaded link
      let uploadedFileURL = await uploadFile(profileImage[0]);
      data.profileImage = uploadedFileURL;
    }
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

const login = async function (req, res) {
  try {
    const data = req.body;
    if (Object.keys(data).length <= 0) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Plz Enter Email & Password In Body ",
        });
    }

    const email = req.body.email;
    if (!email) {
      return res
        .status(400)
        .send({ status: false, message: "Plz Enter Email In Body " });
    }
    const findData = await UserModel.findOne({ email }).select({
      email: 1,
      password: 1,
    });
    if (!findData) {
      return res
        .status(400)
        .send({ status: false, message: "Plz Enter Valid Email-Id " });
    }

    const password = req.body.password;
    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "Plz Enter Password In Body " });
    }

    res.status(200).send({
      status: true,
      message: "User login successfull",
      data: { userId: userId },
    });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

//==========================Get User Api (user/:userId/profile)=======================================

const getUser = async (req, res) => {
  try {
    let userId = req.params.userId;
    let tokenId = req.userId;

    if (!validator.isValid(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "Please Provide User Id" });
    }

    if (!validator.isValidObjectId(userId)) {
      return res.status(400).send({ status: false, message: "invalid userId" });
    }

    let checkData = await UserModel.findOne({ _id: userId });

    if (!checkData) {
      return res.status(404).send({ status: false, message: "User not Found" });
    }

    return res
      .status(200)
      .send({ status: true, message: "Success", data: checkData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//=========================Update User Api (user/:userId/profile)===================================

const update = async function (req, res) {
  try {
    // Validate body
    const body = req.body;
    // const reqBody = JSON.parse(req.body.data)
    if (!validator.isValidBody(body)) {
      return res
        .status(400)
        .send({ status: false, msg: "Details must be present to update" });
    }

    // Validate params
    userId = req.params.userId;
    if (!validator.isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, msg: `${userId} is invalid` });
    }

    const userFound = await UserModel.findOne({ _id: userId });
    if (!userFound) {
      return res
        .status(404)
        .send({ status: false, msg: "User does not exist" });
    }

    // Destructuring
    let { fname, lname, email, phone, password, address } = body;

    let updatedData = {};
    if (validator.isValid(fname)) {
      if (!validator.isValidName(fname)) {
        return res.status(400).send({ status: false, msg: "Invalid fname" });
      }
      updatedData["fname"] = fname;
    }
    if (validator.isValid(lname)) {
      if (!validator.isValidName(lname)) {
        return res.status(400).send({ status: false, msg: "Invalid lname" });
      }
      updatedData["lname"] = lname;
    }

    // Updating of email
    if (validator.isValid(email)) {
      if (!validator.isValidEmail(email)) {
        return res.status(400).send({ status: false, msg: "Invalid email id" });
      }

      updatedData["email"] = email;
    }

    // Updating of phone
    if (validator.isValid(phone)) {
      if (!validator.isValidNumber(phone)) {
        return res
          .status(400)
          .send({ status: false, msg: "Invalid phone number" });
      }

      updatedData["phone"] = phone;
    }

    // Updating of password
    if (password) {
      if (!validator.isValid(password)) {
        return res
          .status(400)
          .send({ status: false, message: "password is required" });
      }
      if (!validator.isValidPassword(password)) {
        return res
          .status(400)
          .send({
            status: false,
            message: "Password should be Valid min 8 character and max 15 ",
          });
      }
      // const encrypt = await
      // updatedData['password'] = encrypt
    }

    // Updating address
    if (address) {
      address = JSON.parse(address);
      if (address.shipping) {
        if (address.shipping.street) {
          if (!validator.isValid(address.shipping.street)) {
            return res
              .status(400)
              .send({ status: false, message: "Please provide street" });
          }
          updatedData["address.shipping.street"] = address.shipping.street;
        }
        if (address.shipping.city) {
          if (!validator.isValid(address.shipping.city)) {
            return res
              .status(400)
              .send({ status: false, message: "Please provide city" });
          }
          updatedData["address.shipping.city"] = address.shipping.city;
        }
        if (address.shipping.pincode) {
          if (typeof address.shipping.pincode !== "number") {
            return res
              .status(400)
              .send({ status: false, message: "Please provide pincode" });
          }
          // Validate shipping pincode
          if (!validator.isValidPincode(address.shipping.pincode)) {
            return res
              .status(400)
              .send({ status: false, msg: "Invalid Shipping pincode" });
          }
          updatedData["address.shipping.pincode"] = address.shipping.pincode;
        }
      }
      if (address.billing) {
        if (address.billing.street) {
          if (!validator.isValid(address.billing.street)) {
            return res
              .status(400)
              .send({ status: false, message: "Please provide street" });
          }
          updatedData["address.billing.street"] = address.billing.street;
        }
        if (address.billing.city) {
          if (!validator.isValid(address.billing.city)) {
            return res
              .status(400)
              .send({ status: false, message: "Please provide city" });
          }
          updatedData["address.billing.city"] = address.billing.city;
        }
        if (address.billing.pincode) {
          if (typeof address.billing.pincode !== "number") {
            return res
              .status(400)
              .send({ status: false, message: "Please provide pincode" });
          }
          // Validate billing pincode
          if (!validator.isValidPincode(address.billing.pincode)) {
            return res
              .status(400)
              .send({ status: false, msg: "Invalid billing pincode" });
          }
          updatedData["address.billing.pincode"] = address.billing.pincode;
        }
      }
    }

    //body.address = JSON.parse(body.address)
    const updated = await UserModel.findOneAndUpdate(
      { _id: userId },
      updatedData,
      { new: true }
    );
    return res.status(200).send({ status: true, data: updated });
  } catch (err) {
    res.status(500).send({ msg: "Error", error: err.message });
  }
};

module.exports = { createUser, getUser, update, login };
