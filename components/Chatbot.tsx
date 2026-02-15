"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: string;
  type: "user" | "bot";
  text: string;
  timestamp: Date;
};

const INITIAL_BOT_MESSAGE: Message = {
  id: "welcome",
  type: "bot",
  text: "Hi! 👋 Welcome to SmileCraft Dental. How can we help you today? You can ask about appointments, services, or location.",
  timestamp: new Date(),
};


export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_BOT_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  async function handleSend() {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      text: trimmed,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        type: "bot",
        text: data.answer || "Unable to process your request",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `bot-${Date.now()}`,
        type: "bot",
        text: "Sorry, I encountered an error. Please try again or contact us directly at (555) 123-4567.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            className="fixed bottom-24 right-4 z-100 flex h-[min(85vh,28rem)] w-[min(100vw-2rem,22rem)] flex-col overflow-hidden rounded-2xl border border-dental-gray-200 bg-white shadow-xl sm:right-6 sm:bottom-28 sm:w-96"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-dental-gray-200 bg-dental-primary px-4 py-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-white" aria-hidden />
                <span className="font-semibold text-white">Chat with us</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-white/90 transition-colors hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            {/* Scrollable messages */}
            <div className="flex-1 overflow-y-auto bg-dental-gray-50 p-4">
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                        msg.type === "user"
                          ? "bg-dental-primary text-white rounded-br-md"
                          : "bg-white text-dental-gray-800 border border-dental-gray-200 rounded-bl-md"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input area */}
            <div className="border-t border-dental-gray-200 bg-white p-3">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  disabled={isLoading}
                  className="flex-1 rounded-xl border border-dental-gray-300 bg-dental-gray-50 px-4 py-2.5 text-sm text-dental-gray-900 placeholder:text-dental-gray-500 focus:border-dental-primary focus:outline-none focus:ring-2 focus:ring-dental-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Chat message"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dental-primary text-white transition-colors hover:bg-dental-primary-dark focus:outline-none focus:ring-2 focus:ring-dental-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
                  aria-label="Send message"
                >
                  <Send className="h-5 w-5" aria-hidden />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-4 z-[99] flex h-14 w-14 items-center justify-center rounded-full bg-dental-primary text-white shadow-lg transition-colors hover:bg-dental-primary-dark focus:outline-none focus:ring-4 focus:ring-dental-primary/30 sm:bottom-8 sm:right-6 sm:h-16 sm:w-16"
        aria-label={isOpen ? "Close chat" : "Open chat"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        {isOpen ? (
          <X className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden />
        ) : (
          <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden />
        )}
      </motion.button>
    </>
  );
}
