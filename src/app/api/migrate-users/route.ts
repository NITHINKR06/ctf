import { NextResponse } from "next/server";
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
const initializeAdmin = () => {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const serviceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };

  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
};

export async function POST(req: Request) {
  try {
    // Verify authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    if (token !== process.env.MIGRATION_SECRET) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Initialize Firebase Admin
    const app = initializeAdmin();
    const auth = admin.auth(app);
    const db = admin.firestore(app);

    console.log("Starting user migration from userScores...");

    // Get all userScores
    const userScoresSnapshot = await db.collection("userScores").get();
    console.log(`Found ${userScoresSnapshot.size} user scores`);

    let migratedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;
    const errors = [];

    for (const scoreDoc of userScoresSnapshot.docs) {
      const { userId, userName, userEmail } = scoreDoc.data();

      if (!userId) {
        console.log("Skipping document without userId");
        skippedCount++;
        continue;
      }

      try {
        // Check if user already exists in users collection
        const userRef = db.collection("users").doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
          let email = userEmail;

          // If email not in userScores, try to fetch from Firebase Auth
          if (!email || !email.includes("@")) {
            try {
              const authUser = await auth.getUser(userId);
              email = authUser.email;
              console.log(`✓ Fetched email from Auth for ${userId}: ${email}`);
            } catch (authErr) {
              console.warn(`⚠ Could not fetch auth data for ${userId}`);
              email = `unknown-${userId}@ctf.local`;
            }
          }

          // Save to users collection
          await userRef.set({
            uid: userId,
            email: email,
            displayName: userName || "Unknown",
            createdAt: new Date(),
            migratedAt: new Date(),
          });

          console.log(`✓ Migrated user ${userId}: ${email}`);
          migratedCount++;
        } else {
          console.log(`⊝ User ${userId} already exists, skipping`);
          skippedCount++;
        }
      } catch (err) {
        const error = err as any;
        console.error(`✗ Error processing user ${userId}:`, error.message);
        errors.push({ userId, error: error.message });
        failedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Migration completed",
      stats: {
        total: userScoresSnapshot.size,
        migrated: migratedCount,
        skipped: skippedCount,
        failed: failedCount,
        errors: errors,
      },
    });
  } catch (err) {
    console.error("Migration error:", err);
    return NextResponse.json(
      {
        error: "Migration failed",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
