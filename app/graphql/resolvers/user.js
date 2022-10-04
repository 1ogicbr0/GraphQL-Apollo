import bcrypt from 'bcryptjs';
import  jwt  from 'jsonwebtoken';
import User from "../../models/User";
import { UserInputError } from 'apollo-server'
import validatedRegisterInput, {validateLoginInput} from '../../utils/validators';
require("dotenv").config({ path: "./.env" });
const SECRET = process.env.SECRET_KEY;

const generateToken = (user) => {
  return (jwt.sign({
    id:user.id,
    email: user.email,
    username: user.username,
},SECRET, {expiresIn: '1h'}))
}

const userResolvers = {
  Mutation: {
    async login(_, { username, password}){
      const {errors , valid} = validateLoginInput(username,password);
      if(!valid){
        throw new UserInputError('Errors', {errors})
      }
      const user = await User.findOne( {username} );
      if(!user){
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if(!match){
        errors.general = 'User not found'
        throw new UserInputError('Wrong credentials', { errors});
      }

      const token = generateToken(user)
      return{
        ...user._doc,
        id: user._id,
        token
    }

    },
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } },
    ) {
      //validate user data
      const { valid, errors } = validatedRegisterInput(username, email, password, confirmPassword );
      if(!valid){
        throw new UserInputError('Error', {errors})
      }
      //Make sure user doesnot exists
      const user =await  User.findOne({ username });
      if(user){
        throw new UserInputError('Username is taken',{
          errors: {
            username: 'This username is taken'
          }
        })
      }
      //hash password and create authentication token  --Implemented
      password = await bcrypt.hash(password,12);
      const newUser = new User({
          email,
          username,
          password,
          createdAt: new Date().toISOString()
      })
      const res = await newUser.save();

      const token = generateToken(res)

      return{
          ...res._doc,
          id: res._id,
          token
      }
    },
  },
};

export default userResolvers;
