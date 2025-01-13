"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useMessages } from "./MessagesProvider";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const CDP_OPTIONS = [
  { label: "Segment", value: "https://segment.com/docs/" },
  { label: "mParticle", value: "https://docs.mparticle.com/" },
  { label: "Lytics", value: "https://docs.lytics.com/" },
  { label: "Zeotap", value: "https://docs.zeotap.com/" },
];

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const [selectedWebsite, setSelectedWebsite] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { messages, addMessage } = useMessages();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !selectedWebsite) return;

    try {
      setIsLoading(true);
      const userMessage = {
        role: "user" as const,
        content: `WebBrowser: ${selectedWebsite}, ${input.trim()}`,
      };
      addMessage(userMessage);
      setInput("");

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (!data.content) {
        throw new Error("Invalid response format from server");
      }

      addMessage({ role: "assistant", content: data.content });
    } catch (error: any) {
      console.error("Chat error:", error);
      addMessage({
        role: "assistant",
        content:
          "I apologize, but I encountered an error. Please try again or rephrase your question.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-3xl mx-auto">
      <ScrollArea className="flex-1 p-4 rounded-lg border bg-card mb-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground p-4">
              Ask me anything about Segment, mParticle, Lytics, or Zeotap!
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <ReactMarkdown className="prose dark:prose-invert max-w-none">
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-4 bg-muted">
                Thinking...
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Select
          onValueChange={setSelectedWebsite}
          value={selectedWebsite}
          defaultValue="https://segment.com/docs/"
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a CDP" />
          </SelectTrigger>
          <SelectContent>
            {CDP_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about CDPs..."
          className="flex-1"
          rows={3}
        />
        <Button type="submit" disabled={isLoading || !selectedWebsite}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
