//Node js framework
var express = require('express');

//Setting a session for the user
var session = require('express-session');

//For sending emails
const nodemailer = require('nodemailer');

//Using moment to set timestamps
var moment = require('moment')

//Hashing password package
var bcrypt = require('bcrypt')
const saltRounds = 10;


var app = express();
const server = require('http').Server(app)
let io = require("socket.io")(server);

var bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//To make the public folder accessable for the client
app.use(express.static(__dirname + '/public'));

//Makes a session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: true }
  }))

//Variable that makes it possible to access the username
var usernameGlobal = "";

//stores the messages for the forum
var arrayMessage = [];

//stores the users for the forum
var arrayUsers = [];

//User object for later use
let user = {}

exports.isLoggedIn = false;

exports.sessionLogin = function(){
    return session.user
}

//function for testing
/*exports.userLogin = function(){
    return false;
}*/

app.get("/",(req,res) =>{
    return res.sendFile(__dirname+"/public/views/index.html")
})


app.get("/loggedOut",(req,res)=>{
    req.session.destroy()
    
    return res.sendFile(__dirname+"/public/views/index.html")
})



app.post("/public/views/sign-up",(req,res)=>{
    console.log("Just before DB")
    const mongo = require("mongodb").MongoClient;
    var path = "mongodb://localhost:27017/MandatoryPeople"
    
    mongo.connect(path, function(err,db){
    if(err){
        console.log("There was an error running mongoDB",err);
    }
    
    console.log("In DB")
    let collection = db.collection("people");
    
    let newPersonDB = {
        "firstname" : req.body.firstname,
        "lastname" : req.body.lastname,
        "username" : req.body.username,
        "password" : req.body.password
    }
    console.log(newPersonDB.firstname)
    bcrypt.hash(newPersonDB.password, saltRounds, function(err, hash) {
        newPersonDB.password = hash;
        collection.insert(newPersonDB,function(err,success){
            console.log(success)
            db.close();
                });  
          });    
        
    });
    response = true;
    res.json(response)

})



app.get("/public/views/signUp",(req,res) =>{
    return res.sendFile(__dirname+"/public/views/signUp.html")
})

app.post("/help-request", function(req,res){
    var credentials = require("./pass.js")

    console.log(req.body.email, req.body.firstname, req.body.lastname, req.body.description)
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: credentials.user, // generated ethereal user
            pass: credentials.pass // generated ethereal password
        }
    });
    
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Dannyboooouuu 👻" <daniel.boebel@gmail.com>', // sender address
            to: req.body.email, // list of receivers
            subject: 'Help desk automated response', // Subject line
            text: 'Hello '+req.body.firstname+". We are sorry to here that you have a problem. We will help you as soon as possible. Your problem description is: "+req.body.description+". Kind regards //Help Desk", // plain text body
            html: "<b>Hello "+req.body.firstname+" "+req.body.lastname+". We are sorry to here that you have a problem. We will help you as soon as possible. Your problem description is: "+req.body.description+". Kind regards //Help Desk</b>" // html body
        };
    
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
            response = true;
            res.json(response)
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
})


app.post("/logged-in", function(req, res) {
    const mongo = require("mongodb").MongoClient;
    var express = require('express');
    var app = express();
    var path = "mongodb://localhost:27017/MandatoryPeople"

    mongo.connect(path, function DB(err,db){
    if(err){
        console.log("There was an error running mongoDB",err);
    }
    let collection = db.collection("people");
            
        user = {
        "username" : req.body.username,
        "password" : req.body.password
        
    }
    
    usernameGlobal = req.body.username;
    
    collection.find({}).toArray(function(err,result){
        if(err){
            console.log(err)
        }
        var usernamePick = result.find(o => o.username === user.username);
    
        if(usernamePick != undefined){
            bcrypt.compare(req.body.password, usernamePick.password).then(function(resbcrypt) {
                if(resbcrypt = true){
                isLoggedIn = true;
                user.password = usernamePick.password;
                req.session.user = user;
                arrayUsers.push(usernameGlobal+"\n")
                response = true;
                res.json(response)
                    }
                 })

                 
        }
    
        db.close()
        });
    });
});



    app.get("/login", (req,res)=>{

        if(req.session.user){
            return res.sendFile(__dirname+"/public/views/login.html")
        }else{
            //return res.sendFile(__dirname+"/public/views/index.html")
            return res.sendFile(__dirname+"/public/views/index.html")
        }
       
    })

    app.get("/calendar",(req,res)=>{
        if(req.session.user){
            return res.sendFile(__dirname+"/public/views/calendar.html")
        }else{
            //return res.sendFile(__dirname+"/public/views/index.html")
            return res.status(401);
        }
    })

    app.get("/forum",(req,res)=>{
        if(req.session.user){
            return res.sendFile(__dirname+"/public/views/forum.html")
        }else{
            //return res.sendFile(__dirname+"/public/views/index.html")
            return res.status(401);
        }
    })

    app.get("/helpDesk",(req,res)=>{
        if(req.session.user){
            return res.sendFile(__dirname+"/public/views/helpDesk.html")
        }else{
            //return res.sendFile(__dirname+"/public/views/index.html")
            return res.status(401);
        }
    })






    io.on("connection", function(socket){  
        socket.emit("allMessages", {"arrayMessage": arrayMessage}) 
        io.emit("allUsers",{"arrayUser": arrayUsers})


        socket.on("disconnectUser",function(data){
           var tempUser;
            console.log(usernameGlobal)
            arrayUsers.forEach(user => {
                tempUser = user;
                console.log(tempUser)
                if(tempUser = usernameGlobal){
                    arrayUsers.pop(tempUser)
                    arrayMessage.push("("+moment().format('MMMM Do YYYY, h:mm:ss a')+") : "+tempUser+": "+data.text+"\n")
                    io.emit("allMessages", {"arrayMessage": arrayMessage}) 
                    io.emit("allUsers",{"arrayUser": arrayUsers})
                }
            });

        });

        socket.on("emitDataToServer",function(data){
            var text = data.text;

            arrayMessage.push("("+moment().format('MMMM Do YYYY, h:mm:ss a')+") : "+usernameGlobal+": "+text+"\n")

            console.log(arrayMessage)
            io.emit("allMessages", {"arrayMessage": arrayMessage}) 

        });

    });






server.listen(3000, function(err){
    if(err){
        console.log("There was an error running on port "+server.address().port);
    }
    console.log("Server is running on port ", server.address().port);

})