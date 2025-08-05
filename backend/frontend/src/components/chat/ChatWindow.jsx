import React from 'react';
import { Container } from 'react-bootstrap';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import '../../assets/styles/custom.css';

const ChatWindow = ({ messages, currentUserId, onSendMessage, chatActive }) => {
  return (
    <div className="d-flex flex-column" style={{ height: '500px' }}>
      <div className="flex-grow-1 overflow-hidden">
        <MessageList messages={messages} currentUserId={currentUserId} />
      </div>
      
      {chatActive && (
        <div className="border-top p-3">
          <MessageInput onSendMessage={onSendMessage} />
        </div>
      )}
    </div>
  );
};

export default ChatWindow;