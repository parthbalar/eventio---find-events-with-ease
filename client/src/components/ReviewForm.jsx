import { useState, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { UserContext } from "../UserContext";

export default function ReviewForm({ selectedTicket, closeModal }) {
  const { user } = useContext(UserContext);
  const [review, setReview] = useState({ rating: 0, comment: "" });

  const handleStarClick = (rating) => {
    setReview({ ...review, rating });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!review.comment || review.rating === 0) {
      Swal.fire({
        title: "Error!",
        text: "Please fill in all fields and select a rating.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!selectedTicket.eventid || !user._id) {
      Swal.fire({
        title: "Error!",
        text: "Invalid event or user information.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:4000/api/review/${selectedTicket.eventid}/review`,
        {
          user: user._id,
          rating: review.rating,
          comment: review.comment,
        }
      );

      Swal.fire({
        title: "Success!",
        text: "Your review has been submitted.",
        icon: "success",
        confirmButtonText: "OK",
      });

      setReview({ rating: 0, comment: "" });
      closeModal();
    } catch (error) {
      console.error("Error submitting review:", error.response?.data || error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to submit review. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <form className="mt-6" onSubmit={handleSubmitReview}>
      <h2 className="text-xl font-semibold mb-4">Review Event</h2>
      <p className="font-semibold">{selectedTicket.ticketDetails.eventname.toUpperCase()}</p>

      <div className="flex space-x-2 mb-4">
        {Array.from({ length: 5 }, (_, i) => (
          <button
            type="button"
            key={i}
            onClick={() => handleStarClick(i + 1)}
            className="text-2xl focus:outline-none"
          >
            {i < review.rating ? (
              <AiFillStar className="text-yellow-500" />
            ) : (
              <AiOutlineStar className="text-gray-400 hover:text-yellow-500 transition-all duration-200" />
            )}
          </button>
        ))}
        <span className="ml-2 text-lg text-gray-700">{review.rating} / 5</span>
      </div>

      <textarea
        placeholder="Write a review..."
        className="border p-2 w-full rounded mt-2"
        value={review.comment}
        onChange={(e) => setReview({ ...review, comment: e.target.value })}
      />

      <div className="flex justify-end mt-4 gap-2">
        <button
          type="button"
          onClick={closeModal}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
        >
          Submit Review
        </button>
      </div>
    </form>
  );
}
