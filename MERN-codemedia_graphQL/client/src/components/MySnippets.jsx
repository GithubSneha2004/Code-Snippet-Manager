import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { DELETE_SNIPPET, EDIT_SNIPPET, SHARE_SNIPPET } from '../utils/mutations';
import { Button, Modal, Form } from 'react-bootstrap';

export default function MySnippets() {
  const { loading, data } = useQuery(GET_ME);
  const mySnippets = data?.me?.savedSnippets || [];

  const [deleteSnippet] = useMutation(DELETE_SNIPPET, {
    refetchQueries: [{ query: GET_ME }],
  });

  const [editSnippet] = useMutation(EDIT_SNIPPET);
  const [shareSnippet] = useMutation(SHARE_SNIPPET);

  const [modalCode, setModalCode] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [snippetId, setSnippetId] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [viewFavoritesOnly, setViewFavoritesOnly] = useState(false);
  const [message, setMessage] = useState('');

  // 🧠 Share Code Management
  const [shareCodeMap, setShareCodeMap] = useState(() => {
    const stored = localStorage.getItem('shareCodeMap');
    if (!stored) return {};
    const parsed = JSON.parse(stored);
    const now = Date.now();

    const valid = Object.fromEntries(
      Object.entries(parsed).filter(([_, { timestamp }]) => now - timestamp < 15 * 60 * 1000)
    );

    return Object.fromEntries(
      Object.entries(valid).map(([id, { code }]) => [id, code])
    );
  });

  const persistShareCode = (id, code) => {
    const existing = JSON.parse(localStorage.getItem('shareCodeMap') || '{}');
    existing[id] = { code, timestamp: Date.now() };
    localStorage.setItem('shareCodeMap', JSON.stringify(existing));
  };

  const handleDelete = async (id) => {
    try {
      await deleteSnippet({ variables: { snippetId: id } });
      setMessage('Snippet deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Failed to delete snippet.');
    }
  };

  const handleCopyLink = async (id) => {
    try {
      const { data } = await shareSnippet({ variables: { snippetId: id } });
      const code = data.shareSnippet.shared.code;
      const url = `${window.location.origin}/shared/${code}`;

      setShareCodeMap((prev) => {
        const updated = { ...prev, [id]: code };
        persistShareCode(id, code);
        return updated;
      });

      await navigator.clipboard.writeText(url);
      setMessage('Share link copied to clipboard!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Failed to share snippet.');
    }
  };

  const handleViewCode = (code, id) => {
    setModalCode(code);
    setShowModal(true);
    setSnippetId(id);
    setIsCopied(false);
    setIsEditing(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(modalCode);
    setIsCopied(true);
  };

  const handleEditSnippet = () => setIsEditing(true);

  const handleUpdateSnippet = async (e) => {
    e.preventDefault();
    try {
      await editSnippet({ variables: { snippetId, code: modalCode } });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFavoriteToggle = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const filteredSnippets = mySnippets
    .filter((s) =>
      [s.title, s.language, s.description].some((f) =>
        f.toLowerCase().includes(searchText.toLowerCase())
      )
    )
    .filter((s) => !viewFavoritesOnly || favorites.includes(s._id))
    .sort((a, b) =>
      sortBy ? a[sortBy].localeCompare(b[sortBy]) : 0
    );

  if (loading) return <p>Loading snippets...</p>;

  return (
    <div className="container mt-5">
      <h3 className="text-center p-3" style={headerStyle}>My Snippets</h3>

      <div className="d-flex gap-3 my-3">
        <input
          type="text"
          placeholder="Search snippets..."
          className="form-control"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ borderColor: '#27548A' }}
        />
        <Form.Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ borderColor: '#27548A' }}
        >
          <option value="">Sort by</option>
          <option value="title">Title</option>
          <option value="language">Language</option>
        </Form.Select>
        <Form.Check
          type="checkbox"
          label="View Favorites Only"
          checked={viewFavoritesOnly}
          onChange={() => setViewFavoritesOnly(!viewFavoritesOnly)}
        />
      </div>

      {message && (
        <div className="alert text-center" style={alertStyle}>
          {message}
        </div>
      )}

      <div className="row">
        {filteredSnippets.length ? (
          filteredSnippets.map((snippet) => (
            <div key={snippet._id} className="col-md-4 mb-4">
              <div style={cardStyle}>
                <h5 style={{ color: '#27548A' }}>{snippet.title}</h5>
                <p>{snippet.description}</p>
                <p><strong>Language:</strong> {snippet.language}</p>

                <div className="d-flex flex-wrap gap-2 mt-3">
                  <button
                    className="btn"
                    style={btnStyle('#27548A', '#F5EEDC')}
                    onClick={() => handleViewCode(snippet.code, snippet._id)}
                  >
                    View Code
                  </button>
                  <button
                    className="btn"
                    style={btnStyle('#DDA853', '#183B4E')}
                    onClick={() => handleDelete(snippet._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn"
                    style={btnStyle(favorites.includes(snippet._id) ? '#183B4E' : '#27548A', '#F5EEDC')}
                    onClick={() => handleFavoriteToggle(snippet._id)}
                  >
                    {favorites.includes(snippet._id) ? 'Unfavorite' : 'Favorite'}
                  </button>
                  <button
                    className="btn"
                    style={btnStyle('#DDA853', '#183B4E')}
                    onClick={() => handleCopyLink(snippet._id)}
                  >
                    Share
                  </button>
                </div>

                {shareCodeMap[snippet._id] && (
                  <div className="mt-2" style={shareCodeStyle}>
                    Share Code: <strong>{shareCodeMap[snippet._id]}</strong>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No snippets found.</p>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header style={headerStyle} closeButton>
          <Modal.Title>Snippet Code</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#F5EEDC' }}>
          {isEditing ? (
            <textarea
              className="form-control"
              value={modalCode}
              onChange={(e) => setModalCode(e.target.value)}
              rows="10"
              style={{ backgroundColor: '#fff', borderColor: '#27548A' }}
            />
          ) : (
            <pre style={codeDisplayStyle}>{modalCode}</pre>
          )}
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#F5EEDC' }}>
          <Button style={btnStyle('#DDA853', '#183B4E')} onClick={handleCopyCode}>
            {isCopied ? 'Copied' : 'Copy Code'}
          </Button>
          {isEditing ? (
            <Button style={btnStyle('#27548A', '#F5EEDC')} onClick={handleUpdateSnippet}>
              Save
            </Button>
          ) : (
            <Button style={btnStyle('#27548A', '#F5EEDC')} onClick={handleEditSnippet}>
              Edit
            </Button>
          )}
          <Button variant="secondary" onClick={() => {
            setShowModal(false);
            setIsEditing(false);
          }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

// 🧾 Styles
const btnStyle = (bg, color) => ({
  backgroundColor: bg,
  color: color,
  whiteSpace: 'nowrap',
  minWidth: '80px',
  padding: '6px 12px',
  borderRadius: '8px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  flexShrink: 0,
});

const headerStyle = {
  backgroundColor: '#27548A',
  color: '#F5EEDC',
  borderRadius: '12px',
};

const alertStyle = {
  backgroundColor: '#DDA853',
  color: '#183B4E',
};

const cardStyle = {
  backgroundColor: '#F5EEDC',
  borderRadius: '20px',
  padding: '1rem',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
};

const codeDisplayStyle = {
  backgroundColor: '#183B4E',
  color: '#F5EEDC',
  borderRadius: '12px',
  padding: '1rem',
  whiteSpace: 'pre-wrap',
};

const shareCodeStyle = {
  fontSize: '0.9rem',
  fontFamily: 'monospace',
  backgroundColor: '#FFF',
  color: '#27548A',
  padding: '6px 12px',
  borderRadius: '10px',
  boxShadow: '0 0 8px rgba(39,84,138,0.2)',
  display: 'inline-block',
  marginTop: '0.5rem',
};
