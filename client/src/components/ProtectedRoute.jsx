import {
    Navigate
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext";


const ProtectedRoute = ({
    allowedRoles,
    children
}) => {

    const {
        user,
        loading
    } = useAuth();


      
    // AUTH STATE LOADING
      

    if (loading) {

        return (

            <div className="min-h-screen flex items-center justify-center">

                <p className="text-gray-600">

                    Loading...

                </p>

            </div>

        );

    }


      
    // NOT LOGGED IN
      

    if (!user) {

        return (

            <Navigate
                to="/login"
                replace
            />

        );

    }


      
    // ROLE CHECK
      

    if (
        allowedRoles &&
        !allowedRoles.includes(user.role)
    ) {

        return (

            <Navigate
                to="/unauthorized"
                replace
            />

        );

    }


      
    // AUTHORIZED
      

    return children;

};


export default ProtectedRoute;