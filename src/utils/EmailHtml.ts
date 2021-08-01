
export class EmailHtml {

    static insertUser = (name: string, email: string, password?: string | null) : string => {

        return `
            <h2>Parabéns ${name}!</h2>

            <p>Seu usuário foi cadastrado com sucesso! Veja seus dados de acesso abaixo:</p>

            <p>Email: ${email}</p>
            ${password ? `<p>Senha (temporária - troque no primeiro login): ${password}</p>` : ``}

            <br/>
            <p>Possui alguma dúvida ou problema? Entre em contato com nosso suporte!</p>
        `;
    }

    static updateUser = (name: string) => {

        return `
            <h2>Olá ${name}!</h2>

            <p>Seu usuário foi atualizado com sucesso!</p>

            <br/>
            <p>Possui alguma dúvida ou problema? Entre em contato com nosso suporte!</p>
        `;
    }

    static resetPasswordUser = (name: string) => {

        return `
            <h2>Olá ${name}!</h2>

            <p>Sua senha foi atualizada com sucesso!</p>

            <br/>
            <p>Possui alguma dúvida ou problema? Entre em contato com nosso suporte!</p>
        `;
    }
}