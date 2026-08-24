const EmptyState = ({
    title = "No data found",
    message = "There is nothing to display here.",
    action = null,
}) => {

    return (

        <div
            className="
                py-16
                flex
                flex-col
                items-center
                justify-center
                text-center
            "
        >

            <div
                className="
                    h-14
                    w-14
                    rounded-full
                    bg-slate-100
                    flex
                    items-center
                    justify-center
                    text-slate-400
                    text-xl
                    mb-4
                "
            >
                —
            </div>


            <h3
                className="
                    text-base
                    font-semibold
                    text-slate-800
                "
            >
                {title}
            </h3>


            <p
                className="
                    text-sm
                    text-slate-500
                    mt-1
                    max-w-sm
                "
            >
                {message}
            </p>


            {action && (

                <div className="mt-5">

                    {action}

                </div>

            )}

        </div>

    );

};


export default EmptyState;