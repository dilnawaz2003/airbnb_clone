const mongoose  = require('mongoose');


const PlaceSchema = mongoose.Schema({
    ownerId:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    title:{
        required:true,
        type:String,
    },
    address:{
        required:true,
        type:String,
    },
    photos:{
        required:true,
        type:[String],
    },
    description:{
        required:true,
        type:String,
    },
    perks:{
        required:true,
        type:Object,
    },
    extraInformation:{
        required:true,
        type:String,
    },
    checkInTime:{
        required:true,
        type:Date,
    },
    checkOutTime:{
        required:true,
        type:Date,
    },
    maxGuests:{
        required:true,
        type:Number,
    },
    pricePerNight:{
        required:true,
        type:Number,
    },
});



const placeModel = mongoose.model('Place',PlaceSchema);

module.exports = placeModel;