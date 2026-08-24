import api from "./api";


const downloadReport = async (
    reportType,
    params = {}
) => {

    const response =
        await api.get(
            `/reports/${reportType}`,
            {
                params,
                responseType: "blob"
            }
        );


    return response.data;

};



// APPOINTMENTS


export const exportAppointments =
    (params) =>
        downloadReport(
            "appointments",
            params
        );



// VISITORS


export const exportVisitors =
    (params) =>
        downloadReport(
            "visitors",
            params
        );



// PASSES


export const exportPasses =
    (params) =>
        downloadReport(
            "passes",
            params
        );



// USERS


export const exportUsers =
    (params) =>
        downloadReport(
            "users",
            params
        );



// CHECK LOGS


export const exportCheckLogs =
    (params) =>
        downloadReport(
            "checklogs",
            params
        );