import { useState } from "react";
import ReplyTutorRequest from "../components/ReplyTutorRequest"
import { useQuery } from "@tanstack/react-query";
import LoadingPage from "../components/Loading";
import FetchErrorCard from "../components/FetchError";
import EmptyResponse from "../components/EmptyResponse";
import api from "../services/api";

const TutorRequests = () => {
      const [isOpen, setIsOpen] = useState(false);
      const [currentRequest, setCurrentRequest] = useState({
        _id: "",
        subject: "",
        level: "",
        email: "",
        message: "",
        isReplied: "",    
        createdAt: ""    
      })

      let page = 1;
      let number = 10;

    const { data = [], error, isLoading, isFetching } =  useQuery({
        queryKey: ["tutorRequests"],
        queryFn: async (page: Number, number: Number) => {
            const response = await api.get("/tutor-support/tutor-requests", {
              params: {
                page,
                number
              }
            })
            return response.data.data;
        }
    })  
    
    const handleEmailTabOpen = (request) => {
      setCurrentRequest({
          _id: request._id,
          subject: request.subject,
          level: request.level,
          email: request.email,
          message: request.message,
          isReplied: request.isReplied,    
          createdAt: request.createdAt        
      })

      setIsOpen(true)
    }

    if (isLoading || isFetching) {
      return (
        <LoadingPage />
      )
    }
    if (error) {
      <FetchErrorCard />
    }

  return (
    <>
    {
      data.length > 0 ? (
      <div className="space-y-3 p-4 z-1">
          {
            data.map((request) => (
              <div
                key={request._id}
                className="h-fit w-full max-w-4xl mx-auto p-6 shadow-md hover:shadow-lg transition-shadow rounded-2xl border border-gray-200 bg-white space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    From: <span className="font-medium text-gray-800">{request.email}</span>
                  </p>
                </div>

                <p className="text-sm text-gray-500">
                  Requesting Tutor for:{" "}
                  <span className="font-semibold text-gray-900">{request.subject}</span>
                </p>

                <div className="text-sm text-gray-500">
                  Message:
                  <p className="mt-1 text-gray-700 leading-relaxed">{request.message}</p>
                </div>

                <p className="text-sm text-gray-500">
                  Level: <span className="font-medium text-gray-800">{request.level}</span>
                </p>

                <div className="flex justify-end pt-2">
                  {
                    request.isReplied ? (
                      <p
                       className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors"
                      >
                        Message Replied
                      </p>
                    ) : (
                      
                    <button
                      onClick={() => handleEmailTabOpen(request)}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors"
                    >
                      Reply
                    </button>
                    )
                  }
                </div>
              </div>
            ))
          }
        {
          isOpen && (
            <ReplyTutorRequest 
              isOpen = {isOpen} 
              setIsOpen = {setIsOpen} 
              currentRequest = {currentRequest}
            />
          )
        }
      </div>
      ) : (
        <EmptyResponse mainMessage="No messages" subMessage="No messages to show for the requested period." />
      )
    }
    </>

  )
}

export default TutorRequests