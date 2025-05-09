import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { DELETE_SNIPPET, EDIT_SNIPPET } from '../utils/mutations';
import { Button, Modal, Form } from 'react-bootstrap';

export default function MySnippets() {
  const { loading, data } = useQuery(GET_ME);
  const mySnippets = data?.me?.savedSnippets || [];  // Access savedSnippets from the query

  const [deleteSnippet] = useMutation(DELETE_SNIPPET);
  const [editSnippet] = useMutation(EDIT_SNIPPET);

  const [modalCode, setModalCode] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [snippetId, setSnippetId] = useState(null);

  // States for search, sort, and favorites
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [viewFavoritesOnly, setViewFavoritesOnly] = useState(false);

  const handleDelete = async (snippetId) => {
    try {
      await deleteSnippet({ variables: { snippetId } });

    } catch (error) {
      console.log(error);
    }
  };

  const handleViewCode = (code, id) => {
    setModalCode(code);
    setShowModal(true);
    setSnippetId(id);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(modalCode);
    setIsCopied(true);
  };

  const handleEditSnippet = () => setIsEditing(true);

  const handleUpdateSnippet = async (event) => {
    event.preventDefault();
    try {
      await editSnippet({ variables: { snippetID: snippetId, code: modalCode } });
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCodeChange = (event) => setModalCode(event.target.value);

  const handleFavoriteToggle = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const filteredSnippets = mySnippets
    .filter((snippet) => {
      const search = searchText.toLowerCase();
      return (
        snippet.title.toLowerCase().includes(search) ||
        snippet.language.toLowerCase().includes(search) ||
        snippet.description.toLowerCase().includes(search)
      );
    })
    .filter((snippet) => !viewFavoritesOnly || favorites.includes(snippet._id))
    .sort((a, b) => {
      if (!sortBy) return 0;
      if (sortBy === 'title' || sortBy === 'language') {
        return a[sortBy].localeCompare(b[sortBy]);
      }
      return 0;
    });

  return (
    <div className="container mt-5">
      <h3 className="card text-center p-3 bg-success">My Snippets</h3>

      {/* Search, Sort, Filter UI */}
      <div className="d-flex gap-3 my-3">
        <input
          type="text"
          placeholder="Search snippets..."
          className="form-control"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
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

      <div className="row">
        {filteredSnippets.length ? (
          filteredSnippets.map((snippet) => (
            <div key={snippet._id} className="col-md-4 mb-4">
              <div className="card bg-warning">
                <div className="card-body">
                  <h5 className="card-title">{snippet.title}</h5>
                  <p className="card-text">{snippet.description}</p>
                  <p className="card-text">
                    <strong>Language:</strong> {snippet.language}
                  </p>
                  <div className="d-flex gap-2">
                    <Button variant="secondary" onClick={() => handleViewCode(snippet.code, snippet._id)}>
                      View Code
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(snippet._id)}>
                      Delete
                    </Button>
                    <Button variant="primary" onClick={() => handleFavoriteToggle(snippet._id)}>
                      {favorites.includes(snippet._id) ? 'Unfavorite' : 'Favorite'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No snippets available.</p>
        )}
      </div>

      {/* Modal to view and edit code */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Snippet Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isEditing ? (
            <textarea
              className="form-control"
              value={modalCode}
              onChange={handleCodeChange}
              rows="10"
            ></textarea>
          ) : (
            <pre>{modalCode}</pre>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCopyCode}>
            {isCopied ? 'Copied' : 'Copy Code'}
          </Button>
          {isEditing ? (
            <Button variant="primary" onClick={handleUpdateSnippet}>
              Update Snippet
            </Button>
          ) : (
            <Button variant="primary" onClick={handleEditSnippet}>
              Edit
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}