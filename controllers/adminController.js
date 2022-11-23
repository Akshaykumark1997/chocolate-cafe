const products = require('../model/product');
const user = require('../model/userSignUp');
const path = require("path");

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
    getLogout:(req,res)=>{
        req.session.destroy();
        res.redirect('/admin');
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
    postProducts:async(req,res)=>{
        const image = req.files.image;
        console.log(image);
        const newProduct = new products ({
            product : req.body.product,
            price : req.body.price,
            category : req.body.category,
            description : req.body.description,
            stock : req.body.stock
        })
        const productData = await newProduct.save();
        if(productData){
            console.log(productData._id);
            let imagename = productData._id;
            image.mv(path.join(__dirname, '../public/admin/products/')+imagename+'.jpg',(err)=>{
                if(!err){
                    res.redirect("/admin/products");
                }else{
                    console.log(err);
                }
            });
            
        }else{
            console.error();
        } 
    },
    editProduct:async(req,res)=>{
        const id = req.params.id;
        const productData = await products.findOne({_id:id});
        if(productData){
            res.render('admin/editProduct',{productData});
        }else{
            res.redirect('/admin/products');
        }
        
    },
    postEditProduct:async(req,res)=>{
        const id = req.params.id;
        await products.updateOne({_id:id},{$set:{
            product:req.body.product,
            price:req.body.price,
            category:req.body.category,
            description:req.body.description,
            stock:req.body.stock
        }}); 
            if (req?.files?.image) {
              const image = req.files.image;
              image.mv(
                path.join(__dirname, "../public/admin/products/") + id + ".jpg"
              );
              res.redirect("/admin/products");
            }else{
                res.redirect("/admin/products"); 
            }
    },
    deleteProduct:async(req,res)=>{
        const id = req.params.id;
        console.log(id);
        await products.deleteOne({_id:id}).then(()=>{
            res.redirect('/admin/products');
        })
    },  
    userDetails:async(req,res)=>{
        if(req.session.adminId){
            const allusers = await user.find();
            res.render('admin/userDetails',{allusers});
        }else{
            res.redirect('/admin');
        }
    },
   
    blockuser:(req,res)=>{
        const id = req.params.id;
        console.log(id);
        user.updateOne({_id:id},{$set:{isBlocked:true}}).then(()=>{
            res.redirect('/admin/userDetails');
        })
    }, 
    unblockuser:(req,res)=>{
        const id = req.params.id;
        user
          .updateOne({ _id: id }, { $set: { isBlocked: false } })
          .then(() => {
            res.redirect("/admin/userDetails");
          });
    }
}