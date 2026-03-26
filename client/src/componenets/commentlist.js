import React from "react";
import CommentCard from "./commentcard";

const CommentList = ({ comments }) => (
  <div>
    {comments.length === 0 ? (
      <p className="text-muted">No comments yet.</p>
    ) : (
      comments.map((comment) => (
        <CommentCard key={comment.id || comment.date + comment.username} {...comment} />
      ))
    )}
  </div>
);

export default CommentList;
