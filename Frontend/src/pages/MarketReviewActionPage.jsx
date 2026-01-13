import React from "react";
import { TbChevronLeft } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";
import MarketReviewForm from "../components/MarketReviewForm";
import Header from "../components/Header";
const MarketReviewActionPage = () => {
  const navigate = useNavigate();
  const { review_id, market_id } = useParams(); // both come from route params

  return (
    <div className="w-screen min-h-screen flex flex-col">
      {/* Header */}
      <Header title={"Market Review"} />

      {/* Form Container */}
      <div className="flex-1 w-full px-4 md:px-8 pb-10">
        <div className="max-w-3xl mx-auto overflow-hidden">
          <MarketReviewForm market_id={market_id} review_id={review_id} />
        </div>
      </div>
    </div>
  );
};

export default MarketReviewActionPage;