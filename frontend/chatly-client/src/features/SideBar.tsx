import React from 'react';
import { 
  MessageSquare, 
  Users, 
  Search, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Mail,
  Link
} from 'lucide-react';
import type { Channel, Account } from '../types';
import { fetchGoogleAccountSessions } from './gmail/api';
import { useQuery } from '@tanstack/react-query';
import { getInitialsWithEllipsis } from '../utils/helper';

interface SidebarProps {
  isCollapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  activeTab: 'channels' | 'accounts';
  onTabChange: (tab: 'channels' | 'accounts') => void;
  channels: Channel[];
  accounts: Account[];
  selectedChannel: Channel | null;
  onChannelSelect: (channel: Channel | null) => void;
  onChannelConnect: (channel: Channel) => void;
  onAccountSelect: (account: Account) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onCollapse,
  activeTab,
  onTabChange,
  channels,
  accounts,
  selectedChannel,
  onChannelSelect,
  onChannelConnect,
  onAccountSelect
}) => {
  return (
    <div className={`
      bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-16' : 'w-80'}
    `}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <img style={{width:'20px', height:'20px'}} src="https://image.crisp.chat/avatar/website/7cc44f6d-29de-4a1a-9ac6-2211adbba7e9/120/?1751957050179&quot"/>
            <h1 className="text-xl font-bold text-gray-900">Krispcall OmniChannel</h1>
          </div>
        )}
        <button
          onClick={() => onCollapse(!isCollapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onTabChange('channels')}
            className={`
              flex items-center justify-center space-x-2 px-3 py-2 rounded-md transition-all text-sm font-medium
              ${activeTab === 'channels' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
              }
              ${isCollapsed ? 'w-full' : 'flex-1'}
            `}
          >
            <MessageSquare className="w-4 h-4" />
            {!isCollapsed && <span>Channels</span>}
          </button>
          <button
            onClick={() => onTabChange('accounts')}
            className={`
              flex items-center justify-center space-x-2 px-3 py-2 rounded-md transition-all text-sm font-medium
              ${activeTab === 'accounts' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
              }
              ${isCollapsed ? 'w-full' : 'flex-1'}
            `}
          >
            <Users className="w-4 h-4" />
            {!isCollapsed && <span>Accounts</span>}
          </button>
        </div>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'channels' ? (
          <ChannelsList
            channels={channels}
            selectedChannel={selectedChannel}
            onChannelSelect={onChannelSelect}
            onChannelConnect={onChannelConnect}
            isCollapsed={isCollapsed}
          />
        ) : (
          <AccountsList
            isCollapsed={isCollapsed}
            onAccountSelect={onAccountSelect}
             selectedChannel={selectedChannel}
          />
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
          <Settings className="w-4 h-4" />
          {!isCollapsed && <span>Settings</span>}
        </button>
      </div>
    </div>
  );
};

const ChannelsList: React.FC<{
  channels: Channel[];
  selectedChannel: Channel | null;
  onChannelSelect: (channel: Channel | null) => void;
  onChannelConnect: (channel: Channel) => void;
  isCollapsed: boolean;
}> = ({ channels, selectedChannel, onChannelSelect, onChannelConnect, isCollapsed }) => {
  return (
    <div className="p-4 space-y-2">
      {channels.map((channel) => (
        <div key={channel.id} className="space-y-2">
          <button
            onClick={() => onChannelSelect(channel)}
            className={`
              w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors
              ${selectedChannel?.id === channel.id 
                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                : 'hover:bg-gray-50 text-gray-700'
              }
            `}
          >
            <img className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl" src={channel.icon}/>
            {!isCollapsed && (
              <div className="flex-1 text-left">
                <div className="font-medium">{channel.name}</div>
                <div className="text-xs text-gray-500">
                  {channel.isConnected ? 'Connected' : 'Not connected'}
                </div>
              </div>
            )}
                      
            <button
              onClick={() => onChannelConnect(channel)}
              className="text-xs text-white bg-green-500 flex p-1 cursor-pointer rounded-sm"
            >
              <span>Connect</span>
            </button>
            {!isCollapsed && (
              <div className="flex items-center space-x-1">
                {channel.isConnected && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </div>
            )}
          </button>

        </div>
      ))}
    </div>
  );
};

const AccountsList: React.FC<{
  isCollapsed: boolean;
  selectedChannel:Channel | null;
  onAccountSelect: (account: Account) => void;
}> = ({ selectedChannel,isCollapsed, onAccountSelect }) => {


     const { data: gmailData, isLoading, error } = useQuery({
    queryKey: ['googleAccountSessions'],
    queryFn: fetchGoogleAccountSessions,
  })

  var mapSessionData = {
'gmail': gmailData
  };


  return (
    <div className="p-4 space-y-2">
      {(mapSessionData[selectedChannel?.id] || [])?.sessions?.map((account:any) => {
        return (
          <button
            key={account.id}
            onClick={() => onAccountSelect(account)}
            className="w-full flex items-center space-x-3 px-3 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
             <img src={selectedChannel?.icon} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"/>
          
            {!isCollapsed && (
              <div className="flex-1">
                <div className="font-medium text-gray-900">{selectedChannel?.name }</div>
                <div className="text-sm text-gray-500">{getInitialsWithEllipsis(account.email,14)}</div>
              </div>
            )}
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600">Connected</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Sidebar;