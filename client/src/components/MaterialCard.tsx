import { Link } from "react-router";
import NoMaterialPage from "./NoMaterialPage";

import type { Material } from "..";

const MaterialCard = ({data}: {data: Material[]}) => {
  return (
    <>
            {data.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {data.map(subject => (
                        <div 
                            key={subject._id} 
                            className="flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                        >
                            {/* Card Accent Top Banner */}
                            <div className="h-2 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />
                            
                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                    {/* Material & Level Header Tags */}
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        <span className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded-md uppercase tracking-wider">
                                            {subject.materialType || 'Material'}
                                        </span>
                                        <span className="px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md">
                                            Level: {subject.level}
                                        </span>
                                    </div>

                                    {/* Subject Title */}
                                    <h3 className="text-xl font-bold text-gray-800 tracking-tight mb-2 capitalize group-hover:text-indigo-600 transition-colors duration-200">
                                        {subject.subject} 
                                    </h3>

                                    {/* Paper Info Row */}
                                    <p className="text-sm font-medium text-gray-500 mb-4 flex items-center gap-1.5">
                                        <span className="font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded text-xs">
                                            Paper {subject.paper || 'N/A'}
                                        </span>
                                    </p>
                                </div>

                                <div>
                                    {/* Academic Timeline Information Box */}
                                    <div className="grid grid-cols-2 gap-2 py-3 px-3 bg-gray-50 rounded-xl mb-4 text-xs font-medium text-gray-600">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Year</span>
                                            <span className="text-gray-800 font-semibold">{subject.year || "—"}</span>
                                        </div>
                                        <div className="flex flex-col border-l border-gray-200 pl-3">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Session</span>
                                            <span className="text-gray-800 font-semibold truncate capitalize">{subject.session || "—"}</span>
                                        </div>
                                    </div>

                                    {/* Download Action Button */}
                                    {subject.fileUrl ? (
                                        <Link 
                                            to={subject.fileUrl}
                                            rel="noopener noreferrer" 
                                            className="w-full py-2.5 px-4 bg-gray-900 hover:bg-indigo-600 text-white font-medium text-sm rounded-xl text-center flex items-center justify-center gap-2 transition-all duration-200 shadow-sm"
                                        >
                                            {/* Inline SVG Document Icon */}
                                            <svg xmlns="http://w3.org" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            View Resource
                                        </Link>
                                    ) : (
                                        <button 
                                            disabled 
                                            className="w-full py-2.5 px-4 bg-gray-100 text-gray-400 font-medium text-sm rounded-xl cursor-not-allowed text-center"
                                        >
                                            No File Available
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <NoMaterialPage />
            )}    
    </>
  )
}

export default MaterialCard;