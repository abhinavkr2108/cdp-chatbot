import ChatInterface from "@/components/ChatInterface";
import { MessagesProvider } from "@/components/MessagesProvider";

export default function Home() {
  return (
    <MessagesProvider>
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">CDP Support Assistant</h1>
            <p className="text-muted-foreground">
              Get help with Segment, mParticle, Lytics, and Zeotap
            </p>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <ChatInterface />
        </main>
      </div>
    </MessagesProvider>
  );
}
