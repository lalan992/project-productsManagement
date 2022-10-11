const productModel = require("../models/productModel");
const { uploadFile } = require("../validator/linkGenerator");
const validator = require("../validator/validators");

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
    ];
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

    const {
      title,
      description,
      price,
      currencyId,
      currencyFormat,
      availableSizes,
      style,
    } = data;
    productImage=req.files
    if (productImage && productImage.length > 0) {
      //upload to s3 and get the uploaded link
      let uploadedFileURL = await uploadFile(productImage[0]);
      data.productImage = uploadedFileURL;
    }
    if (!validator.isValid(title)) {
      return res.status(400).send({
        status: false,
        message: "Title must be strings.",
      });
    }
    const validTitle = await productModel.findOne({ title: title });
    if (validTitle) {
      return res.status(400).send({
        status: false,
        message: "Title already exists...",
      });
    }
    if (!validator.isValid(description)) {
      return res.status(400).send({
        status: false,
        message: "Description must be strings.",
      });
    }

    if (!["INR", "USD", "EURO", "GBP"].includes(currencyId)) {
      return res.status(400).send({
        status: false,
        message: 'CurrencyId must be among these ["INR","USD","EURO","GBP"] .',
      });
    }
    if (!["₹", "$", "€", "£"].includes(currencyFormat)) {
      return res.status(400).send({
        status: false,
        message: 'currencyFormat must be among these ["₹","$","€","£"] .',
      });
    }
    const currency = {
      INR: "₹",
      USD: "$",
      EURO: "€",
      GBP: "£",
    };
    if (currency[currencyId] !== currencyFormat) {
      return res.status(400).send({
        status: false,
        message: "currencyFormat and currencyId are not matching.",
      });
    }
    console.log(JSON.parse(availableSizes));
    if (availableSizes && !validator.isStringsArray(availableSizes)) {
      return res.status(400).send({
        status: false,
        message:
          "availableSizes must be among these [S, XS, M, X, L, XXL, XL] only.",
      });
    }

    if (style && !validator.isValid(data.style)) {
      return res.status(400).send({
        status: false,
        message: "Style must be string .",
      });
    }
    // const createdProduct = await productModel.create(data);
    return res.status(201).send({
      status: true,
      message: "Product created Successfully.",
      data: createdProduct,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
module.exports = { createProduct };
