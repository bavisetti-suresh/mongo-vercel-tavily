import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const dbName = process.env.MONGODB_DB || "radarstrike";

interface GlobalWithMongo {
  _mongoClientPromise?: Promise<MongoClient>;
  _inMemoryStore?: {
    competitorScans: Map<string, any>;
    grievances: Map<string, any>;
    battlecards: Map<string, any>;
    solutions: Map<string, any>;
  };
}

const globalForMongo = globalThis as unknown as GlobalWithMongo;

if (!globalForMongo._inMemoryStore) {
  globalForMongo._inMemoryStore = {
    competitorScans: new Map(),
    grievances: new Map(),
    battlecards: new Map(),
    solutions: new Map(),
  };
}

let clientPromise: Promise<MongoClient> | null = null;

if (uri) {
  if (process.env.NODE_ENV === "development") {
    if (!globalForMongo._mongoClientPromise) {
      const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      globalForMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalForMongo._mongoClientPromise;
  } else {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    clientPromise = client.connect();
  }
}

export async function getDatabase(): Promise<{ db: Db | null; isConnected: boolean; isInMemory: boolean }> {
  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db(dbName);
      return { db, isConnected: true, isInMemory: false };
    } catch (error) {
      console.warn("MongoDB connection attempt failed, using fallback in-memory store:", error);
      return { db: null, isConnected: false, isInMemory: true };
    }
  }

  return { db: null, isConnected: false, isInMemory: true };
}

export function getInMemoryStore() {
  return globalForMongo._inMemoryStore!;
}
