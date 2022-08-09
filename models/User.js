
//external import
const {Schema , model} = require('mongoose')

const userSchema = new Schema({
    username :{
        type: String,
        trim : true,
        maxlength : 25,
        required: true
    },
    userType:{
        type:String,
        enum:['admin','moderator','user'],
        default: 'user'
    },
    email:{
        type:String,
        trim: true,
        required: true
    },
    password:{
        required:true,
        type:String
    },
    profilePics:{
        type: String,
        default:'/uploads/soikat.jpg'
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    verification_id:{
        type:Number,
        default:-1
    },
    balance:{
        type:Number,
        default:0
    },
    pending_balance:{
        type:Number,
        default:1000
    },
    isReffered:{
        type:Boolean,
        default:false
    },
    referred_by:{
        type:Schema.Types.ObjectId,
        ref: 'User'
    },
    refer_list:[{
        type:Schema.Types.ObjectId,
        ref: 'User'
    }]

},{
    timestamps:true
})

const User = model('User',userSchema)

module.exports = User