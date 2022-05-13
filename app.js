//jshint esversion:6
//my nodejs starter pack
require('dotenv').config();
const express = require("express");
const request = require("request")
const https = require("https");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const multer = require("multer");
const XLSX = require('xlsx');
const hbs = require('nodemailer-express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');

const { StringDecoder } = require("string_decoder");
// const encrypt = require("mongoose-encryption");
const moment = require ("moment");
// const { checkBody, validationResult } = require('express-validator');
const res = require("express/lib/response");
const { redirect } = require("express/lib/response");
const { features } = require("process");
const { PerformanceNodeTiming } = require("perf_hooks");

// const { authenticate } = require("passport/lib");


const { getMaxListeners } = require("process");
const { createVerify } = require('crypto');
const app = express();




app.set("views", __dirname + "/views");
// app.set('views','./views/pages');
app.set("view engine", "ejs");
// app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, './views/pages/')]);
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));
app.use(express.static("uploads"));
// const path = require('path');




//image upload for brgyid
var storage = multer.diskStorage({destination: function(req, file, cb){
    cb(null, './uploads');
  }, 
  filename: function(req, file, cb){
    cb(null, file.fieldname +"_"+ Date.now() +"_"+ file.originalname);
  },
});
// var upload = multer({ storage: storage, }).array("image");
var upload = multer({ storage: storage, }).single("image");
// var uploads = multer({ storage: storage, }).single("filepsaid");
//image upload for brgyid


app.use(session({
   secret: "Our little secret.",
   resave: false,
   saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());
mongoose.connect("mongodb://localhost:27017/barangayportalDB", {
  useNewUrlParser: true,
});

// initialize nodemailer
var transporter = nodemailer.createTransport(
  {
      service: 'gmail',
      auth:{
          user: 'barangayportalx@gmail.com',
          pass: 'HALETHEJAY1996'
      }
  }
);



const useraccountsSchema = new mongoose.Schema ({
  
  fullname: String,
  address: String, 
  birthday: String,
  phone: String,
  username: { type: String, index: true, unique: true },
  email:  { type: String, index: true, unique: true },
  password: String,
  accountrole: String,


});
useraccountsSchema.plugin(passportLocalMongoose);
const Account = new mongoose.model("Account", useraccountsSchema);
const BackUpAccount = new mongoose.model("BackUpAccount", useraccountsSchema);

passport.use(Account.createStrategy());
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


const suggestionsSchema = {
  fullname: String,
  username: String,
  phone: Number,
  subject: String,
  text: String,
};
const Suggestion = new mongoose.model("Suggestion", suggestionsSchema);
const BackUpSuggestion = new mongoose.model("BackUpSuggestion", suggestionsSchema);


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
  request: String,
  concern: String,
  image: {
   type: String, required: true, },

};
const RequestBrgyId = new mongoose.model("RequestBrgyId", requestforbrgyidSchema);
const BackUpRequestBrgyId = new mongoose.model("BackUpRequestBrgyId", requestforbrgyidSchema);

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
  concern: String,
  image: {
    type: String, required: true, },
  request: String,


};
const RequestClearance = new mongoose.model("RequestClearance", requestforbrgyclearanceSchema);
const BackUpRequestClearance = new mongoose.model("BackUpRequestClearance", requestforbrgyclearanceSchema);

const businesspermitSchema = {
  dateapply:  {type: String, 
  default: () => moment().format("MMMM Do YYYY") },
  fullname: String,
  address: String,
  email: String,
  phone: Number,
  concern: String,
  businessname: String,
  businessaddress: String,
  request: String,

  image: { type: String, required: true, },
  
};
const BusinessPermit = new mongoose.model("BusinessPermit", businesspermitSchema);
const BackUpBusinessPermit = new mongoose.model("BackUpBusinessPermit", businesspermitSchema);

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
  concern: String,
  ctc: String,
  request: String,

  image: { type: String, required: true, },
};
const CertificateIndigency = new mongoose.model("CertificateIndigency", certificateofindigencySchema);
const BackUpCertificateIndigency = new mongoose.model("BackUpCertificateIndigency", certificateofindigencySchema);

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
  concern: String,
  ctc: String,
  
  image: {    type: String, required: true, },
  request: String

};
const WiringandExcavationClearance = new mongoose.model("WiringandExcavationClearance", wiringandexcavationclearanceSchema);
const BackUpWiringandExcavationClearance = new mongoose.model("BackUpWiringandExcavationClearance", wiringandexcavationclearanceSchema);


const blotterSchema ={
daterecorded: String,
fullnamecomplainant: String,
email: String,
phone: String,
fullnamedefendant: String,
address: String,
date: String,
time: String,
incident: String,
request: String,
};
const Blotter = new mongoose.model("Blotter", blotterSchema);
const BackUpBlotter = new mongoose.model("BackUpBlotter", blotterSchema);


const residentsSchema ={
  precinct: String,
  daterecorded: String,
  lastname: String,
  firstname: String,
  middleinitial: String,
  birthday: String,
  birthplace: String,
  age: String,
  gender: String,
  civilstatus: String, 
  email: String,
  phone: String,
  schoolattainment: String,
  profession: String,
  blklot: String,
  street: String,
  brgy: String,
  province: String,
  citizen: String,
  zipcode: String
  };
  const Residents= new mongoose.model("Residents", residentsSchema);
  const BackUpResidents= new mongoose.model("BackUpResidents", residentsSchema);

const updateSchema = {
    datetodays: String,
    postedby: String,
    title: String,
    details: String
  };
  const Update = new mongoose.model("Update", updateSchema);

  const taskSchema = {
    datetodays: String,
    postedby: String,
    assignedto: String,
    subject: String,
    description: String
  };
  const Task = new mongoose.model("Task", taskSchema);

  const donateSchema = {
    donatorsname: String, 
    honoreename: String,
    email: String,
    donation: String,
    commment: String
  };
  const Donate = new mongoose.model("Donate", donateSchema)
 
  const volunteerSchema = {
    
      name: String,
      organization: String,
      email: String,
      commment: String
  }; 
  const Volunteer = new mongoose.model("Volunteer", volunteerSchema);


app.get("/", function (req, res) {
res.render("main");
});

app.get("/mainuser", function (req, res) {
 
  res.render("mainuser", {username: req.user.username, id: req.user.id});
  });

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/portal", function(req, res){
  if(req.isAuthenticated()){
   res.render("portal", {
     username: req.user.username, 
     fullname: req.user.fullname,
     id: req.user.id});
   }else{
   res.redirect("/login");
   }
});





app.get("/reqbrgy-id-user", function (req, res) {
  
  res.render("./users/reqbrgy-id-user");
});
app.get("/reqbrgy-clearance-user", function (req, res) {
  res.render("./users/reqbrgy-clearance-user");
});
app.get("/reqbrgy-permit-user", function (req, res) {
  res.render("./users/reqbrgy-permit-user");
});

app.get("/reqbrgy-indigency-user", function (req, res) {
  res.render("./users/reqbrgy-indigency-user");
});

app.get("/reqbrgy-wande-user", function (req, res) {
  res.render("./users/reqbrgy-wande-user");
});

app.get("/tutorials", function (req, res){
res.render("tutorials")
});



app.get("/tutorialsuser", function (req, res){
  res.render("tutorialsuser", {
    id: req.user.id,
    address: req.user.address,
    phone: req.user.phone,
    fullname: req.user.fullname,
    username: req.user.username,
    email: req.user.email
   });
  });
  
  app.get("/tutorialsforadmin", function (req, res){
    res.render("tutorialsforadmin", {
      id: req.user.id,
      address: req.user.address,
      phone: req.user.phone,
      fullname: req.user.fullname,
      email: req.user.email,
      username: req.user.username,
     });
    });
    app.get("/adminview", function (req, res){
      res.render("adminview", {
        id: req.user.id,
        address: req.user.address,
        phone: req.user.phone,
        fullname: req.user.fullname,
        email: req.user.email,
        username: req.user.username,
       });
      });

  app.get("/reqbrgyid", function (req, res) {
   
    res.render("./pages/reqbrgyid", {
      id: req.user.id,
      address: req.user.address,
      phone: req.user.phone,
      fullname: req.user.fullname,
      username: req.user.username,
      
      email: req.user.email
    });
  });  

  app.get("/reqbrgyclearance", function (req, res) {
    res.render("./pages/reqbrgyclearance",{
      id: req.user.id,
      address: req.user.address,
      phone: req.user.phone,
      fullname: req.user.fullname,
      username: req.user.username,
      
      email: req.user.email
    });
  });


  app.get("/businesspermit", function (req, res) {
    res.render("./pages/businesspermit", {
      id: req.user.id,
      username: req.user.username,
     address: req.user.address,
     phone: req.user.phone,
      fullname: req.user.fullname,
      email: req.user.email
    });
  });

  app.get("/RequestIdForm", function (req, res) {
    res.render("./page-admin/RequestIdForm", {
      id: req.user.id,
      address: req.user.address,
      phone: req.user.phone,
      fullname: req.user.fullname,
      username: req.user.username,
      lastname: req.user.lastname,
      firstname: req.user.firstname,
      middlename: req.user.middlename,
      email: req.user.email
    });
  });
 
  app.get("/RequestIndigencyForm", function (req, res) {
    res.render("./page-admin/RequestIndigencyForm", {id: req.user.id,  username: req.user.username,});
  });
  app.get("/WiringandExcavationForm", function (req, res) {
    res.render("./page-admin/WiringandExcavationForm", {id: req.user.id,  username: req.user.username,});
  });
  app.get("/RequestClearanceForm", function (req, res) {
    res.render("./page-admin/RequestClearanceForm", {id: req.user.id,  username: req.user.username,});
  });
  app.get("/BusinessPermitForm", function (req, res) {
    res.render("./page-admin/BusinessPermitForm", {id: req.user.id,  username: req.user.username,});
  });
  app.get("/donate", function (req, res) {
    res.render("./pages/donate", {id: req.user.id,  username: req.user.username,});
  });
  
  app.get("/registeraccount", function (req, res) {
    res.render("register", {id: req.user.id,  username: req.user.username,});
  });
  app.get("/register", function (req, res) {
    res.render("register");
  });
  app.get("/usersprofile", function (req, res) {
    res.render("usersprofile", {id: req.user.id,  username: req.user.username,});
  });

  app.get("/logout", function(req, res){
     req.logOut();
     res.redirect("/");
    })



  
  app.get("/contact-mail", async (req, res) => {

    // if(err){
    //   console.log(err)
    // }else {
    //   if (req.user.accountrole === "admin") {
    //     res.redirect("/adminview"); 
    //   } else if( req.user.accountrole === "employee"){
    //     res.redirect("/employeeportal");
    //   } else if (req.user.accountrole === "citizen"){
    //     res.redirect("/portal");
    //   }
    //   else {
    //     res.redirect("/main")
    //   }
    // }

  res.redirect("/")

  });
  

  // if (req.user.accountrole === "admin") {
  //   res.redirect("/adminview"); 
  // } else if( req.user.accountrole === "employee"){
  //   res.redirect("/employeeportal");
  // } else if (req.user.accountrole === "citizen"){
  //   res.redirect("/portal");
  // }
  // else {
  //   res.redirect("/main")
  // }
