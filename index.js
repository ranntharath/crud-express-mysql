import express from "express";
import { connectDB, getDB } from "./db.js";
import { upload } from "./uploadFile.js";
import cors from 'cors'

const server = express();

/**
 * connect db before server start
 */
await connectDB();

/**
 * middleware 
 */
server.use(express.json());
server.use(cors())
server.use("/upload", express.static("upload"));
/**
 * WELCOME TO SERVER
 */
server.get("/api", (req, res) => {
  res.status(200).json({ message: "Welcome to server" });
});

/**
 * GET
 * get all users
 */
server.get("/api/users", async (req, res) => {
  const db = getDB();
  if (!db) {
    return res.status(500).json({ error: "Database not initialized" });
  }

  const sql = "SELECT * FROM tb_people";
  const [rows] = await db.query(sql);

  if (rows.length === 0) {
    return res.status(404).json({ message: "No users found" });
  }

  
  const dataWithUrls = rows.map(user => {
    if (user.profile) {
      user.profile = `${req.protocol}://${req.get("host")}/upload/${user.profile}`;
    }
    return user;
  });

  res.status(200).json({
    success: true,
    count: dataWithUrls.length,
    data: dataWithUrls,
  });
});

/**
 * GET
 * GET USER BY ID
 */
server.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(500).json({ error: "Invalid ID" });

  const db = getDB();
  if (!db) return res.status(500).json({ error: "Database not initialize" });

  const [rows] = await db.query("SELECT * FROM tb_people WHERE id = ?", [id]);

  
  if (rows.length === 0) {
    return res.status(404).json({ message: "No users found" });
  }

  if (rows.length > 0 && rows[0].profile) {
    rows[0].profile = `${req.protocol}://${req.get("host")}/upload/${rows[0].profile}`;
}


  res.status(200).json(rows[0]);
});

/**
 * POST
 * Create new users
 */
server.post("/api/users", upload.single("profile"), async (req, res) => {
  try {
    const { name, gender, dob } = req.body;
    const profile = req.file ? req.file.filename : null;

    if (!name || !gender || !dob || !profile) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const db = getDB();
    if (!db) return res.status(500).json({ error: "Database not initialized" });

    const sql =
      "INSERT INTO tb_people (name, gender, dob, profile) VALUE (?, ?, ?, ?)";
    const [response] = await db.query(sql, [name, gender, dob, profile]);

    // Get inserted record
    const getCurrentAdd = "SELECT * FROM tb_people WHERE id = ?";
    const [rows] = await db.query(getCurrentAdd, [response.insertId]);

    // Build full URL for frontend
    const user = {
      ...rows[0],
      profile: `${req.protocol}://${req.get("host")}/upload/${rows[0].profile}`,
    };

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


/**
 * UPDATE
 */
server.put("/api/users/:id", upload.single("profile"), async (req, res) => {
  const db = getDB();
  if (!db) return res.status(500).json({ error: "Database not initialize" });

  const { id } = req.params;
  if (!id) return res.status(500).json({ error: "Invalid ID" });

  const { name, gender, dob } = req.body;
  //keep old file if no new file
  const profile = req.file ? req.file.filename : req.body.profile;

  if (!name || !gender || !dob) {
    return res.status(400).json({ error: "Fields are required" });
  }

  const sql =
    "UPDATE tb_people SET name = ?, gender = ?, dob =?, profile=? WHERE id = ?";

  const [result] = await db.query(sql, [name, gender, dob, profile, id]);
  if (result.affectedRows === 0) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const [rows] = await db.query("SELECT * FROM tb_people WHERE id = ?", [id]);

  res.status(200).json({
    message: "Update successful",
    data: rows[0],
  });
});

/**
 * DELETE
 */

server.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(500).json({ error: "invalid ID" });

  const db = getDB();
  if (!db) return res.status(500).json({ error: "database not initialize" });

  /**
   * find users
   */
  const [rows] = await db.query("SELECT * FROM tb_people WHERE id = ?", [id]);
  if (rows.length === 0) {
    return res.status(404).json({ error: "User not found" });
  }

  /**
   * delete user
   */
  await db.query("DELETE FROM tb_people WHERE id = ?", [id]);

  res.status(200).json({
    success: true,
    message: "delete user success",
  });
});

server.listen(3000, () => {
  console.log("http://localhost:3000");
});
