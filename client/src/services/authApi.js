import api from "./api";


  
// REGISTER VISITOR
  

export const registerVisitor = async (data) => {

    const response = await api.post(
        "/auth/register",
        data
    );

    return response.data;

};


  
// LOGIN
  

export const loginUser = async (data) => {

    const response = await api.post(
        "/auth/login",
        data
    );

    return response.data;

};


  
// GET LOGGED-IN USER PROFILE
  

export const getProfile = async () => {

    const response = await api.get(
        "/auth/profile"
    );

    return response.data;

};