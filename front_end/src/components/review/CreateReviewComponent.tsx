import React, { useState } from "react";
import { Review } from "../../domain/Review";

interface Props {
  onSubmit: (review: Review) => void;
}

export function CreateReviewComponent(props: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const review = new Review(undefined, rating, comment);
    props.onSubmit(review);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Rating:
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        />
      </label>
      <br />
      <label>
        Comment:
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">Submit Review</button>
    </form>
  );
}
