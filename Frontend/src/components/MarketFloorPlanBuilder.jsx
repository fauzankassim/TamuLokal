import React, { useRef, useState, useEffect } from "react";
import { TbPlus, TbFlag, TbTrash, TbDeviceFloppy, TbX } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";

/**
 * MarketFloorPlanBuilder
 * -----------------------
 * Grid-based infinite floor plan builder inspired by draw.io
 * - Each 1x1 grid cell = 1 stall unit
 * - Organizer can draw stalls by click-drag / touch-drag
 * - Supports pan, zoom, snap-to-grid
 * - Mobile-friendly (pinch zoom, two-finger pan)
 * - LEFT TOOLBAR:
 *   • Add stalls
 *   • Delete stalls
 *   • Set single starting point (unique)
 */ 

const GRID_SIZE = 40;
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 2.5;

export default function MarketFloorPlanBuilder() {
  const navigate = useNavigate();
  const { id: market_id } = useParams();
  const canvasRef = useRef(null);
  const lastTouchDistance = useRef(null);
  const base_url = import.meta.env.VITE_BACKEND_API_URL;
  const [mode, setMode] = useState("add"); // add | delete | start
  const [stalls, setStalls] = useState([]); // {x,y,w,h,type}
  const [startPoint, setStartPoint] = useState(null); // single cell

  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState(null);
  const [drawing, setDrawing] = useState(null);

  /* ============================
   * Utilities
   * ============================ */

  const snap = (v) => Math.floor(v / GRID_SIZE) * GRID_SIZE;

  const screenToWorld = (sx, sy) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (sx - rect.left) / camera.zoom + camera.x,
      y: (sy - rect.top) / camera.zoom + camera.y,
    };
  };

  const touchToWorld = (touch) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (touch.clientX - rect.left) / camera.zoom + camera.x,
      y: (touch.clientY - rect.top) / camera.zoom + camera.y,
    };
  };

  const cellKey = (x, y) => `${x},${y}`;

  /* ============================
   * Drawing
   * ============================ */

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      draw(ctx);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [camera, stalls, drawing, startPoint]);

  const drawGrid = (ctx) => {
    const { width, height } = ctx.canvas;
    const step = GRID_SIZE * camera.zoom;

    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;

    const startX = (-camera.x * camera.zoom) % step;
    const startY = (-camera.y * camera.zoom) % step;

    for (let x = startX; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = startY; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

const drawStalls = (ctx) => {
  stalls.forEach((s, index) => {
    const x = (s.x - camera.x) * camera.zoom;
    const y = (s.y - camera.y) * camera.zoom;
    const size = GRID_SIZE * camera.zoom;

    // Stall box
    ctx.fillStyle = "#4ade80";
    ctx.strokeStyle = "#166534";
    ctx.fillRect(x, y, size, size);
    ctx.strokeRect(x, y, size, size);

    // Stall number
    ctx.fillStyle = "#064e3b";
    ctx.font = `${12 * camera.zoom}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const totalDigits = String(stalls.length).length;
    const label = String(index + 1).padStart(totalDigits, "0");

    ctx.fillText(label, x + size / 2, y + size / 2);
  });
};

  const drawStartPoint = (ctx) => {
    if (!startPoint) return;

    ctx.fillStyle = "#f97316"; // orange
    ctx.fillRect(
      (startPoint.x - camera.x) * camera.zoom,
      (startPoint.y - camera.y) * camera.zoom,
      GRID_SIZE * camera.zoom,
      GRID_SIZE * camera.zoom
    );
  };

  const drawPreview = (ctx) => {
    if (!drawing) return;

    ctx.fillStyle = "rgba(59,130,246,0.4)";
    ctx.fillRect(
      (drawing.x - camera.x) * camera.zoom,
      (drawing.y - camera.y) * camera.zoom,
      GRID_SIZE * camera.zoom,
      GRID_SIZE * camera.zoom
    );
  };

  const draw = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawGrid(ctx);
    drawStalls(ctx);
    drawStartPoint(ctx);
    drawPreview(ctx);
  };

  /* ============================
   * Input Handlers (shared)
   * ============================ */

  const applyAt = (x, y) => {
    const sx = snap(x);
    const sy = snap(y);
    const key = cellKey(sx, sy);

    if (mode === "add") {
      setStalls((prev) =>
        prev.some((s) => cellKey(s.x, s.y) === key)
          ? prev
          : [...prev, { x: sx, y: sy }]
      );
    }

    if (mode === "delete") {
      setStalls((prev) => prev.filter((s) => cellKey(s.x, s.y) !== key));
      if (startPoint && cellKey(startPoint.x, startPoint.y) === key) {
        setStartPoint(null);
      }
    }

    if (mode === "start") {
      setStartPoint({ x: sx, y: sy });
    }

    setDrawing({ x: sx, y: sy });
  };

  /* ============================
   * Mouse Events
   * ============================ */

  const onMouseDown = (e) => {
    if (e.button === 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY, cam: { ...camera } });
      return;
    }

    const { x, y } = screenToWorld(e.clientX, e.clientY);
    applyAt(x, y);
  };

  const onMouseMove = (e) => {
    if (isPanning && panStart) {
      const dx = (e.clientX - panStart.x) / camera.zoom;
      const dy = (e.clientY - panStart.y) / camera.zoom;
      setCamera({ ...camera, x: panStart.cam.x - dx, y: panStart.cam.y - dy });
      return;
    }

    if (!drawing) return;
    const { x, y } = screenToWorld(e.clientX, e.clientY);
    applyAt(x, y);
  };

  const onMouseUp = () => setDrawing(null);

  const onWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setCamera((c) => ({
      ...c,
      zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, c.zoom * zoomFactor)),
    }));
  };

  /* ============================
   * Touch Events
   * ============================ */

  const onTouchStart = (e) => {
    e.preventDefault();

    if (e.touches.length === 1) {
      const { x, y } = touchToWorld(e.touches[0]);
      applyAt(x, y);
    }

    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDistance.current = Math.hypot(dx, dy);

      setPanStart({
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        cam: { ...camera },
      });
      setIsPanning(true);
    }
  };

  const onTouchMove = (e) => {
    e.preventDefault();

    if (e.touches.length === 1 && drawing) {
      const { x, y } = touchToWorld(e.touches[0]);
      applyAt(x, y);
    }

    if (e.touches.length === 2 && panStart) {
      const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;

      const dx = (cx - panStart.x) / camera.zoom;
      const dy = (cy - panStart.y) / camera.zoom;

      const dX = e.touches[0].clientX - e.touches[1].clientX;
      const dY = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dX, dY);

      let zoom = camera.zoom;
      if (lastTouchDistance.current) {
        zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom * (dist / lastTouchDistance.current)));
      }

      lastTouchDistance.current = dist;
      setCamera({ x: panStart.cam.x - dx, y: panStart.cam.y - dy, zoom });
    }
  };

  const onTouchEnd = () => {
    setDrawing(null);
    setIsPanning(false);
    lastTouchDistance.current = null;
  };

  /* ============================
   * Render
   * ============================ */

  return (
    <div className="w-full h-full relative bg-gray-100 flex">
      {/* LEFT TOOLBAR 
      <div className="w-14 bg-white border-r flex flex-col items-center py-2 gap-2">
        <button onClick={() => setMode("add")} className={`w-10 h-10 rounded ${mode === "add" ? "bg-green-200" : "bg-gray-100"}`}>➕</button>
        <button onClick={() => setMode("delete")} className={`w-10 h-10 rounded ${mode === "delete" ? "bg-red-200" : "bg-gray-100"}`}>🗑</button>
        <button onClick={() => setMode("start")} className={`w-10 h-10 rounded ${mode === "start" ? "bg-orange-200" : "bg-gray-100"}`}>🚩</button>
      </div>

      {/* CANVAS */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair touch-none"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onWheel={onWheel}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        />

        {/* FLOATING BOTTOM TOOLBAR */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-4 z-50">
            {/* ADD */}
            <button
                onClick={() => setMode("add")}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl
                ${mode === "add" ? "bg-green-400 text-white" : "bg-gray-100"}`}
            >
                <TbPlus />
            </button>

            {/* START POINT */}
            <button
                onClick={() => setMode("start")}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl
                ${mode === "start" ? "bg-orange-400 text-white" : "bg-gray-100"}`}
            >
                <TbFlag />
            </button>

            {/* DELETE */}
            <button
                onClick={() => setMode("delete")}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl
                ${mode === "delete" ? "bg-red-400 text-white" : "bg-gray-100"}`}
            >
                <TbTrash />
            </button>
            {/* SAVE */}
            <button
              onClick={async () => {
                if (stalls.length === 0) {
                  alert("No stalls to save!");
                  return;
                }

                // Ask user for fee per lot
                const fee = prompt("Enter fee for one lot:", "0");
                if (!fee) return;

                const totalDigits = String(stalls.length).length;

                const payload = stalls.map((s, i) => ({
                  lot: String(i + 1).padStart(totalDigits, "0"),
                  fee: fee,
                  market_id: market_id,
                  x_floor_plan: s.x,
                  y_floor_plan: s.y,
                }));

                try {
                  const res = await fetch(`${base_url}/market/${market_id}/space`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  });

                  if (!res.ok) {
                    const errText = await res.text();
                    console.error("Failed to save stalls:", errText);
                    alert("Failed to save stalls. Check console for details.");
                  } else {
                    console.log("All stalls saved successfully!");
                    alert("All stalls saved successfully!");
                    navigate(`/business/market/${market_id}/space`);
                  }
                } catch (err) {
                  console.error("Error saving stalls:", err);
                  alert("Error saving stalls. Check console for details.");
                }
              }}
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl bg-blue-500 text-white"
            >
              <TbDeviceFloppy />
            </button>

        </div>


        <div className="absolute top-3 left-3 bg-white shadow rounded px-3 py-2 text-sm">
          <div>🟩 Stalls: {stalls.length}</div>
          <div>🚩 Start: {startPoint ? "Set" : "None"}</div>
          
        </div>

        </div>
      </div>
  );
}
