import { ChevronLeft, ChevronRight, Clock, Mail, ShieldAlert, ShieldCheck, UserIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { User } from "..";
import { roleStyles } from "../constants";
import { cn } from "../utils/utils";

export const RoleBadge = ({ role }: { role: User["role"] }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
      roleStyles[role] || "bg-gray-100 text-gray-600"
    }`}
  >
    <ShieldCheck className="h-3 w-3" />
    {role}
  </span>
);

// ---------- Stat card  ----------
export const StatCard = ({ icon: Icon, title, value, bgLight, textColor }: { icon: LucideIcon; title: string; value: ReactNode; bgLight: string; textColor: string }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <div className="flex items-center justify-between">
      <div className={`${bgLight} p-3 rounded-lg`}>
        <Icon className={textColor} size={24} />
      </div>
    </div>
    <div className="mt-4">
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
        {value}
      </h3>
      <p className="text-sm text-gray-600 mt-1">{title}</p>
    </div>
  </div>
);

// ---------- Filter pill ----------
export const FilterPill = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) => (
  <button
    onClick={onClick}
    className={cn("rounded-full px-3.5 py-1.5 text-sm font-medium transition",
      active
        ? "bg-blue-500 text-white shadow-sm"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
  >
    {children}
  </button>
);

// ---------- User card ----------
export const UserCard = ({ user }: { user: User }) => (
  <div className="bg-white rounded-xl shadow-sm hover:shadow-md p-5 border border-gray-100 transition-all duration-300">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <UserIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">
            {user.fullName}
          </h3>
          <p className="flex items-center gap-1 text-sm text-gray-500 truncate">
            <Mail className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{user.email}</span>
          </p>
        </div>
      </div>
      <RoleBadge role={user.role} />
    </div>

    {user.bio && (
      <p className="mt-3 line-clamp-2 text-sm text-gray-600">{user.bio}</p>
    )}

    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
      <span
        className={`inline-flex items-center gap-1 text-xs font-medium ${
          user.isVerified ? "text-emerald-600" : "text-amber-600"
        }`}
      >
        {user.isVerified ? (
          <ShieldCheck className="h-3.5 w-3.5" />
        ) : (
          <ShieldAlert className="h-3.5 w-3.5" />
        )}
        {user.isVerified ? "Verified" : "Unverified"}
      </span>
      <span className="flex items-center gap-1 text-xs text-gray-400">
        <Clock className="h-3.5 w-3.5" />
        {new Date(user.createdAt).toLocaleDateString()}
      </span>
    </div>
  </div>
);

// ---------- Pagination ----------
export const Pagination = ({ page, pages, onPageChange }: { page: number; pages: number; onPageChange: (page: number) => void }) => {
  if (pages <= 1) return null;

  const getPageNumbers = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots: (number | "...")[] = [];
    let l;

    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || (i >= page - delta && i <= page + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) rangeWithDots.push(l + 1);
        else if (i - l !== 1) rangeWithDots.push("...");
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  };

  return (
    <div className="mt-8 flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-100 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {getPageNumbers().map((p, idx) =>
        p === "..." ? (
          <span
            key={`dots-${idx}`}
            className="px-2 text-sm text-gray-400 select-none"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium transition ${
              p === page
                ? "bg-blue-500 text-white shadow-sm"
                : "border border-gray-100 bg-white text-gray-600 shadow-sm hover:bg-gray-50 hover:shadow-md"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-100 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};