// SUGGESTION FORM
app.post("/contact-mail", async function (req, res) {
  try { 
    const contactUser = new Suggestion({
          fullname: req.body.fullname,
          email: req.body.email,
          phone: req.body.phone,
          subject: req.body.subject,
          text: req.body.message,
        });
        await contactUser.save();
      const backupContact = new BackUpSuggestion({
          fullname: req.body.fullname,
          email: req.body.email,
          phone: req.body.phone,
          subject: req.body.subject,
          text: req.body.message,
        });
        await backupContact.save();
        res.redirect("/")
  }catch(err){
    console.log(err)
  }
});
app.get("/contact-mails", async (req, res) => {
  if (req.user.accountrole === "admin") {
        res.redirect("/adminview"); 
      } else if( req.user.accountrole === "employee"){
        res.redirect("/employeeportal");
      } else if (req.user.accountrole === "citizen"){
        res.redirect("/portal");
      }
      else {
        res.redirect("/main")
      }

});

app.post("/contact-mails", async function (req, res) {
  try { 
    const contactUser = new Suggestion({
          fullname: req.body.fullname,
          email: req.body.email,
          phone: req.body.phone,
          subject: req.body.subject,
          text: req.body.message,
        });
        await contactUser.save();
      const backupContact = new BackUpSuggestion({
          fullname: req.body.fullname,
          email: req.body.email,
          phone: req.body.phone,
          subject: req.body.subject,
          text: req.body.message,
        });
        await backupContact.save();
        if (req.user.accountrole === "admin") {
              res.redirect("/adminview"); 
            } else if( req.user.accountrole === "employee"){
              res.redirect("/employeeportal");
            } else if (req.user.accountrole === "citizen"){
              res.redirect("/portal");
            }
            else {
              res.redirect("/main")
            }
  }catch(err){
    console.log(err)
  }
});


app.post("/login", function (req, res) {
        const user = new Account({
        username: req.body.username,
        password: req.body.password
        });
    //this method comes in from the npm passport
        req.login(user, function (err) {
        if (err) {
        console.log(err);
        res.redirect("login");
        } else {
        passport.authenticate("local")(req, res, function () {
        if (req.user.accountrole === "admin")  {
          res.redirect("/adminportal");
        }else if (req.user.accountrole === "employee"){
          res.redirect("/employeeportal");
        } else if (req.user.accountrole === "citizen") {
          res.redirect("/portal");
        } 
        else{
          res.redirect("login");
        }
 });}});});

app.post("/registeraccount",  function(req, res){

   const  accountrole = "citizen"
  const backupaccount = new BackUpAccount({
    username: req.body.username,
    email: req.body.email,
    fullname: req.body.fullname,
    
    accountrole: accountrole});
      Account.register({
        username: req.body.username,
        email: req.body.email,
        fullname: req.body.fullname,
        accountrole: accountrole
      }, req.body.password,   function(err, user){
        if(err){
        console.log(err);
        res.redirect("/registeraccount");
        } else {
        passport.authenticate("local")(req, res, function(){
     backupaccount.save();
        res.redirect("/portal");
        });
        }
});   });


  
app.get("/deleteinfo/:id", (req, res, next)=> {
  Task.findByIdAndDelete({_id: req.params.id}, (err, users) =>{ 
  Update.findByIdAndDelete({_id: req.params.id}, (err, users) =>{ 
      Residents.findByIdAndDelete({_id: req.params.id}, (err, users) =>{ 
      BackUpResidents.findByIdAndDelete({_id: req.params.id}, (err, users) =>{ 
      BackUpBlotter.findByIdAndDelete({_id: req.params.id}, (err, users) =>{ 
      Blotter.findByIdAndDelete({_id: req.params.id}, (err, users) =>{ 
      Suggestion.findByIdAndDelete({_id: req.params.id}, (err, users) =>{ 
      BackUpWiringandExcavationClearance.findByIdAndDelete({_id: req.params.id}, (err, users) =>{ 
      WiringandExcavationClearance.findByIdAndDelete({_id: req.params.id}, (err, users) =>{ 
      BackUpCertificateIndigency.findByIdAndDelete({_id: req.params.id}, (err, users) =>{ 
      CertificateIndigency.findByIdAndDelete({_id: req.params.id}, (err, users) =>{ 
      BackUpBusinessPermit.findByIdAndDelete({_id: req.params.id}, (err, users) =>{ 
      BusinessPermit.findByIdAndDelete({_id: req.params.id}, (err, users) =>{ 
      BackUpRequestClearance.findByIdAndDelete({_id: req.params.id}, (err, users) =>{ 
      RequestClearance.findByIdAndDelete({_id: req.params.id}, (err, users) =>{ 
      BackUpRequestBrgyId.findByIdAndDelete({_id: req.params.id}, (err, users) =>{
      RequestBrgyId.findByIdAndDelete({_id: req.params.id}, (err, users) =>{ 
      BackUpAccount.findByIdAndDelete({_id: req.params.id}, (err, users)=>{
      Account.findByIdAndDelete({_id: req.params.id}, (err, users)=>{
       if(err){
         console.log("Something went wrong");
         next(err);
       } else {
         console.log("Delete Successfully");
         if (req.user.accountrole === "admin") {
          res.redirect("/adminportal"); 
        } else if( req.user.accountrole === "employee"){
          res.redirect("/employeeportal");
        }
         }
});});});});});});});});});});});});});});});});});});});});


app.get("/employeeportal", async (req, res) => {
 
  const query = Account.find();  query.count(function (err, countAccounts) {
    // const suggestionquery = Suggestion.find(); suggestionquery.count(function(err, countSuggestions){ 
    const blotterquery = Blotter.find(); blotterquery.count(function(err, countBlotter){  
      const residentsquery = Residents.find(); residentsquery.count(function(err, countResidents){  
  
      // const accountPercentage = ((countAccounts * 0.10) * 100);
      // const accountDegree = (accountPercentage * 3.6);  
      BackUpRequestBrgyId.find().count(function(err, countRequestID){ 
      BackUpRequestClearance.find().count(function(err, countRequestClearance){ 
      BackUpBusinessPermit.find().count(function(err, countRequestPermit){ 
      BackUpCertificateIndigency.find().count(function(err, countRequestIndigency){ 
      BackUpWiringandExcavationClearance.find().count(function(err, countRequestWiring){ 
      const requestCount = (countRequestID + countRequestClearance + countRequestPermit + countRequestIndigency + countRequestWiring);

      const finance = Math.round(requestCount * 200).toFixed(2);

        //finished transactions
        CertificateIndigency.find({request:'Finshed'}, function(err, allFinished){
          WiringandExcavationClearance.find({request: 'Finshed'}, function(err, allFinished){ 
            BusinessPermit.find({request: 'Finshed'}, function(err, allFinished){ 
              RequestBrgyId.find({request: 'Finshed'}, function(err, allFinished){ 
                RequestClearance.find({request: 'Finshed'}, function(err, allFinished){ 

     Task.find({}, function (err, myTasks){ 
        Update.find({}, function (err, myUpdates){
      BackUpBlotter.find({}, function(err, backupBlotters){ 
      Blotter.find({request: 'Finished'}, function(err, blottersFinished){ 
      Blotter.find({request: 'On-going'}, function(err, blottersOngoing){ 
      Blotter.find({}, function(err, blotters){   
      Residents.find({gender: 'Male'}, function(err, allMale){ 
      Residents.find({gender: 'Female'}, function(err, allFemale){ 
      BackUpResidents.find({}, function(err, allbackupResidents){ 
      Residents.find({}, function(err, allResidents){ 
      Suggestion.find({}, function(err, suggestions){ 
      BackUpWiringandExcavationClearance.find({}, function(err, allWirings){ 
      WiringandExcavationClearance.find({request: 'Approved'}, function(err, approvedWirings){ 
      WiringandExcavationClearance.find({request: 'Pending'}, function(err, requestsWirings){ 
      BackUpCertificateIndigency.find({}, function(err, allIndigency){ 
      CertificateIndigency.find({request: 'Approved'}, function(err, approvedIndigency){ 
      CertificateIndigency.find({request: 'Pending'}, function(err, requestsIndigency){ 
      BackUpBusinessPermit.find({}, function(err, allPermit){ 
      BusinessPermit.find({request: 'Approved'}, function(err, approvedBusinessPermit){ 
      BusinessPermit.find({request: 'Pending'}, function(err, requestsBusinessPermit){ 
      RequestClearance.find({request: 'Approved'}, function(err, approvedClearances){
      RequestClearance.find({request: 'Pending'}, function(err, requestsClearances){ 
      BackUpRequestClearance.find({}, function(err, allClearance){
      RequestBrgyId.find({request: 'Approved'}, function(err, approvedIds){ 
      RequestBrgyId.find({request: 'Pending'}, function(err, requestIds){ 
        BackUpRequestBrgyId.find({}, function(err, allrequestIds){ 
          BackUpAccount.find({}, function(err, allUserAccounts){
        Account.find({}, function(err, allUser){
          Account.find({ accountrole: 'citizen' }, function (err, usersUser) {
            Account.find({ accountrole: 'employee' }, function (err, usersEmployee) {
              Account.find({ accountrole: 'admin' }, function (err, usersAdmin) {
                res.render('employeeportal', { allUser, usersUser,usersEmployee, usersAdmin, requestIds, approvedIds, requestsClearances, approvedClearances, requestsBusinessPermit
                , approvedBusinessPermit, approvedIndigency, requestsIndigency, approvedWirings, requestsWirings, countAccounts,  suggestions
              ,allrequestIds, allClearance, allPermit,allIndigency,allWirings, blotters, blottersOngoing,blottersFinished, countBlotter,backupBlotters
            ,allUserAccounts, requestCount,  myTasks, allResidents, myUpdates, allbackupResidents, countResidents, allFemale, allMale, finance, allFinished,
            username: req.user.username,
            id: req.user.id,
        fullname: req.user.fullname,
        address: req.user.address,
        phone: req.user.phone,
        birthday: req.user.birthday,
        email: req.user.email});
              });
            });
          });
        });
      });});});});});});}); });});});});});});});});});});});});});});});});});});});}); });});});});});});}); });});  });});}); });}); 
  
  
