import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    getPasses
} from "../../services/passService";

import {
    useAuth
} from "../../context/AuthContext";


import DashboardLayout from "../../components/layout/DashboardLayout"
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const EmployeePasses = () => {

    const {
        user
    } = useAuth();


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



    // LOAD PASSES


    useEffect(() => {

        const loadPasses = async () => {

            try {

                setLoading(true);

                setError("");


                const response =
                    await getPasses();


                const allPasses =
                    response.data || [];


                console.log(
                    "All passes:",
                    allPasses
                );


                // =====================================
                // ONLY PASSES BELONGING TO THIS EMPLOYEE
                // =====================================

                const employeePasses =
                    allPasses.filter(
                        (pass) => {

                            const employeeId =
                                pass.appointment
                                    ?.host?._id ||
                                pass.appointment
                                    ?.host;


                            return (
                                employeeId?.toString() ===
                                user?._id?.toString()
                            );

                        }
                    );


                console.log(
                    "Employee passes:",
                    employeePasses
                );


                setPasses(
                    employeePasses
                );


            } catch (error) {

                console.error(
                    "Failed to load passes:",
                    error
                );


                setError(
                    error.response?.data?.message ||
                    "Failed to load passes."
                );

            } finally {

                setLoading(false);

            }

        };


        if (user) {

            loadPasses();

        }

    }, [user]);


    // PAGE

    return (
        <DashboardLayout>


            {loading ? (

                <LoadingSpinner>
                     
                </LoadingSpinner>

            ) : (

                <div className="min-h-screen bg-gray-100 p-6">

                    <div className="max-w-7xl mx-auto">


                        {/* HEADER */}

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                            <div>

                                <h1 className="text-3xl font-bold text-gray-800">

                                    My Visitor Passes

                                </h1>

                                <p className="text-gray-600 mt-1">

                                    Passes generated for your appointments

                                </p>

                            </div>


                            <Link
                                to="/employee"
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >

                                ← Back to Dashboard

                            </Link>

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">

                                {error}

                            </div>

                        )}


                        {/* EMPTY */}

                        {passes.length === 0 ? (

                            <div className="bg-white rounded-xl shadow p-10 text-center">

                                <h2 className="text-xl font-semibold text-gray-800">

                                    No passes found

                                </h2>

                                <p className="text-gray-500 mt-2">

                                    You have not generated any visitor passes yet.

                                </p>

                            </div>

                        ) : (

                            /* PASS LIST */

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                                {passes.map(
                                    (pass) => {

                                        const appointment =
                                            pass.appointment;


                                        const visitor =
                                            appointment?.visitor;


                                        return (

                                            <div
                                                key={pass._id}
                                                className="bg-white rounded-xl shadow p-6"
                                            >

                                                {/* PASS NUMBER */}

                                                <div className="flex items-center justify-between mb-5">

                                                    <h2 className="text-lg font-bold text-gray-800">

                                                        Visitor Pass

                                                    </h2>


                                                    <span
                                                        className={`
                                                    px-3
                                                    py-1
                                                    rounded-full
                                                    text-xs
                                                    font-semibold
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


                                                {/* PASS NUMBER */}

                                                <div className="mb-4">

                                                    <p className="text-sm text-gray-500">

                                                        Pass Number

                                                    </p>

                                                    <p className="font-semibold text-gray-800">

                                                        {
                                                            pass.passNumber
                                                        }

                                                    </p>

                                                </div>


                                                {/* VISITOR */}

                                                <div className="mb-4">

                                                    <p className="text-sm text-gray-500">

                                                        Visitor

                                                    </p>

                                                    <p className="font-semibold text-gray-800">

                                                        {
                                                            visitor?.fullName ||
                                                            "N/A"
                                                        }

                                                    </p>

                                                    <p className="text-sm text-gray-500">

                                                        {
                                                            visitor?.email ||
                                                            ""
                                                        }

                                                    </p>

                                                </div>


                                                {/* APPOINTMENT */}

                                                <div className="mb-5">

                                                    <p className="text-sm text-gray-500">

                                                        Visit

                                                    </p>

                                                    <p className="text-gray-800">

                                                        {
                                                            appointment?.visitDate
                                                                ? new Date(
                                                                    appointment.visitDate
                                                                ).toLocaleDateString()
                                                                : "N/A"
                                                        }

                                                        {" • "}

                                                        {
                                                            appointment?.visitTime ||
                                                            "N/A"
                                                        }

                                                    </p>

                                                </div>


                                                {/* ACTION */}

                                                <Link
                                                    to={`/employee/passes/${pass._id}`}
                                                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium"
                                                >

                                                    View Pass

                                                </Link>

                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        )}

                    </div>

                </div>

            )}



        </DashboardLayout>


    );

};


export default EmployeePasses;