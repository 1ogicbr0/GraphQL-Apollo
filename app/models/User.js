import { model, Schema } from 'mongoose';

const userSchema = new Schema({
    username: {type:String, required:true},
    password: {type:String, required:true},
    email: String,
    createdAt: String
})

const User = model('User', userSchema);
export default User;