app.get("/adminportal", function (req, res) {

  const query = Account.find();  query.count(function (err, countAccounts) {
  // const suggestionquery = Suggestion.find(); suggestionquery.count(function(err, countSuggestions){ 
  const blotterquery = Blotter.find(); blotterquery.count(function(err, countBlotter){  
    const residentsquery = Residents.find(); residentsquery.count(function(err, countResidents){  

    // const accountPercentage = ((countAccounts * 0.10) * 100);
    // const accountDegree = (accountPercentage * 3.6);  
    BackUpRequestBrgyId.find().count(function(err, countRequestID){ 
    BackUpRequestClearance.find().count(function(err, countRequestClearance){ 
    BackUpBusinessPermit.find().count(function(err, countRequestPermit){ 
    BackUpCertificateIndigency.find().count(function(err, countRequestIndigency){ 
    BackUpWiringandExcavationClearance.find().count(function(err, countRequestWiring){ 
    const requestCount = (countRequestID + countRequestClearance + countRequestPermit + countRequestIndigency + countRequestWiring);
    const finance = Math.round(requestCount * 200).toFixed(2);

      //finished transactions
      CertificateIndigency.find({request:'Finished'}, function(err, allFinished){
        WiringandExcavationClearance.find({request: 'Finished'}, function(err, allFinished){ 
          BusinessPermit.find({request: 'Finished'}, function(err, allFinished){ 
            RequestBrgyId.find({request: 'Finished'}, function(err, allFinisheds){ 
              RequestClearance.find({request: 'Finished'}, function(err, allFinished){ 
           

   Task.find({}, function (err, myTasks){ 
      Update.find({}, function (err, myUpdates){
    BackUpBlotter.find({}, function(err, backupBlotters){ 
    Blotter.find({request: 'Finished'}, function(err, blottersFinished){ 
    Blotter.find({request: 'On-going'}, function(err, blottersOngoing){ 
    Blotter.find({}, function(err, blotters){   
    Residents.find({gender: 'Male'}, function(err, allMale){ 
    Residents.find({gender: 'Female'}, function(err, allFemale){ 
    BackUpResidents.find({}, function(err, allbackupResidents){ 
    Residents.find({}, function(err, allResidents){ 
    Suggestion.find({}, function(err, suggestions){ 
    BackUpWiringandExcavationClearance.find({}, function(err, allWirings){ 
    WiringandExcavationClearance.find({request: 'Approved'}, function(err, approvedWirings){ 
    WiringandExcavationClearance.find({request: 'Pending'}, function(err, requestsWirings){ 
    BackUpCertificateIndigency.find({}, function(err, allIndigency){ 
    CertificateIndigency.find({request: 'Approved'}, function(err, approvedIndigency){ 
    CertificateIndigency.find({request: 'Pending'}, function(err, requestsIndigency){ 
    BackUpBusinessPermit.find({}, function(err, allPermit){ 
    BusinessPermit.find({request: 'Approved'}, function(err, approvedBusinessPermit){ 
    BusinessPermit.find({request: 'Pending'}, function(err, requestsBusinessPermit){ 
    RequestClearance.find({request: 'Approved'}, function(err, approvedClearances){
    RequestClearance.find({request: 'Pending'}, function(err, requestsClearances){ 
    BackUpRequestClearance.find({}, function(err, allClearance){
    RequestBrgyId.find({request: 'Approved'}, function(err, approvedIds){ 
    RequestBrgyId.find({request: 'Pending'}, function(err, requestIds){ 
      BackUpRequestBrgyId.find({}, function(err, allrequestIds){ 
        BackUpAccount.find({}, function(err, allUserAccounts){
      Account.find({}, function(err, allUser){
        Account.find({ accountrole: 'citizen' }, function (err, usersUser) {
          Account.find({ accountrole: 'employee' }, function (err, usersEmployee) {
            Account.find({ accountrole: 'admin' }, function (err, usersAdmin) {
              res.render('adminportal', { allUser, usersUser,usersEmployee, usersAdmin, requestIds, approvedIds, requestsClearances, approvedClearances, requestsBusinessPermit
              , approvedBusinessPermit, approvedIndigency, requestsIndigency, approvedWirings, requestsWirings, countAccounts,  suggestions
            ,allrequestIds, allClearance, allPermit,allIndigency,allWirings, blotters, blottersOngoing,blottersFinished, countBlotter,backupBlotters
          ,allUserAccounts, requestCount,  myTasks, allResidents, myUpdates, allbackupResidents, countResidents, allFemale, allMale, finance, allFinished,allFinisheds,
          username: req.user.username,
          id: req.user.id,
      fullname: req.user.fullname,
      address: req.user.address,
      phone: req.user.phone,
      birthday: req.user.birthday,
      email: req.user.email});
            });
          });
        });
      });
    });});});});});});}); });});});});});});});});});});});});});});});});});});});}); });});});});});});}); });});  }); }); }); }); });


// EDIT USER for Manage Account
app.route("/editinfo/:id")
   .get((req,res, next ) =>{
const id = req.params.id;
  Account.findOneAndUpdate({_id: req.params.id}, req.body, {new:true}, (err, users)=>{
    if(err){
      console.log("Can't retrieve data and edit because of some database problem.")
      next(err);
    } else {
      
      res.render("editinfo",  { users: users });
    } 
});})
   .post((req,res, next ) =>{
  Account.findByIdAndUpdate({_id: req.params.id}, req.body, (err, users) => {
    if (err){
      console.log("Something went wrong to update your data");
      next(err);
    }else{
      if (req.user.accountrole === "admin") {
        res.redirect("/adminportal"); 
      } else if( req.user.accountrole === "employee"){
        res.redirect("/employeeportal");
      }
     
      
    }
  })
});


// EDIT PROFILE
app.route("/usersprofile/:id")
   .get((req,res, next ) =>{
const id = req.params.id;
  Account.findOneAndUpdate({_id: req.params.id}, req.body, {new:true}, (err, users)=>{
    if(err){
      console.log("Can't retrieve data and edit because of some database problem.")
      next(err);
    } else {
      
        res.render("usersprofile",  { users: users });
     
      
    } 
});})
   .post((req,res, next ) =>{
  Account.findByIdAndUpdate({_id: req.params.id}, req.body, (err, users) => {
   

    if (err){
      console.log("Something went wrong to update your data");
      next(err);
    }else{
      
      if (req.user.accountrole === "admin") {
        res.redirect("/adminportal"); 
      } else if (req.user.accountrole === "employee") {
        res.redirect("/employeeportal"); 
      } else if (req.user.accountrole === "citizen"){
        res.redirect("/portal");
      }
           
       }
  })
});


// EDIT PROFILE

  app.get("/changepassword/:id",(req,res, next ) =>{
const id = req.params.id;
Account.findOneAndUpdate({_id: req.params.id}, req.body, {new:true}, (err, users)=>{
  if(err){
    console.log("Can't retrieve data and edit because of some database problem.")
    next(err);
  } else {
    
      res.render("changepassword",  { users: users });
   
  } 
});});
   app.post("/changepassword/:id", (req,res, next ) => {

    Account.findByIdAndUpdate({_id: req.params.id}, req.body, (err, users) => {
      if (err){
        console.log("Something went wrong to update your data");
        next(err);
      }else{
            
               
Account.findOne({ _id: req.params.id },(err, user) => {
  // Check if error connecting
  if (err) {
    console.log(err);// Return error
  } else {
    // Check if user was found in database
    if (!user) {
     console.log("User not found!"); // Return error, user was not found in db
    } else {
            user.changePassword(req.body.password, req.body.newpassword, function(err) {
              if(err) {
                        if(err.name === 'IncorrectPasswordError'){
                           res.redirect("changepassword") // Return error
                        }else {
                            console.log('Something went wrong!! Please try again after sometimes.' );
                            res.redirect("changepassword")
                        }
              } else {
                if (req.user.accountrole === "admin") {
                        res.redirect("/adminportal"); 
                      } else if (req.user.accountrole === "employee") {
                        res.redirect("/employeeportal"); 
                      } else if (req.user.accountrole === "citizen"){
                        res.redirect("/portal");
                      }
                // res.redirect("/adminportal");
              }
       })
    }
  }
});   
                       
            
        
              
             
         }
    })
  
});

