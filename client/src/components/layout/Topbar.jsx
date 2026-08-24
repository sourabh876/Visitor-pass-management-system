import {
    useState
} from "react";

import {
    useAuth
} from "../../context/AuthContext";



const Topbar = ({
    onMenuClick
}) => {

    const {
        user
    } = useAuth();


    const [showProfile, setShowProfile] =
        useState(false);




    return (

        <header
            className="
                h-20
                bg-white
                border-b
                border-slate-200
                flex
                items-center
                justify-between
                px-4
                sm:px-6
                lg:px-8
                sticky
                top-0
                z-30
            "
        >

            {/* LEFT */}


            {user?.role === "visitor" ?
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">

                        {user?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "V"
                        }
                    </div>

                    <div>

                        <p
                            className="
                            text-xs
                            text-slate-400
                        "
                        >
                            Welcome back
                        </p>


                        <h2
                            className="
                            text-base
                            sm:text-lg
                            font-semibold
                            text-slate-900
                        "
                        >
                            {user?.name || "User"}
                        </h2>

                    </div>
                </div>

                : (

                    <div className="flex items-center gap-4">

                        <button
                            onClick={onMenuClick}
                            className="
                        lg:hidden
                        h-10
                        w-10
                        rounded-lg
                        border
                        border-slate-200
                        flex
                        items-center
                        justify-center
                        text-slate-600
                        hover:bg-slate-50
                    "
                        >
                            ☰
                        </button>


                        <div>

                            <p
                                className="
                            text-xs
                            text-slate-400
                        "
                            >
                                Welcome back
                            </p>


                            <h2
                                className="
                            text-base
                            sm:text-lg
                            font-semibold
                            text-slate-900
                        "
                            >
                                {user?.name || "User"}
                            </h2>

                        </div>

                    </div>

                )}





            {/* RIGHT */}

            <div
                className="
                    flex
                    items-center
                    gap-3
                    relative
                "
            >

                {/* Notification */}

                <button
                    className="
                        hidden
                        sm:flex
                        h-10
                        w-10
                        rounded-lg
                        border
                        border-slate-200
                        items-center
                        justify-center
                        text-slate-500
                        hover:bg-slate-50
                    "
                >
                    ♢
                </button>


                {/* PROFILE */}

                <button
                    onClick={() =>
                        setShowProfile(
                            !showProfile
                        )
                    }
                    className="
                        flex
                        items-center
                        gap-2
                        rounded-lg
                        p-1.5
                        hover:bg-slate-50
                    "
                >

                    <div
                        className="
                            h-9
                            w-9
                            rounded-lg
                            bg-blue-600
                            text-white
                            flex
                            items-center
                            justify-center
                            font-semibold
                        "
                    >

                        {user?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "U"
                        }

                    </div>


                    <div
                        className="
                            hidden
                            md:block
                            text-left
                        "
                    >

                        <p
                            className="
                                text-sm
                                font-medium
                                text-slate-800
                            "
                        >
                            {user?.name}
                        </p>


                        <p
                            className="
                                text-xs
                                text-slate-400
                                capitalize
                            "
                        >
                            {user?.role}
                        </p>

                    </div>

                    <span
                        className="
                            hidden
                            md:block
                            text-slate-400
                        "
                    >
                        ▾
                    </span>

                </button>


                {/* DROPDOWN */}

                {showProfile && (

                    <div
                        className="
                            absolute
                            right-0
                            top-14
                            w-56
                            bg-white
                            border
                            border-slate-200
                            rounded-xl
                            shadow-xl
                            p-2
                            z-50
                        "
                    >

                        <div
                            className="
                                px-3
                                py-3
                                border-b
                                border-slate-100
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-slate-800
                                "
                            >
                                {user?.name}
                            </p>


                            <p
                                className="
                                    text-xs
                                    text-slate-500
                                    mt-1
                                "
                            >
                                {user?.email}
                            </p>

                        </div>

                    </div>

                )}

            </div>

        </header>

    );

};


export default Topbar;