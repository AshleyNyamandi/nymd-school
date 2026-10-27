const FetchErrorCard = () => {
  return (
    <div className="my-10">
        <div className="max-w-4xl mx-auto text-center px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
            Unable to fetch your request
            </h3>
            <p className="text-red-600 mb-4">
            'Please try again later.'
            </p>
            <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer transition-colors duration-200"
            >
            Retry
            </button>
        </div>
        </div>
    </div>  
  )
}

export default FetchErrorCard;