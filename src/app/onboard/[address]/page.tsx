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
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [farcaster, setFarcaster] = useState("");
  const [xcom, setXcom] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");

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
        bio: bio,
        instagram,
        farcaster,
        twitter: xcom,
        youtube,
      };

      const user = await ApiService.authenticateUser(userData);
      Auth.setUser(user.id);
      updateUserSession(true);
      router.push("/discover");
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
    <div className="flex flex-col w-full md:w-4/5 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col mb-0">
          <div className="flex  flex-row mb-4">
            <div className="flex flex-col">
              <label htmlFor="name" className="block mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-[240px] p-2 border rounded-lg text-black"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
              <div className="mt-5">
                <label htmlFor="username" className="block mb-1">
                  Username
                </label>
                <input
                  type="username"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full p-2 border rounded-lg text-black"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>
            </div>
            <label
              htmlFor="avatar"
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <p className="ml-12 mb-4">Profile Picture</p>
              <div className="w-32 h-32 ml-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
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
        </div>

        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Your message
        </label>
        <textarea
          id="message"
          className="block p-2.5 w-full text-sm text-gray-9000 bg-white rounded-lg border border-gray-300 focus:ring-gray-500 focus:border-gray-500  "
          placeholder="Write your bio here..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        ></textarea>

        {/* Social links */}
        <div className="flex flex-col">
          <label htmlFor="links" className="block">
            Social links
          </label>
          <div className="flex flex-row justify-between">
            <div className="mt-5">
              <input
                placeholder="farcaster"
                type="text"
                id="farcaster"
                value={farcaster}
                onChange={(e) => setFarcaster(e.target.value)}
                className="w-full p-2 border rounded-lg text-black"
              />
            </div>
            <div className="mt-5">
              <input
                placeholder="x.com"
                type="text"
                id="xcom"
                value={xcom}
                onChange={(e) => setXcom(e.target.value)}
                className="w-full p-2 border rounded-lg text-black"
              />
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="mt-5">
              <input
                placeholder="instagram"
                type="text"
                id="instagram"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full p-2 border rounded-lg text-black"
              />
            </div>
            <div className="mt-5">
              <input
                placeholder="youtube"
                type="text"
                id="youtube"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                className="w-full p-2 border rounded-lg text-black"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 mb-4 w-[150px] p-2 bg-black text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-500"
        >
          {loading ? "Creating..." : "Create Profile"}
        </button>

        <label htmlFor="email" className="block mb-1 text-2xl">
          Email Address
        </label>
        <div className="bg-slate-100 w-full rounded-lg border border-gray-400  p-4">
          <p className="flex flex-row">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className=" p-2 border rounded-lg text-black"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
            <div className="bg-white text-gray-500 p-1 rounded-lg text-xs text-bold ml-3 mb-2">
              Primary
            </div>
          </p>
          <p className="text-gray-400">
            This email will be shared with hosts when you register for meetups.
          </p>
        </div>
      </form>
    </div>
  );
}
