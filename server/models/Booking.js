const mongoose = require('mongoose');

const bookingScehma = mongoose.Schema(
    {
        place : {
            type:mongoose.Schema.Types.ObjectId ,
             ref:"Place",
             required:true
        },

        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        checkInTime :{
            type:Date,
            required:true,
        },
        checkOutTime :{
            type:Date,
            required:true,
        },
        price:{
            required:true,
            type:Number,
        },
        createdAt: { type: Date, expires: 'your_time_in_seconds', default: Date.now },
    }
);


const bookingModel = mongoose.model('Booking',bookingScehma);


module.exports = bookingModel;