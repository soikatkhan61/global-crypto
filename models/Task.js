
//external import
const {Schema , model} = require('mongoose')

const taskSchema = new Schema({
    user :{
        type:Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    remain_task:{
        type:Number,
        default:10 
    },
    todays_comission:{
        type:Number,
        default:0
    },
    yesterday:{
        type:Number,
        default:0
    },
    time:{
        type:Date,
        default:Date.now()
    }
},{
    timestamps:true
})

const Task = model('Task',taskSchema)

module.exports = Task