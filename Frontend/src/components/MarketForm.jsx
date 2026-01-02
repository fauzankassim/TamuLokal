import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import useCurrentLocation from "../hooks/useCurrentLocation";

// Reusable components
const TimeInput = ({ label, value, onChange, disabled }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1">{label}</label>
    <input
      type="time"
      value={value || "08:00"}
      onChange={onChange}
      className="w-full h-[36px] border border-gray-300 px-2 text-sm rounded"
      disabled={disabled}
    />
  </div>
);

const SameHoursToggle = ({ sameOperatingHours, onToggle }) => (
  <div className="flex items-center">
    <span className="text-sm text-gray-600 mr-2">Same hours</span>
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full ${sameOperatingHours ? 'bg-orange-500' : 'bg-gray-300'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${sameOperatingHours ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);

const RemoveButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="text-red-500 text-sm"
  >
    Remove
  </button>
);

const AddButton = ({ onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    className="text-sm text-orange-600 hover:text-orange-700"
  >
    + {label}
  </button>
);

const ScheduleHeader = ({ title, children }) => (
  <div className="flex justify-between items-center">
    <h3 className="text-sm font-medium text-gray-700">{title}</h3>
    {children}
  </div>
);

const MarketForm = ({ market = null, organizerId, onClose }) => {
  const currentLocation = useCurrentLocation();
  const isEdit = !!market;
  const [showDropdown, setShowDropdown] = useState(false);
  const [sameOperatingHours, setSameOperatingHours] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [frequency, setFrequency] = useState(1);
  const [schedules, setSchedules] = useState([]);
  const [location, setLocation] = useState();

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const base_url = import.meta.env.VITE_BACKEND_API_URL;
  
  const frequencies = [
    { id: 1, title: "Daily" },
    { id: 2, title: "Weekly" },
    { id: 3, title: "Monthly" },
    { id: 4, title: "Annually" },
    { id: 5, title: "Once" }
  ];

  const daysOfWeek = [
    { id: 7, name: "Sunday" },
    { id: 1, name: "Monday" },
    { id: 2, name: "Tuesday" },
    { id: 3, name: "Wednesday" },
    { id: 4, name: "Thursday" },
    { id: 5, name: "Friday" },
    { id: 6, name: "Saturday" }
  ];

  const months = [
    { id: 1, name: "January" },
    { id: 2, name: "February" },
    { id: 3, name: "March" },
    { id: 4, name: "April" },
    { id: 5, name: "May" },
    { id: 6, name: "June" },
    { id: 7, name: "July" },
    { id: 8, name: "August" },
    { id: 9, name: "September" },
    { id: 10, name: "October" },
    { id: 11, name: "November" },
    { id: 12, name: "December" }
  ];

  // Helper functions
const getScheduleByIndexOrDay = (index, dayId) => {
  if (frequency === 1) {
    // For daily, find schedule by dayId
    return schedules.find(s => s.daily_day === dayId) || {};
  }
  return schedules[index] || {};
};

  const getDayName = (dayId) => {
    return daysOfWeek.find(d => d.id === dayId)?.name || "Day";
  };

  const getDefaultScheduleData = (type) => {
    const baseSchedule = {
      open_time: schedules.length > 0 && sameOperatingHours ? schedules[0].open_time : "08:00",
      close_time: schedules.length > 0 && sameOperatingHours ? schedules[0].close_time : "17:00"
    };

    switch (type) {
      case 'monthly':
        return { ...baseSchedule, monthly_day: schedules.length + 1 };
      case 'annually':
        return { ...baseSchedule, annually_month: 1, annually_day: 1 };
      case 'once':
        return { 
          ...baseSchedule, 
          once_date: new Date().toISOString().split('T')[0] 
        };
      default:
        return baseSchedule;
    }
  };

  // Initialize form when editing
  useEffect(() => {
    if (market) {
      setName(market.name || "");
      setDescription(market.description || "");
      setAddress(market.address || "");
      // Use recurrence_type if available, otherwise fallback to frequency
      setFrequency(market.recurrence_type || market.frequency || 1);
      setPreviewUrl(market.image || null);
      setLocation({
        lat: market.latitude || 5.975,
        lng: market.longitude || 116.072,
      });
      
      if (market.id) {
        loadExistingSchedules(market.id);
      }
    }
  }, [market]);

  const loadExistingSchedules = async (marketId) => {
    try {
      const res = await fetch(`${base_url}/market/${marketId}/schedule`);
      if (res.ok) {
        const data = await res.json();
        setSchedules(data);
        
        if (data.length > 0) {
          const firstSchedule = data[0];
          const allSameHours = data.every(schedule => 
            schedule.open_time === firstSchedule.open_time && 
            schedule.close_time === firstSchedule.close_time
          );
          setSameOperatingHours(allSameHours);
        }
      }
    } catch (err) {
      console.error("Failed to load schedules:", err);
    }
  };

useEffect(() => {
  // Only set location from currentLocation if we don't already have a location
  // AND we're not editing an existing market
  if (!location && !isEdit && currentLocation && currentLocation.length > 0 && currentLocation[0]) {
    setLocation({
      lat: currentLocation[0],
      lng: currentLocation[1],
    });
  }
}, [currentLocation, location, isEdit]);

// Initialize map after location is ready
useEffect(() => {
  if (!location) return;
  
  // Check if map container exists
  const mapContainer = document.getElementById("map-picker");
  if (!mapContainer) return;
  
  // Clear existing map if it exists
  if (mapRef.current) {
    mapRef.current.remove();
    mapRef.current = null;
    markerRef.current = null;
  }

  const map = L.map("map-picker").setView([location.lat, location.lng], 13);
  mapRef.current = map;

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  markerRef.current = L.marker([location.lat, location.lng]).addTo(map);

  map.on("click", (e) => {
    const { lat, lng } = e.latlng;
    setLocation({ lat, lng });
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    }
  });

  // Cleanup function
  return () => {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
  };
}, [location]);

// Add this useEffect to handle map size updates
useEffect(() => {
  if (mapRef.current) {
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      mapRef.current.invalidateSize();
      mapRef.current.setView([location.lat, location.lng], 13);
      if (markerRef.current) {
        markerRef.current.setLatLng([location.lat, location.lng]);
      }
    }, 100);
  }
}, [location]);

