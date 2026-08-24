const Card = ({
    children,
    title,
    subtitle,
    action,
    className = "",
}) => {

    return (

        <div
            className={`
                bg-white
                border
                border-slate-200
                rounded-2xl
                shadow-sm
                ${className}
            `}
        >

            {(title || subtitle || action) && (

                <div
                    className="
                        px-6
                        py-5
                        border-b
                        border-slate-100
                        flex
                        items-center
                        justify-between
                        gap-4
                    "
                >

                    <div>

                        {title && (

                            <h2
                                className="
                                    text-lg
                                    font-semibold
                                    text-slate-900
                                "
                            >
                                {title}
                            </h2>

                        )}

                        {subtitle && (

                            <p
                                className="
                                    text-sm
                                    text-slate-500
                                    mt-1
                                "
                            >
                                {subtitle}
                            </p>

                        )}

                    </div>


                    {action && (

                        <div>

                            {action}

                        </div>

                    )}

                </div>

            )}


            <div className="p-6">

                {children}

            </div>

        </div>

    );

};


export default Card;