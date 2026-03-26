import React, { useState } from "react";

const CommentForm = ({ onSubmit }) => {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!text.trim()) {
      setError("Please enter a comment.");
      return;
    }
    await onSubmit({ text });
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-2">
      {error && <div className="alert alert-danger py-1 mb-2">{error}</div>}
      <div className="mb-2">
        <label className="form-label">Comment</label>
        <input
          className="form-control"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <button className="btn btn-primary w-100" type="submit">
        Submit Comment
      </button>
    </form>
  );
};

export default CommentForm;
