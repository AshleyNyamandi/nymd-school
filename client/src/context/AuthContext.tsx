import { useQuery } from "@tanstack/react-query"
import React, { createContext, useEffect, useState } from "react";
import type { AuthContextType } from "..";
import api from "../services/api";

const defaultAuthContext: AuthContextType = {
    email: null,
    setEmail: () => {},
    setUserId: () => {},
    userId: null,
    setRole: () => {},
    role: null,
};


export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthContextProvider = ({children}: {children: React.ReactNode}) => {

    const [email, setEmail] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null); 

    const { data , } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
        const response = await api.get("/auth/users/me");
        return response.data.data;
    },
    retry: false, 
    refetchOnWindowFocus: false, 
    });
    useEffect(() => {
        if(data) {
            setEmail(data.email);
            setUserId(data._id);
            setRole(data.role);
        }
    }, [data])

    const values =  {
        email,
        setEmail,
        userId,
        setUserId,
        role,
        setRole,

    }

  return (
    <AuthContext.Provider value={values}>
        {children}
    </AuthContext.Provider>
  )
}
