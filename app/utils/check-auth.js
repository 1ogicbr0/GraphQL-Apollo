import { AuthenticationError } from 'apollo-server';
import jwt from 'jsonwebtoken';
require("dotenv").config({ path: "./.env" });
const SECRET = process.env.SECRET_KEY;

const checkAuth = (context) => {
    // context = { ...headers }
    const authHeader = context.req.headers.authorization;
    if(authHeader){
        // Bearer ....
        const token = authHeader.split('Bearer ')[1];
        if(token){
            try{
                console.log(SECRET)
                const user = jwt.verify(token, SECRET);
                return user;
            } catch(err){
                throw new AuthenticationError('Invalid/Expired token')
            }
        }
        throw new Error('Authentication token must be \'Bearer [token]')
    }
    throw new Error('Authentication header must be provided')
}

export default checkAuth