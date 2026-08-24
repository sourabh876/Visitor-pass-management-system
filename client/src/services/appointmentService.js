import api from "./api";


  
// CREATE APPOINTMENT
  

export const createAppointment = async (data) => {

    const response = await api.post(
        "/appointments/",
        data
    );

    return response.data;

};


  
// GET APPOINTMENTS
  

export const EmployeeAppointments = async () => {

    const response = await api.get(
        "/appointments/employee"
    );

    return response.data;

};

export const getAppointments = async () => {

    const response = await api.get(
        "/appointments/"
    );

    return response.data;

};

export const VisitorAppointments = async () => {

    const response = await api.get(
        "/appointments/my"
    );

    return response.data;

};


  
// GET APPOINTMENT BY ID
  

export const getAppointmentById = async (id) => {

    const response = await api.get(
        `/appointments/${id}`
    );

    return response.data;

};


  
// UPDATE APPOINTMENT
  

export const updateAppointment = async (
    id,
    data
) => {

    const response = await api.put(
        `/appointments/${id}`,
        data
    );

    return response.data;

};


  
// APPROVE APPOINTMENT
  

export const approveAppointment = async (
    id,
    remarks = ""
) => {

    const response = await api.patch(
        `/appointments/${id}/approve`,
        {
            remarks
        }
    );

    return response.data;

};


  
// REJECT APPOINTMENT
  

export const rejectAppointment = async (
    id,
    remarks = ""
) => {

    const response = await api.patch(
        `/appointments/${id}/reject`,
        {
            remarks
        }
    );

    return response.data;

};


  
// DELETE APPOINTMENT
  

export const deleteAppointment = async (id) => {

    const response = await api.delete(
        `/appointments/${id}`
    );

    return response.data;

};