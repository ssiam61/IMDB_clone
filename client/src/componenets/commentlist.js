import React from "react";
import CommentCard from "./commentcard";
import "./reviewcomment.css";

const CommentList = ({ comments }) => {
  return (
    <div className="comments-container">
      {comments.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">💭</span>
          <p className="empty-text">No comments yet. Start the conversation!</p>
        </div>
      ) : (
        <>
          <div className="comments-header">
            <span className="comments-count">💬 {comments.length} Comment{comments.length !== 1 ? "s" : ""}</span>
          </div>
          
          <div className="comments-list">
            {comments.map((comment) => (
              <CommentCard key={comment.id || comment.date + comment.username} {...comment} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CommentList;
