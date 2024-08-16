"use client";
import { useRouter } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";
import { uploadImageToImgBB } from "@/utils/img-bb-upload";
import { ApiService } from "@/utils/api-service";
import { Auth } from "@/utils/cookie-auth";
import Image from "next/image";
import { MdOutlineSpeakerNotes, MdPeople } from "react-icons/md";
import {
  FaChevronDown,
  FaCircle,
  FaEdit,
  FaLock,
  FaMapMarkerAlt,
  FaRegCircle,
  FaTicketAlt,
} from "react-icons/fa";
import { CiGlobe } from "react-icons/ci";
import { MeetupData } from "../api/meetup-create-get/route";
import { useAccount } from "wagmi";

enum Visibility {
  PUBLIC = "Public",
  PRIVATE = "Private",
}

export default function Dashboard() {
  const router = useRouter();
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [meetupData, setMeetupData] = useState<MeetupData>({
    name: "",
    description: "",
    location: "",
    image: null,
    imageUrl: null,
    startDateTime: "",
    endDateTime: "",
    attendanceFee: "0",
    capacity: 0,
    visibility: Visibility.PUBLIC,
    organizerWalletAddress: address!,
    creatorUserId: Auth.id,
  });
  const [dateError, setDateError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 16);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMeetupData((prev: MeetupData) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!meetupData.image) throw new Error("Image is required");
      const imageUrl = await uploadImageToImgBB(meetupData.image);

      if (!meetupData.organizerWalletAddress || !address)
        throw new Error("Connected Wallet is required");

      const apiMeetupData = {
        name: meetupData.name,
        description: meetupData.description,
        location: meetupData.location,
        image: imageUrl,
        creatorUserId: Auth.id,
        attendanceFee: meetupData.attendanceFee,
        startDateTime: new Date(meetupData.startDateTime).toISOString(),
        endDateTime: new Date(meetupData.endDateTime).toISOString(),
        capacity: meetupData.capacity,
        visibility: meetupData.visibility,
        organizerWalletAddress: meetupData.organizerWalletAddress || address,
      };

      await ApiService.createMeetup({ meetup: apiMeetupData });

      resetForm();
      alert("Meetup created successfully!");
      router.push("/discover");
    } catch (error) {
      console.error("Error creating meetup:", error);
      alert("Failed to create meetup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setMeetupData({
      name: "",
      description: "",
      location: "",
      image: null,
      imageUrl: null,
      startDateTime: "",
      endDateTime: "",
      attendanceFee: "0",
      capacity: 0,
      visibility: Visibility.PUBLIC,
      organizerWalletAddress: address!,
      creatorUserId: Auth.id,
    });
  };

  const handleImageClick = () => {
    if (meetupData.image) {
      setMeetupData((prev) => ({ ...prev, image: null, imageUrl: null }));
    } else {
      document.getElementById("imageInput")?.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setMeetupData((prev) => ({
        ...prev,
        image: file,
        imageUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const tomorrow = new Date(getTomorrow());
    const selectedDate = new Date(value);

    if (selectedDate < tomorrow) {
      setDateError("Event must be at least one day in the future");
      return;
    }

    if (name === "endDateTime" && meetupData.startDateTime) {
      const startDate = new Date(meetupData.startDateTime);
      if (selectedDate <= startDate) {
        setDateError("End date must be after start date");
        return;
      }
    }

    setMeetupData((prev) => {
      const newData = { ...prev, [name]: value };

      // If updating startDateTime, check if endDateTime is still valid
      if (name === "startDateTime" && newData.endDateTime) {
        const endDate = new Date(newData.endDateTime);
        if (selectedDate >= endDate) {
          newData.endDateTime = "";
          setDateError("Please select a new end date");
        }
      }

      return newData;
    });

    setDateError(null);
  };

  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return "";
    const dateObj = new Date(dateTimeString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return dateObj.toLocaleString("en-US", options);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleAttendanceFeeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,18}$/.test(value)) {
      setMeetupData((prev) => ({ ...prev, attendanceFee: value }));
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleVisibilityChange = (option: string) => {
    setMeetupData((prev) => ({ ...prev, visibility: option }));
    setDropdownOpen(false);
  };

  // Redirect to home if not connected
  useEffect(() => {
    if (!address) {
      router.push("/");
    }
  }, [address]);

  return (
    <div className="flex flex-col mx-auto pt-4 sm:pt-9 px-4 sm:px-0 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col">
        {/* Image and Event Title Section */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
          {/* Image */}
          <div className="relative flex justify-center w-full sm:w-auto">
            <input
              type="file"
              id="imageInput"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="hidden"
            />
            <div
              className="relative cursor-pointer w-full sm:w-auto"
              onClick={handleImageClick}
            >
              <Image
                src={meetupData.imageUrl || "/create-meetup-ph.png"}
                alt="Upload"
                width={150}
                height={150}
                className="rounded-lg w-full sm:w-[150px] object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity duration-300 rounded-lg">
                <span className="text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                  {meetupData.image ? "Delete" : "Upload"}
                </span>
              </div>
            </div>
          </div>

          {/* Event Title and Dropdowns */}
          <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center justify-between">
              <div className="relative w-full sm:w-auto">
                <div
                  className="flex py-2 px-4 bg-gray-200 gap-2 h-10 items-center rounded-xl justify-center cursor-pointer"
                  onClick={toggleDropdown}
                >
                  <CiGlobe />
                  <p className="text-black-opacity-60">
                    {meetupData.visibility}
                  </p>
                  <FaChevronDown className="text-black-opacity-60" />
                </div>
                {dropdownOpen && (
                  <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div
                      className={`flex items-center gap-2 p-2 cursor-pointer ${
                        meetupData.visibility === Visibility.PUBLIC
                          ? "bg-gray-100"
                          : ""
                      }`}
                      onClick={() => handleVisibilityChange(Visibility.PUBLIC)}
                    >
                      <CiGlobe />
                      <p className="text-black-opacity-60">
                        {Visibility.PUBLIC}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-2 p-2 cursor-pointer ${
                        meetupData.visibility === Visibility.PRIVATE
                          ? "bg-gray-100"
                          : ""
                      }`}
                      onClick={() => handleVisibilityChange(Visibility.PRIVATE)}
                    >
                      <FaLock />
                      <p className="text-black-opacity-60">
                        {Visibility.PRIVATE}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <input
              type="text"
              id="name"
              value={meetupData.name}
              onChange={(e) =>
                setMeetupData({ ...meetupData, name: e.target.value })
              }
              required
              className="text-2xl sm:text-4xl w-full mb-4 bg-transparent text-black-opacity-80 focus:border-none focus:outline-none"
              placeholder="Event Title"
            />
          </div>
        </div>

        {/* The rest of the form */}
        <div className="flex flex-col gap-3">
          {/* The time and date */}
          <div className="relative flex items-center gap-4 bg-slate-100 rounded-lg p-2">
            {/* Time icons */}
            <div className="flex-shrink-0 flex flex-col items-center w-6">
              <FaCircle className="text-black-opacity-50" />
              <div className="border-l border-black-opacity-50 h-8 w-1"></div>
              <FaRegCircle className="text-black-opacity-50" />
            </div>

            {/* Date and Time fields */}
            <div className="flex flex-col gap-2 w-full">
              <input
                type="datetime-local"
                id="startDateTime"
                name="startDateTime"
                value={meetupData.startDateTime}
                onChange={handleDateTimeChange}
                required
                min={getTomorrow()}
                className="p-2 text-black-opacity-70 bg-slate-200 rounded-lg w-full"
              />
              <input
                type="datetime-local"
                id="endDateTime"
                name="endDateTime"
                value={meetupData.endDateTime}
                onChange={handleDateTimeChange}
                required
                min={meetupData.startDateTime || getTomorrow()}
                className="p-2 text-black-opacity-70 bg-slate-200 rounded-lg w-full"
              />
              {dateError && (
                <p className="text-red-500 text-sm mt-1">{dateError}</p>
              )}
            </div>
          </div>

          {/* TODO: Add autofill address here */}
          <div className="relative full mb-4">
            <input
              type="text"
              id="country"
              value={meetupData.location}
              onChange={(e) =>
                setMeetupData({ ...meetupData, location: e.target.value })
              }
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

          {/* Description input */}
          <div className="relative full">
            <input
              id="description"
              type="text"
              value={meetupData.description}
              onChange={(e) =>
                setMeetupData({ ...meetupData, description: e.target.value })
              }
              required
              placeholder="Description"
              className="w-full p-2 pl-9 bg-slate-100 rounded-lg text-black focus:border-none focus:outline-none"
            />
            <span className="absolute inset-y-0 left-3 flex items-center">
              <MdOutlineSpeakerNotes className="text-gray-500" />
            </span>
          </div>

          {/* Event Options */}
          <div className="full bg-gray-100 p-4 rounded gap-3 text-black-opacity-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FaTicketAlt />
                <span>Attendance Fee</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={meetupData.attendanceFee}
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
                  value={meetupData.capacity}
                  onChange={(e) =>
                    setMeetupData({
                      ...meetupData,
                      capacity: parseInt(e.target.value),
                    })
                  }
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
