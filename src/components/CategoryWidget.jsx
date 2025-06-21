import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

const CategoryWidget = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const response = await axiosInstance.get('/api/blog/category-counts');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching category counts:', error);
      }
    };

    fetchCategoryCounts();
  }, []);

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
    onCategorySelect(categoryName);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // ✅ Scroll to top on category click
  };

  return (
    <div className="single-sidebar-widget post-category-widget">
      <h4 className="single-sidebar-widget__title">Categories</h4>
      <ul className="cat-list mt-20" style={{ listStyle: 'none', padding: 0 }}>
        {categories
          .sort((a, b) => b.count - a.count) // ✅ Sort by most used
          .slice(0, 4) // ✅ Limit to top 4
          .map((category) => (
            <li key={category._id} style={{ marginBottom: '10px' }}>
              <button
                onClick={() => handleCategoryClick(category._id)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  border: 'none',
                  background: 'none',
                  padding: '5px 10px',
                  color: activeCategory === category._id ? '#007bff' : '#333',
                  fontWeight: activeCategory === category._id ? 'bold' : 'normal',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  transition: 'background 0.2s ease-in-out',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f9f9f9')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                <span>{category._id}</span>
                <span style={{ marginLeft: '20px', color: '#777' }}>
                  ({category.count})
                </span>
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default CategoryWidget;
