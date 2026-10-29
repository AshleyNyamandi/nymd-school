import axios from "axios";
import { useState, type SyntheticEvent } from "react"
import type { TutorSupportEntries, TutorSupportErrors } from "..";
import { cn, validateEmail } from "../utils/utils";
import { AlertCircle, Send } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import MainLayout from "../Layout/MainLayout";
import api from "../services/api";

const TutorSupport = () => {
  const [errors, setErrors] =  useState<TutorSupportErrors>({});
  const [formData, setFormData] = useState({
    subject: "",
    level: "",
    email: "",
    message: ""
  });

  const mutation = useMutation({
    mutationFn: async (message: TutorSupportEntries) => {
      const response = await api.post("/tutor-support/request-support",
         message)

         return response.data    
    },
    onSuccess: async () => {
      toast.success("Message sent successfully")
      setFormData({
        subject: "",
        level: "",
        email: "",
        message: ""        
      })
    },
    onError: (error) => {
      if (axios.isAxiosError<{ message?: string }>(error) && error.response) {
        const message = error.response.data?.message;

          setErrors({
            general: message || "An error occurred. Please try again.",
          });

      } else if (axios.isAxiosError(error) && error.request) {
        setErrors({
          general: "Network error. Please check your connection.",
        });
      } else {
        setErrors({
          general: "An unexpected error occurred.",
        });
      }
    },
  })

  const handleValueChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const fieldName = name as keyof TutorSupportEntries;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }

  };

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validateTTSForm()) {
      mutation.mutate({
        subject: formData.subject,
        level: formData.level,
        email: formData.email.trim(),
        message: formData.message

      })
    }
  };

  const validateTTSForm = ()=>{
  const newErrors: TutorSupportErrors = {};
    
    if (!formData.subject) {
        newErrors.subject = "Please select subject you want help in"      
    }

    if (!formData.level) {
        newErrors.level = "Please select level you want help in"      
    }
    
    if (!formData.email) {
        newErrors.email = "Please provide your email address"      
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (formData.message.length >= 200) {
      newErrors.message = "Message must be less than 200 characters";
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }


  return (
    <MainLayout>
      <Toaster />
      <div className="max-w-2xl mx-auto p-10">
        <div className="text-center">
          <h3 className="text-2xl font-extrabold leading-tight sm:text-3xl lg:text-4xl">Please let us know which subject you would like help with.</h3>
          <p>We will get back to you shortly</p>
        </div> 
        <div>
          {
            errors.general && <p className="text-center">{errors.email}</p>
          }
        </div>
        <form 
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 my-10"
        >

          <div className="flex flex-col md:flex-row gap-4">

            <div className="flex-1 mb-1">
              <label htmlFor="subject" className="font-medium text-gray-700">Subject<span className="text-red-700 ml-1">*</span></label>              
              <select 
                  id="subject"
                  onChange={handleValueChange}
                  value={formData.subject}
                  name="subject"
                  className={cn("w-full px-4 py-3 rounded-xl border border-gray-200 bg-white  outline-none transition focus:right-2", 
                    errors.subject
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  )}
                >
                  <option value="" disabled>Choose Subject</option>
                  <option value="maths">Maths</option>
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="cs">Computer Science</option>
                </select>
              {errors.level && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errors.subject}
                </p>
              )}                
            </div>

            <div className="flex-1 mb-1">
              <label htmlFor="level" className="font-medium text-gray-700">Level<span className="text-red-600 ml-1">*</span></label>
              <select 
                onChange={handleValueChange}
                value={formData.level}
                name="level"
                id="level"
                className={cn("w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none transition",
                  errors.level
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"                  
                )}
              >
                <option value="" disabled>Level</option>
                <option value="checkpoint">Checkpoint</option>
                <option value="igcse">IGCSE</option>
                <option value="alevel">A level</option>
                <option value="zimsecO">Zimsec O level</option>
                <option value="zimsecA">Zimsec A level</option>
              </select>
              {errors.level && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errors.level}
                </p>
              )}              
            </div>

          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-medium text-gray-700">
              Email<span className="text-red-600 ml-1">*</span>
            </label>
            <input
              onChange={handleValueChange}
              id="email"
              type="email"
              name="email"
              value={formData.email}
              placeholder="nymd@gmail.com"
              className={cn("w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none transition",
                  errors.email
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"                                  
              )}
            />
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errors.email}
                </p>
              )}            
          </div>

          {/* Message — full width row */}
          <div className="flex flex-col gap-1">
            <label htmlFor="message" className="font-medium text-gray-700">
              Message<span className="ml-2 text-xs text-gray-700">max 200</span>
            </label>
            <textarea
              onChange={handleValueChange}
              id="message"
              name="message"
              value={formData.message}
              className={cn("w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none transition min-h-30 resize-none",
                  errors.message
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"                
              )}
              placeholder="Write your message here..."
            />
              {errors.message && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errors.message}
                </p>
              )}            
          </div>

          {/* Button — own row */}
          <button
            disabled={mutation.isPending}
            type="submit"
            className="w-full px-4 py-3 flex justify-center items-center gap-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md cursor-pointer"
          >
              {mutation.isPending ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <Send  className="w-4 h-4" />
                  Send
                </>
              )}
          </button>
        </form>
      </div>
    </MainLayout>
  )
}

export default TutorSupport