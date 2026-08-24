const Button = ({
    children,
    type = "button",
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    onClick,
    className = "",
}) => {

    const variants = {

        primary:
            "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",

        secondary:
            "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-400",

        danger:
            "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",

        success:
            "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",

        outline:
            "border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-blue-500",

        ghost:
            "text-slate-600 hover:bg-slate-100 focus:ring-slate-400",
    };


    const sizes = {

        sm:
            "px-3 py-1.5 text-sm",

        md:
            "px-4 py-2.5 text-sm",

        lg:
            "px-5 py-3 text-base",
    };


    return (

        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-lg
                font-medium
                transition
                duration-200
                focus:outline-none
                focus:ring-2
                focus:ring-offset-2
                disabled:cursor-not-allowed
                disabled:opacity-60
                ${variants[variant]}
                ${sizes[size]}
                ${className}
            `}
        >

            {loading && (

                <span
                    className="
                        h-4
                        w-4
                        rounded-full
                        border-2
                        border-white
                        border-t-transparent
                        animate-spin
                    "
                />

            )}

            {children}

        </button>

    );

};


export default Button;