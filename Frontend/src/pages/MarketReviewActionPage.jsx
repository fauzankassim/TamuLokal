// src/pages/MarketReviewActionPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import MarketReviewForm from "../components/MarketReviewForm";

const MarketReviewActionPage = () => {
  const { id } = useParams(); // market id from URL

  return (
    <div className="min-h-screen bg-gray-50">
      <MarketReviewForm marketId={id} type="new" />
    </div>
  );
};

export default MarketReviewActionPage;
