import React, {useContext} from "react";
import {useLocation,Navigate} from 'react-router-dom';
import { AuthContext } from "../context/auth";

const AuthRoute = (props) => {
    const location = useLocation();
    const { user } = useContext(AuthContext);
    if(user){
        return <Navigate to="/" state={{ from: location}} />
    }else {
        return props.children
    }
}

export default AuthRoute;