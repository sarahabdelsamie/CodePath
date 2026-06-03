const User = require("../models/User");
const jwt = require("jsonwebtoken");
const register = async (req,res) => {
    try {
        const {name , email , password}=req.body;
        const existUser=await User.findOne({email});
        if (existUser){
            return res.status(400).json({
                message:"email already exists",
            });
        }
        const hashPassword = await bcrypt.hash(password,10);
        const user=await User.create({
            name,
            email,
            password:hashPassword,
        });
        res.status(201).json({
            message:"User created successfully",
            user,
        })
    } catch (error) {
               res.status(500).json({
                message:error.message,
               });
    }
};
const login = async (req,res) => {
    try {
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if (!user){
            return res.status(404).json({
                message:"user not found",
            });
            const isMatch = await bcrypt.compare(
                password,
                user.password
            );
            if (!isMatch){
                return res.status(400).json({
                    message:"invalid password",
                });
            }
            const token = jwt.sign(
                {
                    id:user._id,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn:"3d",
                }
            );
            res.status(200).json({
                message:"login successful",
                token,
                user,
            });
        }
    } catch (error) {
        res.status(500).json({
            message:error.message,
        });
    }
}
module.exports={register,login};