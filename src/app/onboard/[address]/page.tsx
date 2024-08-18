"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { uploadImageToImgBB } from "@/utils/img-bb-upload";
import { ApiService } from "@/utils/api-service";
import { Auth } from "@/utils/cookie-auth";
import { useUserSession } from "@/hooks/useUserSession";
import { useDisconnect } from "wagmi";
import { RiTwitterXLine } from "react-icons/ri";
import { SiFarcaster } from "react-icons/si";
import { FaInstagram, FaYoutube } from "react-icons/fa6";
import { HiUserPlus } from "react-icons/hi2";

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
      <h1 className="text-3xl mb-4 text-black-opacity-70">
        Create Your Profile
      </h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col mb-0">
          <div className="flex  flex-row mb-4">
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="block mb-1 text-black-opacity-40"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-[240px] text-sm p-2 border rounded-lg text-black"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
              <div className="mt-5">
                <label
                  htmlFor="username"
                  className="block mb-1 text-black-opacity-40"
                >
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
              <p className="ml-12 mb-2 text-black-opacity-40">
                Profile Picture
              </p>
              <div className="w-32 h-32 ml-12 rounded-full bg-gray-200 hover:scale-105 transition-transform flex items-center justify-center overflow-hidden">
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

        <label className="block font-medium text-black-opacity-40">Bio</label>
        <textarea
          id="message"
          className="block p-2.5 w-full text-sm text-gray-9000 bg-white rounded-lg border border-gray-300 focus:ring-gray-300 focus:border-gray-300"
          placeholder="Describe yourself in 1-2 sentences"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        ></textarea>

        {/* Social links */}
        <div className="flex flex-col">
          <label htmlFor="links" className="block text-black-opacity-40">
            Social links
          </label>
          <div className="flex flex-row justify-between">
            <div className="flex mt-3 space-x-2 items-center">
              <SiFarcaster className="h-7 w-7 text-black-opacity-70" />
              <input
                placeholder="Farcaster username"
                type="text"
                id="farcaster"
                value={farcaster}
                onChange={(e) => setFarcaster(e.target.value)}
                className="text-sm w-full p-2 border rounded-lg text-black"
              />
            </div>
            <div className="mt-5 flex items-center space-x-2">
              <RiTwitterXLine className="h-7 w-7 text-black-opacity-70" />
              <input
                placeholder="@username"
                type="text"
                id="xcom"
                value={xcom}
                onChange={(e) => setXcom(e.target.value)}
                className="text-sm w-full p-2 border rounded-lg text-black"
              />
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="mt-5 flex items-center space-x-2">
              <FaInstagram className="h-7 w-7 text-black-opacity-70" />
              <input
                placeholder="@username"
                type="text"
                id="instagram"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="text-sm w-full p-2 border rounded-lg text-black"
              />
            </div>
            <div className="mt-5 flex items-center space-x-2">
              <FaYoutube className="h-7 w-7 text-black-opacity-70" />
              <input
                placeholder="YouTube URL"
                type="text"
                id="youtube"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                className="text-sm w-full p-2 border rounded-lg text-black"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="py-2 px-4 text-sm flex gap-2 rounded-lg items-center bg-black text-white font-light   disabled:bg-gray-500rounded-xl hover:bg-black-opacity-70 hover:scale-105 transition ease-in-out disabled:bg-black-opacity-30"
        >
          <HiUserPlus className="w-4 h-4" />
          {loading ? "Creating..." : "Create Profile"}
        </button>

        <hr />
        <label htmlFor="email" className="block my-2 text-2xl">
          Email Address
        </label>
        <div className="space-y-3 bg-gray-100 w-full rounded-lg border border-gray-300 p-4">
          <div className="flex items-center space-x-2">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-2 border rounded-lg text-black-opacity-80 text-sm"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
            <div className="bg-white text-gray-500 px-2 py-1 rounded-lg text-xs text-bold">
              Primary
            </div>
          </div>
          <p className="text-sm text-gray-400">
            This email will be shared with hosts when you register for meetups.
          </p>
        </div>
      </form>
    </div>
  );
}
