//jshint esversion:6
//my nodejs starter pack
const express = require("express");
// const request = require("request")
const https = require("https");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const moment = require ("moment");
// const { checkBody, validationResult } = require('express-validator');
const res = require("express/lib/response");
const { redirect } = require("express/lib/response");
const { features } = require("process");
const { PerformanceNodeTiming } = require("perf_hooks");

// const { authenticate } = require("passport/lib");

// const session = require("express-session");
// const passport = require("passport");
// const passportLocalMongoose = require("passport-local-mongoose");
// const { getMaxListeners } = require("process");
const app = express();



app.use(express.static("public"));
app.set("views", __dirname + "/views");
// app.set('views','./views/pages');
app.set("view engine", "ejs");
// app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, './views/pages/')]);
app.use(bodyParser.urlencoded({ extended: true }));

//TODO
mongoose.connect("mongodb://localhost:27017/barangayportalDB", {
  useNewUrlParser: true,
});

const userSchema = {
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  conpassword: String,
  accountrole: String,
};
const User = new mongoose.model("User", userSchema);

const contactformSchema = {
  fullname: String,
  email: String,
  phone: Number,
  subject: String,
  text: String,
};
const ContactForm = new mongoose.model("ContactForm", contactformSchema);

const requseridSchema = {
  dateapply:  {type: String, 
  default: () => moment().format("MMMM Do YYYY") },
  fullname: String,
  address: String,
  email: String,
  phone: Number,
  age: Number,
  civilstatus: String,
  purposeofreq: String,
  ctc: String,
  request: String
  // imgfilefee: { data: Buffer, contentType: String },
  // imgfileidorpsa: { data: Buffer, contentType: String },
};
const RequestID = new mongoose.model("RequestID", requseridSchema);

app.get("/", function (req, res) {
res.render("main");
});
app.get("/login", function (req, res) {
  res.render("login");
});

// app.get("/createaccount", function (req, res) {
//   res.redirect("createaccount");
// });

  app.get("/portal", function (req, res) {
      res.render("portal");
    });
  app.get("/reqbrgyid", function (req, res) {
    res.render("./pages/reqbrgyid");
  });
  app.get("/RequestIdForm", function (req, res) {
    res.render("./page-admin/RequestIdForm");
  });
  app.get("/donate", function (req, res) {
    res.render("./pages/donate");
  });
  
  app.get("/registeraccount", function (req, res) {
    res.render("register");
  });
  app.get("/register", function (req, res) {
    res.render("register");
  });

  app.get("/logout", async (req, res) => {
    res.redirect("main");
  });
  app.get("/main", function (req, res) {
  res.render("main");
});
  
  app.get("/contact-mail", async (req, res) => {
    res.redirect("main");
  });
  
  app.get("/employeeportal", async (req, res) => {
    res.redirect("employeeportal");
  });
  
app.get("/deleteinfo/:id", (req, res, next)=> {
  RequestID.findByIdAndDelete({_id: req.params.id}, (err, users) =>{ 
      User.findByIdAndDelete({_id: req.params.id}, (err, users)=>{
        if(err){
          console.log("Something went wrong");
          next(err);
        } else {
          console.log("Delete Successfully");
          res.redirect("/adminportal");
        }
      });
  });
});
  
  
app.get("/adminportal", function (req, res) {

  RequestID.find({request: 'Approved'}, function(err, approvedIds){ 
    RequestID.find({request: 'Pending'}, function(err, requestIds){ 
      User.find({}, function(err, allUser){
        User.find({ accountrole: 'citizen' }, function (err, usersUser) {
          User.find({ accountrole: 'employee' }, function (err, usersEmployee) {
            User.find({ accountrole: 'admin' }, function (err, usersAdmin) {
              res.render('adminportal', { allUser, usersUser,usersEmployee, usersAdmin, requestIds, approvedIds});
            });
          });
        });
      });
    });
  });
});

// EDIT USER

app.get("/editinfo/:id", (req,res, next ) =>{
const id = req.params.id;
  User.findOneAndUpdate({_id: req.params.id}, req.body, {new:true}, (err, users)=>{
    if(err){
      console.log("Can't retrieve data and edit because of some database problem.")
      next(err);
    } else {
      res.render("editinfo",  { users: users });
    }
    
});

});

app.post("/editinfo/:id", (req,res, next ) =>{

  User.findByIdAndUpdate({_id: req.params.id}, req.body, (err, users) => {
    if (err){
      console.log("Something went wrong to update your data");
      next(err);
    }else{
      res.redirect("/adminportal");

    }
  })
});

// app.get("/deleteallaccounts", (req,res){
//   User.deleteMany({}, function(err){
//     if(err) {
//       console.log(err);
//     } else {
//       res.render("adminportal");
//     }
//   });
// });

