const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

require("dotenv").config();


const dns = require("dns");
dns.setServers(['8.8.8.8', '1.1.1.1'])

const seedUsers = async () => {

    try {

        await mongoose.connect(
            process.env.MONGODB_URI
        );

        console.log(
            "MongoDB connected"
        );


        const users = [

            {
                name: "Sourabh soni",
                email: "ss030337@gmail.com",
                password: "Anni@121",
                role: "admin"
            },

            {
                name: "satish",
                email: "satish32@example.com",
                password: "satish@123",
                role: "employee",
                department: "IT"
            },

            {
                name: "Vijay",
                email: "Vijay@security.com",
                password: "Vijay@123",
                role: "security"
            }

        ];


        for (
            const userData of users
        ) {

            const existingUser =
                await User.findOne({
                    email:
                        userData.email
                });


            if (existingUser) {

                console.log(
                    `Already exists: ${userData.email}`
                );

                continue;

            }


            const hashedPassword =
                await bcrypt.hash(
                    userData.password,
                    10
                );


            await User.create({

                name:
                    userData.name,

                email:
                    userData.email,

                password:
                    hashedPassword,

                role:
                    userData.role,

                department:
                    userData.department ||
                    "",

                isActive:
                    true

            });


            console.log(
                `Created: ${userData.email}`
            );

        }


        console.log(
            "User seeding complete"
        );


        process.exit(0);

    } catch (error) {

        console.error(
            "Seed error:",
            error
        );

        process.exit(1);

    }

};

seedUsers() 