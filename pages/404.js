import Link from "next/link";

export default function Custom404() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
      <p className="text-gray-400 text-lg mb-8 text-center max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-[#FF5154] text-white rounded-lg hover:bg-[#ff3333] transition-colors font-medium"
      >
        Back to Home
      </Link>
    </div>
  );
}
