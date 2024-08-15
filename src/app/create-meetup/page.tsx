"use client";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { uploadImageToImgBB } from "@/utils/img-bb-upload";
import { ApiService } from "@/utils/api-service";
import { Auth } from "@/utils/cookie-auth";
import Image from "next/image";
import { MdOutlineSpeakerNotes, MdPeople } from "react-icons/md";
import {
  FaChevronDown,
  FaCircle,
  FaEdit,
  FaMapMarkerAlt,
  FaRegCircle,
  FaTicketAlt,
} from "react-icons/fa";
import { CiGlobe } from "react-icons/ci";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [formattedStartDate, setFormattedStartDate] = useState("");
  const [formattedEndDate, setFormattedEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [attendanceFee, setAttendanceFee] = useState("0");
  const [capacity, setCapacity] = useState(0);

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
        location,
        country,
        description,
        image: imageUrl,
        creatorUserId: Auth.id,
        attendanceFee,

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
      router.push("/discover");
    } catch (error) {
      console.error("Error creating meetup:", error);
      alert("Failed to create meetup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = () => {
    if (image) {
      // If an image is already set, remove it
      setImage(null);
      setImageUrl(null);
    } else {
      // Otherwise, trigger the file input click
      document.getElementById("imageInput")?.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setStartDate(selectedDate);
    setFormattedStartDate(formatDate(selectedDate));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    } as Intl.DateTimeFormatOptions;
    return date.toLocaleTimeString("en-US", options);
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndTime(e.target.value);
  };

  const handleAttendanceFeeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    // Allow only numbers and up to 18 decimal places
    if (/^\d*\.?\d{0,18}$/.test(value)) {
      setAttendanceFee(value);
    }
  };

  const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCapacity(Number(value));
  };

  return (
    <div className="flex flex-col m-auto pt-9 align-middle w-1/2">
      <form onSubmit={handleSubmit} className="gap-4 flex flex-col">
        {/* Image and Event Title Section */}
        <div className="flex items-center gap-4 mb-4">
          {/* Image */}
          <div className="relative flex justify-center">
            <input
              type="file"
              id="imageInput"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="hidden"
            />
            <div className="relative cursor-pointer" onClick={handleImageClick}>
              <Image
                src={imageUrl || "/create-meetup-ph.png"} // Use the selected image or the placeholder
                alt="Upload"
                width={150}
                height={150}
                className="rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity duration-300 rounded-lg">
                <span className="text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                  {image ? "Delete" : "Upload"}
                </span>
              </div>
            </div>
          </div>

          {/* Event Title and Dropdowns */}
          <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center justify-between">
              <div className="flex p-2 bg-gray-200 gap-2 w-2/5 h-10 items-center rounded-xl justify-center">
                <Image
                  src="/pfp.png"
                  width={25}
                  height={25}
                  alt="pfp"
                  className="rounded-2xl"
                />
                <p className="text-black-opacity-60">girl.eth</p>
                <FaChevronDown className="text-black-opacity-60" />
              </div>

              <div className="flex py-2 px-4 bg-gray-200 gap-2 h-10 items-center rounded-xl justify-center">
                <CiGlobe />
                <p className="text-black-opacity-60">Public</p>
                <FaChevronDown className="text-black-opacity-60" />
              </div>
            </div>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="text-4xl w-full mb-4 bg-transparent text-black-opacity-80 focus:border-none focus:outline-none"
              placeholder="Event Title"
            />
          </div>
        </div>
        {/* The rest of the form */}
        <div className="flex flex-col gap-3">
          {/* The time and date */}
          <div className="relative flex items-center gap-4 bg-slate-100 rounded-lg p-2">
            {/* Time icons */}
            <div className="flex flex-col items-center w-6 mr-8">
              <FaCircle className="text-black-opacity-50" />
              <div className="border-l border-black-opacity-50 h-8 w-1"></div>
              <FaRegCircle className="text-black-opacity-50" />
            </div>

            {/* Date fields */}
            <div className="flex flex-col gap-2 w-3/4">
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

            {/* TODO: Fix time and date hehe */}
            <div className="flex flex-col gap-2 w-1/4">
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

          {/* TODO: Add autofill address here */}
          <div className="relative full mb-4">
            <label htmlFor="country" className="hidden">
              Country
            </label>
            <input
              type="text"
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              placeholder="Add Event Location"
              className="w-full p-2 pl-9 bg-slate-100 rounded-lg text-black focus:border-none focus:outline-none"
            />
            <span className="absolute inset-y-0 left-3 flex items-center">
              <FaMapMarkerAlt className="text-gray-500" />
            </span>
          </div>

          {/* Restrict location */}
          <div className="flex items-center gap-3 mb-4 ml-2">
            <input
              type="checkbox"
              id="restrictLocation"
              value="true"
              className="h-5 w-5"
            />
            <label
              htmlFor="restrictLocation"
              className="inline-flex items-center cursor-pointer"
            >
              <div className="flex flex-col gap-1">
                <span className="text-black-opacity-70 font-medium">
                  Restrict Location to Guests
                </span>
                <span className="text-sm text-black-opacity-50">
                  Only confirmed guests may see the location
                </span>
              </div>
            </label>
          </div>

          <div className="relative full">
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

          {/* <h3 className="text-md text-black-opacity-80 font-medium">
            Event Options:
          </h3> */}
          <div className="full bg-gray-100 p-4 rounded gap-3 text-black-opacity-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FaTicketAlt />
                <span>Attendance Fee</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={attendanceFee}
                  onChange={handleAttendanceFeeChange}
                  placeholder="0"
                  className="w-20 p-1 text-right bg-white rounded"
                />
                <span>ETH</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MdPeople />
                <span>Capacity</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={capacity}
                  onChange={handleCapacityChange}
                  placeholder="0"
                  className="w-20 p-1 text-right bg-white rounded"
                />
                <span>People</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 bg-black-opacity-80 rounded-xl text-white hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? "Creating..." : "Create Meetup"}
          </button>
        </div>
      </form>
    </div>
  );
}
