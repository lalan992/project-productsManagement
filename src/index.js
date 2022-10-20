const express = require("express");
const route = require("./route/route.js");
const mongoose = require("mongoose");
const multer = require("multer");

const app = express();

app.use(express.json());
app.use(multer().any());

mongoose
  .connect(
    "mongodb+srv://FunctionUp_Cohort:DBvLSBGGXkLLWXB5@cluster0.dgozj7b.mongodb.net/group51Database",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});
