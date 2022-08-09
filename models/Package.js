
//external import
const {Schema , model} = require('mongoose')

const packageSchema = new Schema({
    package_name:{
        type:String,
        enum:["silver","gold","platinum"],
        required:true,
        trim:true
    },
    price:{
        type:Number,
        required:true
    },
    package_comission:{
        type:Number,
        default:0,
        required:true
    },
    total_subscriber:{
        type:Number,
        default:0
    }
},{
    timestamps:true
})

const Package = model('Package',packageSchema)

module.exports = Package