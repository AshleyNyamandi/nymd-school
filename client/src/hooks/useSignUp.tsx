import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useState, type SyntheticEvent } from "react"
import { useNavigate } from "react-router";
import api from "../services/api";
import toast from "react-hot-toast";

const useSignUp = () => {

    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{fullName?: string, email?:string, password?:string, confirmPassword?:string}>({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const signUpMutation = useMutation({
        mutationFn: async (credentials: {fullName: string, email:string, password:string, confirmPassword:string}) => {
            const response = await api.post("/auth/sign-up", credentials)
            return response.data
        },
        onSuccess: (data) => {
            toast.success(data.message)
            setFormData({
                fullName: "",
                email: "",
                password: "",
                confirmPassword: ""
            })
            navigate("/check-email", {state: {email: formData.email}})
        },
        onError: (error) => {
            if (axios.isAxiosError<{ message?: string }>(error) && error.response) {
                toast.error(error.response?.data?.message || "Error Signing up")
            } else if (axios.isAxiosError(error) && error.request) {
                toast.error("Server error");
            } else {
                toast.error("Error Signing up")
                console.log(error)
            }
        
        }
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value } = e.target;

        setFormData(prev => ({
            ...prev, 
            [name]: value
        }))
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }))
        }
    }

    const validateSIForm = () => {
        const newErrors: {fullName?: string, email?:string, password?:string, confirmPassword?:string} = {}
        if (!formData.fullName) {
            newErrors.password = "Please provide your full name"
        }                
        if (!formData.email) {
            newErrors.email = "Please provide email address"
        }

        if (!formData.password) {
            newErrors.password = "Please provide password"
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm password"
        }  
        else if (formData.password !== formData.confirmPassword)   {
            newErrors.confirmPassword = "Your passwords must match"
        }  

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (validateSIForm()) {
            signUpMutation.mutate({
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                password: formData.password.trim(),
                confirmPassword: formData.confirmPassword.trim()
            })
        }
    }

  return {
    showPassword,
    setShowPassword,
    formData,
    handleSubmit,
    handleChange,
    signUpMutation,
    errors,
  }
}

export default useSignUp