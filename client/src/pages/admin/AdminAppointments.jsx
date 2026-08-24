import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    getAppointments,
    deleteAppointment
} from "../../services/appointmentService";

import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/ui/LoadingSpinner";


const AdminAppointments = () => {

    const [appointments, setAppointments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [deletingId, setDeletingId] =
        useState(null);



    // LOAD APPOINTMENTS


    const loadAppointments = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getAppointments();

            setAppointments(
                response.data || []
            );

        } catch (error) {

            console.error(
                "Failed to load appointments:",
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



    // FILTER


    const filteredAppointments =
        useMemo(() => {

            const searchValue =
                search
                    .trim()
                    .toLowerCase();


            return appointments.filter(
                (appointment) => {

                    const visitorName =
                        appointment.visitor?.fullName
                            ?.toLowerCase() || "";

                    const visitorEmail =
                        appointment.visitor?.email
                            ?.toLowerCase() || "";

                    const hostName =
                        appointment.hostName
                            ?.toLowerCase() || "";

                    const department =
                        appointment.department
                            ?.toLowerCase() || "";

                    const purpose =
                        appointment.purpose
                            ?.toLowerCase() || "";


                    const matchesSearch =
                        !searchValue ||
                        visitorName.includes(searchValue) ||
                        visitorEmail.includes(searchValue) ||
                        hostName.includes(searchValue) ||
                        department.includes(searchValue) ||
                        purpose.includes(searchValue);


                    const matchesStatus =
                        statusFilter === "All" ||
                        appointment.status === statusFilter;


                    return (
                        matchesSearch &&
                        matchesStatus
                    );

                }
            );

        }, [
            appointments,
            search,
            statusFilter
        ]);



    // DELETE


    const handleDelete = async (
        appointment
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to permanently delete this appointment?"
            );


        if (!confirmed) {

            return;

        }


        try {

            setDeletingId(
                appointment._id
            );

            setError("");
            setSuccess("");


            await deleteAppointment(
                appointment._id
            );


            setAppointments(
                previous =>
                    previous.filter(
                        item =>
                            item._id !==
                            appointment._id
                    )
            );


            setSuccess(
                "Appointment deleted successfully."
            );

        } catch (error) {

            console.error(
                "Delete appointment error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Unable to delete appointment."
            );

        } finally {

            setDeletingId(null);

        }

    };



    // STATUS BADGE


    const getStatusClass = (
        status
    ) => {

        if (status === "Approved") {

            return "bg-green-100 text-green-700";

        }

        if (status === "Rejected") {

            return "bg-red-100 text-red-700";

        }

        return "bg-yellow-100 text-yellow-700";

    };


    return (

        <DashboardLayout>

            {loading ? (

                <LoadingSpinner>
                    {/* <div className="max-w-7xl mx-auto">

                        <div className="bg-white rounded-xl shadow p-8 flex items-center justify-center">

                            <p className="text-gray-600">
                                Loading appointments...
                            </p>

                        </div>

                    </div> */}
                </LoadingSpinner>

            ) : (

                <div className="min-h-screen bg-gray-100 p-6">

                    <div className="max-w-7xl mx-auto">


                        {/* HEADER */}

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                            <div>

                                <h1 className="text-3xl font-bold text-gray-800">

                                    Appointment Management

                                </h1>

                                <p className="text-gray-600 mt-1">

                                    Monitor all visitor appointments.

                                </p>

                            </div>


                            <Link
                                to="/admin"
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >

                                ← Admin Dashboard

                            </Link>

                        </div>


                        {/* ALERTS */}

                        {error && (

                            <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-4 mb-5">

                                {error}

                            </div>

                        )}


                        {success && (

                            <div className="bg-green-100 border border-green-300 text-green-700 rounded-lg p-4 mb-5">

                                {success}

                            </div>

                        )}


                        {/* FILTERS */}

                        <div className="bg-white rounded-xl shadow p-5 mb-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search visitor, host, department or purpose..."
                                    className="
                                w-full
                                border
                                border-gray-300
                                rounded-lg
                                px-4
                                py-3
                                focus:outline-none
                                focus:ring-2
                                focus:ring-blue-500
                            "
                                />


                                <select
                                    value={statusFilter}
                                    onChange={(event) =>
                                        setStatusFilter(
                                            event.target.value
                                        )
                                    }
                                    className="
                                w-full
                                border
                                border-gray-300
                                rounded-lg
                                px-4
                                py-3
                                focus:outline-none
                                focus:ring-2
                                focus:ring-blue-500
                            "
                                >

                                    <option value="All">
                                        All Statuses
                                    </option>

                                    <option value="Pending">
                                        Pending
                                    </option>

                                    <option value="Approved">
                                        Approved
                                    </option>

                                    <option value="Rejected">
                                        Rejected
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* TABLE */}

                        <div className="bg-white rounded-xl shadow overflow-hidden">

                            {filteredAppointments.length === 0 ? (

                                <div className="p-10 text-center text-gray-500">

                                    No appointments found.

                                </div>

                            ) : (

                                <div className="overflow-x-auto">

                                    <table className="w-full">

                                        <thead className="bg-gray-50 border-b">

                                            <tr>

                                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">

                                                    Visitor

                                                </th>

                                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">

                                                    Host

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

                                                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">

                                                    Status

                                                </th>

                                                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">

                                                    Actions

                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody className="divide-y">

                                            {filteredAppointments.map(
                                                appointment => (

                                                    <tr
                                                        key={
                                                            appointment._id
                                                        }
                                                        className="hover:bg-gray-50"
                                                    >

                                                        <td className="px-6 py-4">

                                                            <div className="font-medium text-gray-800">

                                                                {
                                                                    appointment
                                                                        .visitor
                                                                        ?.fullName ||
                                                                    "Unknown"
                                                                }

                                                            </div>

                                                            <div className="text-sm text-gray-500">

                                                                {
                                                                    appointment
                                                                        .visitor
                                                                        ?.email ||
                                                                    ""
                                                                }

                                                            </div>

                                                        </td>


                                                        <td className="px-6 py-4">

                                                            <div className="font-medium">

                                                                {
                                                                    appointment.hostName
                                                                }

                                                            </div>

                                                            <div className="text-sm text-gray-500">

                                                                {
                                                                    appointment.department
                                                                }

                                                            </div>

                                                        </td>


                                                        <td className="px-6 py-4 text-gray-700">

                                                            {
                                                                appointment.purpose
                                                            }

                                                        </td>


                                                        <td className="px-6 py-4 text-gray-700">

                                                            {
                                                                appointment.visitDate
                                                            }

                                                        </td>


                                                        <td className="px-6 py-4 text-gray-700">

                                                            {
                                                                appointment.visitTime
                                                            }

                                                        </td>


                                                        <td className="px-6 py-4 text-center">

                                                            <span
                                                                className={`
                                                            inline-block
                                                            px-3
                                                            py-1
                                                            rounded-full
                                                            text-sm
                                                            font-medium
                                                            ${getStatusClass(
                                                                    appointment.status
                                                                )}
                                                        `}
                                                            >

                                                                {
                                                                    appointment.status
                                                                }

                                                            </span>

                                                        </td>


                                                        <td className="px-6 py-4">

                                                            <div className="flex justify-center gap-2">

                                                                <Link
                                                                    to={`/admin/appointments/${appointment._id}`}
                                                                    className="
                                                                bg-blue-100
                                                                text-blue-700
                                                                hover:bg-blue-200
                                                                px-3
                                                                py-2
                                                                rounded-lg
                                                                text-sm
                                                            "
                                                                >

                                                                    View

                                                                </Link>


                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        deletingId ===
                                                                        appointment._id
                                                                    }
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            appointment
                                                                        )
                                                                    }
                                                                    className="
                                                                bg-red-100
                                                                text-red-700
                                                                hover:bg-red-200
                                                                disabled:opacity-50
                                                                px-3
                                                                py-2
                                                                rounded-lg
                                                                text-sm
                                                            "
                                                                >

                                                                    {
                                                                        deletingId ===
                                                                            appointment._id
                                                                            ? "Deleting..."
                                                                            : "Delete"
                                                                    }

                                                                </button>

                                                            </div>

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


export default AdminAppointments;