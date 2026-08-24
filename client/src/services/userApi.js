import api from "./api";


  
// GET ALL EMPLOYEES
  

export const getEmployees = async () => {

    const response =
        await api.get(
            "/users/employees"
        );

    return response.data;

};


  
// GET ALL USERS
// ADMIN ONLY
  

export const getUsers = async () => {

    const response =
        await api.get(
            "/users"
        );

    return response.data;

};


  
// CREATE EMPLOYEE / SECURITY
// ADMIN ONLY
  

export const createUser = async (data) => {

    const response =
        await api.post(
            "/users",
            data
        );

    return response.data;

};