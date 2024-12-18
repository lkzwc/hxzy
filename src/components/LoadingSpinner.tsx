export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <div className="mt-4 text-primary text-center">加载中...</div>
      </div>
    </div>
  );
} 