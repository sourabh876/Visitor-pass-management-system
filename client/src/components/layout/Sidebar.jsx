import {
    NavLink
} from "react-router-dom";

import {
    useAuth
} from "../../context/AuthContext";


const Sidebar = ({
    mobileOpen = false,
    onClose
}) => {

    const {
        user,
        logout
    } = useAuth();


    const role = user?.role;


    const navigation = {

        admin: [

            {
                label: "Dashboard",
                path: "/admin",
                icon: "⌂",
                end : true
            },

            {
                label: "Users",
                path: "/admin/users",
                icon: "♙",
                end : true
            },

            {
                label: "Visitors",
                path: "/admin/visitors",
                icon: "♟",
                end : true
            },

            {
                label: "Appointments",
                path: "/admin/appointments",
                icon: "▣",
                end : true
            },

            {
                label: "Passes",
                path: "/admin/passes",
                icon: "▤",
                end : true
            },

            {
                label: "Reports",
                path: "/admin/reports",
                icon: "◫",
                end : true
            },
            {
                label: "Export",
                path: "/admin/reports-export",
                icon: "♢",
                end : true
            }

        ],


        employee: [

            {
                label: "Dashboard",
                path: "/employee",
                icon: "⌂",
                end : true
            },

            {
                label: "Appointments",
                path: "/employee/appointments",
                icon: "▣",
                end : true
            },

            {
                label: "Passes",
                path: "/employee/passes",
                icon: "▤",
                end : true
            }

        ],


        visitor: [

            {
                label: "Dashboard",
                path: "/visitor",
                icon: "⌂",
                end : true
            },

            {
                label: "My Profile",
                path: "/visitor/profile",
                icon: "♙",
                end : true
            },

            {
                label: "Book Appointment",
                path: "/visitor/appointments/book",
                icon: "+",
                end : true
            },

            {
                label: "My Appointments",
                path: "/visitor/appointments",
                icon: "▣",
                end : true
            },

            {
                label: "My Pass",
                path: "/visitor/my-passes",
                icon: "▤",
                end : true
            }

        ],


        security: [

            {
                label: "Dashboard",
                path: "/security",
                icon: "⌂",
                end : true
            },

            {
                label: "Scan Pass",
                path: "/security/scan",
                icon: "▣",
                end : true
            },

            {
                label: "Current Visitors",
                path: "/security/current-visitors",
                icon: "♟",               
                end : true
            },
            {
                label: "Checklogs",
                path: "/security/check-logs",
                icon: "◫",              
                end : true
            }

        ]

    };


    const links =
        navigation[role] || [];


    return (

        <>

            {/* MOBILE OVERLAY */}

            {mobileOpen && (

                <div
                    className="fixed inset-0 bg-slate-950/50 z-40 lg:hidden"
                    onClick={onClose}
                />

            )}


            {/* SIDEBAR */}

            <aside
                className={`
                    fixed
                    inset-y-0
                    left-0
                    z-50
                    w-64
                    bg-slate-950
                    text-white
                    transform
                    transition-transform
                    duration-300
                    lg:translate-x-0
                    ${mobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }
                `}
            >

                {/* BRAND */}

                <div className="h-20 px-6 flex items-center border-b border-white/10">

                    <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">

                            <span className="text-xl">
                                V
                            </span>

                        </div>


                        <div>

                            <h1 className="font-bold text-lg tracking-tight">
                                VisitorPass
                            </h1>

                            <p className="text-[11px] text-slate-400">
                                Management System
                            </p>

                        </div>

                    </div>

                </div>


                {/* USER */}

                {/* <div className="px-4 pt-5">

                    <div className="rounded-xl bg-white/5 border border-white/10 p-3">

                        <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-semibold">

                                {user?.name
                                    ?.charAt(0)
                                    ?.toUpperCase()
                                }

                            </div>


                            <div className="min-w-0">

                                <p className="text-sm font-semibold truncate">

                                    {user?.name || "User"}

                                </p>


                                <p className="text-xs text-slate-400 capitalize">

                                    {role}

                                </p>

                            </div>

                        </div>

                    </div>

                </div> */}


                {/* NAVIGATION */}

                <nav className="px-4 py-6 space-y-1 overflow-y-auto h-[calc(100vh-230px)]">

                    <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">

                        Main Menu

                    </p>


                    {links.map((item) => (

                        <NavLink
                            key={item.path + item.label}
                            to={item.path}
                            end={item.end}
                            onClick={onClose}
                            className={({ isActive }) => `

                                group
                                flex
                                items-center
                                gap-3
                                px-3
                                py-3
                                rounded-xl
                                text-sm
                                font-medium
                                transition-all

                                ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-400 hover:bg-white/5 hover:text-white"
                                }

                            `}
                        >

                            <span className="w-5 text-center text-base">

                                {item.icon}

                            </span>


                            <span>
                                {item.label}
                            </span>

                        </NavLink>

                    ))}

                </nav>


                {/* LOGOUT */}

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">

                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition"
                    >

                        <span>
                            ⇥
                        </span>

                        Logout

                    </button>

                </div>

            </aside>

        </>

    );

};


export default Sidebar;