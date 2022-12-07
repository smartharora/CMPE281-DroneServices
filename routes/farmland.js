const ObjectId = require('mongodb').ObjectId;

exports.getfarmlands = async(req,res)=>{
    const uid = req.session.user_id;
    const farmland_profile = req.app.db.collection("farmland_profile");
    const farm_profile = req.app.db.collection("farm_profile");

    const farm = await farm_profile.findOne({'farmer_id': new ObjectId(uid)});
    var farm_id= farm==null ? null : farm._id;
    const farmlands = await farmland_profile.find({'farm_id': farm_id}).toArray();
    // console.log(farmlands);
    res.render('pages/lands', {farmlands});
}

exports.selected = async(req,res)=>{
    const uid = req.session.user_id;
    var farmland = req.body.farmland;
    const coll = req.app.db.collection("dron_profile");
    const drone = await coll.find().toArray();
    res.header('/addDrone')
    res.render('pages/addDron', {farmland, drone});

}

exports.viewDrones = async(req,res)=>{
    const coll = req.app.db.collection("dron_profile");
    const drone = await coll.find().toArray();
    var farmland = req.body.farmland;
    res.render("pages/addDron",  {farmland,drone});
}


