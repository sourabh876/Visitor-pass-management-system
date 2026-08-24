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

const Dashboard = () => {

    const {
        user,
        logout
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



    // COUNTS


    const pendingCount =
        appointments.filter(
            appointment =>
                appointment.status === "Pending"
        ).length;


    const approvedCount =
        appointments.filter(
            appointment =>
                appointment.status === "Approved"
        ).length;


    const rejectedCount =
        appointments.filter(
            appointment =>
                appointment.status === "Rejected"
        ).length;

    const recentAppointments =
        [...appointments]
            .sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            )
            .slice(0, 5);


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

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                            <div>

                                <h1 className="text-3xl font-bold text-gray-800">

                                    Employee Dashboard

                                </h1>


                                <p className="text-gray-600 mt-1">

                                    Welcome, {user?.name}

                                </p>

                            </div>

                            <div className="flex items-center gap-4">

                                <Link
                                    to="/employee/passes"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium"
                                >
                                    My Passes
                                </Link>

                            </div>



                        </div>


                        {/*     
                    ERROR
                     */}

                        {error && (

                            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">

                                {error}

                            </div>

                        )}


                        {/*     
                    STATISTICS
                     */}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                            {/* Pending */}

                            <div className="bg-white rounded-xl shadow p-6">

                                <p className="text-gray-500 text-sm">
                                    Pending
                                </p>

                                <h2 className="text-3xl font-bold text-yellow-600 mt-2">
                                    {pendingCount}
                                </h2>

                            </div>


                            {/* Approved */}

                            <div className="bg-white rounded-xl shadow p-6">

                                <p className="text-gray-500 text-sm">
                                    Approved
                                </p>

                                <h2 className="text-3xl font-bold text-green-600 mt-2">
                                    {approvedCount}
                                </h2>

                            </div>


                            {/* Rejected */}

                            <div className="bg-white rounded-xl shadow p-6">

                                <p className="text-gray-500 text-sm">
                                    Rejected
                                </p>

                                <h2 className="text-3xl font-bold text-red-600 mt-2">
                                    {rejectedCount}
                                </h2>

                            </div>

                        </div>


                        {/*     
                    APPOINTMENTS
                     */}

                        <div className="bg-white rounded-xl shadow">

                            <div className="px-6 py-5 border-b flex items-center justify-between">

                                <h2 className="text-xl font-semibold text-gray-800">
                                    Recent Appointment Requests
                                </h2>

                                <Link
                                    to="/employee/appointments"
                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                >
                                    View All
                                </Link>

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

                                            {recentAppointments.map(
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


export default Dashboard;