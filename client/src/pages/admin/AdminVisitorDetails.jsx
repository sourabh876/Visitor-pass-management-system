import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import {
    getVisitorById
} from "../../services/visitorApi";

import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/ui/LoadingSpinner";


const AdminVisitorDetails = () => {

    const {
        id
    } = useParams();


    const navigate =
        useNavigate();


    const [
        visitor,
        setVisitor
    ] = useState(null);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");



    // LOAD VISITOR


    useEffect(() => {

        const loadVisitor =
            async () => {

                try {

                    setLoading(true);

                    setError("");


                    const response =
                        await getVisitorById(
                            id
                        );


                    setVisitor(
                        response.data
                    );


                } catch (error) {

                    console.error(
                        "Failed to load visitor:",
                        error
                    );


                    setError(
                        error.response?.data?.message ||
                        "Unable to load visitor."
                    );

                } finally {

                    setLoading(false);

                }

            };


        loadVisitor();

    }, [id]);


    if (!visitor) {

        return null;

    }


    return (

        <DashboardLayout>
            <div className="min-h-screen bg-gray-100 p-6">

                {loading ? (
                    <LoadingSpinner>
                        {/* <div className="max-w-4xl mx-auto">

                            <div className="bg-white rounded-xl shadow p-8 text-center">

                                <p className="text-gray-600">
                                    Loading visitor details...
                                </p>

                            </div>

                        </div> */}
                    </LoadingSpinner>
                ) : error ? (

                    <div className="max-w-3xl mx-auto">

                        <button
                            onClick={() =>
                                navigate(
                                    "/admin/visitors"
                                )
                            }
                            className="text-blue-600 mb-5"
                        >

                            ← Back to Visitors

                        </button>


                        <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-5">

                            {error}

                        </div>

                    </div>

                ) : !visitor ? (
                    <div className="max-w-4xl mx-auto">

                        <div className="bg-white rounded-xl shadow p-8 text-center">

                            <p className="text-gray-600">
                                Visitor details not found.
                            </p>

                            <p className="text-gray-600 mt-3">
                                No visitor pass exists for this appointment.
                            </p>


                            <Link
                                to="/admin/visitors"
                                className="inline-block mt-5 text-blue-600"
                            >
                                ← Back to visitors
                            </Link>

                        </div>

                    </div>
                ) : (

                    <div className="max-w-4xl mx-auto">


                        {/* HEADER */}

                        <div className="flex justify-between items-center mb-6">

                            <div>

                                <h1 className="text-3xl font-bold text-gray-800">

                                    Visitor Details

                                </h1>

                            </div>


                            <Link
                                to="/admin/visitors"
                                className="text-blue-600 hover:text-blue-800"
                            >

                                ← Back

                            </Link>

                        </div>


                        {/* PROFILE */}

                        <div className="bg-white rounded-xl shadow overflow-hidden">


                            {/* TOP */}

                            <div className="bg-blue-600 p-6 w-full flex justify-between text-white">

                                <div>
                                    <h2 className="text-2xl font-bold">

                                        {
                                            visitor.fullName
                                        }

                                    </h2>


                                    <p className="text-blue-100 mt-1">

                                        {
                                            visitor.email
                                        }

                                    </p>
                                </div>

                                <div className="flex flex-col items-center ">

                                    {visitor?.photo ? (

                                        <button
                                            type="button"
                                            onClick={() => setShowPhoto(true)}
                                            className=" rounded-full
                                            focus:outline-none
                                            focus:ring-4
                                            focus:ring-blue-200
            "
                                        >

                                            <img
                                                src={`http://localhost:5000/${visitor.photo}`}
                                                alt={visitor.fullName || "Visitor"}
                                                className="
                                                w-32
                                                rounded-full
                                                object-cover
                                                border-4
                                                border-white
                                                shadow-lg
                                                hover:opacity-90
                                                transition
                                                h-32
                                                "
                                            />

                                        </button>

                                    ) : (

                                        <div
                                            className="
                h-32
                w-32
                rounded-full
                bg-blue-600
                text-white
                flex
                items-center
                justify-center
                text-4xl
                font-bold
                shadow-lg
            "
                                        >

                                            {visitor.fullName
                                                ?.charAt(0)
                                                ?.toUpperCase() || "U"
                                            }

                                        </div>

                                    )}


                                    {/* <p className="text-sm text-gray-500 mt-3">
                                        {visitor?.photo
                                            ? "Click photo to view"
                                            : "No visitor photo uploaded"
                                        }
                                    </p> */}

                                </div>

                            </div>




                            {/* DETAILS */}

                            <div className="p-6">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                                    <div>

                                        <p className="text-sm text-gray-500">

                                            Full Name

                                        </p>

                                        <p className="font-medium mt-1">

                                            {
                                                visitor.fullName ||
                                                "N/A"
                                            }

                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-sm text-gray-500">

                                            Email

                                        </p>

                                        <p className="font-medium mt-1 break-all">

                                            {
                                                visitor.email ||
                                                "N/A"
                                            }

                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-sm text-gray-500">

                                            Phone

                                        </p>

                                        <p className="font-medium mt-1">

                                            {
                                                visitor.phone ||
                                                "N/A"
                                            }

                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-sm text-gray-500">

                                            Company

                                        </p>

                                        <p className="font-medium mt-1">

                                            {
                                                visitor.company ||
                                                "N/A"
                                            }

                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-sm text-gray-500">

                                            ID Proof Type

                                        </p>

                                        <p className="font-medium mt-1">

                                            {
                                                visitor.idProofType ||
                                                "N/A"
                                            }

                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-sm text-gray-500">

                                            ID Proof Number

                                        </p>

                                        <p className="font-medium mt-1">

                                            {
                                                visitor.idProofNumber ||
                                                "N/A"
                                            }

                                        </p>

                                    </div>


                                    <div className="md:col-span-2">

                                        <p className="text-sm text-gray-500">

                                            Address

                                        </p>

                                        <p className="font-medium mt-1">

                                            {
                                                visitor.address ||
                                                "N/A"
                                            }

                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-sm text-gray-500">

                                            Created By

                                        </p>

                                        <p className="font-medium mt-1">

                                            {
                                                visitor.createdBy
                                                    ?.name ||
                                                "N/A"
                                            }

                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-sm text-gray-500">

                                            Created By Email

                                        </p>

                                        <p className="font-medium mt-1">

                                            {
                                                visitor.createdBy
                                                    ?.email ||
                                                "N/A"
                                            }

                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>
                )}

            </div>
        </DashboardLayout>



    );

};


export default AdminVisitorDetails;