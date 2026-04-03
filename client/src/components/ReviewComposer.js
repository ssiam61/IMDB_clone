import React, { useState } from "react";
import "../styles/ReviewComposer.css";

const ReviewComposer = ({ onSubmit, onCancel, currentUserId }) => {
  const [description, setDescription] = useState("");
  const [starPoint, setStarPoint] = useState(5);
  const [hoverStarPoint, setHoverStarPoint] = useState(0);
  const [attachmentUrls, setAttachmentUrls] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleStarClick = (star) => {
    setStarPoint(star);
  };

  const addAttachmentUrl = () => {
    if (!imageUrlInput.trim()) {
      alert("Please enter a valid image URL");
      return;
    }

    if (attachmentUrls.length >= 4) {
      alert("Maximum 4 images allowed");
      return;
    }
    
    // Basic URL validation
    try {
      new URL(imageUrlInput);
    } catch {
      alert("Please enter a valid URL (must start with http:// or https://)");
      return;
    }

    setAttachmentUrls([...attachmentUrls, imageUrlInput]);
    setImageUrlInput("");
  };

  const removeAttachment = (index) => {
    setAttachmentUrls(attachmentUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      alert("Please write a review");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(description, starPoint, attachmentUrls);
      setDescription("");
      setStarPoint(5);
      setAttachmentUrls([]);
      setImageUrlInput("");
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
        <label className="attachment-label">Add Image Links (Optional):</label>
        <div className="attachment-input-group">
          <input
            type="text"
            placeholder="Paste image URL (e.g., https://example.com/image.jpg)"
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
            disabled={submitting}
            className="image-url-input"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                addAttachmentUrl();
              }
            }}
          />
          <button
            className="add-image-btn"
            onClick={addAttachmentUrl}
            disabled={submitting || !imageUrlInput.trim()}
          >
            Add Image
          </button>
        </div>
      </div>

      {attachmentUrls.length > 0 && (
        <div className="attachment-previews">
          {attachmentUrls.map((url, index) => (
            <div key={index} className="attachment-preview">
              <img 
                src={url} 
                alt={`Attachment ${index + 1}`}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150?text=Error";
                }}
              />
              <button
                className="remove-attachment-btn"
                onClick={() => removeAttachment(index)}
                title="Remove image"
                disabled={submitting}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

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
