import { Menu, X } from "lucide-react"
import { Link, NavLink, useNavigate } from "react-router"
import { navLinks } from "../constants"
import useAuth from "../hooks/useAuth"
import { useState } from "react"
import { cn } from "../utils/utils"
import toast, { Toaster } from "react-hot-toast"
import { QueryClient, useMutation } from "@tanstack/react-query"
import api from "../services/api"

const Navbar = () => {
    const navigate = useNavigate()
    const [isNavOpen, setIsNavOpen] = useState(false)
    const { email, userId } = useAuth()

    const queryClient = new QueryClient()


    const handleLinkClick = () => {
        setIsNavOpen(false)
    }

    const handleSignOut = () => {
        signOutMutation.mutate()
    }

    const signOutMutation = useMutation({
        mutationFn: async () => {
            const response = await api.post("/auth/sign-out")
            return response.data
        },
        onSuccess: (data) => {
            toast(data.message);
            queryClient.invalidateQueries({ queryKey: ["user"] });
            navigate("/");

        },
        onError: (error) => {
            toast.error(error.message)
        }
    })    

    return (
        <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
            <Toaster />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="font-bold text-xl text-emerald-600"
                        aria-label="logo"
                        onClick={handleLinkClick}
                    >
                        <span className="whitespace-nowrap">Nymd</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((navLink, index) => (
                            <NavLink
                                key={index}
                                to={navLink.href}
                                className={({ isActive }) =>
                                    cn(
                                        "text-gray-700 hover:text-emerald-600 transition-colors font-medium",
                                        isActive && "text-emerald-600"
                                    )
                                }
                            >
                                {navLink.label}
                            </NavLink>
                        ))}
                        
                        {email && userId? (
                            <>
                                <div className="flex items-center gap-4 ml-auto">
                                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">
                                        {email?.length > 0 ? email[0].toUpperCase() : "N/A"}
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleSignOut}
                                    className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/sign-in"
                                    className="px-4 py-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/sign-up"
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => setIsNavOpen(prev => !prev)}
                        aria-label="Toggle menu"
                    >
                        {isNavOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            {isNavOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsNavOpen(false)}
                />
            )}

            {/* Mobile Navigation Menu */}
            <div
                className={cn(
                    "fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out",
                    isNavOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex flex-col h-full pt-16 px-4">
                    {/* Close button */}
                    <button
                        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => setIsNavOpen(false)}
                        aria-label="Close menu"
                    >
                        <X size={24} />
                    </button>

                    {/* Navigation Links */}
                    <div className="flex flex-col gap-1">
                        {navLinks.map((navLink, index) => (
                            <NavLink
                                key={index}
                                to={navLink.href}
                                className={({ isActive }) =>
                                    cn(
                                        "px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium",
                                        isActive && "bg-gray-100 text-emerald-600"
                                    )
                                }
                                onClick={handleLinkClick}
                            >
                                {navLink.label}
                            </NavLink>
                        ))}
                    </div>

                    <div className="mt-auto pb-8 border-t pt-4">
                        {email && userId ? (
                            <>
                                <div className="flex items-center gap-4 ml-auto">
                                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">
                                        {email?.length > 0 ? email[0].toUpperCase() : "N/A"}
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleSignOut}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-100 rounded-lg transition-colors font-medium">
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Link
                                    to="/sign-in"
                                    className="w-full px-4 py-3 text-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                    onClick={handleLinkClick}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/sign-up"
                                    className="w-full px-4 py-3 text-center bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                                    onClick={handleLinkClick}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar