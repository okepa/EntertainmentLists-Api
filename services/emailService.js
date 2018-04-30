const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

class EmailService {
    static sendRegistrationConfirmationEmail(username, email, activationCode){
        return new Promise((resolve, reject) => {
            console.log(process.env.SENDGRID_API_KEY)
            var msg = {
                to: email,
                from: process.env.EMAIL_ADDRESS,
                subject: 'Registration Confirmation',
                html: ` <p>Hello ${username}</p>
                        <p>You have recently registered for Entertainment List.</p>
                        <p>Please click the link below to activate your account</p>
                        <p>localhost:3000/activate-account?activationcode=${activationCode}</p>`
            };
            sgMail.send(msg).then(() => {
                console.log("email sent");
                resolve();
            }).catch(err => {
                console.log("email not sent");
                console.log(err);
                const {message, code, response} = err;
                console.log(code)
                console.log(message)
                console.log(response)
                reject();
            });
        })  
    }

    static sendForgottenPasswordEmail(username, email, forgottenPasswordCode){
        return new Promise((resolve, reject) => {
            var msg =  {
            to: email,
            from: process.env.EMAIL_ADDRESS,
            subject: 'Registration Confirmation',
            html: ` <p>Hello ${username}</p>
                    <p>You have requested a new password</p>
                    <p>Please click the link below to reset your password</p>
                    <p>localhost:3000/reset-password?forgottenPasswordCode=${forgottenPasswordCode}</p>`
            }
            sgMail.send(msg).then(() => {
                console.log("email sent");
                resolve();
            }).catch(err => {
                console.log("email not sent");
                console.log(err);
                const {message, code, response} = err;
                console.log(code)
                console.log(message)
                console.log(response)
                reject();
            });

        })
    }
}

module.exports = EmailService;