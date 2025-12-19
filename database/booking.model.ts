import { Schema, model, models, Document, Types } from 'mongoose';

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => {
          // Standard email validation regex
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to validate event existence
//
// IMPORTANT: Use promise/async middleware style (no `next` callback) to avoid
// "next is not a function" errors when Mongoose treats the hook as async.
BookingSchema.pre('save', async function () {
  // Validate eventId for new docs, or if it was changed.
  if (this.isNew || this.isModified('eventId')) {
    // Dynamically import Event model to avoid circular dependency
    const Event = models.Event || (await import('./event.model')).default;

    const eventExists = await Event.exists({ _id: this.eventId });

    if (!eventExists) {
      throw new Error('Referenced event does not exist');
    }
  }
});

// Create index on eventId for faster lookups
BookingSchema.index({ eventId: 1 });

// Prevent model recompilation in development (Next.js hot reload)
const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
