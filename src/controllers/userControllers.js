// const UserModel = require("../Models/userModel");
// const bcrypt = require("bcrypt");
// const validator = require("../validator/validators");
// const userModel = require("../Models/userModel");
// const { uploadFile } = require("../validator/linkGenerator");

// const createUser = async function (req, res) {
//   try {
//     if (!validator.isValidRequestBody(req.body)) {
//       return res.status(400).send({
//         status: false,
//         message: "Invalid request parameters. Please provide Book details",
//       });
//     }
//     let mandetory = ["fname", "lname", "email", "password", "phone", "address"];
//     const data = req.body;
//     // console.log(data)
//     let keys = Object.keys(req.body);
//     let requireList = [];
//     for (element of mandetory) {
//       if (!keys.includes(element) && !data[element]) {
//         requireList.push(element);
//       }
//     }
//     if (requireList.length > 0) {
//       return res.status(400).send({
//         status: false,
//         message: `These are mandetory field, please provide. => ${requireList}`,
//       });
//     }

//     let { fname, lname, email, password, phone, address } = data;

//     // Validation of fname
//     if (!validator.isValidName(fname)) {
//       return res.status(400).send({ status: false, msg: "Invalid fname" });
//     }

//     // Validation of lname
//     if (!validator.isValidName(lname)) {
//       return res.status(400).send({ status: false, msg: "Invalid lname" });
//     }

//     // Validation of email id
//     if (!validator.isValidEmail(email)) {
//       return res
//         .status(400)
//         .send({ status: false, message: "Invalid email id" });
//     }

//     // Validation of password
//     if (!validator.isValidPassword(password)) {
//       return res
//         .status(400)
//         .send({ status: false, message: "Invalid password" });
//     }

//     // Validation of phone number
//     if (!validator.isValidMobile(phone)) {
//       return res
//         .status(400)
//         .send({ status: false, msg: "Invalid phone number" });
//     }
//     shippingAddress = address.shipping;
//     billingAddress = address.billing;
//     if (!validator.isValidAddress(shippingAddress)) {
//       return res
//         .status(400)
//         .send({ status: false, message: "Invalid shipping address" });
//     }
//     if (!validator.isValidAddress(billingAddress)) {
//       return res
//         .status(400)
//         .send({ status: false, message: "Invalid billing address" });
//     }
//     bcrypt.hash(password, 10, function (err, hash) {
//       if (err) console.log(err.message);
//       if (hash) data.password = hash;
//     });
//     let invalidEmail = await userModel.findOne({ email: email });
//     if (invalidEmail) {
//       return res.status(400).send({
//         status: false,
//         message: "Email already exists...",
//       });
//     }
//     let invalidPhone = await userModel.findOne({ phone: phone });
//     if (invalidPhone) {
//       return res.status(400).send({
//         status: false,
//         message: "Phone already exists...",
//       });
//     }
//     profileImage = req.files;
//     if (profileImage && profileImage.length > 0) {
//       //upload to s3 and get the uploaded link
//       let uploadedFileURL = await uploadFile(profileImage[0]);
//       data.profileImage = uploadedFileURL;
//     }
//   } catch (err) {
//     res.status(500).send({ status: false, msg: err.message });
//   }
// };
