// src/components/Message.js
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 20px;
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.isSelf ? "flex-end" : "flex-start")};
  max-width: 70%;
  align-self: ${(props) => (props.isSelf ? "flex-end" : "flex-start")};
`;

const MessageBubble = styled.div`
  padding: 12px 16px;
  border-radius: 16px;
  background: ${(props) => (props.isSelf ? "#D4F5D7" : "#E3EBF5")};
  color: #1a1a1a;
  font-size: 25px;
  line-height: 1.4;
  margin-bottom: 4px;
`;

const MessageMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 25px;
  color: #666;
`;

const Message = ({ messages }) => {
  return (
    <Container>
      {messages.map((message) => (
        <MessageWrapper key={message.id} isSelf={message.isSelf}>
          <MessageBubble isSelf={message.isSelf}>{message.text}</MessageBubble>
          <MessageMeta>{message.timestamp}</MessageMeta>
        </MessageWrapper>
      ))}
    </Container>
  );
};

export default Message;
