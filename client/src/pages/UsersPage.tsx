// components/AdminDashboard.jsx
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import {
  Users,
  ShieldCheck,
  User as UserIcon,
  Loader2,
  Search,
} from "lucide-react";
import api from "../services/api";
import { FilterPill, Pagination, StatCard, UserCard } from "../components/Cards";


const UsersManagement = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all"); // all | verified | unverified
  const [role, setRole] = useState("all"); // all | teacher | student | admin
  const [search, setSearch] = useState("");
  const limit = 9;

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["users", { page, limit, status, role, search }],
    queryFn: async () => {
      const response = await api.get("/users", {
        params: { page, limit, status, role, search }
      })
      return response.data.data || []
    },
    placeholderData: keepPreviousData,
  });

  const users = data?.users ?? [];
  const total = data?.total ?? 0;
  const pages = data?.pages ?? 1;

  const handleStatusChange = (val) => {
    setStatus(val);
    setPage(1);
  };
  const handleRoleChange = (val) => {
    setRole(val);
    setPage(1);
  };
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // if (isLoading) return <LoadingPage />;
  // if (isError) return <FetchErrorCard error={error} />;

  return (
    <>
      {/* Page Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Users</h2>
        <p className="text-sm text-gray-500 mt-1">
          {total} user{total !== 1 ? "s" : ""} found
          {status !== "all" && ` · ${status}`}
          {role !== "all" && ` · ${role}s`}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <StatCard
          icon={Users}
          title="Total Users"
          value={total}
          bgLight="bg-blue-50"
          textColor="text-blue-600"
        />
        <StatCard
          icon={ShieldCheck}
          title="Verified"
          value={status === "verified" ? total : "—"}
          bgLight="bg-emerald-50"
          textColor="text-emerald-600"
        />
        <StatCard
          icon={UserIcon}
          title="Teachers"
          value={role === "teacher" ? total : "—"}
          bgLight="bg-blue-50"
          textColor="text-blue-600"
        />
        <StatCard
          icon={UserIcon}
          title="Students"
          value={role === "student" ? total : "—"}
          bgLight="bg-emerald-50"
          textColor="text-emerald-600"
        />
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        {/* Status filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Status
          </span>
          <div className="flex flex-wrap gap-2">
            <FilterPill
              active={status === "all"}
              onClick={() => handleStatusChange("all")}
            >
              All
            </FilterPill>
            <FilterPill
              active={status === "verified"}
              onClick={() => handleStatusChange("verified")}
            >
              Verified
            </FilterPill>
            <FilterPill
              active={status === "unverified"}
              onClick={() => handleStatusChange("unverified")}
            >
              Unverified
            </FilterPill>
          </div>
        </div>

        <div className="hidden h-6 w-px bg-gray-200 sm:block" />

        {/* Role filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Role
          </span>
          <div className="flex flex-wrap gap-2">
            <FilterPill
              active={role === "all"}
              onClick={() => handleRoleChange("all")}
            >
              All
            </FilterPill>
            <FilterPill
              active={role === "teacher"}
              onClick={() => handleRoleChange("teacher")}
            >
              Teachers
            </FilterPill>
            <FilterPill
              active={role === "student"}
              onClick={() => handleRoleChange("student")}
            >
              Students
            </FilterPill>
            <FilterPill
              active={role === "admin"}
              onClick={() => handleRoleChange("admin")}
            >
              Admins
            </FilterPill>
          </div>
        </div>

        {/* Search */}
        <div className="relative ml-auto w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search name or email…"
            className="w-full rounded-lg border border-gray-100 bg-white py-2 pl-9 pr-3 text-sm text-gray-800 placeholder-gray-400 outline-none shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {isFetching && (
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        )}
      </div>

      {/* Users Grid */}
      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Users className="h-10 w-10" />
          <p className="mt-2 text-sm">No users match your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination page={page} pages={pages} onPageChange={setPage} />
    </>
  );
};

export default UsersManagement;