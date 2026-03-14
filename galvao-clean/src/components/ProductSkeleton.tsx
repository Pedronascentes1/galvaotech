export default function ProductSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow animate-pulse">
      
      <div className="w-full aspect-square bg-gray-200 rounded-xl mb-4" />

      <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />

      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />

      <div className="h-4 bg-gray-200 rounded w-full mb-4" />

      <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />

      <div className="h-10 bg-gray-200 rounded-lg w-full" />

    </div>
  )
}