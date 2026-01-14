import React, { useEffect, useState } from "react";
import SpaceCard from "./SpaceCard";

const base_url = import.meta.env.VITE_BACKEND_API_URL;

const SpaceList = ({ marketId }) => {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const res = await fetch(`${base_url}/market/${marketId}/space`);
        const data = await res.json();

        if (res.ok) setSpaces(data);
        else console.error(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (marketId) fetchSpaces();
  }, [marketId]);

  if (loading) return <div>Loading spaces...</div>;
  if (spaces.length === 0)
    return <div className="text-gray-500 text-center mt-10">No spaces available.</div>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
      {spaces.map((space) => (
        <SpaceCard key={space.id} space={space} />
      ))}
    </div>
  );
};

export default SpaceList;
