import React from "react";

const CommentCard = ({ username, text, date }) => (
  <div className="card mb-2">
    <div className="card-body py-2">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <h6 className="mb-0">{username}</h6>
      </div>
      <p className="mb-1">{text}</p>
      <small className="text-muted">{date}</small>
    </div>
  </div>
);

export default CommentCard;
