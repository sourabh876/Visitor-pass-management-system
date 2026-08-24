import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";



import {
    AuthProvider
} from "./context/AuthContext";


import ProtectedRoute
    from "./components/ProtectedRoute";



// AUTH

import Register
    from "./pages/Register";

import Login from "./pages/Login";


//Admin

import AdminDashboard
    from "./pages/admin/AdminDashboard";

import AdminVisitors
    from "./pages/admin/AdminVisitors";

import AdminVisitorDetails
    from "./pages/admin/AdminVisitorDetails";

import AdminAppointments
    from "./pages/admin/AdminAppointments";

import AdminAppointmentDetails
    from "./pages/admin/AdminAppointmentDetails";

import AdminPasses
    from "./pages/admin/AdminPasses";

import AdminUsers
    from "./pages/admin/AdminUsers";

import AdminReports
    from "./pages/admin/AdminReports";

import Reports
    from "./pages/admin/Reports";



// EMPLOYEE


import EmployeeDashboard
    from "./pages/employee/EmployeeDashboard";

import EmployeeAppointmentDetails
    from "./pages/employee/AppointmentDetails";

import EmployeePasses
    from "./pages/employee/EmployeePasses";

import EmployeePassDetails
    from "./pages/employee/PassDetails";

import EmployeeAppointments from "./pages/employee/EmployeeAppointments";


// VISITOR

import VisitorDashboard
    from "./pages/visitor/VisitorDashboard";

import VisitorProfile
    from "./pages/visitor/Profile";

import VisitorAppointments
    from "./pages/visitor/Appointments";

import BookAppointment
    from "./pages/visitor/BookAppointment";

import VisitorAppointmentDetails
    from "./pages/visitor/AppointmentDetails";


import MyPass
    from "./pages/visitor/MyPass";

import PassDetails
    from "./pages/visitor/PassDetails";





// SECURITY


import SecurityDashboard
    from "./pages/security/SecurityDashboard";

import ScanPass
    from "./pages/security/ScanPass";

import CurrentVisitors
    from "./pages/security/CurrentVisitors";

import CheckLogs from "./pages/security/CheckLogs";


// UNAUTHORIZED PAGE


const Unauthorized = () => {

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="text-center">

                <h1 className="text-4xl font-bold text-red-600">

                    403

                </h1>


                <p className="text-gray-600 mt-2">

                    You are not authorized to access this page.

                </p>

            </div>

        </div>

    );

};



// APP


function App() {

    return (

        <BrowserRouter>

            <AuthProvider>

                <Routes>


                    {/*   
                        PUBLIC
                       */}

                    <Route
                        path="/register"
                        element={
                            <Register />
                        }
                    />

                    <Route
                        path="/"
                        element={
                            <Login />
                        }
                    />

                    {/*   
                        Admin
                       */}

                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute
                                allowedRoles={["admin"]}
                            >
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/visitors"
                        element={
                            <ProtectedRoute
                                allowedRoles={["admin"]}
                            >
                                <AdminVisitors />
                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/admin/visitors/:id"
                        element={
                            <ProtectedRoute
                                allowedRoles={["admin"]}
                            >
                                <AdminVisitorDetails />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/appointments"
                        element={
                            <ProtectedRoute
                                allowedRoles={["admin"]}
                            >
                                <AdminAppointments />
                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/admin/appointments/:id"
                        element={
                            <ProtectedRoute
                                allowedRoles={["admin"]}
                            >
                                <AdminAppointmentDetails />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/passes"
                        element={
                            <ProtectedRoute
                                allowedRoles={["admin"]}
                            >
                                <AdminPasses />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/users"
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <AdminUsers />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/reports"
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <AdminReports />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/reports-export"
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "admin"
                                ]}
                            >
                                <Reports />
                            </ProtectedRoute>
                        }
                    />


                    {/*   
                        SECURITY
                       */}

                    <Route
                        path="/admin/"
                        element={
                            <ProtectedRoute
                                allowedRoles={["admin"]}
                            >
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />




                    {/*   
                        SECURITY
                       */}

                    <Route
                        path="/security"
                        element={

                            <ProtectedRoute
                                allowedRoles={[
                                    "security"
                                ]}
                            >

                                <SecurityDashboard />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/security/scan"
                        element={

                            <ProtectedRoute
                                allowedRoles={[
                                    "security"
                                ]}
                            >

                                <ScanPass />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/security/current-visitors"
                        element={

                            <ProtectedRoute
                                allowedRoles={[
                                    "security"
                                ]}
                            >

                                <CurrentVisitors />

                            </ProtectedRoute>

                        }
                    />

                    <Route
                        path="/security/check-logs"
                        element={

                            <ProtectedRoute
                                allowedRoles={[
                                    "security"
                                ]}
                            >

                                <CheckLogs />

                            </ProtectedRoute>

                        }
                    />


                    {/*   
                        EMPLOYEE
                       */}

                    <Route
                        path="/employee"
                        element={

                            <ProtectedRoute
                                allowedRoles={[
                                    "employee"
                                ]}
                            >

                                <EmployeeDashboard />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/employee/appointments/:id"
                        element={

                            <ProtectedRoute
                                allowedRoles={[
                                    "employee"
                                ]}
                            >

                                <EmployeeAppointmentDetails />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/employee/passes"
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "employee"
                                ]}
                            >
                                <EmployeePasses />
                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/employee/passes/:id"
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "employee"
                                ]}
                            >
                                <EmployeePassDetails />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/employee/appointments/"
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "employee"
                                ]}
                            >
                                <EmployeeAppointments />
                            </ProtectedRoute>
                        }
                    />




                    {/*   
                         VISITOR
                        */}

                    <Route
                        path="/visitor"
                        element={
                            <ProtectedRoute
                                allowedRoles={["visitor"]}
                            >
                                <VisitorDashboard />
                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/visitor/profile"
                        element={
                            <ProtectedRoute
                                allowedRoles={["visitor"]}
                            >
                                <VisitorProfile />
                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/visitor/appointments"
                        element={
                            <ProtectedRoute
                                allowedRoles={["visitor"]}
                            >
                                <VisitorAppointments />
                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/visitor/appointments/book"
                        element={
                            <ProtectedRoute
                                allowedRoles={["visitor"]}
                            >
                                <BookAppointment />
                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/visitor/appointments/:id"
                        element={
                            <ProtectedRoute
                                allowedRoles={["visitor"]}
                            >
                                <VisitorAppointmentDetails />
                            </ProtectedRoute>
                        }
                    />




                    <Route
                        path="/visitor/my-passes"
                        element={
                            <ProtectedRoute
                                allowedRoles={["visitor"]}
                            >
                                <MyPass />
                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/visitor/pass/:id"
                        element={
                            <ProtectedRoute
                                allowedRoles={["visitor"]}
                            >
                                <PassDetails />
                            </ProtectedRoute>
                        }
                    />


                    {/*   
                        UNAUTHORIZED
                       */}

                    <Route
                        path="/unauthorized"
                        element={
                            <Unauthorized />
                        }
                    />


                    {/*   
                        DEFAULT
                       */}

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/"
                                replace
                            />
                        }
                    />


                </Routes>

            </AuthProvider>

        </BrowserRouter>

    );

}


export default App;