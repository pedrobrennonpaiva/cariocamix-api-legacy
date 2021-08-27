import { Request, Response } from "express";
var mercadopago = require('mercadopago');
mercadopago.configure({
    access_token: process.env.MERCADOPAGO_ACCESSTOKEN
});

export class MercadoPagoService {

    async get() {
    }

    async getById(id: string) {
    }

    async insert(request: Request, response: Response) {

        try
        {
            var customer_data = { "email": "p@test.com" }
    
            mercadopago.customers.create(customer_data).then((customer: any) => {
    
                response.status(201).send(customer);
                // var card_token = {
                //     "customer_id": customer.id,
                //     "card_id": "5031433215406351",
                //     "security_code": "123",
                // }
        
                // mercadopago.card_token.create(card_token).then((cardToken: any) => {
                    
                //     var card_data = {
                //         "token": cardToken.id,
                //         "customer_id": customer.id,
                //         "payment_method_id": "credit_card"
                //     }
        
                //     mercadopago.card.create(card_data).then((card: any) => {
                //         console.log(card);
                //     })
                //     .catch(errr => {
                //         throw errr;
                //     });
                // })
                // .catch((errrr: any) => {
                //     throw errrr;
                // });
            })
            .catch((err: any) => {
                response.status(500).send('Ocorreu um erro: ' + err);
            });
        }
        catch(ex)
        {
            response.status(500).send('Ocorreu um erro: ' + ex);
        }
    }

    async update(request: Request, response: Response) {
    }

    async delete(request: Request, response: Response) {
    }
}