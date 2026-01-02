// src/components/MarketCheckinPopup.jsx
import React, { useEffect, useState } from "react";
import { TbX } from "react-icons/tb"

export default function MarketCheckinPopup({ market, onClose }) {
  const [seconds, setSeconds] = useState(10);

  const radius = 14; // size of circular timer
  const circumference = 2 * Math.PI * radius;
  const progress = (seconds / 10) * circumference;

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onClose();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "white",
        padding: "16px 28px",
        borderRadius: "20px",
        boxShadow: "0 6px 25px rgba(0,0,0,0.18)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minWidth: "360px",
        maxWidth: "90vw",
        gap: "18px",
      }}
    >
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: 0, fontWeight: "bold" }}>
          You're at {market.name} 🎉
        </h3>

        <p style={{ marginTop: "6px", marginBottom: 0 }}>
          You’ve entered an open market area.
        </p>
      </div>

      {/* Circular countdown with X button */}
      <div
        onClick={onClose}
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          cursor: "pointer",
          position: "relative",
        }}
      >
        <svg width="36" height="36">
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="4"
          />
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            stroke="#007bff"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>

        <TbX
          size={20}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none", // allows the click to hit the parent
          }}
        />
      </div>
    </div>
  );
}
