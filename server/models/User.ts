import mongoose, { model } from "mongoose";
import { User } from "../types";

const userSchema = new mongoose.Schema<User>({
    username: {
        type: String,
        required: true,
        unique: true
    },

    pwdHash: {
        type: String,
        required: true
    }
})

userSchema.set('toJSON', {
    transform: (_doc, returnedObject) => {
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.pwdHash
    }
})

const UserModel = model<User>('UserModel', userSchema)
export default UserModel