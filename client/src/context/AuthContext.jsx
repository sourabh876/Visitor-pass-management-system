import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    loginUser
} from "../services/authApi";


const AuthContext = createContext();


  
// AUTH PROVIDER
  

export const AuthProvider = ({
    children
}) => {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);


      
    // RESTORE LOGIN AFTER PAGE REFRESH
      

    useEffect(() => {

        const storedUser =
            localStorage.getItem("user");

        const token =
            localStorage.getItem("token");


        if (
            storedUser &&
            token
        ) {

            try {

                const parsedUser =
                    JSON.parse(storedUser);

                setUser(parsedUser);

            } catch (error) {

                console.error(
                    "Invalid stored user:",
                    error
                );

                localStorage.removeItem("user");
                localStorage.removeItem("token");

            }

        }


        setLoading(false);

    }, []);


      
    // LOGIN
      

    const login = async (
        email,
        password
    ) => {

        const response =
            await loginUser({

                email,
                password

            });


        const token =
            response.token;

        const loggedInUser =
            response.user;


        if (
            !token ||
            !loggedInUser
        ) {

            throw new Error(
                "Invalid login response."
            );

        }


        // Save token

        localStorage.setItem(
            "token",
            token
        );


        // Save user

        localStorage.setItem(
            "user",
            JSON.stringify(
                loggedInUser
            )
        );


        // Update React state

        setUser(
            loggedInUser
        );


        return loggedInUser;

    };


      
    // LOGOUT
      

    const logout = () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        setUser(null);

    };


      
    // CONTEXT VALUE
      

    return (

        <AuthContext.Provider
            value={{

                user,

                loading,

                login,

                logout,

                isAuthenticated:
                    Boolean(user)

            }}
        >

            {children}

        </AuthContext.Provider>

    );

};


  
// CUSTOM HOOK
  

export const useAuth = () => {

    return useContext(
        AuthContext
    );

};