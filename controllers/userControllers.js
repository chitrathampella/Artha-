const userModel=require('../models/userModel')

const loginController = async(req,res) => {
    try{
        const{email,password}=req.body
        await userModel.findOne({email,password})
        if(!user){
           return res.status(404).send('user not found')
        }
        res.status(200).json(user)({
            success: false,
            error,
        })

    }catch(error){
        res.status(400).json({
            success:false,
            error
        })

    }

}

const registerController = async(req,res) => {
    try{
        const newUser = newUser(req.body)
        await newUser.save()
        res.status(201).json(({
            success: true,
            newUser,
        }))

    }catch(error){
        res.status(400).json({
            success:false,
            error
        })


    }
}

module.exports = {loginController, registerController}