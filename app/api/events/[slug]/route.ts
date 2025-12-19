import connectDB from '@/lib/mongodb';
import Event from '@/database/event.model';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

/**
 * Basic slug validation for URL-friendly slugs like "my-event-2025".
 * Keep this conservative: reject empty, overly long, or obviously malformed values.
 */
function normalizeAndValidateSlug(raw: string | undefined): {
  ok: true;
  slug: string;
} | {
  ok: false;
  message: string;
} {
  if (!raw) {
    return { ok: false, message: 'Missing required route parameter: slug.' };
  }

  const slug = raw.trim().toLowerCase();

  if (slug.length === 0) {
    return { ok: false, message: 'Slug cannot be empty.' };
  }

  // Reasonable guardrail; adjust if your app allows longer slugs.
  if (slug.length > 200) {
    return { ok: false, message: 'Slug is too long.' };
  }

  // Matches: letters/numbers with optional single hyphens between segments.
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slugRegex.test(slug)) {
    return {
      ok: false,
      message: 'Invalid slug format. Use lowercase letters, numbers, and hyphens only.',
    };
  }

  return { ok: true, slug };
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { slug } = await params;
    const validated = normalizeAndValidateSlug(slug);
    if (!validated.ok) {
      return NextResponse.json({ message: validated.message }, { status: 400 });
    }

    await connectDB();

    const event = await Event.findOne({ slug: validated.slug }).lean().exec();

    if (!event) {
      return NextResponse.json(
        { message: `Event not found for slug: ${validated.slug}.` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Event fetched successfully', event },
      { status: 200 }
    );
  } catch (error: unknown) {
    // Mongoose validation errors are client errors (bad input).
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { message: 'Validation error', details: error.message },
        { status: 400 }
      );
    }

    // Defensive: treat cast errors as invalid client input.
    if (error instanceof mongoose.Error.CastError) {
      return NextResponse.json(
        { message: 'Invalid slug', details: error.message },
        { status: 400 }
      );
    }

    console.error('GET /api/events/[slug] failed:', error);

    return NextResponse.json(
      {
        message: 'Failed to fetch event',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
