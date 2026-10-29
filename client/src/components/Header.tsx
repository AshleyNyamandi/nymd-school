import { motion } from "motion/react";
import BackgroundBlobs from "./BackgroundBlobs";

const Header = () => {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-indigo-900 via-purple-800 to-blue-900 min-h-full">
      <BackgroundBlobs />

      <div className="relative mx-auto flex min-h-screen items-center justify-center px-6 py-20 sm:px-8 lg:px-12">
        <div className="max-w-3xl flex flex-col items-center">

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
            }}
            className="mt-8 text-2xl font-extrabold leading-tight text-white sm:text-3xl lg:text-4xl"
          >
            Nymd. Your Online tutor
            <br />
            <span className="text-yellow-300">
              for O & A Level ZIMSEC
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
            }}
            className="mt-6 max-w-2xl text-lg leading-8 text-gray-100 sm:text-sm text-center"
          >
            Prepare for your exams in the comfort of your home.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
            }}
            className="mt-6 max-w-2xl text-lg leading-8 text-yellow-300 sm:text-xl text-center"
          >
            Sign in and get 24/7 support
          </motion.p>          

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.8,
            }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Header;