// Cleanup map on component unmount
useEffect(() => {
  return () => {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
  };
}, []);
  // Initialize default schedule based on frequency
  useEffect(() => {
    if (schedules.length === 0 && !isEdit) {
      initializeDefaultSchedule();
    }
  }, [frequency]);

  const initializeDefaultSchedule = () => {
    let defaultSchedules = [];
    
    switch (frequency) {
      case 1: // Daily
        defaultSchedules = daysOfWeek.map(day => ({
          daily_day: day.id,  // Use the correct day ID
          open_time: "08:00",
          close_time: "17:00"
        }));
      break;
        
      case 2: // Weekly
        defaultSchedules = daysOfWeek.map(day => ({
          weekly_day: day.id,
          open_time: "08:00",
          close_time: "17:00",
          is_active: true
        }));
        break;
        
      case 3: // Monthly
        defaultSchedules = [{
          monthly_day: 1,
          open_time: "08:00",
          close_time: "17:00"
        }];
        break;
        
      case 4: // Annually
        defaultSchedules = [{
          annually_month: 1,
          annually_day: 1,
          open_time: "08:00",
          close_time: "17:00"
        }];
        break;
        
      case 5: // Once
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        defaultSchedules = [{
          once_date: formattedDate,
          open_time: "08:00",
          close_time: "17:00"
        }];
        break;
        
      default:
        break;
    }
    
    setSchedules(defaultSchedules);
  };

  // Image handling
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  // Schedule handlers
  const handleScheduleChange = (index, field, value) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index] = {
      ...updatedSchedules[index],
      [field]: value
    };
    
    // If same operating hours is enabled, update all schedules
    if (sameOperatingHours && (field === 'open_time' || field === 'close_time')) {
      updatedSchedules.forEach((schedule, idx) => {
        if (idx !== index) {
          updatedSchedules[idx] = {
            ...schedule,
            [field]: value
          };
        }
      });
    }
    
    setSchedules(updatedSchedules);
  };

  const addSchedule = (type) => {
    setSchedules([...schedules, getDefaultScheduleData(type)]);
  };

  const removeSchedule = (index) => {
    if (schedules.length <= 1) return;
    const updatedSchedules = [...schedules];
    updatedSchedules.splice(index, 1);
    setSchedules(updatedSchedules);
  };

