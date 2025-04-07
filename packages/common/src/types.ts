import { z } from "zod";

export const CreateUserSchema = z.object({
  username: z.string().min(4).max(20),
  password: z.string(),
  name: z.string(),
});

export const SignInSchema = z.object({
  username: z.string().min(4).max(20),
  password: z.string(),
});

export const CreateRoomSchema = z.object({
  roomName: z.string().max(10),
});
