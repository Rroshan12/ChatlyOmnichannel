import React, { useEffect, useState } from 'react';
import { Search, Filter, Mail, Clock, User, Star, Archive, Trash2, Reply, Forward, MoreHorizontal } from 'lucide-react';
import type { Channel, Account, Message, GmailFolder } from '../../types';
import ComposeModal from './ComposeModal';
import EmailDetail from './EmailDetail';
import { fetchGoogleAccountInbox } from './api';
import { useQuery } from '@tanstack/react-query';
import { mapBackendEmailToMessage } from './utils/mapToBackendModel';

interface GmailViewProps {
  channel: Channel;
  accounts: Account[];
  selectedAccount: Account | null;
}

const GmailView: React.FC<GmailViewProps> = ({ channel, accounts, selectedAccount }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccountFilter, setSelectedAccountFilter] = useState<string>('all');
  const [selectedFolder, setSelectedFolder] = useState<string>('inbox');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedMessageForDetail, setSelectedMessageForDetail] = useState<Message | null>(null);
  const [debouncedUserId, setDebouncedUserId] = useState<string | undefined>(undefined);

  // Step 2: Debounce effect on userId changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedUserId(accounts[0]?.userId);
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [accounts]);

  // Step 3: useQuery uses debouncedUserId
  const { data: gmailDataInbox, isLoading, error } = useQuery({
    queryKey: ['googleAccountInbox', debouncedUserId],
    queryFn: () => fetchGoogleAccountInbox(debouncedUserId!),
    enabled: !!debouncedUserId, // only run if userId is defined
  });

console.log( gmailDataInbox,'fff');

 

  // Mock messages for demonstration
  const mockMessages: Message[] =gmailDataInbox?.map((item:any)=> mapBackendEmailToMessage(item, accounts?.id));


  console.log(mockMessages);

   const folders: GmailFolder[] = [
    { id: 'inbox', name: 'Inbox', count: mockMessages?.filter((item)=>item?.type==='received')?.length, icon: '📥' },
    { id: 'sent', name: 'Sent',icon: '📤' },
    { id: 'drafts', name: 'Drafts',icon: '📝' },
    { id: 'spam', name: 'Spam',  icon: '🚫' },
    { id: 'trash', name: 'Trash', icon: '🗑️' },
    { id: 'starred', name: 'Starred',icon: '⭐' }
  ];
  const filteredMessages = mockMessages?.filter(message => {
    const matchesSearch = message?.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message?.sender.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAccount = selectedAccountFilter === 'all' || message.accountId === selectedAccountFilter;
    return matchesSearch && matchesAccount;
  });

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const handleReply = (message: Message) => {
    // Handle reply logic - could open compose modal with reply data
    console.log('Reply to:', message);
    setIsComposeOpen(true);
  };

  const handleReplyAll = (message: Message) => {
    // Handle reply all logic
    console.log('Reply all to:', message);
    setIsComposeOpen(true);
  };

  const handleForward = (message: Message) => {
    // Handle forward logic
    console.log('Forward:', message);
    setIsComposeOpen(true);
  };

  // If a message is selected for detail view, show the detail component
  if (selectedMessageForDetail) {
    return (
      <EmailDetail
        message={selectedMessageForDetail}
        accounts={accounts}
        onBack={() => setSelectedMessageForDetail(null)}
        onReply={handleReply}
        onReplyAll={handleReplyAll}
        onForward={handleForward}
      />
    );
  }

  return (
    <div className="flex-1 flex bg-white">
      {/* Gmail Sidebar */}
      <div className="w-64 border-r border-gray-200 flex flex-col">
        <div className="p-4">
          <button
            onClick={() => setIsComposeOpen(true)}
            className="w-full flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Compose</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-2">
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors mb-1
                  ${selectedFolder === folder.id 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'hover:bg-gray-50 text-gray-700'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-sm">{folder.icon}</span>
                  <span className="font-medium">{folder.name}</span>
                </div>
                {
                  folder.count &&   <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                  {folder.count }
                </span>
                }
              
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
                   <img  className="w-12 h-12 text-xl" src={channel.icon}/>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{channel.name}</h1>
                <p className="text-sm text-gray-500">{accounts.length} connected account(s)</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600">Connected</span>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedAccountFilter}
              onChange={(e) => setSelectedAccountFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Accounts</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>{account.email}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto">
          {filteredMessages?.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No emails found</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredMessages?.map((message) => (
                <div
                  key={message.id}
                  onClick={() => setSelectedMessageForDetail(message)}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !message.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <span className={`font-medium ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {message.sender}
                        </span>
                        {!message.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <h3 className={`text-base mb-1 ${!message.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-800'}`}>
                        {message.subject}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {message.content}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3 ml-4">
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <Star className="w-4 h-4 text-gray-400" />
                      </button>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(message.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        accounts={accounts}
      />
    </div>
  );
};

export default GmailView;