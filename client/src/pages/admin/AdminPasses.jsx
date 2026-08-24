import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    getPasses,
    cancelPass,
    downloadPassPDF
} from "../../services/passService";

import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/ui/LoadingSpinner";



const AdminPasses = () => {

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


    const [
        success,
        setSuccess
    ] = useState("");


    const [
        search,
        setSearch
    ] = useState("");


    const [
        cancellingId,
        setCancellingId
    ] = useState(null);


    const [
        downloadingId,
        setDownloadingId
    ] = useState(null);



    // LOAD PASSES


    const loadPasses = async () => {

        try {

            setLoading(true);
            setError("");


            const response =
                await getPasses();


            setPasses(
                response.data || []
            );

        } catch (error) {

            console.error(
                "Failed to load passes:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Unable to load passes."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadPasses();

    }, []);



    // SEARCH


    const filteredPasses =
        useMemo(() => {

            const searchValue =
                search
                    .trim()
                    .toLowerCase();


            if (!searchValue) {

                return passes;

            }


            return passes.filter(
                pass => {

                    const passNumber =
                        pass.passNumber
                            ?.toLowerCase() || "";


                    const visitorName =
                        pass.appointment
                            ?.visitor
                            ?.fullName
                            ?.toLowerCase() || "";


                    const visitorEmail =
                        pass.appointment
                            ?.visitor
                            ?.email
                            ?.toLowerCase() || "";


                    const hostName =
                        pass.appointment
                            ?.hostName
                            ?.toLowerCase() || "";


                    return (
                        passNumber.includes(
                            searchValue
                        ) ||
                        visitorName.includes(
                            searchValue
                        ) ||
                        visitorEmail.includes(
                            searchValue
                        ) ||
                        hostName.includes(
                            searchValue
                        )
                    );

                }
            );

        }, [
            passes,
            search
        ]);



    // CANCEL PASS


    const handleCancel =
        async (pass) => {

            const confirmed =
                window.confirm(
                    `Cancel pass ${pass.passNumber}?`
                );


            if (!confirmed) {

                return;

            }


            try {

                setCancellingId(
                    pass._id
                );

                setError("");
                setSuccess("");


                await cancelPass(
                    pass._id
                );


                setPasses(
                    previous =>
                        previous.map(
                            item => {

                                if (
                                    item._id ===
                                    pass._id
                                ) {

                                    return {
                                        ...item,
                                        status:
                                            "Cancelled"
                                    };

                                }


                                return item;

                            }
                        )
                );


                setSuccess(
                    "Pass cancelled successfully."
                );

            } catch (error) {

                console.error(
                    "Cancel pass error:",
                    error
                );


                setError(
                    error.response?.data?.message ||
                    "Unable to cancel pass."
                );

            } finally {

                setCancellingId(
                    null
                );

            }

        };



    // DOWNLOAD PDF


    const handleDownloadPDF =
        async (pass) => {

            try {

                setDownloadingId(
                    pass._id
                );

                setError("");


                const blob =
                    await downloadPassPDF(
                        pass._id
                    );


                const url =
                    window.URL.createObjectURL(
                        blob
                    );


                const link =
                    document.createElement(
                        "a"
                    );


                link.href = url;


                link.download =
                    `${pass.passNumber}.pdf`;


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
                    "PDF download error:",
                    error
                );


                setError(
                    error.response?.data?.message ||
                    "Unable to download pass PDF."
                );

            } finally {

                setDownloadingId(
                    null
                );

            }

        };



    // STATUS CLASS


    const getStatusClass =
        (status) => {

            switch (status) {

                case "Active":

                    return "bg-green-100 text-green-700";

                case "Used":

                    return "bg-blue-100 text-blue-700";

                case "Cancelled":

                    return "bg-red-100 text-red-700";

                case "Expired":

                    return "bg-gray-200 text-gray-700";

                default:

                    return "bg-gray-100 text-gray-700";

            }

        };


    return (

        <DashboardLayout>
            {loading ? (

                <LoadingSpinner>
                    {/* <div className="max-w-7xl mx-auto">

                        <div className="bg-white rounded-xl shadow p-8 flex items-center justify-center">

                            <p className="text-gray-600">
                                Loading passes...
                            </p>

                        </div>

                    </div> */}
                </LoadingSpinner>

            ) : (

                <div className="min-h-screen bg-gray-100 p-6">

                    <div className="max-w-7xl mx-auto">


                        {/* HEADER */}

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                            <div>

                                <h1 className="text-3xl font-bold text-gray-800">

                                    Pass Management

                                </h1>


                                <p className="text-gray-600 mt-1">

                                    Monitor and manage visitor passes.

                                </p>

                            </div>


                            <Link
                                to="/admin"
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >

                                ← Admin Dashboard

                            </Link>

                        </div>


                        {/* ALERTS */}

                        {error && (

                            <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-4 mb-5">

                                {error}

                            </div>

                        )}


                        {success && (

                            <div className="bg-green-100 border border-green-300 text-green-700 rounded-lg p-4 mb-5">

                                {success}

                            </div>

                        )}


                        {/* SEARCH */}

                        <div className="bg-white rounded-xl shadow p-5 mb-6">

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search pass number, visitor or host..."
                                className="
                            w-full
                            border
                            border-gray-300
                            rounded-lg
                            px-4
                            py-3
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                        "
                            />

                        </div>


                        {/* TABLE */}

                        <div className="bg-white rounded-xl shadow overflow-hidden">

                            {filteredPasses.length === 0 ? (

                                <div className="p-10 text-center text-gray-500">

                                    No passes found.

                                </div>

                            ) : (

                                <div className="overflow-x-auto">

                                    <table className="w-full">

                                        <thead className="bg-gray-50 border-b">

                                            <tr>

                                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">

                                                    Pass Number

                                                </th>


                                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">

                                                    Visitor

                                                </th>


                                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">

                                                    Host

                                                </th>


                                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">

                                                    Visit Date

                                                </th>


                                                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">

                                                    Status

                                                </th>


                                                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">

                                                    Actions

                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody className="divide-y">

                                            {filteredPasses.map(
                                                pass => (

                                                    <tr
                                                        key={
                                                            pass._id
                                                        }
                                                        className="hover:bg-gray-50"
                                                    >

                                                        <td className="px-6 py-4">

                                                            <span className="font-mono font-medium">

                                                                {
                                                                    pass.passNumber
                                                                }

                                                            </span>

                                                        </td>


                                                        <td className="px-6 py-4">

                                                            <div className="font-medium">

                                                                {
                                                                    pass
                                                                        .appointment
                                                                        ?.visitor
                                                                        ?.fullName ||
                                                                    "N/A"
                                                                }

                                                            </div>


                                                            <div className="text-sm text-gray-500">

                                                                {
                                                                    pass
                                                                        .appointment
                                                                        ?.visitor
                                                                        ?.email ||
                                                                    ""
                                                                }

                                                            </div>

                                                        </td>


                                                        <td className="px-6 py-4">

                                                            <div className="font-medium">

                                                                {
                                                                    pass
                                                                        .appointment
                                                                        ?.hostName ||
                                                                    "N/A"
                                                                }

                                                            </div>


                                                            <div className="text-sm text-gray-500">

                                                                {
                                                                    pass
                                                                        .appointment
                                                                        ?.department ||
                                                                    ""
                                                                }

                                                            </div>

                                                        </td>


                                                        <td className="px-6 py-4">

                                                            {
                                                                pass
                                                                    .appointment
                                                                    ?.visitDate ||
                                                                "N/A"
                                                            }

                                                        </td>


                                                        <td className="px-6 py-4 text-center">

                                                            <span
                                                                className={`
                                                            inline-block
                                                            px-3
                                                            py-1
                                                            rounded-full
                                                            text-sm
                                                            font-medium
                                                            ${getStatusClass(
                                                                    pass.status
                                                                )}
                                                        `}
                                                            >

                                                                {
                                                                    pass.status
                                                                }

                                                            </span>

                                                        </td>


                                                        <td className="px-6 py-4">

                                                            <div className="flex justify-center gap-2">


                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleDownloadPDF(
                                                                            pass
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        downloadingId ===
                                                                        pass._id
                                                                    }
                                                                    className="
                                                                bg-blue-100
                                                                text-blue-700
                                                                hover:bg-blue-200
                                                                disabled:opacity-50
                                                                px-3
                                                                py-2
                                                                rounded-lg
                                                                text-sm
                                                            "
                                                                >

                                                                    {
                                                                        downloadingId ===
                                                                            pass._id
                                                                            ? "Downloading..."
                                                                            : "PDF"
                                                                    }

                                                                </button>


                                                                {pass.status ===
                                                                    "Active" && (

                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleCancel(
                                                                                    pass
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                cancellingId ===
                                                                                pass._id
                                                                            }
                                                                            className="
                                                                    bg-red-100
                                                                    text-red-700
                                                                    hover:bg-red-200
                                                                    disabled:opacity-50
                                                                    px-3
                                                                    py-2
                                                                    rounded-lg
                                                                    text-sm
                                                                "
                                                                        >

                                                                            {
                                                                                cancellingId ===
                                                                                    pass._id
                                                                                    ? "Cancelling..."
                                                                                    : "Cancel"
                                                                            }

                                                                        </button>

                                                                    )}

                                                            </div>

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            )}

        </DashboardLayout>


    );

};


export default AdminPasses;