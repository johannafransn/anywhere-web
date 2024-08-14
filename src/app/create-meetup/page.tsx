"use client";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { uploadImageToImgBB } from "@/utils/img-bb-upload";
import { ApiService } from "@/utils/api-service";
import { Auth } from "@/utils/cookie-auth";
import Image from "next/image";
import { MdOutlineSpeakerNotes } from "react-icons/md";
import { FaCircle, FaRegCircle } from "react-icons/fa";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [formattedStartDate, setFormattedStartDate] = useState("");
  const [formattedEndDate, setFormattedEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!image) throw new Error("Image is required");

      // Upload image to ImgBB
      const imageUrl = await uploadImageToImgBB(image);

      // Create meetup
      const meetupData = {
        name,
        description,
        image: imageUrl,
        creatorUserId: Auth.id,

        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      };

      await ApiService.createMeetup({ meetup: meetupData });

      // Reset form and show success message
      setName("");
      setDescription("");
      setImage(null);
      setStartDate("");
      setEndDate("");
      alert("Meetup created successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating meetup:", error);
      alert("Failed to create meetup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = () => {
    document.getElementById("imageInput")?.click();
  };

  const handleStartDateChange = (e) => {
    const selectedDate = e.target.value;
    setStartDate(selectedDate);
    setFormattedStartDate(formatDate(selectedDate));
  };

  const handleEndDateChange = (e) => {
    const selectedDate = e.target.value;
    setEndDate(selectedDate);
    setFormattedEndDate(formatDate(selectedDate));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    const options = { hour: "2-digit", minute: "2-digit", hour12: true };
    return date.toLocaleTimeString("en-US", options);
  };

  const handleStartTimeChange = (e) => {
    setStartTime(formatTime(e.target.value));
  };

  const handleEndTimeChange = (e) => {
    setEndTime(formatTime(e.target.value));
  };

  return (
    <div className="flex m-auto pt-9 align-middle w-1/2  ">
      <form onSubmit={handleSubmit} className="gap-4 flex">
        {/* Image */}
        <div>
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            required
            className="hidden"
          />
          <Image
            src="/create-meetup-ph.png" // Replace with the path to your image
            alt="Upload"
            width={300}
            height={300}
            onClick={handleImageClick}
            className="cursor-pointer" // Adjust size and styling as needed
          />
        </div>

        {/* The rest of the form */}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="text-4xl w-full mb-4 bg-transparent text-black-opacity-80 focus:border-none focus:outline-none"
            placeholder="Event Title"
          />

          {/* The time and date */}
          <div className="relative flex items-center gap-1 bg-slate-100 rounded-lg p-2">
            {/* Time icons */}
            <div className="flex flex-col items-center w-6 mr-8">
              <FaCircle className="text-black-opacity-50" />
              <div className="border-l border-black-opacity-50 h-8 w-1"></div>
              <FaRegCircle className="text-black-opacity-50" />
            </div>

            {/* Date fields */}
            <div className="flex flex-col gap-1 w-18">
              <input
                type="text"
                id="startDate"
                value={formattedStartDate}
                onChange={handleStartDateChange}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = "text")}
                placeholder="Start Date"
                required
                className="p-2 text-black-opacity-70 bg-slate-200 rounded-tl-lg rounded-bl-lg"
              />
              <input
                type="text"
                id="endDate"
                value={formattedEndDate}
                onChange={handleEndDateChange}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = "text")}
                placeholder="End Date"
                required
                className="p-2 text-black-opacity-70 bg-slate-200 rounded-tl-lg rounded-bl-lg"
              />
            </div>

            {/* Time fields */}
            <div className="flex flex-col gap-1 w-16">
              <input
                type="time"
                id="startTime"
                value={startTime}
                onChange={handleStartTimeChange}
                required
                className="p-2 text-black-opacity-70 bg-slate-200 rounded-tl-lg rounded-br-lg"
              />
              <input
                type="time"
                id="endTime"
                value={endTime}
                onChange={handleEndTimeChange}
                required
                className="p-2 text-black-opacity-70 bg-slate-200 rounded-tl-lg rounded-br-lg"
              />
            </div>
          </div>

          <div className="relative full">
            {" "}
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Description"
              className="w-full p-2 pl-9 bg-slate-100 rounded-lg text-black focus:border-none focus:outline-none"
            />
            <span className="absolute inset-y-0 left-3 flex items-center">
              <MdOutlineSpeakerNotes className="text-gray-500" />
            </span>
          </div>

          <label htmlFor="country" className="block mb-1">
            Country
          </label>
          <input
            type="text"
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            className="w-full p-2 border rounded text-black"
          />

          <label htmlFor="city" className="block mb-1">
            City
          </label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="w-full p-2 border rounded text-black"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? "Creating..." : "Create Meetup"}
          </button>
        </div>
      </form>
    </div>
  );
}
