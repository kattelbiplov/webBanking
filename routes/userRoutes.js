const router=require('express').Router();
const User=require('../models/userModel');
const bcrypt=require('bcryptjs');
const { error } = require('console');
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middlewares/authMiddleware');
//register user account
router.post('/registration',async(req,res)=>{
    try{
        //check if already user exists
        let user=await User.findOne({mobileNumber:req.body.mobileNumber})
        if(user){
            return res.status(409).send({
                message:'User already exists',
                success:false
            })
        }
       
        const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password=hashedPassword;
        const newUser=new User(req.body);
        await newUser.save();
        res.status(201).send({
            message:'User registered successfully',
            data:null,
            success:true
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
            message:error.message,
            success:false
        })
    }
})

//login user account
// login user account
router.post('/login', async (req, res) => {
    try {
        // check if user exists or not
        let user = await User.findOne({ mobileNumber: req.body.mobileNumber });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User does not exist',
            });
        }

        // check the password
        const validPassword = await bcrypt.compare(req.body.password, user.password); // corrected typo
        if (!validPassword) {
            return res.status(401).send({
                message: 'Invalid Password',
                success: false,
            });
        }
        //generate token
        const token = jwt.sign({ userId:user._id}, process.env.jwt_secret,{expiresIn:"1d"})
       

        res.status(200).send({
            message: 'User logged in successfully',
            data: { token },
            success: true,
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false,
        });
    }
});

//get profile data
router.get('/profile',authMiddleware,async(req,res)=>{
    try {
        // Access user information from the request (authenticated by the middleware)
        const userId = req.body.userId;

        // Assuming you have a User model
        const user = await User.findById(userId);
        console.log(user)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Return user data
        res.status(200).json({
            success: true,
            data: user,
        });
    }catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
});

module.exports=router;