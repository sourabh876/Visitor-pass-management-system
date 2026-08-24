import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    getVisitors,
    deleteVisitor
} from "../../services/visitorApi";

import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/ui/LoadingSpinner";


const AdminVisitors = () => {

    //   
    // STATE
    //   

    const [
        visitors,
        setVisitors
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        deletingId,
        setDeletingId
    ] = useState(null);


    const [
        search,
        setSearch
    ] = useState("");


    const [
        error,
        setError
    ] = useState("");


    const [
        success,
        setSuccess
    ] = useState("");


    //   
    // LOAD VISITORS
    //   

    const loadVisitors = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await getVisitors();


            setVisitors(
                response.data || []
            );


        } catch (error) {

            console.error(
                "Failed to load visitors:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Unable to load visitors."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadVisitors();

    }, []);


    //   
    // SEARCH
    //   

    const filteredVisitors =
        useMemo(() => {

            const searchValue =
                search
                    .trim()
                    .toLowerCase();


            if (!searchValue) {

                return visitors;

            }


            return visitors.filter(
                (visitor) => {

                    return (

                        visitor.fullName
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            )

                        ||

                        visitor.email
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            )

                        ||

                        visitor.phone
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            )

                        ||

                        visitor.company
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            )

                    );

                }
            );

        }, [
            visitors,
            search
        ]);


    //   
    // DELETE VISITOR
    //   

    const handleDelete = async (
        visitor
    ) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete ${visitor.fullName}?`
            );


        if (!confirmed) {

            return;

        }


        try {

            setDeletingId(
                visitor._id
            );

            setError("");

            setSuccess("");


            await deleteVisitor(
                visitor._id
            );

            setVisitors(
                (previousVisitors) =>
                    previousVisitors.filter(
                        (item) =>
                            item._id !==
                            visitor._id
                    )
            );


            setSuccess(
                "Visitor deleted successfully."
            );


        } catch (error) {

            console.error(
                "Delete visitor error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Unable to delete visitor."
            );

        } finally {

            setDeletingId(
                null
            );

        }

    };



    return (

        <DashboardLayout>
            {loading ? (

                <LoadingSpinner>
                    {/* <div className="min-h-screen bg-gray-100 flex items-center justify-center">

                        <p className="text-gray-600">

                            Loading visitors...

                        </p>

                    </div> */}
                </LoadingSpinner>

            ) : (

                <div className="min-h-screen bg-gray-100 p-6">

                    <div className="max-w-7xl mx-auto">


                        {/*   
                    HEADER
                   */}

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                            <div>

                                <h1 className="text-3xl font-bold text-gray-800">

                                    Visitor Management

                                </h1>


                                <p className="text-gray-600 mt-1">

                                    View and manage registered visitors.

                                </p>

                            </div>


                            <Link
                                to="/admin"
                                className="
                            text-blue-600
                            hover:text-blue-800
                            font-medium
                        "
                            >

                                ← Admin Dashboard

                            </Link>

                        </div>


                        {/*   
                    ALERTS
                   */}

                        {error && (

                            <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg px-5 py-4 mb-5">

                                {error}

                            </div>

                        )}


                        {success && (

                            <div className="bg-green-100 border border-green-300 text-green-700 rounded-lg px-5 py-4 mb-5">

                                {success}

                            </div>

                        )}


                        {/*   
                    SEARCH + SUMMARY
                   */}

                        <div className="bg-white rounded-xl shadow p-5 mb-6">

                            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">


                                <div className="flex-1">

                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Search by name, email, phone or company..."
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


                                <div className="text-gray-600">

                                    Showing{" "}

                                    <span className="font-semibold">

                                        {filteredVisitors.length}

                                    </span>

                                    {" "}of{" "}

                                    <span className="font-semibold">

                                        {visitors.length}

                                    </span>

                                    {" "}visitors

                                </div>

                            </div>

                        </div>


                        {/*   
                    VISITOR TABLE
                   */}

                        <div className="bg-white rounded-xl shadow overflow-hidden">

                            {filteredVisitors.length === 0 ? (

                                <div className="p-10 text-center">

                                    <p className="text-gray-500">

                                        No visitors found.

                                    </p>

                                </div>

                            ) : (

                                <div className="overflow-x-auto">

                                    <table className="w-full">

                                        <thead className="bg-gray-50 border-b">

                                            <tr>

                                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">

                                                    Visitor

                                                </th>


                                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">

                                                    Contact

                                                </th>


                                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">

                                                    Company

                                                </th>


                                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">

                                                    ID Proof

                                                </th>


                                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">

                                                    Created By

                                                </th>


                                                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">

                                                    Actions

                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody className="divide-y">

                                            {filteredVisitors.map(
                                                (visitor) => (

                                                    <tr
                                                        key={
                                                            visitor._id
                                                        }
                                                        className="hover:bg-gray-50"
                                                    >

                                                        {/* VISITOR */}

                                                        <td className="px-6 py-4">

                                                            <div className="font-medium text-gray-800">

                                                                {
                                                                    visitor.fullName
                                                                }

                                                            </div>


                                                            <div className="text-sm text-gray-500">

                                                                {
                                                                    visitor.email
                                                                }

                                                            </div>

                                                        </td>


                                                        {/* CONTACT */}

                                                        <td className="px-6 py-4">

                                                            <div className="text-gray-700">

                                                                {
                                                                    visitor.phone ||
                                                                    "N/A"
                                                                }

                                                            </div>


                                                            <div className="text-sm text-gray-500">

                                                                {
                                                                    visitor.address ||
                                                                    "No address"
                                                                }

                                                            </div>

                                                        </td>


                                                        {/* COMPANY */}

                                                        <td className="px-6 py-4 text-gray-700">

                                                            {
                                                                visitor.company ||
                                                                "N/A"
                                                            }

                                                        </td>


                                                        {/* ID PROOF */}

                                                        <td className="px-6 py-4">

                                                            <div className="text-gray-700">

                                                                {
                                                                    visitor.idProofType ||
                                                                    "N/A"
                                                                }

                                                            </div>


                                                            <div className="text-sm text-gray-500">

                                                                {
                                                                    visitor.idProofNumber ||
                                                                    "N/A"
                                                                }

                                                            </div>

                                                        </td>


                                                        {/* CREATED BY */}

                                                        <td className="px-6 py-4">

                                                            <div className="text-gray-700">

                                                                {
                                                                    visitor.createdBy
                                                                        ?.name ||
                                                                    "N/A"
                                                                }

                                                            </div>


                                                            <div className="text-sm text-gray-500">

                                                                {
                                                                    visitor.createdBy
                                                                        ?.email ||
                                                                    ""
                                                                }

                                                            </div>

                                                        </td>


                                                        {/* ACTIONS */}

                                                        <td className="px-6 py-4">

                                                            <div className="flex justify-center gap-2">


                                                                <Link
                                                                    to={`/admin/visitors/${visitor._id}`}
                                                                    className="
                                                                bg-blue-100
                                                                text-blue-700
                                                                hover:bg-blue-200
                                                                px-3
                                                                py-2
                                                                rounded-lg
                                                                text-sm
                                                                font-medium
                                                            "
                                                                >

                                                                    View

                                                                </Link>


                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            visitor
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        deletingId ===
                                                                        visitor._id
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
                                                                font-medium
                                                            "
                                                                >

                                                                    {
                                                                        deletingId ===
                                                                            visitor._id
                                                                            ? "Deleting..."
                                                                            : "Delete"
                                                                    }

                                                                </button>

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


export default AdminVisitors;