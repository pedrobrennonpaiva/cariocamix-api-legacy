require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

export class auth {

    static verifyJWT = (req: any, res: any, next: any) => {

        const bearerHeader = req.headers['authorization'];
        
        if (!bearerHeader) return res.status(401).json({ auth: false, message: 'Nenhum token fornecido.' });
        
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        var token = bearerToken;

        jwt.verify(token, process.env.SECRET, (err: any, decoded: any) => {
            if (err) return res.status(400).json({ auth: false, message: 'Falha ao autenticar o token.' });
            
            // se tudo estiver ok, salva no request para uso posterior
            req.userId = decoded.id;
            next();
        });
    }
}