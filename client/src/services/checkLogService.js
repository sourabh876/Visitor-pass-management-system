import api from "./api";


  
// Check In Visitor
  

export const checkInVisitor = async (passNumber) => {

    const response = await api.post(
        "/checklogs/check-in",
        {
            passNumber
        }
    );

    return response.data;
};


  
// Check Out Visitor
  

export const checkOutVisitor = async (passNumber) => {

    const response = await api.post(
        "/checklogs/check-out",
        {
            passNumber
        }
    );

    return response.data;
};


  
// Get All Check Logs
  

export const getCheckLogs = async () => {

    const response = await api.get(
        "/checklogs"
    );

    return response.data;
};


  
// Get Visitors Currently Inside
  

export const getVisitorsInside = async () => {

    const response = await api.get(
        "/checklogs/inside"
    );

    return response.data;
};