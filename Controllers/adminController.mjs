import User from "../Models/registerModel.mjs";

export const adminDashboard = async (req, res, next) => {
    try {

        const totalUsers = await User.countDocuments();
        const totalAdmins = await User.countDocuments({ role: "admin" });
        const totalNormalUsers = await User.countDocuments({ role: "user" });

        return res.status(200).json({
            message: "Dashboard data fetched successfully",
            totalUsers,
            totalAdmins,
            totalNormalUsers
        });

    } catch (error) {
        error.statusCode = error.statusCode || 500;
        return next(error);
    }
};


export const getAllUsers = async (req,res,next) =>{

 try{
        const usersList = await User.find().select("_id username email role createdAt updatedAt");

        if(usersList.length === 0){
            const error = new Error("Not able to find the Users");
            error.statusCode = 404;
            return next(error);
        }
        return res.status(200).json({
            message : "users fetched successfully",
            totalusers : usersList.length,
            users : usersList
        });
   }
   catch(error){
        error.statusCode = error.statusCode || 500;
        return next(error);
   }

}


export const deleteUserByMail = async (req,res,next) =>{
    try{

         if(! req.body.email)
            {
                const error = new Error("enter valid mail id");
                error.statusCode = 400;
                return next(error);
   
            }
        
        
        if(req.body.email){


            const deleteByMail = await User.findOne({email : req.body.email});
            if(! deleteByMail){
                const error = new Error("Not able to find user");
                error.statusCode = 404;
                return next(error);
            }

            if(deleteByMail.role === "admin"){
                const error = new Error("Deleting another admin is not possible");
                error.statusCode = 403;
                return next(error);

            }

            const deletedUser = await User.findByIdAndDelete(deleteByMail._id);

            if(!deletedUser){
                const error = new Error("unable to find user");
                error.statusCode = 404;
                return next(error);
            }
            return res.status(200).json({
                message : "user deleted successfully"
            })
        }

        

    }
    catch(error){
        error.statusCode = error.statusCode || 500;
        return next(error);
   }

}

export const deleteUserByID = async (req,res,next) =>{

    try{

        const {id} = req.params;

        if(! id){
            const error = new Error("Id is required");
                error.statusCode = 400;
                return next(error);

        }
        const toDelteUser = await User.findById(id);

        if(! toDelteUser){
                const error = new Error("User not found");
                error.statusCode = 404;
                return next(error);

        }

        if(toDelteUser.role === "admin"){
            const error = new Error("Deleting another admin is not possible");
                error.statusCode = 403;
                return next(error);
        }

         await User.findByIdAndDelete(id);
         return res.status(200).json({
             message : "user deleted successfully"
         })


    }
    catch(error){
         error.statusCode = error.statusCode || 500;
        return next(error);

    }


}




export const changeRoleByID = async (req, res, next) => {
    try {
        const { id } = req.params;
        const role = req.body.role?.trim().toLowerCase();

        const allowedRoles = ["user", "admin"];

        if (!role || !allowedRoles.includes(role)) {
            const error = new Error("Invalid role");
            error.statusCode = 400;
            return next(error);
        }

        const user = await User.findById(id);

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            return next(error);
        }

        
        if (user.role === "admin") {
            const error = new Error("Changing another admin's role is restricted");
            error.statusCode = 403;
            return next(error);
        }

        
        if (user.role === role) {
            const error = new Error("User already has this role");
            error.statusCode = 400;
            return next(error);
        }

        user.role = role;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Role updated successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        error.statusCode = error.statusCode || 500;
        return next(error);
    }
};

export const visitUserProfileByID = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select("-password");

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            return next(error);
        }

        if (user.role === "admin") {
            const error = new Error("Visiting another admin profile is restricted");
            error.statusCode = 403;
            return next(error);
        }

        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user
        });

    } catch (error) {
        error.statusCode = error.statusCode || 500;
        return next(error);
    }
};