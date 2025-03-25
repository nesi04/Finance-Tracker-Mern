const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserSchema= new mongoose.Schema({
    fullName:{type:String,requires:true},
    email:{type:String,requires:true,unique:true},
    password:{type:String,requires:true},
    profileImageUrl:{type:String,default:null},
},
    {timestamps:true}
);

UserSchema.pre("save",async function (next){
    if(!this.isModified('password')) return next();
    this.password=await bcrypt.hash(this.password,10);
    next();
});

UserSchema.methods.comparePassword=async function(candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password);
}
module.exports=mongoose.model("User",UserSchema);