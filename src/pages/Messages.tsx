import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { MessageSquare, Send, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "wouter";

export default function Messages() {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const utils = trpc.useUtils();

  const activeConvId = conversationId ? parseInt(conversationId) : null;

  const { data: conversations, isLoading: convsLoading } = trpc.messages.getConversations.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchInterval: 5000,
  });

  const { data: messages, isLoading: msgsLoading } = trpc.messages.getMessages.useQuery(
    { conversationId: activeConvId! },
    { enabled: !!activeConvId, refetchInterval: 3000 }
  );

  const sendMessage = trpc.messages.send.useMutation({
    onSuccess: () => {
      setNewMessage("");
      utils.messages.getMessages.invalidate({ conversationId: activeConvId! });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim() || !activeConvId) return;
    sendMessage.mutate({ conversationId: activeConvId, content: newMessage.trim() });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
          <h1 className="text-2xl font-serif font-bold mb-2">Sign In Required</h1>
          <Button asChild><a href={getLoginUrl()}>Sign In</a></Button>
        </div>
      </div>
    );
  }

  const activeConv = conversations?.find(c => c.id === activeConvId);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex overflow-hidden" style={{ height: "calc(100vh - 64px)" }}>
        {/* Conversations List */}
        <div className={`w-full md:w-80 border-r border-border flex-shrink-0 flex flex-col ${activeConvId ? "hidden md:flex" : "flex"}`}>
          <div className="p-4 border-b border-border">
            <h2 className="font-serif font-semibold text-foreground">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {convsLoading ? (
              <div className="p-4 space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="skeleton w-10 h-10 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-4 w-3/4 rounded" />
                      <div className="skeleton h-3 w-1/2 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : conversations && conversations.length > 0 ? (
              conversations.map(conv => {
                const isActive = conv.id === activeConvId;
                const other = conv.otherUser;
                return (
                  <button
                    key={conv.id}
                    onClick={() => navigate(`/messages/${conv.id}`)}
                    className={`w-full flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors text-left border-b border-border/50 ${isActive ? "bg-secondary" : ""}`}
                  >
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarImage src={other?.avatarUrl ?? undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {other?.name?.charAt(0) ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{other?.name ?? "User"}</p>
                      {conv.lastMessage && (
                        <p className="text-xs text-muted-foreground truncate">{conv.lastMessage.content}</p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {new Date(conv.lastMessageAt).toLocaleDateString()}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm font-medium">No conversations yet</p>
                <p className="text-xs mt-1">Message a seller from a listing</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className={`flex-1 flex flex-col ${!activeConvId ? "hidden md:flex" : "flex"}`}>
          {activeConvId && activeConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center gap-3">
                <button
                  onClick={() => navigate("/messages")}
                  className="md:hidden text-muted-foreground hover:text-foreground"
                >
                  ←
                </button>
                <Avatar className="w-9 h-9">
                  <AvatarImage src={activeConv.otherUser?.avatarUrl ?? undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {activeConv.otherUser?.name?.charAt(0) ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm text-foreground">{activeConv.otherUser?.name ?? "User"}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {msgsLoading ? (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`flex ${i % 2 === 0 ? "" : "justify-end"}`}>
                        <div className="skeleton h-10 w-48 rounded-2xl" />
                      </div>
                    ))}
                  </div>
                ) : messages && messages.length > 0 ? (
                  messages.map(msg => {
                    const isOwn = msg.senderId === user?.id;
                    return (
                      <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                            isOwn
                              ? "bg-primary text-primary-foreground rounded-br-sm"
                              : "bg-secondary text-foreground rounded-bl-sm"
                          }`}
                        >
                          <p>{msg.content}</p>
                          <p className={`text-xs mt-1 ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
                    <p className="text-sm">Start the conversation</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                    className="flex-1"
                  />
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={!newMessage.trim() || sendMessage.isPending}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium text-foreground">Select a conversation</p>
              <p className="text-sm mt-1">Choose a conversation from the list to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
