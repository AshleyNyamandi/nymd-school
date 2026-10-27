import { useState, useEffect, useRef, type SyntheticEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { requiresPaper, requiresSession, requiresTopic, requiresYear } from "../utils/utils";
import api from "../services/api";
import { aLevelSubjectsData, oLevelSubjectsData } from "../constants";



const useUploadMaterial = () => {
   const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    level: "",
    subject: "",
    type: "",
    year: "",
    topic: "",
    paper: "",
    session: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState({}); 

  // Reset subject when level changes
  useEffect(() => {
    if (formData.subject) {
      setFormData(prev => ({ ...prev, subject: "" }));
    }
  }, [formData.level]);  

  const subjects = {
    "o-level": ["Maths", "Physics", "Chemistry", "Computer Science"], 
    "a-level": ["Maths", "Physics", "Chemistry", "Computer Science", "Statistics"]
  }

  const subjectsData = formData.level === "o-level" ? oLevelSubjectsData : aLevelSubjectsData

  // Validate form
  const validateForm = () => {
    const newErrors: ErrorsType = {};

    if (!formData.level) {
      newErrors.level = "Please select a level";
    }
    if (!formData.subject) {
      newErrors.subject = "Please select a subject";
    }
    if (!formData.type) {
      newErrors.type = "Please select a material type";
    }

    // Validate conditional fields
    if (formData.type) {
      if (requiresYear(formData.type) && !formData.year) {
        newErrors.year = "Please select a year";
      }
      if (requiresTopic(formData.type) && !formData.topic?.trim()) {
        newErrors.topic = "Please enter a topic";
      }
      if (requiresPaper(formData.type) && !formData.paper) {
        newErrors.paper = "Please select a paper number";
      }
      if (requiresSession(formData.type) && !formData.session) {
        newErrors.session = "Please select exam session"
      }
    }

    if (!selectedFile) {
      newErrors.file = "Please select a file to upload";
    } else {
      // Validate file size (50MB max)
      if (selectedFile.size > 50 * 1024 * 1024) {
        newErrors.file = "File size must be less than 50MB";
      }
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        newErrors.file = "File must be PDF, DOC, DOCX, JPG, or PNG";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };  
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Clear file error when user selects a file
      if (errors.file) {
        setErrors((prev) => ({
          ...prev,
          file: "",
        }));
      }
    }
  };  

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user makes a selection
    if (errors[name as keyof ErrorsType]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear related conditional field errors
    if (name === "type") {
      if (requiresYear(value)) {
        setErrors((prev) => ({ ...prev, topic: "", paper: "" }));
      } else if (requiresTopic(value)) {
        setErrors((prev) => ({ ...prev, year: "", paper: "" }));
      }
    }
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };  

  // React Query mutation for file upload
  const uploadMutation = useMutation({
    mutationFn: async (data: {
      file: File;
      level: string;
      subject: string;
      type: string;
      year?: string;
      topic?: string;
      paper?: string;
      session?: string;
    }) => {
      const formDataToSend = new FormData();
      formDataToSend.append("file", data.file);
      formDataToSend.append("level", data.level);
      formDataToSend.append("subject", data.subject);
      formDataToSend.append("type", data.type);
      
      if (data.year) {
        formDataToSend.append("year", data.year);
      }
      if (data.topic) {
        formDataToSend.append("topic", data.topic);
      }
      if (data.paper) {
        formDataToSend.append("paper", data.paper);
      }
      if (data.session) {
        formDataToSend.append("session", data.session)
      }

      const response = await api.post(
        "/subjects/upload-material",
        formDataToSend);
      return response.data;
    },
    onSuccess: () => {
            toast.success("Uploaded successfully", {
              duration: 4000,
              position: "top-center"
            }),
      // Reset form
      setFormData({
        level: "",
        subject: "",
        type: "",
        year: "",
        topic: "",
        paper: "",
        session: ""
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    onError: (error: any) => {
    let errorMessage = "";
    
    if (error.response) {
        errorMessage = error.response.data?.message || "Upload failed. Please try again.";
        setErrors({
        general: errorMessage,
        });
    } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
        setErrors({
        general: errorMessage,
        });
    } else {
        errorMessage = "An unexpected error occurred.";
        setErrors({
        general: errorMessage,
        });
    }
    toast.error(errorMessage, {
        duration: 4000,
        position: "top-center"
    })      
    },
  });

  // Handle form submission
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (validateForm() && selectedFile) {
      uploadMutation.mutate({
        file: selectedFile,
        level: formData.level,
        subject: formData.subject,
        type: formData.type,
        year: formData.year,
        topic: formData.topic,
        paper: formData.paper,
        session: formData.session
      });
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };  

    return  {
      formData,
      setFormData,
      selectedFile,
      setSelectedFile,
      errors,
      setErrors,
      subjectsData,
      validateForm,
      handleFileChange,
      handleChange,
      handleRemoveFile,
      handleSubmit,
      formatFileSize,
      fileInputRef,
      uploadMutation
    }

  }

  export default useUploadMaterial;