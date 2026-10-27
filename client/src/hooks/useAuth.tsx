import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

const useAuth = () => {
    const authProvider = useContext(AuthContext)
    if (!authProvider) throw new Error("authProvider must be used within the Auth Provider");
    return authProvider; 
}

export default useAuth;