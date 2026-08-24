import {
    useEffect,
    useState
} from "react";

import {
    getPasses
} from "../../services/passService";

import {
    getCheckLogs,
    getVisitorsInside
} from "../../services/checkLogService";

import {
    exportCheckLogs
} from "../../services/reportService";

import DashboardLayout
    from "../../components/layout/DashboardLayout";

import LoadingSpinner
    from "../../components/ui/LoadingSpinner";


const CheckLogs = () => {


    // ===
    // DATA
    // ===

    const [
        passes,
        setPasses
    ] = useState([]);


    const [
        checkLogs,
        setCheckLogs
    ] = useState([]);


    const [
        visitorsInside,
        setVisitorsInside
    ] = useState([]);


    // ===
    // STATES
    // ===

    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        refreshing,
        setRefreshing
    ] = useState(false);


    const [
        exporting,
        setExporting
    ] = useState(false);


    const [
        showExportMenu,
        setShowExportMenu
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    // ===
    // LOAD REPORT DATA
    // ===

    const loadReports = async (
        showMainLoader = true
    ) => {

        try {

            if (showMainLoader) {

                setLoading(true);

            } else {

                setRefreshing(true);

            }


            setError("");


            const [
                passesResponse,
                checkLogsResponse,
                insideResponse
            ] = await Promise.all([

                getPasses(),

                getCheckLogs(),

                getVisitorsInside()

            ]);


            setPasses(
                passesResponse?.data || []
            );


            setCheckLogs(
                checkLogsResponse?.data || []
            );


            setVisitorsInside(
                insideResponse?.data || []
            );


        } catch (error) {

            console.error(
                "Checklogs reports error:",
                error
            );


            setError(
                error?.response?.data?.message ||
                "Failed to load Checklogs reports."
            );


        } finally {

            setLoading(false);

            setRefreshing(false);

        }

    };


    // ===
    // INITIAL LOAD
    // ===

    useEffect(() => {

        loadReports();

    }, []);


    // ===
    // REFRESH
    // ===

    const handleRefresh = async () => {

        await loadReports(false);

    };


    // ===
    // EXPORT REPORT
    // ===

    const handleExport = async (
        format
    ) => {

        try {

            setExporting(true);

            setShowExportMenu(false);


            const blob =
                await exportCheckLogs({

                    format

                });


            const downloadUrl =
                window.URL.createObjectURL(
                    new Blob([
                        blob
                    ])
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                downloadUrl;


            link.download =
                `checklogs-report.${
                    format === "excel"
                        ? "xlsx"
                        : format
                }`;


            document.body.appendChild(
                link
            );


            link.click();


            link.remove();


            window.URL.revokeObjectURL(
                downloadUrl
            );


        } catch (error) {

            console.error(
                "Checklogs export error:",
                error
            );


            setError(
                error?.response?.data?.message ||
                "Failed to export report."
            );

        } finally {

            setExporting(false);

        }

    };


    // ===
    // PASS STATISTICS
    // ===

    const totalPasses =
        passes.length;


    const activePasses =
        passes.filter(
            (pass) =>
                pass.status ===
                "Active"
        ).length;


    const usedPasses =
        passes.filter(
            (pass) =>
                pass.status ===
                "Used"
        ).length;


    const cancelledPasses =
        passes.filter(
            (pass) =>
                pass.status ===
                "Cancelled"
        ).length;


    const expiredPasses =
        passes.filter(
            (pass) =>
                pass.status ===
                "Expired"
        ).length;


    // ===
    // CHECK-IN / CHECK-OUT STATISTICS
    // ===

    const totalCheckLogs =
        checkLogs.length;


    const totalCheckIns =
        checkLogs.filter(
            (log) =>
                log.checkInTime
        ).length;


    const totalCheckOuts =
        checkLogs.filter(
            (log) =>
                log.checkOutTime
        ).length;


    const currentlyInside =
        visitorsInside.length;


    // ===
    // FORMAT DATE
    // ===

    const formatDateTime = (
        date
    ) => {

        if (!date) {

            return "-";

        }


        return new Date(
            date
        ).toLocaleString(
            "en-IN",
            {
                dateStyle:
                    "medium",

                timeStyle:
                    "short"
            }
        );

    };


    // ===
    // VISITOR NAME
    // ===

    const getVisitorName = (
        log
    ) => {

        if (
            log?.visitor?.fullName
        ) {

            return log.visitor.fullName;

        }


        if (
            log?.visitor?.name
        ) {

            return log.visitor.name;

        }


        return "Unknown visitor";

    };


    // ===
    // PASS NUMBER
    // ===

    const getPassNumber = (
        log
    ) => {

        if (
            log?.pass?.passNumber
        ) {

            return log.pass.passNumber;

        }


        return "-";

    };


    // ===
    // LOADING
    // ===

    if (loading) {

        return (

            <DashboardLayout>

                <LoadingSpinner />

            </DashboardLayout>

        );

    }


    return (

        <DashboardLayout>

            <div className="min-h-screen bg-gray-100 p-6">

                <div className="max-w-7xl mx-auto">


                    {/* 
                        ERROR
                     */}

                    {error && (

                        <div className="
                            mb-6
                            bg-red-100
                            border
                            border-red-200
                            text-red-700
                            px-4
                            py-3
                            rounded-lg
                        ">

                            {error}

                        </div>

                    )}


                    {/* 
                        HEADER
                     */}

                    <div className="
                        bg-white
                        rounded-xl
                        shadow
                        mb-6
                    ">

                        <div className="
                            p-6
                            flex
                            flex-col
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            gap-4
                            border-b
                        ">


                            {/* TITLE */}

                            <div>

                                <h2 className="
                                    text-xl
                                    font-semibold
                                    text-gray-800
                                ">

                                    Visitor Activity History

                                </h2>


                                <p className="
                                    text-sm
                                    text-gray-500
                                    mt-1
                                ">

                                    Recent check-in and
                                    check-out activity.

                                </p>

                            </div>


                            {/* ACTIONS */}

                            <div className="
                                flex
                                items-center
                                gap-3
                            ">


                                {/* REFRESH */}

                                <button
                                    type="button"
                                    onClick={
                                        handleRefresh
                                    }
                                    disabled={
                                        refreshing ||
                                        exporting
                                    }
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        bg-gray-100
                                        hover:bg-gray-200
                                        disabled:bg-gray-100
                                        disabled:text-gray-400
                                        text-gray-700
                                        px-4
                                        py-2.5
                                        rounded-lg
                                        font-medium
                                        transition
                                    "
                                >

                                    <span
                                        className={
                                            refreshing
                                                ? "animate-spin"
                                                : ""
                                        }
                                    >
                                        ↻
                                    </span>


                                    {refreshing
                                        ? "Refreshing..."
                                        : "Refresh"
                                    }

                                </button>


                                {/* EXPORT WRAPPER */}

                                <div className="
                                    relative
                                ">


                                    {/* EXPORT BUTTON */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowExportMenu(
                                                (previous) =>
                                                    !previous
                                            )
                                        }
                                        disabled={
                                            exporting ||
                                            refreshing
                                        }
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            bg-blue-600
                                            hover:bg-blue-700
                                            disabled:bg-blue-300
                                            text-white
                                            px-4
                                            py-2.5
                                            rounded-lg
                                            font-medium
                                            transition
                                        "
                                    >

                                        <span>
                                            ⇩
                                        </span>


                                        {
                                            exporting
                                                ? "Exporting..."
                                                : "Export"
                                        }


                                        <span className="text-xs">
                                            ▾
                                        </span>

                                    </button>


                                    {/* EXPORT MENU */}

                                    {showExportMenu && (

                                        <div className="
                                            absolute
                                            right-0
                                            top-12
                                            w-48
                                            bg-white
                                            border
                                            border-gray-200
                                            rounded-xl
                                            shadow-xl
                                            p-2
                                            z-50
                                        ">


                                            {/* EXCEL */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleExport(
                                                        "excel"
                                                    )
                                                }
                                                className="
                                                    w-full
                                                    text-left
                                                    px-4
                                                    py-2.5
                                                    rounded-lg
                                                    text-sm
                                                    text-gray-700
                                                    hover:bg-gray-100
                                                "
                                            >

                                                Export Excel

                                            </button>


                                            {/* CSV */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleExport(
                                                        "csv"
                                                    )
                                                }
                                                className="
                                                    w-full
                                                    text-left
                                                    px-4
                                                    py-2.5
                                                    rounded-lg
                                                    text-sm
                                                    text-gray-700
                                                    hover:bg-gray-100
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
                                                className="
                                                    w-full
                                                    text-left
                                                    px-4
                                                    py-2.5
                                                    rounded-lg
                                                    text-sm
                                                    text-gray-700
                                                    hover:bg-gray-100
                                                "
                                            >

                                                Export PDF

                                            </button>

                                        </div>

                                    )}

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* 
                        STATISTICS
                     */}

                    <div className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-4
                        gap-5
                        mb-6
                    ">


                        {/* TOTAL PASSES */}

                        <div className="
                            bg-white
                            rounded-xl
                            shadow
                            p-5
                        ">

                            <p className="
                                text-sm
                                text-gray-500
                            ">

                                Total Passes

                            </p>


                            <p className="
                                text-3xl
                                font-bold
                                text-gray-800
                                mt-2
                            ">

                                {totalPasses}

                            </p>

                        </div>


                        {/* ACTIVE */}

                        <div className="
                            bg-white
                            rounded-xl
                            shadow
                            p-5
                        ">

                            <p className="
                                text-sm
                                text-gray-500
                            ">

                                Active Passes

                            </p>


                            <p className="
                                text-3xl
                                font-bold
                                text-green-600
                                mt-2
                            ">

                                {activePasses}

                            </p>

                        </div>


                        {/* CHECK INS */}

                        <div className="
                            bg-white
                            rounded-xl
                            shadow
                            p-5
                        ">

                            <p className="
                                text-sm
                                text-gray-500
                            ">

                                Check-Ins

                            </p>


                            <p className="
                                text-3xl
                                font-bold
                                text-blue-600
                                mt-2
                            ">

                                {totalCheckIns}

                            </p>

                        </div>


                        {/* INSIDE */}

                        <div className="
                            bg-white
                            rounded-xl
                            shadow
                            p-5
                        ">

                            <p className="
                                text-sm
                                text-gray-500
                            ">

                                Currently Inside

                            </p>


                            <p className="
                                text-3xl
                                font-bold
                                text-purple-600
                                mt-2
                            ">

                                {currentlyInside}

                            </p>

                        </div>

                    </div>


                    {/* 
                        ACTIVITY TABLE
                     */}

                    <div className="bg-white rounded-xl shadow">

                        {checkLogs.length === 0 ? (

                            <div className="
                                p-8
                                text-center
                                text-gray-500
                            ">

                                No visitor activity found.

                            </div>

                        ) : (

                            <div className="overflow-x-auto">

                                <table className="w-full">

                                    <thead className="bg-gray-50">

                                        <tr>

                                            <th className="
                                                text-left
                                                px-6
                                                py-3
                                                text-sm
                                                font-semibold
                                                text-gray-600
                                            ">

                                                Visitor

                                            </th>


                                            <th className="
                                                text-left
                                                px-6
                                                py-3
                                                text-sm
                                                font-semibold
                                                text-gray-600
                                            ">

                                                Pass Number

                                            </th>


                                            <th className="
                                                text-left
                                                px-6
                                                py-3
                                                text-sm
                                                font-semibold
                                                text-gray-600
                                            ">

                                                Check-In

                                            </th>


                                            <th className="
                                                text-left
                                                px-6
                                                py-3
                                                text-sm
                                                font-semibold
                                                text-gray-600
                                            ">

                                                Check-Out

                                            </th>


                                            <th className="
                                                text-left
                                                px-6
                                                py-3
                                                text-sm
                                                font-semibold
                                                text-gray-600
                                            ">

                                                Status

                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {checkLogs.map(
                                            (log) => (

                                                <tr
                                                    key={
                                                        log._id
                                                    }
                                                    className="
                                                        border-t
                                                        hover:bg-gray-50
                                                    "
                                                >


                                                    {/* VISITOR */}

                                                    <td className="
                                                        px-6
                                                        py-4
                                                    ">

                                                        <p className="
                                                            font-medium
                                                            text-gray-800
                                                        ">

                                                            {
                                                                getVisitorName(
                                                                    log
                                                                )
                                                            }

                                                        </p>


                                                        {log.visitor?.phone && (

                                                            <p className="
                                                                text-sm
                                                                text-gray-500
                                                            ">

                                                                {
                                                                    log.visitor.phone
                                                                }

                                                            </p>

                                                        )}

                                                    </td>


                                                    {/* PASS */}

                                                    <td className="
                                                        px-6
                                                        py-4
                                                        text-sm
                                                    ">

                                                        {
                                                            getPassNumber(
                                                                log
                                                            )
                                                        }

                                                    </td>


                                                    {/* CHECK IN */}

                                                    <td className="
                                                        px-6
                                                        py-4
                                                        text-sm
                                                    ">

                                                        {
                                                            formatDateTime(
                                                                log.checkInTime
                                                            )
                                                        }

                                                    </td>


                                                    {/* CHECK OUT */}

                                                    <td className="
                                                        px-6
                                                        py-4
                                                        text-sm
                                                    ">

                                                        {
                                                            formatDateTime(
                                                                log.checkOutTime
                                                            )
                                                        }

                                                    </td>


                                                    {/* STATUS */}

                                                    <td className="
                                                        px-6
                                                        py-4
                                                    ">

                                                        {
                                                            log.status ===
                                                            "Inside"
                                                                ? (

                                                                    <span className="
                                                                        px-3
                                                                        py-1
                                                                        rounded-full
                                                                        bg-green-100
                                                                        text-green-700
                                                                        text-xs
                                                                        font-semibold
                                                                    ">

                                                                        Inside

                                                                    </span>

                                                                )
                                                                : (

                                                                    <span className="
                                                                        px-3
                                                                        py-1
                                                                        rounded-full
                                                                        bg-gray-100
                                                                        text-gray-700
                                                                        text-xs
                                                                        font-semibold
                                                                    ">

                                                                        Checked-Out

                                                                    </span>

                                                                )
                                                        }

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

        </DashboardLayout>

    );

};


export default CheckLogs;