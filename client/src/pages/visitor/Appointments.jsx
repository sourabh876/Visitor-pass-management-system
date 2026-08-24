import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    VisitorAppointments
} from "../../services/appointmentService";

import {
    getMyVisitorProfile
} from "../../services/visitorApi";

import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/ui/LoadingSpinner";


const Appointments = () => {

    const [appointments, setAppointments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    //   ============
    // LOAD APPOINTMENTS
    //   ============

    const loadAppointments = async () => {

        try {

            setLoading(true);

            setError("");


            const [
                appointmentResponse,
                profileResponse
            ] = await Promise.all([

                VisitorAppointments(),

                getMyVisitorProfile()

            ]);


            const allAppointments =
                appointmentResponse?.data || [];

            const visitor =
                profileResponse?.data;


            if (!visitor?._id) {

                setAppointments([]);

                return;

            }


            const myAppointments =
                allAppointments.filter(
                    appointment => {

                        const visitorId =
                            appointment.visitor?._id ||
                            appointment.visitor;

                        return (
                            visitorId ===
                            visitor._id
                        );

                    }
                );


            setAppointments(
                myAppointments
            );

        } catch (error) {

            console.error(
                "Appointments loading error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load appointments."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadAppointments();

    }, []);


    //   ============
    // STATUS STYLE
    //   ============

    const getStatusClass = (
        status
    ) => {

        switch (status) {

            case "Approved":

                return "bg-green-100 text-green-700";


            case "Rejected":

                return "bg-red-100 text-red-700";


            default:

                return "bg-yellow-100 text-yellow-700";

        }

    };




    return (

        <DashboardLayout>

            {loading ? (

                <LoadingSpinner>

                </LoadingSpinner>

            ) : (

                <div className="min-h-screen bg-gray-100 py-8 px-4">

                    <div className="max-w-6xl mx-auto">


                        {/*   
                    HEADER
                   */}

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                            <div>

                                <h1 className="text-3xl font-bold text-gray-800">

                                    My Appointments

                                </h1>

                                <p className="text-gray-500 mt-1">

                                    View and track your visitor appointments.

                                </p>

                            </div>


                            <Link
                                to="/visitor/appointments/book"
                                className="bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-700"
                            >

                                + Book Appointment

                            </Link>

                        </div>


                        {/*   
                    ERROR
                   */}

                        {error && (

                            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-6">

                                {error}

                            </div>

                        )}


                        {/*   
                    EMPTY
                   */}

                        {appointments.length === 0 ? (

                            <div className="bg-white rounded-xl shadow p-10 text-center">

                                <h2 className="text-xl font-semibold text-gray-800">

                                    No appointments found

                                </h2>

                                <p className="text-gray-500 mt-2">

                                    You haven't booked any appointments yet.

                                </p>

                                <Link
                                    to="/visitor/appointments/book"
                                    className="inline-block mt-5 bg-blue-600 text-white px-5 py-3 rounded-lg"
                                >

                                    Book Your First Appointment

                                </Link>

                            </div>

                        ) : (

                            <div className="bg-white rounded-xl shadow overflow-hidden">

                                <div className="overflow-x-auto">

                                    <table className="w-full">

                                        <thead className="bg-gray-50">

                                            <tr>

                                                <th className="text-left px-6 py-4">

                                                    Host

                                                </th>

                                                <th className="text-left px-6 py-4">

                                                    Department

                                                </th>

                                                <th className="text-left px-6 py-4">

                                                    Date

                                                </th>

                                                <th className="text-left px-6 py-4">

                                                    Time

                                                </th>

                                                <th className="text-left px-6 py-4">

                                                    Status

                                                </th>

                                                <th className="text-left px-6 py-4">

                                                    Action

                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {appointments.map(
                                                appointment => (

                                                    <tr
                                                        key={
                                                            appointment._id
                                                        }
                                                        className="border-t"
                                                    >

                                                        <td className="px-6 py-4 font-medium">

                                                            {
                                                                appointment.hostName
                                                            }

                                                        </td>


                                                        <td className="px-6 py-4">

                                                            {
                                                                appointment.department
                                                            }

                                                        </td>


                                                        <td className="px-6 py-4">

                                                            {
                                                                appointment.visitDate
                                                            }

                                                        </td>


                                                        <td className="px-6 py-4">

                                                            {
                                                                appointment.visitTime
                                                            }

                                                        </td>


                                                        <td className="px-6 py-4">

                                                            <span
                                                                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                                                                    appointment.status
                                                                )}`}
                                                            >

                                                                {
                                                                    appointment.status
                                                                }

                                                            </span>

                                                        </td>


                                                        <td className="px-6 py-4">

                                                            <Link
                                                                to={`/visitor/appointments/${appointment._id}`}
                                                                className="text-blue-600 font-medium hover:underline"
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

                            </div>

                        )}

                    </div>

                </div>

            )}


        </DashboardLayout>



    );

};


export default Appointments;