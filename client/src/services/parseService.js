import Parse from '../config/parseConfig';

const CHAT_CLASS = 'Chat';
const MESSAGE_CLASS = 'Message';

export const parseService = {
  async getChats() {
    try {
      const query = new Parse.Query(CHAT_CLASS);
      // Sort by isPinned first, then by timestamp
      query.descending('isPinned');
      query.descending('timestamp');
      query.limit(100); // Limit results
      
      const results = await query.find();
      return results.map(chat => ({
        id: chat.id,
        name: chat.get('name'),
        message: chat.get('message'),
        isPinned: chat.get('isPinned'),
        avatar: chat.get('avatar'),
        timestamp: chat.get('timestamp'),
        active: false,
      }));
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw error;
    }
  },
  
  async saveChat(chatData) {
    try {
      const Chat = Parse.Object.extend(CHAT_CLASS);
      const chat = new Chat();
      
      chat.set('name', chatData.name);
      chat.set('message', chatData.message);
      chat.set('isPinned', chatData.isPinned);
      chat.set('avatar', chatData.avatar);
      chat.set('timestamp', chatData.timestamp);
      
      const savedChat = await chat.save();
      return {
        id: savedChat.id,
        ...chatData
      };
    } catch (error) {
      console.error('Error saving chat:', error);
      throw error;
    }
  },

  async pinChat(chatId, isPinned) {
    try {
      const query = new Parse.Query(CHAT_CLASS);
      const chat = await query.get(chatId);
      
      chat.set('isPinned', isPinned);
      const updatedChat = await chat.save();
      
      return {
        id: updatedChat.id,
        name: updatedChat.get('name'),
        message: updatedChat.get('message'),
        isPinned: chat.get('isPinned'),
        avatar: updatedChat.get('avatar'),
        timestamp: updatedChat.get('timestamp'),
      };
    } catch (error) {
      console.error('Error updating chat pin status:', error);
      throw error;
    }
  },

  async getMessages(senderChatId, receiverChatId) {
    try {
      const query = new Parse.Query(MESSAGE_CLASS);
      const senderPointer = new Parse.Object(CHAT_CLASS);
      const receiverPointer = new Parse.Object(CHAT_CLASS);
      
      senderPointer.id = senderChatId;
      receiverPointer.id = receiverChatId;
      
      // Get messages where current chat is either sender or receiver
      const senderQuery = new Parse.Query(MESSAGE_CLASS);
      senderQuery.equalTo('sender', senderPointer);
      senderQuery.equalTo('receiver', receiverPointer);
      
      const receiverQuery = new Parse.Query(MESSAGE_CLASS);
      receiverQuery.equalTo('sender', receiverPointer);
      receiverQuery.equalTo('receiver', senderPointer);
      
      // Combine queries
      query._orQuery([senderQuery, receiverQuery]);
      query.ascending('createdAt');
      
      const results = await query.find();
      return results.map(message => ({
        id: message.id,
        text: message.get('text'),
        timestamp: message.get('timestamp'),
        isSelf: message.get('sender').id === senderChatId
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  async addMessage(senderChatId, receiverChatId, messageData) {
    try {
      const Message = Parse.Object.extend(MESSAGE_CLASS);
      const message = new Message();
      
      // Create pointers to sender and receiver Chats
      const senderPointer = new Parse.Object(CHAT_CLASS);
      senderPointer.id = senderChatId;
      
      const receiverPointer = new Parse.Object(CHAT_CLASS);
      receiverPointer.id = receiverChatId;
      
      // Set message data with both chat relationships
      message.set('sender', senderPointer);
      message.set('receiver', receiverPointer);
      message.set('text', messageData.text);
      message.set('timestamp', messageData.timestamp);
      message.set('isSelf', messageData.isSelf);
      
      const savedMessage = await message.save();
      
      return {
        id: savedMessage.id,
        text: savedMessage.get('text'),
        timestamp: savedMessage.get('timestamp'),
        isSelf: savedMessage.get('isSelf'),
        senderChatId: senderChatId,
        receiverChatId: receiverChatId
      };
    } catch (error) {
      console.error('Error saving message:', error);
      throw error;
    }
  },

};