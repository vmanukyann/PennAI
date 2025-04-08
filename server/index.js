const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Firebase Admin SDK Initialization
const serviceAccount = require("./firebase-service-account.json"); // Replace with your Firebase service account key file
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<your-project-id>.firebaseio.com", // Replace with your Firebase project URL
});

const db = admin.firestore();

// Routes
// Fetch all users
app.get("/users", async (req, res) => {
  try {
    const usersSnapshot = await db.collection("users").get();
    const users = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Approve a user
app.put("/users/approve/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const userRef = db.collection("users").doc(email);
    await userRef.update({ approved: true });
    res.json({ message: "User approved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve user" });
  }
});

// Disapprove a user
app.put("/users/disapprove/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const userRef = db.collection("users").doc(email);
    await userRef.update({ approved: false });
    res.json({ message: "User disapproved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to disapprove user" });
  }
});

// Add a new user
app.post("/users", async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const userRef = db.collection("users").doc(email);
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      return res.status(400).json({ error: "User already exists" });
    }
    await userRef.set({ firstName, lastName, email, approved: false, timestamp: new Date().toISOString() });
    res.json({ message: "User added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add user" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
