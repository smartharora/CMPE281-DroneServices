const ObjectId = require('mongodb').ObjectId;

exports.register = async function(req,res){
    const user_account = req.app.db.collection("user_account");
    const user_profile = req.app.db.collection("user_profile");
    const farmland_profile = req.app.db.collection("farmland_profile");
    const farm_profile = req.app.db.collection("farm_profile");

    var body = req.body;
    const uid = req.session.user_id;

    console.log(uid);
    var {
        isFarmer,
        farmer_name,
        farmer_phone_number,
        farmer_email,
        farmer_birthday,
        farmer_gender,
        farm_name,
        farm_address,
        farm_city,
        farm_country,
        farm_zipcode, //farm = {name, address, city, country, zipcode, }
        farmland_type,
        farmland_type_detail,
        farmland_longitude,
        farmland_latitude,
        farmland_square_ft,
         // farmland = {land_type, type_detail}
        owner, // owner= {name, address, city, country, zipcode, farm_squar_ft, certificate_date, certificate_url}
        farmer,// farmer = { dl_name, dl_number, dl_url}
        billing // billing = { card_name, card_number, expiration_date, cvv}
         // user profile farmid, plot_id, lat, log,squar ft, date of certi issue, img_url
    } = body;
    //res.send(body);
    //console.log(uid);
    var update = await user_account.updateOne({ _id: new ObjectId(uid) }, { $set: { isFarmer } });
    if (update.matchedCount < 1) {
        console.log("User Not found in User_account");
        res.sendStatus(500);
    }

    var user_profile_rec = {
        'user_id': new ObjectId(uid),
        'name': farmer_name,
        'phone_number': farmer_phone_number,
        'email': farmer_email,
        'birthday': farmer_birthday,
        'gender': farmer_gender,
        'billing_info': billing,
        'dl_info': farmer
    };

    const res_user_profile = await user_profile.updateOne({ 'user_id': new ObjectId(user_profile_rec.user_id) }, { $set: user_profile_rec }, { upsert: true });


    var farm_profile_rec = {
        'farmer_id': new ObjectId(uid),
        'name': farm_name,
        'address': farm_address,
        'city': farm_city,
        'country': farm_country,
        'zipcode': farm_zipcode,
        'ownership_info' : owner
    }

    const res_farm_profile = await farm_profile.updateOne({ 'farmer_id': farm_profile_rec.farmer_id }, { $set: farm_profile_rec }, { upsert: true });
    // res.send(res_farm_profile);

    const farm_rec = await farm_profile.findOne({ 'farmer_id': farm_profile_rec.farmer_id });
    //console.log(farm_rec);
    //res.send(typeof(farm_rec._id));
    // var l = farmland.length;
    //console.log("l is : ", l);
    // var count_farmland = 0;
    // for (let i = 0; i < l; i++) {
        var farmland_rec = {
            'farm_id': farm_rec._id,
            'longitude': farmland_longitude,
            'latitude': farmland_latitude,
            'square_ft': farmland_square_ft,
            'land_type': farmland_type,
            'type_detail': farmland_type_detail
        }
        let farmland_res = await farmland_profile.insertOne(farmland_rec);
        //console.log(farmland_res);
        // count_farmland += 1;
    // }
        const user_account_preview = await user_account.findOne({'_id': new ObjectId(uid)});
        const user_profile_preview = await user_profile.findOne({'user_id': new ObjectId(uid)});
        const farm_profile_preview = await farm_profile.findOne({'farmer_id': new ObjectId(uid)});
        const farmland_profile_preview = await farmland_profile.findOne({'farm_id': farm_profile_preview._id});
        const preview = {
            'user_account': user_account_preview,
            'user_profile' : user_profile_preview,
            'farm_profile': farm_profile_preview,
            'farmland_profile':farmland_profile_preview
        }
        // res.send(preview);
        res.redirect("/selectFarmland");
}