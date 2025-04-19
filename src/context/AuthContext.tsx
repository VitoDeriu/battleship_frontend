import React, {createContext, useContext, ReactNode, useState} from "react";

//On va créer un context pour gérer l'utilisateur dans toute l'application un peu comme une variable de session, mais coté client pour pouvoir y acceder de partout

/*
explications de chatGpt :
    1. `AuthProvider` est comme un _gros sac à dos_. Il contient toutes les infos de l'utilisateur (`user`, `login`, `logout`) et il peut être transporté dans l'arborescence.
    2. `AuthContext.Provider` distribue ce sac à tous les composants enfants.
    3. `useAuth`: C'est un raccourci pour ouvrir ce sac et récupérer les données où on veut.
*/

//Comme on est en TS, il faut créer le type de la variable (du context), ici le type se nommera AuthContextType
//si j'ai bien compris, il faudra faire en sorte qu'il soit pareil que le user qu'on va fetch depuis l'api
type AuthContextType = {
    user: string | null;
    login: (username: string) => void;
    logout: () => void;
}

//c'est là qu'on initialise le context grace a createContext et on lui assigne le type qu'on a créé plus haut
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

//ensuite pour recup le context dans App.tsx faut créer un provider qui va aller récup le context.
//c'est grace aux hooks qu'on va aller stocker les infos de l'utilisateurs dans le provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<string | null>(null) //là on a mis le user a null par défaut dans les parentheses

    //fonction pour connecter le user
    const login = (username: string) => {
        setUser(username); //met à jour l'état du context avec la valeur du username
        console.log(`${username} est connecté`)
    }

    //fonction pour déco l'user
    const logout = () => {
        setUser(null); //reset a null l'état du context quand c'est appelé
        console.log('user déco');
    }

    //return du context
    return (
        <AuthContext value={{ user, login, logout }}>
            {children} {/*renvoie tous les enfants ?*/}
        </AuthContext>
    )
}


