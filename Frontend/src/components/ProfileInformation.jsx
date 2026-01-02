import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../hooks/useAuth";

const ProfileInformation = ({ userId, role, isOwnProfile = true }) => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    image: "",
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const base_url = import.meta.env.VITE_BACKEND_API_URL;

  const session = useAuth();
  const currentUserId = session?.user?.id;

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${base_url}/${role}/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setProfile(data);
        setFormData({
          fullname: data.fullname || data.name || "",
          username: data.username || "",
          image: data.image || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, base_url, role]);

  // ✅ CHECK FOLLOW STATE
  useEffect(() => {
    const checkFollow = async () => {
      if (!currentUserId || !userId) return;

      try {
        const res = await fetch(
          `${base_url}/user/follow?follower_id=${currentUserId}&following_id=${userId}`
        );
        const data = await res.json();

        setIsFollowing(data.length > 0);
      } catch (err) {
        console.error("Follow status check failed:", err);
      }
    };

    checkFollow();
  }, [currentUserId, userId, base_url]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      let imageUrl = formData.image;

      if (selectedFile) {
        const imageBitmap = await createImageBitmap(selectedFile);
        const canvas = document.createElement("canvas");
        canvas.width = imageBitmap.width;
        canvas.height = imageBitmap.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(imageBitmap, 0, 0);
        const jpegBlob = await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/jpeg", 0.9)
        );

        const filePath = `${role}s/${userId}/profile.jpg`;

        const { error: uploadError } = await supabase.storage
          .from("tamulokal")
          .upload(filePath, jpegBlob, {
            upsert: true,
            contentType: "image/jpeg",
          });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("tamulokal").getPublicUrl(filePath);

        imageUrl = `${publicUrl}?t=${new Date().getTime()}`;
      }

      const res = await fetch(`${base_url}/${role}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: formData.fullname,
          username: formData.username,
          image: imageUrl,
        }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const updated = await res.json();
      setProfile(updated);
      setFormData({
        fullname: updated.fullname,
        username: updated.username,
        image: updated.image,
      });

      setPreviewUrl(null);
      setSelectedFile(null);
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to save changes");
    }
  };

  const handleCancel = () => {
    setFormData({
      fullname: profile.fullname,
      username: profile.username,
      image: profile.image,
    });
    setPreviewUrl(null);
    setSelectedFile(null);
    setIsEditing(false);
  };

  // ✅ TOGGLE FOLLOW / UNFOLLOW
  const handleFollow = async () => {
    if (!currentUserId) return alert("You must be logged in.");

    try {
      if (!isFollowing) {
        // FOLLOW
        const res = await fetch(`${base_url}/user/follow`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            follower_id: currentUserId,
            following_id: userId,
          }),
        });
        if (!res.ok) throw new Error("Failed to follow");

        setIsFollowing(true);
        setProfile((p) => ({
          ...p,
          follower_count: p.follower_count + 1,
        }));
      } else {
        // UNFOLLOW
        const res = await fetch(
          `${base_url}/user/follow?follower_id=${currentUserId}&following_id=${userId}`,
          { method: "DELETE" }
        );
        if (!res.ok) throw new Error("Failed to unfollow");

        setIsFollowing(false);
        setProfile((p) => ({
          ...p,
          follower_count: p.follower_count - 1,
        }));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update follow status");
    }
  };

  if (loading)
    return (
      <div className="text-center text-gray-500 mt-10">Loading profile...</div>
    );

  const displayImage = previewUrl || formData.image || "/default-profile.png";

  return (
    <div className="flex flex-col items-start w-full px-4">
      <div className="flex items-center gap-4 w-full">
        {/* Profile Image */}
        <div className="relative">
          <img
            src={displayImage}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border shadow-md"
          />
          {isEditing && isOwnProfile && (
            <label className="absolute bottom-0 right-0 bg-[#FF8225] text-white text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-[#e6731f]">
              Edit
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>

        {/* Fullname and Username */}
        <div className="flex flex-col items-start justify-center">
          {isEditing ? (
            <>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                className="border rounded-lg px-2 py-1 text-sm w-[150px]"
              />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="@username"
                className="border rounded-lg px-2 py-1 text-sm w-[150px] mt-2"
              />
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-gray-800 max-w-[200px]">
                {profile.fullname}
              </h2>
              <p className="text-sm text-gray-500">@{profile.username}</p>
            </>
          )}
        </div>
      </div>

      {/* Followers / Following + Edit or Follow Button */}
      <div className="flex justify-between items-center w-full mt-6">
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-left">
            <span className="text-sm text-gray-500">Following</span>
            <span className="font-semibold text-gray-900">
              {profile.following_count}
            </span>
          </div>

          <div className="flex flex-col items-left">
            <span className="text-sm text-gray-500">Followers</span>
            <span className="font-semibold text-gray-900">
              {profile.follower_count}
            </span>
          </div>
        </div>

        {isOwnProfile ? (
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-1.5 rounded-full text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-1.5 rounded-full text-sm font-medium bg-[#4CAF50] text-white hover:bg-[#45a049]"
                >
                  Save
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-1.5 rounded-xl text-sm font-medium border border-[#FF8225] text-[#FF8225] bg-white hover:bg-[#FF8225] hover:text-white transition-colors duration-200"
              >
                Edit Profile
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={handleFollow}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium border transition-colors duration-200 ${
              isFollowing
                ? "border-gray-300 text-gray-600 bg-gray-100"
                : "border-[#FF8225] text-[#FF8225] bg-white hover:bg-[#FF8225] hover:text-white"
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileInformation;
