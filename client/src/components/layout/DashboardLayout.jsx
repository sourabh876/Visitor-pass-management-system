import { useState } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";



const DashboardLayout = ({
    children,
    title,
    subtitle
}) => {

    const [sidebarOpen, setSidebarOpen] =
        useState(false);


    return (

        <div className="min-h-screen bg-slate-50">

            {/* SIDEBAR */}

            <Sidebar
                mobileOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />


            {/* MAIN AREA */}

            <div className="lg:ml-64 min-h-screen">

                <Topbar
                    title={title}
                    subtitle={subtitle}
                    onMenuClick={() =>
                        setSidebarOpen(true)
                    }
                />


                <main className="p-4 sm:p-6 lg:p-8">

                    <div className="max-w-[1600px] mx-auto">

                        {children}

                    </div>

                </main>

            </div>

        </div>

    );

};


export default DashboardLayout;