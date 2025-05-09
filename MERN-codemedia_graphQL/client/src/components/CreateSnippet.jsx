import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_SNIPPET } from '../utils/mutations';
import Auth from '../utils/auth';

export default function CreateSnippet() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    language: '',
    code: '',
  });

  const [saveSnippet] = useMutation(ADD_SNIPPET); // Change addSnippet to saveSnippet

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
      await saveSnippet({ // Change addSnippet to saveSnippet here as well
        variables: {
          title: formData.title,
          description: formData.description,
          language: formData.language,
          code: formData.code,
        },
      });

      setFormData({ title: '', description: '', language: '', code: '' });
      alert('Snippet added successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="card text-center p-3 bg-success">Create a New Snippet</h3>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Title</label>
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
          <label className="form-label">Description</label>
          <textarea
            name="description"
            rows="2"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Language</label>
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
          <label className="form-label">Code</label>
          <textarea
            name="code"
            rows="8"
            className="form-control"
            value={formData.code}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-success">Save Snippet</button>
      </form>

      {formData.code && (
        <div className="mt-5">
          <h5 className="text-primary">Live Preview:</h5>
          <pre className="bg-dark text-white p-3 rounded">{formData.code}</pre>
        </div>
      )}
    </div>
  );
}