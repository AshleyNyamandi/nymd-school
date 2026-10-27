
const BackgroundBlobs = () => {
  return (
    <div>
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-400/10 blur-3xl" />
        <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-blue-300/10 blur-3xl" />
      </div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.03)_1px,transparent_1px)] bg-size-[40px_40px]" />        
    </div>
  )
}

export default BackgroundBlobs;