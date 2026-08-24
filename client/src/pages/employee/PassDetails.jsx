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
    getPassById,
    cancelPass,
    downloadPassPDF
} from "../../services/passService";

import DashboardLayout from "../../components/layout/DashboardLayout"
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const PassDetails = () => {

    const {
        id
    } = useParams();


    const navigate =
        useNavigate();


    const [
        pass,
        setPass
    ] = useState(null);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    const [
        cancelling,
        setCancelling
    ] = useState(false);


    const [
        downloading,
        setDownloading
    ] = useState(false);



    // LOAD PASS


    const loadPass = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await getPassById(id);


            setPass(
                response.data
            );


        } catch (error) {

            console.error(
                "Failed to load pass:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to load pass."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadPass();

    }, [id]);



    // CANCEL PASS


    const handleCancelPass = async () => {

        const confirmed =
            window.confirm(
                "Are you sure you want to cancel this pass?"
            );


        if (!confirmed) {

            return;

        }


        try {

            setCancelling(true);

            setError("");


            await cancelPass(
                id
            );


            alert(
                "Pass cancelled successfully."
            );


            await loadPass();


        } catch (error) {

            console.error(
                "Cancel pass error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to cancel pass."
            );

        } finally {

            setCancelling(false);

        }

    };



    // DOWNLOAD PDF


    const handleDownloadPDF = async () => {

        try {

            setDownloading(true);

            setError("");


            const blob =
                await downloadPassPDF(id);


            const url =
                window.URL.createObjectURL(
                    new Blob(
                        [blob],
                        {
                            type:
                                "application/pdf"
                        }
                    )
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href = url;


            link.setAttribute(
                "download",
                `${pass.passNumber}.pdf`
            );


            document.body.appendChild(
                link
            );


            link.click();


            link.remove();


            window.URL.revokeObjectURL(
                url
            );


        } catch (error) {

            console.error(
                "Download PDF error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to download pass."
            );

        } finally {

            setDownloading(false);

        }

    };


return (

    <DashboardLayout>

        <div className="min-h-screen bg-gray-100 p-6">

            {loading ? (

                <LoadingSpinner>
                    
                </LoadingSpinner>

            ) : error ? (

                <div className="max-w-4xl mx-auto">

                    <div className="bg-white rounded-xl shadow p-8 text-center">

                        <h2 className="text-xl font-semibold text-red-600">
                            Pass Not Found
                        </h2>


                        <p className="text-gray-600 mt-3">
                            {error}
                        </p>


                        <Link
                            to="/visitor/appointments"
                            className="inline-block mt-5 text-blue-600"
                        >
                            ← Back to Appointments
                        </Link>

                    </div>

                </div>

            ) : !pass ? (

                <div className="max-w-4xl mx-auto">

                    <div className="bg-white rounded-xl shadow p-8 text-center">

                        <h2 className="text-xl font-semibold text-gray-800">
                            Pass Not Found
                        </h2>


                        <p className="text-gray-600 mt-3">
                            No visitor pass exists for this appointment.
                        </p>


                        <Link
                            to="/visitor/appointments"
                            className="inline-block mt-5 text-blue-600"
                        >
                            ← Back to Appointments
                        </Link>

                    </div>

                </div>

            ) : (

                <div className="max-w-4xl mx-auto">

                    {
                        (() => {

                            const appointment =
                                pass.appointment;

                            const visitor =
                                appointment?.visitor;


                            return (

                                <>

                                    <Link
                                        to={`/visitor/appointments/${appointment._id}`}
                                        className="text-blue-600"
                                    >
                                        ← Back to Appointment
                                    </Link>


                                    <div className="bg-white rounded-xl shadow mt-5 p-6">

                                        <div className="flex justify-between items-center">

                                            <div>

                                                <h1 className="text-2xl font-bold">
                                                    Visitor Pass
                                                </h1>

                                                <p className="text-gray-500 mt-1">
                                                    {pass.passNumber}
                                                </p>

                                            </div>


                                            <span
                                                className={`
                                                    px-4
                                                    py-2
                                                    rounded-full
                                                    text-sm
                                                    font-medium

                                                    ${
                                                        pass.status ===
                                                        "Active"

                                                            ? "bg-green-100 text-green-700"

                                                            : "bg-red-100 text-red-700"
                                                    }
                                                `}
                                            >
                                                {pass.status}
                                            </span>

                                        </div>


                                        {/* Visitor */}

                                        <div className="mt-8">

                                            <h2 className="text-lg font-semibold">
                                                Visitor Information
                                            </h2>


                                            <div className="mt-4 space-y-2">

                                                <p>
                                                    <strong>Name:</strong>{" "}
                                                    {visitor?.fullName}
                                                </p>

                                                <p>
                                                    <strong>Email:</strong>{" "}
                                                    {visitor?.email}
                                                </p>

                                                <p>
                                                    <strong>Phone:</strong>{" "}
                                                    {visitor?.phone}
                                                </p>

                                                <p>
                                                    <strong>Company:</strong>{" "}
                                                    {visitor?.company || "N/A"}
                                                </p>

                                            </div>

                                        </div>


                                        {/* Appointment */}

                                        <div className="mt-8">

                                            <h2 className="text-lg font-semibold">
                                                Appointment Information
                                            </h2>


                                            <div className="mt-4 space-y-2">

                                                <p>
                                                    <strong>Host:</strong>{" "}
                                                    {appointment?.hostName}
                                                </p>

                                                <p>
                                                    <strong>Department:</strong>{" "}
                                                    {appointment?.department}
                                                </p>

                                                <p>
                                                    <strong>Purpose:</strong>{" "}
                                                    {appointment?.purpose}
                                                </p>

                                                <p>
                                                    <strong>Date:</strong>{" "}
                                                    {
                                                        appointment?.visitDate
                                                            ? new Date(
                                                                appointment.visitDate
                                                            ).toLocaleDateString()
                                                            : "N/A"
                                                    }
                                                </p>

                                                <p>
                                                    <strong>Time:</strong>{" "}
                                                    {appointment?.visitTime}
                                                </p>

                                            </div>

                                        </div>


                                        {/* QR */}

                                        <div className="mt-8 text-center">

                                            <h2 className="text-lg font-semibold mb-4">
                                                QR Code
                                            </h2>


                                            <img
                                                src={pass.qrCode}
                                                alt="Visitor Pass QR Code"
                                                className="w-52 h-52 mx-auto"
                                            />

                                        </div>


                                        {/* Download */}

                                        <div className="mt-8 flex justify-center">

                                            <button
                                                onClick={handleDownloadPDF}
                                                disabled={downloading}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                                            >

                                                {
                                                    downloading
                                                        ? "Downloading..."
                                                        : "Download Pass"
                                                }

                                            </button>

                                        </div>

                                    </div>

                                </>

                            );

                        })()
                    }

                </div>

            )}

        </div>

    </DashboardLayout>

);

};


export default PassDetails;