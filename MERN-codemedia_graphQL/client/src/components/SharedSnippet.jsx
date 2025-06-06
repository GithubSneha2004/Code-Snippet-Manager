import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_SNIPPET_BY_SHARE_CODE } from '../utils/queries';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Import react-toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SharedSnippet = () => {
  const { code: urlCode } = useParams();
  const navigate = useNavigate();
  const [currentCode, setCurrentCode] = useState(urlCode);
  const [isExpired, setIsExpired] = useState(false);
  const redirectTimeoutRef = useRef(null);
  const navigationInProgress = useRef(false);

  const { loading, error, data } = useQuery(GET_SNIPPET_BY_SHARE_CODE, {
    variables: { code: currentCode },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (data?.getSnippetByShareCode) {
      const backendCode = data.getSnippetByShareCode.shared.code;

      if (backendCode && backendCode !== currentCode && !navigationInProgress.current) {
        navigationInProgress.current = true;
        setCurrentCode(backendCode);
        navigate(`/shared/${backendCode}`, { replace: true });
      }

      const createdAt = new Date(data.getSnippetByShareCode.shared.createdAt);
      const now = new Date();
      const diffMinutes = (now - createdAt) / (1000 * 60);

      if (diffMinutes > 15 && !isExpired) {
        setIsExpired(true);

        redirectTimeoutRef.current = setTimeout(() => {
          navigate('/join');
        }, 3000);
      }
    }

    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, [data, currentCode, navigate, isExpired]);

  const handleCopyCode = () => {
    if (!data?.getSnippetByShareCode) {
      toast.error('No code available to copy.');
      return;
    }
    navigator.clipboard.writeText(data.getSnippetByShareCode.code)
      .then(() => toast.success('Code copied to clipboard!'))
      .catch(() => toast.error('Failed to copy code.'));
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.error}>
        Error: {error.message}
      </div>
    );
  }

  const snippet = data?.getSnippetByShareCode;

  if (!snippet || isExpired) {
    return (
      <div style={styles.expiredContainer}>
        <div style={styles.expiredBox}>
          <h2 style={styles.expiredText}>⚠️ Code Expired</h2>
          <p>You’ll be redirected to the join page shortly...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* ToastContainer to show toasts */}
      <ToastContainer position="top-center" autoClose={3000} />

      <div style={styles.header}>
        <h2 style={styles.title}>{snippet.title}</h2>
        <p style={styles.meta}><strong>Language:</strong> {snippet.language || 'N/A'}</p>
        {snippet.description && (
          <p style={styles.meta}><strong>Description:</strong> {snippet.description}</p>
        )}
        <p style={styles.meta}><em>Shared by: {snippet.createdBy.username}</em></p>
      </div>

      {/* Copy Button */}
      <div style={styles.copyCodeContainer}>
        <button style={styles.copyBtn} onClick={handleCopyCode}>
          📋 Copy Code
        </button>
      </div>

      <div style={styles.codeCard}>
        <SyntaxHighlighter language={snippet.language || 'javascript'} style={darcula} wrapLongLines>
          {snippet.code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: '#F5EEDC',
    minHeight: '100vh',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  },
  header: {
    marginBottom: '1.5rem',
    color: '#183B4E',
  },
  title: {
    fontSize: '2rem',
    color: '#27548A',
    marginBottom: '0.5rem',
  },
  meta: {
    margin: '0.3rem 0',
    color: '#183B4E',
  },
  copyCodeContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '0.5rem',
  },
  copyBtn: {
    cursor: 'pointer',
    backgroundColor: '#DDA853',
    border: 'none',
    borderRadius: '6px',
    padding: '0.4rem 0.8rem',
    fontWeight: 'bold',
    color: '#183B4E',
    transition: 'background-color 0.3s ease',
    userSelect: 'none',
  },
  codeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    padding: '1rem',
    overflowX: 'auto',
  },
  loading: {
    textAlign: 'center',
    marginTop: '5rem',
    color: '#27548A',
    fontSize: '1.2rem',
  },
  error: {
    textAlign: 'center',
    marginTop: '5rem',
    color: 'red',
    fontSize: '1.2rem',
  },
  expiredContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#F5EEDC',
  },
  expiredBox: {
    textAlign: 'center',
    backgroundColor: '#fff8ec',
    border: '2px solid #DDA853',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  expiredText: {
    color: '#DDA853',
    marginBottom: '0.5rem',
  },
};

export default SharedSnippet;
