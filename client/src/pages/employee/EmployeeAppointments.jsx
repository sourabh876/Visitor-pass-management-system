import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    EmployeeAppointments
} from "../../services/appointmentService";

import {
    useAuth
} from "../../context/AuthContext";

import DashboardLayout from "../../components/layout/DashboardLayout"
import LoadingSpinner from "../../components/ui/LoadingSpinner";


const EmployeeAllAppointments = () => {

    const {
        user,

    } = useAuth();


    const [
        appointments,
        setAppointments
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");



    // LOAD APPOINTMENTS


    useEffect(() => {

        const loadAppointments = async () => {

            try {

                setLoading(true);

                setError("");


                const response = await EmployeeAppointments();


                const allAppointments =
                    response.data || [];



                // Only appointments for logged-in employee


                const employeeAppointments =
                    allAppointments.filter(
                        (appointment) => {

                            return (
                                appointment.hostName
                                    ?.toLowerCase() ===
                                user?.name
                                    ?.toLowerCase()
                            );

                        }
                    );


                setAppointments(
                    employeeAppointments
                );

            } catch (error) {

                console.error(
                    "Failed to load appointments:",
                    error
                );


                setError(
                    error.response?.data?.message ||
                    "Failed to load appointments."
                );

            } finally {

                setLoading(false);

            }

        };


        if (user) {

            loadAppointments();

        }

    }, [user]);


    // LOADING

 

    return (

        <DashboardLayout>

            {loading ? (

                <LoadingSpinner>
                     
                </LoadingSpinner>

            ) : (

                <div className="min-h-screen bg-gray-100 p-6">

                    {/*     
                HEADER
                 */}

                    <div className="max-w-7xl mx-auto">


                        <div className="bg-white rounded-xl shadow">

                            <div className="px-6 py-5 border-b">

                                <h2 className="text-xl font-semibold text-gray-800">

                                    Appointment Requests

                                </h2>

                            </div>


                            {appointments.length === 0 ? (

                                <div className="p-8 text-center text-gray-500">

                                    No appointment requests found.

                                </div>

                            ) : (

                                <div className="overflow-x-auto">

                                    <table className="w-full">

                                        <thead className="bg-gray-50">

                                            <tr>

                                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                                    Visitor
                                                </th>

                                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                                    Purpose
                                                </th>

                                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                                    Date
                                                </th>

                                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                                    Time
                                                </th>

                                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                                    Status
                                                </th>

                                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                                    Action
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {appointments.map(
                                                (appointment) => (

                                                    <tr
                                                        key={
                                                            appointment._id
                                                        }
                                                        className="border-t"
                                                    >

                                                        {/* Visitor */}

                                                        <td className="px-6 py-4">

                                                            <div>

                                                                <p className="font-medium text-gray-800">

                                                                    {
                                                                        appointment
                                                                            .visitor
                                                                            ?.fullName ||
                                                                        "Unknown visitor"
                                                                    }

                                                                </p>


                                                                <p className="text-sm text-gray-500">

                                                                    {
                                                                        appointment
                                                                            .visitor
                                                                            ?.email ||
                                                                        ""
                                                                    }

                                                                </p>

                                                            </div>

                                                        </td>


                                                        {/* Purpose */}

                                                        <td className="px-6 py-4 text-gray-700">

                                                            {
                                                                appointment.purpose
                                                            }

                                                        </td>


                                                        {/* Date */}

                                                        <td className="px-6 py-4 text-gray-700">

                                                            {
                                                                appointment.visitDate
                                                            }

                                                        </td>


                                                        {/* Time */}

                                                        <td className="px-6 py-4 text-gray-700">

                                                            {
                                                                appointment.visitTime
                                                            }

                                                        </td>


                                                        {/* Status */}

                                                        <td className="px-6 py-4">

                                                            <span
                                                                className={`
                                                            px-3
                                                            py-1
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

                                                        </td>


                                                        {/* Action */}

                                                        <td className="px-6 py-4">

                                                            <Link
                                                                to={`/employee/appointments/${appointment._id}`}
                                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                                            >

                                                                View

                                                            </Link>

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            )}



        </DashboardLayout>



    );

};


export default EmployeeAllAppointments;