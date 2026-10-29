import { useMutation } from "@tanstack/react-query"
import { X } from "lucide-react"
import { useState, type ChangeEvent, type SyntheticEvent } from "react"
import toast, { Toaster } from "react-hot-toast"
import api from "../services/api"

import type { TutorRequest } from "..";

const ReplyTutorRequest = ({isOpen, setIsOpen, currentRequest}: { isOpen: boolean; setIsOpen: (open: boolean) => void; currentRequest: TutorRequest }) => {

    const [formData, setFormData] = useState({
        message: localStorage.getItem(currentRequest.email) || ""
    })

    const handleCloseTab =  () => {
        localStorage.setItem(currentRequest.email, formData.message)
        setIsOpen(false)
    };

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    };

    const mutation = useMutation({
        mutationFn: async (data: {message: string, _id: string, email:string}) => {
            const response = await api.post("/tutor-support/reply-tutor-requests", data)
            return response.data
        },
        onError: () => {
            toast.error("Error sending message")
        },
        onSuccess: () => {
            toast.success("Message Sent");
            setIsOpen(false);
            localStorage.removeItem(currentRequest.email);
        }
    })

    const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutation.mutate({
                message: formData.message, 
                _id: currentRequest._id,
                email: currentRequest.email
        })
    }

  return (
    <div className="flex justify-center items-center fixed inset-0 z-2">
        <Toaster />
        {
            isOpen && <div 
                            className="z-3 absolute inset-0 bg-black/50"
                            onClick={handleCloseTab}
                         />
        }
        <div className="bg-white rounded w-full max-w-xl relative p-5 z-5">
            <button
                onClick={handleCloseTab}
            >
                <X  className="absolute right-4 top-2 hover:bg-gray-200 p-1 rounded-full transition-colors duration-200" 
                    size={40}
                />
            </button>
            <p className="py-3">Replying: <span>{currentRequest.email}</span></p>
            <form onSubmit={handleSubmit} className="space-y-3">
                <textarea 
                    name="message" 
                    id="" 
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Type message here..."
                    className="focus:outline-none border border-gray-300 resize-none p-2 rounded-lg h-60 w-full"
                ></textarea>
                <button 
                    type="submit"
                    className="bg-green-700 w-full p-2 rounded-lg text-white hover:bg-green-800 transition-all duration-200 hover:scale-105 text-xl">
                        Send
                </button>
            </form>
        </div>
    </div>
  )
}

export default ReplyTutorRequest