import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) =>{

    try{
        const authHeader = req.headers.authorization;
        

        if(!authHeader){
            const error = new Error("Authorization Header is Missing");
            error.statusCode = 401;
            return next(error);
        }



        if(! authHeader.startsWith("Bearer ")){
            const error = new Error("Invalid Token Format");
            error.statusCode = 401;
            return next(error);

        }

       

        const token = authHeader.split(" ")[1];

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decodedToken;

        next();
    }
    catch(error){
        error.statusCode = error.statusCode || 500;
        return next(error) 
    }

}

// if(Object.keys(req.body).length === 0){
//             const error = new Error("enter valid password to get access");
//            error.statusCode = 403;
//             return next(error);

//         }