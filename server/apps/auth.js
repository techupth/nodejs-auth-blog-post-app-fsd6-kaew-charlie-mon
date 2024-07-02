import { Router } from "express";
import bcrypt from "bcrypt";
import { db } from "../utils/db.js";
import jwt from "jsonwebtoken";

const authRouter = Router();

// 🐨 Todo: Exercise #1
// ให้สร้าง API เพื่อเอาไว้ Register ตัว User แล้วเก็บข้อมูลไว้ใน Database ตามตารางที่ออกแบบไว้
authRouter.post("/register", async (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  const collection = db.collection("users");
  await collection.insertOne(user);
  return res.json({
    message: "User has been created successfully",
  });
});

// 🐨 Todo: Exercise #3
// ให้สร้าง API เพื่อเอาไว้ Login ตัว User ตามตารางที่ออกแบบไว้
authRouter.post("/login", async (req, res) => {
  const user = await db.collection("users").findOne({
    username: req.body.username,
  });
  if (!user) {
    return res.status(404).json({
      message: "user not found",
    });
  }
  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isValidPassword) {
    return res.status(404).json({
      message: "password not valid",
    });
  }
  const token = jwt.sign(
    {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
  },
process.env.SECRET_KEY,
{
    expiresIn: "900000",
}
);
return res.json({
    message: "login successfully", token,
})
});


export default authRouter;
