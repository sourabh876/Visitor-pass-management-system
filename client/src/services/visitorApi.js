import api from "./api";


  
// GET ALL VISITORS
  

export const getVisitors = async () => {

    const response = await api.get(

        "/visitors"
        
    );

    return response.data;

};


  
// GET SINGLE VISITOR
  

export const getVisitorById = async (id) => {

    const response = await api.get(
        `/visitors/${id}`
    );

    return response.data;

};


  
// CREATE VISITOR
//
// Admin / Security / Employee
  

export const createVisitor = async (formData) => {

    const response = await api.post(
        "/visitors",
        formData
    );

    return response.data;

};


  
// UPDATE VISITOR
//
// Admin / Security / Employee
  

export const updateVisitor = async (
    id,
    formData
) => {

    const response = await api.put(
        `/visitors/${id}`,
        formData
    );

    return response.data;

};


  
// SOFT DELETE VISITOR
  

export const deleteVisitor = async (id) => {

    const response = await api.delete(
        `/visitors/${id}`
    );

    return response.data;

};


  
// GET MY VISITOR PROFILE
//
// Logged-in visitor
  

export const getMyVisitorProfile = async () => {

    const response = await api.get(
        "/visitors/me"
    );

    return response.data;

};


  
// CREATE MY VISITOR PROFILE
//
// Logged-in visitor
  

export const createMyVisitorProfile = async (
    formData
) => {

    const response = await api.post(
        "/visitors/me",
        formData
    );

    return response.data;

};


  
// UPDATE MY VISITOR PROFILE
//
// Logged-in visitor
  

export const updateMyVisitorProfile = async (
    formData
) => {

    const response = await api.put(
        "/visitors/me",
        formData
    );

    return response.data;

};