import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    console.log("Testing database connection...");

    // Test 1: Try to read from a test collection
    const testCollection = db.collection("connection-test");
    const snapshot = await testCollection.get();

    console.log("Successfully connected to Firestore");
    console.log(`Found ${snapshot.size} documents in test collection`);

    // Test 2: Try to write a test document
    const testDoc = {
      timestamp: new Date().toISOString(),
      message: "Database connection test successful",
      testId: Math.random().toString(36).substring(7),
    };

    const docRef = await testCollection.add(testDoc);
    console.log("Test document created with ID:", docRef.id);

    // Test 3: Try to delete the test document
    await docRef.delete();
    console.log("Test document deleted successfully");

    return NextResponse.json(
      {
        success: true,
        message: "Database connection successful",
        tests: {
          read: "PASSED",
          write: "PASSED",
          delete: "PASSED",
        },
        documentsFound: snapshot.size,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Database connection failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
        code: (error as Record<string, unknown>)?.code || "UNKNOWN_ERROR",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testData } = body;

    console.log("Testing database with custom data...");

    // Test writing custom data
    const testCollection = db.collection("connection-test");
    const testDoc = {
      timestamp: new Date().toISOString(),
      customData: testData || "No custom data provided",
      testType: "POST_REQUEST",
    };

    const docRef = await testCollection.add(testDoc);
    console.log("Custom test document created with ID:", docRef.id);

    return NextResponse.json(
      {
        success: true,
        message: "Custom data written successfully",
        documentId: docRef.id,
        data: testDoc,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Failed to write custom data:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to write custom data",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
