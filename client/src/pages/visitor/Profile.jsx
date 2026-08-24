import {
    useEffect,
    useState
} from "react";

import { toast } from "react-toastify";

import {
    getMyVisitorProfile,
    createMyVisitorProfile,
    updateMyVisitorProfile
} from "../../services/visitorApi";

import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const Profile = () => {

    const [profile, setProfile] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

 




    const [form, setForm] = useState({

        fullName: "",
        email: "",
        phone: "",
        company: "",
        address: "",
        idProofType: "",
        idProofNumber: "",
        photo: null

    });



    // LOAD PROFILE


    const loadProfile = async () => {

        try {

            setLoading(true); 

            const response =
                await getMyVisitorProfile();


            if (
                response?.data
            ) {

                const visitor =
                    response.data;

                setProfile(visitor);


                setForm({

                    fullName:
                        visitor.fullName || "",

                    email:
                        visitor.email || "",

                    phone:
                        visitor.phone || "",

                    company:
                        visitor.company || "",

                    address:
                        visitor.address || "",

                    idProofType:
                        visitor.idProofType || "",

                    idProofNumber:
                        visitor.idProofNumber || "",

                    photo: null

                });

            }

        } catch (error) {

            if (
                error.response?.status !== 404
            ) {

                console.error(
                    "Profile loading error:",
                    error
                );

                toast.error(
                    error.response?.data?.message ||
                    "Unable to load profile."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadProfile();

    }, []);



    // INPUT CHANGE


    const handleChange = (e) => {

        const {
            name,
            value,
            files
        } = e.target;


        if (
            name === "photo"
        ) {

            setForm(
                previous => ({

                    ...previous,

                    photo:
                        files?.[0] || null

                })
            );

            return;

        }


        setForm(
            previous => ({

                ...previous,

                [name]: value

            })
        );

    };



    // SUBMIT


    const handleSubmit = async (e) => {

        e.preventDefault();

        setSaving(true);

 


        try {

            const formData =
                new FormData();


            formData.append(
                "fullName",
                form.fullName
            );

            formData.append(
                "email",
                form.email
            );

            formData.append(
                "phone",
                form.phone
            );

            formData.append(
                "company",
                form.company
            );

            formData.append(
                "address",
                form.address
            );

            formData.append(
                "idProofType",
                form.idProofType
            );

            formData.append(
                "idProofNumber",
                form.idProofNumber
            );


            if (
                form.photo
            ) {

                formData.append(
                    "photo",
                    form.photo
                );

            }


            let response;


            if (profile) {

                response =
                    await updateMyVisitorProfile(
                        formData
                    );

            } else {

                response =
                    await createMyVisitorProfile(
                        formData
                    );

            }


            if (
                response?.data
            ) {

                setProfile(
                    response.data
                );

            }

            toast.success(
                profile
                    ? "Profile updated successfully."
                    : "Profile created successfully."
            );


            await loadProfile();

        } catch (error) {

            console.error(
                "Profile save error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to save profile."
            );

        } finally {

            setSaving(false);

        }

    };


    return (

        <DashboardLayout>

            {loading ? (

                <LoadingSpinner>

                </LoadingSpinner>

            ) : (
                <div className="min-h-screen bg-gray-100 py-8 px-4">

                    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">

                        <div className="mb-8">

                            <h1 className="text-2xl font-bold text-gray-800">

                                My Visitor Profile

                            </h1>

                            <p className="text-gray-500 mt-1">

                                Keep your visitor information up to date.

                            </p>


                        </div> 
                        {/*   
                    FORM
                   */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >

                            <div className="flex flex-col items-center mb-8">

                                {profile?.photo ? (

                                    <button
                                        type="button"
                                        onClick={() => setShowPhoto(true)}
                                        className="
                rounded-full
                focus:outline-none
                focus:ring-4
                focus:ring-blue-200
            "
                                    >

                                        <img
                                            src={`http://localhost:5000/${profile.photo}`}
                                            alt={profile.fullName || "Visitor"}
                                            className="
                    h-32
                    w-32
                    rounded-full
                    object-cover
                    border-4
                    border-white
                    shadow-lg
                    hover:opacity-90
                    transition
                "
                                        />

                                    </button>

                                ) : (

                                    <div
                                        className="
                h-32
                w-32
                rounded-full
                bg-blue-600
                text-white
                flex
                items-center
                justify-center
                text-4xl
                font-bold
                shadow-lg
            "
                                    >

                                        {form.fullName
                                            ?.charAt(0)
                                            ?.toUpperCase() || "U"
                                        }

                                    </div>

                                )}


                                {/* <p className="text-sm text-gray-500 mt-3">
                                    {profile?.photo
                                        ? "Click photo to view"
                                        : "No profile photo uploaded"
                                    }
                                </p> */}

                            </div>


                            <div>

                                <label className="block text-sm font-medium mb-2">

                                    Full Name

                                </label>

                                <input
                                    type="text"
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded-lg px-4 py-3"
                                />

                            </div>


                            <div>

                                <label className="block text-sm font-medium mb-2">

                                    Email

                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded-lg px-4 py-3"
                                />

                            </div>



                            <div>

                                <label className="block text-sm font-medium mb-2">

                                    Phone

                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded-lg px-4 py-3"
                                />

                            </div>


                            <div>

                                <label className="block text-sm font-medium mb-2">

                                    Company

                                </label>

                                <input
                                    type="text"
                                    name="company"
                                    value={form.company}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-3"
                                />

                            </div>


                            <div>

                                <label className="block text-sm font-medium mb-2">

                                    Address

                                </label>

                                <textarea
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full border rounded-lg px-4 py-3"
                                />

                            </div>



                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                                <div>

                                    <label className="block text-sm font-medium mb-2">

                                        ID Proof Type

                                    </label>

                                    <select
                                        name="idProofType"
                                        value={form.idProofType}
                                        onChange={handleChange}
                                        required
                                        className="w-full border rounded-lg px-4 py-3"
                                    >

                                        <option value="">

                                            Select ID proof

                                        </option>

                                        <option value="Aadhaar">

                                            Aadhaar

                                        </option>

                                        <option value="Passport">

                                            Passport

                                        </option>

                                        <option value="Driving License">

                                            Driving License

                                        </option>

                                        <option value="Voter ID">

                                            Voter ID

                                        </option>

                                    </select>

                                </div>


                                <div>

                                    <label className="block text-sm font-medium mb-2">

                                        ID Proof Number

                                    </label>

                                    <input
                                        type="text"
                                        name="idProofNumber"
                                        value={form.idProofNumber}
                                        onChange={handleChange}
                                        required
                                        className="w-full border rounded-lg px-4 py-3"
                                    />

                                </div>

                            </div>


                            <div>

                                <label className="block text-sm font-medium mb-2">

                                    Profile Photo

                                </label>

                                <input
                                    type="file"
                                    name="photo"
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-3"
                                />

                            </div>



                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
                            >

                                {saving
                                    ? "Saving..."
                                    : profile
                                        ? "Update Profile"
                                        : "Create Profile"
                                }

                            </button>

                        </form>

                    </div>

                </div>
            )}
        </DashboardLayout>


    );

};


export default Profile;