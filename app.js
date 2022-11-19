const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
// const adminRouter = require('./routes/admin');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/image", express.static(path.join(__dirname + "public/user/image")));
app.set("view engine", "ejs");
mongoose
  .connect("mongodb://localhost:27017/Chocolate_Cafe", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database connected successfully");
    app.listen(8000, () => {
      console.log("server started listening to port 8000");
    });
  })
  .catch((err) => console.log("error" + err));

app.set("views", "./views");
// app.use('/admin',adminRouter);
app.use("/", userRouter);
