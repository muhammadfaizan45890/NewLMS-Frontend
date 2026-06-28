import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search, Compass } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-12 overflow-x-hidden bg-white dark:bg-black">
      {/* Decorative gradient blobs – subtle gray */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-100/50 dark:bg-gray-800/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-100/50 dark:bg-gray-800/30 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md mx-auto text-center px-2">
        {/* 404 Number */}
        <div className="mb-4 sm:mb-6">
          <div className="text-7xl xs:text-8xl sm:text-9xl md:text-[10rem] lg:text-[12rem] font-bold leading-none tracking-tight text-black dark:text-white">
            404
          </div>
          <div className="h-1 w-16 xs:w-20 sm:w-24 mx-auto bg-black dark:bg-white rounded-full mt-2" />
        </div>

        {/* Icon – responsive sizing */}
        <div className="flex justify-center mb-3 sm:mb-4">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-2.5 xs:p-3 sm:p-4">
            <Compass className="h-7 w-7 xs:h-8 xs:w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-black dark:text-white" />
          </div>
        </div>

        <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black dark:text-white mb-2 sm:mb-3">
          Page Not Found
        </h2>
        <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-sm mx-auto px-2">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action buttons – stack on mobile, row on larger */}
        <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 justify-center items-center w-full max-w-xs mx-auto">
          <Link to="/" className="w-full xs:w-auto">
            <Button className="w-full xs:w-auto bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] text-sm xs:text-base px-4 py-2 h-auto">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link to="/courses" className="w-full xs:w-auto">
            <Button variant="outline" className="w-full xs:w-auto border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-colors text-sm xs:text-base px-4 py-2 h-auto">
              <Compass className="mr-2 h-4 w-4" />
              Browse Courses
            </Button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full xs:w-auto inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 disabled:pointer-events-none disabled:opacity-50 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </button>
        </div>

        {/* Search suggestion – fully wrapped tags */}
        <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center justify-center gap-2">
            <Search className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
            <span>Looking for something?</span>
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center px-2">
            {['Classified', 'Satellite', 'Covert', 'Cyber'].map((term) => (
              <Link
                key={term}
                to={`/intel?q=${encodeURIComponent(term)}`}
                className="text-[10px] xs:text-xs px-2.5 py-1 xs:px-3 xs:py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white transition-colors duration-200"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;