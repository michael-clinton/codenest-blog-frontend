import React from "react";

const BlogComments = ({ comments = [] }) => {
  return (
    <div className="comments-area">
      <h4>{comments.length} Comments</h4>
      {comments.map((comment, index) => (
        <div key={index} className={`comment-list ${comment.isReply ? "left-padding" : ""}`}>
          <div className="d-flex align-items-center">
            <img
              src={comment.avatar || "https://via.placeholder.com/50"}
              alt="User"
              className="mr-3"
              style={{ borderRadius: "50%", width: "50px", height: "50px" }}
            />
            <div>
              <h5>{comment.name || "Anonymous"}</h5>
              <p>{new Date(comment.date).toLocaleString()}</p>
              <p>{comment.text || "No comment"}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogComments;
