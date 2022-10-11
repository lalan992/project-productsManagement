const productModel = require("../models/productModel");
const { uploadFile } = require("../validator/linkGenerator");

const createProduct = async function (req, res) {
  try {
    if (!validator.isValidRequestBody(req.body)) {
      return res.status(400).send({
        status: false,
        message: "Invalid request parameters. Please provide Book details",
      });
    }
    let mandetory = [
      "title",
      "description",
      "price",
      "currencyId",
      "currencyFormat",
      "productImage",
    ];
    let keys = Object.keys(req.body);
    let requireList = [];
    for (element of mandetory) {
      if (!keys.includes(element)) {
        requireList.push(element);
      }
    }
    if (requireList.length >= 0) {
      return res.status(400).send({
        status: false,
        message: `These are mandetory field please provide.${requireList}`,
      });
    }
    if (productImage && productImage.length > 0) {
      //upload to s3 and get the uploaded link
      // res.send the link back to frontend/postman
      let uploadedFileURL = await uploadFile(files[0]);
      res.status(201).send({
        status: true,
        message: "file uploaded succesfully",
        data: uploadedFileURL,
      });
    } else {
      res.status(400).send({ status: false, message: "No file found" });
    }
  } catch (err) {
    res.status(500).send({ msg: err });
  }
};
