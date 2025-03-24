const asyncHandler = require('express-async-handler');

const Goal = require('../model/goalModel');
const User = require('../model/userModel');

//@desc Get goals
//@route GET /api/goals
//@access Private
const getGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find({user: req.user.id});

    res.status(200).json(goals);
})

//@desc Set goals
//@route POST /api/goals
//@access Private
const setGoals = asyncHandler(async (req, res) => { 
    if(!req.body.text){
        res.status(400)
        throw new Error('Please add a text field');
    }

    const goal = await Goal.create({
        user: req.user.id,
        text: req.body.text
    });
    res.status(200).json(goal);
})


//@desc Update goals
//@route PUT /api/goals/:id
//@access Private
const updateGoals = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id);

    if(!goal){
        res.status(404)
        throw new Error('Goal not found');
    }

    const user = await User.findById(req.user.id);
    if(!user){
        res.status(404)
        throw new Error('User not found');
    }
    if(goal.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('User not authorized');
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {new: true});

    res.status(200).json(updatedGoal);
})


//@desc Delete goals
//@route DELETE /api/goals/:id
//@access Private
const deleteGoals =asyncHandler(async  (req, res) => {
    const goal = await Goal.findById(req.params.id);

    if(!goal){
        res.status(404)
        throw new Error('Goal not found');
    }

    const user = await User.findById(req.user.id);
    if(!user){
        res.status(404)
        throw new Error('User not found');
    }
    if(goal.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('User not authorized');
    }

    await goal.deleteOne();
    res.status(200).json({id: req.params.id});
})

module.exports = {
    getGoals,
    setGoals,
    updateGoals,
    deleteGoals
};