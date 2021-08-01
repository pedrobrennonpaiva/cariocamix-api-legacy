import { Admin } from "../models/Admin";
import { User } from "../models/User";

class ExtensionMethod {

    static WithoutPasswords = (users: User[]) : User[] =>
    {
        return users.map(x => ExtensionMethod.WithoutPassword(x));
    }

    static WithoutPassword = (user: User) : User =>
    {
        if (user != null)
        {
            user.password = null;
        }
        return user;
    }

    static WithoutPasswordsAdmin = (users : Admin[]) : Admin[] =>
    {
        return users.map(x => ExtensionMethod.WithoutPasswordAdmin(x));
    }

    static WithoutPasswordAdmin = (user: Admin) : Admin => 
    {
        if (user != null)
        {
            user.password = null;
        }
        return user;
    }
} 

export default ExtensionMethod;