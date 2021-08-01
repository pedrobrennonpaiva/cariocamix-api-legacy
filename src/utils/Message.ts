
class Message {

    static CREATE_ERROR = 'Ocorreu um erro ao inserir';
    static UPDATE_ERROR = 'Ocorreu um erro ao atualizar';
    static DELETE_ERROR = 'Ocorreu um erro ao remover';

    static CREATE_SUCCESS = (title: string, isFemale: boolean = false) : string => {

        return `${title} criad${isFemale ? 'a' : 'o'} com sucesso!`;
    }
    static UPDATE_SUCCESS = (title: string, isFemale: boolean = false) : string => {

        return `${title} atualizad${isFemale ? 'a' : 'o'} com sucesso!`;
    }

    static DELETE_SUCCESS = (title: string, isFemale: boolean = false) : string => {

        return `${title} removid${isFemale ? 'a' : 'o'} com sucesso!`;
    }
}

export default Message;