//Delete Many 
app.get("/deleteinfo", (req, res, next)=> {
 
  Account.deleteMany({accountrole: "citizen"}, (err, users)=>{
      if(err){
        console.log("Something went wrong");
        next(err);
      } else {
        console.log("Delete Successfully");
        if (req.user.accountrole === "admin") {
          res.redirect("/adminportal"); 
        } else if( req.user.accountrole === "employee"){
          res.redirect("/employeeportal");
        }
      }
});});

app.get("/deleteinfobrgyid", (req, res, next)=> {RequestBrgyId.deleteMany({}, (err, users)=>{if(err){ console.log("Something went wrong");next(err);} else {console.log("Delete Successfully");   if (req.user.accountrole === "admin") {
res.redirect("/adminportal"); } else if( req.user.accountrole === "employee"){res.redirect("/employeeportal");} }});});
app.get("/deleteinfobrgyclearance", (req, res, next)=> {RequestClearance.deleteMany({}, (err, users)=>{if(err){ console.log("Something went wrong");next(err);} else {console.log("Delete Successfully");  if (req.user.accountrole === "admin") {
  res.redirect("/adminportal"); } else if( req.user.accountrole === "employee"){res.redirect("/employeeportal");} }});});
app.get("/deleteinfobrgypermit", (req, res, next)=> {BusinessPermit.deleteMany({}, (err, users)=>{if(err){ console.log("Something went wrong");next(err);} else {console.log("Delete Successfully");  if (req.user.accountrole === "admin") {
  res.redirect("/adminportal"); } else if( req.user.accountrole === "employee"){res.redirect("/employeeportal");} }});});
app.get("/deleteinfobrgyindigency", (req, res, next)=> {CertificateIndigency.deleteMany({}, (err, users)=>{if(err){ console.log("Something went wrong");next(err);} else {console.log("Delete Successfully"); if (req.user.accountrole === "admin") {
  res.redirect("/adminportal"); } else if( req.user.accountrole === "employee"){res.redirect("/employeeportal");} }});});
app.get("/deleteinfobrgywiring", (req, res, next)=> {WiringandExcavationClearance.deleteMany({}, (err, users)=>{if(err){ console.log("Something went wrong");next(err);} else {console.log("Delete Successfully"); if (req.user.accountrole === "admin") {
  res.redirect("/adminportal"); } else if( req.user.accountrole === "employee"){res.redirect("/employeeportal");} }});});

app.get("/deleteinfobackupalluser", (req, res, next)=> {BackUpAccount.deleteMany({}, (err, users)=>{if(err){ console.log("Something went wrong");next(err);} else {console.log("Delete Successfully");  if (req.user.accountrole === "admin") {
  res.redirect("/adminportal"); } else if( req.user.accountrole === "employee"){res.redirect("/employeeportal");} }});});
app.get("/deleteinforbackupresidents", (req, res, next)=> {BackUpResidents.deleteMany({}, (err, users)=>{if(err){ console.log("Something went wrong");next(err);} else {console.log("Delete Successfully");  if (req.user.accountrole === "admin") {
  res.redirect("/adminportal"); } else if( req.user.accountrole === "employee"){res.redirect("/employeeportal");} }});});
app.get("/deleteinfobackupblotter", (req, res, next)=> {BackUpBlotter.deleteMany({}, (err, users)=>{if(err){ console.log("Something went wrong");next(err);} else {console.log("Delete Successfully");  if (req.user.accountrole === "admin") {
  res.redirect("/adminportal"); } else if( req.user.accountrole === "employee"){res.redirect("/employeeportal");} }});});

app.get("/deleteinfobackupbrgyid", (req, res, next)=> {BackUpRequestBrgyId.deleteMany({}, (err, users)=>{if(err){ console.log("Something went wrong");next(err);} else {console.log("Delete Successfully");  if (req.user.accountrole === "admin") {
  res.redirect("/adminportal"); } else if( req.user.accountrole === "employee"){res.redirect("/employeeportal");} }});});
app.get("/deleteinfobackupbrgyclearance", (req, res, next)=> {BackUpRequestClearance.deleteMany({}, (err, users)=>{if(err){ console.log("Something went wrong");next(err);} else {console.log("Delete Successfully");  if (req.user.accountrole === "admin") {
  res.redirect("/adminportal"); } else if( req.user.accountrole === "employee"){res.redirect("/employeeportal");} }});});
app.get("/deleteinfobackupbrgypermit", (req, res, next)=> {BackUpBusinessPermit.deleteMany({}, (err, users)=>{if(err){ console.log("Something went wrong");next(err);} else {console.log("Delete Successfully");  if (req.user.accountrole === "admin") {
  res.redirect("/adminportal"); } else if( req.user.accountrole === "employee"){res.redirect("/employeeportal");} }});});
app.get("/deleteinfobackupbrgyindigency", (req, res, next)=> {BackUpCertificateIndigency.deleteMany({}, (err, users)=>{if(err){ console.log("Something went wrong");next(err);} else {console.log("Delete Successfully");  if (req.user.accountrole === "admin") {
  res.redirect("/adminportal"); } else if( req.user.accountrole === "employee"){res.redirect("/employeeportal");} }});});
app.get("/deleteinfobackupbrgywiring", (req, res, next)=> {BackUpWiringandExcavationClearance.deleteMany({}, (err, users)=>{if(err){ console.log("Something went wrong");next(err);} else {console.log("Delete Successfully");  if (req.user.accountrole === "admin") {
  res.redirect("/adminportal"); } else if( req.user.accountrole === "employee"){res.redirect("/employeeportal");} }});});



 
//-------------------

app.get("/updates-user",function (req, res){
  Update.find({}, function(err, myUpdates){
   res.render('./users/updates-user', {myUpdates, username: req.user.username, id: req.user.id});
  })
 });

 app.get("/upadates-admin",function (req, res){
  Update.find({}, function(err, myUpdates){
   res.render('./page-admin/upadates-admin', {myUpdates, username: req.user.username, id: req.user.id});
  })
 });



app.get("/updates",function (req, res){
  Update.find({}, function(err, myUpdates){
   res.render('updates', {myUpdates});
  })
 });

 //for updates in add new things!
app.post("/tasks", function (req,res){

  const tasks = new Task({
    datetodays: req.body.datetodays,
    postedby: req.body.postedby,
    assignedto: req.body.assignedto,
    subject: req.body.subject,
    description: req.body.description
  });
 tasks.save(function (err){
   if (err){
     console.log(err)
   }else{
    if (req.user.accountrole === "admin") {
      res.redirect("/adminportal"); 
    } else if( req.user.accountrole === "employee"){
      res.redirect("/employeeportal");
    }
   }
 })

});

//for updates in add new things!
app.post("/updates", function (req,res){

  const updatex = new Update({
    datetodays: req.body.datetodays,
    postedby: req.body.postedby,
    title: req.body.title,
    details: req.body.details
  });
 updatex.save(function (err){
   if (err){
     console.log(err)
   }else{
    if (req.user.accountrole === "admin") {
      res.redirect("/adminportal"); 
    } else if( req.user.accountrole === "employee"){
      res.redirect("/employeeportal");
    }
   }
 })

});

// DONATION PROJECT
app.post("/donate", function (req, res){

  
  const newdonate = new Donate({
    donatorsname: req.body.donatorsname,
    honoreename: req.body.honoreename,
    email: req.body.email,
    donation: req.body.donation,
    commment: req.body.commment
  });
  newdonate.save(function (err){
   if (err){
   console.log(err);
   }
   else{
   console.log("Done!");
   }
  })  

});
// VOLUNTEER PROJECT
app.post("/volunteer", function (req, res){

  
  const newdonate = new Volunteer({
    name: req.body.donatorsname,
    organization: req.body.organization,
    email: req.body.email,
    commment: req.body.commment
  });
  newdonate.save(function (err){
   if (err){
   console.log(err);
   }
   else{
   console.log("Done!");
   }
  })  

});







