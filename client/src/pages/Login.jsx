

import {
    useState
} from "react";

import {
    useNavigate,
    Link
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext";


const Login = () => {

    const navigate = useNavigate();

    const {
        login
    } = useAuth();


    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);



    // LOGIN SUBMIT


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        setLoading(true);


        try {

            const loggedInUser =
                await login(
                    email,
                    password
                );



            // ROLE BASED REDIRECTION


            switch (
            loggedInUser.role
            ) {

                case "admin":

                    navigate(
                        "/admin",
                        {
                            replace: true
                        }
                    );

                    break;


                case "employee":

                    navigate(
                        "/employee",
                        {
                            replace: true
                        }
                    );

                    break;


                case "security":

                    navigate(
                        "/security",
                        {
                            replace: true
                        }
                    );

                    break;


                case "visitor":

                    navigate(
                        "/visitor",
                        {
                            replace: true
                        }
                    );

                    break;


                default:

                    setError(
                        "Invalid user role."
                    );

            }

        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Invalid email or password."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">


                {/*   
                    HEADER
                   */}

                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold text-gray-800">

                        Visitor Pass System

                    </h1>


                    <p className="text-gray-500 mt-2">

                        Login to your account

                    </p>

                </div>


                {/*   
                    ERROR
                   */}

                {error && (

                    <div className="mb-5 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">

                        {error}

                    </div>

                )}


                {/*   
                    FORM
                   */}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >


                    {/* EMAIL */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">

                            Email

                        </label>


                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
                            }
                            placeholder="Enter your email"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>


                    {/* PASSWORD */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">

                            Password

                        </label>


                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Enter your password"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>


                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"
                        }

                    </button>

                    <p className="text-center text-sm text-gray-600 mt-6">

                        Don't have an account?

                        {" "}

                        <Link
                            to="/register"
                            className="text-blue-600 hover:underline font-medium"
                        >

                            Register as Visitor

                        </Link>

                    </p>

                </form>

            </div>

        </div>

    );

};


export default Login;