import React from 'react';
import { Link } from 'react-router-dom';
import homeImage from '../../assets/homeimage-removebg-preview.png';
import './home.css';

export default function Home() {
  return (
    <section className="bg-white dark:bg-gray-900 py-16">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center justify-between px-6">
        
        {/* Left Side - Text */}
        <div className="w-full lg:w-1/2 mt-10 lg:mt-0">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 text-center lg:text-left">
            <span className="text-blue-600">Code Snippet Manager</span>
          </h1>
          <p className="mb-4 text-gray-700 dark:text-gray-300 text-lg text-justify">
            Welcome to <strong>Code Snippet Manager</strong>, the ultimate tool for organizing and storing your code snippets. Whether you're a developer, designer, or hobbyist, our app will help you keep your code snippets organized and easily accessible.
          </p>
          <p className="mb-6 text-gray-700 dark:text-gray-300 text-lg text-justify">
            Start managing your code snippets today and experience the benefits of an efficient workflow. Sign up or log in to get started!
          </p>
          <div className="text-center lg:text-left">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg transition duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src={homeImage}
            alt="Code Snippet Illustration"
            className="max-w-full h-auto rounded-xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
