const LoadingSpinner = ({
    text = "Loading..."
}) => {

    return (

        <div
            className="
                h-100
                flex
                flex-col
                items-center
                justify-center
                gap-3
            "
        >

            <div
                className="
                    w-10
                        h-10
                        border-4
                        border-gray-300
                        border-t-blue-600
                        rounded-full
                        animate-spin
                        mx-auto
                "
            />

            <p
                className="
                    text-sm
                    text-slate-500
                "
            >
                {text}
            </p>

        </div>

    );

};


export default LoadingSpinner;