// Unauthorized.jsx
import { useNavigate } from 'react-router';

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-linear-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-10 text-center shadow-2xl border border-slate-900/5 dark:border-white/5 animate-fade-up">
        {/* Icon */}
        <div className="w-18 h-18 mx-auto mb-6 flex items-center justify-center rounded-full bg-linear-to-br from-red-100 to-red-200 dark:from-red-500/20 dark:to-red-500/10 text-red-600 dark:text-red-400">
          <svg
            className="w-9 h-9"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        {/* Code */}
        <p className="text-xs font-bold tracking-[0.15em] text-red-600 dark:text-red-400 mb-2">
          403
        </p>

        {/* Title */}
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">
          Access Denied
        </h1>

        {/* Message */}
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
          You don't have permission to view this page. If you believe this is a
          mistake, please contact your administrator.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/20"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-transparent text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;