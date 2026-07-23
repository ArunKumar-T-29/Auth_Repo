import mongoose from 'mongoose';

export const idValidator = (req, res, next)=>{
    if(! mongoose.Types.ObjectId.isValid(req.params.id)){
        const error = new Error("Invalid ID");
        error.statusCode = 400;
        return next(error);
    }
    next();
}