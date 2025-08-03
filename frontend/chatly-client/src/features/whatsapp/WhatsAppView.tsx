import React, { useState } from 'react';
import { Search, Phone, Video, MoreVertical, Send, Smile, Paperclip } from 'lucide-react';
import type { Channel, Account, Message } from '../../types';

interface WhatsAppViewProps {
  channel: Channel;
  accounts: Account[];
  selectedAccount: Account | null;
}

interface Contact {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  avatar: string;
  isOnline: boolean;
}

const WhatsAppView: React.FC<WhatsAppViewProps> = ({ channel, accounts, selectedAccount }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageText, setMessageText] = useState('');

  // Mock contacts for demonstration
  const mockContacts: Contact[] = [
    {
      id: '1',
      name: 'John Doe',
      lastMessage: 'Hey, how are you doing?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      unreadCount: 2,
      avatar: '/api/placeholder/40/40',
      isOnline: true
    },
    {
      id: '2',
      name: 'Jane Smith',
      lastMessage: 'Thanks for the update!',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      unreadCount: 0,
      avatar: '/api/placeholder/40/40',
      isOnline: false
    },
    {
      id: '3',
      name: 'Team Group',
      lastMessage: 'Meeting at 3 PM today',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      unreadCount: 5,
      avatar: '/api/placeholder/40/40',
      isOnline: false
    }
  ];

  // Mock messages for selected contact
  const mockMessages: Message[] = [
    {
      id: '1',
      sender: 'John Doe',
      content: 'Hey, how are you doing?',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      isRead: true,
      accountId: accounts[0]?.id || '1',
      type: 'received'
    },
    {
      id: '2',
      sender: 'You',
      content: 'I\'m doing great! How about you?',
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      isRead: true,
      accountId: accounts[0]?.id || '1',
      type: 'sent'
    },
    {
      id: '3',
      sender: 'John Doe',
      content: 'All good here. Are we still on for the meeting tomorrow?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isRead: true,
      accountId: accounts[0]?.id || '1',
      type: 'received'
    }
  ];

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else {
      return `${days}d`;
    }
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Handle send message logic here
      console.log('Sending message:', messageText);
      setMessageText('');
    }
  };

  return (
    <div className="flex-1 flex bg-white">
      {/* Contacts Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-green-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img  className="w-12 h-12 text-xl" src={channel.icon}/>
              <div>
                <h1 className="text-lg font-semibold">{channel.name}</h1>
                <p className="text-sm text-green-100">
                  {selectedAccount ? selectedAccount.email : `${accounts.length} connected account(s)`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-300 rounded-full"></div>
              <span className="text-sm">Connected</span>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-300" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-green-500 text-white placeholder-green-200 rounded-lg focus:outline-none focus:bg-green-400"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`
                w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100
                ${selectedContact?.id === contact.id ? 'bg-green-50' : ''}
              `}
            >
              <div className="relative">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {contact.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{contact.name}</h3>
                  <span className="text-xs text-gray-500">{formatTime(contact.timestamp)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
                  {contact.unreadCount > 0 && (
                    <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {contact.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={selectedContact.avatar}
                      alt={selectedContact.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {selectedContact.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedContact.name}</h2>
                    <p className="text-sm text-gray-500">
                      {selectedContact.isOnline ? 'Online' : 'Last seen recently'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <Video className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <div className="space-y-4">
                {mockMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`
                        max-w-xs lg:max-w-md px-4 py-2 rounded-lg
                        ${message.type === 'sent'
                          ? 'bg-green-500 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                        }
                      `}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${message.type === 'sent' ? 'text-green-100' : 'text-gray-500'}`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors">
                    <Smile className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                💬
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Select a Contact</h2>
              <p className="text-gray-600">Choose a contact from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppView;