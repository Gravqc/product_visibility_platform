export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-10 h-10 border-2 border-gray-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-400 font-serif text-sm animate-pulse tracking-widest uppercase">Processing</p>
      </div>
    </div>
  );
}
