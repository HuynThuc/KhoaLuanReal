import React from 'react';

const ThankYouComponent = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div>
        <div className="flex flex-col items-center space-y-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-40 w-40 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="text-5xl font-bold">Thank You!</h1>
          <p className="text-lg text-center">Thank you for your interest! Check your email for a link to the guide.</p>
          <a
            href="/"
            className="inline-flex items-center rounded border border-indigo-600 bg-indigo-600 px-6 py-3 text-lg text-white hover:bg-indigo-700 focus:outline-none focus:ring"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span className="text-lg font-medium"> Home </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ThankYouComponent;
