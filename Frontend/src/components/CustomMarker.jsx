import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

const CustomMarker = ({ position, iconUrl, popupText, size = 40, onClick }) => {
  const icon = L.divIcon({
    html: `
      <div class="flex items-center justify-center rounded-full border-2 border-blue-500 bg-white" 
           style="width: ${size}px; height: ${size}px;">
        <img src="${iconUrl}" class="w-3/4 h-3/4 object-contain" />
      </div>
    `,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });

  return (
    <Marker position={position} icon={icon} eventHandlers={{ click: onClick }}>
      {popupText && <Popup>{popupText}</Popup>}
    </Marker>
  );
};

export default CustomMarker;
