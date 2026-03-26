import React from "react";
import ReviewCard from "./reviewcard";

const ReviewList = ({ reviews }) => (
  <div>
    {reviews.length === 0 ? (
      <p className="text-muted">No reviews yet.</p>
    ) : (
      reviews.map((review) => (
        <ReviewCard key={review.id || review.date + review.username} {...review} />
      ))
    )}
  </div>
);

export default ReviewList;
