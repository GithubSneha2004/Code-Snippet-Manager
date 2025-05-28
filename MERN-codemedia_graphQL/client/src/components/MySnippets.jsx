import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { DELETE_SNIPPET, EDIT_SNIPPET } from '../utils/mutations';
import { Button, Modal, Form } from 'react-bootstrap';

export default function MySnippets() {
  const { loading, data } = useQuery(GET_ME);
  const mySnippets = data?.me?.savedSnippets || [];  // Access savedSnippets from the query

  const [deleteSnippet] = useMutation(DELETE_SNIPPET, {
  refetchQueries: [{ query: GET_ME }],
});

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
  const [message, setMessage] = useState('');


  /*const handleDelete = async (snippetId) => {
    console.log("Deleting Snippet Id:",snippetId);
    try {
      const {data}=await deleteSnippet({ variables: { snippetId } });
      console.log("Deleted: ",data);
    } catch (error) {
      console.log(error);
    }
  };*/

  const handleDelete = async (snippetId) => {
  try {
    await deleteSnippet({ variables: { snippetId } });
    setMessage('Snippet deleted successfully!');
    setTimeout(() => setMessage(''), 3000); // Auto clear message after 3 seconds
  } catch (error) {
    console.error(error);
    setMessage('Failed to delete snippet.');
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
      await editSnippet({ variables: { snippetId: snippetId, code: modalCode } });
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
  <h3 className="text-center p-3" style={{ backgroundColor: '#27548A', color: '#F5EEDC', borderRadius: '12px' }}>
    My Snippets
  </h3>

  {/* Search, Sort, Filter UI */}
  <div className="d-flex gap-3 my-3">
    <input
      type="text"
      placeholder="Search snippets..."
      className="form-control"
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      style={{ borderColor: '#27548A' }}
    />

    <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ borderColor: '#27548A' }}>
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
    <div className="alert text-center" style={{ backgroundColor: '#DDA853', color: '#183B4E' }}>
      {message}
    </div>
  )}

  <div className="row">
    {filteredSnippets.length ? (
      filteredSnippets.map((snippet) => (
        <div key={snippet._id} className="col-md-4 mb-4">
          <div className="p-3" style={{ backgroundColor: '#F5EEDC', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h5 style={{ color: '#27548A' }}>{snippet.title}</h5>
            <p>{snippet.description}</p>
            <p><strong>Language:</strong> {snippet.language}</p>
            <div className="d-flex gap-2 mt-3 flex-nowrap justify-content-between">
              <button className="btn" style={{ backgroundColor: '#27548A', color: '#F5EEDC' }} onClick={() => handleViewCode(snippet.code, snippet._id)}>
                View Code
              </button>
              <button className="btn" style={{ backgroundColor: '#DDA853', color: '#183B4E' }} onClick={() => handleDelete(snippet._id)}>
                Delete
              </button>
              <button className="btn" style={{ backgroundColor: favorites.includes(snippet._id) ? '#183B4E' : '#27548A', color: '#F5EEDC' }} onClick={() => handleFavoriteToggle(snippet._id)}>
                {favorites.includes(snippet._id) ? 'Unfavorite' : 'Favorite'}
              </button>
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
    <Modal.Header closeButton style={{ backgroundColor: '#27548A', color: '#F5EEDC' }}>
      <Modal.Title>Snippet Code</Modal.Title>
    </Modal.Header>
    <Modal.Body style={{ backgroundColor: '#F5EEDC' }}>
      {isEditing ? (
        <textarea
          className="form-control"
          value={modalCode}
          onChange={handleCodeChange}
          rows="10"
          style={{ backgroundColor: '#fff', borderColor: '#27548A' }}
        ></textarea>
      ) : (
        <pre className="p-3" style={{ backgroundColor: '#183B4E', color: '#F5EEDC', borderRadius: '12px' }}>
          {modalCode}
        </pre>
      )}
    </Modal.Body>
    <Modal.Footer style={{ backgroundColor: '#F5EEDC' }}>
      <Button style={{ backgroundColor: '#DDA853', border: 'none', color: '#183B4E' }} onClick={handleCopyCode}>
        {isCopied ? 'Copied' : 'Copy Code'}
      </Button>
      {isEditing ? (
        <Button style={{ backgroundColor: '#27548A', border: 'none', color: '#F5EEDC' }} onClick={handleUpdateSnippet}>
          Update Snippet
        </Button>
      ) : (
        <Button style={{ backgroundColor: '#27548A', border: 'none', color: '#F5EEDC' }} onClick={handleEditSnippet}>
          Edit
        </Button>
      )}
    </Modal.Footer>
  </Modal>
</div>

  );
}