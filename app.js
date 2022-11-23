const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const adminRouter = require('./routes/admin');
const sessions = require("express-session");
const cookieParser = require("cookie-parser");
const fileUpload = require('express-fileupload');

const app = express();
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/image", express.static(path.join(__dirname + "public/user/image")));
app.use("/products", express.static(path.join(__dirname + "public/admin/products")));
app.set("view engine", "ejs");


app.use(cookieParser());
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

app.use(
  sessions({
    secret: "123",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 3000000 },
  })
);
app.use((req, res, next) => {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});
 app.use('/admin',adminRouter);
app.use("/", userRouter);


