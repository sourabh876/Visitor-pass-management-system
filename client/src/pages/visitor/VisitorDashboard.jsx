import {
    Link
} from "react-router-dom";

import {
    useAuth
} from "../../context/AuthContext";


import DashboardLayout from "../../components/layout/DashboardLayout";
import { useState } from "react";


const Dashboard = () => {

    const {
        user,
        logout
    } = useAuth();

    const [loading, setLoading] = useState(true)

    return (

        
        <DashboardLayout>

            <div className="min-h-screen bg-gray-100">

                <main className="max-w-7xl mx-auto px-6 py-8">


                    <div className="mb-8">

                        <h2 className="text-2xl font-bold text-gray-800">

                            Welcome, {user?.name}

                        </h2>

                        <p className="text-gray-600 mt-1">

                            Manage your visitor profile, appointments and passes.

                        </p>

                    </div>


                    {/*   
                    QUICK ACTIONS
                   */}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">


                        {/* PROFILE */}

                        <Link
                            to="/visitor/profile"
                            className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
                        >

                            <h3 className="text-xl font-semibold text-gray-800">

                                My Profile

                            </h3>

                            <p className="text-gray-500 mt-2">

                                View and update your visitor information.

                            </p>

                            <span className="inline-block mt-5 text-blue-600 font-medium">

                                Manage Profile →

                            </span>

                        </Link>


                        {/* APPOINTMENTS */}

                        <Link
                            to="/visitor/appointments"
                            className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
                        >

                            <h3 className="text-xl font-semibold text-gray-800">

                                My Appointments

                            </h3>

                            <p className="text-gray-500 mt-2">

                                Book and track your appointments.

                            </p>

                            <span className="inline-block mt-5 text-blue-600 font-medium">

                                View Appointments →

                            </span>

                        </Link>


                        {/* PASSES */}

                        <Link
                            to="/visitor/my-passes"
                            className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
                        >

                            <h3 className="text-xl font-semibold text-gray-800">

                                My Passes

                            </h3>

                            <p className="text-gray-500 mt-2">

                                View your approved visitor passes.

                            </p>

                            <span className="inline-block mt-5 text-blue-600 font-medium">

                                View Passes →

                            </span>

                        </Link>

                    </div>

                </main>

            </div>

        </DashboardLayout>

    );

};


export default Dashboard;