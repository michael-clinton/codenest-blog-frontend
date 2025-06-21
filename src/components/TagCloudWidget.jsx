import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';

const TagCloudWidget = ({ onTagSelect, selectedTag }) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axiosInstance.get('/api/blog/tags');
        setTags(response.data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleTagClick = (tag) => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // 👈 Scroll to top on click

    if (selectedTag === tag) {
      onTagSelect(""); // unselect
    } else {
      onTagSelect(tag); // select
    }
  };


  return (
    <div className="single-sidebar-widget tag_cloud_widget">
      <h4 className="single-sidebar-widget__title">Tags</h4>
      <ul
        className="list"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          padding: 0,
          margin: 0,
        }}
      >
        {loading ? (
          <li>Loading tags...</li>
        ) : tags.length > 0 ? (
          tags.map((tag, index) => (
            <li key={index} style={{ listStyle: 'none' }}>
              <button
                onClick={() => handleTagClick(tag)}
                style={{
                  backgroundColor: selectedTag === tag ? '#007bff' : '#f0f0f0',
                  color: selectedTag === tag ? '#fff' : '#333',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '6px 12px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                #{tag}
              </button>
            </li>
          ))
        ) : (
          <li>No tags available</li>
        )}
      </ul>
    </div>
  );
};

export default TagCloudWidget;
