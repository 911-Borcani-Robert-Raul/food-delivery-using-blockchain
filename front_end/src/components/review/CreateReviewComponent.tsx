import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Textarea,
} from "@chakra-ui/react";
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
      <FormControl>
        <FormLabel>Rating:</FormLabel>
        <Slider
          min={1}
          max={5}
          step={1}
          value={rating}
          onChange={(value) => setRating(value)}
        >
          <SliderTrack bg="gray.200">
            <SliderFilledTrack bg="teal.500" />
          </SliderTrack>
          <SliderThumb boxSize={6}>
            <Box color="teal.500" />
          </SliderThumb>
        </Slider>
      </FormControl>
      <br />
      <FormControl>
        <FormLabel>Comment:</FormLabel>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </FormControl>
      <br />
      <Button type="submit">Submit Review</Button>
    </form>
  );
}
