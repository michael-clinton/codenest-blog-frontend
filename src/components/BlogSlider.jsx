import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OwlCarousel from 'react-owl-carousel';
import axiosInstance from '../api/axios';

const BlogSlider = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axiosInstance.get('/api/blogs?page=1&limit=6');
        setBlogs(res.data.blogs);
      } catch (err) {
        console.error('Failed to fetch blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const options = {
    items: 3,
    margin: 30,
    loop: true,
    autoplay: true,
    smartSpeed: 600,
    dots: true,
    responsive: {
      0: { items: 1 },
      768: { items: 2 },
      992: { items: 3 }
    }
  };

  if (loading) return <p className="text-center">Loading blog posts...</p>;

  return (
    <section>
      <div className="container">
        <OwlCarousel className="owl-theme blog-slider" {...options}>
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="card blog__slide text-center h-100"
              style={{ cursor: 'default', display: 'flex', flexDirection: 'column' }}
            >
              <div
                className="blog__slide__img"
                onClick={() => navigate(`/blog/${blog._id}`)}
              >
                <img
                  className="card-img-top rounded-0"
                  src={blog.image || '/img/blog/blog-slider/default.jpg'}
                  alt={blog.title}
                />
              </div>
              <div
                className="blog__slide__content p-3 d-flex flex-column justify-content-between"
                style={{ flexGrow: 1 }}
              >
                <div>
                  <div className="mb-2 text-muted" style={{ fontSize: '0.9rem' }}>
                    {blog.category || 'Blog'} &nbsp;|&nbsp;{' '}
                    {new Date(blog.date).toLocaleDateString()}
                  </div>
                  <h5 className="mb-1">{blog.titleLine1 || blog.title}</h5>
                  <p className="text-muted mb-3" style={{ fontSize: '0.85rem' }}>
                    By {blog.author || 'Unknown'}
                  </p>
                </div>
                <div className="mt-auto">
                  <a
                    className="button"
                    href={`/blog/${blog._id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/blog/${blog._id}`);
                    }}
                  >
                    Read More <i className="ti-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </OwlCarousel>
      </div>
    </section>
  );
};

export default BlogSlider;
