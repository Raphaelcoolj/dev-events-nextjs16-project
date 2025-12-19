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

    return await Event.find({
      _id: { $ne: (event as any)._id },
      tags: { $in: (event as any).tags },
    }).lean();
  } catch (e) {
    return [];
  }
};
