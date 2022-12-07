const ObjectId = require('mongodb').ObjectId;

exports.addDrone = async (req,res)=>{
    const coll = req.app.db.collection("dron_profile");
    var body = req.body;
    //console.log(body);
    var dron = body.dron;
    const res1 = await coll.insertOne(dron);
    res.redirect('/addDrone');
}

exports.viewDrones = async(req,res)=>{
    const coll = req.app.db.collection("dron_profile");
    const drone = await coll.find().toArray();
    var farmland = req.body.farmland;
    res.render("pages/addDron",  {farmland,drone});
}

