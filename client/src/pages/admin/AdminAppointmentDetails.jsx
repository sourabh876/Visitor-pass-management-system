import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import {
    getAppointmentById
} from "../../services/appointmentService";

import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/ui/LoadingSpinner";


const AdminAppointmentDetails = () => {

    const {
        id
    } = useParams();

    const navigate =
        useNavigate();


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

        const loadAppointment =
            async () => {

                try {

                    setLoading(true);
                    setError("");


                    const response =
                        await getAppointmentById(
                            id
                        );


                    setAppointment(
                        response.data
                    );

                } catch (error) {

                    console.error(
                        "Failed to load appointment:",
                        error
                    );


                    setError(
                        error.response?.data?.message ||
                        "Unable to load appointment."
                    );

                } finally {

                    setLoading(false);

                }

            };


        loadAppointment();

    }, [id]);


    return (

        <DashboardLayout>
            <div className="min-h-screen bg-gray-100 p-6">

                {loading ? (
                    <LoadingSpinner>
                        {/* <div className="max-w-4xl mx-auto">

                            <div className="bg-white rounded-xl shadow p-8 text-center">

                                <p className="text-gray-600">
                                    Loading appointments...
                                </p>

                            </div>

                        </div> */}

                    </LoadingSpinner>

                ) : error ? (
                    <div className="max-w-3xl mx-auto">

                        <button
                            onClick={() =>
                                navigate(
                                    "/admin/appointments"
                                )
                            }
                            className="text-blue-600 mb-5"
                        >

                            ← Back

                        </button>


                        <div className="bg-red-100 text-red-700 p-5 rounded-lg">

                            {error}

                        </div>

                    </div>
                ) : !appointment ? (
                    <div className="max-w-4xl mx-auto">

                        <div className="bg-white rounded-xl shadow p-8 text-center">

                            <h2 className="text-xl font-semibold text-gray-800">
                                Appointment Not Found
                            </h2>


                            {/* <p className="text-gray-600 mt-3">
                            No visitor pass exists for this appointment.
                        </p> */}


                            <Link
                                to="/visitor/appointments"
                                className="inline-block mt-5 text-blue-600"
                            >
                                ← Back to Appointments
                            </Link>

                        </div>

                    </div>
                ) : (

                    <div className="max-w-4xl mx-auto">


                        <div className="flex justify-between items-center mb-6">

                            <h1 className="text-3xl font-bold text-gray-800">

                                Appointment Details

                            </h1>


                            <Link
                                to="/admin/appointments"
                                className="text-blue-600"
                            >

                                ← Back

                            </Link>

                        </div>


                        <div className="bg-white rounded-xl shadow p-6">


                            {/* STATUS */}

                            <div className="flex justify-between items-center mb-6">

                                <h2 className="text-xl font-semibold">

                                    Appointment

                                </h2>


                                <span className="px-4 py-2 rounded-full bg-gray-100 font-medium">

                                    {
                                        appointment.status
                                    }

                                </span>

                            </div>


                            {/* VISITOR */}

                            <div className="border-b pb-6 mb-6">

                                <h3 className="text-lg font-semibold mb-4">

                                    Visitor Information

                                </h3>


                                <div className="grid md:grid-cols-2 gap-5">

                                    <div>

                                        <p className="text-sm text-gray-500">

                                            Name

                                        </p>

                                        <p className="font-medium">

                                            {
                                                appointment.visitor
                                                    ?.fullName ||
                                                "N/A"
                                            }

                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-sm text-gray-500">

                                            Email

                                        </p>

                                        <p className="font-medium">

                                            {
                                                appointment.visitor
                                                    ?.email ||
                                                "N/A"
                                            }

                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-sm text-gray-500">

                                            Phone

                                        </p>

                                        <p className="font-medium">

                                            {
                                                appointment.visitor
                                                    ?.phone ||
                                                "N/A"
                                            }

                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-sm text-gray-500">

                                            Company

                                        </p>

                                        <p className="font-medium">

                                            {
                                                appointment.visitor
                                                    ?.company ||
                                                "N/A"
                                            }

                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* APPOINTMENT */}

                            <div className="border-b pb-6 mb-6">

                                <h3 className="text-lg font-semibold mb-4">

                                    Visit Information

                                </h3>


                                <div className="grid md:grid-cols-2 gap-5">

                                    <div>

                                        <p className="text-sm text-gray-500">

                                            Host

                                        </p>

                                        <p className="font-medium">

                                            {
                                                appointment.hostName
                                            }

                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-sm text-gray-500">

                                            Department

                                        </p>

                                        <p className="font-medium">

                                            {
                                                appointment.department
                                            }

                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-sm text-gray-500">

                                            Visit Date

                                        </p>

                                        <p className="font-medium">

                                            {
                                                appointment.visitDate
                                            }

                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-sm text-gray-500">

                                            Visit Time

                                        </p>

                                        <p className="font-medium">

                                            {
                                                appointment.visitTime
                                            }

                                        </p>

                                    </div>


                                    <div className="md:col-span-2">

                                        <p className="text-sm text-gray-500">

                                            Purpose

                                        </p>

                                        <p className="font-medium">

                                            {
                                                appointment.purpose
                                            }

                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* APPROVAL */}

                            <div>

                                <h3 className="text-lg font-semibold mb-4">

                                    Approval Information

                                </h3>


                                <div className="grid md:grid-cols-2 gap-5">

                                    <div>

                                        <p className="text-sm text-gray-500">

                                            Approved / Rejected By

                                        </p>

                                        <p className="font-medium">

                                            {
                                                appointment.approvedBy
                                                    ?.name ||
                                                "Not processed"
                                            }

                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-sm text-gray-500">

                                            Email

                                        </p>

                                        <p className="font-medium">

                                            {
                                                appointment.approvedBy
                                                    ?.email ||
                                                "N/A"
                                            }

                                        </p>

                                    </div>


                                    <div className="md:col-span-2">

                                        <p className="text-sm text-gray-500">

                                            Remarks

                                        </p>

                                        <p className="font-medium">

                                            {
                                                appointment.remarks ||
                                                "No remarks"
                                            }

                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </DashboardLayout>





    );

};


export default AdminAppointmentDetails;