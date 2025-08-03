import React from 'react';
import WhatsAppView from './whatsapp/WhatsAppView';
import type { Channel, Account } from '../types';
import ConnectModal from './ConnectModel';
import GmailView from './gmail/GmailView';

interface MainContentProps {
  selectedChannel: Channel | null;
  selectedAccount: Account | null;
  accounts: Account[];
  channels: Channel[];
  activeTab: 'channels' | 'accounts';
  isConnectModalOpen: boolean;
  channelToConnect: Channel | null;
  onCloseModal: () => void;
  onConnectAccount: (channelId: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  selectedChannel,
  selectedAccount,
  accounts,
  channels,
  activeTab,
  isConnectModalOpen,
  channelToConnect,
  onCloseModal,
  onConnectAccount
}) => {
  const renderChannelView = () => {
    // If an account is selected, we should show the view even if channel appears disconnected
    const hasConnectedAccounts = selectedAccount || accounts.some(account => account.channelId === selectedChannel?.id);
    
    if (!selectedChannel || (!selectedChannel.isConnected && !hasConnectedAccounts)) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
      
            <img src={selectedChannel?.icon} className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"/>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {selectedChannel ? 'Channel Not Connected' : 'Select a Channel'}
            </h2>
            <p className="text-gray-600 max-w-md">
              {selectedChannel 
                ? 'Connect this channel to start viewing messages.'
                : 'Choose a channel from the sidebar to view messages.'
              }
            </p>
          </div>
        </div>
      );
    }

    // If an account is selected, filter to just that account, otherwise show all accounts for the channel
    const channelAccounts = selectedAccount 
      ? [selectedAccount]
      : accounts.filter(a => a.channelId === selectedChannel.id);

    switch (selectedChannel.type) {
      case 'gmail':
        return <GmailView channel={selectedChannel} accounts={channelAccounts} selectedAccount={selectedAccount} />;
      case 'whatsapp':
        return <WhatsAppView channel={selectedChannel} accounts={channelAccounts} selectedAccount={selectedAccount} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {renderChannelView()}

      <ConnectModal
        isOpen={isConnectModalOpen}
        channel={channelToConnect}
        onClose={onCloseModal}
        onConnect={onConnectAccount}
      />
    </div>
  );
};

export default MainContent;