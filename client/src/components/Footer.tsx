import { Link } from "react-router";
import BackgroundBlobs from "./BackgroundBlobs";

const Footer = () => {
  return (
      <footer className="relative overflow-hidden bg-linear-to-br from-indigo-900 via-purple-800 to-blue-900">
        <BackgroundBlobs />

        <div className="relative mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand Section */}
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-xl font-bold text-white">Nymd</h3>
              <p className="mt-3 text-sm leading-6 text-gray-300">
                Your trusted online tutor O & A Level examinations.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-lg">🇿🇼</span>
                <span className="text-sm text-gray-300">Zimbabwe</span>
              </div>
            </div>

            {/* Courses Section */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-yellow-300">
                Courses
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    to="/"
                    className="text-sm text-gray-300 transition hover:text-white"
                  >
                    O Level
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-sm text-gray-300 transition hover:text-white"
                  >
                    A Level
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Section */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-yellow-300">
                Support
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    to="/tutor-support"
                    className="text-sm text-gray-300 transition hover:text-white"
                  >
                    Tutor Support
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-sm text-gray-300 transition hover:text-white"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Section */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-yellow-300">
                Resources
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    to="/"
                    className="text-sm text-gray-300 transition hover:text-white"
                  >
                    Past Papers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-sm text-gray-300 transition hover:text-white"
                  >
                    Revision Notes
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-10 border-t border-white/10 pt-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()} Nymd. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link
                  to="/privacy"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
  );
};

export default Footer;