app.get("/deleteinfo", (req, res, next)=> {

  RequestID.deleteMany({accountrole: "citizen"}, (err, users)=>{
  User.deleteMany({accountrole: "citizen"}, (err, users)=>{
    if(err){
      console.log("Something went wrong");
      next(err);
    } else {
      console.log("Delete Successfully");
      res.redirect("/adminportal");
    }
  });});
});

app.post("/login", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
//   const accountrole = req.body.accountrole;

  User.findOne({ email: email }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {

            if (foundUser.accountrole === "admin") {
                res.redirect("adminportal");
            }
            else if(foundUser.accountrole === "employee"){
                res.redirect("employeeportal");
            }
            else if(foundUser.accountrole === "citizen"){
                res.redirect("portal");
                
            }
        }
        else {
            res.redirect("login");
        }
      }
    }
  });
});
 


app.post("/registeraccount", function (req, res) {

  const newUser = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    conpassword: req.body.conpassword,
    accountrole: req.body.accountrole,
  });

  newUser.save(function (err) {
    if (err) {
      console.log(err);
      // res.redirect("register");
    } 
     else {
           res.redirect("login")
        }

  });
});


//ADMIN PERKS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//this is for Account User
app.get("/createnewaccount", (req, res) => {
  res.render("createnewaccount");
});

app.post("/createnewaccount", function (req, res) {

  const newUser = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    conpassword: req.body.conpassword,
    accountrole: req.body.accountrole,
  });

  newUser.save(function (err) {
    if (err) {
      console.log(err);
      // res.redirect("register");
    } 
     else {
           res.redirect("adminportal")
        }

  });
});


// User.findOne({ accountrole: accountrole }, function (err, foundUser) {
//   if (err) {
//   console.log(err);
//   } else {
  
//           if(foundUser.accountrole === "admin") {
//               res.render("adminportal");
//           }
//           else if(foundUser.accountrole === "employee"){
//               res.render("adminportal");
//           }

//           else if(foundUser.accountrole === "citizen"){
//               res.render("portal");
//           }
//           else {
//           res.redirect("register");
//           }
//       }

// });


// REQUEST FOR ID FORM -- use for user
app.post("/reqbrgyid-req", function (req, res) {

  const result = "Pending"
  const requestIDuser = new RequestID({
    fullname: req.body.fullname,
    address: req.body.address,
    email: req.body.email,
    phone: req.body.phone,
    age: req.body.age,
    civilstatus: req.body.civilstatus,
    purposeofreq: req.body.purposeofreq,
    ctc: req.body.ctc,
    request: result
    
    // imgfilefee: req.body.imgfilefee,
    // contentType: 'img/png',
    // imgfileidorpsa: req.body.imgfileidorpsa,
    // contentType: 'img/png'
  });

  requestIDuser.save(function (err) {
    if (err) {
      console.log(err);
      res.redirect("./pages/reqbrgyid")
    } else {
      res.render("main");
    }
  });
});

// Admin Add Request Form  --- user from admin's view !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.post("/RequestIdForm", function (req, res) {
  const result = "Pending"
  const requestIDuser = new RequestID({
    fullname: req.body.fullname,
    address: req.body.address,
    email: req.body.email,
    phone: req.body.phone,
    age: req.body.age,
    civilstatus: req.body.civilstatus,
    purposeofreq: req.body.purposeofreq,
    ctc: req.body.ctc,
    request: result
    
    // imgfilefee: req.body.imgfilefee,
    // contentType: 'img/png',
    // imgfileidorpsa: req.body.imgfileidorpsa,
    // contentType: 'img/png'
  });

  requestIDuser.save(function (err) {
    if (err) {
      console.log(err);
      res.redirect("./page-admin/RequestIdForm")
    } else {
      res.redirect("adminportal");
    }
  });
});


//--------ADMIN VIEW for Updating and Viewing REQUEST FOR BRGY ID Application Form
app.get("/adminviewreqid/:id", (req,res, next ) =>{
  const id = req.params.id;
    RequestID.findOneAndUpdate({_id: req.params.id}, req.body, {new:true}, (err, users)=>{
      if(err){
        console.log("Can't retrieve data and edit because of some database problem.")
        next(err);
      } else {
        res.render("./page-admin/adminviewreqid",  { users: users });
      }
      
  });
  
  });

  app.post("/adminviewreqid/:id", (req,res, next ) =>{

    RequestID.findByIdAndUpdate({_id: req.params.id}, req.body, (err, users) => {
      if (err){
        console.log("Something went wrong to update your data");
        next(err);
      }else{
        res.redirect("/adminportal");
  
      }
    })
  });


// CONTACT FORM
app.post("/contact-mail", function (req, res) {
  const contactUser = new ContactForm({
    fullname: req.body.fullname,
    email: req.body.email,
    phone: req.body.phone,
    subject: req.body.subject,
    text: req.body.message,
  });

  contactUser.save(function (err) {
    if (err) {
      console.log(err);
      res.redirect("main")
    } else {
      res.redirect("main");
    }
  });
});




//---------------------------------------

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
