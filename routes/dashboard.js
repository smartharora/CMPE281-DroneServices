const ObjectId = require('mongodb').ObjectId;

exports.getDashBoard = async(req,res)=>{
   // res.render('pages/temp' , {'user_id': req.session.user_id});
    const uid = req.session.user_id;
    const bookingCol = req.app.db.collection("booking");
    const user_profile = req.app.db.collection("user_profile");
    const farmland_profile = req.app.db.collection("farmland_profile");
    const farm_profile = req.app.db.collection("farm_profile");

    const user = await user_profile.findOne({'user_id': new ObjectId(uid)});
    let farm = await farm_profile.findOne({"farmer_id": new ObjectId(uid)});
    const booking = await bookingCol.find({"user_id":new ObjectId(uid)}).toArray();

    for(let i=0; i<booking.length; i++){
        let farmland = await farmland_profile.findOne({"_id": new ObjectId(booking[i].farmland_id)});

        booking[i].farmland = farm.name;
        booking[i].land_type = farmland.land_type;
        
    }
    res.render('pages/dashboard',{booking:booking, user_name:user.name});

}