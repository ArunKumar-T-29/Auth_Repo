
export const roleMiddleware = (...allowedRoles) =>{


return (req,res,next) =>{
    
    try{

        if(!req.user.role){
            const error = new Error("Not able to verify your role");
            error.statusCode = 401;
            return next(error);
        }

        // if( req.user.role !== "admin"){
        //     const error = new Error("Only admins can access this feauture");
        //     error.statusCode = 403;
        //     return next(error);
        // }

        if(! allowedRoles.includes(req.user.role)){
            const error = new Error(`Sorry, ${req.user.role} cannot access this feature`);
            error.statusCode = 403;
            return next(error);

        }

        next();



    }
    catch (error){
        error.statusCode = error.statusCode || 500;
        return next(error);
    }
}
};