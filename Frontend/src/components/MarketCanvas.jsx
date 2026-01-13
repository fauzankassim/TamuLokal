import React, { useRef, useEffect, useState } from "react";
import { TbArrowBigLeftFilled, TbArrowBigRightFilled, TbArrowBigUpFilled, TbArrowBigDownFilled } from "react-icons/tb";
import { NavLink } from "react-router-dom";

export default function MarketCanvas({ marketId, stalls, isVendor=false, session, onSelectStall }) {
  const initialCameraRef = useRef({ x: 0, y: 0, zoom: 1 });
  const canvasRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const initialPinchDistanceRef = useRef(null);
  const [selectedStall, setSelectedStall] = useState(null);

  /* ============================
   * CONFIG
   * ============================ */
  const GRID_SIZE = 40;
  const GRID_PADDING = 1;

  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 });
  const [showArrows, setShowArrows] = useState({ left: false, right: false, top: false, bottom: false });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  /* ============================
   * Fit camera
   * ============================ */
  const fitToView = (ctx) => {
    if (!stalls || !stalls.length) return;

    let minX = Math.min(...stalls.map((s) => s.x));
    let minY = Math.min(...stalls.map((s) => s.y));
    let maxX = Math.max(...stalls.map((s) => s.x)) + GRID_SIZE;
    let maxY = Math.max(...stalls.map((s) => s.y)) + GRID_SIZE;

    const padding = GRID_PADDING * GRID_SIZE;

    const initialCamera = {
      x: minX - (ctx.canvas.width - (maxX - minX + padding * 2)) / 2,
      y: minY - (ctx.canvas.height - (maxY - minY + padding * 2)) / 2,
      zoom: 1,
    }
    setCamera(initialCamera);
    initialCameraRef.current = initialCamera;
  };

  /* ============================
   * Pan camera
   * ============================ */
  const panCamera = (dx, dy) => {
    setCamera((prev) => ({
      ...prev,
      x: prev.x - dx / prev.zoom,
      y: prev.y - dy / prev.zoom,
    }));
  };

  /* ============================
   * Zoom
   * ============================ */
  const handleZoom = (zoomFactor, clientX, clientY) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    const worldX = mouseX / camera.zoom + camera.x;
    const worldY = mouseY / camera.zoom + camera.y;

    const newZoom = Math.max(0.5, Math.min(3, camera.zoom * zoomFactor));

    const newX = worldX - mouseX / newZoom;
    const newY = worldY - mouseY / newZoom;

    setCamera({ x: newX, y: newY, zoom: newZoom });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    handleZoom(zoomFactor, e.clientX, e.clientY);
  };

  /* ============================
   * Mouse & touch handlers
   * ============================ */
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    touchStartRef.current = { x: e.clientX, y: e.clientY };
    isDraggingRef.current = true;
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (isDraggingRef.current) {
      const dx = e.clientX - touchStartRef.current.x;
      const dy = e.clientY - touchStartRef.current.y;
      panCamera(dx, dy);
      touchStartRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => { isDraggingRef.current = false; };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      isDraggingRef.current = true;
      initialPinchDistanceRef.current = null;
    } else if (e.touches.length === 2) {
      const touch1 = e.touches[0], touch2 = e.touches[1];
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      initialPinchDistanceRef.current = Math.sqrt(dx * dx + dy * dy);
      touchStartRef.current = { x: (touch1.clientX + touch2.clientX) / 2, y: (touch1.clientY + touch2.clientY) / 2 };
      isDraggingRef.current = false;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && isDraggingRef.current) {
      const touch = e.touches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      panCamera(dx, dy);
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    } else if (e.touches.length === 2 && initialPinchDistanceRef.current) {
      const touch1 = e.touches[0], touch2 = e.touches[1];
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      const currentDistance = Math.sqrt(dx * dx + dy * dy);
      const zoomFactor = currentDistance / initialPinchDistanceRef.current;
      const midX = (touch1.clientX + touch2.clientX) / 2;
      const midY = (touch1.clientY + touch2.clientY) / 2;
      handleZoom(zoomFactor, midX, midY);
      initialPinchDistanceRef.current = currentDistance;
      touchStartRef.current = { x: midX, y: midY };
    }
  };

  const handleTouchEnd = () => { isDraggingRef.current = false; initialPinchDistanceRef.current = null; };

  /* ============================
   * Click on stall
   * ============================ */
  const handleCanvasClick = (e) => {
    if (isDraggingRef.current || !canvasRef.current || !stalls || !stalls.length) {
      isDraggingRef.current = false;
      return;
    }
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const worldX = clickX / camera.zoom + camera.x;
    const worldY = clickY / camera.zoom + camera.y;

    const clickedStall = stalls.find(stall =>
      worldX >= stall.x && worldX <= stall.x + GRID_SIZE &&
      worldY >= stall.y && worldY <= stall.y + GRID_SIZE
    );
    setSelectedStall(clickedStall || null);
  };

  /* ============================
   * Drawing functions
   * ============================ */
  const draw = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (!stalls || !stalls.length) return;

    // Determine bounds
    let minX = Math.min(...stalls.map((s) => s.x));
    let minY = Math.min(...stalls.map((s) => s.y));
    let maxX = Math.max(...stalls.map((s) => s.x)) + GRID_SIZE;
    let maxY = Math.max(...stalls.map((s) => s.y)) + GRID_SIZE;
    const padding = GRID_PADDING * GRID_SIZE;

    // Draw grid
    ctx.strokeStyle = "#FFFDFA";
    ctx.lineWidth = 1;
    for (let x = minX - padding; x <= maxX + padding; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo((x - camera.x) * camera.zoom, (minY - padding - camera.y) * camera.zoom);
      ctx.lineTo((x - camera.x) * camera.zoom, (maxY + padding - camera.y) * camera.zoom);
      ctx.stroke();
    }
    for (let y = minY - padding; y <= maxY + padding; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo((minX - padding - camera.x) * camera.zoom, (y - camera.y) * camera.zoom);
      ctx.lineTo((maxX + padding - camera.x) * camera.zoom, (y - camera.y) * camera.zoom);
      ctx.stroke();
    }

    // Draw stalls
    stalls.forEach((stall) => {
      const x = (stall.x - camera.x) * camera.zoom;
      const y = (stall.y - camera.y) * camera.zoom;
      const size = GRID_SIZE * camera.zoom;
      let fillColor = "#4ade80";
      const hasApplied =
        isVendor &&
        stall.pending_applications?.some(
          (app) => app.vendor_id === session?.user?.id
        );

      let strokeColor = "#026700";
      if (selectedStall && selectedStall.id === stall.id && stall.pending_applications == 0) {
        fillColor = "#22c55e"; // selected available
      }
      else if (stall.status === "Occupied") {
        fillColor = "#FF8225"; // occupied
      }
      else if (stall.pending_applications.length > 0 || hasApplied) {
        fillColor = "#60a5fa"; // pending (other vendors)
      }



      ctx.fillStyle = fillColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = selectedStall && selectedStall.id === stall.id ? 3 : 1;
      ctx.fillRect(x, y, size, size);
      ctx.strokeRect(x, y, size, size);

      ctx.fillStyle = "#171A1D";
      ctx.font = `${Math.max(8, 12 * camera.zoom)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(stall.lot, x + size / 2, y + size / 2);
    });
  };

  /* ============================
   * Lifecycle effects
   * ============================ */
  useEffect(() => {
    // Disable page scroll
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      // Restore original scroll when component unmounts
      document.body.style.overflow = originalStyle;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const parent = canvas.parentElement;
    if (!parent) return;

    const resize = () => {
      const { clientWidth, clientHeight } = parent;

      if (
        canvas.width !== clientWidth ||
        canvas.height !== clientHeight
      ) {
        canvas.width = clientWidth;
        canvas.height = clientHeight;
        setCanvasSize({ width: clientWidth, height: clientHeight });
        if (stalls && stalls.length) fitToView(ctx);
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(parent);

    resize(); // initial

    return () => observer.disconnect();
  }, [stalls]);

  useEffect(() => {
    if (!canvasRef.current || !stalls || !stalls.length) return;

    const ctx = canvasRef.current.getContext("2d");
    draw(ctx);

    // Compute arrows without causing infinite re-render
    const canvas = canvasRef.current;
    const visibleMinX = camera.x;
    const visibleMaxX = camera.x + canvas.width / camera.zoom;
    const visibleMinY = camera.y;
    const visibleMaxY = camera.y + canvas.height / camera.zoom;

    const minGridX = Math.min(...stalls.map((s) => s.x)) - GRID_PADDING * GRID_SIZE;
    const minGridY = Math.min(...stalls.map((s) => s.y)) - GRID_PADDING * GRID_SIZE;
    const maxGridX = Math.max(...stalls.map((s) => s.x + GRID_SIZE)) + GRID_PADDING * GRID_SIZE;
    const maxGridY = Math.max(...stalls.map((s) => s.y + GRID_SIZE)) + GRID_PADDING * GRID_SIZE;

    setShowArrows({
      left: minGridX < visibleMinX - GRID_SIZE / 2,
      right: maxGridX > visibleMaxX + GRID_SIZE / 2,
      top: minGridY < visibleMinY - GRID_SIZE / 2,
      bottom: maxGridY > visibleMaxY + GRID_SIZE / 2,
    });
  }, [camera, stalls, canvasSize, selectedStall]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd);
    canvas.addEventListener("click", handleCanvasClick);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("click", handleCanvasClick);
    };
  }, [camera, stalls, selectedStall]);

  /* ============================
   * Render
   * ============================ */
  if (!stalls || !stalls.length) return <div>No stalls found</div>;

  console.log(selectedStall);
  return (
    <div className="relative w-full h-full flex">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-move rounded-lg"
        style={{ touchAction: "none" }}
      />
      {/* Arrow icons */}
      {showArrows.left && (
        <TbArrowBigLeftFilled
          className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500 text-3xl z-10"
        />
      )}
      {showArrows.right && (
        <TbArrowBigRightFilled
          className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-500 text-3xl z-10"
        />
      )}
      {showArrows.top && (
        <TbArrowBigUpFilled
          className="absolute top-6 left-1/2 transform -translate-x-1/2 text-gray-500 text-3xl z-10"
        />
      )}
      {showArrows.bottom && (
        <TbArrowBigDownFilled
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-gray-500 text-3xl z-10"
        />
      )}
      {/* Overlay for selected stall */}
      {selectedStall && (
        <div
          className="absolute inset-0 bg-black bg-opacity-30 z-0"
          onClick={() => setSelectedStall(null)}
        />
      )}
      {selectedStall && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Lot {selectedStall.lot}
              </h3>
              <button
                onClick={() => setSelectedStall(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="px-5 py-4 space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium
                    ${selectedStall.status === "Available" && "bg-green-100 text-green-700"}
                    ${selectedStall.status === "Occupied" && "bg-yellow-100 text-yellow-700"}
                    ${selectedStall.status === "Reserved" && "bg-blue-100 text-blue-700"}
                    ${selectedStall.status === "Maintenance" && "bg-red-100 text-red-700"}
                  `}
                >
                  {selectedStall.status}
                </span>
              </div>

              {/* Application / Vendor */}
              <div className="flex items-center justify-between">
                {selectedStall.status === "Occupied" ? (
                  <>
                    {/* Occupied → Vendor info */}
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                        {selectedStall.vendor_image ? (
                          <img
                            src={selectedStall.vendor_image}
                            alt={selectedStall.vendor_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm text-gray-400">N/A</span>
                        )}
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Vendor</p>
                        <p className="text-sm font-medium text-gray-800">
                          {selectedStall.vendor_name || "Unknown Vendor"}
                        </p>
                      </div>
                    </div>
                  </>
                ) : isVendor ? (
                  <>
                    {/* Vendor view */}
                    <div>
                      <p className="text-sm text-gray-500">Rent</p>
                      <p className="text-sm font-medium text-gray-800">
                        RM {selectedStall.fee}
                      </p>
                    </div>

                    {selectedStall.pending_applications?.some(
                      (app) => app.vendor_id === session?.user?.id
                    ) ? (
                      <span className="text-gray-400 font-medium text-sm">
                        Applied
                      </span>
                    ) : (
                      <NavLink
                        to={`/business/marketspace/${selectedStall.id}/apply`} // placeholder
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Apply
                      </NavLink>
                    )}
                  </>
                ) : (
                  <>
                    {/* Organizer view */}
                    <div>
                      <p className="text-sm text-gray-500">Application</p>
                      <p className="text-sm font-medium text-gray-800">
                        {selectedStall.pending_applications?.length > 0
                          ? selectedStall.pending_applications.length
                          : "None"}
                      </p>
                    </div>

                    <button 
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      onClick={() => {
                        setSelectedStall(selectedStall); // already selected
                        // Trigger modal in parent
                        if (onSelectStall) onSelectStall(selectedStall);
                      }}
                    >
                      View
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Reset button + zoom percentage */}
      <div className="fixed bottom-4 left-4 flex items-center space-x-3 bg-white rounded bg-opacity-80 px-3 py-2 z-20">
        <button
          onClick={() => setCamera(initialCameraRef.current)}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Reset
        </button>
        <span className="text-gray-700 font-medium">{Math.round(camera.zoom * 100)}%</span>
      </div>
    </div>
  );
}