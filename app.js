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
const app = express();




app.set("views", __dirname + "/views");
// app.set('views','./views/pages');
app.set("view engine", "ejs");
// app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, './views/pages/')]);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


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



const useraccountsSchema = new mongoose.Schema ({
  
  firstname: String,
  lastname: String,
  username: { type: String, index: true, unique: true },
  email: String,
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
  request: String
  // imgfilefee: { data: Buffer, contentType: String },
  // imgfileidorpsa: { data: Buffer, contentType: String },
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
  request: String
  // imgfilefee: { data: Buffer, contentType: String },
  // imgfileidorpsa: { data: Buffer, contentType: String },
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
  businessname: String,
  businessaddress: String,
  request: String
  // imgfilefee: { data: Buffer, contentType: String },
  // imgfileidorpsa: { data: Buffer, contentType: String },
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
  ctc: String,
  request: String
  // imgfilefee: { data: Buffer, contentType: String },
  // imgfileidorpsa: { data: Buffer, contentType: String },
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
  ctc: String,
  request: String
  // imgfilefee: { data: Buffer, contentType: String },
  // imgfileidorpsa: { data: Buffer, contentType: String },
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
  }
  const Task = new mongoose.model("Task", taskSchema);
 
app.get("/", function (req, res) {
res.render("main");
});

app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/portal", function(req, res){
  if(req.isAuthenticated()){
   res.render("portal", {username: req.user.username});
   }else{
   res.redirect("/login");
   }
});
  app.get("/reqbrgyid", function (req, res) {
    res.render("./pages/reqbrgyid");
  });
  app.get("/reqbrgyclearance", function (req, res) {
    res.render("./pages/reqbrgyclearance");
  });


  app.get("/businesspermit", function (req, res) {
    res.render("./pages/businesspermit");
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

  app.get("/logout", function(req, res){
     req.logOut();
     res.redirect("/");
    })



//   app.get("/main", function (req, res) {
//   res.render("main");
// });
  
  app.get("/contact-mail", async (req, res) => {
    res.redirect("/");
  });
  
  app.get("/employeeportal", async (req, res) => {
    res.redirect("employeeportal");
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

  const backupaccount = new BackUpAccount({
    username: req.body.username,
    email: req.body.email,
    lastname: req.body.lastname,
    firstname: req.body.firstname,
    accountrole: req.body.accountrole });
      Account.register({
        username: req.body.username,
        email: req.body.email,
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        accountrole: req.body.accountrole
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
         res.redirect("/adminportal");
         }
});});});});});});});});});});});});});});});});});});});});
  
  
  
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
          ,allUserAccounts, requestCount,  myTasks, allResidents, myUpdates, allbackupResidents, countResidents, allFemale, allMale, username: req.user.username});
            });
          });
        });
      });
    });});});});});});}); });});});});});});});});});});});});});});});});});});});}); });});});});});});}); });});


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
      res.redirect("/adminportal"); 
       }
  })
});


app.get("/deleteinfo", (req, res, next)=> {
  
  Residents.deleteMany({}, (err, users)=>{ 
  Blotter.deleteMany({}, (err, users)=>{
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
});});});});});});});});



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
     res.redirect("adminportal")
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
     res.redirect("adminportal")
   }
 })

});




//ADMIN PERKS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//this is for Account User
app.route("/createnewaccount")
   .get(function(req, res){
    res.render("createnewaccount");
   })
  .post(function(req, res){

    const backupaccount = new BackUpAccount({
      username: req.body.username,
      email: req.body.email,
      lastname: req.body.lastname,
      firstname: req.body.firstname,
      accountrole: req.body.accountrole });
        Account.register({
          username: req.body.username,
          email: req.body.email,
          lastname: req.body.lastname,
          firstname: req.body.firstname,
          accountrole: req.body.accountrole
        }, req.body.password,   function(err, user){
          if(err){
          console.log(err);
          res.redirect("/createnewaccoun");
          } else {
          passport.authenticate("local")(req, res, function(){
       backupaccount.save();
          res.redirect("/adminportal");
          });
          }
  });   
});
  
// -------------------------------------------------------------------------------------REQUEST FOR CERTIFICATION OF WIRINGS-- use for user
app.route("/reqwiringsclearance ")
    .get(function (req, res) {
     res.render("./pages/reqwiringsclearance");
})
   .post(async function (req, res) {
  try{
    const result = "Pending"
    const requestWiring= new WiringandExcavationClearance({
      fullname: req.body.fullname,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      purposeofreq: req.body.purposeofreq,
      ctc: req.body.ctc,
      request: result });
      await requestWiring.save();
      const backuprequestWiring= new BackUpWiringandExcavationClearance({
        fullname: req.body.fullname,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
        purposeofreq: req.body.purposeofreq,
        ctc: req.body.ctc,
        request: result });
        await backuprequestWiring.save();
        res.render("main")
      } catch(err){
        console.log(err)
        res.redirect("./pages/reqwiringsclearance")
      }


});

