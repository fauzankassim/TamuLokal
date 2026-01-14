import React, { useRef, useState, useEffect } from "react";
import { TbPlus, TbTrash, TbDeviceFloppy, TbHandMove } from "react-icons/tb";

const GRID_SIZE = 40;
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 2.5;

export default function MarketFloorPlanBuilder({ 
  edit = false, 
  existingStalls = [], 
  marketId,
  onSave 
}) {
  const canvasRef = useRef(null);
  const lastTouchDistance = useRef(null);
  
  const [mode, setMode] = useState("add"); // "add" | "delete" | "free"
  const [stalls, setStalls] = useState([]);
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState(null);
  const [drawing, setDrawing] = useState(null);
  const [showFeePopup, setShowFeePopup] = useState(false);
  const [feeInput, setFeeInput] = useState("");

  /* ============================
   * Initialize with existing stalls when in edit mode
   * ============================ */
  useEffect(() => {
    if (edit && existingStalls.length > 0) {
      setStalls(existingStalls);
      
      if (canvasRef.current && existingStalls.length > 0) {
        const ctx = canvasRef.current.getContext("2d");
        fitToView(ctx, existingStalls);
      }
    }
  }, [edit, existingStalls]);

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
   * Fit to view function
   * ============================ */
  const fitToView = (ctx, stallsToFit) => {
    if (!stallsToFit || stallsToFit.length === 0) return;

    let minX = Math.min(...stallsToFit.map((s) => s.x));
    let minY = Math.min(...stallsToFit.map((s) => s.y));
    let maxX = Math.max(...stallsToFit.map((s) => s.x)) + GRID_SIZE;
    let maxY = Math.max(...stallsToFit.map((s) => s.y)) + GRID_SIZE;

    const padding = 2 * GRID_SIZE;

    const initialCamera = {
      x: minX - (ctx.canvas.width - (maxX - minX + padding * 2)) / 2 / camera.zoom,
      y: minY - (ctx.canvas.height - (maxY - minY + padding * 2)) / 2 / camera.zoom,
      zoom: 1,
    };
    
    setCamera(initialCamera);
  };

  /* ============================
   * Drawing functions
   * ============================ */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      draw(ctx);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [camera, stalls, drawing]);

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

      let fillColor = "#4ade80"; // Default green for new stalls
      
      if (edit && s.id) {
        fillColor = "#60a5fa"; // Blue for existing
      }

      ctx.fillStyle = fillColor;
      ctx.strokeStyle = edit && s.id ? "#1d4ed8" : "#166534";
      ctx.lineWidth = edit && s.id ? 2 : 1;
      ctx.fillRect(x, y, size, size);
      ctx.strokeRect(x, y, size, size);

      ctx.fillStyle = "#064e3b";
      ctx.font = `${12 * camera.zoom}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      const label = s.lot || String(index + 1).padStart(String(stalls.length).length, "0");
      ctx.fillText(label, x + size / 2, y + size / 2);
    });
  };

  const drawPreview = (ctx) => {
    if (!drawing || mode === "free") return;

    ctx.fillStyle = mode === "add" ? "rgba(59,130,246,0.4)" : "rgba(239,68,68,0.4)";
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
    drawPreview(ctx);
  };

  /* ============================
   * Input Handlers
   * ============================ */
  const applyAt = (x, y) => {
    if (mode === "free") return; // No building/deleting in free mode

    const sx = snap(x);
    const sy = snap(y);
    const key = cellKey(sx, sy);

    if (mode === "add") {
      setStalls((prev) => {
        const existing = prev.find((s) => cellKey(s.x, s.y) === key);
        if (existing) return prev;
        
        return [...prev, { 
          x: sx, 
          y: sy,
          ...(existingStalls.find(s => cellKey(s.x, s.y) === key) || {})
        }];
      });
    }

    if (mode === "delete") {
      setStalls((prev) => prev.filter((s) => cellKey(s.x, s.y) !== key));
    }

    setDrawing({ x: sx, y: sy });
  };

  /* ============================
   * Mouse Events
   * ============================ */
  const onMouseDown = (e) => {
    // Middle click or free mode for panning
    if (e.button === 1 || mode === "free") {
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

    if (!drawing || mode === "free") return;
    const { x, y } = screenToWorld(e.clientX, e.clientY);
    applyAt(x, y);
  };

  const onMouseUp = () => {
    setDrawing(null);
    setIsPanning(false);
  };

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

    if (e.touches.length === 1 && mode !== "free") {
      const { x, y } = touchToWorld(e.touches[0]);
      applyAt(x, y);
    }

    if (e.touches.length === 2 || mode === "free") {
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

    if (e.touches.length === 1 && drawing && mode !== "free") {
      const { x, y } = touchToWorld(e.touches[0]);
      applyAt(x, y);
    }

    if ((e.touches.length === 2 || mode === "free") && panStart) {
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
   * Save handler
   * ============================ */
  const handleSaveClick = () => {
    if (stalls.length === 0) {
      alert("No stalls to save!");
      return;
    }

    // Show custom fee popup instead of prompt
    setShowFeePopup(true);
  };

  const handleFeeSubmit = () => {
    if (!edit && (!feeInput || feeInput.trim() === "")) {
      alert("Fee is required for new stalls!");
      return;
    }

    const fee = parseFloat(feeInput) || 0;
    
    // Update stalls with fee
    const updatedStalls = stalls.map(stall => ({
      ...stall,
      fee: fee
    }));

    // Call parent's save function
    if (onSave) {
      onSave(updatedStalls, fee);
    }

    setShowFeePopup(false);
    setFeeInput("");
  };

  /* ============================
   * Render
   * ============================ */
  return (
    <div className="w-full h-full relative bg-gray-100 flex">
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
          {/* ADD STALL */}
          <button
            onClick={() => setMode("add")}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl
              ${mode === "add" ? "bg-green-400 text-white" : "bg-gray-100"}`}
            title="Add Stalls"
          >
            <TbPlus />
          </button>

          {/* FREE MOVE */}
          <button
            onClick={() => setMode("free")}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl
              ${mode === "free" ? "bg-blue-400 text-white" : "bg-gray-100"}`}
            title="Free Move (Pan/Zoom)"
          >
            <TbHandMove />
          </button>

          {/* DELETE */}
          <button
            onClick={() => setMode("delete")}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl
              ${mode === "delete" ? "bg-red-400 text-white" : "bg-gray-100"}`}
            title="Delete Stalls"
          >
            <TbTrash />
          </button>

          {/* SAVE */}
          <button
            onClick={handleSaveClick}
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl bg-orange-500 text-white hover:bg-orange-600"
            title="Save Floor Plan"
          >
            <TbDeviceFloppy />
          </button>
        </div>

        {/* STATUS INFO */}
        <div className="absolute top-3 left-3 bg-white shadow rounded px-3 py-2 text-sm">
          <div>
            {edit && existingStalls.length > 0 ? (
              <>
                <span className="text-blue-600">🟦 Existing: {existingStalls.length}</span>
                <br />
                <span className="text-green-600">🟩 New: {stalls.length - existingStalls.length}</span>
              </>
            ) : (
              <span className="text-green-600">🟩 Stalls: {stalls.length}</span>
            )}
          </div>
          <div>
            Mode:{" "}
            <span className={`font-medium ${
              mode === "add" ? "text-green-600" :
              mode === "delete" ? "text-red-600" :
              "text-blue-600"
            }`}>
              {mode === "add" ? "Add" : mode === "delete" ? "Delete" : "Free Move"}
            </span>
          </div>
        </div>

        {/* CUSTOM FEE POPUP MODAL */}
        {showFeePopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Set Stall Fee
              </h3>
              
              <p className="text-sm text-gray-600 mb-4">
                {edit 
                  ? "Enter the fee for each stall (RM). Leave empty to keep existing fees."
                  : "Enter the fee for each stall (RM)."
                }
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fee per Stall (RM)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={feeInput}
                  onChange={(e) => setFeeInput(e.target.value)}
                  placeholder={edit ? "e.g., 50.00 (leave empty to keep existing)" : "e.g., 50.00"}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowFeePopup(false);
                    setFeeInput("");
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFeeSubmit}
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 font-medium"
                >
                  {edit ? "Update & Save" : "Save Floor Plan"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}