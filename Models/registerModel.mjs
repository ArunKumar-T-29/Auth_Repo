
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstname : {
        type : String,
        required : true,
        maxlength : 15,
        trim : true

    },
    lastname : {
        type : String,
        maxlength : 15,
        trim : true

    },
    
    username : {
        type : String,
        unique : true,
        required : true,
        trim : true,
        maxlength : 10
    },
    password : {
        type : String,
        required : true,
        minlength : 8,
        trim : true
    },
    email: {
        type : String,
        unique : true,
        required : true,
        trim : true,
        lowercase : true
    },
    role : {
        type : String,
        enum : ["user","admin"],
        default : "user"
    }
},{timestamps : true})

const User = mongoose.model('User',userSchema);
export default User;