const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

class EmailService {
    static sendRegistrationConfirmationEmail(username, email, activationCode){

        var msg = {
            to: email,
            from: process.env.EMAIL_ADDRESS,
            subject: 'Registration Confirmation',
            html: ` <p>Hello ${username}</p>
                    <p>You have recently registered for Entertainment List.</p>
                    <p>Please click the link below to activate your account</p>
                    <p>localhost:3000/activate-account?activationcode=${activationCode}</p>`
        };
        sgMail.send(msg);
    }
}