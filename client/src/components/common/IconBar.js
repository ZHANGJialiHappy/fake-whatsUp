import React from "react";
import styled from "styled-components";
import { MdOutlineVoiceChat, MdVoiceChat } from "react-icons/md";
import { IoCall } from "react-icons/io5";
import { IoMdVideocam } from "react-icons/io";
const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  margin-bottom: 20px;
`;
const IconButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #666;
  font-size: 50px;

  &:hover {
    color: #007aff;
  }
`;
const IconBar = () => {
  return (
    <IconContainer>
      <IconButton>
        <MdOutlineVoiceChat />
      </IconButton>
      <IconButton>
        <MdVoiceChat />
      </IconButton>
      <IconButton>
        <IoCall />
      </IconButton>
      <IconButton>
        <IoMdVideocam />
      </IconButton>
    </IconContainer>
  );
};
export default IconBar;
