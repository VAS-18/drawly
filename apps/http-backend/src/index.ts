import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware.js";
import {
  CreateRoomSchema,
  CreateUserSchema,
  SignInSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/database/client";
import bcrypt from "bcrypt";


const JWT_SECRET = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";


const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.json({
      message: "Incorrect Inputs",
    });

    return;
  }

  try {
    const { username, password, name } = parsedData.data;

    const existingUser = await prismaClient.user.findUnique({
      where: { email: username },
    });

    if (existingUser) {
      res.status(409).json({
        message: "User Already Exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prismaClient.user.create({
      data: {
        email: username,
        password: hashedPassword,
        name: name,
      },
    });

    res.json({
      message: "User Created Successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
});


app.post("/signin", async (req, res) => {
  const parsedData = SignInSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.json({
      message: "Incorrect inputs",
    });

    return;
  }

  try {
    const { username, password } = parsedData.data;

    const user = await prismaClient.user.findFirst({
      where: {
        email: username,
      },
    });

    if (!user) {
      res.status(401).json({
        message: "Invalid credentials",
      });

      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    res.status(200).json({
      message: "successfully signed in",
      token,
    });

    return;
  } catch (error) {
    console.error("Signin Error", error);
    res.status(500).json({
      message: "Internal server error",
    });
    return;
  }
});

app.post("/room", middleware, (req, res) => {
  const data = CreateRoomSchema.safeParse(req.body);

  if (!data.success) {
    res.json({
      message: "Incorrect inputs",
    });

    return;
  }

  //db call

  res.json({
    roomId: 123,
  });
});

app.listen(3001);
