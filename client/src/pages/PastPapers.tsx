
import { useLocation, useParams } from 'react-router';
import { years } from '../utils/utils';
import FolderCard from '../components/FolderCard';
import BackgroundBlobs from '../components/BackgroundBlobs';
import { Helmet } from 'react-helmet-async';

const PastPapers = () => {  
  
  const location = useLocation();
  const {subject = "", level} = useParams()
  
  return (
    <>
      <Helmet>
        <title>Nymd: {`${subject} Past Papers`}</title>
        <meta name="description" content={`Get past papers for Zimsec ${level} ${subject} `} />
      </Helmet>
      <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-800 to-blue-900 px-4 py-12 sm:px-6 lg:px-8">
        <h1 
          className="text-2xl sm:text-3xl font-bold text-indigo-100 text-center">
            {subject.charAt(0).toUpperCase() + subject.slice(1)} {level} Past Papers and Marking Schemes
          </h1>

        <BackgroundBlobs />
            
      <div 
        className='relative max-w-7xl mx-auto px-4 md:px-6 grid p-10 shadow-lg rounded-lg grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4 lg:gap-x-6'>
        {
          years.map((year, index) => (
            <FolderCard 
              link={`${location.pathname}/year/${year.label}`}
              label={year.label}
              index={index}
            />
          ))
        }
      </div>
      </div>
    </>
  )
}

export default PastPapers;