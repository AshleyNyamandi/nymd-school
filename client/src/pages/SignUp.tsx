
import { AlertCircle, Eye, EyeOff, LogIn } from "lucide-react"
import { Toaster } from "react-hot-toast";
import useSignUp from "../hooks/useSignUp";
import { Link, Navigate } from "react-router";
import useAuth from "../hooks/useAuth";


const SignUp = () => {
    const { email, userId } =  useAuth()
    const {
        handleSubmit,
        handleChange,
        showPassword,
        formData,
        errors,
        signUpMutation,
        setShowPassword,
    } = useSignUp()
  return (
    <>
        {
            email && userId ? (
                <Navigate to="/"replace/>
            ) :
            (
            <div className="px-2 py-10 flex items-center justify-center min-h-screen">
                <Toaster />
                <div className="w-full max-w-sm md:max-w-md  mx-auto flex flex-col gap-5 shadow-lg shadow-gray-400 p-5 rounded-2xl">
                    <form 
                        onSubmit={handleSubmit}
                        className="w-full flex flex-col gap-5"
                    >
                        <div className="flex flex-col gap-3">
                            <label htmlFor="fullName">Full name</label>
                            <input 
                                type="text" 
                                placeholder="John Manyuwa"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-lg border ${
                                    errors.fullName
                                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                } focus:outline-none  transition-all duration-200 bg-white/50 pr-12`}
                                disabled={signUpMutation.isPending}                        
                            />
                            {errors.fullName && (
                                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {errors.fullName}
                                </p>
                            )}                    
                        </div>

                        <div className="flex flex-col gap-3">
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email" 
                                placeholder="johnmanyuwa@gmail.com"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-lg border ${
                                    errors.email
                                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                } focus:outline-none  transition-all duration-200 bg-white/50 pr-12`}
                                disabled={signUpMutation.isPending}                        
                            />
                            {errors.email && (
                                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {errors.email}
                                </p>
                            )}                    
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="password">Password</label>
                            <div className="relative">
                                <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className={`w-full px-4 py-3 rounded-lg border ${
                                    errors.password
                                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                } focus:outline-none  transition-all duration-200 bg-white/50 pr-12`}
                                disabled={signUpMutation.isPending}
                                />
                                <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
                                >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                                </button>
                                {errors.password && (
                                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {errors.password}
                                    </p>
                                )}                    
                            </div>
                        </div>
        
                        <div className="flex flex-col gap-1">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="relative">
                                <input
                                type={showPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                className={`w-full px-4 py-3 rounded-lg border ${
                                    errors.confirmPassword
                                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                } focus:outline-none  transition-all duration-200 bg-white/50 pr-12`}
                                disabled={signUpMutation.isPending}
                                />
                                <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
                                >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                                </button>
                                {errors.confirmPassword && (
                                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {errors.confirmPassword}
                                    </p>
                                )}                    
                            </div>
                        </div>

                        <button
                        type="submit"
                        disabled={signUpMutation.isPending}
                        className="w-full py-3 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                        {signUpMutation.isPending ? (
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
                            Signing Up...
                            </>
                        ) : (
                            <>
                            <LogIn className="w-5 h-5" />
                            Sign Up
                            </>
                        )}
                        </button>                    
                    </form>    
                    <div className="text-center text-sm">
                        <span>
                            Already have an account?
                            <Link
                                to="/sign-in"
                                className="text-sm text-blue-500 hover:text-blue-600"                
                            >
                                Sign in
                            </Link>
                        </span>
                    </div>  
                </div>
            </div>
            )
        }
    </>
  )
}

export default SignUp;