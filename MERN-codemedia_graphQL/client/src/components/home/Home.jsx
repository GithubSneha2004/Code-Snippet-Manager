import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import homeImage from '../../assets/homeimage-removebg-preview.png';
import { Link } from 'react-router-dom';

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true, easing: 'ease-in-out' });
  }, []);

  return (
    <>
      {/* Animated gradient background */}
      <style>{`
        @keyframes gradientBG {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .gradient-background {
          background: linear-gradient(-45deg, #27548A, #DDA853, #183B4E, #F5EEDC);
          background-size: 400% 400%;
          animation: gradientBG 15s ease infinite;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 3rem 1.5rem;
        }

        .floating-image {
          animation: floatUpDown 5s ease-in-out infinite;
          border-radius: 1.5rem;
          box-shadow: 0 15px 40px rgba(37, 84, 138, 0.4);
        }

        @keyframes floatUpDown {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        .pulse-button {
          animation: pulse 2.5s infinite;
          transition: background-color 0.3s ease;
        }
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 8px 2px rgba(221, 168, 83, 0.6);
          }
          50% {
            box-shadow: 0 0 14px 5px rgba(221, 168, 83, 0.9);
          }
        }
      `}</style>

      <section className="gradient-background" data-testid="home-section">
        <div
          className="max-w-4xl w-full flex flex-col items-center text-center text-white"
          style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
        >
          {/* Image with floating animation */}
          <div data-aos="fade-down" data-aos-delay="200">
            <img
              src={homeImage}
              alt="Code Snippet Illustration"
              className="floating-image"
              style={{ maxWidth: 320, width: '90%', marginBottom: 40 }}
            />
          </div>

          {/* Text block with staggered fade-up */}
          <h1
            data-aos="fade-up"
            data-aos-delay="400"
            style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: 20, color: '#F5EEDC' }}
          >
            Code Snippet Manager
          </h1>

          <p
            data-aos="fade-up"
            data-aos-delay="600"
            style={{ fontSize: '1.25rem', lineHeight: 1.7, maxWidth: 600, marginBottom: 16, color: '#DDA853' }}
          >
            Welcome to <strong>Code Snippet Manager</strong>, the ultimate tool for organizing and storing your code snippets.
          </p>

          <p
            data-aos="fade-up"
            data-aos-delay="800"
            style={{ fontSize: '1.125rem', maxWidth: 600, marginBottom: 32, color: '#F5EEDC' }}
          >
            Whether you're a developer, designer, or hobbyist, our app helps you keep your code snippets organized and accessible.
          </p>

          {/* Call to Action Button with pulse */}
          <Link
            to="/signup"
            data-aos="zoom-in"
            data-aos-delay="1000"
            className="pulse-button"
            style={{
              backgroundColor: '#DDA853',
              color: '#183B4E',
              padding: '14px 40px',
              borderRadius: 9999,
              fontWeight: '700',
              fontSize: '1.25rem',
              textDecoration: 'none',
              boxShadow: '0 0 10px rgba(221, 168, 83, 0.7)',
              userSelect: 'none',
              cursor: 'pointer',
              display: 'inline-block',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#C19439')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#DDA853')}
          >
            Get Started
          </Link>
        </div>
      </section>
    </>
  );
}
