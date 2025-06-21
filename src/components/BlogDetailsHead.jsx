import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';

const BlogDetailsHead = ({
  blogId,
  image,
  titleLine1,
  titleLine2,
  categories = [],
  tags = [],
  author,
  dateTime,
  userImage,
  contentParagraphs = [],
  quotes = [],
  socialLinks = {}
}) => {
  const [blogLikes, setBlogLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = storedUser.id;
  const firstName = storedUser.username || "User";

  // Fetch blog likes
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await axiosInstance.get(`/api/blog/${blogId}`);
        const likes = Array.isArray(res.data.likes) ? res.data.likes : [];
        setBlogLikes(likes);
        setHasLiked(likes.some(like => like.userId === userId));
      } catch (error) {
        console.error('❌ Error fetching blog likes:', error.message);
      }
    };

    if (blogId) fetchLikes();
  }, [blogId, userId]);

  // Fetch comments
  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const res = await axiosInstance.get(`/api/comments/${blogId}`);
        setCommentCount(Array.isArray(res.data) ? res.data.length : 0);
      } catch (error) {
        console.error('❌ Error fetching comments:', error.message);
      }
    };

    if (blogId) fetchCommentCount();
  }, [blogId]);

  // Merge quotes into paragraphs
  const mergedContent = [...contentParagraphs];
  const interval = Math.ceil((contentParagraphs.length + 1) / (quotes.length + 1));
  quotes.forEach((quote, i) => {
    const insertAt = (i + 1) * interval;
    mergedContent.splice(insertAt, 0, { quote });
  });

  const lastTwoLikers = [...blogLikes]
    .sort((a, b) => new Date(b.likedAt) - new Date(a.likedAt))
    .slice(0, 2)
    .map(like => like.firstName || 'Someone')
    .join(', ');

  const handleLike = async () => {
    try {
      if (!userId || !firstName) return;

      const res = await axiosInstance.post(`/api/blog/${blogId}/like`, {
        userId,
        firstName
      });

      const updatedLikes = Array.isArray(res.data.likes) ? res.data.likes : [];
      setBlogLikes(updatedLikes);
      setHasLiked(updatedLikes.some(like => like.userId === userId));
    } catch (error) {
      console.error("❌ Error toggling like:", error.message);
    }
  };

  return (
    <div className="main_blog_details">
      <img className="img-fluid" src={image} alt="blog" />

      <a href="#">
        <h4>{titleLine1}</h4>
        <p style={{ fontSize: '1rem', fontWeight: 'normal', marginTop: '-10px' }}>
          {titleLine2}
        </p>
      </a>

      <div className="user_details">
        <div className="float-left">
          {categories.map((cat, idx) => (
            <a href="#" key={idx} style={{ marginRight: '10px' }}>{cat}</a>
          ))}
          {tags.length > 0 && (
            <div style={{ marginTop: '5px' }}>
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#f0f0f0',
                    color: '#333',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    marginRight: '6px',
                    marginTop: '5px',
                    textTransform: 'capitalize'
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="float-right mt-sm-0 mt-3">
          <div className="media">
            <div className="media-body">
              <h5>{author}</h5>
              <p>{new Date(dateTime).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}</p>
            </div>
            <div className="d-flex">
              <img
                width="42"
                height="42"
                src={userImage || '/img/default-user.png'}
                alt="author"
              />
            </div>
          </div>
        </div>
      </div>

      {mergedContent.map((item, index) =>
        typeof item === 'string' ? (
          <p key={index}>{item}</p>
        ) : (
          <blockquote key={index} className="blockquote text-center">
            <p className="mb-0 font-italic">"{item.quote}"</p>
          </blockquote>
        )
      )}

      <div className="news_d_footer flex-column flex-sm-row">
        <a href="#" onClick={(e) => {
          e.preventDefault();
          handleLike();
        }}>
          <span className="align-middle mr-2">
            <i
              className={`ti-heart ${hasLiked ? 'text-danger' : 'text-muted'}`}
              style={{ transition: 'color 0.3s' }}
            ></i>
          </span>
          {blogLikes.length} {hasLiked ? 'Liked' : 'Likes'}
          {lastTwoLikers && <span className="ml-2">❤️ by {lastTwoLikers}</span>}
        </a>

        <a className="justify-content-sm-center ml-sm-auto mt-sm-0 mt-2" href="#comments">
          <span className="align-middle mr-2"><i className="ti-themify-favicon"></i></span>
          {String(commentCount).padStart(2, '0')} Comments
        </a>

        <div className="news_socail ml-sm-auto mt-sm-0 mt-2">
          {socialLinks.facebook && <a href={socialLinks.facebook}><i className="fab fa-facebook-f"></i></a>}
          {socialLinks.twitter && <a href={socialLinks.twitter}><i className="fab fa-twitter"></i></a>}
          {socialLinks.dribbble && <a href={socialLinks.dribbble}><i className="fab fa-dribbble"></i></a>}
          {socialLinks.behance && <a href={socialLinks.behance}><i className="fab fa-behance"></i></a>}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsHead;
