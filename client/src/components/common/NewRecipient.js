import React, { useState } from 'react';
import styled from 'styled-components';
import { parseService } from '../../services/parseService';

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  background: #fff;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #007AFF;
  }
`;

const AddButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #007AFF;
  color: white;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  opacity: ${props => props.disabled ? 0.5 : 1};

  &:hover {
    background: ${props => props.disabled ? '#007AFF' : '#0056b3'};
  }
`;

const NewRecipient = ({ onChatAdded }) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddChat = async () => {
    if (!inputValue.trim()) {
      return;
    }
    
    setIsLoading(true);
    try {
      const newChat = {
        name: inputValue,
        message: "Start a conversation...",
        isPinned: false,
        avatar: inputValue[0].toUpperCase(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        active: false
      };
      
      const savedChat = await parseService.saveChat(newChat);
      onChatAdded?.(savedChat);
      setInputValue('');
    } catch (error) {
      console.error('Failed to add chat:', error);
      // Could add error handling UI here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SearchContainer>
      <SearchInput 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="New recipient..."
      />
      <AddButton 
        onClick={handleAddChat}
        disabled={isLoading || !inputValue.trim()}
      >
        {isLoading ? '...' : '+'}
      </AddButton>
    </SearchContainer>
  );
};

export default NewRecipient;