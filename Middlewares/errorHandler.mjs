export const errorHandler = (err,req,res,next)=>{


    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
        status : "Error Exists",
        message : err.message || "Internal Server Error"

    })

}