//EXPORT TO EXCEL
app.post('/exportAllUsers',(req,res)=>{
  var wb = XLSX.utils.book_new(); //new workbook
  Account.find((err,data)=>{
      if(err){
          console.log(err)
      }else{
          var temp = JSON.stringify(data);
          temp = JSON.parse(temp);
          var ws = XLSX.utils.json_to_sheet(temp);
          var down = __dirname+'/public/exportdata.xlsx'
         XLSX.utils.book_append_sheet(wb,ws,"sheet1");
         XLSX.writeFile(wb,down);
         res.download(down);
      }
  });
});
app.post('/exportResidents',(req,res)=>{
  var wb = XLSX.utils.book_new(); //new workbook
  Residents.find((err,data)=>{
      if(err){
          console.log(err)
      }else{
          var temp = JSON.stringify(data);
          temp = JSON.parse(temp);
          var ws = XLSX.utils.json_to_sheet(temp);
          var down = __dirname+'/public/exportresidents.xlsx'
         XLSX.utils.book_append_sheet(wb,ws,"sheet1");
         XLSX.writeFile(wb,down);
         res.download(down);
      }
  });
});
app.post('/exportBlotter',(req,res)=>{
  var wb = XLSX.utils.book_new(); //new workbook
  Residents.find((err,data)=>{
      if(err){
          console.log(err)
      }else{
          var temp = JSON.stringify(data);
          temp = JSON.parse(temp);
          var ws = XLSX.utils.json_to_sheet(temp);
          var down = __dirname+'/public/exportblotter.xlsx'
         XLSX.utils.book_append_sheet(wb,ws,"sheet1");
         XLSX.writeFile(wb,down);
         res.download(down);
      }
  });
});
app.post('/exportBackUpAllUsers',(req,res)=>{
  var wb = XLSX.utils.book_new(); //new workbook
  BackUpAccount.find((err,data)=>{
      if(err){
          console.log(err)
      }else{
          var temp = JSON.stringify(data);
          temp = JSON.parse(temp);
          var ws = XLSX.utils.json_to_sheet(temp);
          var down = __dirname+'/public/exportBackupAccountRecords.xlsx'
         XLSX.utils.book_append_sheet(wb,ws,"sheet1");
         XLSX.writeFile(wb,down);
         res.download(down);
      }
  });
});
app.post('/exportBackUpResidents',(req,res)=>{
  var wb = XLSX.utils.book_new(); //new workbook
  BackUpResidents.find((err,data)=>{
      if(err){
          console.log(err)
      }else{
          var temp = JSON.stringify(data);
          temp = JSON.parse(temp);
          var ws = XLSX.utils.json_to_sheet(temp);
          var down = __dirname+'/public/exportBackupResidentsRecord.xlsx'
         XLSX.utils.book_append_sheet(wb,ws,"sheet1");
         XLSX.writeFile(wb,down);
         res.download(down);
      }
  });
});
app.post('/exportBackUpBlotter',(req,res)=>{
  var wb = XLSX.utils.book_new(); //new workbook
  BackUpBlotter.find((err,data)=>{
      if(err){
          console.log(err)
      }else{
          var temp = JSON.stringify(data);
          temp = JSON.parse(temp);
          var ws = XLSX.utils.json_to_sheet(temp);
          var down = __dirname+'/public/exportBackupBlotterRecord.xlsx'
         XLSX.utils.book_append_sheet(wb,ws,"sheet1");
         XLSX.writeFile(wb,down);
         res.download(down);
      }
  });
});
app.post('/exportBackUpRequestIDs',(req,res)=>{
  var wb = XLSX.utils.book_new(); //new workbook
  BackUpRequestBrgyId.find((err,data)=>{
      if(err){
          console.log(err)
      }else{
          var temp = JSON.stringify(data);
          temp = JSON.parse(temp);
          var ws = XLSX.utils.json_to_sheet(temp);
          var down = __dirname+'/public/exportBackupRequestIdsRecord.xlsx'
         XLSX.utils.book_append_sheet(wb,ws,"sheet1");
         XLSX.writeFile(wb,down);
         res.download(down);
      }
  });
});
app.post('/exportBackUpRequestClearance',(req,res)=>{
  var wb = XLSX.utils.book_new(); //new workbook
  BackUpRequestClearance.find((err,data)=>{
      if(err){
          console.log(err)
      }else{
          var temp = JSON.stringify(data);
          temp = JSON.parse(temp);
          var ws = XLSX.utils.json_to_sheet(temp);
          var down = __dirname+'/public/exportBackupRequestClearanceRecord.xlsx'
         XLSX.utils.book_append_sheet(wb,ws,"sheet1");
         XLSX.writeFile(wb,down);
         res.download(down);
      }
  });
});

app.post('/exportBackUpRequestPermit',(req,res)=>{
  var wb = XLSX.utils.book_new(); //new workbook
  BackUpBusinessPermit.find((err,data)=>{
      if(err){
          console.log(err)
      }else{
          var temp = JSON.stringify(data);
          temp = JSON.parse(temp);
          var ws = XLSX.utils.json_to_sheet(temp);
          var down = __dirname+'/public/exportBackupRequestPermitRecord.xlsx'
         XLSX.utils.book_append_sheet(wb,ws,"sheet1");
         XLSX.writeFile(wb,down);
         res.download(down);
      }
  });
});
app.post('/exportBackUpRequestIndigency',(req,res)=>{
  var wb = XLSX.utils.book_new(); //new workbook
  BackUpCertificateIndigency.find((err,data)=>{
      if(err){
          console.log(err)
      }else{
          var temp = JSON.stringify(data);
          temp = JSON.parse(temp);
          var ws = XLSX.utils.json_to_sheet(temp);
          var down = __dirname+'/public/exportBackupRequestIndigencyRecord.xlsx'
         XLSX.utils.book_append_sheet(wb,ws,"sheet1");
         XLSX.writeFile(wb,down);
         res.download(down);
      }
  });
});
app.post('/exportBackUpRequestWiring',(req,res)=>{
  var wb = XLSX.utils.book_new(); //new workbook
  BackUpWiringandExcavationClearance.find((err,data)=>{
      if(err){
          console.log(err)
      }else{
          var temp = JSON.stringify(data);
          temp = JSON.parse(temp);
          var ws = XLSX.utils.json_to_sheet(temp);
          var down = __dirname+'/public/exportBackupRequestWiringandExcavationRecord.xlsx'
         XLSX.utils.book_append_sheet(wb,ws,"sheet1");
         XLSX.writeFile(wb,down);
         res.download(down);
      }
  });
});

//ADMIN PERKS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//this is for Account User
app.route("/createnewaccount")
   .get(function(req, res){
    res.render("createnewaccount");
   })
  .post( async function(req, res){

    const backupaccount = new BackUpAccount({
      username: req.body.username,
      email: req.body.email,
      fullname: req.body.fullname,
      accountrole: req.body.accountrole });
        Account.register({
          username: req.body.username,
          email: req.body.email,
          fullname: req.body.fullname,
          accountrole: req.body.accountrole
        }, req.body.password,   function(err, user){
          if(err){
          console.log(err);
          res.redirect("/createnewaccount");
          } else {
         
       backupaccount.save();
          res.redirect("/adminportal");
         
          }
  });   

});
  
// -------------------------------------------------------------------------------------REQUEST FOR CERTIFICATION OF WIRINGS-- use for user
app.get("/reqwiringsclearance", function (req, res) {
     res.render("./pages/reqwiringsclearance", {
      id: req.user.id,
       username: req.user.username,
      fullname: req.user.fullname,
      email: req.user.email,
      address: req.user.address,
      phone: req.user.phone
    });
});

app.post("/reqwiringsclearance-req", upload, async function (req, res) {


  try{
    const result = "Pending"

    const requestIDuser = new WiringandExcavationClearance({
      fullname: req.body.fullname,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      purposeofreq: req.body.purposeofreq,
      ctc: req.body.ctc,
      image: req.file.filename,
     
      request: result });
     
      await requestIDuser.save();
      const backuprequestIDuser = new BackUpWiringandExcavationClearance({
        fullname: req.body.fullname,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      purposeofreq: req.body.purposeofreq,
      ctc: req.body.ctc,
      
      image: req.file.filename,
      request: result });
     
        await backuprequestIDuser.save();
        res.redirect("portal");
      } catch(err){
        console.log(err)
        console.log(req.file);
        res.redirect("/reqwiringsclearance-req")
      }

});


app.post("/WiringandExcavationForm", upload, async function (req, res) {

  try{
    const result = "Pending"
    
    const requestIDuser = new WiringandExcavationClearance({
      fullname: req.body.fullname,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      purposeofreq: req.body.purposeofreq,
      ctc: req.body.ctc,
      image: req.file.filename,
    
      request: result });
     
      await requestIDuser.save();
      const backuprequestIDuser = new BackUpWiringandExcavationClearance({
        fullname: req.body.fullname,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      purposeofreq: req.body.purposeofreq,
      ctc: req.body.ctc,
      
      image: req.file.filename,
      request: result });
     
        await backuprequestIDuser.save();
        if (req.user.accountrole === "admin") {
          res.redirect("/adminportal"); 
        } else if( req.user.accountrole === "employee"){
          res.redirect("/employeeportal");
        }
      } catch(err){
        console.log(err)
        console.log(req.file);
        res.redirect("/WiringandExcavationForm")
      }

});


app.route("/adminviewwirings/:id")
 .get((req,res, next ) =>{
  const id = req.params.id;
  WiringandExcavationClearance.findOneAndUpdate({_id: req.params.id}, req.body, {new:true}, (err, users)=>{
      if(err){
        console.log("Can't retrieve data and edit because of some database problem.")
        next(err);
      } else {
        res.render("./page-admin/adminviewwirings",  { users: users });
      }
       });
  })
