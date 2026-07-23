import User from "../Models/registerModel.mjs";
import bcrypt from 'bcrypt';

const userNameRegex = /^[a-z][a-z0-9_.]{3,9}$/;
const nameRegex = /^[A-Z][A-Za-z]{1,14}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(){}:"<>?]).{8,15}$/;


export const getProfile = async (req,res,next) =>{
    try{

        
        const userProfile = await User.findById(req.user.id);

        if(! userProfile){
            const error = new Error("User Not Found");
            error.statusCode = 404;
            return next(error);
        }
        return res.status(200).json({
            message :"Profile fetched Successfully",
            username : userProfile.username,
            role: userProfile.role,
            firstname : userProfile.firstname,
            lastname : userProfile.lastname,
            email : userProfile.email,
            id : userProfile._id,

            //createdAt : userProfile.createdAt.toLocaleString(),
            //updatedAt : userProfile.updatedAt.toLocaleString()
            
        })

    }
    catch(error){
        error.statusCode = error.statusCode || 500;
        return next(error)
    }
}

export const updateProfile = async (req,res,next)=>{
    try{
    

        const {username,email, firstname, lastname} = req.body;
        
   
   if(username !== undefined)
   {
    if(username.trim() === "" ){
        const error = new Error("Enter valid username");
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
    const existingUser = await User.findOne({username, _id: { $ne: req.user.id }});
    
         if(existingUser){
            const error = new Error("username already exists");
            error.statusCode = 409;
            return next(error);
    
         }
        }

        

    if(firstname !== undefined){
        if(! nameRegex.test(firstname)){
            const error = new Error("First name and last name must start with a capital letter, contain only letters, and be 2-15 characters long");
             error.statusCode = 400;
            return next(error);
        }
        
    }

    if (lastname  !== undefined){
        if(! nameRegex.test(lastname)){
            const error = new Error("First name and last name must start with a capital letter, contain only letters, and be 2-15 characters long");
             error.statusCode = 400;
            return next(error);
        }

    }


      // email validation
    if(email !== undefined)
        {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if(email.trim() === "")
            {
                const error = new Error("Emter valid email");
                error.statusCode = 400;
                return next(error);
            }


         if(! emailRegex.test(email))
            {
                const error = new Error("enter valid email");
                error.statusCode = 400;
                return next(error);
            }
      
        const existingMail = await User.findOne({email,_id: { $ne: req.user.id }});
      
         if(existingMail)
            {
                const error = new Error("email already exists");
                error.statusCode = 409;
                return next(error);
             }
        }


          const forUpdate ={};
          if(username){
            forUpdate.username = username.trim();
          }
          if(email){
            forUpdate.email = email.trim();
          }
          if(firstname){
            forUpdate.firstname = firstname.trim();
          }
          if(lastname){
            forUpdate.lastname = lastname.trim();
          }
          if(Object.keys(forUpdate).length === 0){
             const error = new Error("Nothing to update");
            error.statusCode = 400;
            return next(error);

          }
          

          const updatedProfile = await User.findByIdAndUpdate(req.user.id,forUpdate,
            {
                new : true,
                runValidators : true
            }
          )
           if(! updatedProfile) {
             const error = new Error("User Not Found");
            error.statusCode = 404;
            return next(error);
          }

           return res.status(200).json({
            message :"Profile updated Successfully",
            username : updatedProfile.username,
            email : updatedProfile.email,
            firstname : updatedProfile.firstname,
            lastname : updatedProfile.lastname,
            createdAt : updatedProfile.createdAt.toLocaleString(),
            updatedAt : updatedProfile.updatedAt.toLocaleString()

          })

        

    }
    catch(error){
        error.statusCode = error.statusCode || 500;
        return next(error)
    }
}

export const deleteAccount = async(req,res,next) =>{

    try{

        const deletable = await User.findById(req.user.id)
        if(!deletable){
            const error = new Error("User Not Found");
            error.statusCode = 404;
            return next(error);
        }

        if(req.user.role === "admin"){
            const adminCount = await User.countDocuments({role : "admin"})

            if(adminCount === 1){
            const error = new Error("not able to delete last admin");
            error.statusCode = 400;
            return next(error);

            }
        }

        await User.findByIdAndDelete(req.user.id);
         return res.status(200).json({
            message : "Your Account deleted Successfully"
        })



    }
    catch(error){
        error.statusCode = error.statusCode || 500;
        return next(error)

    }
}



export const changePassword = async(req,res,next) =>{
    try{

        const saltRounds = 10;

        const {currentpassword, newpassword} = req.body;

        if(!currentpassword || ! newpassword){
            const error = new Error("currentpassword and newpassword fileds are required");
            error.statusCode = 400;
            return next(error);

        }
        if(currentpassword.trim() === newpassword.trim()){
            const error = new Error("currentpassword and newpassword are same, not able to update");
            error.statusCode = 400;
            return next(error);

        }


        const user = await User.findById(req.user.id);

        if(!user){
            const error = new Error("Not able to find the User by ID");
            error.statusCode = 404;
            return next(error)
        }

        const isMatch = await bcrypt.compare(currentpassword,user.password);

        if(!isMatch){
            const error = new Error("Invalid current password");
            error.statusCode = 401;
            return next(error)

        }
        

        if (! passwordRegex.test(newpassword)){
            const error = new Error("Minimum of 8  and maximum of 15 charecters required includes atleast one caps, one small leetters, also minimum 1 digit and 1 special charecter required ");
            error.statusCode = 400;
            return next(error);

        }

        const hashedNewPassword = await bcrypt.hash(newpassword,saltRounds);

        const updatedUser = await User.findByIdAndUpdate(req.user.id, {password : hashedNewPassword});
        if(! updatedUser){
            const error = new Error("Not able to find the User by ID");
            error.statusCode = 404;
            return next(error)

        }

        return res.status(200).json({
            message : "password Updated Successfully"
        })



    }
    catch(error){
        error.statusCode = error.statusCode || 500;
        return next(error)

    }

}