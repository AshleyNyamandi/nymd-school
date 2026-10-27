import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import LoadingPage from "../components/Loading";
import api from "../services/api";



export default function EmailVerified() {
  const queryClient = useQueryClient();

  const [message, setMessage] = useState("");

  const navigate =  useNavigate()

  const mutation =  useMutation({
    mutationFn: async() => {
      const response = await api.post("/auth/verify-email?token=${token}",{}, {withCredentials: true});
      return response.data

    },
    onError : (error) => {
      setMessage(error.response.data.message)
    },
    onSuccess: (data) => {
      setMessage(data.message);
      queryClient.invalidateQueries({queryKey: ["user"]})
    }
  })

  useEffect(() => {
    mutation.mutate()
  }, [])

  if (mutation.isIdle || mutation.isPending) <LoadingPage />

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Animated Circle with Check Icon */}
        {
          mutation.isSuccess && (
          <div className="relative w-24 h-24 mx-auto mb-6">
            {/* Pulsing ring effect */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-green-500"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
              }}
            />

            {/* Inner circle background */}
            <motion.div
              className="absolute inset-0 rounded-full bg-green-500"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.2,
                ease: "easeOut",
              }}
            />

            {/* Check icon */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.4,
                ease: "easeOut",
                type: "spring",
                stiffness: 200,
              }}
            >
              <Check className="w-12 h-12 text-white" strokeWidth={3} />
            </motion.div>

            {/* Ripple effect */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-green-500"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{
                duration: 1.5,
                delay: 0.6,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          </div>
          )
        }

        <motion.h2
          className="text-2xl font-bold text-gray-800 mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {message}
        </motion.h2>

        {<motion.p
          className="text-gray-500 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {message}
        </motion.p> }

        <motion.button
          onClick={() => navigate("/")}
          className="inline-block text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          whileHover={{ x: 5 }}
        >
          Back to →
        </motion.button>
      </div>
    </div>
  );
}