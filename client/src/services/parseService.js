import Parse from '../config/parseConfig';

const RECIPIENT_CLASS = 'Recipient';
const FRIENDSHIP_CLASS = 'Friendship';
const MESSAGE_CLASS = 'Message';

export const parseService = {

  async addRecipient(recipientData) {
    try {
      const Recipient = Parse.Object.extend(RECIPIENT_CLASS);
      const recipient = new Recipient();
      
      recipient.set('name', recipientData.name);
      recipient.set('avatar', recipientData.avatar || recipientData.name[0].toUpperCase());
      
      const savedRecipient = await recipient.save();
      
      return {
        id: savedRecipient.id,
        name: savedRecipient.get('name'),
        avatar: savedRecipient.get('avatar'),
        createdAt: savedRecipient.createdAt,
        updatedAt: savedRecipient.updatedAt
      };
    } catch (error) {
      console.error('Error adding recipient:', error);
      throw error;
    }
  },

  async getRecipients() {
    try {
      const query = new Parse.Query(RECIPIENT_CLASS);
      query.ascending('name'); // Sort alphabetically
      query.select(['name', 'id']); // Only fetch needed fields
      
      const results = await query.find();
      return results.map(recipient => ({
        id: recipient.id,
        name: recipient.get('name')
      }));
    } catch (error) {
      console.error('Error fetching recipients:', error);
      throw error;
    }
  },

  async makeFriends(recipientId1, recipientId2) {
    try {
      // Create pointers to Recipients
      const Recipient = Parse.Object.extend(RECIPIENT_CLASS);
      const recipient1 = new Recipient();
      const recipient2 = new Recipient();
      recipient1.id = recipientId1;
      recipient2.id = recipientId2;
      
      // Check existing friendship
      const query = new Parse.Query(FRIENDSHIP_CLASS);
      query._orQuery([
        new Parse.Query(FRIENDSHIP_CLASS)
          .equalTo('recipient1', recipient1)
          .equalTo('recipient2', recipient2),
        new Parse.Query(FRIENDSHIP_CLASS)
          .equalTo('recipient1', recipient2)
          .equalTo('recipient2', recipient1)
      ]);
      
      const existingFriendship = await query.first();
      if (existingFriendship) return existingFriendship;

      // Create new friendship
      const Friendship = Parse.Object.extend(FRIENDSHIP_CLASS);
      const friendship = new Friendship();
      friendship.set('recipient1', recipient1);
      friendship.set('recipient2', recipient2);
      return await friendship.save();
    } catch (error) {
      console.error('Error making friends:', error);
      throw error;
    }
  },

async getFriends(recipientId) {
  try {
    const query = new Parse.Query(FRIENDSHIP_CLASS);
    const Recipient = Parse.Object.extend(RECIPIENT_CLASS);
    const recipient = new Recipient();
    recipient.id = recipientId;
    
    // Include full recipient objects in query
    const query1 = new Parse.Query(FRIENDSHIP_CLASS)
      .equalTo('recipient1', recipient)
      .include('recipient1')
      .include('recipient2');
      
    const query2 = new Parse.Query(FRIENDSHIP_CLASS)
      .equalTo('recipient2', recipient)
      .include('recipient1')
      .include('recipient2');
    
    query._orQuery([query1, query2]);
    
    const friendships = await query.find();
    
    return friendships.map(friendship => {
      const friend = friendship.get('recipient1').id === recipientId ?
        friendship.get('recipient2') :
        friendship.get('recipient1');
      return {
        id: friend.id,
        name: friend.get('name'),
        active: false,
      };
    });
  } catch (error) {
    console.error('Error getting friends:', error);
    throw error;
  }
},

async getMessages(senderId, receiverId) {
  try {
    const query = new Parse.Query(MESSAGE_CLASS);
    const senderPointer = new Parse.Object(RECIPIENT_CLASS);
    const receiverPointer = new Parse.Object(RECIPIENT_CLASS);
    
    senderPointer.id = senderId;
    receiverPointer.id = receiverId;
    
    const senderQuery = new Parse.Query(MESSAGE_CLASS);
    senderQuery.equalTo('sender', senderPointer);
    senderQuery.equalTo('receiver', receiverPointer);
    
    const receiverQuery = new Parse.Query(MESSAGE_CLASS);
    receiverQuery.equalTo('sender', receiverPointer);
    receiverQuery.equalTo('receiver', senderPointer);
    
    query._orQuery([senderQuery, receiverQuery]);
    query.ascending('createdAt');
    
    const results = await query.find();
    return results.map(message => ({
      id: message.id,
      text: message.get('text'),
      timestamp: message.get('timestamp'),
      isSelf: senderId === message.get('sender').id
    }));
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
},

  async addMessage(senderId, receiverId, messageData) {
    try {
      const Message = Parse.Object.extend(MESSAGE_CLASS);
      const message = new Message();
      
      // Create pointers to Recipients
      const senderPointer = new Parse.Object(RECIPIENT_CLASS);
      const receiverPointer = new Parse.Object(RECIPIENT_CLASS);
      senderPointer.id = senderId;
      receiverPointer.id = receiverId;
      
      // Set message data with recipient pointers
      message.set('sender', senderPointer);
      message.set('receiver', receiverPointer);
      message.set('text', messageData.text);
      message.set('timestamp', new Date().toLocaleTimeString());
      
      const savedMessage = await message.save();
      
      return {
        id: savedMessage.id,
        text: savedMessage.get('text'),
        timestamp: savedMessage.get('timestamp'),
        isSelf: senderId === savedMessage.get('sender').id,
      };
    } catch (error) {
      console.error('Error saving message:', error);
      throw error;
    }
  }
};