const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");
const productController = require("../controllers/productControllers");
const cartController = require("../controllers/cartControllers");
const orderController = require("../controllers/orderCotrollers");
const auth = require("../middlewares/auth");

//user Apis
router.post("/register", userController.createUser);
router.post("/login", userController.login);
router.get(
  "/user/:userId/profile",
  auth.Authentication,
  auth.Authorisation,
  userController.getUser
);
router.put(
  "/user/:userId/profile",
  auth.Authentication,
  auth.Authorisation,
  userController.update
);

//product Apis
router.post("/products", productController.createProduct);
router.get("/products", productController.getByQuery);
router.get("/products/:productId", productController.getById);
router.put("/products/:productId", productController.updateProduct);
router.delete("/products/:productId", productController.deleteById);
//cart Apis

//order Apis

router.all("/*", function (req, res) {
  res.status(400).send("Invalid request....!!!");
});

module.exports = router;
