import {
    useEffect,
    useState
} from "react";

import {
    getUsers
} from "../../services/userApi";

import {
    getVisitors
} from "../../services/visitorApi";

import {
    getAppointments
} from "../../services/appointmentService";

import {
    getPasses
} from "../../services/passService";

import {
    getCheckLogs,
    getVisitorsInside
} from "../../services/checkLogService";

import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/ui/LoadingSpinner";



const AdminReports = () => {


    // STATE


    const [users, setUsers] = useState([]);

    const [visitors, setVisitors] = useState([]);

    const [appointments, setAppointments] = useState([]);

    const [passes, setPasses] = useState([]);

    const [checkLogs, setCheckLogs] = useState([]);

    const [visitorsInside, setVisitorsInside] = useState([]);


    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");



    // LOAD REPORT DATA


    const loadReports = async () => {

        try {

            setLoading(true);

            setError("");


            const [
                usersResponse,
                visitorsResponse,
                appointmentsResponse,
                passesResponse,
                checkLogsResponse,
                insideResponse
            ] = await Promise.all([

                getUsers(),

                getVisitors(),

                getAppointments(),

                getPasses(),

                getCheckLogs(),

                getVisitorsInside()

            ]);


            setUsers(
                usersResponse?.data || []
            );


            setVisitors(
                visitorsResponse?.data || []
            );


            setAppointments(
                appointmentsResponse?.data || []
            );


            setPasses(
                passesResponse?.data || []
            );


            setCheckLogs(
                checkLogsResponse?.data || []
            );


            setVisitorsInside(
                insideResponse?.data || []
            );

        } catch (error) {

            console.error(
                "Admin reports error:",
                error
            );


            setError(
                error?.response?.data?.message ||
                "Failed to load admin reports."
            );

        } finally {

            setLoading(false);

        }

    };



    // INITIAL LOAD


    useEffect(() => {

        loadReports();

    }, []);



    // USER STATISTICS


    const totalUsers =
        users.length;


    const totalEmployees =
        users.filter(
            (user) =>
                user.role === "employee"
        ).length;


    const totalSecurity =
        users.filter(
            (user) =>
                user.role === "security"
        ).length;


    const totalVisitorsUsers =
        users.filter(
            (user) =>
                user.role === "visitor"
        ).length;


    const totalAdmins =
        users.filter(
            (user) =>
                user.role === "admin"
        ).length;



    // VISITOR STATISTICS


    const totalVisitors =
        visitors.length;


    const activeVisitors =
        visitors.filter(
            (visitor) =>
                visitor.isDeleted === false
        ).length;



    // APPOINTMENT STATISTICS


    const totalAppointments =
        appointments.length;


    const pendingAppointments =
        appointments.filter(
            (appointment) =>
                appointment.status === "Pending"
        ).length;


    const approvedAppointments =
        appointments.filter(
            (appointment) =>
                appointment.status === "Approved"
        ).length;


    const rejectedAppointments =
        appointments.filter(
            (appointment) =>
                appointment.status === "Rejected"
        ).length;



    // PASS STATISTICS


    const totalPasses =
        passes.length;


    const activePasses =
        passes.filter(
            (pass) =>
                pass.status === "Active"
        ).length;


    const usedPasses =
        passes.filter(
            (pass) =>
                pass.status === "Used"
        ).length;


    const cancelledPasses =
        passes.filter(
            (pass) =>
                pass.status === "Cancelled"
        ).length;


    const expiredPasses =
        passes.filter(
            (pass) =>
                pass.status === "Expired"
        ).length;



    // CHECK-IN / CHECK-OUT STATISTICS


    const totalCheckLogs =
        checkLogs.length;


    const totalCheckIns =
        checkLogs.filter(
            (log) =>
                log.checkInTime
        ).length;


    const totalCheckOuts =
        checkLogs.filter(
            (log) =>
                log.checkOutTime
        ).length;


    const currentlyInside =
        visitorsInside.length;



    // FORMAT DATE


    const formatDateTime = (date) => {

        if (!date) {
            return "-";
        }


        return new Date(date).toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );

    };



    // VISITOR NAME


    const getVisitorName = (log) => {

        if (
            log?.visitor?.fullName
        ) {

            return log.visitor.fullName;

        }


        if (
            log?.visitor?.name
        ) {

            return log.visitor.name;

        }


        return "Unknown visitor";

    };



    // PASS NUMBER


    const getPassNumber = (log) => {

        if (
            log?.pass?.passNumber
        ) {

            return log.pass.passNumber;

        }


        return "-";

    };


    return (

        <DashboardLayout>
            {loading ? (

                <LoadingSpinner>
                    {/* <div className="max-w-7xl mx-auto">

                    <div className="bg-white rounded-xl shadow p-8 flex items-center justify-center">

                        <p className="text-gray-600">
                            Loading reports...
                        </p>

                    </div>

                </div> */}
                </LoadingSpinner>

            ) : (
                <div className="min-h-screen bg-gray-100 p-6">

                    {/* 
                HEADER
             */}

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                        <div>

                            <h1 className="text-3xl font-bold text-gray-800">

                                Admin Reports & Monitoring

                            </h1>


                            <p className="text-gray-500 mt-1">

                                Monitor users, visitors, appointments,
                                passes and visitor activity.

                            </p>

                        </div>


                        <button
                            onClick={loadReports}
                            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >

                            Refresh Reports

                        </button>

                    </div>


                    {/* 
                ERROR
             */}

                    {error && (

                        <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">

                            {error}

                        </div>

                    )}


                    {/* 
                MAIN STATISTICS
             */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">


                        {/* USERS */}

                        <div className="bg-white rounded-xl shadow p-5">

                            <p className="text-sm text-gray-500">

                                Total Users

                            </p>


                            <h2 className="text-3xl font-bold text-gray-800 mt-2">

                                {totalUsers}

                            </h2>


                            <p className="text-sm text-gray-500 mt-2">

                                {totalEmployees} Employees ·{" "}

                                {totalSecurity} Security

                            </p>

                        </div>


                        {/* VISITORS */}

                        <div className="bg-white rounded-xl shadow p-5">

                            <p className="text-sm text-gray-500">

                                Total Visitors

                            </p>


                            <h2 className="text-3xl font-bold text-gray-800 mt-2">

                                {totalVisitors}

                            </h2>


                            <p className="text-sm text-gray-500 mt-2">

                                {activeVisitors} active profiles

                            </p>

                        </div>


                        {/* APPOINTMENTS */}

                        <div className="bg-white rounded-xl shadow p-5">

                            <p className="text-sm text-gray-500">

                                Appointments

                            </p>


                            <h2 className="text-3xl font-bold text-gray-800 mt-2">

                                {totalAppointments}

                            </h2>


                            <p className="text-sm text-gray-500 mt-2">

                                {pendingAppointments} pending

                            </p>

                        </div>


                        {/* PASSES */}

                        <div className="bg-white rounded-xl shadow p-5">

                            <p className="text-sm text-gray-500">

                                Total Passes

                            </p>


                            <h2 className="text-3xl font-bold text-gray-800 mt-2">

                                {totalPasses}

                            </h2>


                            <p className="text-sm text-gray-500 mt-2">

                                {activePasses} active

                            </p>

                        </div>

                    </div>


                    {/* 
                USER BREAKDOWN
             */}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">


                        <div className="bg-white rounded-xl shadow p-6">

                            <h2 className="text-xl font-semibold text-gray-800 mb-5">

                                User Breakdown

                            </h2>


                            <div className="space-y-4">


                                <div className="flex justify-between border-b pb-3">

                                    <span className="text-gray-600">

                                        Admins

                                    </span>

                                    <span className="font-semibold">

                                        {totalAdmins}

                                    </span>

                                </div>


                                <div className="flex justify-between border-b pb-3">

                                    <span className="text-gray-600">

                                        Employees

                                    </span>

                                    <span className="font-semibold">

                                        {totalEmployees}

                                    </span>

                                </div>


                                <div className="flex justify-between border-b pb-3">

                                    <span className="text-gray-600">

                                        Security

                                    </span>

                                    <span className="font-semibold">

                                        {totalSecurity}

                                    </span>

                                </div>


                                <div className="flex justify-between">

                                    <span className="text-gray-600">

                                        Visitor Accounts

                                    </span>

                                    <span className="font-semibold">

                                        {totalVisitorsUsers}

                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* APPOINTMENT BREAKDOWN */}

                        <div className="bg-white rounded-xl shadow p-6">

                            <h2 className="text-xl font-semibold text-gray-800 mb-5">

                                Appointment Breakdown

                            </h2>


                            <div className="space-y-4">


                                <div className="flex justify-between border-b pb-3">

                                    <span className="text-gray-600">

                                        Pending

                                    </span>

                                    <span className="font-semibold text-yellow-600">

                                        {pendingAppointments}

                                    </span>

                                </div>


                                <div className="flex justify-between border-b pb-3">

                                    <span className="text-gray-600">

                                        Approved

                                    </span>

                                    <span className="font-semibold text-green-600">

                                        {approvedAppointments}

                                    </span>

                                </div>


                                <div className="flex justify-between">

                                    <span className="text-gray-600">

                                        Rejected

                                    </span>

                                    <span className="font-semibold text-red-600">

                                        {rejectedAppointments}

                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* 
                PASS + CHECKLOG STATISTICS
             */}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">


                        {/* PASS BREAKDOWN */}

                        <div className="bg-white rounded-xl shadow p-6">

                            <h2 className="text-xl font-semibold text-gray-800 mb-5">

                                Pass Usage

                            </h2>


                            <div className="space-y-4">


                                <div className="flex justify-between border-b pb-3">

                                    <span>

                                        Active

                                    </span>

                                    <span className="font-semibold text-green-600">

                                        {activePasses}

                                    </span>

                                </div>


                                <div className="flex justify-between border-b pb-3">

                                    <span>

                                        Used

                                    </span>

                                    <span className="font-semibold text-blue-600">

                                        {usedPasses}

                                    </span>

                                </div>


                                <div className="flex justify-between border-b pb-3">

                                    <span>

                                        Cancelled

                                    </span>

                                    <span className="font-semibold text-red-600">

                                        {cancelledPasses}

                                    </span>

                                </div>


                                <div className="flex justify-between">

                                    <span>

                                        Expired

                                    </span>

                                    <span className="font-semibold text-gray-600">

                                        {expiredPasses}

                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* CHECKLOG */}

                        <div className="bg-white rounded-xl shadow p-6">

                            <h2 className="text-xl font-semibold text-gray-800 mb-5">

                                Visitor Movement

                            </h2>


                            <div className="space-y-4">


                                <div className="flex justify-between border-b pb-3">

                                    <span>

                                        Total Check Logs

                                    </span>

                                    <span className="font-semibold">

                                        {totalCheckLogs}

                                    </span>

                                </div>


                                <div className="flex justify-between border-b pb-3">

                                    <span>

                                        Total Check-Ins

                                    </span>

                                    <span className="font-semibold text-green-600">

                                        {totalCheckIns}

                                    </span>

                                </div>


                                <div className="flex justify-between border-b pb-3">

                                    <span>

                                        Total Check-Outs

                                    </span>

                                    <span className="font-semibold text-blue-600">

                                        {totalCheckOuts}

                                    </span>

                                </div>


                                <div className="flex justify-between">

                                    <span>

                                        Currently Inside

                                    </span>

                                    <span className="font-semibold text-orange-600">

                                        {currentlyInside}

                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* 
                CURRENT VISITORS INSIDE
             */}

                    <div className="bg-white rounded-xl shadow mb-8">

                        <div className="p-6 border-b">

                            <div className="flex items-center justify-between">

                                <div>

                                    <h2 className="text-xl font-semibold text-gray-800">

                                        Visitors Currently Inside

                                    </h2>

                                    <p className="text-sm text-gray-500 mt-1">

                                        Visitors who have checked in but
                                        have not checked out.

                                    </p>

                                </div>


                                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">

                                    {currentlyInside} Inside

                                </span>

                            </div>

                        </div>


                        {visitorsInside.length === 0 ? (

                            <div className="p-8 text-center text-gray-500">

                                No visitors are currently inside.

                            </div>

                        ) : (

                            <div className="overflow-x-auto">

                                <table className="w-full">

                                    <thead className="bg-gray-50">

                                        <tr>

                                            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">

                                                Visitor

                                            </th>

                                            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">

                                                Pass

                                            </th>

                                            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">

                                                Check-In

                                            </th>

                                            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">

                                                Status

                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {visitorsInside.map(
                                            (log) => (

                                                <tr
                                                    key={log._id}
                                                    className="border-t hover:bg-gray-50"
                                                >

                                                    <td className="px-6 py-4">

                                                        <p className="font-medium text-gray-800">

                                                            {getVisitorName(log)}

                                                        </p>


                                                        {log.visitor?.email && (

                                                            <p className="text-sm text-gray-500">

                                                                {log.visitor.email}

                                                            </p>

                                                        )}

                                                    </td>


                                                    <td className="px-6 py-4 text-sm">

                                                        {getPassNumber(log)}

                                                    </td>


                                                    <td className="px-6 py-4 text-sm">

                                                        {formatDateTime(
                                                            log.checkInTime
                                                        )}

                                                    </td>


                                                    <td className="px-6 py-4">

                                                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">

                                                            Inside

                                                        </span>

                                                    </td>

                                                </tr>

                                            )

                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>


                    {/* 
                RECENT ACTIVITY
             */}

                    <div className="bg-white rounded-xl shadow">

                        <div className="p-6 border-b">

                            <h2 className="text-xl font-semibold text-gray-800">

                                Visitor Activity History

                            </h2>


                            <p className="text-sm text-gray-500 mt-1">

                                Recent check-in and check-out activity.

                            </p>

                        </div>


                        {checkLogs.length === 0 ? (

                            <div className="p-8 text-center text-gray-500">

                                No visitor activity found.

                            </div>

                        ) : (

                            <div className="overflow-x-auto">

                                <table className="w-full">

                                    <thead className="bg-gray-50">

                                        <tr>

                                            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">

                                                Visitor

                                            </th>

                                            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">

                                                Pass Number

                                            </th>

                                            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">

                                                Check-In

                                            </th>

                                            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">

                                                Check-Out

                                            </th>

                                            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">

                                                Status

                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {checkLogs.map(
                                            (log) => (

                                                <tr
                                                    key={log._id}
                                                    className="border-t hover:bg-gray-50"
                                                >

                                                    <td className="px-6 py-4">

                                                        <p className="font-medium text-gray-800">

                                                            {getVisitorName(log)}

                                                        </p>


                                                        {log.visitor?.phone && (

                                                            <p className="text-sm text-gray-500">

                                                                {log.visitor.phone}

                                                            </p>

                                                        )}

                                                    </td>


                                                    <td className="px-6 py-4 text-sm">

                                                        {getPassNumber(log)}

                                                    </td>


                                                    <td className="px-6 py-4 text-sm">

                                                        {formatDateTime(
                                                            log.checkInTime
                                                        )}

                                                    </td>


                                                    <td className="px-6 py-4 text-sm">

                                                        {formatDateTime(
                                                            log.checkOutTime
                                                        )}

                                                    </td>


                                                    <td className="px-6 py-4">

                                                        {log.status === "Inside" ? (

                                                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">

                                                                Inside

                                                            </span>

                                                        ) : (

                                                            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">

                                                                Checked-Out

                                                            </span>

                                                        )}

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
            )}
        </DashboardLayout>



    );

};


export default AdminReports;