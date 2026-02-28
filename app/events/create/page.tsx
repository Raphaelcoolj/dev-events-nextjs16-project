"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const CreateEventPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    overview: "",
    venue: "",
    location: "",
    date: "",
    time: "",
    mode: "In-person",
    audience: "",
    organizer: "",
    agenda: "",
    tags: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Please select an image file.");
      return;
    }

    setLoading(true);

    const submissionData = new FormData();
    // Append text fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'agenda' || key === 'tags') {
        // Stringify arrays since the API expects them parsed from form data
        const arrayData = value.split(",").map((item) => item.trim());
        submissionData.append(key, JSON.stringify(arrayData));
      } else {
        submissionData.append(key, value);
      }
    });
    
    // Append the image file
    submissionData.append("image", imageFile);

    try {
        const response = await fetch('/api/events', {
          method: 'POST',
          body: submissionData,
        });

        const result = await response.json();

        if (response.ok) {
          router.push("/events");
          router.refresh();
        } else {
          alert(`Error creating event: ${result.message || result.error}`);
        }
    } catch (error: any) {
        alert(`An error occurred: ${error.message}`);
    } finally {
        setLoading(false);
    }
  };

  return (
    <section className="py-10 px-4 md:px-0">
      <div className="max-w-2xl mx-auto w-full glass p-6 md:p-8 rounded-xl" id="book-event">
        <h2 className="text-3xl font-bold mb-8 text-gradient text-center">Create New Event</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="font-semibold text-light-100">Event Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Next.js Conf 2026"
              className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-white border border-transparent focus:border-primary outline-none transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
             <label htmlFor="description" className="font-semibold text-light-100">Short Description</label>
             <textarea
               id="description"
               name="description"
               value={formData.description}
               onChange={handleChange}
               placeholder="A brief summary of the event (shown on cards)"
               className="bg-dark-200 rounded-[6px] px-5 py-2.5 min-h-[100px] text-white border border-transparent focus:border-primary outline-none transition-all"
               required
             />
          </div>

          <div className="flex flex-col gap-2">
             <label htmlFor="overview" className="font-semibold text-light-100">Event Overview</label>
             <textarea
               id="overview"
               name="overview"
               value={formData.overview}
               onChange={handleChange}
               placeholder="Detailed overview of the event"
               className="bg-dark-200 rounded-[6px] px-5 py-2.5 min-h-[150px] text-white border border-transparent focus:border-primary outline-none transition-all"
               required
             />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="date" className="font-semibold text-light-100">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-white border border-transparent focus:border-primary outline-none transition-all"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="time" className="font-semibold text-light-100">Time</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-white border border-transparent focus:border-primary outline-none transition-all"
                  required
                />
              </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="venue" className="font-semibold text-light-100">Venue</label>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="e.g. Grand Hall"
                  className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-white border border-transparent focus:border-primary outline-none transition-all"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="location" className="font-semibold text-light-100">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Lagos, Nigeria"
                  className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-white border border-transparent focus:border-primary outline-none transition-all"
                  required
                />
              </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="mode" className="font-semibold text-light-100">Mode</label>
                <select
                  id="mode"
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-white border border-transparent focus:border-primary outline-none transition-all appearance-none"
                  required
                >
                  <option value="In-person">In-person</option>
                  <option value="Online">Online</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="organizer" className="font-semibold text-light-100">Organizer</label>
                <input
                  type="text"
                  id="organizer"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleChange}
                  placeholder="Name of organizer"
                  className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-white border border-transparent focus:border-primary outline-none transition-all"
                  required
                />
              </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="audience" className="font-semibold text-light-100">Target Audience</label>
            <input
              type="text"
              id="audience"
              name="audience"
              value={formData.audience}
              onChange={handleChange}
              placeholder="e.g. Developers, Designers, Students"
              className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-white border border-transparent focus:border-primary outline-none transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="image" className="font-semibold text-light-100">Event Image</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-white border border-transparent focus:border-primary outline-none transition-all file:bg-primary file:border-none file:rounded-md file:px-3 file:py-1 file:mr-4 file:font-semibold file:cursor-pointer"
              required
            />
            {imageFile && (
              <p className="text-sm text-light-100 mt-1">Selected: {imageFile.name}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="agenda" className="font-semibold text-light-100">Agenda (comma separated)</label>
            <input
              type="text"
              id="agenda"
              name="agenda"
              value={formData.agenda}
              onChange={handleChange}
              placeholder="Introduction, Technical Session, Lunch Break, Q&A"
              className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-white border border-transparent focus:border-primary outline-none transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="tags" className="font-semibold text-light-100">Tags (comma separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="javascript, architecture, nextjs"
              className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-white border border-transparent focus:border-primary outline-none transition-all"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-black font-bold py-3 px-6 rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? "Creating Event..." : "Create Event"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateEventPage;
