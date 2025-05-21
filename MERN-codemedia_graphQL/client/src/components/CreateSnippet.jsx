import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_SNIPPET } from '../utils/mutations';
import Auth from '../utils/auth';
import { GET_ME } from '../utils/queries';

export default function CreateSnippet() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    language: '',
    code: '',
  });
  const [message, setMessage] = useState('');

  const [saveSnippet] = useMutation(ADD_SNIPPET, {
    refetchQueries: [{ query: GET_ME }],
  });

  const languageOptions = [
    'JavaScript', 'Python', 'Java', 'C++', 'HTML', 'CSS', 'React', 'Node.js'
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!Auth.loggedIn()) return;

    try {
      await saveSnippet({
        variables: {
          title: formData.title,
          description: formData.description,
          language: formData.language,
          code: formData.code,
        },
      });

      setFormData({ title: '', description: '', language: '', code: '' });
      setMessage('Snippet added successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {message && (
        <div className="alert alert-success text-center">{message}</div>
      )}
      
      <div className="p-4" style={{ backgroundColor: '#F5EEDC', borderRadius: '20px' }}>
        <h3 className="text-center mb-4" style={{ color: '#27548A', fontWeight: 'bold' }}>
          Create a New Snippet
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{ color: '#183B4E' }}>Title</label>
            <input
              name="title"
              type="text"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ color: '#183B4E' }}>Description</label>
            <textarea
              name="description"
              rows="2"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ color: '#183B4E' }}>Language</label>
            <select
              name="language"
              className="form-select"
              value={formData.language}
              onChange={handleChange}
              required
            >
              <option value="">Select a language</option>
              {languageOptions.map((lang, index) => (
                <option key={index} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ color: '#183B4E' }}>Code</label>
            <textarea
              name="code"
              rows="8"
              className="form-control"
              value={formData.code}
              onChange={handleChange}
              required
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn" style={{ backgroundColor: '#27548A', color: '#F5EEDC' }}>
              Save Snippet
            </button>
          </div>
        </form>
      </div>

      {formData.code && (
        <div className="mt-5">
          <h5 style={{ color: '#27548A' }}>Live Preview:</h5>
          <pre className="p-3 rounded" style={{ backgroundColor: '#183B4E', color: '#F5EEDC' }}>
            {formData.code}
          </pre>
        </div>
      )}
    </div>
  );
}
