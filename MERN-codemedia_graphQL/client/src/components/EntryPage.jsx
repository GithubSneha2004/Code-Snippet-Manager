import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RamaiahLogo from '../assets/ramaiah-logo.png';

export default function EntryPage() {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation on mount
    setFadeIn(true);
  }, []);

  const handleStudentClick = () => navigate('/join');
  const handleProfessorClick = () => navigate('/home');

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        opacity: fadeIn ? 1 : 0,
        transition: 'opacity 1s ease-in',
      }}
    >
      {/* Left side: logo and text */}
      <div
        style={{
          flex: 1,
          backgroundColor: '#F5EEDC',
          color: '#183B4E',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <img
          src={RamaiahLogo}
          alt="Ramaiah Institute of Technology"
          style={{ width: '180px', marginBottom: '1rem' }}
        />
        <h1 style={{ fontSize: '2.8rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Ramaiah Institute of Technology
        </h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '320px', lineHeight: '1.4' }}>
          Welcome to Code-Media, your platform for collaborative coding and sharing.
        </p>
      </div>

      {/* Right side: buttons */}
      <div
        style={{
          flex: 1,
          backgroundColor: '#27548A',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2rem',
          padding: '2rem',
        }}
      >
        <button
          onClick={handleStudentClick}
          style={{
            backgroundColor: '#DDA853',
            border: 'none',
            borderRadius: '30px',
            padding: '1.3rem 3rem',
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#183B4E',
            cursor: 'pointer',
            boxShadow: '0 6px 15px rgba(221, 168, 83, 0.5)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 10px 20px rgba(221, 168, 83, 0.8)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 15px rgba(221, 168, 83, 0.5)';
          }}
        >
          I am a Student
        </button>

        <button
          onClick={handleProfessorClick}
          style={{
            backgroundColor: '#DDA853',
            border: 'none',
            borderRadius: '30px',
            padding: '1.3rem 3rem',
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#183B4E',
            cursor: 'pointer',
            boxShadow: '0 6px 15px rgba(221, 168, 83, 0.5)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 10px 20px rgba(221, 168, 83, 0.8)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 15px rgba(221, 168, 83, 0.5)';
          }}
        >
          I am a Professor
        </button>
      </div>

      {/* Responsive styling */}
      <style>
        {`
          @media (max-width: 768px) {
            div[style*="display: flex"][style*="height: 100vh"] {
              flex-direction: column;
            }
            div[style*="flex: 1"][style*="background-color: #F5EEDC"] {
              height: 40vh;
            }
            div[style*="flex: 1"][style*="background-color: #27548A"] {
              height: 60vh;
            }
            button {
              width: 70%;
              font-size: 1.3rem !important;
            }
          }
        `}
      </style>
    </div>
  );
}
