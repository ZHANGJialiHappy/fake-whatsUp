// src/components/RecipientItem.js
import React from "react";
import styled from "styled-components";

const ItemContainer = styled.div`
  display: flex;
  padding: 15px 20px;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  background: ${(props) => (props.active ? "#D4F5D7" : "transparent")};
  transition: background 0.2s;
  margin-top: 12px;
  &:hover {
    background: ${(props) => (props.active ? "#D4F5D7" : "#f5f5f5")};
  }
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 25px;
`;

const ContentContainer = styled.div`
  flex: 1;
  min-width: 0;
`;

const Name = styled.h4`
  margin: 0;
  font-size: 25px;
  font-weight: 600;
  color: #1a1a1a;
`;

const RecipientItem = ({ id, name, active, onClick }) => {
  const handleClick = () => {
    onClick?.(id); // Pass id to parent component
  };
  return (
    <ItemContainer active={active} onClick={handleClick}>
      <Avatar>{name && name[0]}</Avatar>
      <ContentContainer>
        <Name>{name}</Name>
      </ContentContainer>
    </ItemContainer>
  );
};

export default RecipientItem;
