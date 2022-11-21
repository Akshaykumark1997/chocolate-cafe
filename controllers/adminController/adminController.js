const products = require('../../model/product');
const users = require('../../model/userSignUp');
const adminDetails ={
    email:"admin@gmail.com",
    password:"admin@123"
};

module.exports={
    getlogin:(req,res)=>{
        let session = req.session;
        if(session.adminId){
            res.redirect('/admin/adminhome');
        }else{
            res.render("admin/adminLogin");
        }
        
    },
    postLogin:(req,res)=>{
        if(req.body.email === adminDetails.email && req.body.password === adminDetails.password){
            req.session.adminId =req.body.email;
            console.log(req.session);
            res.redirect('/admin/adminhome');
        }else{
            res.render("admin/adminLogin", {
              err_message: "username or password incorrect",
            });
        }
    },
    gethome:(req,res)=>{
        let session = req.session
        if(session.adminId){
            res.render('admin/adminDashboard');
        }else{
            res.redirect('/admin');
        }
    },
    products:async(req,res)=>{
        if(req.session.adminId){
            const allproducts = await products.find();
            res.render('admin/productsDetails',{allproducts});
        }else{
            res.redirect('/admin');
        }
    },
    addProducts:(req,res)=>{
        if(req.session.adminId){
            res.render('admin/addproducts');
        }else{
            res.redirect('/admin');
        }
    },
    userDetails:async(req,res)=>{
        if(req.session.adminId){
            const allusers = await users.find();
            res.render('admin/userDetails',{allusers});
        }else{
            res.redirect('/admin');
        }
    }
}