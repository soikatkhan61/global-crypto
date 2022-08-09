const User = require('../../models/User')

exports.getReferGetController =async (req,res,next) =>{
    let userProfile = await User.findById({_id:req.user._id}).populate('referred_by')
    res.render("user/pages/get_refered",{title:"Get Refered",userProfile,customError:""})
}

exports.getReferPostController =async (req,res,next) =>{
   let {refer_id} = req.body
   try {

    let userProfile = await User.findById({_id:req.user._id}).populate('referred_by')
    if(req.user.isReffered ||  refer_id === req.user._id.toString()){
        return  res.render("user/pages/get_refered",{title:"Get Refered",userProfile ,customError: "You cant refer yourself"})
    }

    let user = await User.findById({_id:refer_id})


    //return console.log(req.user.referred_by !== user._id)
    if(user && !user.refer_list.includes(req.user._id)){
        await User.findByIdAndUpdate({_id:req.user._id},{$set:{referred_by:user._id,isReffered:true},})
        await User.findByIdAndUpdate({_id:user._id},{$push:{refer_list:req.user._id}})
    }else{
        return  res.render("user/pages/get_refered",{title:"Get Refered",userProfile ,customError: "You already referred him"})
    }


    res.render("user/pages/get_refered",{title:"Get Refered",userProfile ,customError: `Successfully Reffered by ${user.username}`})
   
   } catch (error) {
    next(error)
   }

   
}


exports.dashboardGetController = async (req,res,next) =>{
    res.render("user/dashboard",{title: "Dashboard", userProfile:""})
}