.post((req,res, next ) =>{
    WiringandExcavationClearance.findByIdAndUpdate({_id: req.params.id}, req.body, (err, users) => {
      if (err){
        console.log("Something went wrong to update your data");
        next(err);
      }else{
        if (req.user.accountrole === "admin") {
          res.redirect("/adminportal"); 
        } else if( req.user.accountrole === "employee"){
          res.redirect("/employeeportal");
        }
  
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


    
    app.get("/send-message-request-wiring/:id", function (req, res){
      WiringandExcavationClearance.findOneAndUpdate({_id: req.params.id}, req.body,  {new:true}, (err, users)=>{
      
        if(err){
          console.log("Can't retrieve data and edit because of some database problem.")
          next(err);
        } else {
          
          res.render("./page-admin/requestwiringmessage",  { users: users });
        }
  
      })
    
     });
     
  app.post("/send-message-request-wiring/:id", upload,  (req,res, next ) =>{
  
  
   WiringandExcavationClearance.findByIdAndUpdate({_id: req.params.id}, req.body, (err, users) => {
         
      
         if (err){
           console.log("Something went wrong to update your data");
           next(err);
         }else{        
           
          var mailOptions = {
          
            from: '<barangayportalx@gmail.com>', // sender address
            to: req.body.email, // list of receivers
            subject: 'Request for Wiring and Excavation Permit <Barangay Portal>' ,
            template: 'email', // the name of the template file i.e email.handlebars
            context:{
                name: 'Nks', // replace {{name}} with Adebola
                company: 'My Company', // replace {{company}} with My Company
               
            },
            attachments: [{ filename: "terms.pdf", path: "./attachments/terms.pdf"},{ filename: "wiringandexcavtionpermit.pdf", path: "./attachments/excavation.pdf"  }],
            // html:  "<p><b>Hello Mr/Ms/Mrs. </b> ${name}, </p> <br> <br> I got your request now! <br><br>Thank you for using our website and following the protocol. Before proceeding to the next step I would like you to visit the link attached to this email and read our Terms and Conditions in receiving this file. I hope you understand and please do follow the steps carefully. <br> <br> Your appointment schedule will be __________and look for Mrs. Eskima, our admin for printing ids. Print this email for validation and bring it with you. <br><br>Thank you very much!<br><br>Sincerely, <br>Barangay Portal"
            html: req.body.text
            ,
           
          };
          
          // trigger the sending of the E-mail
          transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            
            if (req.user.accountrole === "admin") {
              res.redirect("/adminportal"); 
              console.log('Message sent: ' + info.response);
            } else if( req.user.accountrole === "employee"){
              res.redirect("/employeeportal");
              console.log('Message sent: ' + info.response);
            }
          });
          
     
         }
       }); 
   
     
   
     });


// --------------------------------------------------------------------RESIDENT INFORMATION

  app.post("/residents", async function(req, res){
    try {
      const residents = new Residents({
        precinct: req.body.precinct,
        daterecorded: req.body.daterecorded,
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        middleinitial: req.body.middleinitial,
        birthday: req.body.birthday,
        birthplace: req.body.birthplace,
        civilstatus: req.body.civilstatus, 
        email: req.body.email,
        phone: req.body.phone,
        age: req.body.age,
        schoolattainment: req.body.schoolattainment,
        profession: req.body.profession,
        blklot: req.body.blklot,
        street: req.body.street,
        brgy: req.body.brgy,
        province: req.body.province,
        citizen: req.body.citizen,
        zipcode: req.body.zipcode
      });
      await residents.save();
      const backupresidents = new BackUpResidents({
        precinct: req.body.precinct,
        daterecorded: req.body.daterecorded,
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        middleinitial: req.body.middleinitial,
        birthday: req.body.birthday,
        age: req.body.age,
        birthplace: req.body.birthplace,
        civilstatus: req.body.civilstatus, 
        email: req.body.email,
        phone: req.body.phone,
        schoolattainment: req.body.schoolattainment,
        profession: req.body.profession,
        blklot: req.body.blklot,
        street: req.body.street,
        brgy: req.body.brgy,
        province: req.body.province,
        citizen: req.body.citizen,
        zipcode: req.body.zipcode
      });
      await backupresidents.save();
      if (req.user.accountrole === "admin") {
        res.redirect("/adminportal"); 
      } else if( req.user.accountrole === "employee"){
        res.redirect("/employeeportal");
      }
    } catch(err){
      console.log(err)
      if (req.user.accountrole === "admin") {
        res.redirect("/adminportal"); 
      } else if( req.user.accountrole === "employee"){
        res.redirect("/employeeportal");
      }
    }
  })


app.route("/adminsviewresidents/:id")
  .get((req,res, next ) =>{
    const id = req.params.id;
    Residents.findOneAndUpdate({_id: req.params.id}, req.body, {new:true}, (err, users)=>{
        if(err){
          console.log("Can't retrieve data and edit because of some database problem.")
          next(err);
        } else {
          res.render("./page-admin/adminsviewresidents",  { users: users });
        }
        
    });
    
    })
  
  .post((req,res, next ) =>{
      Residents.findByIdAndUpdate({_id: req.params.id}, req.body, (err, users) => {
        if (err){
          console.log("Something went wrong to update your data");
          next(err);
        }else{
          if (req.user.accountrole === "admin") {
            res.redirect("/adminportal"); 
          } else if( req.user.accountrole === "employee"){
            res.redirect("/employeeportal");
          }
    
        }
      })
    });
  
  
    


// ------------------------------------------------------------------------BLOTTERRR

app.post("/blotter", async function (req, res){

  try{
    const result = "On-going"
    
    const blotter = new Blotter({
      daterecorded: req.body.daterecorded,
      request: result,
      fullnamecomplainant: req.body.fullnamecomplainant,
      email: req.body.email,
      phone: req.body.phone,
      fullnamedefendant: req.body.fullnamedefendant,
      address: req.body.address,
      date: req.body.date,
      time: req.body.time,
      incident: req.body.incident
    });
    await blotter.save();
    const backupblotter = new BackUpBlotter({
      daterecorded: req.body.daterecorded,
      request: result,
      fullnamecomplainant: req.body.fullnamecomplainant,
      email: req.body.email,
      phone: req.body.phone,
      fullnamedefendant: req.body.fullnamedefendant,
      address: req.body.address,
      date: req.body.date,
      time: req.body.time,
      incident: req.body.incident
    });
    await backupblotter.save();
    if (req.user.accountrole === "admin") {
      res.redirect("/adminportal"); 
    } else if( req.user.accountrole === "employee"){
      res.redirect("/employeeportal");
    }
      } catch(err){
        console.log(err)
        if (req.user.accountrole === "admin") {
          res.redirect("/adminportal"); 
        } else if( req.user.accountrole === "employee"){
          res.redirect("/employeeportal");
        }
      }


});


//--------ADMIN VIEW for Updating and Viewing REQUEST FOR BRGY  CLEARANCE Application Form
app.get("/adminsviewblotter/:id", (req,res, next ) =>{
  const id = req.params.id;
  Blotter.findOneAndUpdate({_id: req.params.id}, req.body, {new:true}, (err, users)=>{
      if(err){
        console.log("Can't retrieve data and edit because of some database problem.")
        next(err);
      } else {
        res.render("./page-admin/adminsviewblotter",  { users: users });
      }
      
  });
  
  });

app.post("/adminsviewblotter/:id", (req,res, next ) =>{

    Blotter.findByIdAndUpdate({_id: req.params.id}, req.body, (err, users) => {
      if (err){
        console.log("Something went wrong to update your data");
        next(err);
      }else{
        if (req.user.accountrole === "admin") {
          res.redirect("/adminportal"); 
        } else if( req.user.accountrole === "employee"){
          res.redirect("/employeeportal");
        }
  
      }
    })
  });

// app.get("/adminviewreqclearanceapproved/:id", (req,res, next ) =>{
//     const id = req.params.id;
//     RequestClearance.findOneAndUpdate({_id: req.params.id}, req.body, {new:true}, (err, users)=>{
//         if(err){
//           console.log("Can't retrieve data and edit because of some database problem.")
//           next(err);
//         } else {
//           res.render("./page-admin/adminviewreqclearanceapproved",  { users: users });
//         }
        
//     });
    
//     });

// -------------------------------------------------------------------------------------REQUEST FOR CERTIFICATION OF INDIGENCY-- use for user
app.get("/reqindigency", function (req, res) {
  res.render("./pages/reqindigency", {
    id: req.user.id,
    username: req.user.username,
    fullname: req.user.fullname,
    email: req.user.email,
    phone: req.user.phone,
    address: req.user.address,
    birthday: req.user.birthday
  });
});
app.post("/reqindigency-req", upload, async function (req, res) {

  
  try{
    const result = "Pending"
   
    const requestIDuser = new CertificateIndigency({
      fullname: req.body.fullname,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      birthday: req.body.birthday,
      datestarted: req.body.datestarted,
      purposeofreq: req.body.purposeofreq,
      image: req.file.filename,
      ctc: req.body.ctc,
    
      request: result});
      await requestIDuser.save();
      const backuprequestIDuser = new BackUpCertificateIndigency({
        fullname: req.body.fullname,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
        birthday: req.body.birthday,
        datestarted: req.body.datestarted,
        image: req.file.filename,
        purposeofreq: req.body.purposeofreq,
        ctc: req.body.ctc,
       
        request: result});
        await backuprequestIDuser.save();
        res.redirect("portal");
      } catch(err){
        console.log(err)
        console.log(req.file);
        res.redirect("./pages/reqindigency")
      }





});


// Admin Add Request Form for Certificate for Indigency--- user from admin's view !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.post("/RequestIndigencyForm",upload, async function (req, res) {

  try{
    const result = "Pending"
  
    const requestIDuser = new CertificateIndigency({
      fullname: req.body.fullname,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      birthday: req.body.birthday,
      datestarted: req.body.datestarted,
      purposeofreq: req.body.purposeofreq,
      image: req.file.filename,
      ctc: req.body.ctc,
      
      request: result});
      await requestIDuser.save();
      const backuprequestIDuser = new BackUpCertificateIndigency({
        fullname: req.body.fullname,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
        birthday: req.body.birthday,
        datestarted: req.body.datestarted,
        image: req.file.filename,
        purposeofreq: req.body.purposeofreq,
        ctc: req.body.ctc,
       
        request: result});
        await backuprequestIDuser.save();
        if (req.user.accountrole === "admin") {
          res.redirect("/adminportal"); 
        } else if( req.user.accountrole === "employee"){
          res.redirect("/employeeportal");
        }
      } catch(err){
        console.log(err)
        console.log(req.file);
        res.redirect("/RequestIndigencyForm")
      }
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
        if (req.user.accountrole === "admin") {
          res.redirect("/adminportal"); 
        } else if( req.user.accountrole === "employee"){
          res.redirect("/employeeportal");
        }
  
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

    
    app.get("/send-message-request-indigency/:id", function (req, res){
      CertificateIndigency.findOneAndUpdate({_id: req.params.id}, req.body,  {new:true}, (err, users)=>{
      
        if(err){
          console.log("Can't retrieve data and edit because of some database problem.")
          next(err);
        } else {
          
          res.render("./page-admin/requestindigencymsg",  { users: users });
        }
  
      })
    
     });
     
  app.post("/send-message-request-indigency/:id", upload,  (req,res, next ) =>{
  
  
   CertificateIndigency.findByIdAndUpdate({_id: req.params.id}, req.body, (err, users) => {
         
      
         if (err){
           console.log("Something went wrong to update your data");
           next(err);
         }else{        
           
          var mailOptions = {
          
            from: '<barangayportalx@gmail.com>', // sender address
            to: req.body.email, // list of receivers
            subject: 'Request for Certification of Indigency <Barangay Portal>' ,
            template: 'email', // the name of the template file i.e email.handlebars
            context:{
                name: 'Nks', // replace {{name}} with Adebola
                company: 'My Company', // replace {{company}} with My Company
               
            },
            attachments: [{ filename: "terms.pdf", path: "./attachments/terms.pdf"},{ filename: "certindigency.pdf", path: "./attachments/indigency.pdf"  }],
            // html:  "<p><b>Hello Mr/Ms/Mrs. </b> ${name}, </p> <br> <br> I got your request now! <br><br>Thank you for using our website and following the protocol. Before proceeding to the next step I would like you to visit the link attached to this email and read our Terms and Conditions in receiving this file. I hope you understand and please do follow the steps carefully. <br> <br> Your appointment schedule will be __________and look for Mrs. Eskima, our admin for printing ids. Print this email for validation and bring it with you. <br><br>Thank you very much!<br><br>Sincerely, <br>Barangay Portal"
            html: req.body.text
            ,
           
          };
          
          // trigger the sending of the E-mail
          transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            
            if (req.user.accountrole === "admin") {
              res.redirect("/adminportal"); 
              console.log('Message sent: ' + info.response);
            } else if( req.user.accountrole === "employee"){
              res.redirect("/employeeportal");
              console.log('Message sent: ' + info.response);
            }
          });
          
     
         }
       }); 
   
     
   
     });



// -------------------------------------------------------------------------------------REQUEST FOR BUSINESS PERMIT-- use for user
app.post("/reqbusinesspermit-req", upload, async function (req, res) {

  
  try{
    const result = "Pending"
    
    const requestIDuser = new BusinessPermit({
      fullname: req.body.fullname,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      businessname: req.body.businessname,
      businessaddress: req.body.businessaddress,
      image: req.file.filename,
    
      request: result});
      await requestIDuser.save();
      const backuprequestIDuser = new BackUpBusinessPermit({
        fullname: req.body.fullname,
      address: req.body.address,
      email: req.body.email,
    
      phone: req.body.phone,
      businessname: req.body.businessname,
      businessaddress: req.body.businessaddress,
      image: req.file.filename,
      request: result});
        await backuprequestIDuser.save();
        res.redirect("portal");
      } catch(err){
        console.log(err)
        console.log(req.file);
        res.redirect("./pages/reqbrgyid")
      }




});

// Admin Add Request Form for Business Permit --- user from admin's view !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

app.post("/BusinessPermitForm", upload, async function (req, res) {

  try{
    const result = "Pending"
    
    const requestIDuser = new BusinessPermit({
      fullname: req.body.fullname,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      businessname: req.body.businessname,
      businessaddress: req.body.businessaddress,
      image: req.file.filename,
     
      request: result});
      await requestIDuser.save();
      const backuprequestIDuser = new BackUpBusinessPermit({
        fullname: req.body.fullname,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,

      businessname: req.body.businessname,
      businessaddress: req.body.businessaddress,
      image: req.file.filename,
      request: result});
        await backuprequestIDuser.save();
        if (req.user.accountrole === "admin") {
          res.redirect("/adminportal"); 
        } else if( req.user.accountrole === "employee"){
          res.redirect("/employeeportal");
        }
      } catch(err){
        console.log(err)
        console.log(req.file);
        res.redirect("BusinessPermitForm")
      }

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
        if (req.user.accountrole === "admin") {
          res.redirect("/adminportal"); 
        } else if( req.user.accountrole === "employee"){
          res.redirect("/employeeportal");
        }
  
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


    app.get("/send-message-request-permit/:id", function (req, res){
      BusinessPermit.findOneAndUpdate({_id: req.params.id}, req.body,  {new:true}, (err, users)=>{
      
        if(err){
          console.log("Can't retrieve data and edit because of some database problem.")
          next(err);
        } else {
          
          res.render("./page-admin/requestpermitmsg",  { users: users });
        }
  
      })
    
     });
     
  app.post("/send-message-request-permit/:id", upload,  (req,res, next ) =>{
  
  
    BusinessPermit.findByIdAndUpdate({_id: req.params.id}, req.body, (err, users) => {
         
      
         if (err){
           console.log("Something went wrong to update your data");
           next(err);
         }else{        
           
          var mailOptions = {
          
            from: '<barangayportalx@gmail.com>', // sender address
            to: req.body.email, // list of receivers
            subject: 'Request for Barangay Business Permit <Barangay Portal>' ,
            template: 'email', // the name of the template file i.e email.handlebars
            context:{
                name: 'Nks', // replace {{name}} with Adebola
                company: 'My Company', // replace {{company}} with My Company
               
            },
            attachments: [{ filename: "terms.pdf", path: "./attachments/terms.pdf" }, { filename: "businesspermit.pdf", path: "./attachments/business.pdf"  }],
            // html:  "<p><b>Hello Mr/Ms/Mrs. </b> ${name}, </p> <br> <br> I got your request now! <br><br>Thank you for using our website and following the protocol. Before proceeding to the next step I would like you to visit the link attached to this email and read our Terms and Conditions in receiving this file. I hope you understand and please do follow the steps carefully. <br> <br> Your appointment schedule will be __________and look for Mrs. Eskima, our admin for printing ids. Print this email for validation and bring it with you. <br><br>Thank you very much!<br><br>Sincerely, <br>Barangay Portal"
            html: req.body.text
            ,
           
          };
          
          // trigger the sending of the E-mail
          transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            
            if (req.user.accountrole === "admin") {
              res.redirect("/adminportal"); 
              console.log('Message sent: ' + info.response);
            } else if( req.user.accountrole === "employee"){
              res.redirect("/employeeportal");
              console.log('Message sent: ' + info.response);
            }
          });
          
     
         }
       }); 
   
     
   
     });

// ------------------------------------------------------------------------------------------REQUEST FOR BRGY CLEARANCE FORM -- use for user


app.post("/reqbrgyclerance-req", upload, async function (req, res) {


  try{
    const result = "Pending"

    const requestIDuser = new RequestClearance({
      fullname: req.body.fullname,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      age: req.body.age,
      civilstatus: req.body.civilstatus,
      purposeofreq: req.body.purposeofreq,
      ctc: req.body.ctc,
     
      image: req.file.filename,

      request: result});
      await requestIDuser.save();
      const backuprequestIDuser = new BackUpRequestClearance({
        fullname: req.body.fullname,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
       
        age: req.body.age,
        civilstatus: req.body.civilstatus,
        purposeofreq: req.body.purposeofreq,
        ctc: req.body.ctc,
        image: req.file.filename,
        
        request: result});
        await backuprequestIDuser.save();
        res.redirect("portal");
      } catch(err){
        console.log(err)
        console.log(req.file);
        res.redirect("/reqbrgyclerance-req")
      }

});

// Admin Add Request Form for Clearance --- user from admin's view !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.post("/RequestClearanceForm", upload, async function (req, res) {

  try{
    const result = "Pending"
    
    const requestIDuser = new RequestClearance({
      fullname: req.body.fullname,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      age: req.body.age,
      civilstatus: req.body.civilstatus,
      purposeofreq: req.body.purposeofreq,
      ctc: req.body.ctc,
      
      image: req.file.filename,

      request: result});
      await requestIDuser.save();
      const backuprequestIDuser = new BackUpRequestClearance({
        fullname: req.body.fullname,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
        age: req.body.age,
        civilstatus: req.body.civilstatus,
        purposeofreq: req.body.purposeofreq,
        ctc: req.body.ctc,
        
        image: req.file.filename,
        
        request: result});
        await backuprequestIDuser.save();
        if (req.user.accountrole === "admin") {
          res.redirect("/adminportal"); 
        } else if( req.user.accountrole === "employee"){
          res.redirect("/employeeportal");
        }
      } catch(err){
        console.log(err)
        console.log(req.file);
        res.redirect("/reqbrgyclerance-req")
      }


});


