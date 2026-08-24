import {
    useState
} from "react";

import {
    useNavigate,
    Link
} from "react-router-dom";

import {
    registerVisitor
} from "../services/authApi";


const Register = () => {

    const navigate = useNavigate();


    // ==================================================
    // FORM STATE
    // ==================================================

    const [formData, setFormData] = useState({

        name: "",

        email: "",

        password: "",

        phone: ""

    });


    const [loading, setLoading] =
        useState(false);


    const [error, setError] =
        useState("");


    const [success, setSuccess] =
        useState("");


    // ==================================================
    // HANDLE INPUT
    // ==================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFormData(
            (previous) => ({

                ...previous,

                [name]: value

            })
        );

    };


    // ==================================================
    // SUBMIT
    // ==================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        setError("");

        setSuccess("");


        // ----------------------------------------------
        // BASIC VALIDATION
        // ----------------------------------------------

        if (
            !formData.name ||
            !formData.email ||
            !formData.password
        ) {

            setError(
                "Name, email and password are required."
            );

            return;

        }


        if (
            formData.password.length < 6
        ) {

            setError(
                "Password must contain at least 6 characters."
            );

            return;

        }


        try {

            setLoading(true);


            await registerVisitor({

                name: formData.name,

                email: formData.email,

                password: formData.password,

                phone: formData.phone,

                role: "visitor"

            });


            setSuccess(
                "Registration successful. Redirecting to login..."
            );


            setFormData({

                name: "",

                email: "",

                password: "",

                phone: ""

            });


            setTimeout(() => {

                navigate("/login");

            }, 1200);

        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            setError(
                error?.response?.data?.message ||
                "Registration failed. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };


    // ==================================================
    // UI
    // ==================================================

    return (

        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">

                <h1 className="text-2xl font-bold text-gray-800 text-center">

                    Visitor Registration

                </h1>


                <p className="text-gray-500 text-center mt-2">

                    Create your visitor account

                </p>


                {/* ======================================
                    ERROR
                ====================================== */}

                {error && (

                    <div className="mt-5 bg-red-100 text-red-700 px-4 py-3 rounded-lg">

                        {error}

                    </div>

                )}


                {/* ======================================
                    SUCCESS
                ====================================== */}

                {success && (

                    <div className="mt-5 bg-green-100 text-green-700 px-4 py-3 rounded-lg">

                        {success}

                    </div>

                )}


                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-4"
                >


                    {/* NAME */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-1">

                            Full Name

                        </label>


                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>


                    {/* EMAIL */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-1">

                            Email

                        </label>


                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>


                    {/* PHONE */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-1">

                            Phone

                        </label>


                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>


                    {/* PASSWORD */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-1">

                            Password

                        </label>


                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>


                    {/* SUBMIT */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg transition"
                    >

                        {loading
                            ? "Creating account..."
                            : "Register"
                        }

                    </button>

                </form>


                {/* LOGIN */}

                <p className="text-center text-sm text-gray-600 mt-6">

                    Already have an account?

                    {" "}

                    <Link
                        to="/login"
                        className="text-blue-600 hover:underline font-medium"
                    >

                        Login

                    </Link>

                </p>

            </div>

        </div>

    );

};


export default Register;