import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type SyntheticEvent } from "react"
import { useNavigate } from "react-router";
import api from "../services/api";
import toast from "react-hot-toast";

const useSignIn = () => {

    const navigate = useNavigate();
    const querylient = useQueryClient();

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{email?:string, password?:string}>({
        email: "",
        password: ""
    })
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const signInMutation = useMutation({
        mutationFn: async (credentials: {email:string, password: string}) => {
            const response = await api.post("/auth/sign-in", credentials);
            return response.data
        },
        onSuccess: (data) => {
            toast.success(data.message);
            querylient.invalidateQueries({queryKey: ["user"]})
            navigate("/");
            console.log(data)

        },
        onError: (error) => {
            if (error.response) {
                toast.error(error.response.data.message);
                console.log(error.response.data.message);
            } else if (error.request) {
                toast.error("Server error");
            }
            
        }
    })

    const adminSignInMutation = useMutation({
        mutationFn: async (credentials: {email:string, password: string}) => {
            const response = await api.post("/auth/sign-in", credentials);
            return response.data
        },
        onSuccess: (data) => {
            toast.success(data.message);
            querylient.invalidateQueries({queryKey: ["user"]})
            navigate("/admin/dashboard");
            console.log(data)

        },
        onError: (error) => {
            if (error.response) {
                toast.error(error.response.data.message);
                console.log(error.response.data.message);
            } else if (error.request) {
                toast.error("Server error");
            }
            
        }
    })    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value } = e.target
        setFormData(prev => ({
            ...prev, 
            [name]: value
        }))
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }))
        }
    }

    const validateSIForm = () => {
        const newErrors: {email?: string, password?:string} = {}
        if (!formData.email) {
            newErrors.email = "Please provide email address"
        }

        if (!formData.password) {
            newErrors.password = "Please provide password"
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (validateSIForm()) {
            signInMutation.mutate({
                email: formData.email.trim(),
                password: formData.password
            })
        }
    }   

    const handleAdminSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (validateSIForm()) {
            adminSignInMutation.mutate({
                email: formData.email.trim(),
                password: formData.password
            })
        }
    }        
  return {
    showPassword,
    setShowPassword,
    handleChange,
    handleSubmit,
    errors,
    setErrors,
    formData,
    setFormData,
    signInMutation,
    navigate, 
    adminSignInMutation,
    handleAdminSubmit
  }
}

export default useSignIn;