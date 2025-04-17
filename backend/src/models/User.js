import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({ // create user schema, take in user object
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profileImage: {
        type: String,
        default: ""
    }
}); // from schema, create model (username, email, pw, image)

// hash password before saving user to db
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next(); // hash only if pw updated

    const salt = await bcrypt.genSalt(10); // recommended is 10
    this.password = await bcrypt.hash(this.password, salt)

    next(); // call after hashing
})

// compare password
userSchema.methods.comparePassword = async function(userPassword) { // check if match db
    return await bcrypt.compare(userPassword, this.password);
}

const User = mongoose.model("User", userSchema); // uppercase model, convert to userschema

export default User; // export to interact with model