app.post("/WiringandExcavationForm", async function (req, res) {

try{
  const result = "Pending"
  const requestWiring= new WiringandExcavationClearance({
    fullname: req.body.fullname,
    address: req.body.address,
    email: req.body.email,
    phone: req.body.phone,
    purposeofreq: req.body.purposeofreq,
    ctc: req.body.ctc,
    request: result });
    await requestWiring.save();
    const backuprequestWiring= new BackUpWiringandExcavationClearance({
      fullname: req.body.fullname,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      purposeofreq: req.body.purposeofreq,
      ctc: req.body.ctc,
      request: result });
      await backuprequestWiring.save();
      res.redirect("adminportal")
    } catch(err){
      console.log(err)
      res.redirect("./page-admin/WiringandExcavationForm")
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
      res.redirect("adminportal")
    } catch(err){
      console.log(err)
      res.redirect("adminportal")
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
          res.redirect("/adminportal");
    
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
        res.redirect("adminportal")
      } catch(err){
        console.log(err)
        res.redirect("adminportal")
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

// -------------------------------------------------------------------------------------REQUEST FOR CERTIFICATION OF INDIGENCY-- use for user
app.get("/reqindigency", function (req, res) {
  res.render("./pages/reqindigency");
});
app.post("/reqindigency-req", async function (req, res) {

  try{
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
      request: result});
      await requestIndigency.save();
      const backuprequestIndigency= new BackUpCertificateIndigency({
        fullname: req.body.fullname,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
        birthday: req.body.birthday,
        datestarted: req.body.datestarted,
        purposeofreq: req.body.purposeofreq,
        ctc: req.body.ctc,
        request: result});
        await backuprequestIndigency.save();
        res.render("main")
      } catch(err){
        console.log(err)
        res.redirect("./pages/reqindigency")
      }



});


// Admin Add Request Form for Certificate for Indigency--- user from admin's view !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.post("/RequestIndigencyForm", async function (req, res) {
  try{
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
      request: result});
      await requestIndigency.save();
      const backuprequestIndigency= new BackUpCertificateIndigency({
        fullname: req.body.fullname,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
        birthday: req.body.birthday,
        datestarted: req.body.datestarted,
        purposeofreq: req.body.purposeofreq,
        ctc: req.body.ctc,
        request: result});
        await backuprequestIndigency.save();
        res.redirect("adminportal")
      } catch(err){
        console.log(err)
        res.redirect("./page-admin/RequestIndigencyForm")
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
app.post("/reqbusinesspermit-req",async function (req, res) {

  try{
    const result = "Pending"
    const requestBusinessPermit = new BusinessPermit({
      fullname: req.body.fullname,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      businessname: req.body.businessname,
      businessaddress: req.body.businessaddress,
      request: result});
      await requestBusinessPermit.save();
      const backuprequestBusinessPermit = new BackUpBusinessPermit({
        fullname: req.body.fullname,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
        businessname: req.body.businessname,
        businessaddress: req.body.businessaddress,
        request: result});
        await backuprequestBusinessPermit.save();
        res.render("main")
      } catch(err){
        console.log(err)
        res.redirect("./pages/reqbusinesspermit")
      }


});

// Admin Add Request Form for Business Permit --- user from admin's view !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.post("/BusinessPermitForm",async function (req, res) {
  
  try{
    const result = "Pending"
    const requestBusinessPermit = new BusinessPermit({
      fullname: req.body.fullname,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      businessname: req.body.businessname,
      businessaddress: req.body.businessaddress,
      request: result});
      await requestBusinessPermit.save();
      const backuprequestBusinessPermit = new BackUpBusinessPermit({
        fullname: req.body.fullname,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
        businessname: req.body.businessname,
        businessaddress: req.body.businessaddress,
        request: result});
        await backuprequestBusinessPermit.save();
        res.redirect("adminportal");
      } catch(err){
        console.log(err)
        res.redirect("./page-admin/BusinessPermitForm")
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

// ------------------------------------------------------------------------------------------REQUEST FOR BRGY CLEARANCE FORM -- use for user
app.post("/reqbrgyclerance-req", async function (req, res) {

  try{
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
      request: result});
      await requestClearanceuser.save();
      const backuprequestClearanceuser = new BackUpRequestClearance({
        fullname: req.body.fullname,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
        age: req.body.age,
        civilstatus: req.body.civilstatus,
        purposeofreq: req.body.purposeofreq,
        ctc: req.body.ctc,
        request: result});
        await backuprequestClearanceuser.save();
        res.render("main")
      } catch(err){
        console.log(err)
        res.redirect("./pages/reqbrgyclearance")
      }




});

// Admin Add Request Form for Clearance --- user from admin's view !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.post("/RequestClearanceForm",async function (req, res) {

  try{
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
      request: result });
      await requestClearanceuser.save();
      const backuprequestClearanceuser = new BackUpRequestClearance({
        fullname: req.body.fullname,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
        age: req.body.age,
        civilstatus: req.body.civilstatus,
        purposeofreq: req.body.purposeofreq,
        ctc: req.body.ctc,
        request: result });
        await backuprequestClearanceuser.save();
        res.redirect("adminportal")
      } catch(err){
        console.log(err)
        res.redirect("./page-admin/RequestClearanceForm")
      }

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
app.post("/reqbrgyid-req", async function (req, res) {


  try{
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
        request: result});
        await backuprequestIDuser.save();
        res.render("main");
      } catch(err){
        console.log(err)
        res.redirect("./pages/reqbrgyid")
      }

});

// Admin Add Request Form  --- user from admin's view !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.post("/RequestIdForm", async function (req, res) {


  try{
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
        request: result});
        await backuprequestIDuser.save();
        res.redirect("adminportal");
      } catch(err){
        console.log(err)
        res.redirect("./page-admin/RequestIdForm")
      }
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

//---------------------------------------

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
