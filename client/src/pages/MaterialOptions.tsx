import { useLocation } from "react-router"
import BackgroundBlobs from "../components/BackgroundBlobs"
import FolderCard from "../components/FolderCard"


const materialOptions = [
    {
        label: "Past Papers",
        value: "past-papers"
    },
    {
        label: "Notes",
        value: "notes"
    },    
    {
        label: "Revision Questions",
        value: "revision-questions"
    }
]


const MaterialOptions = () => {

    const location = useLocation();
  return (
      <div 
        className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-800 to-blue-900 px-4 py-12 sm:px-6 lg:px-8">
            <BackgroundBlobs />
            <div className="relative">
                <div 
                    className='relative max-w-7xl mx-auto px-4 md:px-6 grid p-10 shadow-lg rounded-lg grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4 lg:gap-x-6'>
                        {
                            materialOptions.map((materialOption, index) => (
                                <FolderCard 
                                    key={index}
                                    label={materialOption.label}
                                    link={`${location.pathname}/${materialOption.value}`}
                                />
                            ))
                        }

                </div>                
            </div>
    </div>
  )
}

export default MaterialOptions