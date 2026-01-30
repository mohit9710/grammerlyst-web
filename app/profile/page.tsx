"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { fetchUserProfile, updateUserProfile } from "@/services/userService";

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Track the actual File object for the API
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [user, setUser] = useState({
    first_name: "", 
    last_name: "",
    email: "",
    streak: 0,
    points: 0,
    profile_image: "" 
  });

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return router.replace("/auth/login");
    
    fetchUserProfile(token)
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => router.push("/auth/login"));
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file); // Save for backend
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prev => ({ ...prev, profile_image: reader.result as string })); // Preview for UI
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("access_token") || "";
    try {
      const updatedUser = await updateUserProfile(token, {
        firstName: user.first_name,
        lastName: user.last_name,
        imageFile: selectedFile // Sending the binary file
      });
      
      // Merge updated data (backend returns id, first_name, last_name, profile_image)
      setUser(prev => ({ ...prev, ...updatedUser }));
      setIsEditing(false);
      setSelectedFile(null);
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  if (loading) return <div className="p-20 text-center font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12 border border-slate-100 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            
            {/* Avatar Logic */}
            <div className="relative group cursor-pointer" onClick={() => isEditing && fileInputRef.current?.click()}>
              <div className="w-32 h-32 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white text-5xl shadow-xl overflow-hidden border-4 border-white">
                {user.profile_image ? (
                  <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <i className="fas fa-user-graduate"></i>
                )}
              </div>
              {isEditing && (
                <div className="absolute inset-0 bg-black/30 rounded-[2rem] flex items-center justify-center text-white">
                  <i className="fas fa-camera text-xl"></i>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
            </div>

            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="flex gap-4">
                  <input 
                    className="text-2xl font-black border-b-2 border-blue-600 bg-blue-50/50 w-full"
                    value={user.first_name}
                    onChange={(e) => setUser({...user, first_name: e.target.value})}
                    placeholder="First Name"
                  />
                  <input 
                    className="text-2xl font-black border-b-2 border-blue-600 bg-blue-50/50 w-full"
                    value={user.last_name}
                    onChange={(e) => setUser({...user, last_name: e.target.value})}
                    placeholder="Last Name"
                  />
                </div>
              ) : (
                <h1 className="text-4xl font-black text-slate-900">{user.first_name} {user.last_name}</h1>
              )}
              <p className="text-slate-500 font-medium mt-1">{user.email}</p>
            </div>

            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`px-8 py-3 rounded-2xl font-bold ${isEditing ? "bg-green-600 text-white" : "bg-white text-blue-600 border-2 border-blue-100"}`}
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}