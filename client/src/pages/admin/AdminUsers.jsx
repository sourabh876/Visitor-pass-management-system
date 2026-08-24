import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    getUsers,
    createUser
} from "../../services/userApi";

import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { toast } from "react-toastify";


const AdminUsers = () => {


    // USERS


    const [users, setUsers] =
        useState([]);



    // LOADING


    const [loading, setLoading] =
        useState(true);


    const [creating, setCreating] =
        useState(false);



    // ERROR / SUCCESS


    const [error, setError] =
        useState("");


    const [success, setSuccess] =
        useState("");



    // SEARCH / FILTER


    const [search, setSearch] =
        useState("");


    const [roleFilter, setRoleFilter] =
        useState("all");



    // CREATE USER FORM


    const [showCreateForm, setShowCreateForm] =
        useState(false);


    const [form, setForm] =
        useState({

            name: "",

            email: "",

            password: "",

            role: "employee",

            phone: "",

            department: ""

        });



    // LOAD USERS


    const loadUsers = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await getUsers();


            console.log(
                "Users:",
                response
            );


            setUsers(
                response?.data || []
            );


        } catch (error) {

            console.error(
                "Get users error:",
                error
            );


            toast.error(
                error?.response?.data?.message ||
                "Failed to load users."
            );


        } finally {

            setLoading(false);

        }

    };



    // INITIAL LOAD


    useEffect(() => {

        loadUsers();

    }, []);



    // FORM CHANGE


    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setForm(
            previous => ({

                ...previous,

                [name]: value

            })
        );


        setError("");

        setSuccess("");

    };



    // CREATE USER


    const handleCreateUser = async (event) => {

        event.preventDefault();


        setError("");

        setSuccess("");


        
        // BASIC VALIDATION
        

        if (!form.name.trim()) {

            setError(
                "Name is required."
            );

            return;

        }


        if (!form.email.trim()) {

            setError(
                "Email is required."
            );

            return;

        }


        if (!form.password) {

            setError(
                "Password is required."
            );

            return;

        }


        if (form.password.length < 6) {

            setError(
                "Password must be at least 6 characters."
            );

            return;

        }


        if (
            form.role === "employee" &&
            !form.department.trim()
        ) {

            setError(
                "Department is required for an employee."
            );

            return;

        }


        try {

            setCreating(true);


            const payload = {

                name:
                    form.name.trim(),

                email:
                    form.email.trim(),

                password:
                    form.password,

                role:
                    form.role,

                phone:
                    form.phone.trim(),

                department:
                    form.department.trim()

            };


            const response =
                await createUser(
                    payload
                );


            console.log(
                "Create user response:",
                response
            );


            toast.success(
                response?.message ||
                `${form.role} created successfully.`
            );


            
            // RESET FORM
            

            setForm({

                name: "",

                email: "",

                password: "",

                role: "employee",

                phone: "",

                department: ""

            });


            setShowCreateForm(false);


            
            // RELOAD USERS
            

            await loadUsers();


        } catch (error) {

            console.error(
                "Create user error:",
                error
            );


            toast.error(
                error?.response?.data?.message ||
                "Failed to create user."
            );


        } finally {

            setCreating(false);

        }

    };



    // FILTER USERS


    const filteredUsers =
        useMemo(() => {

            const searchText =
                search
                    .toLowerCase()
                    .trim();


            return users.filter(
                user => {

                    const matchesSearch =
                        !searchText ||

                        user.name
                            ?.toLowerCase()
                            .includes(
                                searchText
                            ) ||

                        user.email
                            ?.toLowerCase()
                            .includes(
                                searchText
                            ) ||

                        user.phone
                            ?.toLowerCase()
                            .includes(
                                searchText
                            ) ||

                        user.department
                            ?.toLowerCase()
                            .includes(
                                searchText
                            );


                    const matchesRole =
                        roleFilter === "all" ||

                        user.role ===
                        roleFilter;


                    return (
                        matchesSearch &&
                        matchesRole
                    );

                }
            );

        }, [
            users,
            search,
            roleFilter
        ]);



    // STATISTICS


    const totalUsers =
        users.length;


    const totalEmployees =
        users.filter(
            user =>
                user.role === "employee"
        ).length;


    const totalSecurity =
        users.filter(
            user =>
                user.role === "security"
        ).length;


    const totalVisitors =
        users.filter(
            user =>
                user.role === "visitor"
        ).length;


    const totalAdmins =
        users.filter(
            user =>
                user.role === "admin"
        ).length;


    return (

        <DashboardLayout>
            {loading ? (

                <LoadingSpinner>

                    {/* <div className="
                min-h-screen
                bg-gray-100
                flex
                items-center
                justify-center
            ">

                    <div className="text-center">

                        <div className="
                        w-10
                        h-10
                        border-4
                        border-gray-300
                        border-t-blue-600
                        rounded-full
                        animate-spin
                        mx-auto
                    " />

                        <p className="
                        mt-4
                        text-gray-600
                    ">

                            Loading users...

                        </p>

                    </div>

                </div> */}

                </LoadingSpinner>
                

            ) : (

                <div className="
            min-h-screen
            bg-gray-100
        ">


                    {/* 
                HEADER
            = */}

                    <header className="
                bg-white
                border-b
            ">

                        <div className="
                    max-w-7xl
                    mx-auto
                    px-6
                    py-6
                ">

                            <div className="
                        flex
                        flex-col
                        md:flex-row
                        md:items-center
                        md:justify-between
                        gap-4
                    ">

                                <div>

                                    <h1 className="
                                text-2xl
                                font-bold
                                text-gray-800
                            ">

                                        User Management

                                    </h1>


                                    <p className="
                                text-gray-500
                                mt-1
                            ">

                                        Manage employees and
                                        security users.

                                    </p>

                                </div>


                                <div className="
                            flex
                            gap-3
                        ">

                                    <button
                                        onClick={loadUsers}
                                        className="
                                    px-4
                                    py-2
                                    border
                                    border-gray-300
                                    rounded-lg
                                    bg-white
                                    text-gray-700
                                    hover:bg-gray-50
                                "
                                    >

                                        Refresh

                                    </button>


                                    <button
                                        onClick={() => {

                                            setShowCreateForm(
                                                previous =>
                                                    !previous
                                            );

                                            setError("");

                                            setSuccess("");

                                        }}
                                        className="
                                    px-4
                                    py-2
                                    bg-blue-600
                                    text-white
                                    rounded-lg
                                    hover:bg-blue-700
                                "
                                    >

                                        {showCreateForm
                                            ? "Close"
                                            : "Create User"
                                        }

                                    </button>

                                </div>

                            </div>

                        </div>

                    </header>


                    {/* 
                MAIN
            = */}

                    <main className="
                max-w-7xl
                mx-auto
                px-6
                py-8
            ">


                        {/* 
                    SUCCESS
                = */}

                        {success && (

                            <div className="
                        mb-6
                        bg-green-50
                        border
                        border-green-200
                        text-green-700
                        rounded-lg
                        p-4
                    ">

                                {success}

                            </div>

                        )}


                        {/* 
                    ERROR
                = */}

                        {error && (

                            <div className="
                        mb-6
                        bg-red-50
                        border
                        border-red-200
                        text-red-700
                        rounded-lg
                        p-4
                    ">

                                {error}

                            </div>

                        )}


                        {/* 
                    STATISTICS
                = */}

                        <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-5
                    gap-5
                    mb-8
                ">

                            <StatCard
                                title="Total Users"
                                value={totalUsers}
                            />


                            <StatCard
                                title="Employees"
                                value={totalEmployees}
                            />


                            <StatCard
                                title="Security"
                                value={totalSecurity}
                            />


                            <StatCard
                                title="Visitors"
                                value={totalVisitors}
                            />


                            <StatCard
                                title="Admins"
                                value={totalAdmins}
                            />

                        </div>


                        {/* 
                    CREATE USER FORM
                 */}

                        {showCreateForm && (

                            <section className="
                        bg-white
                        border
                        rounded-xl
                        p-6
                        mb-8
                    ">

                                <div className="mb-6">

                                    <h2 className="
                                text-xl
                                font-semibold
                                text-gray-800
                            ">

                                        Create Employee / Security User

                                    </h2>


                                    <p className="
                                text-sm
                                text-gray-500
                                mt-1
                            ">

                                        Only employee and security
                                        accounts can be created
                                        from this page.

                                    </p>

                                </div>


                                <form
                                    onSubmit={
                                        handleCreateUser
                                    }
                                >

                                    <div className="
                                grid
                                grid-cols-1
                                md:grid-cols-2
                                gap-5
                            ">


                                        {/* NAME */}

                                        <FormInput
                                            label="Name"
                                            name="name"
                                            value={form.name}
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter full name"
                                            required
                                        />


                                        {/* EMAIL */}

                                        <FormInput
                                            label="Email"
                                            name="email"
                                            type="email"
                                            value={form.email}
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter email"
                                            required
                                        />


                                        {/* PASSWORD */}

                                        <FormInput
                                            label="Password"
                                            name="password"
                                            type="password"
                                            value={form.password}
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Minimum 6 characters"
                                            required
                                        />


                                        {/* PHONE */}

                                        <FormInput
                                            label="Phone"
                                            name="phone"
                                            value={form.phone}
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter phone number"
                                        />


                                        {/* ROLE */}

                                        <div>

                                            <label className="
                                        block
                                        text-sm
                                        font-medium
                                        text-gray-700
                                        mb-2
                                    ">

                                                Role

                                            </label>


                                            <select
                                                name="role"
                                                value={
                                                    form.role
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                className="
                                            w-full
                                            px-4
                                            py-3
                                            border
                                            border-gray-300
                                            rounded-lg
                                            outline-none
                                            focus:ring-2
                                            focus:ring-blue-500
                                        "
                                            >

                                                <option value="employee">

                                                    Employee

                                                </option>


                                                <option value="security">

                                                    Security

                                                </option>

                                            </select>

                                        </div>


                                        {/* DEPARTMENT */}

                                        <div>

                                            <label className="
                                        block
                                        text-sm
                                        font-medium
                                        text-gray-700
                                        mb-2
                                    ">

                                                Department

                                                {form.role ===
                                                    "employee" && (

                                                        <span className="
                                                text-red-500
                                                ml-1
                                            ">

                                                            *

                                                        </span>

                                                    )}

                                            </label>


                                            <input
                                                type="text"
                                                name="department"
                                                value={
                                                    form.department
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder={
                                                    form.role ===
                                                        "employee"
                                                        ? "e.g. IT"
                                                        : "Optional"
                                                }
                                                className="
                                            w-full
                                            px-4
                                            py-3
                                            border
                                            border-gray-300
                                            rounded-lg
                                            outline-none
                                            focus:ring-2
                                            focus:ring-blue-500
                                        "
                                            />

                                        </div>

                                    </div>


                                    {/* FORM ACTIONS */}

                                    <div className="
                                mt-6
                                flex
                                justify-end
                                gap-3
                            ">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowCreateForm(
                                                    false
                                                )
                                            }
                                            className="
                                        px-5
                                        py-2.5
                                        border
                                        border-gray-300
                                        rounded-lg
                                        text-gray-700
                                        hover:bg-gray-50
                                    "
                                        >

                                            Cancel

                                        </button>


                                        <button
                                            type="submit"
                                            disabled={
                                                creating
                                            }
                                            className="
                                        px-5
                                        py-2.5
                                        bg-blue-600
                                        text-white
                                        rounded-lg
                                        hover:bg-blue-700
                                        disabled:opacity-50
                                        disabled:cursor-not-allowed
                                    "
                                        >

                                            {creating
                                                ? "Creating..."
                                                : "Create User"
                                            }

                                        </button>

                                    </div>

                                </form>

                            </section>

                        )}


                        {/* 
                    FILTERS
                = */}

                        <section className="
                    bg-white
                    border
                    rounded-xl
                    p-5
                    mb-6
                ">

                            <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-3
                        gap-4
                    ">


                                {/* SEARCH */}

                                <div className="md:col-span-2">

                                    <label className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                mb-2
                            ">

                                        Search

                                    </label>


                                    <input
                                        type="text"
                                        value={search}
                                        onChange={
                                            event =>
                                                setSearch(
                                                    event.target.value
                                                )
                                        }
                                        placeholder="Search by name, email,
                                    phone or department...
                                "
                                        className="
                                    w-full
                                    px-4
                                    py-3
                                    border
                                    border-gray-300
                                    rounded-lg
                                    outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                "
                                    />

                                </div>


                                {/* ROLE FILTER */}

                                <div>

                                    <label className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                mb-2
                            ">

                                        Role

                                    </label>


                                    <select
                                        value={
                                            roleFilter
                                        }
                                        onChange={
                                            event =>
                                                setRoleFilter(
                                                    event.target.value
                                                )
                                        }
                                        className="
                                    w-full
                                    px-4
                                    py-3
                                    border
                                    border-gray-300
                                    rounded-lg
                                    outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                "
                                    >

                                        <option value="all">

                                            All Users

                                        </option>


                                        <option value="admin">

                                            Admin

                                        </option>


                                        <option value="employee">

                                            Employee

                                        </option>


                                        <option value="security">

                                            Security

                                        </option>


                                        <option value="visitor">

                                            Visitor

                                        </option>

                                    </select>

                                </div>

                            </div>

                        </section>


                        {/* 
                    USER TABLE
                = */}

                        <section className="
                    bg-white
                    border
                    rounded-xl
                    overflow-hidden
                ">

                            <div className="
                        px-6
                        py-5
                        border-b
                    ">

                                <h2 className="
                            text-lg
                            font-semibold
                            text-gray-800
                        ">

                                    Users

                                </h2>


                                <p className="
                            text-sm
                            text-gray-500
                            mt-1
                        ">

                                    Showing {
                                        filteredUsers.length
                                    } of {
                                        users.length
                                    } users

                                </p>

                            </div>


                            {filteredUsers.length === 0 ? (

                                <div className="
                            p-10
                            text-center
                            text-gray-500
                        ">

                                    No users found.

                                </div>

                            ) : (

                                <div className="overflow-x-auto">

                                    <table className="w-full">

                                        <thead className="
                                    bg-gray-50
                                    border-b
                                ">

                                            <tr>

                                                <th className="
                                            px-5
                                            py-4
                                            text-left
                                            text-sm
                                            font-semibold
                                            text-gray-600
                                        ">

                                                    #

                                                </th>


                                                <th className="
                                            px-5
                                            py-4
                                            text-left
                                            text-sm
                                            font-semibold
                                            text-gray-600
                                        ">

                                                    Name

                                                </th>


                                                <th className="
                                            px-5
                                            py-4
                                            text-left
                                            text-sm
                                            font-semibold
                                            text-gray-600
                                        ">

                                                    Email

                                                </th>


                                                <th className="
                                            px-5
                                            py-4
                                            text-left
                                            text-sm
                                            font-semibold
                                            text-gray-600
                                        ">

                                                    Phone

                                                </th>


                                                <th className="
                                            px-5
                                            py-4
                                            text-left
                                            text-sm
                                            font-semibold
                                            text-gray-600
                                        ">

                                                    Role

                                                </th>


                                                <th className="
                                            px-5
                                            py-4
                                            text-left
                                            text-sm
                                            font-semibold
                                            text-gray-600
                                        ">

                                                    Department

                                                </th>


                                                <th className="
                                            px-5
                                            py-4
                                            text-left
                                            text-sm
                                            font-semibold
                                            text-gray-600
                                        ">

                                                    Status

                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody className="
                                    divide-y
                                    divide-gray-100
                                ">

                                            {filteredUsers.map(
                                                (
                                                    user,
                                                    index
                                                ) => (

                                                    <tr
                                                        key={
                                                            user._id
                                                        }
                                                        className="
                                                    hover:bg-gray-50
                                                "
                                                    >

                                                        <td className="
                                                    px-5
                                                    py-4
                                                    text-sm
                                                    text-gray-500
                                                ">

                                                            {index + 1}

                                                        </td>


                                                        <td className="
                                                    px-5
                                                    py-4
                                                ">

                                                            <span className="
                                                        font-medium
                                                        text-gray-800
                                                    ">

                                                                {
                                                                    user.name ||
                                                                    "N/A"
                                                                }

                                                            </span>

                                                        </td>


                                                        <td className="
                                                    px-5
                                                    py-4
                                                    text-sm
                                                    text-gray-600
                                                ">

                                                            {
                                                                user.email ||
                                                                "N/A"
                                                            }

                                                        </td>


                                                        <td className="
                                                    px-5
                                                    py-4
                                                    text-sm
                                                    text-gray-600
                                                ">

                                                            {
                                                                user.phone ||
                                                                "N/A"
                                                            }

                                                        </td>


                                                        <td className="px-5 py-4">

                                                            <RoleBadge
                                                                role={
                                                                    user.role
                                                                }
                                                            />

                                                        </td>


                                                        <td className="
                                                    px-5
                                                    py-4
                                                    text-sm
                                                    text-gray-600
                                                ">

                                                            {
                                                                user.department ||
                                                                "-"
                                                            }

                                                        </td>


                                                        <td className="px-5 py-4">

                                                            <StatusBadge
                                                                isActive={
                                                                    user.isActive
                                                                }
                                                            />

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </section>




                    </main>

                </div>

            )}

        </DashboardLayout>



    );

};



// STAT CARD


const StatCard = ({
    title,
    value
}) => {

    return (

        <div className="
            bg-white
            border
            rounded-xl
            p-5
        ">

            <p className="
                text-sm
                text-gray-500
            ">

                {title}

            </p>


            <p className="
                text-3xl
                font-bold
                text-gray-800
                mt-2
            ">

                {value}

            </p>

        </div>

    );

};



// FORM INPUT


const FormInput = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    required
}) => {

    return (

        <div>

            <label className="
                block
                text-sm
                font-medium
                text-gray-700
                mb-2
            ">

                {label}

                {required && (

                    <span className="
                        text-red-500
                        ml-1
                    ">

                        *

                    </span>

                )}

            </label>


            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="
                    w-full
                    px-4
                    py-3
                    border
                    border-gray-300
                    rounded-lg
                    outline-none
                    focus:ring-2
                    focus:ring-blue-500
                "
            />

        </div>

    );

};



// ROLE BADGE


const RoleBadge = ({
    role
}) => {

    const styles = {

        admin:
            "bg-purple-100 text-purple-700",

        employee:
            "bg-blue-100 text-blue-700",

        security:
            "bg-orange-100 text-orange-700",

        visitor:
            "bg-green-100 text-green-700"

    };


    return (

        <span className={`
            inline-flex
            px-3
            py-1
            rounded-full
            text-xs
            font-medium
            ${styles[role] ||
            "bg-gray-100 text-gray-700"
            }
        `}>

            {role || "Unknown"}

        </span>

    );

};



// STATUS BADGE


const StatusBadge = ({
    isActive
}) => {

    return (

        <span className={`
            inline-flex
            px-3
            py-1
            rounded-full
            text-xs
            font-medium
            ${isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }
        `}>

            {isActive
                ? "Active"
                : "Inactive"
            }

        </span>

    );

};


export default AdminUsers;