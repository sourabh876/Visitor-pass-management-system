import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useParams
} from "react-router-dom";


import {
    getAppointmentById,
    approveAppointment,
    rejectAppointment
} from "../../services/appointmentService";


import {
    createPass,
    getPasses,
    cancelPass,
    downloadPassPDF
} from "../../services/passService";

import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

import {
    toast
} from "react-toastify";

const AppointmentDetails = () => {

    const {
        id
    } = useParams();



    // APPOINTMENT STATE


    const [
        appointment,
        setAppointment
    ] = useState(null);



    // PASS STATE


    const [
        pass,
        setPass
    ] = useState(null);



    // GENERAL STATE


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    const [
        remarks,
        setRemarks
    ] = useState("");



    // APPOINTMENT ACTION LOADING

    const [
        actionApproveLoading,
        setActionApproveLoading
    ] = useState(false);

    const [
        actionRejectLoading,
        setActionRejectLoading
    ] = useState(false);

    



    // PASS ACTION LOADING


    const [
        generatingPass,
        setGeneratingPass
    ] = useState(false);


    const [
        cancellingPass,
        setCancellingPass
    ] = useState(false);


    const [
        downloadingPass,
        setDownloadingPass
    ] = useState(false);



    // LOAD APPOINTMENT + PASS


    const loadData = async () => {

        try {

            setLoading(true);

            setError("");

            // Get appointment
            

            const appointmentResponse =
                await getAppointmentById(
                    id
                );


            const appointmentData =
                appointmentResponse.data;


            setAppointment(
                appointmentData
            );


            
            // Get all passes
            

            const passResponse =
                await getPasses();


            const allPasses =
                passResponse.data || [];


            
            // Find pass for this appointment
            

            const existingPass =
                allPasses.find(
                    (item) => {

                        return (

                            item.appointment?._id ===
                            id ||

                            item.appointment ===
                            id

                        );

                    }
                );


            setPass(
                existingPass || null
            );


        } catch (error) {

            console.error(
                "Failed to load appointment/pass:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to load appointment."
            );


        } finally {

            setLoading(false);

        }

    };



    // INITIAL LOAD


    useEffect(() => {

        if (id) {

            loadData();

        }

    }, [id]);



    // APPROVE APPOINTMENT


    const handleApprove = async () => {

        try {

            setActionApproveLoading(true);

            setError("");


            await approveAppointment(
                id,
                remarks
            );


            toast.success(
                "Appointment approved successfully."
            );


            // Reload appointment

            await loadData();


        } catch (error) {

            console.error(
                "Approve error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to approve appointment."
            );

            toast.error("Failed to approve appointment.")

        } finally {

            setActionApproveLoading(false);

        }

    };



    // REJECT APPOINTMENT


    const handleReject = async () => {

        try {

            setActionRejectLoading(true);

            setError("");


            await rejectAppointment(
                id,
                remarks
            );


            toast.success(
                "Appointment rejected successfully."
            );


            // Reload appointment

            await loadData();


        } catch (error) {

            console.error(
                "Reject error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to reject appointment."
            );

            toast.error("Failed to reject appointment.")


        } finally {

            setActionRejectLoading(false);

        }

    };



    // GENERATE PASS


    const handleGeneratePass = async () => {

        try {

            setGeneratingPass(true);

            setError("");


            const response =
                await createPass(
                    id
                );


            // Save newly generated pass

            setPass(
                response.data
            );


            toast.success(
                "Visitor pass generated successfully."
            );


        } catch (error) {

            console.error(
                "Generate pass error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to generate visitor pass."
            );

            toast.error("Failed to generate visitor pass.")


        } finally {

            setGeneratingPass(false);

        }

    };



    // NOT FOUND


    if (!appointment) {

        return (

            <DashboardLayout>

                <div className="min-h-screen bg-gray-100 flex items-center justify-center">

                    <div className="bg-white p-8 rounded-xl shadow text-center">

                        <h2 className="text-xl font-semibold text-gray-800">

                            Appointment not found

                        </h2>


                        <p className="text-red-600 mt-3">

                            {error}

                        </p>


                        <Link
                            to="/employee/dashboard"
                            className="inline-block mt-5 text-blue-600"
                        >

                            Back to Dashboard

                        </Link>

                    </div>

                </div>

            </DashboardLayout>

        );

    }


    return (

        <DashboardLayout>

            {loading ? (

                <LoadingSpinner>
                    
                </LoadingSpinner>

            ) : (

                <div className="min-h-screen bg-gray-100 p-6">

                    <div className="max-w-4xl mx-auto">


                        {/*   ====
                    BACK
                     ==== */}

                        <Link
                            to="/employee/dashboard"
                            className="text-blue-600 hover:text-blue-800"
                        >

                            ← Back to Dashboard

                        </Link>


                        {/*   ====
                    HEADER
                     ==== */}

                        <div className="bg-white rounded-xl shadow mt-5 p-6">

                            <div className="flex flex-col md:flex-row md:justify-between gap-4">

                                <div>

                                    <h1 className="text-2xl font-bold text-gray-800">

                                        Appointment Details

                                    </h1>


                                    <p className="text-gray-500 mt-1">

                                        Review visitor appointment request

                                    </p>

                                </div>


                                <div>

                                    <span
                                        className={`
                                    px-4
                                    py-2
                                    rounded-full
                                    text-sm
                                    font-medium

                                    ${appointment.status ===
                                                "Approved"

                                                ? "bg-green-100 text-green-700"

                                                : appointment.status ===
                                                    "Rejected"

                                                    ? "bg-red-100 text-red-700"

                                                    : "bg-yellow-100 text-yellow-700"
                                            }
                                `}
                                    >

                                        {
                                            appointment.status
                                        }

                                    </span>

                                </div>

                            </div>

                        </div>


                        {/*   ====
                    ERROR
                     ==== */}

                        {error && (

                            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mt-5">

                                {error}

                            </div>

                        )}


                        {/*   ====
                    VISITOR INFORMATION
                     ==== */}

                        <div className="bg-white rounded-xl shadow mt-5 p-6">

                            <h2 className="text-lg font-semibold text-gray-800 mb-5">

                                Visitor Information

                            </h2>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                                {/* NAME */}

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Name
                                    </p>


                                    <p className="font-medium text-gray-800 mt-1">

                                        {
                                            appointment.visitor
                                                ?.fullName ||
                                            "N/A"
                                        }

                                    </p>

                                </div>


                                {/* EMAIL */}

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Email
                                    </p>


                                    <p className="font-medium text-gray-800 mt-1">

                                        {
                                            appointment.visitor
                                                ?.email ||
                                            "N/A"
                                        }

                                    </p>

                                </div>


                                {/* PHONE */}

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Phone
                                    </p>


                                    <p className="font-medium text-gray-800 mt-1">

                                        {
                                            appointment.visitor
                                                ?.phone ||
                                            "N/A"
                                        }

                                    </p>

                                </div>


                                {/* COMPANY */}

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Company
                                    </p>


                                    <p className="font-medium text-gray-800 mt-1">

                                        {
                                            appointment.visitor
                                                ?.company ||
                                            "N/A"
                                        }

                                    </p>

                                </div>

                            </div>

                        </div>


                        {/*   ====
                    APPOINTMENT INFORMATION
                     ==== */}

                        <div className="bg-white rounded-xl shadow mt-5 p-6">

                            <h2 className="text-lg font-semibold text-gray-800 mb-5">

                                Appointment Information

                            </h2>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                                {/* HOST */}

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Host
                                    </p>


                                    <p className="font-medium text-gray-800 mt-1">

                                        {
                                            appointment.hostName
                                        }

                                    </p>

                                </div>


                                {/* DEPARTMENT */}

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Department
                                    </p>


                                    <p className="font-medium text-gray-800 mt-1">

                                        {
                                            appointment.department
                                        }

                                    </p>

                                </div>


                                {/* VISIT DATE */}

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Visit Date
                                    </p>


                                    <p className="font-medium text-gray-800 mt-1">

                                        {
                                            new Date(
                                                appointment.visitDate
                                            ).toLocaleDateString()
                                        }

                                    </p>

                                </div>


                                {/* VISIT TIME */}

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Visit Time
                                    </p>


                                    <p className="font-medium text-gray-800 mt-1">

                                        {
                                            appointment.visitTime
                                        }

                                    </p>

                                </div>


                                {/* PURPOSE */}

                                <div className="md:col-span-2">

                                    <p className="text-sm text-gray-500">
                                        Purpose
                                    </p>


                                    <p className="font-medium text-gray-800 mt-1">

                                        {
                                            appointment.purpose
                                        }

                                    </p>

                                </div>

                            </div>

                        </div>


                        {/*   ====
                    PENDING APPOINTMENT ACTIONS
                     ==== */}

                        {appointment.status === "Pending" && (

                            <div className="bg-white rounded-xl shadow mt-5 p-6">

                                <h2 className="text-lg font-semibold text-gray-800 mb-4">

                                    Review Appointment

                                </h2>


                                <textarea
                                    value={remarks}
                                    onChange={(e) =>
                                        setRemarks(
                                            e.target.value
                                        )
                                    }
                                    rows="4"
                                    placeholder="Enter remarks (optional)"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />


                                <div className="flex flex-col sm:flex-row gap-4 mt-5">


                                    {/* APPROVE */}

                                    <button
                                        type="button"
                                        onClick={
                                            handleApprove
                                        }
                                        disabled={
                                            actionApproveLoading
                                        }
                                        className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-6 py-3 rounded-lg font-medium"
                                    >

                                        {
                                            actionApproveLoading
                                                ? "Processing..."
                                                : "Approve Appointment"
                                        }

                                    </button>


                                    {/* REJECT */}

                                    <button
                                        type="button"
                                        onClick={
                                            handleReject
                                        }
                                        disabled={
                                            actionRejectLoading
                                        }
                                        className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-6 py-3 rounded-lg font-medium"
                                    >

                                        {
                                            actionRejectLoading
                                                ? "Processing..."
                                                : "Reject Appointment"
                                        }

                                    </button>

                                </div>

                            </div>

                        )}


                        {/*   ====
                    DECISION INFORMATION
                     ==== */}

                        {appointment.status !== "Pending" && (

                            <div className="bg-white rounded-xl shadow mt-5 p-6">

                                <h2 className="text-lg font-semibold text-gray-800 mb-4">

                                    Decision

                                </h2>


                                <p className="text-gray-700">

                                    This appointment has been{" "}

                                    <strong>
                                        {appointment.status}
                                    </strong>

                                    .

                                </p>


                                {appointment.remarks && (

                                    <div className="mt-4">

                                        <p className="text-sm text-gray-500">
                                            Remarks
                                        </p>


                                        <p className="text-gray-800 mt-1">

                                            {
                                                appointment.remarks
                                            }

                                        </p>

                                    </div>

                                )}


                                {appointment.approvedBy && (

                                    <div className="mt-4">

                                        <p className="text-sm text-gray-500">
                                            Processed By
                                        </p>


                                        <p className="text-gray-800 mt-1">

                                            {
                                                appointment
                                                    .approvedBy
                                                    ?.name ||
                                                "N/A"
                                            }

                                        </p>

                                    </div>

                                )}

                            </div>

                        )}


                        {/*   ====
                    PASS MANAGEMENT
                     ==== */}

                        {appointment.status === "Approved" && (

                            <div className="bg-white rounded-xl shadow mt-5 p-6">

                                <h2 className="text-lg font-semibold text-gray-800 mb-4">

                                    Visitor Pass

                                </h2>


                                {/*   
                            NO PASS
                              */}

                                {!pass && (

                                    <div>

                                        <p className="text-gray-600 mb-5">

                                            This appointment has been approved.
                                            You can now generate a visitor pass.

                                        </p>


                                        <button
                                            type="button"
                                            onClick={
                                                handleGeneratePass
                                            }
                                            disabled={
                                                generatingPass
                                            }
                                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium"
                                        >

                                            {
                                                generatingPass
                                                    ? "Generating Pass..."
                                                    : "Generate Pass"
                                            }

                                        </button>

                                    </div>

                                )}


                                {/*   
                            PASS EXISTS
                              */}

                                {pass && (

                                    <div>


                                        {/* PASS INFORMATION */}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                                            {/* PASS NUMBER */}

                                            <div>

                                                <p className="text-sm text-gray-500">
                                                    Pass Number
                                                </p>


                                                <p className="font-semibold text-gray-800 mt-1">

                                                    {
                                                        pass.passNumber
                                                    }

                                                </p>

                                            </div>


                                            {/* STATUS */}

                                            <div>

                                                <p className="text-sm text-gray-500">
                                                    Pass Status
                                                </p>


                                                <span
                                                    className={`
                                                inline-block
                                                mt-1
                                                px-3
                                                py-1
                                                rounded-full
                                                text-sm
                                                font-medium

                                                ${pass.status ===
                                                            "Active"

                                                            ? "bg-green-100 text-green-700"

                                                            : pass.status ===
                                                                "Cancelled"

                                                                ? "bg-red-100 text-red-700"

                                                                : "bg-gray-100 text-gray-700"
                                                        }
                                            `}
                                                >

                                                    {
                                                        pass.status
                                                    }

                                                </span>

                                            </div>


                                            {/* VALID FROM */}

                                            <div>

                                                <p className="text-sm text-gray-500">
                                                    Valid From
                                                </p>


                                                <p className="text-gray-800 mt-1">

                                                    {
                                                        new Date(
                                                            pass.validFrom
                                                        ).toLocaleString()
                                                    }

                                                </p>

                                            </div>


                                            {/* VALID UNTIL */}

                                            <div>

                                                <p className="text-sm text-gray-500">
                                                    Valid Until
                                                </p>


                                                <p className="text-gray-800 mt-1">

                                                    {
                                                        new Date(
                                                            pass.validUntil
                                                        ).toLocaleString()
                                                    }

                                                </p>

                                            </div>

                                        </div>


                                        {/*   
                                    QR CODE
                                      */}

                                        {pass.qrCode && (

                                            <div className="mt-6 text-center">

                                                <p className="text-sm text-gray-500 mb-3">

                                                    Visitor QR Code

                                                </p>


                                                <img
                                                    src={
                                                        pass.qrCode
                                                    }
                                                    alt="Visitor Pass QR Code"
                                                    className="w-48 h-48 mx-auto border rounded-lg p-2"
                                                />

                                            </div>

                                        )}


                                        {/*   
                                    PASS ACTIONS
                                      */}

                                        <div className="flex flex-col sm:flex-row gap-3 mt-6">


                                            {/* VIEW PASS */}

                                            <Link
                                                to={`/employee/passes/${pass._id}`}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg text-center font-medium"
                                            >

                                                View Pass

                                            </Link>



                                        </div>

                                    </div>

                                )}

                            </div>

                        )}

                    </div>

                </div>

            )}

        </DashboardLayout>



    );

};


export default AppointmentDetails;