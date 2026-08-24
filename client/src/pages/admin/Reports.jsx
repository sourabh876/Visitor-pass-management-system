import {
    useState
} from "react";

import {
    toast
} from "react-toastify";

import DashboardLayout
    from "../../components/layout/DashboardLayout";

import {
    exportAppointments,
    exportVisitors,
    exportPasses,
    exportUsers,
    exportCheckLogs
} from "../../services/reportService";


const Reports = () => {

    const [
        reportType,
        setReportType
    ] = useState("appointments");


    const [
        from,
        setFrom
    ] = useState("");


    const [
        to,
        setTo
    ] = useState("");


    const [
        status,
        setStatus
    ] = useState("All");


    const [
        exporting,
        setExporting
    ] = useState(false);


    const createDownload = (
        blob,
        filename
    ) => {

        const url =
            window.URL.createObjectURL(
                new Blob([blob])
            );


        const link =
            document.createElement("a");


        link.href = url;

        link.download =
            filename;


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        window.URL.revokeObjectURL(
            url
        );

    };


    const handleExport = async (
        format
    ) => {

        try {

            setExporting(true);


            const params = {

                format,

                from,

                to

            };


            if (
                reportType ===
                    "appointments" ||
                reportType ===
                    "passes"
            ) {

                params.status =
                    status;

            }


            let blob;


            switch (
                reportType
            ) {

                case "appointments":

                    blob =
                        await exportAppointments(
                            params
                        );

                    break;


                case "visitors":

                    blob =
                        await exportVisitors(
                            params
                        );

                    break;


                case "passes":

                    blob =
                        await exportPasses(
                            params
                        );

                    break;


                case "users":

                    blob =
                        await exportUsers(
                            params
                        );

                    break;


                case "checklogs":

                    blob =
                        await exportCheckLogs(
                            params
                        );

                    break;


                default:

                    throw new Error(
                        "Invalid report type"
                    );

            }


            createDownload(

                blob,

                `${reportType}-report.${format === "excel"
                    ? "xlsx"
                    : format
                }`

            );


            toast.success(
                "Report exported successfully."
            );


        } catch (error) {

            console.error(
                "Report export error:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                "Failed to export report."
            );

        } finally {

            setExporting(false);

        }

    };


    return (

        <DashboardLayout>

            <div className="min-h-screen bg-gray-100">

                <div className="max-w-7xl mx-auto p-6">


                    {/* HEADER */}

                    <div className="mb-8">

                        <h1 className="
                            text-3xl
                            font-bold
                            text-gray-800
                        ">
                            Reports & Monitoring
                        </h1>


                        <p className="
                            text-gray-600
                            mt-1
                        ">

                            Generate and export system reports.

                        </p>

                    </div>


                    {/* FILTER PANEL */}

                    <div className="
                        bg-white
                        rounded-xl
                        shadow
                        p-6
                        mb-6
                    ">

                        <h2 className="
                            text-lg
                            font-semibold
                            text-gray-800
                            mb-5
                        ">
                            Report Filters
                        </h2>


                        <div className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            lg:grid-cols-4
                            gap-5
                        ">


                            {/* REPORT TYPE */}

                            <div>

                                <label className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mb-2
                                ">
                                    Report Type
                                </label>


                                <select
                                    value={reportType}
                                    onChange={(e) =>
                                        setReportType(
                                            e.target.value
                                        )
                                    }
                                    className="
                                        w-full
                                        border
                                        border-gray-300
                                        rounded-lg
                                        px-4
                                        py-3
                                    "
                                >

                                    <option value="appointments">
                                        Appointments
                                    </option>

                                    <option value="visitors">
                                        Visitors
                                    </option>

                                    <option value="passes">
                                        Passes
                                    </option>

                                    <option value="users">
                                        Users
                                    </option>

                                    <option value="checklogs">
                                        Check Logs
                                    </option>

                                </select>

                            </div>


                            {/* FROM */}

                            <div>

                                <label className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mb-2
                                ">
                                    From Date
                                </label>


                                <input
                                    type="date"
                                    value={from}
                                    onChange={(e) =>
                                        setFrom(
                                            e.target.value
                                        )
                                    }
                                    className="
                                        w-full
                                        border
                                        border-gray-300
                                        rounded-lg
                                        px-4
                                        py-3
                                    "
                                />

                            </div>


                            {/* TO */}

                            <div>

                                <label className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mb-2
                                ">
                                    To Date
                                </label>


                                <input
                                    type="date"
                                    value={to}
                                    onChange={(e) =>
                                        setTo(
                                            e.target.value
                                        )
                                    }
                                    className="
                                        w-full
                                        border
                                        border-gray-300
                                        rounded-lg
                                        px-4
                                        py-3
                                    "
                                />

                            </div>


                            {/* STATUS */}

                            {(reportType ===
                                "appointments" ||
                                reportType ===
                                "passes") && (

                                <div>

                                    <label className="
                                        block
                                        text-sm
                                        font-medium
                                        text-gray-700
                                        mb-2
                                    ">
                                        Status
                                    </label>


                                    <select
                                        value={status}
                                        onChange={(e) =>
                                            setStatus(
                                                e.target.value
                                            )
                                        }
                                        className="
                                            w-full
                                            border
                                            border-gray-300
                                            rounded-lg
                                            px-4
                                            py-3
                                        "
                                    >

                                        <option value="All">
                                            All
                                        </option>


                                        {reportType ===
                                            "appointments" && (
                                            <>
                                                <option value="Pending">
                                                    Pending
                                                </option>

                                                <option value="Approved">
                                                    Approved
                                                </option>

                                                <option value="Rejected">
                                                    Rejected
                                                </option>
                                            </>
                                        )}


                                        {reportType ===
                                            "passes" && (
                                            <>
                                                <option value="Active">
                                                    Active
                                                </option>

                                                <option value="Used">
                                                    Used
                                                </option>

                                                <option value="Expired">
                                                    Expired
                                                </option>

                                                <option value="Cancelled">
                                                    Cancelled
                                                </option>
                                            </>
                                        )}

                                    </select>

                                </div>

                            )}

                        </div>

                    </div>


                    {/* EXPORT */}

                    <div className="
                        bg-white
                        rounded-xl
                        shadow
                        p-6
                    ">

                        <h2 className="
                            text-lg
                            font-semibold
                            text-gray-800
                            mb-5
                        ">

                            Export Report

                        </h2>


                        <div className="
                            flex
                            flex-wrap
                            gap-4
                        ">


                            {/* EXCEL */}

                            <button
                                type="button"
                                onClick={() =>
                                    handleExport(
                                        "excel"
                                    )
                                }
                                disabled={exporting}
                                className="
                                    bg-green-600
                                    hover:bg-green-700
                                    disabled:bg-green-300
                                    text-white
                                    px-6
                                    py-3
                                    rounded-lg
                                    font-semibold
                                "
                            >

                                {exporting
                                    ? "Exporting..."
                                    : "Export Excel"
                                }

                            </button>


                            {/* CSV */}

                            <button
                                type="button"
                                onClick={() =>
                                    handleExport(
                                        "csv"
                                    )
                                }
                                disabled={exporting}
                                className="
                                    bg-blue-600
                                    hover:bg-blue-700
                                    disabled:bg-blue-300
                                    text-white
                                    px-6
                                    py-3
                                    rounded-lg
                                    font-semibold
                                "
                            >

                                Export CSV

                            </button>


                            {/* PDF */}

                            <button
                                type="button"
                                onClick={() =>
                                    handleExport(
                                        "pdf"
                                    )
                                }
                                disabled={exporting}
                                className="
                                    bg-red-600
                                    hover:bg-red-700
                                    disabled:bg-red-300
                                    text-white
                                    px-6
                                    py-3
                                    rounded-lg
                                    font-semibold
                                "
                            >

                                Export PDF

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );

};


export default Reports;