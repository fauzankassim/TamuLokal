import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import ProductReviewForm from "../components/ProductReviewForm";

const VisitorProductReviewActionPage = () => {
  const navigate = useNavigate();
  const { review_id, product_id } = useParams(); // both come from route params

  return (
    <div className="w-screen min-h-screen flex flex-col">
      {/* Header */}
      <Header title={"Product Review"} />

      {/* Form Container */}
      <div className="flex-1 w-full px-4 md:px-8 pb-10">
        <div className="max-w-3xl mx-auto overflow-hidden">
          <ProductReviewForm product_id={product_id} review_id={review_id} />
        </div>
      </div>
    </div>
  );
};

export default VisitorProductReviewActionPage;
