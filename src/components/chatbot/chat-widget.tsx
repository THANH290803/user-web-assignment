"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Bot,
  User,
  SendHorizontal,
  X,
  MessageSquareText,
  Loader2,
} from "lucide-react"; // Cần lucide-react (user's code có xài)
import { Button } from "@/components/ui/button"; // Cần Shadcn button (user's code có xài)
import { Input } from "@/components/ui/input"; // Cần Shadcn input (user's code có xài)

interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
}

export function ChatWidget() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      text: "Dạ, em chào anh/chị ạ! TechStore có thể giúp gì cho mình về điện thoại, laptop hay phụ kiện công nghệ không ạ? 😍",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref để tự động cuộn

  // 🛑 FIX UX: Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // 1. Thêm tin nhắn của User vào state ngay lập tức
    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: inputValue,
    };
    setMessages((prev) => [...prev, userMessage]);

    setInputValue(""); // Xóa input
    setIsLoading(true); // Bật loading cho AI

    try {
      // 2. Gọi API Backend mà ông đã code!
      // 🛑 LƯU Ý: Chỉnh sửa URL cho đúng với Backend của ông (ví dụ: localhost:8080)
      const response = await axios.post("http://localhost:8080/api/chat/ask", {
        message: userMessage.text,
      });

      // 3. Thêm phản hồi của AI
      const aiResponseText =
        response.data?.result ||
        "Dạ, hệ thống CSKH bên em đang bảo trì một chút, anh/chị vui lòng thử lại sau ít phút nhé ạ! 😭";

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "ai", text: aiResponseText },
      ]);
    } catch (error) {
      console.error("Lỗi khi gọi Chatbot API:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: "Dạ, em xin lỗi, em chưa thể kết nối được với server lúc này. Anh/chị thử lại sau giúp em nhé! ⚠️",
        },
      ]);
    } finally {
      setIsLoading(false); // Tắt loading
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* 🛑 NÚT BÓNG BÓNG LƠ LỬNG (Floating FAB) */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform ${
          isChatOpen ? "scale-0 rotate-180" : "scale-100 rotate-0"
        } ${"bg-gradient-to-r from-orange-500 to-red-500"} hover:shadow-xl hover:-translate-y-1`}
      >
        <MessageSquareText className="h-7 w-7 text-white" />
      </button>

      {/* 🛑 KHUNG CHAT POPUP (Fixed-size) */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[400px] h-[550px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col transition-all duration-300 origin-bottom-right ${
          isChatOpen
            ? "scale-100 opacity-100"
            : "scale-0 opacity-0 pointer-events-none"
        }`}
      >
        {/* HEADER KHUNG CHAT */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center border border-orange-200">
              <Bot className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Trợ lý ảo TechStore</h4>
              <div className="flex items-center gap-1.5 text-xs text-green-600">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                Dạ em đang sẵn sàng!
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsChatOpen(false)}
            className="text-gray-400 hover:text-red-500 hover:bg-transparent p-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* KHU VỰC HIỂN THỊ TIN NHẮN (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gray-50/20">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === "user" ? "justify-end" : ""}`}
            >
              {msg.sender === "ai" && (
                <div className="w-8 h-8 rounded-full bg-orange-50/80 border border-orange-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-orange-500" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100"
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-gray-500" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-50/80 border border-orange-100 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-orange-500" />
              </div>
              <div className="max-w-[80%] p-3.5 rounded-2xl text-sm bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                Đang tính toán chút sếp ơi... 😍
              </div>
            </div>
          )}
          <div ref={messagesEndRef}></div> {/* Thằng này dùng để auto-scroll */}
        </div>

        {/* KHU VỰC NHẬP TIN NHẮN (Footer) */}
        <div className="p-4 border-t border-gray-100 bg-white rounded-b-2xl">
          <div className="flex items-center gap-2 border border-gray-200 rounded-full px-2 py-1 focus-within:ring-2 focus-within:ring-orange-200 transition-all">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Hỏi em về cấu hình, giá bán..."
              className="flex-1 border-none focus-visible:ring-0 shadow-none text-sm placeholder:text-gray-300"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              size="sm"
              className={`rounded-full p-2 h-9 w-9 ${
                !inputValue.trim() || isLoading
                  ? "bg-gray-100 text-gray-300"
                  : "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-md transition-all"
              }`}
            >
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
