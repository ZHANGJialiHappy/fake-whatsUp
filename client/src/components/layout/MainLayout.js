import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import NewRecipient from "../common/NewRecipient";
import { parseService } from "../../services/parseService";
import RecipientItem from "../common/RecipientItem";
import Message from "../common/Message";
import { useParams } from "react-router-dom";
import IconBar from "../common/IconBar";

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

const RecipientList = styled.div`
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
  font-size: 25px;
`;

const Button = styled.button`
  padding: 12px 24px;
  background: #007aff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 25px;

  &:hover {
    background: #0056b3;
  }
`;

const MainLayout = () => {
  const { selfId } = useParams();
  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    fetchFriends();
  }, [selfId]);

  const pollMessages = useCallback(async () => {
    const activeFriend = friends.find((friend) => friend.active);
    if (!activeFriend) return;
    try {
      const newMessages = await parseService.getMessages(
        selfId,
        activeFriend.id
      );
      setMessages(newMessages);
    } catch (error) {
      console.error("Failed to poll messages:", error);
    }
  }, [friends, selfId]);
  // Set up polling interval
  useEffect(() => {
    const intervalId = setInterval(pollMessages, 1000);
    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [pollMessages]);

  const fetchFriends = async () => {
    try {
      setIsLoading(true);
      const fetchedFriends = await parseService.getFriends(selfId);
      setFriends(fetchedFriends);
    } catch (err) {
      setError("Failed to load friends");
      console.error("Error fetching friends:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onConnect = () => {
    fetchFriends();
  };

  const handleRecipientClick = async (recipientId) => {
    try {
      // Update local state for all friends
      setFriends((prevFriends) =>
        prevFriends.map((friend) => ({
          ...friend,
          active: friend.id === recipientId,
        }))
      );

      // Fetch messages for this friend
      const messages = await parseService.getMessages(selfId, recipientId);
      setMessages(messages);
    } catch (error) {
      console.error("Failed to activate recipient:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    try {
      const activeFriend = friends.find((friend) => friend.active);
      if (!activeFriend) {
        console.error("No active friend selected");
        return;
      }

      const newMessage = {
        text: inputValue,
        timestamp: new Date().toLocaleTimeString(),
        isSelf: true,
        isRead: false,
      };

      const savedMessage = await parseService.addMessage(
        selfId,
        activeFriend.id,
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
          onConnect={onConnect}
          selfId={selfId}
        />

        <RecipientList>
          {isLoading ? (
            <div>Loading friends...</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            friends.map((friend) => (
              <RecipientItem
                key={friend.id}
                id={friend.id}
                name={friend.name}
                avatar={friend.avatar}
                active={friend.active}
                onClick={() => handleRecipientClick(friend.id)}
              />
            ))
          )}
        </RecipientList>
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
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </MessageInput>
        <IconBar />
      </ChatArea>
    </Container>
  );
};

export default MainLayout;
