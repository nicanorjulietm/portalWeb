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

const useraccountsSchema = {
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  conpassword: String,
  accountrole: String,
};
const Account = new mongoose.model("Account", useraccountsSchema);


const suggestionsSchema = {
  fullname: String,
  email: String,
  phone: Number,
  subject: String,
  text: String,
};
const Suggestion = new mongoose.model("Suggestion", suggestionsSchema);

const requestforbrgyidSchema = {
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
const RequestBrgyId = new mongoose.model("RequestBrgyId", requestforbrgyidSchema);

const requestforbrgyclearanceSchema = {
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
const RequestClearance = new mongoose.model("RequestClearance", requestforbrgyclearanceSchema);

const businesspermitSchema = {
  dateapply:  {type: String, 
  default: () => moment().format("MMMM Do YYYY") },
  fullname: String,
  address: String,
  email: String,
  phone: Number,
  businessname: String,
  businessaddress: String,
  request: String
  // imgfilefee: { data: Buffer, contentType: String },
  // imgfileidorpsa: { data: Buffer, contentType: String },
};
const BusinessPermit = new mongoose.model("BusinessPermit", businesspermitSchema);

const certificateofindigencySchema = {
  dateapply:  {type: String, 
  default: () => moment().format("MMMM Do YYYY") },
  fullname: String,
  address: String,
  email: String,
  phone: Number,
  birthday: String,
  datestarted: String,
  purposeofreq: String,
  ctc: String,
  request: String
  // imgfilefee: { data: Buffer, contentType: String },
  // imgfileidorpsa: { data: Buffer, contentType: String },
};
const CertificateIndigency = new mongoose.model("CertificateIndigency", certificateofindigencySchema);


const wiringandexcavationclearanceSchema = {
  dateapply:  {type: String, 
  default: () => moment().format("MMMM Do YYYY") },
  fullname: String,
  address: String,
  email: String,
  phone: Number,
  birthday: String,
  datestarted: String,
  purposeofreq: String,
  ctc: String,
  request: String
  // imgfilefee: { data: Buffer, contentType: String },
  // imgfileidorpsa: { data: Buffer, contentType: String },
};
const WiringandExcavationClearance = new mongoose.model("WiringandExcavationClearance", wiringandexcavationclearanceSchema);


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
  app.get("/reqbrgyclearance", function (req, res) {
    res.render("./pages/reqbrgyclearance");
  });
  app.get("/reqwiringsclearance", function (req, res) {
    res.render("./pages/reqwiringsclearance");
  });

  app.get("/businesspermit", function (req, res) {
    res.render("./pages/businesspermit");
  });
  app.get("/reqindigency", function (req, res) {
    res.render("./pages/reqindigency");
  });
  app.get("/RequestIdForm", function (req, res) {
    res.render("./page-admin/RequestIdForm");
  });
  app.get("/RequestIndigencyForm", function (req, res) {
    res.render("./page-admin/RequestIndigencyForm");
  });

  
  app.get("/WiringandExcavationForm", function (req, res) {
    res.render("./page-admin/WiringandExcavationForm");
  });
  app.get("/RequestClearanceForm", function (req, res) {
    res.render("./page-admin/RequestClearanceForm");
  });
  app.get("/BusinessPermitForm", function (req, res) {
    res.render("./page-admin/BusinessPermitForm");
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
  WiringandExcavationClearance.findByIdAndDelete({_id: req.params.id}, (err, users) =>{ 
    CertificateIndigency.findByIdAndDelete({_id: req.params.id}, (err, users) =>{ 
      BusinessPermit.findByIdAndDelete({_id: req.params.id}, (err, users) =>{ 
        RequestClearance.findByIdAndDelete({_id: req.params.id}, (err, users) =>{ 
          RequestBrgyId.findByIdAndDelete({_id: req.params.id}, (err, users) =>{ 
              Account.findByIdAndDelete({_id: req.params.id}, (err, users)=>{
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
        });
      });
    });
});
  
  
app.get("/adminportal", function (req, res) {
  WiringandExcavationClearance.find({request: 'Approved'}, function(err, approvedWirings){ 
    WiringandExcavationClearance.find({request: 'Pending'}, function(err, requestsWirings){ 
      CertificateIndigency.find({request: 'Approved'}, function(err, approvedIndigency){ 
        CertificateIndigency.find({request: 'Pending'}, function(err, requestsIndigency){ 
          BusinessPermit.find({request: 'Approved'}, function(err, approvedBusinessPermit){ 
            BusinessPermit.find({request: 'Pending'}, function(err, requestsBusinessPermit){ 
              RequestClearance.find({request: 'Approved'}, function(err, approvedClearances){
                RequestClearance.find({request: 'Pending'}, function(err, requestsClearances){ 
                  RequestBrgyId.find({request: 'Approved'}, function(err, approvedIds){ 
                    RequestBrgyId.find({request: 'Pending'}, function(err, requestIds){ 
                      Account.find({}, function(err, allUser){
                        Account.find({ accountrole: 'citizen' }, function (err, usersUser) {
                          Account.find({ accountrole: 'employee' }, function (err, usersEmployee) {
                            Account.find({ accountrole: 'admin' }, function (err, usersAdmin) {
                              res.render('adminportal', { allUser, usersUser,usersEmployee, usersAdmin, requestIds, approvedIds, requestsClearances, approvedClearances, requestsBusinessPermit
                              , approvedBusinessPermit, approvedIndigency, requestsIndigency, approvedWirings, requestsWirings});
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
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
  Account.findOneAndUpdate({_id: req.params.id}, req.body, {new:true}, (err, users)=>{
    if(err){
      console.log("Can't retrieve data and edit because of some database problem.")
      next(err);
    } else {
      res.render("editinfo",  { users: users });
    }
    
});

});

app.post("/editinfo/:id", (req,res, next ) =>{

  Account.findByIdAndUpdate({_id: req.params.id}, req.body, (err, users) => {
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
  CertificateIndigency.deleteMany({}, (err, users)=>{
  BusinessPermit.deleteMany({}, (err, users)=>{
  RequestClearance.deleteMany({}, (err, users)=>{
  RequestBrgyId.deleteMany({}, (err, users)=>{
  Account.deleteMany({accountrole: "citizen"}, (err, users)=>{
    if(err){
      console.log("Something went wrong");
      next(err);
    } else {
      console.log("Delete Successfully");
      res.redirect("/adminportal");
    }
  });});});});});
});


/// lOGIN!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.post("/login", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
//   const accountrole = req.body.accountrole;

  Account.findOne({ email: email }, function (err, foundUser) {
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
 

/// SIGN UPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
app.post("/registeraccount", function (req, res) {

  const newUser = new Account({
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

  const newUser = new Account({
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


// -------------------------------------------------------------------------------------REQUEST FOR CERTIFICATION OF WIRINGS-- use for user
app.post("/reqwiringsclearance-req", function (req, res) {

  const result = "Pending"
  const requestWiring= new WiringandExcavationClearance({
    fullname: req.body.fullname,
    address: req.body.address,
    email: req.body.email,
    phone: req.body.phone,
    purposeofreq: req.body.purposeofreq,
    ctc: req.body.ctc,
    request: result
    
    // imgfilefee: req.body.imgfilefee,
    // contentType: 'img/png',
    // imgfileidorpsa: req.body.imgfileidorpsa,
    // contentType: 'img/png'
  });

  requestWiring.save(function (err) {
    if (err) {
      console.log(err);
      res.redirect("./pages/reqwiringsclearance")
    } else {
      res.render("main");
    }
  });
});

app.post("/WiringandExcavationForm", function (req, res) {

  const result = "Pending"
  const requestWiring= new WiringandExcavationClearance({
    fullname: req.body.fullname,
    address: req.body.address,
    email: req.body.email,
    phone: req.body.phone,
    purposeofreq: req.body.purposeofreq,
    ctc: req.body.ctc,
    request: result
    
    // imgfilefee: req.body.imgfilefee,
    // contentType: 'img/png',
    // imgfileidorpsa: req.body.imgfileidorpsa,
    // contentType: 'img/png'
  });

  requestWiring.save(function (err) {
    if (err) {
      console.log(err);
      res.redirect("./page-admin/WiringandExcavationForm")
    } else {
      res.redirect("adminportal");
    }
  });
});


app.get("/adminviewwirings/:id", (req,res, next ) =>{
  const id = req.params.id;
  WiringandExcavationClearance.findOneAndUpdate({_id: req.params.id}, req.body, {new:true}, (err, users)=>{
      if(err){
        console.log("Can't retrieve data and edit because of some database problem.")
        next(err);
      } else {
        res.render("./page-admin/adminviewwirings",  { users: users });
      }
      
  });
  
  });

app.post("/adminviewwirings/:id", (req,res, next ) =>{

    WiringandExcavationClearance.findByIdAndUpdate({_id: req.params.id}, req.body, (err, users) => {
      if (err){
        console.log("Something went wrong to update your data");
        next(err);
      }else{
        res.redirect("/adminportal");
  
      }
    })
  });


  app.get("/adminviewwiringsapproved/:id", (req,res, next ) =>{
    const id = req.params.id;
    WiringandExcavationClearance.findOneAndUpdate({_id: req.params.id}, req.body, {new:true}, (err, users)=>{
        if(err){
          console.log("Can't retrieve data and edit because of some database problem.")
          next(err);
        } else {
          res.render("./page-admin/adminviewwiringsapproved",  { users: users });
        }
        
    });
    
    });
















// -------------------------------------------------------------------------------------REQUEST FOR CERTIFICATION OF INDIGENCY-- use for user
app.post("/reqindigency-req", function (req, res) {

  const result = "Pending"
  const requestIndigency= new CertificateIndigency({
    fullname: req.body.fullname,
    address: req.body.address,
    email: req.body.email,
    phone: req.body.phone,
    birthday: req.body.birthday,
    datestarted: req.body.datestarted,
    purposeofreq: req.body.purposeofreq,
    ctc: req.body.ctc,
    request: result
    
    // imgfilefee: req.body.imgfilefee,
    // contentType: 'img/png',
    // imgfileidorpsa: req.body.imgfileidorpsa,
    // contentType: 'img/png'
  });

  requestIndigency.save(function (err) {
    if (err) {
      console.log(err);
      res.redirect("./pages/reqindigency")
    } else {
      res.render("main");
    }
  });
});


// Admin Add Request Form for Certificate for Indigency--- user from admin's view !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.post("/RequestIndigencyForm", function (req, res) {

  const result = "Pending"
  const requestIndigency = new CertificateIndigency({
    fullname: req.body.fullname,
    address: req.body.address,
    email: req.body.email,
    phone: req.body.phone,
    birthday: req.body.birthday,
    datestarted: req.body.datestarted,
    purposeofreq: req.body.purposeofreq,
    ctc: req.body.ctc,
    request: result
    // imgfilefee: req.body.imgfilefee,
    // contentType: 'img/png',
    // imgfileidorpsa: req.body.imgfileidorpsa,
    // contentType: 'img/png'
  });

  requestIndigency.save(function (err) {
    if (err) {
      console.log(err);
      res.redirect("./page-admin/RequestIndigencyForm")
    } else {
      res.redirect("adminportal");
    }
  });
});


app.get("/adminviewreqindigency/:id", (req,res, next ) =>{
  const id = req.params.id;
  CertificateIndigency.findOneAndUpdate({_id: req.params.id}, req.body, {new:true}, (err, users)=>{
      if(err){
        console.log("Can't retrieve data and edit because of some database problem.")
        next(err);
      } else {
        res.render("./page-admin/adminviewreqindigency",  { users: users });
      }
      
  });
  
  });

app.post("/adminviewreqindigency/:id", (req,res, next ) =>{

    CertificateIndigency.findByIdAndUpdate({_id: req.params.id}, req.body, (err, users) => {
      if (err){
        console.log("Something went wrong to update your data");
        next(err);
      }else{
        res.redirect("/adminportal");
  
      }
    })
  });


  app.get("/adminviewreqindigencyapproved/:id", (req,res, next ) =>{
    const id = req.params.id;
    CertificateIndigency.findOneAndUpdate({_id: req.params.id}, req.body, {new:true}, (err, users)=>{
        if(err){
          console.log("Can't retrieve data and edit because of some database problem.")
          next(err);
        } else {
          res.render("./page-admin/adminviewreqindigencyapproved",  { users: users });
        }
        
    });
    
    });



// -------------------------------------------------------------------------------------REQUEST FOR BUSINESS PERMIT-- use for user
app.post("/reqbusinesspermit-req", function (req, res) {

  const result = "Pending"
  const requestBusinessPermit = new BusinessPermit({
    fullname: req.body.fullname,
    address: req.body.address,
    email: req.body.email,
    phone: req.body.phone,
    businessname: req.body.businessname,
    businessaddress: req.body.businessaddress,
    request: result
    
    // imgfilefee: req.body.imgfilefee,
    // contentType: 'img/png',
    // imgfileidorpsa: req.body.imgfileidorpsa,
    // contentType: 'img/png'
  });

  requestBusinessPermit.save(function (err) {
    if (err) {
      console.log(err);
      res.redirect("./pages/reqbusinesspermit")
    } else {
      res.render("main");
    }
  });
});

// Admin Add Request Form for Business Permit --- user from admin's view !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.post("/BusinessPermitForm", function (req, res) {

  const result = "Pending"
  const requestBusinessPermit = new BusinessPermit({
    fullname: req.body.fullname,
    address: req.body.address,
    email: req.body.email,
    phone: req.body.phone,
    businessname: req.body.businessname,
    businessaddress: req.body.businessaddress,
    request: result
    
    // imgfilefee: req.body.imgfilefee,
    // contentType: 'img/png',
    // imgfileidorpsa: req.body.imgfileidorpsa,
    // contentType: 'img/png'
  });

  requestBusinessPermit.save(function (err) {
    if (err) {
      console.log(err);
      res.redirect("./page-admin/BusinessPermitForm")
    } else {
      res.redirect("adminportal");
    }
  });
});

//--------ADMIN VIEW for Updating and Viewing REQUEST FOR BRGY ID Application Form
app.get("/adminviewbusinesspermit/:id", (req,res, next ) =>{
  const id = req.params.id;
  BusinessPermit.findOneAndUpdate({_id: req.params.id}, req.body, {new:true}, (err, users)=>{
      if(err){
        console.log("Can't retrieve data and edit because of some database problem.")
        next(err);
      } else {
        res.render("./page-admin/adminviewbusinesspermit",  { users: users });
      }
      
  });
  
  });

app.post("/adminviewbusinesspermit/:id", (req,res, next ) =>{

    BusinessPermit.findByIdAndUpdate({_id: req.params.id}, req.body, (err, users) => {
      if (err){
        console.log("Something went wrong to update your data");
        next(err);
      }else{
        res.redirect("/adminportal");
  
      }
    })
  });


  app.get("/adminviewbusinesspermitapproved/:id", (req,res, next ) =>{
    const id = req.params.id;
    BusinessPermit.findOneAndUpdate({_id: req.params.id}, req.body, {new:true}, (err, users)=>{
        if(err){
          console.log("Can't retrieve data and edit because of some database problem.")
          next(err);
        } else {
          res.render("./page-admin/adminviewbusinesspermitapproved",  { users: users });
        }
        
    });
    
    });

// app.post("/adminviewbusinesspermitapproved/:id", (req,res, next ) =>{

//     BusinessPermit.findByIdAndUpdate({_id: req.params.id}, req.body, (err, users) => {
//       if (err){
//         console.log("Something went wrong to update your data");
//         next(err);
//       }else{
//         res.redirect("/adminportal");
  
//       }
//     })
//   });






// ------------------------------------------------------------------------------------------REQUEST FOR BRGY CLEARANCE FORM -- use for user
app.post("/reqbrgyclerance-req", function (req, res) {

  const result = "Pending"
  const requestClearanceuser = new RequestClearance({
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

  requestClearanceuser.save(function (err) {
    if (err) {
      console.log(err);
      res.redirect("./pages/reqbrgyclearance")
    } else {
      res.render("main");
    }
  });
});

// Admin Add Request Form for Clearance --- user from admin's view !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.post("/RequestClearanceForm", function (req, res) {
  const result = "Pending"
  const requestClearanceuser = new RequestClearance({
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

  requestClearanceuser.save(function (err) {
    if (err) {
      console.log(err);
      res.redirect("./page-admin/RequestClearanceForm")
    } else {
      res.redirect("adminportal");
    }
  });
});


//--------ADMIN VIEW for Updating and Viewing REQUEST FOR BRGY  CLEARANCE Application Form
app.get("/adminviewreqclearance/:id", (req,res, next ) =>{
  const id = req.params.id;
  RequestClearance.findOneAndUpdate({_id: req.params.id}, req.body, {new:true}, (err, users)=>{
      if(err){
        console.log("Can't retrieve data and edit because of some database problem.")
        next(err);
      } else {
        res.render("./page-admin/adminviewreqclearance",  { users: users });
      }
      
  });
  
  });

app.post("/adminviewreqclearance/:id", (req,res, next ) =>{

    RequestClearance.findByIdAndUpdate({_id: req.params.id}, req.body, (err, users) => {
      if (err){
        console.log("Something went wrong to update your data");
        next(err);
      }else{
        res.redirect("/adminportal");
  
      }
    })
  });

app.get("/adminviewreqclearanceapproved/:id", (req,res, next ) =>{
    const id = req.params.id;
    RequestClearance.findOneAndUpdate({_id: req.params.id}, req.body, {new:true}, (err, users)=>{
        if(err){
          console.log("Can't retrieve data and edit because of some database problem.")
          next(err);
        } else {
          res.render("./page-admin/adminviewreqclearanceapproved",  { users: users });
        }
        
    });
    
    });































// ------------------------------------------------------------------------------------------------REQUEST FOR ID FORM -- use for user
app.post("/reqbrgyid-req", function (req, res) {

  const result = "Pending"
  const requestIDuser = new RequestBrgyId({
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
  const requestIDuser = new RequestBrgyId({
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
  RequestBrgyId.findOneAndUpdate({_id: req.params.id}, req.body, {new:true}, (err, users)=>{
      if(err){
        console.log("Can't retrieve data and edit because of some database problem.")
        next(err);
      } else {
        res.render("./page-admin/adminviewreqid",  { users: users });
      }

  });
  
  });

  app.post("/adminviewreqid/:id", (req,res, next ) =>{

    RequestBrgyId.findByIdAndUpdate({_id: req.params.id}, req.body, (err, users) => {
      if (err){
        console.log("Something went wrong to update your data");
        next(err);
      }else{
        res.redirect("/adminportal");
  
      }
    })
  });


  //--------ADMIN VIEW for APPROVED REQUEST FOR BRGY ID Application Form
app.get("/adminviewreqidapproved/:id", (req,res, next ) =>{
  const id = req.params.id;
  RequestBrgyId.findOneAndUpdate({_id: req.params.id}, req.body, {new:true}, (err, users)=>{
      if(err){
        console.log("Can't retrieve data and edit because of some database problem.")
        next(err);
      } else {
        res.render("./page-admin/adminviewreqidapproved",  { users: users });
      }
      
  });
  
  });

  // app.post("/adminviewreqidapproved/:id", (req,res, next ) =>{

  //   RequestClearance.findByIdAndUpdate({_id: req.params.id}, req.body, (err, users) => {
  //     if (err){
  //       console.log("Something went wrong to update your data");
  //       next(err);
  //     }else{
  //       res.redirect("/adminportal");
  
  //     }
  //   })
  // });
  

// //--------ADMIN VIEW for Updating and Viewing REQUEST FOR BRGY ID Application Form
// app.get("/adminviewreqidapproved/:id", (req,res, next ) =>{
//   const id = req.params.id;
//   RequestClearance.findOneAndUpdate({_id: req.params.id}, req.body, {new:true}, (err, users)=>{
//       if(err){
//         console.log("Can't retrieve data and edit because of some database problem.")
//         next(err);
//       } else {
//         res.render("./page-admin/adminviewreqidapproved",  { users: users });
//       }
      
//   });
  
  // });



// app.post("/adminviewreqidapproved/:id", (req,res, next ) =>{
//   const id = req.params.id;
//   RequestBrgyId.findByIdAndUpdate({_id: req.params.id}, req.body, (err, users) => {
//       if (err){
//         console.log("Something went wrong to update your data");
//         next(err);
//       }else{
//         res.redirect("/adminportal");
  
//       }
//     })
//   });



// SUGGESTION FORM
app.post("/contact-mail", function (req, res) {
  const contactUser = new Suggestion({
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
