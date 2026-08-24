import {
    useEffect,
    useState
} from "react";

import { useAuth } from "../../context/AuthContext";

import {
    Link
} from "react-router-dom";

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
    getUsers
} from "../../services/userApi";

import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const AdminDashboard = () => {


    const {
        logout
    } = useAuth()


    // STATE


    const [
        visitors,
        setVisitors
    ] = useState([]);


    const [
        appointments,
        setAppointments
    ] = useState([]);


    const [
        passes,
        setPasses
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");



    // LOAD DASHBOARD DATA


    useEffect(() => {

        const loadDashboardData =
            async () => {

                try {

                    setLoading(true);

                    setError("");




                    const [
                        visitorsResponse,
                        appointmentsResponse,
                        passesResponse
                    ] = await Promise.all([

                        getVisitors(),

                        getAppointments(),

                        getPasses()

                    ]);


                    setVisitors(
                        visitorsResponse.data || []
                    );


                    setAppointments(
                        appointmentsResponse.data || []
                    );


                    setPasses(
                        passesResponse.data || []
                    );


                } catch (error) {

                    console.error(
                        "Admin dashboard error:",
                        error
                    );


                    setError(
                        error.response?.data?.message ||
                        "Unable to load dashboard data."
                    );


                } finally {

                    setLoading(false);

                }

            };


        loadDashboardData();

    }, []);



    // CALCULATED STATISTICS


    const totalVisitors =
        visitors.length;


    const totalAppointments =
        appointments.length;


    const totalPasses =
        passes.length;


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




    return (

        <DashboardLayout>

            {
                loading ? (

                    <LoadingSpinner>
                        {/* <div className="max-w-7xl mx-auto" >

                            <div className="bg-white rounded-xl shadow p-8 flex items-center justify-center">

                                <p className="text-gray-600">
                                    Loading dashboard reports...
                                </p>

                            </div>

                        </div > */}
                    </LoadingSpinner>


                ) : (
                    <div className="min-h-screen bg-gray-100 p-6">

                        <div className="max-w-7xl mx-auto">


                            {/*   
                    HEADER
                   */}

                            <div className="mb-8">

                                <h1 className="text-3xl font-bold text-gray-800">

                                    Admin Dashboard

                                </h1>


                                <p className="text-gray-600 mt-1">

                                    Overview of the visitor management system.

                                </p>

                            </div>
                             


                            {/*   
                    ERROR
                   */}

                            {error && (

                                <div className="bg-red-100 border border-red-300 text-red-700 px-5 py-4 rounded-lg mb-6">

                                    {error}

                                </div>

                            )}


                            {/*   
                    MAIN STATISTICS
                   */}

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">


                                {/* VISITORS */}

                                <div className="bg-white rounded-xl shadow p-6">

                                    <p className="text-gray-500 text-sm">

                                        Total Visitors

                                    </p>


                                    <p className="text-3xl font-bold text-blue-600 mt-2">

                                        {totalVisitors}

                                    </p>

                                </div>


                                {/* APPOINTMENTS */}

                                <div className="bg-white rounded-xl shadow p-6">

                                    <p className="text-gray-500 text-sm">

                                        Total Appointments

                                    </p>


                                    <p className="text-3xl font-bold text-purple-600 mt-2">

                                        {totalAppointments}

                                    </p>

                                </div>


                                {/* PASSES */}

                                <div className="bg-white rounded-xl shadow p-6">

                                    <p className="text-gray-500 text-sm">

                                        Total Passes

                                    </p>


                                    <p className="text-3xl font-bold text-green-600 mt-2">

                                        {totalPasses}

                                    </p>

                                </div>


                                {/* ACTIVE PASSES */}

                                <div className="bg-white rounded-xl shadow p-6">

                                    <p className="text-gray-500 text-sm">

                                        Active Passes

                                    </p>


                                    <p className="text-3xl font-bold text-orange-600 mt-2">

                                        {activePasses}

                                    </p>

                                </div>

                            </div>


                            {/*   
                    APPOINTMENT STATUS
                   */}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">


                                <div className="bg-white rounded-xl shadow p-6">

                                    <p className="text-gray-500">

                                        Pending Appointments

                                    </p>


                                    <p className="text-2xl font-bold text-yellow-600 mt-2">

                                        {pendingAppointments}

                                    </p>

                                </div>


                                <div className="bg-white rounded-xl shadow p-6">

                                    <p className="text-gray-500">

                                        Approved Appointments

                                    </p>


                                    <p className="text-2xl font-bold text-green-600 mt-2">

                                        {approvedAppointments}

                                    </p>

                                </div>


                                <div className="bg-white rounded-xl shadow p-6">

                                    <p className="text-gray-500">

                                        Rejected Appointments

                                    </p>


                                    <p className="text-2xl font-bold text-red-600 mt-2">

                                        {rejectedAppointments}

                                    </p>

                                </div>

                            </div>


                            {/*   
                    PASS STATUS
                   */}

                            <div className="bg-white rounded-xl shadow p-6 mb-8">

                                <h2 className="text-xl font-semibold text-gray-800 mb-5">

                                    Pass Overview

                                </h2>


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                                    <div className="border rounded-lg p-5">

                                        <p className="text-gray-500">

                                            Active Passes

                                        </p>


                                        <p className="text-2xl font-bold text-green-600 mt-2">

                                            {activePasses}

                                        </p>

                                    </div>


                                    <div className="border rounded-lg p-5">

                                        <p className="text-gray-500">

                                            Used Passes

                                        </p>


                                        <p className="text-2xl font-bold text-gray-700 mt-2">

                                            {usedPasses}

                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/*   
                    QUICK ACTIONS
                   */}

                            <div className="bg-white rounded-xl shadow p-6">

                                <h2 className="text-xl font-semibold text-gray-800 mb-5">

                                    Quick Access

                                </h2>


                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">


                                    <Link
                                        to="/admin/visitors"
                                        className="
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                rounded-lg
                                p-4
                                text-center
                                font-medium
                            "
                                    >

                                        Manage Visitors

                                    </Link>


                                    <Link
                                        to="/admin/appointments"
                                        className="
                                bg-purple-600
                                hover:bg-purple-700
                                text-white
                                rounded-lg
                                p-4
                                text-center
                                font-medium
                            "
                                    >

                                        View Appointments

                                    </Link>


                                    <Link
                                        to="/admin/passes"
                                        className="
                                bg-green-600
                                hover:bg-green-700
                                text-white
                                rounded-lg
                                p-4
                                text-center
                                font-medium
                            "
                                    >

                                        View Passes

                                    </Link>


                                    <Link
                                        to="/admin/users"
                                        className="
                                bg-gray-700
                                hover:bg-gray-800
                                text-white
                                rounded-lg
                                p-4
                                text-center
                                font-medium
                            "
                                    >

                                        Manage Users

                                    </Link>

                                    <Link
                                        to="/admin/reports"
                                        className="bg-pink-700 text-white px-4 py-3 rounded-lg hover:bg-pink-800"
                                    >
                                        Reports & Monitoring
                                    </Link>

                                </div>

                            </div>

                        </div>

                    </div>
                )
            }


        </DashboardLayout>





    );

};


export default AdminDashboard;