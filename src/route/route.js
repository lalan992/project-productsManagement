const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");
const productController = require("../controllers/productControllers");
const cartController = require("../controllers/cartControllers");
const orderController = require("../controllers/orderCotrollers");

//user Apis
router.post("/register");
router.post("/login");
router.get("/user/:userId/profile");
router.put("/user/:userId/profile");

//product Apis
router.post("/products", productController.createProduct);
//cart Apis

//order Apis

router.all("/*", function (req, res) {
  res.status(400).send("Invalid request....!!!");
});

module.exports = router;
