import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-blue-50">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-pink-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/" className="bg-gradient-to-r from-pink-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-pink-700 hover:to-blue-700 transition-colors inline-block">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
