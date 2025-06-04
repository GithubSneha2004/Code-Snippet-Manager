import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const JoinByCode = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleJoin = (e) => {
    e.preventDefault();
    if (code.trim().length > 0) {
      navigate(`/shared/${code.trim()}`);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🔗 View a Shared Snippet</h2>
      <form onSubmit={handleJoin} style={styles.form}>
        <label htmlFor="snippetCode" style={styles.label}>Enter Code:</label>
        <input
          id="snippetCode"
          type="text"
          placeholder="e.g. xhtGny6X"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Go</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#F5EEDC',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Segoe UI, sans-serif',
    padding: '1rem',
  },
  title: {
    fontSize: '2.2rem',
    color: '#183B4E',
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
    maxWidth: '400px',
    alignItems: 'center',
  },
  label: {
    fontSize: '1rem',
    color: '#27548A',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  input: {
    padding: '0.8rem 1rem',
    fontSize: '1rem',
    border: '2px solid #27548A',
    borderRadius: '10px',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.3s',
  },
  button: {
    padding: '0.8rem 1.5rem',
    backgroundColor: '#27548A',
    color: '#F5EEDC',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#183B4E',
  },
};

export default JoinByCode;
