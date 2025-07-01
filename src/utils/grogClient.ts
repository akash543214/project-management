// lib/groqClient.ts
import { Groq } from "groq-sdk";
import Instructor from "@instructor-ai/instructor";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const instructor = Instructor({
  client: groq,
  mode: "TOOLS"
});
