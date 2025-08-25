import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

// Function to validate API key
function validateApiKey(request: Request): boolean {
  const apiKey = request.headers.get("x-api-key");
  const validApiKey = process.env.NEXT_PUBLIC_DAILY_ELEMENT_API_KEY;

  if (!validApiKey) {
    console.error("DAILY_ELEMENT_API_KEY environment variable not set");
    return false;
  }

  return apiKey === validApiKey;
}

export async function POST(request: Request) {
  try {
    // Validate API key
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid or missing API key" },
        { status: 401 }
      );
    }

    // Generate random number between 1 and 118 (inclusive)
    const elementId = Math.floor(Math.random() * 118) + 1;

    // Get current date in YYYY-MM-DD format
    const today = new Date();
    const date = today.toISOString().split("T")[0];

    // Check if there's already an entry for today
    const existingEntry = await db
      .collection("dailyElement")
      .where("date", "==", date)
      .get();

    if (!existingEntry.empty) {
      return NextResponse.json(
        { error: "Daily element already exists for today" },
        { status: 409 }
      );
    }

    // Create new daily element entry
    await db.collection("dailyElement").add({
      date,
      elementId,
      createdAt: new Date(),
    });

    console.log(
      `Daily element created: elementId ${elementId} for date ${date}`
    );

    return NextResponse.json({
      success: true,
      data: {
        elementId,
        date,
      },
    });
  } catch (error) {
    console.error("Error creating daily element:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Debug Firebase environment variables
    console.log("Firebase Admin Environment Variables Debug:");
    console.log(
      "SECRET_FIREBASE_SERVICE_ACCOUNT_JSON:",
      process.env.SECRET_FIREBASE_SERVICE_ACCOUNT_JSON ? "✅ Set" : "❌ Missing"
    );

    // Test JSON parsing
    if (process.env.SECRET_FIREBASE_SERVICE_ACCOUNT_JSON) {
      try {
        const decoded = JSON.parse(
          process.env.SECRET_FIREBASE_SERVICE_ACCOUNT_JSON
        );
        console.log("JSON parse success:", !!decoded);
        console.log("Has private_key:", !!decoded.private_key);
        console.log("Private key length:", decoded.private_key?.length);
        console.log("Project ID:", decoded.project_id);
      } catch (error) {
        console.log("JSON parse error:", error);
      }
    }

    // Validate API key
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid or missing API key" },
        { status: 401 }
      );
    }

    // Get current date in YYYY-MM-DD format
    const today = new Date();
    const date = today.toISOString().split("T")[0];

    // Get today's daily element
    const snapshot = await db
      .collection("dailyElement")
      .where("date", "==", date)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { error: "No daily element found for today" },
        { status: 404 }
      );
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    return NextResponse.json({
      success: true,
      data: {
        elementId: data.elementId,
        date: data.date,
      },
    });
  } catch (error) {
    console.error("Error fetching daily element:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
