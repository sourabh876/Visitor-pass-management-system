import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    getEmployees
} from "../../services/userApi";

import { toast } from "react-toastify";

import {
    createAppointment
} from "../../services/appointmentService";

import DashboardLayout from "../../components/layout/DashboardLayout";


const BookAppointment = () => {

    const navigate = useNavigate();

    const[loading, setLoading] = useState(true)


    // EMPLOYEES


    const [employees, setEmployees] =
        useState([]);


    const [loadingEmployees, setLoadingEmployees] =
        useState(true);



    // SELECTED EMPLOYEE


    const [selectedEmployeeId, setSelectedEmployeeId] =
        useState("");



    // FORM DATA


    const [formData, setFormData] = useState({

        hostName: "",

        department: "",

        purpose: "",

        visitDate: "",

        visitTime: ""

    });



    // SUBMIT STATE


    const [submitting, setSubmitting] =
        useState(false);



    // MESSAGE


    const [error, setError] =
        useState("");

 



    // LOAD EMPLOYEES


    useEffect(() => {

        const loadEmployees = async () => {

            try {

                setLoadingEmployees(true);

                setError("");


                const response =
                    await getEmployees();


                console.log(
                    "Employees:",
                    response
                );


                 


                setEmployees(
                    response?.data || []
                );

            } catch (error) {

                console.error(
                    "Employee loading error:",
                    error
                );


                setError(
                    error?.response?.data?.message ||
                    "Unable to load employees."
                );

            } finally {

                setLoadingEmployees(false);

            }

        };


        loadEmployees();

    }, []);



    // HOST CHANGE


    const handleHostChange = (event) => {

        const employeeId =
            event.target.value;


        setSelectedEmployeeId(
            employeeId
        );


        const employee =
            employees.find(
                (item) =>
                    item._id === employeeId
            );


        if (!employee) {

            setFormData({

                hostName: "",

                department: "",

                purpose:
                    formData.purpose,

                visitDate:
                    formData.visitDate,

                visitTime:
                    formData.visitTime

            });

            return;

        }


        setFormData(
            (previous) => ({

                ...previous,

                hostName:
                    employee.name,

                department:
                    employee.department || ""

            })
        );

    };



    // INPUT CHANGE


    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData(
            (previous) => ({

                ...previous,

                [name]: value

            })
        );

    };



    // SUBMIT


    const handleSubmit = async (event) => {

        event.preventDefault();


        setError(""); 



        // VALIDATION


        if (!selectedEmployeeId) {

            setError(
                "Please select an employee."
            );

            return;

        }


        if (!formData.department) {

            setError(
                "Selected employee does not have a department."
            );

            return;

        }


        if (!formData.purpose.trim()) {

            setError(
                "Please enter the purpose of your visit."
            );

            return;

        }


        if (!formData.visitDate) {

            setError(
                "Please select the visit date."
            );

            return;

        }


        if (!formData.visitTime) {

            setError(
                "Please select the visit time."
            );

            return;

        }


        try {

            setSubmitting(true);


            
            // CREATE APPOINTMENT
            

            const response =
                await createAppointment({

                    host:
                        selectedEmployeeId,

                    purpose:
                        formData.purpose.trim(),

                    visitDate:
                        formData.visitDate,

                    visitTime:
                        formData.visitTime

                });


            console.log(
                "Appointment created:",
                response
            );


            toast.success(
                "Appointment booked successfully. Waiting for employee approval."
            );


            
            // RESET FORM
            

            setSelectedEmployeeId("");

            setFormData({

                hostName: "",

                department: "",

                purpose: "",

                visitDate: "",

                visitTime: ""

            });


        } catch (error) {

            console.error(
                "Appointment creation error:",
                error
            );


            setError(
                error?.response?.data?.message ||
                "Failed to book appointment."
            );

            toast.error("Failed to book appointment.")



        } finally {

            setSubmitting(false);

        }

    };



    // TODAY


    const today =
        new Date()
            .toISOString()
            .split("T")[0];



    // UI


    return (

        <DashboardLayout>
            
            <div className="min-h-screen bg-gray-100 p-6">

                <div className="max-w-3xl mx-auto">




                    <div className="mb-6">

                        <h1 className="text-3xl font-bold text-gray-800">

                            Book Appointment

                        </h1>


                        <p className="text-gray-600 mt-2">

                            Select an employee and schedule your visit.

                        </p>

                    </div>




                    <div className="bg-white rounded-xl shadow-md p-6">




                        {error && (

                            <div className="mb-5 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">

                                {error}

                            </div>

                        )}


                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >




                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-2">

                                    Select Employee

                                </label>


                                <select
                                    value={
                                        selectedEmployeeId
                                    }
                                    onChange={
                                        handleHostChange
                                    }
                                    disabled={
                                        loadingEmployees ||
                                        submitting
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >

                                    <option value="">

                                        {loadingEmployees
                                            ? "Loading employees..."
                                            : "Select an employee"
                                        }

                                    </option>


                                    {employees.map(
                                        (employee) => (

                                            <option
                                                key={
                                                    employee._id
                                                }
                                                value={
                                                    employee._id
                                                }
                                            >

                                                {employee.name}

                                                {employee.email
                                                    ? ` - ${employee.email}`
                                                    : ""
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>




                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-2">

                                    Department

                                </label>


                                <input
                                    type="text"
                                    value={
                                        formData.department
                                    }
                                    readOnly
                                    placeholder="Department will appear automatically"
                                    className="w-full border border-gray-300 bg-gray-100 text-gray-600 rounded-lg px-4 py-3 cursor-not-allowed"
                                />

                            </div>




                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-2">

                                    Host

                                </label>


                                <input
                                    type="text"
                                    value={
                                        formData.hostName
                                    }
                                    readOnly
                                    placeholder="Select an employee first"
                                    className="w-full border border-gray-300 bg-gray-100 text-gray-600 rounded-lg px-4 py-3 cursor-not-allowed"
                                />

                            </div>




                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-2">

                                    Purpose of Visit

                                </label>


                                <textarea
                                    name="purpose"
                                    value={
                                        formData.purpose
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    rows="4"
                                    placeholder="Why are you visiting?"
                                    disabled={submitting}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>


                            {/*   =
                            DATE + TIME
                          = */}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                                {/* DATE */}

                                <div>

                                    <label className="block text-sm font-medium text-gray-700 mb-2">

                                        Visit Date

                                    </label>


                                    <input
                                        type="date"
                                        name="visitDate"
                                        value={
                                            formData.visitDate
                                        }
                                        min={today}
                                        onChange={
                                            handleChange
                                        }
                                        disabled={submitting}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                </div>


                                {/* TIME */}

                                <div>

                                    <label className="block text-sm font-medium text-gray-700 mb-2">

                                        Visit Time

                                    </label>


                                    <input
                                        type="time"
                                        name="visitTime"
                                        value={
                                            formData.visitTime
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={submitting}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                </div>

                            </div>


                            {/*   =
                            BUTTONS
                          = */}

                            <div className="flex gap-3 pt-3">

                                <button
                                    type="submit"
                                    disabled={
                                        submitting ||
                                        loadingEmployees
                                    }
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg"
                                >

                                    {submitting
                                        ? "Booking..."
                                        : "Book Appointment"
                                    }

                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/visitor/"
                                        )
                                    }
                                    disabled={submitting}
                                    className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg"
                                >

                                    Back

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>
        </DashboardLayout>


    );

};


export default BookAppointment;