import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios'; // Adjust the path if needed

const PopularPostWidget = () => {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingTags, setLoadingTags] = useState(true);

  useEffect(() => {
    // Fetch popular posts
    axiosInstance.get('/api/blog/popular-posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error('Failed to fetch popular posts:', err))
      .finally(() => setLoadingPosts(false));

    // Fetch unique tags
    axiosInstance.get('/api/blog/tags')
      .then(res => setTags(res.data))
      .catch(err => console.error('Failed to fetch tags:', err))
      .finally(() => setLoadingTags(false));
  }, []);

  return (
    <div className="sidebar-widgets">
      {/* Popular Posts Section */}
      <div className="single-sidebar-widget popular-post-widget">
        <h4 className="single-sidebar-widget__title">Popular Post</h4>
        <div className="popular-post-list">
          {loadingPosts ? (
            <p>Loading posts...</p>
          ) : posts.length > 0 ? (
            posts.map((post, index) => (
              <div className="single-post-list" key={index}>
                <div className="thumb">
                  <img
                    className="card-img rounded-0"
                    src={post.image || '/default-thumb.jpg'}
                    alt="thumb"
                  />
                  <ul className="thumb-info">
                    <li><a href="#">{post.author || 'Unknown'}</a></li>
                    <li><a href="#">{post.date || 'Unknown date'}</a></li>
                  </ul>
                </div>
                <div className="details mt-20">
                  <a href={`/blog/${post._id}`}>
                    <h6>{post.titleLine1 || 'Untitled Post'}</h6>
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p>No popular posts found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopularPostWidget;
