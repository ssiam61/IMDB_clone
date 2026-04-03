import React, { useState } from "react";
import "../styles/ReviewComposer.css";

const ReviewComposer = ({ onSubmit, onCancel, currentUserId }) => {
  const [description, setDescription] = useState("");
  const [starPoint, setStarPoint] = useState(5);
  const [hoverStarPoint, setHoverStarPoint] = useState(0);
  const [attachments, setAttachments] = useState([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleStarClick = (star) => {
    setStarPoint(star);
  };

  const handleAttachmentSelect = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = [];
    const newPreviews = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        newAttachments.push(event.target.result);
        newPreviews.push({
          id: Math.random(),
          src: event.target.result,
          name: file.name,
        });
        setAttachments([...attachments, ...newAttachments]);
        setAttachmentPreviews([...attachmentPreviews, ...newPreviews]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (id) => {
    setAttachmentPreviews(attachmentPreviews.filter((a) => a.id !== id));
    const indexToRemove = attachmentPreviews.findIndex((a) => a.id === id);
    if (indexToRemove !== -1) {
      const newAttachments = attachments.filter((_, i) => i !== indexToRemove);
      setAttachments(newAttachments);
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      alert("Please write a review");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(description, starPoint, attachmentPreviews.map((p) => p.src));
      setDescription("");
      setStarPoint(5);
      setAttachments([]);
      setAttachmentPreviews([]);
    } catch (err) {
      console.error("Error submitting review:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-composer">
      <div className="composer-header">
        <h3 className="composer-title">Write Your Review</h3>
      </div>

      <div className="star-rating-section">
        <label className="rating-label">Rating:</label>
        <div className="star-rating">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
            <button
              key={star}
              className={`star-btn ${
                star <= (hoverStarPoint || starPoint) ? "active" : ""
              }`}
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => setHoverStarPoint(star)}
              onMouseLeave={() => setHoverStarPoint(0)}
              title={`${star}/10`}
            >
              ★
            </button>
          ))}
          <span className="rating-value">{starPoint}/10</span>
        </div>
      </div>

      <div className="composer-input-section">
        <textarea
          className="review-textarea"
          placeholder="Share your thoughts about this content... (required)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="6"
          disabled={submitting}
        />
      </div>

      <div className="attachments-section">
        <label className="attachment-label">Add Images (Optional):</label>
        <div className="attachment-input-group">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleAttachmentSelect}
            disabled={submitting}
            id="attachment-input"
          />
          <label htmlFor="attachment-input" className="attachment-input-label">
            Choose Images
          </label>
        </div>

        {attachmentPreviews.length > 0 && (
          <div className="attachment-previews">
            {attachmentPreviews.map((preview) => (
              <div key={preview.id} className="attachment-preview">
                <img src={preview.src} alt={preview.name} />
                <button
                  className="remove-attachment-btn"
                  onClick={() => removeAttachment(preview.id)}
                  title="Remove image"
                  disabled={submitting}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="composer-actions">
        <button
          className="submit-review-btn"
          onClick={handleSubmit}
          disabled={submitting || !description.trim()}
        >
          {submitting ? "Posting..." : "Post Review"}
        </button>
        <button
          className="cancel-review-btn"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ReviewComposer;