//--------ADMIN VIEW for Updating and Viewing REQUEST FOR BRGY  CLEARANCE Application Form
// app.get("/adminviewreqclearance/:id", (req,res, next ) =>{
//   const id = req.params.id;
//   RequestClearance.findOneAndUpdate({_id: req.params.id}, req.body, {new:true}, (err, users)=>{
//       if(err){
//         console.log("Can't retrieve data and edit because of some database problem.")
//         next(err);
//       } else {
//         res.render("./page-admin/adminviewreqclearance",  { users: users });
//       }
      
//   });
  
//   });
  
//   app.post("/adminviewreqclearance/:id", (req,res, next ) =>{


//     RequestClearance.findByIdAndUpdate({_id: req.params.id}, req.body, (err, users) => {
//        if (err){
//          console.log("Something went wrong to update your data");
//          next(err);
//        }else{
//          if (req.user.accountrole === "admin") {
//            res.redirect("/adminportal"); 
//          } else if( req.user.accountrole === "employee"){
//            res.redirect("/employeeportal");
//          }
   
//        }
//      }); 
//    });

   app.get("/adminviewreqclearance/:id", upload,   (req,res ) =>{
    const id = req.params.id;
  
  
    RequestClearance.findOneAndUpdate({_id: req.params.id}, req.body,  {new:true}, (err, users)=>{
      
        if(err){
          console.log("Can't retrieve data and edit because of some database problem.")
          next(err);
        } else {
          res.render("./page-admin/adminviewreqid",  { users: users });
        }
  
      })
   
  
    });
  
    app.post("/adminviewreqclearance/:id", upload,  (req,res, next ) =>{
  
  
     RequestClearance.findByIdAndUpdate({_id: req.params.id}, req.body, (err, users) => {
        
     
        if (err){
          console.log("Something went wrong to update your data");
          next(err);
        }else{
          if (req.user.accountrole === "admin") {
            res.redirect("/adminportal"); 
          } else if( req.user.accountrole === "employee"){
            res.redirect("/employeeportal");
          }
        }
      }); 
    });
  
  
    //--------ADMIN VIEW for APPROVED REQUEST FOR BRGY ID Application Form
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
  
    

  
// app.get("/adminviewreqclearanceapproved/:id", (req,res, next ) =>{
//     const id = req.params.id;
//     RequestClearance.findOneAndUpdate({_id: req.params.id}, req.body, {new:true}, (err, users)=>{
//         if(err){
//           console.log("Can't retrieve data and edit because of some database problem.")
//           next(err);
//         } else {
//           res.render("./page-admin/adminviewreqclearanceapproved",  { users: users });
//         }
        
