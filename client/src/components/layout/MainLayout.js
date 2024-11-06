import React, { useState, useEffect } from "react";
import styled from "styled-components";
import NewRecipient from "../common/NewRecipient";
import { parseService } from "../../services/parseService";
import ChatItem from "../common/ChatItem";
import Message from "../common/Message";
import { useParams } from "react-router-dom";

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: #fff;
`;

const Sidebar = styled.div`
  width: 300px;
  border-right: 1px solid #eaeaea;
  display: flex;
  flex-direction: column;
`;

const ChatList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const MessageInput = styled.div`
  padding: 20px;
  border-top: 1px solid #eaeaea;
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  outline: none;
`;

const Button = styled.button`
  padding: 12px 24px;
  background: #007aff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;
const MainLayout = () => {
  const { selfChatId } = useParams();
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const fetchedChats = await parseService.getChats();
      setChats(fetchedChats);
    } catch (err) {
      setError("Failed to load chats");
      console.error("Error fetching chats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChatAdded = (newChat) => {
    setChats((prevChats) => [newChat, ...prevChats]);
  };

  const handlePinUpdate = async (chatId, isPinned) => {
    try {
      // Update local state for single chat
      setChats((prevChats) =>
        prevChats
          .map((chat) => (chat.id === chatId ? { ...chat, isPinned } : chat))
          .sort((a, b) => {
            // Sort pinned chats first
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return 0;
          })
      );
    } catch (error) {
      console.error("Failed to update pin status:", error);
    }
  };

  const handleChatClick = async (chatId) => {
    try {
      const chatMessages = await parseService.getMessages(selfChatId, chatId);
      setMessages(chatMessages);

      // Update local state for all chats
      setChats((prevChats) =>
        prevChats
          .map((chat) => ({
            ...chat,
            active: chat.id === chatId,
          }))
          .sort((a, b) => {
            // Keep pinned chats sorting
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return 0;
          })
      );
    } catch (error) {
      console.error("Failed to activate chat:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    try {
      const activeChat = chats.find((chat) => chat.active);
      if (!activeChat) return;
      const newMessage = {
        text: inputValue,
        timestamp: new Date().toLocaleTimeString(),
        isSelf: true,
      };

      const savedMessage = await parseService.addMessage(
        selfChatId,
        activeChat.id,
        newMessage
      );
      setMessages((prevMessages) => [...prevMessages, savedMessage]);
      setInputValue(""); // Clear input after sending
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  return (
    <Container>
      <Sidebar>
        <NewRecipient
          placeholder="New recipient"
          onChatAdded={handleChatAdded}
        />

        <ChatList>
          {loading ? (
            <div>Loading chats...</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            chats.map((chat) => (
              <ChatItem
                key={chat.id}
                id={chat.id}
                name={chat.name}
                message={chat.message}
                isPinned={chat.isPinned}
                active={chat.active}
                avatar={chat.avatar}
                onClick={() => handleChatClick(chat.id)}
                onPinUpdate={handlePinUpdate}
              />
            ))
          )}
        </ChatList>
      </Sidebar>

      <ChatArea>
        <MessagesContainer>
          <Message messages={messages} />
        </MessagesContainer>

        <MessageInput>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </MessageInput>
      </ChatArea>
    </Container>
  );
};

export default MainLayout;
