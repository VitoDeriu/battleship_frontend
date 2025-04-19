//on crée un hook pour éviter de rappeler le context à chaque fois qu'on veut l'utiliser. on aura juste a faire useAuth
import {useContext} from "react";
import {AuthContext} from "../context/AuthContext";

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth doit être utilisé dans un AuthProvider') //petite gestion d'erreur pour faciliter
    }
    return context
}