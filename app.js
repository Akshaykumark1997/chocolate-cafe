const express = require('express');
const path = require('path');
const userRouter =require('./routes/user');
// const adminRouter = require('./routes/admin');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/image", express.static(path.join(__dirname + "public/image")));
app.set("view engine", "ejs");
app.listen(8000,()=>{
    console.log('server started listening to port 8000');
});
app.set("views", "./views");
// app.use('/admin',adminRouter);
app.use('/',userRouter);