//     });
    
//     });


app.get("/send-message-request-clearance/:id", function (req, res){
      RequestClearance.findOneAndUpdate({_id: req.params.id}, req.body,  {new:true}, (err, users)=>{
      
        if(err){
          console.log("Can't retrieve data and edit because of some database problem.")
          next(err);
        } else {
          
          res.render("./page-admin/requestclearancemsg",  { users: users });
        }
  
      })
    
     });
     
  app.post("/send-message-request-clearance/:id", upload,  (req,res, next ) =>{
  
  
      RequestClearance.findByIdAndUpdate({_id: req.params.id}, req.body, (err, users) => {
         
      
         if (err){
           console.log("Something went wrong to update your data");
           next(err);
         }else{        
           
          var mailOptions = {
          
            from: '<barangayportalx@gmail.com>', // sender address
            to: req.body.email, // list of receivers
            subject: 'Request for Barangay Clearance <Barangay Portal>!' ,
            template: 'email', // the name of the template file i.e email.handlebars
            context:{
                name: 'Nks', // replace {{name}} with Adebola
                company: 'My Company', // replace {{company}} with My Company
               
            },
            attachments: [{ filename: "terms.pdf", path: "./attachments/terms.pdf" }, { filename: "clearance.pdf", path: "./attachments/clearance.pdf"  }],
            // html:  "<p><b>Hello Mr/Ms/Mrs. </b> ${name}, </p> <br> <br> I got your request now! <br><br>Thank you for using our website and following the protocol. Before proceeding to the next step I would like you to visit the link attached to this email and read our Terms and Conditions in receiving this file. I hope you understand and please do follow the steps carefully. <br> <br> Your appointment schedule will be __________and look for Mrs. Eskima, our admin for printing ids. Print this email for validation and bring it with you. <br><br>Thank you very much!<br><br>Sincerely, <br>Barangay Portal"
            html: req.body.text
            ,
           
          };
          
          // trigger the sending of the E-mail
          transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            
            if (req.user.accountrole === "admin") {
              res.redirect("/adminportal"); 
              console.log('Message sent: ' + info.response);
            } else if( req.user.accountrole === "employee"){
              res.redirect("/employeeportal");
              console.log('Message sent: ' + info.response);
            }
          });
          
     
         }
       }); 
   
     
   
     });
  


// ------------------------------------------------------------------------------------------------REQUEST FOR ID FORM -- use for user
app.post("/reqbrgyid-req", upload, async function (req, res) {


  try{
    const result = "Pending";
   

    const requestIDuser = new RequestBrgyId({
      fullname: req.body.fullname,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      age: req.body.age,
      civilstatus: req.body.civilstatus,
      purposeofreq: req.body.purposeofreq,
      ctc: req.body.ctc,
      image: req.file.filename,
     

      request: result});
      await requestIDuser.save();
      const backuprequestIDuser = new BackUpRequestBrgyId({
        fullname: req.body.fullname,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
        age: req.body.age,
        civilstatus: req.body.civilstatus,
        purposeofreq: req.body.purposeofreq,
        ctc: req.body.ctc,
        image: req.file.filename,
        
        request: result});
        await backuprequestIDuser.save();
        res.redirect("portal");
      } catch(err){
        console.log(err)
        console.log(req.file);
        res.redirect("./pages/reqbrgyid")
      }

});

// Admin Add Request Form  --- user from admin's view !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.post("/RequestIdForm", upload, async function (req, res) {


  try{
    const result = "Pending";
   
    const requestIDuser = new RequestBrgyId({
      fullname: req.body.fullname,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      age: req.body.age,
      civilstatus: req.body.civilstatus,
      purposeofreq: req.body.purposeofreq,
      ctc: req.body.ctc,
      image: req.file.filename,
     
      request: result});
      await requestIDuser.save();
      const backuprequestIDuser = new BackUpRequestBrgyId({
        fullname: req.body.fullname,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
        age: req.body.age,
        civilstatus: req.body.civilstatus,
        purposeofreq: req.body.purposeofreq,
        ctc: req.body.ctc,
        image: req.file.filename,
       
        request: result});
        await backuprequestIDuser.save();
        if (req.user.accountrole === "admin") {
          res.redirect("/adminportal"); 
        } else if( req.user.accountrole === "employee"){
          res.redirect("/employeeportal");
        }
      } catch(err){
        console.log(err)
        console.log(req.file);
        res.redirect("/RequestIdForm")
      }

});




//--------ADMIN VIEW for Updating and Viewing REQUEST FOR BRGY ID Application Form
app.get("/adminviewreqid/:id", upload,   (req,res ) =>{
  const id = req.params.id;


   RequestBrgyId.findOneAndUpdate({_id: req.params.id}, req.body,  {new:true}, (err, users)=>{
    
      if(err){
        console.log("Can't retrieve data and edit because of some database problem.")
        next(err);
      } else {
        res.render("./page-admin/adminviewreqid",  { users: users });
      }

    })
 

  });

  app.post("/adminviewreqid/:id", upload,  (req,res, next ) =>{


   RequestBrgyId.findByIdAndUpdate({_id: req.params.id}, req.body, (err, users) => {
      
   
      if (err){
        console.log("Something went wrong to update your data");
        next(err);
      }else{
        if (req.user.accountrole === "admin") {
          res.redirect("/adminportal"); 
        } else if( req.user.accountrole === "employee"){
          res.redirect("/employeeportal");
        }
  
      }
    }); 

  

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

  
// //EMAIL
// app.post("/sendmail", (req, res) =>{
//   // point to the template folder
// const handlebarOptions = {
//   viewEngine: {
//       partialsDir: path.resolve('./emailfolder'),
//       defaultLayout: false,
//   },
//   viewPath: path.resolve('./emailfolder'),
// };

// // use a template file with nodemailer
// transporter.use('compile', hbs(handlebarOptions))




// var mailOptions = {

//   from: '<barangayportalx@gmail.com>', // sender address
//   to: 'julietnicanor1996@gmail.com', // list of receivers
//   subject: 'Hello Barangay Citizen!',
//   template: 'email', // the name of the template file i.e email.handlebars
//   context:{
//       name: "Citizen", // replace {{name}} with Adebola
//       company: 'My Company', // replace {{company}} with My Company
     
//   },
//   attachments: [{ filename: "terms.pdf", path: "./attachments/terms.pdf" }],
// };

// // trigger the sending of the E-mail
// transporter.sendMail(mailOptions, function(error, info){
//   if(error){
//       return console.log(error);
//   }
  
//   if (req.user.accountrole === "admin") {
//     res.redirect("/adminportal"); 
//     console.log('Message sent: ' + info.response);
//   } else if( req.user.accountrole === "employee"){
//     res.redirect("/employeeportal");
//     console.log('Message sent: ' + info.response);
//   }
// });
// });





  app.get("/send-message-request-id/:id", function (req, res){
    RequestBrgyId.findOneAndUpdate({_id: req.params.id}, req.body,  {new:true}, (err, users)=>{
    
      if(err){
        console.log("Can't retrieve data and edit because of some database problem.")
        next(err);
      } else {
        
        res.render("./page-admin/requestidmsg",  { users: users });
      }

    })
  
   });
   
   app.post("/send-message-request-id/:id", upload,  (req,res, next ) =>{


    RequestBrgyId.findByIdAndUpdate({_id: req.params.id}, req.body, (err, users) => {
       
    
       if (err){
         console.log("Something went wrong to update your data");
         next(err);
       }else{        
         
        var mailOptions = {
        
          from: '<barangayportalx@gmail.com>', // sender address
          to: req.body.email, // list of receivers
          subject: 'Request for Barangay ID <Barangay Portal>' ,
          template: 'email', // the name of the template file i.e email.handlebars
          context:{
              name: 'Nks', // replace {{name}} with Adebola
              company: 'My Company', // replace {{company}} with My Company
             
          },
          attachments: [{ filename: "terms.pdf", path: "./attachments/terms.pdf" }, {filename: "appointmentslip.pdf", path: "./attachments/appointmentslip.pdf" }],
          // html:  "<p><b>Hello Mr/Ms/Mrs. </b> ${name}, </p> <br> <br> I got your request now! <br><br>Thank you for using our website and following the protocol. Before proceeding to the next step I would like you to visit the link attached to this email and read our Terms and Conditions in receiving this file. I hope you understand and please do follow the steps carefully. <br> <br> Your appointment schedule will be __________and look for Mrs. Eskima, our admin for printing ids. Print this email for validation and bring it with you. <br><br>Thank you very much!<br><br>Sincerely, <br>Barangay Portal"
          html: req.body.text
          ,
         
        };
        
        // trigger the sending of the E-mail
        transporter.sendMail(mailOptions, function(error, info){
          if(error){
              return console.log(error);
          }
          
          if (req.user.accountrole === "admin") {
            res.redirect("/adminportal"); 
            console.log('Message sent: ' + info.response);
          } else if( req.user.accountrole === "employee"){
            res.redirect("/employeeportal");
            console.log('Message sent: ' + info.response);
          }
        });
        
   
       }
     }); 
 
   
 
   });


//---------------------------------------

// app.listen(process.env.PORT || 3000, function () {
//   console.log("Server started on port 3000");
// });
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});