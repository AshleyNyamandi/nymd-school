import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router";
import type { AxiosError } from "axios";
import api from "../services/api";
import toast from "react-hot-toast";

interface SignInForm {
  email: string;
  password: string;
}

interface SignInErrors {
  email?: string;
  password?: string;
}

interface SignInResponse {
  message: string;
}

const useSignIn = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<SignInErrors>({
    email: "",
    password: "",
  });
  const [formData, setFormData] = useState<SignInForm>({
    email: "",
    password: "",
  });

  const signInMutation = useMutation<SignInResponse, AxiosError<{ message: string }>, SignInForm>({
    mutationFn: async (credentials) => {
      const response = await api.post<SignInResponse>("/auth/sign-in", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/");
      console.log(data);
    },
    onError: (error) => {
      if (error.response) {
        toast.error(error.response.data.message);
        console.log(error.response.data.message);
      } else if (error.request) {
        toast.error("Server error");
      }
    },
  });

  const adminSignInMutation = useMutation<SignInResponse, AxiosError<{ message: string }>, SignInForm>({
    mutationFn: async (credentials) => {
      const response = await api.post<SignInResponse>("/auth/sign-in", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/admin/dashboard");
      console.log(data);
    },
    onError: (error) => {
      if (error.response) {
        toast.error(error.response.data.message);
        console.log(error.response.data.message);
      } else if (error.request) {
        toast.error("Server error");
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: keyof SignInForm; value: string };
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateSIForm = () => {
    const newErrors: SignInErrors = {};
    if (!formData.email) {
      newErrors.email = "Please provide email address";
    }
    if (!formData.password) {
      newErrors.password = "Please provide password";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateSIForm()) {
      signInMutation.mutate({
        email: formData.email.trim(),
        password: formData.password,
      });
    }
  };

  const handleAdminSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateSIForm()) {
      adminSignInMutation.mutate({
        email: formData.email.trim(),
        password: formData.password,
      });
    }
  };

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
    handleAdminSubmit,
  };
};

export default useSignIn;