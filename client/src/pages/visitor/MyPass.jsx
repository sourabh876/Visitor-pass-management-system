import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
    getVisitorPasses,
    downloadPassPDF,
} from "../../services/passService";

import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/ui/LoadingSpinner";


const MyPass = () => {

    const [passes, setPasses] = useState([]);

    const [loading, setLoading] = useState(true);

    const [selectedPass, setSelectedPass] =
        useState(null);



    // Load passes


    const loadPasses = async () => {

        try {

            setLoading(true);

            const response =
                await getVisitorPasses();

            setPasses(
                response.data || []
            );

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to load passes"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadPasses();

    }, []);



    // Download PDF


    const handleDownloadPDF = async (passId) => {

        try {

            const blob =
                await downloadPassPDF(passId);


            const url =
                window.URL.createObjectURL(blob);


            const link =
                document.createElement("a");


            link.href = url;

            link.download =
                `visitor-pass-${passId}.pdf`;


            document.body.appendChild(link);

            link.click();

            link.remove();


            window.URL.revokeObjectURL(url);


            toast.success(
                "Pass PDF downloaded"
            );

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to download pass PDF"
            );

        }

    };



    // Loading

    return (

        <DashboardLayout>
            {loading ? (

                <LoadingSpinner>

                </LoadingSpinner>

            ) : (

                <div className="min-h-screen bg-gray-100">

                    <div className="max-w-7xl mx-auto px-6 py-8">


                        {/* Header */}

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                            <div>

                                <h1 className="text-3xl font-bold text-gray-800">
                                    My Visitor Passes
                                </h1>

                                <p className="text-gray-500 mt-1">
                                    View your approved visitor passes
                                </p>

                            </div> 

                        </div>


                        {/* No passes */}

                        {passes.length === 0 && (

                            <div className="bg-white rounded-xl shadow p-10 text-center">

                                <h2 className="text-xl font-semibold text-gray-700">
                                    No passes available
                                </h2>

                                <p className="text-gray-500 mt-2">
                                    Once an appointment is approved and a pass is generated,
                                    it will appear here.
                                </p>

                                <Link
                                    to="/visitor/appointments"
                                    className="inline-block mt-5 bg-blue-600 text-white px-5 py-3 rounded-lg"
                                >
                                    View Appointments
                                </Link>

                            </div>

                        )}


                        {/* Pass list */}

                        {passes.length > 0 && (

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                                {passes.map(
                                    (pass) => (

                                        <div
                                            key={pass._id}
                                            className="bg-white rounded-xl shadow overflow-hidden"
                                        >

                                            {/* Pass header */}

                                            <div className="bg-gray-900 text-white p-5">

                                                <div className="flex justify-between items-start">

                                                    <div>

                                                        <p className="text-gray-300 text-sm">
                                                            Visitor Pass
                                                        </p>

                                                        <h2 className="text-xl font-bold mt-1">
                                                            {pass.passNumber}
                                                        </h2>

                                                    </div>


                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm ${pass.status === "Active"
                                                            ? "bg-green-500"
                                                            : pass.status === "Used"
                                                                ? "bg-gray-500"
                                                                : "bg-red-500"
                                                            }`}
                                                    >
                                                        {pass.status}
                                                    </span>

                                                </div>

                                            </div>


                                            {/* Pass body */}

                                            <div className="p-6">


                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">


                                                    <div>

                                                        <p className="text-gray-500 text-sm">
                                                            Visitor
                                                        </p>

                                                        <p className="font-semibold mt-1">
                                                            {pass.appointment?.visitor?.fullName || "-"}
                                                        </p>

                                                    </div>


                                                    <div>

                                                        <p className="text-gray-500 text-sm">
                                                            Phone
                                                        </p>

                                                        <p className="font-semibold mt-1">
                                                            {pass.appointment?.visitor?.phone || "-"}
                                                        </p>

                                                    </div>


                                                    <div>

                                                        <p className="text-gray-500 text-sm">
                                                            Company
                                                        </p>

                                                        <p className="font-semibold mt-1">
                                                            {pass.appointment?.visitor?.company || "-"}
                                                        </p>

                                                    </div>


                                                    <div>

                                                        <p className="text-gray-500 text-sm">
                                                            Host
                                                        </p>

                                                        <p className="font-semibold mt-1">
                                                            {pass.appointment?.hostName || "-"}
                                                        </p>

                                                    </div>


                                                    <div>

                                                        <p className="text-gray-500 text-sm">
                                                            Department
                                                        </p>

                                                        <p className="font-semibold mt-1">
                                                            {pass.appointment?.department || "-"}
                                                        </p>

                                                    </div>


                                                    <div>

                                                        <p className="text-gray-500 text-sm">
                                                            Purpose
                                                        </p>

                                                        <p className="font-semibold mt-1">
                                                            {pass.appointment?.purpose || "-"}
                                                        </p>

                                                    </div>


                                                    <div>

                                                        <p className="text-gray-500 text-sm">
                                                            Visit Date
                                                        </p>

                                                        <p className="font-semibold mt-1">
                                                            {pass.appointment?.visitDate || "-"}
                                                        </p>

                                                    </div>


                                                    <div>

                                                        <p className="text-gray-500 text-sm">
                                                            Visit Time
                                                        </p>

                                                        <p className="font-semibold mt-1">
                                                            {pass.appointment?.visitTime || "-"}
                                                        </p>

                                                    </div>

                                                </div>


                                                {/* QR */}

                                                <div className="mt-8 flex justify-center">

                                                    {pass.qrCode ? (

                                                        <div className="text-center">

                                                            <img
                                                                src={pass.qrCode}
                                                                alt="Visitor Pass QR"
                                                                className="w-48 h-48 object-contain mx-auto"
                                                            />

                                                            <p className="text-sm text-gray-500 mt-2">
                                                                Show this QR code at security
                                                            </p>

                                                        </div>

                                                    ) : (

                                                        <div className="text-gray-500">
                                                            QR code unavailable
                                                        </div>

                                                    )}

                                                </div>


                                                {/* Actions */}

                                                <div className="flex flex-col sm:flex-row gap-3 mt-8">


                                                    <button
                                                        onClick={() =>
                                                            setSelectedPass(pass)
                                                        }
                                                        className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-lg"
                                                    >
                                                        View Details
                                                    </button>


                                                    <button
                                                        onClick={() =>
                                                            handleDownloadPDF(
                                                                pass._id
                                                            )
                                                        }
                                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
                                                    >
                                                        Download PDF
                                                    </button>

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>


                    {/* Details modal */}

                    {selectedPass && (

                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-5 z-50">

                            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">


                                <div className="flex items-center justify-between p-5 border-b">

                                    <h2 className="text-xl font-bold">
                                        Pass Details
                                    </h2>


                                    <button
                                        onClick={() =>
                                            setSelectedPass(null)
                                        }
                                        className="text-gray-500 hover:text-gray-800 text-2xl"
                                    >
                                        ×
                                    </button>

                                </div>


                                <div className="p-6 space-y-4">


                                    <div>

                                        <p className="text-gray-500 text-sm">
                                            Pass Number
                                        </p>

                                        <p className="font-semibold">
                                            {selectedPass.passNumber}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-gray-500 text-sm">
                                            Visitor
                                        </p>

                                        <p className="font-semibold">
                                            {selectedPass.appointment?.visitor?.fullName}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-gray-500 text-sm">
                                            Host
                                        </p>

                                        <p className="font-semibold">
                                            {selectedPass.appointment?.hostName}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-gray-500 text-sm">
                                            Department
                                        </p>

                                        <p className="font-semibold">
                                            {selectedPass.appointment?.department}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-gray-500 text-sm">
                                            Visit Date
                                        </p>

                                        <p className="font-semibold">
                                            {selectedPass.appointment?.visitDate}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-gray-500 text-sm">
                                            Visit Time
                                        </p>

                                        <p className="font-semibold">
                                            {selectedPass.appointment?.visitTime}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-gray-500 text-sm">
                                            Valid From
                                        </p>

                                        <p className="font-semibold">
                                            {selectedPass.validFrom
                                                ? new Date(
                                                    selectedPass.validFrom
                                                ).toLocaleString()
                                                : "-"
                                            }
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-gray-500 text-sm">
                                            Valid Until
                                        </p>

                                        <p className="font-semibold">
                                            {selectedPass.validUntil
                                                ? new Date(
                                                    selectedPass.validUntil
                                                ).toLocaleString()
                                                : "-"
                                            }
                                        </p>

                                    </div>


                                </div>


                                <div className="p-5 border-t">

                                    <button
                                        onClick={() =>
                                            setSelectedPass(null)
                                        }
                                        className="w-full bg-gray-800 text-white py-3 rounded-lg"
                                    >
                                        Close
                                    </button>

                                </div>

                            </div>

                        </div>

                    )}

                </div>

            )}
        </DashboardLayout>



    );

};


export default MyPass;