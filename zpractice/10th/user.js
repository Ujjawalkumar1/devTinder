const mongoose=require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const userSchema=new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength:3,
        maxLength:20
    },
    lastName:{
        type: String,
    },
    emailId: {
        type: String,
        required:true,
        unique: true,
        index:true,
        lowercase:true,
        trim:true

        
    },
    password:{
        type: String,
        required:true,
        
    } ,
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        trim:true,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("not a valid gender")
            }
        }
    },
    about:{
        type:"String",
        default:"htis is for all"
    },
    skills:{
        type:[String]
    }
},
{
    timestamps:true
}
);






userSchema.methods.getJWT=async function (){
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790", {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return isPasswordValid;
};


const userModel=mongoose.model("user",userSchema);
module.exports=userModel;
