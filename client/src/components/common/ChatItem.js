import React from "react";
import styled from "styled-components";
import { parseService } from "../../services/parseService";

const ItemContainer = styled.div`
  display: flex;
  padding: 15px 20px;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  background: ${(props) => (props.active ? "#d0f0c0" : "transparent")};
  transition: background 0.2s;
  &:hover {
    background: ${(props) => (props.active ? "#d0f0c0" : "#f5f5f5")};
  }
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ContentContainer = styled.div`
  flex: 1;
  min-width: 0;
`;

const TopLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const Name = styled.h4`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
`;

const MessagePreview = styled.p`
  margin: 0;
  font-size: 14px;
  color: "#666";
  font-weight: "400";
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
`;

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StarIcon = styled.span`
  color: ${(props) => (props.isPinned ? "#007AFF" : "#ccc")};
  cursor: pointer;
  font-size: 16px;

  &:hover {
    color: #007aff;
  }
`;

const ChatItem = ({
  id,
  name,
  message,
  isPinned,
  active,
  avatar,
  onClick,
  onPinUpdate,
}) => {
  const handlePinClick = async (e) => {
    e.stopPropagation(); // Prevent chat item click
    try {
      const updatedChat = await parseService.pinChat(id, !isPinned);
      onPinUpdate?.(id, updatedChat.isPinned);
    } catch (error) {
      console.error("Failed to update pin status:", error);
    }
  };
  return (
    <ItemContainer active={active} onClick={onClick}>
      <Avatar>{avatar || name[0]}</Avatar>
      <ContentContainer>
        <TopLine>
          <Name>{name}</Name>
          <StatusContainer>
            <StarIcon isPinned={isPinned} onClick={handlePinClick}>
              ★
            </StarIcon>
          </StatusContainer>
        </TopLine>
        <MessagePreview>{message}</MessagePreview>
      </ContentContainer>
    </ItemContainer>
  );
};

export default ChatItem;
