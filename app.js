//jshint esversion:6
//my nodejs starter pack
const express = require("express");
// const request = require("request")
const https = require("https");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const { check, validationResult } = require('express-validator');
const res = require("express/lib/response");
const { redirect } = require("express/lib/response");
const { features } = require("process");
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
  fullname: String,
  address: String,
  email: String,
  phone: Number,
  age: Number,
  civil: String,
  purposeofreq: String,
  ctc: String,
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
app.get("/main", function (req, res) {
  res.render("main");
});
app.get("/adminportal", function (req, res) {
  res.render("adminportal");
});
app.get("/reqbrgyid", function (req, res) {
  res.render("./pages/reqbrgyid");
});
app.get("/donate", function (req, res) {
  res.render("./pages/donate");
});

app.get("/register", function (req, res) {
  res.render("register");
});

// app.delete('/logout', (req, res) => {
//     req.logOut()
//     res.redirect('/login')
//   })

app.get("/logout", async (req, res) => {
  res.redirect("/");
});

app.get("/contact-mail", async (req, res) => {
  res.redirect("main");
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
//   const accountrole = req.body.accountrole;

  User.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {

            if (foundUser.accountrole === "admin") {
                res.render("adminportal");
            }
            else if(foundUser.accountrole === "employee"){
                res.render("employeeportal");
            }
            else if(foundUser.accountrole === "citizen"){
                res.render("portal");
            }
        }
        else {
            res.redirect("login");
        }
      }
    }
  });
});

// if (foundUser.accountrole === "admin") {
//     res.render("adminportal");
// }

// if (foundUser.password === password) {

//     if (foundUser.accountrole === "admin") {
//         res.render("adminportal");
//     }
//     else {
//         res.render("portal");
//     }

app.post("/register", function (req, res) {
  const newUser = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.username,
    password: req.body.password,
    conpassword: req.body.conpassword,
    accountrole: req.body.accountrole,
  });

  const accountrole = req.body.accountrole;
  newUser.save(function (err) {
    if (err) {
      console.log(err);
      res.redirect("register");
    } 
    // else {
    //   res.render("portal");
    //         }
     else {

            User.findOne({ accountrole: accountrole }, function (err, foundUser) {
                    if (err) {
                    console.log(err);
                    } else {
                    
                            if (foundUser.accountrole === "admin") {
                                res.render("adminportal");
                            }
                            else if(foundUser.accountrole === "employee"){
                                res.render("employeeportal");
                            }

                            else if(foundUser.accountrole === "citizen"){
                                res.render("portal");
                            }
                            else {
                            res.redirect("register");
                            }
                        }
                
            })

        }


  });
});

// REQUEST FOR ID FORM
app.post("/reqbrgyid-req", function (req, res) {
  const requestIDuser = new RequestID({
    fullname: req.body.fullname,
    address: req.body.address,
    email: req.body.email,
    phone: req.body.phone,
    age: req.body.age,
    civil: req.body.civilstatus,
    purposeofreq: req.body.purposeofreq,
    ctc: req.body.ctc,
    // imgfilefee: req.body.imgfilefee,
    // contentType: 'img/png',
    // imgfileidorpsa: req.body.imgfileidorpsa,
    // contentType: 'img/png'
  });

  requestIDuser.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.render("main");
    }
  });
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
    } else {
      res.render("main");
    }
  });
});

//---------------------------------------

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
