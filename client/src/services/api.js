import axios from "axios";


  
// CENTRAL API INSTANCE
  

const api = axios.create({

    baseURL:
        import.meta.env.VITE_API_BASE_URL ||
        "http://localhost:5000/api",

});


  
// ATTACH JWT TOKEN AUTOMATICALLY
  

api.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem("token");


        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }


        return config;

    },

    (error) => {

        return Promise.reject(error);

    }

);


  
// HANDLE RESPONSE ERRORS
  

api.interceptors.response.use(

    (response) => {

        return response;

    },

    (error) => {

        if (
            error.response &&
            error.response.status === 401
        ) {

            console.log(
                "Authentication expired or invalid."
            );

            // We intentionally don't automatically
            // remove the token here yet.
            //
            // AuthContext remains responsible for logout.

        }


        return Promise.reject(error);

    }

);


export default api;