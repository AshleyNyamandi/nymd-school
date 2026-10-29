import { motion } from 'motion/react'
import Header from '../components/Header'
import MainLayout from '../Layout/MainLayout'
import { aLevelSubjects, containerVariants, headerVariants, itemVariants, oLevelSubjects } from '../utils/utils'
import { useNavigate } from 'react-router'
import { nymdServices } from '../constants'
import { ArrowRight } from 'lucide-react'


const Home = () => {

  const navigate =  useNavigate();
  return (
    <MainLayout>
        <Header />
        <div
          className='text-center flex flex-col gap-10 items-center py-10 text-slate-950
                        bg-[url("/images/nymd-bg1.jpeg")] bg-cover bg-center bg-no-repeat relative'
        >
          <div className="w-full max-w-2xl m-2 p-5 rounded-2xl
                          bg-white/70 backdrop-blur-md
                          border border-white/30
                          shadow-lg shadow-black/10"
          >
            <h3 className='text-2xl'>Our Services</h3>
            <p className='text-sm -mt-1'>
              AI powered help, Self-paced learning, 24/7 support and  many more.
            </p>
          <div className="grid grid-cols-1 gap-4 p-6 my-10 sm:grid-cols-2 lg:grid-cols-3">
            {
              nymdServices.map((service, index) => (
                <div key={index}>
                  <button
                    onClick={() => navigate(service.value)}
                    className="group relative w-full overflow-hidden rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 p-6 text-left font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 active:translate-y-0"
                  >
                    {/* Animated shine effect */}
                    <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                    <span className="relative flex items-center justify-between">
                      <span className="text-lg">{service.label}</span>
                      <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </button>
                </div>
              ))
            }

          </div>
                            
                        
          </div>
        </div>

        {/* Resources */}
        <div 
          className='text-center flex flex-col gap-10 items-center py-10 text-slate-950
                        bg-[url("/images/nymd-bg.jpeg")] bg-cover bg-center bg-no-repeat relative'
        >

          <div className="w-full max-w-2xl m-2 p-5 rounded-2xl
                          bg-white/70 backdrop-blur-md
                          border border-white/30
                          shadow-lg shadow-black/10">
            <h3 className='text-2xl'>Get Unlimited Material</h3>
            <p className='text-sm -mt-1'>
              Revision notes, marking schemes,worksheets by topic from past papers e.t.c
            </p>

            <div className="my-10 px-4">
              <motion.h3
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={headerVariants}
                className="text-2xl sm:text-3xl font-extrabold leading-tight text-center"
              >
                What are you preparing for?
              </motion.h3>

              <div className="flex flex-col justify-center items-start gap-10 lg:gap-16 sm:flex-row my-10 max-w-6xl mx-auto">
                {/* O Level Section */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={containerVariants}
                  className="flex-1 max-w-md w-full"
                >
                  <motion.div variants={itemVariants} className="text-center mb-6">
                    <h4 className="text-xl font-extrabold">
                      O Level
                    </h4>
                    <p className="text-sm mt-1">
                      {oLevelSubjects.length} subjects available
                    </p>
                  </motion.div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {oLevelSubjects.map((subject) => (
                      <motion.span
                        key={subject.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${subject.color} hover:shadow-md transition-all duration-200 cursor-pointer`}
                        onClick={() => {
                          navigate(`/level/o-level/subject//${subject.name.toLowerCase()}`);
                        }}
                      >
                        {subject.name}
                      </motion.span>
                    ))}
                    {oLevelSubjects.length === 0 && (
                      <p className="text-sm">No subjects available</p>
                    )}
                  </div>
                </motion.div>

                {/* Divider for mobile */}
                <div className="w-16 h-0.5 bg-white/30 sm:hidden"></div>

                {/* A Level Section */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={containerVariants}
                  className="flex-1 max-w-md w-full"
                >
                  <motion.div variants={itemVariants} className="text-center mb-6">
                    <h4 className="text-xl font-extrabold">
                      A Level
                    </h4>
                    <p className="text-sm mt-1">
                      {aLevelSubjects.length} subjects available
                    </p>
                  </motion.div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {aLevelSubjects.map((subject) => (
                      <motion.span
                        key={subject.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${subject.color} hover:shadow-md transition-all duration-200 cursor-pointer`}
                        onClick={() => {
                          navigate(`/level/a-level/subject/${subject.name.toLowerCase()}`);
                        }}
                      >
                        {subject.name}
                      </motion.span>
                    ))}
                    {aLevelSubjects.length === 0 && (
                      <p className="text-sm">No subjects available</p>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Optional: Show total count */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-8"
              >
                <p className="text-sm" >
                  Total: {oLevelSubjects.length + aLevelSubjects.length} subjects available
                </p>
              </motion.div>
            </div>
          </div>
        </div>
    </MainLayout>
  )
}

export default Home
