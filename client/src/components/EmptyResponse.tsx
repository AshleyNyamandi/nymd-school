const EmptyResponse = ({mainMessage, subMessage} : {mainMessage:string, subMessage:string}) => {
  return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200 max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <svg xmlns="http://w3.org" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">{mainMessage}</h3>
            <p className="text-sm text-gray-500 max-w-xs">{subMessage}</p>
        </div>
  )
}

export default EmptyResponse