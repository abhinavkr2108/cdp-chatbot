import { ChatOpenAI } from "@langchain/openai";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";
import { NextResponse } from "next/server";
import axios from "axios";
import { load } from "cheerio";

const SYSTEM_PROMPT = `You are a helpful CDP (Customer Data Platform) support assistant. You can help users with questions about Segment, mParticle, Lytics, and Zeotap. 
You have access to the following documentation:
- Segment: https://segment.com/docs/
- mParticle: https://docs.mparticle.com/
- Lytics: https://docs.lytics.com/
- Zeotap: https://docs.zeotap.com/

Only answer questions related to these CDPs. For other questions, politely explain that you can only help with CDP-related queries.

Keep your responses clear, concise, and focused on practical steps.`;

export const runtime = "edge";

async function fetchAndSummarize(url: string, query?: string): Promise<string> {
  try {
    const response = await axios.get(url);
    const $ = load(response.data);

    if (query) {
      // Find relevant snippets based on the query
      const relevantText = $("body")
        .text()
        .split(/[\n\t]/)
        .filter((line) => line.includes(query))
        .join("\n");
      return relevantText || "No relevant information found.";
    } else {
      // Summarize the entire page
      const pageText = $("body").text();
      return pageText.substring(0, 1000); // Return the first 1000 characters as a summary
    }
  } catch (error) {
    console.error("Error fetching or summarizing the webpage:", error);
    return "Unable to fetch or summarize the webpage.";
  }
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const messages = body.messages;

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages must be an array" },
        { status: 400 }
      );
    }

    const formattedMessages = [
      new SystemMessage(SYSTEM_PROMPT),
      ...messages.map((msg: any) => {
        if (msg.role === "user") {
          return new HumanMessage(msg.content);
        } else if (msg.role === "assistant") {
          return new AIMessage(msg.content);
        }
        throw new Error(`Invalid message role: ${msg.role}`);
      }),
    ];

    const chat = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-3.5-turbo",
      temperature: 0.7,
      maxTokens: 1000,
    });

    // Check if the last message is a request to use the Web Browser Tool
    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage.role === "user" &&
      lastMessage.content.startsWith("WebBrowser:")
    ) {
      const [url, query] = lastMessage.content
        .replace("WebBrowser:", "")
        .split(",")
        .map((s: string) => s.trim());
      const summary = await fetchAndSummarize(url, query);
      formattedMessages.push(new AIMessage(summary));
    }

    const response = await chat.call(formattedMessages);

    return NextResponse.json({ content: response.content });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      {
        error:
          error.message || "An error occurred while processing your request",
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
