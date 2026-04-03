import { useState } from 'react';
import api from '../services/api';

export default function ReplyItem({ reply, depth = 0, onReplyAdded }) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [error, setError] = useState('');

  const isLoggedIn = !!localStorage.getItem('authToken');
  const maxDepth = 5; // Allow up to 5 levels of nesting

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) {
      setError('Reply cannot be empty');
      return;
    }

    try {
      setSubmittingReply(true);
      setError('');
      
      await api.post('/reviews/reply', {
        parent_reply_id: reply.id,
        description: replyText
      });

      setReplyText('');
      setIsReplying(false);
      onReplyAdded?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit reply');
      console.error(err);
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div style={{ marginLeft: `${depth * 20}px` }} className="space-y-3">
      <div className="glass-card p-4 border border-white/10 hover:border-white/20 transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <p className="text-white font-semibold text-sm">{reply.username}</p>
          <p className="text-[#A8A8B3] text-xs">
            {reply.created_at
              ? new Date(reply.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : 'Recently'}
          </p>
        </div>

        {/* Comment */}
        <p className="text-[#EAEAEA] text-sm leading-relaxed mb-3">{reply.description}</p>

        {/* Voting + Reply Button */}
        <div className="flex items-center gap-3 pt-3 border-t border-white/10">
          <div className="text-[#A8A8B3] text-xs flex items-center gap-2">
            <span>👍 {reply.upvote || 0}</span>
            <span>👎 {reply.downvote || 0}</span>
          </div>

          {isLoggedIn && depth < maxDepth && (
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="ml-auto px-3 py-1 text-xs text-[#E94560] hover:text-white transition-colors rounded hover:bg-white/5"
            >
              {isReplying ? 'Cancel' : '+ Reply'}
            </button>
          )}
        </div>

        {/* Reply Form */}
        {isReplying && (
          <form onSubmit={handleSubmitReply} className="mt-4 pt-4 border-t border-white/10">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              rows="3"
              className="w-full bg-[#16213E] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-[#A8A8B3] focus:outline-none focus:border-[#E94560] focus:ring-1 focus:ring-[#E94560] transition-all resize-none"
            />
            {error && (
              <p className="text-red-400 text-xs mt-2">{error}</p>
            )}
            <div className="flex gap-2 mt-3">
              <button
                type="submit"
                disabled={submittingReply}
                className="px-3 py-1 bg-gradient-to-r from-[#E94560] to-[#533483] text-white text-xs font-semibold rounded hover:shadow-[0_0_10px_rgba(233,69,96,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingReply ? 'Submitting...' : 'Reply'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsReplying(false);
                  setReplyText('');
                  setError('');
                }}
                className="px-3 py-1 bg-white/10 text-[#A8A8B3] text-xs font-semibold rounded hover:bg-white/20 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Nested Replies - Recursive */}
      {reply.replies && reply.replies.length > 0 && (
        <div className="space-y-3">
          {reply.replies.map((nestedReply) => (
            <ReplyItem
              key={nestedReply.id}
              reply={nestedReply}
              depth={depth + 1}
              onReplyAdded={onReplyAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
}
