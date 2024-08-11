"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { uploadImageToImgBB } from "@/utils/img-bb-upload";
import { ApiService } from "@/utils/api-service";
import { Auth } from "@/utils/cookie-auth";
import { useUserSession } from "@/hooks/useUserSession";
import { useDisconnect } from "wagmi";

export default function Onboard() {
  const router = useRouter();
  const params = useParams();
  const { userSession, updateUserSession } = useUserSession();
  const { disconnect } = useDisconnect();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    username: "",
    name: "",
    email: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { username: "", name: "", email: "" };

    if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
      isValid = false;
    }

    if (name.length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
      isValid = false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  console.log(params, "params in onboard");

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setLoading(true);
        const imageUrl = await uploadImageToImgBB(file);
        setAvatar(imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const userData = {
        username,
        name,
        email,
        avatar: avatar || undefined,
        walletAddress: params.address,
      };

      const user = await ApiService.authenticateUser(userData);
      Auth.setUser(user.id);
      updateUserSession(true);
      alert("Profile updated successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to create profile. Please try again.");
      disconnect();
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {}, [userSession]);

  return (
    <div className="flex flex-col w-full md:w-4/5 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center mb-4">
          <label htmlFor="avatar" className="cursor-pointer">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500">Upload Photo</span>
              )}
            </div>
          </label>
          <input
            type="file"
            id="avatar"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        <div>
          <label htmlFor="username" className="block mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-2 border rounded text-black"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        <div>
          <label htmlFor="name" className="block mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border rounded text-black"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded text-black"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? "Updating..." : "Complete Profile"}
        </button>
      </form>
    </div>
  );
}
