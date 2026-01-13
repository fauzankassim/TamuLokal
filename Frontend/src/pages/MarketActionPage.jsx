import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import MarketForm from "../components/MarketForm";
import { TbChevronLeft } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Spinner from "../components/Spinner";

const MarketActionPage = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // undefined for add route
    const session = useAuth(true); // ensure we have user session
    const [marketData, setMarketData] = useState(null);
    const base_url = import.meta.env.VITE_BACKEND_API_URL;
    const [loading, setLoading] = useState(false);
  // Fetch market if editing
  useEffect(() => {
    if (!id) return; // only fetch if editing

    const fetchMarket = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${base_url}/market/${id}`);
        if (!res.ok) throw new Error("Failed to fetch market");
        const data = await res.json();

        setMarketData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarket();
  }, [id]);

  if (!session) return null; // wait for session
  if (loading) return <Spinner loading={true}/>

  return (
    <div className="relative w-full h-screen">
      <Header title={id ? "Edit Market" : "Register Market"} />
      <main >
        <MarketForm
          organizerId={session.user.id}
          market={id ? marketData : null} // pass market data if editing
          onClose={() => window.history.back()}
          setLoading={setLoading}
        />
      </main>
    </div>
  );
};

export default MarketActionPage;