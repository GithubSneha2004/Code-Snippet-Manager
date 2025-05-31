import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import Auth from '../utils/auth';
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_USER } from '../utils/mutations';
import { GET_ME } from '../utils/queries';  // Import GET_ME, not GET_SNIPPETS_BY_USER
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  // Use GET_ME query without variables
  const { loading, data } = useQuery(GET_ME);

  const user = data?.me || {};  // logged-in user data
  const snippets = user.savedSnippets || [];

  const totalSnippets = snippets.length;
  // Filter shared snippets that are marked shared and have a share code
  const sharedSnippets = snippets.filter(
    snippet => snippet.shared?.isShared && snippet.shared.code
  ); // Show all shared snippets

  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: () => {
      Auth.logout();
      navigate('/logoutmessage');
    },
    onError: (err) => {
      console.error('Account deletion failed:', err.message);
    }
  });

  const handleDelete = () => {
    deleteUser();
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '80vh', padding: '2rem 0', backgroundColor: '#F5EEDC' }}
    >
      <Card
        style={{
          width: '30rem',
          backgroundColor: '#27548A',
          color: '#EAE4DD',
          padding: '1.5rem',
          borderRadius: '1rem'
        }}
      >
        <h3 className="mb-4" style={{ color: '#DDA853' }}>
          Your Profile
        </h3>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>

        <hr />

        {/* Snippet Stats Summary */}
        <div className="mt-3">
          <h5 style={{ color: '#DDA853' }}>Snippet Summary</h5>
          <p><strong>Total Snippets Created:</strong> {totalSnippets}</p>
          <p><strong>Total Snippets Shared:</strong> {sharedSnippets.length}</p>

          {sharedSnippets.length > 0 && (
            <>
              <p><strong>Shared Snippets:</strong></p>
              <div>
                {sharedSnippets.map((snippet) => (
                  <a
                    key={snippet._id}
                    href={`/shared/${snippet.shared.code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="badge rounded-pill"
                    style={{
                      backgroundColor: '#DDA853',
                      color: '#183B4E',
                      marginRight: '0.5rem',
                      marginBottom: '0.5rem',
                      padding: '0.5rem 1rem',
                      display: 'inline-block',
                      textDecoration: 'none',
                      fontWeight: '600'
                    }}
                  >
                    {snippet.title}
                  </a>
                ))}
              </div>
            </>
          )}
        </div>

        <Button
          variant="danger"
          onClick={() => setShowModal(true)}
          style={{
            backgroundColor: '#C0392B',
            border: 'none',
            fontWeight: 'bold',
            marginTop: '1rem',
            width: '100%'
          }}
        >
          Delete Account
        </Button>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#27548A', color: '#F5EEDC' }}>
          <Modal.Title>Confirm Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#F5EEDC', color: '#183B4E' }}>
          Are you sure you want to delete your account? This action cannot be undone and all your snippets will be permanently deleted.
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#F5EEDC' }}>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            style={{ backgroundColor: '#27548A', borderColor: '#27548A' }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            style={{ backgroundColor: '#D9534F', borderColor: '#D43F3A' }}
          >
            Delete Account
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profile;
