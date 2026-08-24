import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useParams
} from "react-router-dom";

import {
    getAppointmentById
} from "../../services/appointmentService";

import {
    useAuth
} from "../../context/AuthContext";

import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const AppointmentDetails = () => {

    const {
        id
    } = useParams();


    const {
        user
    } = useAuth();


    const [
        appointment,
        setAppointment
    ] = useState(null);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    useEffect(() => {

        const loadAppointment = async () => {

            try {

                setLoading(true);

                setError("");


                const response =
                    await getAppointmentById(id);


                const data =
                    response.data;


                if (
                    data?.visitor?.email
                        ?.toLowerCase() !==
                    user?.email
                        ?.toLowerCase()
                ) {

                    setError(
                        "You are not allowed to view this appointment."
                    );

                    return;

                }


                setAppointment(data);


            } catch (error) {

                console.error(
                    "Failed to load appointment:",
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


        if (user) {

            loadAppointment();

        }

    }, [id, user]);




    if (error) {

        return (

            <DashboardLayout>

                <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

                    <div className="bg-white rounded-xl shadow p-8 text-center max-w-md w-full">

                        <h2 className="text-xl font-semibold text-red-600">

                            Unable to open appointment

                        </h2>


                        <p className="text-gray-600 mt-3">

                            {error}

                        </p>


                        <Link
                            to="/visitor/appointments"
                            className="inline-block mt-6 text-blue-600"
                        >

                            ← Back to Appointments

                        </Link>

                    </div>

                </div>

            </DashboardLayout>



        );

    }

    return (

        <DashboardLayout>

            {
                loading ? (

                    <LoadingSpinner>

                    </LoadingSpinner>

                ) : (

                    <div className="min-h-screen bg-gray-100 p-6">

                        <div className="max-w-4xl mx-auto">


                            <Link
                                to="/visitor/appointments"
                                className="text-blue-600 hover:text-blue-800"
                            >

                                ← Back to Appointments

                            </Link>


                            {/*   ===
                    HEADER
                  === */}

                            <div className="bg-white rounded-xl shadow mt-5 p-6">

                                <div className="flex flex-col md:flex-row md:justify-between gap-4">

                                    <div>

                                        <h1 className="text-2xl font-bold text-gray-800">

                                            Appointment Details

                                        </h1>


                                        <p className="text-gray-500 mt-1">

                                            View your appointment status

                                        </p>

                                    </div>


                                    <div>

                                        <span
                                            className={`
                                    inline-block
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


                            {/*   ===
                    APPOINTMENT
                  === */}

                            <div className="bg-white rounded-xl shadow mt-5 p-6">

                                <h2 className="text-lg font-semibold text-gray-800 mb-5">

                                    Visit Information

                                </h2>


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

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


                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Visit Date
                                        </p>

                                        <p className="font-medium text-gray-800 mt-1">

                                            {
                                                appointment.visitDate
                                            }

                                        </p>

                                    </div>


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


                            {/*   ===
                    DECISION
                  === */}

                            {appointment.status !== "Pending" && (

                                <div className="bg-white rounded-xl shadow mt-5 p-6">

                                    <h2 className="text-lg font-semibold text-gray-800">

                                        Appointment Decision

                                    </h2>


                                    <p className="text-gray-700 mt-4">

                                        Your appointment has been{" "}

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


                            {/*   ===
                    PASS
                  === */}

                            {appointment.status === "Approved" && (

                                <div className="bg-green-50 border border-green-200 rounded-xl mt-5 p-6">

                                    <h2 className="text-lg font-semibold text-green-800">

                                        Your appointment is approved

                                    </h2>


                                    <p className="text-green-700 mt-2">

                                        Your visitor pass can now be used
                                        for check-in.

                                    </p>


                                    <Link
                                        to={`/visitor/pass/${appointment._id}`}
                                        className="inline-block mt-5 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-medium"
                                    >

                                        View My Pass

                                    </Link>

                                </div>

                            )}

                        </div>

                    </div>

                )
            }

        </DashboardLayout>





    );

};


export default AppointmentDetails;