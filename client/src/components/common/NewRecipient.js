import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { parseService } from '../../services/parseService';

const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownInput = styled.input`
  width: 95%;
  padding: 12px 15px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: #007AFF;
  }
`;

const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  margin-top: 4px;
  padding: 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1000;
`;

const DropdownItem = styled.li`
  padding: 10px 15px;
  cursor: pointer;
  list-style: none;

  &:hover {
    background: #f5f5f5;
  }
`;

const NewRecipient = ({selfId, onConnect}) => {
  const [recipients, setRecipients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecipients();
  }, []);

  const fetchRecipients = async () => {
    try {
      const data = await parseService.getRecipients();
      setRecipients(data);
    } catch (error) {
      console.error('Failed to fetch recipients:', error);
    }
  };

  const handleSelect = async (recipient) => {
    try {
      setLoading(true);
      await parseService.makeFriends(selfId, recipient.id);
      onConnect?.(); // Optional callback
      setSearchTerm('');
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to make friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipients = recipients.filter(recipient =>
    recipient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DropdownContainer>
      <DropdownInput
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Search recipients..."
        disabled={loading}
      />
      {isOpen && (
        <DropdownList>
          {filteredRecipients.map(recipient => (
            <DropdownItem
              key={recipient.id}
              onClick={() => handleSelect(recipient)}
            >
              {recipient.name}
            </DropdownItem>
          ))}
        </DropdownList>
      )}
    </DropdownContainer>
  );
};

export default NewRecipient;