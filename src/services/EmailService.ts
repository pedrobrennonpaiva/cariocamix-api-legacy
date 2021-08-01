import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';

export class EmailService {

    static sendEmail = async (email: string, subject: string, html: string) : Promise<boolean> => {

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
              user: process.env.SMTP_EMAIL,
              pass: process.env.SMTP_PWD
            }
        });

        const mailOptions = {
            to: email,
            subject: subject,
            html: html
        };

        var sendedEmail = false;
        
        transporter.sendMail(mailOptions, (err, info) => {
            if (err)
                console.log(err);
            else
                console.log(info);
        });

        // sgMail.setApiKey(process.env.SENDGRID_KEY);

        // const msg = {
        //     from: process.env.SENDGRID_EMAIL,
        //     to: email,
        //     subject: subject,
        //     html: html,
        // }
          
        // var sendedEmail = await sgMail.send(msg)
        // .then(() => {
        //     return true;
        // })
        // .catch(() => {
        //   return false;
        // });

        return sendedEmail;
    }
}