import {
    useEffect,
    useState
} from "react";

import { toast } from "react-toastify";

import {
    getVisitorsInside
} from "../../services/checkLogService";

import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const CurrentVisitors = () => {

    const [visitors, setVisitors] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


    const loadVisitors = async () => {

        try {

            setLoading(true);

            const response =
                await getVisitorsInside();

            setVisitors(
                response.data || []
            );

        } catch (error) {

            console.error(error);

            toast.error(
                "Failed to load visitors"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadVisitors();


        const interval =
            setInterval(
                loadVisitors,
                30000
            );


        return () => {

            clearInterval(
                interval
            );

        };

    }, []);


    return (

        <DashboardLayout>
            {loading ? (
                <LoadingSpinner>

                </LoadingSpinner>
            ) : (
                <div className="min-h-screen bg-gray-100 p-6">

                    <div className="max-w-7xl mx-auto">

                        <div className="flex justify-between mb-6">

                            <div>

                                <h1 className="text-3xl font-bold">
                                    Current Visitors
                                </h1>

                                <p className="text-gray-600">
                                    Visitors currently inside the premises
                                </p>

                            </div>


                            <button
                                onClick={loadVisitors}
                                className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                            >
                                Refresh
                            </button>

                        </div>


                        <div className="bg-white rounded-xl shadow overflow-hidden">

                            {loading ? (

                                <LoadingSpinner>

                                </LoadingSpinner>

                            ) : visitors.length === 0 ? (

                                <div className="p-8 text-center text-gray-500">
                                    No visitors currently inside.
                                </div>

                            ) : (

                                <div className="overflow-x-auto">

                                    <table className="w-full">

                                        <thead className="bg-gray-50">

                                            <tr>

                                                <th className="text-left p-4">
                                                    Visitor
                                                </th>

                                                <th className="text-left p-4">
                                                    Phone
                                                </th>

                                                <th className="text-left p-4">
                                                    Company
                                                </th>

                                                <th className="text-left p-4">
                                                    Check-In
                                                </th>

                                                <th className="text-left p-4">
                                                    Status
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {visitors.map(
                                                (log) => (

                                                    <tr
                                                        key={log._id}
                                                        className="border-t"
                                                    >

                                                        <td className="p-4">

                                                            {
                                                                log.visitor
                                                                    ?.fullName
                                                            }

                                                        </td>


                                                        <td className="p-4">

                                                            {
                                                                log.visitor
                                                                    ?.phone
                                                            }

                                                        </td>


                                                        <td className="p-4">

                                                            {
                                                                log.visitor
                                                                    ?.company
                                                            }

                                                        </td>


                                                        <td className="p-4">

                                                            {
                                                                log.checkInTime
                                                                    ? new Date(
                                                                        log.checkInTime
                                                                    ).toLocaleString()
                                                                    : "-"
                                                            }

                                                        </td>


                                                        <td className="p-4">

                                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">

                                                                Inside

                                                            </span>

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


export default CurrentVisitors;