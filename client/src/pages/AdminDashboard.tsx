import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Link } from "react-router";
import {
  FileText,
  ClipboardCheck,
} from "lucide-react";


import LoadingPage from "../components/Loading";
import FetchErrorCard from "../components/FetchError";
import { fetchStats } from "../utils/utils";

const AdminDashboard = () => {


 const { data: statsData, error: statsError, isPending: statsPending } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
  });

  const stats = useMemo(() => {
    
    if (!statsData) return [];
    
    return [
      {
        title: "Total O level Papers",
        value: statsData.OlevelQp || 0,
        icon: FileText,
        color: "bg-blue-500",
        bgLight: "bg-blue-50",
        textColor: "text-blue-600",
      },
      {
        title: "O level Marking Schemes",
        value: statsData.OlevelMs || 0,
        icon: ClipboardCheck,
        color: "bg-emerald-500",
        bgLight: "bg-emerald-50",
        textColor: "text-emerald-600",
      },
      {
        title: "Total A level Papers",
        value: statsData.AlevelQp || 0,
        icon: FileText,
        color: "bg-blue-500",
        bgLight: "bg-blue-50",
        textColor: "text-blue-600",
        change: "+12 this month",
      },
      {
        title: "A level Marking Schemes",
        value: statsData.AlevelMs || 0,
        icon: ClipboardCheck,
        color: "bg-emerald-500",
        bgLight: "bg-emerald-50",
        textColor: "text-emerald-600",
      },
      {
        title: "Total Papers",
        value: (statsData.OlevelQp || 0) + (statsData.AlevelQp || 0),
        icon: FileText,
        color: "bg-blue-500",
        bgLight: "bg-blue-50",
        textColor: "text-blue-600",
      },
      {
        title: "Marking Schemes",
        value: (statsData.OlevelMs || 0) + (statsData.AlevelMs || 0),
        icon: ClipboardCheck,
        color: "bg-emerald-500",
        bgLight: "bg-emerald-50",
        textColor: "text-emerald-600",
      },
    ];
  }, [statsData]);

  // Loading state
  if (statsPending) {
    return (
      <LoadingPage />
    );
  }

  // // Error state
  if (statsError) {
    return (
      <FetchErrorCard />
    );
  }

  return (
    <>
          {/* Page Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
            <p className="text-sm text-gray-500 mt-1">
              Overview of your learning platform
            </p>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat) => (
              <Link
                to={stat.title.toLowerCase().replaceAll(" ", "-")}
                key={stat.title}
                className="bg-white rounded-xl shadow-sm hover:shadow-md p-6 border border-gray-100 hover:scale-105 cursor-pointer transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className={`${stat.bgLight} p-3 rounded-lg`}>
                    <stat.icon className={`${stat.textColor}`} size={24} />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
                </div>
              </Link>
            ))}
          </div>
   
    </>
  )
};

export default AdminDashboard;