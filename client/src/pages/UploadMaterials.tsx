import {
  Upload,
  FileText,
  X,
  AlertCircle,
  BookOpen,
  GraduationCap,
  Calendar,
  Tag,
  File,
  ChevronDown,
} from "lucide-react";
import { Toaster } from 'react-hot-toast';

import { levels, types, paperOptions, sessions } from "../constants";
import { years, requiresPaper, requiresTopic, requiresYear, cn, requiresSession } from "../utils/utils";
import useUploadMaterial from "../hooks/useUploadMaterial";


export interface UploadFormData {
  level: string;
  subject: string;
  type: string;
  year: string;
  paper: string;
  topic: string;
  session: string;
}

export type UploadFormErrors = Partial<Record<keyof UploadFormData | "file", string>>;



const UploadMaterials = () => {
  const {
      formData,
      selectedFile,
      errors,
      subjectsData,
      fileInputRef,
      uploadMutation,
      handleFileChange,
      handleChange,
      handleRemoveFile,
      handleSubmit,
      formatFileSize
    } = useUploadMaterial()


  return (
      <div>
        <Toaster />
        <div className="relative max-w-2xl mx-auto z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-indigo-100 to-purple-100 mb-4 shadow-md text-black">
              <Upload className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Upload Material
            </h1>
            <p className="mt-2 text-sm">
              Upload past papers, marking schemes, and study notes
            </p>
          </div>

          {/* Main Form Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Level Selection - Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2"
                      htmlFor="level"
                >
                  Level <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className={cn("w-full px-4 py-3 rounded-xl border-2 cursor-pointer border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none focus:ring-2 transition-all duration-200 bg-white/50 appearance-none pr-12", errors.level && "border-red-300 focus:ring-red-500 focus:border-red-500")}
                  > 
                    <option disabled className="text-center" value="">Select level</option>
                    {levels.map((level) => (
                      <option className="text-center cursor-pointer" key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {errors.level && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {errors.level}
                  </p>
                )}
              </div>

              {/* Subject Selection - Dropdown - Only shows when level is selected */}
              {formData.level && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="subject">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={cn("w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-200 bg-white/50 appearance-none pr-12 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500", errors.subject && "border-red-300 focus:ring-red-500 focus:border-red-500")}
                    >
                      <option value="" className="text-center">
                        "Select Subject"
                      </option>
                      {(
                        subjectsData.map((subject: string, index: number) => (
                          <option className="text-center" key={index} value={subject}>
                            {subject}
                          </option>
                        ))
                      )}
                    </select>
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.subject && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {errors.subject}
                    </p>
                  )}
                </div>
              )}

              {/* Material Type Selection - Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Material Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className={cn("w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-200 bg-white/50 appearance-none pr-12 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500", errors.type && "border-red-300 focus:ring-red-500 focus:border-red-500")}
                  >
                    <option disabled className="text-center" value="">Select Material Type</option>
                    {types.map((type) => (
                      <option className="text-center" key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {errors.type && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {errors.type}
                  </p>
                )}
              </div>

              {/* Conditional Fields: Year, Paper, session, Topic */}
              {formData.type && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  {requiresYear(formData.type) && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Year <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="year"
                          value={formData.year || ""}
                          onChange={handleChange}
                          className={cn("w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-200 bg-white/50 appearance-none pr-12 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500", errors.year && "border-red-300 focus:ring-red-500 focus:border-red-500")}
                        >
                          <option className="text-center" disabled value="">Select Year</option>
                          {years.map((year) => (
                            <option className="text-center" key={year.value} value={year.value}>
                              {year.label}
                            </option>
                          ))}
                        </select>
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                      {errors.year && (
                        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                          <AlertCircle className="w-4 shrink-0" />
                          {errors.year}
                        </p>
                      )}
                    </div>
                  )}

                  {requiresPaper(formData.type) && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Paper Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="paper"
                          value={formData.paper || ""}
                          onChange={handleChange}
                          className={cn("w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-200 bg-white/50 appearance-none pr-12 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500", errors.paper && "border-red-300 focus:ring-red-500 focus:border-red-500")}
                        >
                          <option className="text-center" disabled value="">Select Paper</option>
                          {paperOptions.map((paper) => (
                            <option className="text-center" key={paper.value} value={paper.value}>
                              {paper.label}
                            </option>
                          ))}
                        </select>
                        <File className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                      {errors.paper && (
                        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          {errors.paper}
                        </p>
                      )}
                    </div>
                  )}

                  {requiresTopic(formData.type) && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Topic <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="topic"
                          value={formData.topic || ""}
                          onChange={handleChange}
                          placeholder="Enter the topic (e.g., Quadratic Equations)"
                          className={cn("w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-200 bg-white/50 pl-12 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500", errors.topic && "border-red-300 focus:ring-red-500 focus:border-red-500")}
                        />
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                      {errors.topic && (
                        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          {errors.topic}
                        </p>
                      )}
                    </div>
                  )}

                  {requiresSession(formData.type) && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Exam Session <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="session"
                          value={formData.session || ""}
                          onChange={handleChange}
                          className={cn("w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-200 bg-white/50 appearance-none pr-12 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500", errors.session && "border-red-300 focus:ring-red-500 focus:border-red-500")}
                        >
                          <option className="text-center" disabled value="">Select Session</option>
                          {sessions.map((session) => (
                            <option className="text-center" key={session.value} value={session.value}>
                              {session.label}
                            </option>
                          ))}
                        </select>
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                      {errors.session && (
                        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                          <AlertCircle className="w-4 shrink-0" />
                          {errors.session}
                        </p>
                      )}
                    </div>
                  )}               
                </div>
              )}

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  File <span className="text-red-500">*</span>
                </label>
                {!selectedFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-200 cursor-pointer group"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3 group-hover:text-indigo-500 transition-colors" />
                    <p className="text-sm text-gray-600">
                      <span className="text-indigo-600 font-medium group-hover:text-indigo-700 transition-colors">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, DOC, DOCX, JPG, or PNG (max. 10MB)
                    </p>
                  </div>
                ) : (
                  <div className="border-2 border-indigo-200 bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <FileText className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(selectedFile.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-1.5 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors duration-200"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                />
                {errors.file && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {errors.file}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={uploadMutation.isPending}
                className="w-full py-3.5 px-4 bg-linear-to-r cursor-pointer from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {uploadMutation.isPending ? (
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
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload Material
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
  );
};

export default UploadMaterials;