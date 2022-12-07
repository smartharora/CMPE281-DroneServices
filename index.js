const signup = require('./routes/signup')
const register = require('./routes/register');
const drone = require('./routes/drone');
const farmland = require('./routes/farmland');
const booking = require('./routes/booking');


var cors = require('cors');
var express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');


const oneDay = 1000 * 60 * 60 * 24;

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessions({
  secret: "secretKey",
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false
}));
app.use(cookieParser());
app.use(cors())
app.use(express.static(__dirname + '/public'));
// set the view engine to ejs

app.set('view engine', 'ejs');

// use res.render to load up an ejs view file
// app.get('/signup', function(req,res){
//   res.render('pages/signup');
// });
// index page
app.get('/', function (req, res) {
  //console.log(req.session);
  session = req.session;
  if (session.hasOwnProperty('user_id') && session.user_id) {

    res.render('pages/' , {'user_id': session.user_id});
  } else {
    res.redirect('/signin');
  }
});

app.get('/temp', function(req,res){
  res.render('pages/temp');
})
app.get('/selectFarmland', booking.getfarmlands);
app.post('/selectDuration', booking.selectedFarmland);
app.post('/selectDrone',booking.selectedDuration);
app.post('/payment',booking.totalPayment);
app.post('/createBooking',booking.createBooking);

// app.post('/addDrone', booking.selectedFarmland);
// app.get('/addDrone', drone.viewDrones);
// app.post('/addDrone', drone.addDrone);
// app.post('/selectDrone', drone.addDrone);


app.get('/signup', signup.signupPage);
app.post('/signup', signup.register);
app.get('/signin', signup.signinPage);
app.post('/signin', signup.loginUser);
app.get('/form', function(req, res) {
  res.render("pages/registerRole.ejs");
});

app.get('/signout', function(req,res){
  req.session.user_id=null;
  res.redirect('/');
});

// about page
app.post('/form', register.register);
//Session



//session middleware



app.listen(4000);
console.log('Server is listening on port 4000');

const uri = "mongodb+srv://agriculture_drone:Password123@cluster0.tsipvah.mongodb.net/?retryWrites=true&w=majority";
const MongoClient = require('mongodb').MongoClient;
var client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
try {
  client.connect();
  // coll = client.db(conf.database.name).collection(conf.database.collection);
  db = client.db("agriculture_drone");

  app.db = db;
  console.log("MongoDB Database Connected Successfully");
} catch (e) {
  console.log(e);
}