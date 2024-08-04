"use client";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { uploadImageToImgBB } from "@/utils/img-bb-upload";
import { ApiService } from "@/utils/api-service";
import { Auth } from "@/utils/cookie-auth";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [date, setDate] = useState("");

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
        date: new Date(date).toISOString(),
      };

      console.log(meetupData, "MEETUP DATA");
      await ApiService.createMeetup({ meetup: meetupData });

      // Reset form and show success message
      setName("");
      setDescription("");
      setImage(null);
      setDate("");
      alert("Meetup created successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating meetup:", error);
      alert("Failed to create meetup. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  console.log(name, description, image, date);

  return (
    <div className="flex flex-col w-full md:w-4/5 ">
      <h1 className="text-2xl font-bold mb-4">Create New Meetup</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        </div>
        <div>
          <label htmlFor="description" className="block mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-2 border rounded text-black"
          />
        </div>
        <div>
          <label htmlFor="image" className="block mb-1">
            Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            required
            className="w-full p-2 border rounded text-black"
          />
        </div>

        <div>
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
        </div>

        <div>
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
        </div>

        <div>
          <label htmlFor="date" className="block mb-1">
            Date
          </label>
          <input
            type="datetime-local"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full p-2 border rounded text-black"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? "Creating..." : "Create Meetup"}
        </button>
      </form>
    </div>
  );
}
