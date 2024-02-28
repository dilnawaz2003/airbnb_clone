const mongoose = require('mongoose');


const UserSchema = mongoose.Schema(
   {
    name:{
        required:true,
        type:String,
    },

    email:{
        unique:true,
        required:true,
        type:String,
    },

    password:{
        required:true,
        type:String,
    }
   }
);


const userModel = mongoose.model('User',UserSchema);


module.exports = userModel;