import api from "./api";


  
// GET ALL PASSES
  

export const getPasses = async () => {

    const response = await api.get(
        "/passes"
    );

    return response.data;

};


export const getVisitorPasses = async () => {

    const response = await api.get(
        "/passes/me"
    );

    return response.data;

};


  
// GET PASS BY ID
  

export const getPassById = async (id) => {

    const response = await api.get(
        `/passes/${id}`
    );

    return response.data;

};

// GET PASS BY APPOINTMENT ID

export const getPassByAppointmentId = async (
    appointmentId
) => {

    const response = await api.get(
        `/passes/appointment/${appointmentId}`
    );

    return response.data;

};


  
// GET PASS BY PASS NUMBER
  

export const getPassByNumber = async (
    passNumber
) => {

    const response = await api.get(
        `/passes/number/${passNumber}`
    );

    return response.data;

};


  
// CREATE PASS
  

export const createPass = async (
    appointmentId
) => {

    const response = await api.post(
        "/passes",
        {
            appointmentId
        }
    );

    return response.data;

};


  
// CANCEL PASS
  

export const cancelPass = async (id) => {

    const response = await api.put(
        `/passes/${id}/cancel`
    );

    return response.data;

};


  
// DOWNLOAD PASS PDF
  

export const downloadPassPDF = async (
    passId
) => {

    const response = await api.get(
        `/passes/${passId}/pdf`,
        {
            responseType: "blob"
        }
    );

    return response.data;

};