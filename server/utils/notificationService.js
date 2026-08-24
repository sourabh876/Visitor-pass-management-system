const {
    sendEmail
} = require("./emailService");


const {
    sendSMS
} = require("./smsService");


const notifyUser = async ({
    user,
    subject,
    emailHtml,
    smsMessage
}) => {

    const results = {

        email: null,

        sms: null

    };


    // EMAIL

    if (user?.email) {

        try {

            results.email =
                await sendEmail({

                    to:
                        user.email,

                    subject,

                    html:
                        emailHtml

                });

        } catch (error) {

            console.error(
                "Email notification failed:",
                error.message
            );

        }

    }


    // SMS

    if (user?.phone) {

        try {

            results.sms =
                await sendSMS({

                    to:
                        user.phone,

                    message:
                        smsMessage

                });

        } catch (error) {

            console.error(
                "SMS notification failed:",
                error.message
            );

        }

    }


    return results;

};


module.exports = {
    notifyUser
};