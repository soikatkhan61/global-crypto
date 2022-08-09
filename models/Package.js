
//external import
const {Schema , model} = require('mongoose')

const packageSchema = new Schema({
    user :{
        type:Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    package_name:{
        type:String,
        enum:["silver","gold","platinum"],
        required:true
    },
    package_comission:{
        type:Number,
        default:0,
        required:true
    }
},{
    timestamps:true
})

const Package = model('Package',packageSchema)

module.exports = Package