const toggleWeeklyDay = (dayId) => {
  const existingIndex = schedules.findIndex(s => s.weekly_day === dayId);
  
  if (existingIndex >= 0) {
    // Remove if exists
    const updatedSchedules = [...schedules];
    updatedSchedules.splice(existingIndex, 1);
    setSchedules(updatedSchedules);
  } else {
    // Add new with same operating hours if enabled
    const newSchedule = {
      weekly_day: dayId,
      open_time: schedules.length > 0 && sameOperatingHours ? schedules[0].open_time : "08:00",
      close_time: schedules.length > 0 && sameOperatingHours ? schedules[0].close_time : "17:00"
    };
    setSchedules([...schedules, newSchedule]);
  }
};

  // Handle same operating hours toggle
  const handleSameOperatingHoursToggle = () => {
    const newValue = !sameOperatingHours;
    setSameOperatingHours(newValue);
    
    if (newValue && schedules.length > 0) {
      // Apply first schedule's hours to all schedules
      const firstSchedule = schedules[0];
      const updatedSchedules = schedules.map(schedule => ({
        ...schedule,
        open_time: firstSchedule.open_time || "08:00",
        close_time: firstSchedule.close_time || "17:00"
      }));
      setSchedules(updatedSchedules);
    }
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let marketId;

      // 1. Get earliest date from schedules
      let start_date = null;
      
      if (schedules.length > 0) {
        const dates = [];
        
        schedules.forEach(schedule => {
          if (frequency === 5 && schedule.once_date) { // Once
            dates.push(new Date(schedule.once_date));
          } else if (frequency === 4 && schedule.annually_month && schedule.annually_day) { // Annually
            const today = new Date();
            dates.push(new Date(today.getFullYear(), schedule.annually_month - 1, schedule.annually_day));
          } else if (frequency === 3 && schedule.monthly_day) { // Monthly
            const today = new Date();
            dates.push(new Date(today.getFullYear(), today.getMonth(), schedule.monthly_day));
          }
          // For Daily and Weekly, we can use today as start_date
        });
        
        if (dates.length > 0) {
          // Get the earliest date
          const earliestDate = new Date(Math.min(...dates.map(d => d.getTime())));
          start_date = earliestDate.toISOString().split('T')[0];
        } else {
          // For Daily/Weekly or if no specific dates found, use today
          start_date = new Date().toISOString().split('T')[0];
        }
      }

      const payload = {
        organizer_id: organizerId,
        name,
        description,
        address,
        recurrence_type: parseInt(frequency, 10),  // Changed from frequency to recurrence_type
        latitude: location.lat,  // Backend will convert to geography
        longitude: location.lng,  // Backend will convert to geography
        image: null,
        start_date,
        // created_by will be set by backend from auth context
      };

      // Create or update market
      if (isEdit) {
        const updateRes = await fetch(`${base_url}/market/${market.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!updateRes.ok) throw new Error("Failed to update market");
        const updated = await updateRes.json();
        marketId = updated.id;
      } else {
        const res = await fetch(`${base_url}/market`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to add market");
        const inserted = await res.json();
        marketId = inserted.id;
      }

      // Upload image if exists (keep this as is)
      if (imageFile) {
        const imageBitmap = await createImageBitmap(imageFile);
        const canvas = document.createElement("canvas");
        canvas.width = imageBitmap.width;
        canvas.height = imageBitmap.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(imageBitmap, 0, 0);

        const jpegBlob = await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/jpeg", 0.9)
        );

        const filePath = `organizers/${organizerId || market.organizer_id}/${name}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from("tamulokal")
          .upload(filePath, jpegBlob, { contentType: "image/jpeg", upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("tamulokal")
          .getPublicUrl(filePath);

        const imageUpdateRes = await fetch(`${base_url}/market/${marketId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: publicUrl }),
        });
        if (!imageUpdateRes.ok) throw new Error("Failed to update market image");
      }

      // Save schedules (keep this as is)
      await saveSchedules(marketId);

      alert(isEdit ? "Market updated!" : "Market added!");
      onClose();
    } catch (err) {
      console.error(err);
      alert(isEdit ? "Failed to update market" : "Failed to add market");
    }
  };

  const saveSchedules = async (marketId) => {
    try {
      // Prepare all schedule data in an array
      const scheduleDataArray = schedules.map(schedule => {
        const scheduleData = {
          market_id: marketId,
          open_time: schedule.open_time,
          close_time: schedule.close_time
        };

        // Add frequency-specific fields
        if (frequency === 1) scheduleData.daily_day = schedule.daily_day;
        if (frequency === 2) scheduleData.weekly_day = schedule.weekly_day;
        if (frequency === 3) scheduleData.monthly_day = schedule.monthly_day;
        if (frequency === 4) {
          scheduleData.annually_month = schedule.annually_month;
          scheduleData.annually_day = schedule.annually_day;
        }
        if (frequency === 5) scheduleData.once_date = schedule.once_date;

        return scheduleData;
      });

      // For editing: delete existing schedules first
      if (isEdit) {
        await fetch(`${base_url}/market/${marketId}/schedule`, {
          method: "DELETE"
        });
      }

      // Send all schedules in one POST request (assuming backend supports batch create)
      const response = await fetch(`${base_url}/market/${marketId}/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedules: scheduleDataArray }),
      });

      if (!response.ok) {
        throw new Error("Failed to save schedules");
      }

      const result = await response.json();
      console.log("Schedules saved:", result);
      
    } catch (err) {
      console.error("Error saving schedules:", err);
      throw err; // Re-throw to handle in the main submit function
    }
  };

  // Render schedule inputs based on frequency
  const renderScheduleInputs = () => {
  const renderTimeInputs = (schedule, index) => (
    <div className="grid grid-cols-2 gap-3">
      <TimeInput
        label="Open Time"
        value={schedule.open_time}
        onChange={(e) => handleScheduleChange(index, 'open_time', e.target.value)}
        disabled={sameOperatingHours && index > 0}
      />
      <TimeInput
        label="Close Time"
        value={schedule.close_time}
        onChange={(e) => handleScheduleChange(index, 'close_time', e.target.value)}
        disabled={sameOperatingHours && index > 0}
      />
    </div>
  );

  const renderSameHoursNote = (index) => (
    sameOperatingHours && index === 0 && (
      <p className="text-xs text-green-600 mt-1">Changes here apply to all</p>
    )
  );

  switch (frequency) {
    case 1: // Daily
      return (
        <div className="space-y-4">
          <ScheduleHeader title="Daily Schedule">
            <SameHoursToggle 
              sameOperatingHours={sameOperatingHours}
              onToggle={handleSameOperatingHoursToggle}
            />
          </ScheduleHeader>
          {daysOfWeek.map((day, index) => {
            const schedule = getScheduleByIndexOrDay(index, day.id);
            return (
              <div key={day.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-sm">{day.name}</span>
                </div>
                {renderTimeInputs(schedule, index)}
                {renderSameHoursNote(index)}
              </div>
            );
          })}
        </div>
      );

    case 2: // Weekly
      return (
        <div className="space-y-4">
          <ScheduleHeader title="Weekly Schedule">
            <SameHoursToggle 
              sameOperatingHours={sameOperatingHours}
              onToggle={handleSameOperatingHoursToggle}
            />
          </ScheduleHeader>
          <div className="flex flex-wrap gap-2 mb-4">
            {daysOfWeek.map(day => {
              const isActive = schedules.some(s => s.weekly_day === day.id);
              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => toggleWeeklyDay(day.id)}
                  className={`px-3 py-1 rounded-full text-sm border ${isActive 
                    ? 'bg-orange-100 border-orange-400 text-orange-700' 
                    : 'bg-gray-100 border-gray-300 text-gray-600'}`}
                >
                  {day.name.substring(0, 3)}
                </button>
              );
            })}
          </div>
          
          {schedules
            .sort((a, b) => (a.weekly_day || 0) - (b.weekly_day || 0))
            .map((schedule, displayIndex) => {
              const originalIndex = schedules.findIndex(s => s.weekly_day === schedule.weekly_day);
              return (
                <div key={schedule.weekly_day || displayIndex} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">{getDayName(schedule.weekly_day)}</span>
                    <RemoveButton onClick={() => removeSchedule(originalIndex)} />
                  </div>
                  {renderTimeInputs(schedule, originalIndex)}
                  {renderSameHoursNote(originalIndex)}
                </div>
              );
            })}
        </div>
      );


      case 3: // Monthly
        return (
          <div className="space-y-4">
            <ScheduleHeader title="Monthly Schedule">
              <SameHoursToggle 
                sameOperatingHours={sameOperatingHours}
                onToggle={handleSameOperatingHoursToggle}
              />
            </ScheduleHeader>
            
            {schedules.map((schedule, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">Day {index + 1}</span>
                  {schedules.length > 1 && <RemoveButton onClick={() => removeSchedule(index)} />}
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Day of Month (1-31)</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={schedule.monthly_day || 1}
                    onChange={(e) => handleScheduleChange(index, 'monthly_day', parseInt(e.target.value))}
                    className="w-full h-[36px] border border-gray-300 px-2 text-sm rounded"
                  />
                </div>
                
                {renderTimeInputs(schedule, index)}
                {renderSameHoursNote(index)}
              </div>
            ))}
            <AddButton onClick={() => addSchedule('monthly')} label="Add Another Day" />
          </div>
        );

      case 4: // Annually
        return (
          <div className="space-y-4">
            <ScheduleHeader title="Annually Schedule">
              <SameHoursToggle 
                sameOperatingHours={sameOperatingHours}
                onToggle={handleSameOperatingHoursToggle}
              />
            </ScheduleHeader>
            
            {schedules.map((schedule, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">Date {index + 1}</span>
                  {schedules.length > 1 && <RemoveButton onClick={() => removeSchedule(index)} />}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Month</label>
                    <select
                      value={schedule.annually_month || 1}
                      onChange={(e) => handleScheduleChange(index, 'annually_month', parseInt(e.target.value))}
                      className="w-full h-[36px] border border-gray-300 px-2 text-sm rounded bg-white"
                    >
                      {months.map(month => (
                        <option key={month.id} value={month.id}>{month.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Day</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={schedule.annually_day || 1}
                      onChange={(e) => handleScheduleChange(index, 'annually_day', parseInt(e.target.value))}
                      className="w-full h-[36px] border border-gray-300 px-2 text-sm rounded"
                    />
                  </div>
                </div>
                
                {renderTimeInputs(schedule, index)}
                {renderSameHoursNote(index)}
              </div>
            ))}
            <AddButton onClick={() => addSchedule('annually')} label="Add Another Date" />
          </div>
        );

      case 5: // Once
        return (
          <div className="space-y-4">
            <ScheduleHeader title="One-time Market">
              <SameHoursToggle 
                sameOperatingHours={sameOperatingHours}
                onToggle={handleSameOperatingHoursToggle}
              />
            </ScheduleHeader>
            
            {schedules.map((schedule, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">Date {index + 1}</span>
                  {schedules.length > 1 && <RemoveButton onClick={() => removeSchedule(index)} />}
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Date</label>
                  <input
                    type="date"
                    value={schedule.once_date || new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleScheduleChange(index, 'once_date', e.target.value)}
                    className="w-full h-[36px] border border-gray-300 px-2 text-sm rounded"
                  />
                </div>
                
                {renderTimeInputs(schedule, index)}
                {renderSameHoursNote(index)}
              </div>
            ))}
            <AddButton onClick={() => addSchedule('once')} label="Add Another Date" />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative font-inter">
      <form
        onSubmit={handleSubmit}
        className="flex-1 px-6 py-6 space-y-6"
      >
        {/* Image Upload */}
        <div className="w-full">
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl bg-white w-full h-48 flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 transition"
            onClick={() => document.getElementById("marketImage").click()}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <span className="text-gray-400 text-sm">
                Click to upload market image
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              id="marketImage"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <label
            className="block text-sm font-medium text-gray-700 mt-2 text-center cursor-pointer"
            onClick={() => document.getElementById("marketImage").click()}
          >
            {previewUrl ? "Change Image" : "Add Image"}
          </label>

          {previewUrl && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="mt-2 w-full h-[36px] rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
            >
              Remove Image
            </button>
          )}
        </div>

        {/* Market Name */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Market Name"
          className="w-full h-[40px] border border-gray-300 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />

        {/* Description */}
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />

        {/* Address */}
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
          className="w-full h-[40px] border border-gray-300 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />

        {/* Frequency */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Frequency
          </label>   
          <button
            type="button"
            onClick={() => setShowDropdown((prev) => !prev)}
            className="w-full h-[42px] border border-gray-300 rounded-xl px-3 bg-white text-left text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 flex justify-between items-center shadow-sm"
          >
            <span>
              {frequencies[frequency - 1]?.title || "Select frequency"}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showDropdown && (
            <ul className="absolute z-[9999] mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-56 overflow-auto">
              {frequencies.map((f, idx) => (
                <li
                  key={f.id || idx}
                  onClick={() => {
                    setFrequency(f.id);
                    setShowDropdown(false);
                    setSchedules([]);
                    setSameOperatingHours(false);
                  }}
                  className="px-4 py-2 text-sm hover:bg-orange-50 cursor-pointer"
                >
                  {f.title}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Schedule Inputs */}
        {renderScheduleInputs()}

        {/* Map Picker */}
        <div>
          <p className="text-sm text-gray-600 mb-1">Select Market Location:</p>
          <div
            id="map-picker"
            className="w-full h-64 rounded-xl border border-gray-300"
          />
          <p className="text-xs text-gray-500 mt-1">
            Selected: {location?.lat?.toFixed(5) || "..."}, {location?.lng?.toFixed(5) || "..."}
          </p>
        </div>
      </form>

      {/* Fixed bottom Save button */}
      <div className="w-full bg-white border-t border-gray-200 px-6 py-4">
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full py-3 bg-[#FF8225] text-white rounded-md font-medium hover:bg-[#e6731f] transition"
        >
          {isEdit ? "Save" : "Apply"}
        </button>
      </div>
    </div>
  );
};

export default MarketForm;