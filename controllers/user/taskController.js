const User = require("../../models/User");
const Task = require("../../models/Task");
const moment = require("moment");

exports.taskGetController = async (req, res, next) => {
  try {
    let task = await Task.findOne({ user: req.user._id }).populate("user");
    if (task) {
      let hours = moment().diff(moment(task.time), "hours");
      console.log(hours);
      if (hours >= 24) {
        await Task.findOneAndUpdate(
          { user: req.user._id },
          { $set: { remain_task: 10 } }
        );
      }
    }

    console.log(task);
    res.render("pages/task", { flashMessage: "", task });
  } catch (e) {
    next(e);
  }
};

exports.createTaskController = async (req, res, next) => {
  try {
    let task = await Task.findOne({ user: req.user._id }).populate("user");
    if (!task) {
      let newTask = new Task({
        user: req.user._id,
      });
      let task = await newTask.save();
    }
    console.log(task);
    res.render("pages/task", { flashMessage: "", task });
    
  } catch (e) {
    next(e);
  }
};

exports.taskPostController = async (req, res, next) => {
  try {
    let checkTaskExists = await Task.findOne({ user: req.user._id });

    if (checkTaskExists) {
      console.log("task ache, update kortechi dont worry");
      await Task.findOneAndUpdate(
        { user: req.user._id },
        { $inc: { remain_task: -1 } }
      );
    } else {
      console.log("hi task nei, create korte ashci ami");
      let newTask = new Task({
        user: req.user._id,
      });
      let task = await newTask.save();
      console.log(task);
    }

    res.redirect("/task");
  } catch (error) {
    next(error);
  }
};

exports.dashboardGetController = async (req, res, next) => {
  res.render("user/dashboard", { title: "Dashboard", userProfile: "" });
};
