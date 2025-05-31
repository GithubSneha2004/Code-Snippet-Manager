import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_SNIPPET_BY_SHARE_CODE } from '../utils/queries';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SharedSnippet = () => {
  const { code } = useParams();
  const { loading, error, data } = useQuery(GET_SNIPPET_BY_SHARE_CODE, {
    variables: { code },
  });

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (error) return <div style={styles.error}>Error: {error.message}</div>;

  const snippet = data?.getSnippetByShareCode;

  if (!snippet) {
    return <div style={styles.error}>Snippet not found or link expired.</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>{snippet.title}</h2>

        <p style={styles.meta}>
          <strong>Language:</strong> {snippet.language || 'N/A'}
        </p>

        {snippet.description && (
          <p style={styles.meta}>
            <strong>Description:</strong> {snippet.description}
          </p>
        )}

        <p style={styles.meta}>
          <em>Shared by: {snippet.createdBy.username}</em>
        </p>
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
    fontFamily: 'Segoe UI, sans-serif',
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
};

export default SharedSnippet;
