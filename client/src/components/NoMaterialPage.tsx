import { OctagonAlert } from "lucide-react"


const NoMaterialPage = () => {
  return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200 max-w-md mx-auto">
            {/* Empty State Vector Illustration */}
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
            <OctagonAlert size={30} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No Material Yet</h3>
            <p className="text-sm text-gray-500 max-w-xs">Check back later we will have you covered.</p>
        </div>
  )
}

export default NoMaterialPage