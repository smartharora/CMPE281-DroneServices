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

exports.selectedFarmland = async(req,res)=>{
    const uid = req.session.user_id;
    var farmland = req.body.farmland;
    // const coll = req.app.db.collection("dron_profile");
    // const drone = await coll.find().toArray();
    // res.render('pages/addDron', {farmland, drone});
    res.render('pages/duration', {farmland});


}


exports.selectedDuration = async(req,res)=>{
    var {farmland, startDate, endDate} = req.body;
    // console.log(new Date(startDate));
    var query = {
        "start_date" : {
            $gte : startDate,
            $lte : endDate
        },
        "end_date" : {
            $gte : startDate,
            $lte : endDate
        }
    }    
    // const coll = req.app.db.collection("dron_profile");
    // const coll1 = req.app.db.collection("booking");
    const coll = req.app.db.collection("dron_profile");
    const coll2= req.app.db.collection("booking");

     const drone = await coll.find().toArray();
     const result = await coll2.find(query).toArray();
     const l = result.length;
     var bookedDrone = new Array();
     for(let i=0; i<l; i++){
        bookedDrone.push(result[i].drone_id);
     }
   res.render("pages/addDron",{drone, farmland, bookedDrone, startDate, endDate});
}

exports.createBooking = async(req,res)=>{
    const uid = req.session.user_id;
    var {farmland, start_date, end_date, drone_id} = req.body;
    const dron_coll = req.app.db.collection("dron_profile");
    const farm_coll = req.app.db.collection("farm_profile");
    const booking_coll = req.app.db.collection("booking");
    const bill_coll = req.app.db.collection("bill");

    //var farmland_rec = await farmland_coll.findOne({'_id': new ObjectId(farmland)});
    var farm_rec = await farm_coll.findOne({'farmer_id': new ObjectId(uid)});
    var dron_rec = await dron_coll.findOne({'id': drone_id});
    var total_cost = parseInt(dron_rec.price)+60;

    var booking_rec={
        'user_id':new ObjectId(uid),
        'dron_id':drone_id,
        'farmland_id': farmland,
        start_date,
        end_date
    }

    var result = await booking_coll.insertOne(booking_rec);

    var billing_rec = {
        'booking_id':result.insertedId,
        'total_amount':total_cost,
        'time_billed': new Date()
    }
    var bill = await bill_coll.insertOne(billing_rec);

    res.render("pages/summery.ejs",{'drone':dron_rec, 'farm': farm_rec, start_date, end_date,drone_id, total_cost, 'bill_id': bill.insertedId});


}

exports.totalPayment = async(req,res)=>{
    const uid = req.session.user_id;
    var {farmland, start_date, end_date, drone_id} = req.body;
    const dron_coll = req.app.db.collection("dron_profile");
   
    const farm_coll = req.app.db.collection("farm_profile");
    

    //var farmland_rec = await farmland_coll.findOne({'_id': new ObjectId(farmland)});
    var farm_rec = await farm_coll.findOne({'farmer_id': new ObjectId(uid)});
    var dron_rec = await dron_coll.findOne({'id': drone_id});
    var total_cost = parseInt(dron_rec.price)+60;

    res.render("pages/billing.ejs",{'drone':dron_rec, 'farm': farm_rec, farmland, start_date, end_date, drone_id, total_cost});


}
