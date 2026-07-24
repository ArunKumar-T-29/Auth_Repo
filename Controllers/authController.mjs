import mongoose from 'mongoose';
import User from '../Models/registerModel.mjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const regiterUser = async (req, res, next) =>{
    

    try{
    const {username, password, email, role, firstname, lastname} = req.body;
    const userNameRegex = /^[a-z][a-z0-9_.]{3,9}$/
    const allowedRoles = ["admin","user"]
    
   

    if(! username || username.trim() === "" ){
        const error = new Error("username is required");
        error.statusCode = 400;
        return next(error);

    }
    if(username.includes(" ")){
        const error = new Error("Space is not allowed in username");
        error.statusCode = 400;
        return next(error);

    }
    if(! userNameRegex.test(username)){
        const error = new Error("Username must start with a lowercase letter and be 4-10 characters long. Only lowercase letters, numbers, underscores, and dots are allowed.");
        error.statusCode = 400;
        return next(error);
    }
     const existingUser = await User.findOne({username});

     if(existingUser){
        const error = new Error("username already exists");
        error.statusCode = 409;
        return next(error);

     }

     //first and last name validations
     const nameRegex = /^[A-Z][A-Za-z]{1,14}$/

     if(!firstname || firstname.trim() === ""){
        const error = new Error("firstname is required");
        error.statusCode = 400;
        return next(error);

     }

     if(! nameRegex.test(firstname)){

        const error = new Error("First name must start with a capital letter, contain only letters, and be 2-15 characters long");
        error.statusCode = 400;
        return next(error);

     }

     if(lastname){

        if(lastname.trim() === ""){
            const error = new Error("last name must start with a capital letter, contain only letters, and be 2-15 characters long");
            error.statusCode = 400;
            return next(error);

        }


        if(!nameRegex.test(lastname)){
            const error = new Error("last name must start with a capital letter, contain only letters, and be 2-15 characters long");
            error.statusCode = 400;
            return next(error);
        }
     }

     //role validation

     if(role){

     if(! allowedRoles.includes(role)){
            const error = new Error("Sorry,currently we are allowing user and admin roles only");
            error.statusCode = 400;
            return next(error);

     }
    }


   // Password Validation
   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(){}:"<>?]).{8,15}$/

   if(!password || password.trim() === ""){
    const error = new Error("password is required");
        error.statusCode = 400;
        return next(error);
   }



    if(! passwordRegex.test(password)){
        const error = new Error("Minimum of 8  and maximum of 15 charecters required includes atleast one caps, one small leetters, also minimum 1 digit and 1 special charecter required ");
        error.statusCode = 400;
        return next(error);

    }

    if(password.includes(" ")){
        const error = new Error("Space is not allowed in password");
        error.statusCode = 400;
        return next(error);

    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password,saltRounds);


    // Mail Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email || email.trim() === ""){
        const error = new Error("email is required");
        error.statusCode = 400;
        return next(error);
   }

   if(!emailRegex.test(email)){
        const error = new Error("enter valid email");
        error.statusCode = 400;
        return next(error);
   }

   const existingMail = await User.findOne({email});

   if(existingMail){
    const error = new Error("email already exists");
        error.statusCode = 409;
        return next(error);
   }
    
    const registeredUser = await User.create({username, password : hashedPassword,email, role, firstname, lastname});
    // return res.status(201).json(registeredUser)
    const user = registeredUser.toObject();
    delete user.password;
    return res.status(201).json(user);
}
catch (error){
    error.statusCode = error.statusCode || 500;
    return next(error);
}
} 





export const loginUser = async (req, res, next)=>{

    const{email, password} = req.body;

    try{
        if(!email || email.trim() == ""){
            const error = new Error('email and password is required');
            error.statusCode = 400;
            return next(error)
        }

        if(!password || password.trim() == ""){
            const error = new Error('email and password is required');
            error.statusCode = 400;
            return next(error)

        }
        const loggedUser = await User.findOne({email : req.body.email});
        if(!loggedUser){
            const error = new Error("Not able to find user, check your mail and password");
            error.statusCode = 400;
            return next(error)
        }


        const verifiedPassword = await bcrypt.compare(password,loggedUser.password);

        if(! verifiedPassword) {
            const error = new Error("Invalid email or password");
            error.statusCode = 401;
            return next(error)
        }
        

        
            const token = jwt.sign({
                id : loggedUser._id,
                username : loggedUser.username,
                email : loggedUser.email,
                role : loggedUser.role
            },
             process.env.JWT_SECRET,
            {
                expiresIn : "1h"
            })
        

            return res.status(200).json({
                message : "logged in Successfully",
                token
            })
       


    }
    catch(error){

        error.statusCode = error.statusCode || 500;
        return next(error)

    }


}

