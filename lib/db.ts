import { MongoClient, Db, Collection } from "mongodb";

export interface Appointment {
  _id?: string;
  id: string;
  fullName: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
  createdAt: string;
  status: "pending" | "confirmed" | "cancelled";
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/smilecraft";
const DATABASE_NAME = "smilecraft";
const COLLECTION_NAME = "appointments";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  // Return cached connection if available
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DATABASE_NAME);

    // Create index for faster queries
    const collection = db.collection(COLLECTION_NAME);
    await collection.createIndex({ preferredDate: 1, preferredTime: 1 });

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

async function getAppointmentsCollection(): Promise<Collection<Appointment>> {
  const { db } = await connectToDatabase();
  return db.collection(COLLECTION_NAME) as Collection<Appointment>;
}

// Get all appointments
export async function getAppointments(): Promise<Appointment[]> {
  try {
    const collection = await getAppointmentsCollection();
    const appointments = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return appointments.map((apt) => ({
      ...apt,
      id: apt.id,
    }));
  } catch (error) {
    console.error("Error reading appointments:", error);
    return [];
  }
}

// Create new appointment
export async function createAppointment(
  fullName: string,
  email: string,
  phone: string,
  preferredDate: string,
  preferredTime: string,
  message?: string
): Promise<Appointment> {
  const collection = await getAppointmentsCollection();

  const appointment: Appointment = {
    id: `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    fullName,
    email,
    phone,
    preferredDate,
    preferredTime,
    message,
    createdAt: new Date().toISOString(),
    status: "pending",
  };

  await collection.insertOne(appointment);
  return appointment;
}

// Get appointment by ID
export async function getAppointmentById(id: string): Promise<Appointment | null> {
  try {
    const collection = await getAppointmentsCollection();
    const appointment = await collection.findOne({ id });
    console.log(`🔍 Looking for appointment with id: '${id}'`, appointment ? "✅ Found" : "❌ Not found");
    return appointment;
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return null;
  }
}

// Update appointment
export async function updateAppointment(
  id: string,
  updates: Partial<Appointment>
): Promise<Appointment | null> {
  try {
    const collection = await getAppointmentsCollection();
    
    // Remove MongoDB's _id field and null values if it exists (it's immutable and null causes issues)
    const { _id, ...cleanUpdates } = updates as any;
    
    // Filter out null/undefined values
    const safeUpdates = Object.entries(cleanUpdates).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
    
    console.log("🔧 Filtering update data - removed _id and null fields");
    console.log("📤 Safe updates to apply:", safeUpdates);
    
    // Use updateOne first
    const updateResult = await collection.updateOne(
      { id },
      {
        $set: safeUpdates,
      }
    );

    console.log("📌 MongoDB updateOne result:", {
      matchedCount: updateResult.matchedCount,
      modifiedCount: updateResult.modifiedCount,
      acknowledged: updateResult.acknowledged,
    });

    if (updateResult.matchedCount === 0) {
      console.error(`❌ No document found with id: ${id}`);
      return null;
    }

    // Then fetch the updated document
    const updatedDoc = await collection.findOne({ id });

    if (!updatedDoc) {
      console.error(`❌ Could not retrieve updated document for id: ${id}`);
      return null;
    }

    console.log(`✅ Update successful, returning:`, updatedDoc);
    return updatedDoc as Appointment;
  } catch (error) {
    console.error("❌ Error updating appointment:", error);
    return null;
  }
}

// Delete appointment
export async function deleteAppointment(id: string): Promise<boolean> {
  try {
    const collection = await getAppointmentsCollection();
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return false;
  }
}

// Check if a time slot is already booked
export async function isTimeSlotBooked(preferredDate: string, preferredTime: string): Promise<boolean> {
  try {
    const collection = await getAppointmentsCollection();
    const count = await collection.countDocuments({
      preferredDate,
      preferredTime,
      status: { $ne: "cancelled" },
    });
    return count > 0;
  } catch (error) {
    console.error("Error checking time slot:", error);
    return false;
  }
}
