import React, { useState, useEffect } from "react";

// Individual Comment
const Comment = ({ comment, onReplyClick, level = 0, hasReplies, isExpanded, toggleReplies }) => (
  <div className="comment-list" style={{ paddingLeft: `${level * 30}px`, marginBottom: "20px" }}>
    <div className="single-comment d-flex justify-content-between align-items-start">
      <div className="user d-flex">
        <div className="thumb">
          <img
            src={comment.image || "/default-user.png"}
            alt={comment.name}
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
        </div>
        <div className="desc ml-3">
          <h5><a href="#">{comment.name}</a></h5>
          <p className="date">{new Date(comment.createdAt).toLocaleString()}</p>
          <p className="comment">{comment.message}</p>

          {/* Gray styled buttons */}
          <div className="d-flex align-items-center mt-2" style={{ gap: "10px" }}>
            <button
              type="button"
              className="text-uppercase"
              onClick={() => onReplyClick(comment._id, comment.name)}
              style={{
                padding: "4px 10px",
                fontSize: "12px",
                lineHeight: "1.2",
                height: "auto",
                backgroundColor: "#e9ecef",
                border: "1px solid #ced4da",
                color: "#495057",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Reply
            </button>

            {hasReplies && (
              <button
                type="button"
                className="text-uppercase"
                onClick={() => toggleReplies(comment._id)}
                style={{
                  padding: "4px 10px",
                  fontSize: "12px",
                  lineHeight: "1.2",
                  height: "auto",
                  backgroundColor: "#e9ecef",
                  border: "1px solid #ced4da",
                  color: "#495057",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                {isExpanded ? "Hide Replies" : "Show Replies"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Main CommentsArea
const CommentsArea = ({ comments, onReplyClick }) => {
  const [expanded, setExpanded] = useState({});

  // Set all with replies to collapsed initially
  useEffect(() => {
    const withReplies = comments
      .filter(parent => comments.some(child => child.parentId === parent._id))
      .reduce((acc, curr) => ({ ...acc, [curr._id]: false }), {});
    setExpanded(withReplies);
  }, [comments]);

  const toggleReplies = (id) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const render = (parentId = null, lvl = 0) => {
    const children = comments.filter(c => c.parentId === parentId);
    return children.map(comment => {
      const hasReplies = comments.some(c => c.parentId === comment._id);
      const isExpanded = expanded[comment._id] ?? false;

      return (
        <React.Fragment key={comment._id}>
          <Comment
            comment={comment}
            onReplyClick={onReplyClick}
            level={lvl}
            hasReplies={hasReplies}
            isExpanded={isExpanded}
            toggleReplies={toggleReplies}
          />
          {hasReplies && isExpanded && render(comment._id, lvl + 1)}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="comments-area">
      <h4>{String(comments.length).padStart(2, '0')} Comments</h4>
      {render()}
    </div>
  );
};

export default CommentsArea;
