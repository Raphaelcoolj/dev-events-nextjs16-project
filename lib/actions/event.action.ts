'use server';

import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { cacheLife } from "next/cache";

export const getSimilarEventBySlug = async (slug: string) => {
  /**
   * Next 16 Cache Components note:
   * This helper is used during route rendering/prerendering.
   * Marking it as cached avoids “blocking route / uncached data” errors.
   */
  "use cache";
  cacheLife("hours");

  try {
    await connectDB();

    const event = await Event.findOne({ slug }).lean();
    if (!event) return [];

    const events = await Event.find({
      _id: { $ne: (event as any)._id },
      tags: { $in: (event as any).tags },
    }).lean();
    return JSON.parse(JSON.stringify(events));
  } catch (e) {
    return [];
  }
};

export const getAllEvents = async () => {
    "use cache";
    cacheLife("minutes");
  
    try {
      await connectDB();
      // Sort by date ascending (nearest first)
      const events = await Event.find().sort({ date: 1 }).lean();
      return JSON.parse(JSON.stringify(events));
    } catch (e) {
      console.error("Error fetching all events:", e);
      return [];
    }
  };
  
  export const createEvent = async (eventData: any) => {
    try {
      await connectDB();
      const newEvent = await Event.create(eventData);
      return { success: true, event: JSON.parse(JSON.stringify(newEvent)) };
    } catch (e: any) {
      console.error("Error creating event:", e);
      return { success: false, error: e.message };
    }
  };
