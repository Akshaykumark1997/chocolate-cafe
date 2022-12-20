const express = require("express");
const path = require("path");
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const sessions = require("express-session");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const dbconnect = require("./config/connection");

dotenv.config();
const app = express();
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/image", express.static(path.join(__dirname + "public/user/image")));
app.use(
  "/products",
  express.static(path.join(__dirname + "public/admin/products"))
);
app.set("view engine", "ejs");

app.use(cookieParser());
dbconnect.dbconnect();
app.listen(process.env.PORTNO, '127.0.0.1', () => {
  console.log("server started listening to port");
});
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
app.use("/admin", adminRouter);
app.use("/", userRouter);
app.use((req,res)=>{
  res.render('user/error');
})