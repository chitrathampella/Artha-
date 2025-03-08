
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
name:{
    type:String,
    required:[true, 'name is required']

},
email:{
    type:String,
    require:[true,'email is required and unique'],
    unique:true
},
password:{
    type:String,
    require:[true,'password is required']
}
},
{
    timestamps:true
})

const userModel = mongoose.model('users', userSchema)
module.exports=userModel
