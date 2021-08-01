import { Request, Response } from "express";
import { EmailService } from "../services/EmailService";

const sgMail = require('@sendgrid/mail');

export default {

    async sendGridEmail(request: Request, response: Response) {

      var sendedEmail = await EmailService.sendEmail(
        request.body.email, 
        request.body.subject, 
        request.body.text
      );

      if(sendedEmail)
      {
        response.status(200).send({ 
          success: true, 
          message: 'E-mail enviado!',
        });
      }
      else
      {
        response.status(400).send({ 
          success: false, 
          message: 'Ocorreu um erro ao enviar o e-mail!',
        });
      }  
  },
}
