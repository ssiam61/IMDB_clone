import React, { useState } from "react";
import "../styles/ReplyComposer.css";

const ReplyComposer = ({ onSubmit, onCancel, placeholder = "Write a reply..." }) => {
  const [description, setDescription] = useState("");
  const [attachmentUrls, setAttachmentUrls] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const addAttachmentUrl = () => {
    if (!imageUrlInput.trim()) {
      alert("Please enter a valid image URL");
      return;
    }
    
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
      alert("Please write a reply");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(description, attachmentUrls);
      setDescription("");
      setAttachmentUrls([]);
      setImageUrlInput("");
    } catch (err) {
      console.error("Error submitting reply:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="reply-composer-container">
      <textarea
        className="reply-textarea"
        placeholder={placeholder}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={submitting}
        onKeyDown={(e) => {
          if (e.key === "Escape") onCancel();
        }}
      />

      <div className="reply-attachments-section">
        <div className="reply-attachment-input-group">
          <input
            type="text"
            placeholder="Paste image URL (optional)"
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
            disabled={submitting}
            className="reply-image-url-input"
            onKeyPress={(e) => {
              if (e.key === "Enter") addAttachmentUrl();
            }}
          />
          <button
            className="add-reply-image-btn"
            onClick={addAttachmentUrl}
            disabled={submitting || !imageUrlInput.trim()}
          >
            Add Image
          </button>
        </div>

        {attachmentUrls.length > 0 && (
          <div className="reply-attachment-list">
            {attachmentUrls.map((url, index) => (
              <div key={index} className="reply-attachment-item">
                <img
                  src={url}
                  alt={`Attachment ${index + 1}`}
                  className="reply-attachment-thumb"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/50?text=Error";
                  }}
                />
                <span className="reply-attachment-url" title={url}>
                  {url.length > 40 ? url.substring(0, 40) + "..." : url}
                </span>
                <button
                  className="remove-reply-attachment-btn"
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
      </div>

      <div className="reply-composer-actions">
        <button
          className="submit-reply-btn"
          onClick={handleSubmit}
          disabled={submitting || !description.trim()}
        >
          {submitting ? "Posting..." : "Post Reply"}
        </button>
        <button
          className="cancel-reply-btn"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ReplyComposer;
