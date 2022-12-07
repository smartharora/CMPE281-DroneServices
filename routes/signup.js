const ObjectId = require('mongodb').ObjectId;

exports.signupPage = async(req,res)=>{
    if (req.session.hasOwnProperty('user_id') && req.session.user_id) {
        res.redirect('/');
      } else {
        res.render("pages/signup" , {error : req.error});
      }
    
}

exports.register = async(req,res)=>{
    const coll = req.app.db.collection("user_account");
    const body = req.body;
    //console.log(req);
    // console.log(body);
    if (!body.email && !body.password) {
        return res.render("pages/signup",{'error':'Missing Email and password'})
    } else if (!body.email) {
        return res.render("pages/signup",{'error':'Missing Email'})
    } else if (!body.password) {
        return res.render("pages/signup",{'error':'Missing password'})
    }

    const res1 = await coll.findOne({ email: body.email });
    if (res1 != null) {
        return res.render("pages/signup",{'error':'Already Registered !!'})
    }

    var record = {
        "name": body.name,
        "password": body.password,
        "email": body.email,
        "phone_number": body.phone_number
    };

    coll.insertOne(record, function (err, result) {
        if (err) throw res.send(err);
        res.redirect("/signin");
    });

}

exports.signinPage = (req,res)=>{
    if (req.session.hasOwnProperty('user_id') && req.session.user_id) {
        res.redirect('/');
      } else {
        res.render("pages/signin" , {'error': req.error});
      }
}

exports.loginUser = async (req,res)=>{
    const coll = req.app.db.collection("user_account");
    var body = req.body;
    //console.log(body);
    var email = body.email;
    var password = body.password;

    const res1 = await coll.findOne({ email });
    if (res1 != null && res1.password == password) {
       
       req.session.user_id=res1._id.toString();
       // console.log(req.session.user_id);
        //  res.redirect("/form");
        res.redirect("/selectFarmland");

    } else {
        
         res.render("pages/signin", {'error' : "Email or Password is incorrect.!"});
    }
}