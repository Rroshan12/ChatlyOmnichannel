import { create } from 'zustand';
import type { Account, Channel } from '../../types';

interface AppState {
  isSidebarCollapsed: boolean;
  activeTab: 'channels' | 'accounts';
  selectedChannel: Channel | null;
  selectedAccount: Account | null;
  accounts: Account[];
  channels: Channel[];
  isConnectModalOpen: boolean;
  channelToConnect: Channel | null;

  setIsSidebarCollapsed: (collapsed: boolean) => void;
  setActiveTab: (tab: 'channels' | 'accounts') => void;
  setSelectedChannel: (channel: Channel | null) => void;
  setSelectedAccount: (account: Account | null) => void;
  setAccounts: (accounts: Account[]) => void;
  setIsConnectModalOpen: (open: boolean) => void;
  setChannelToConnect: (channel: Channel | null) => void;
  connectAccount: (channelId: string) => void;
}

export const defaultChannels: Channel[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    type: 'whatsapp',
    icon: 'https://cdn-icons-png.flaticon.com/128/4423/4423697.png',
    isConnected: false,
    description: 'Connect your WhatsApp Business account',
  },
  {
    id: 'gmail',
    name: 'Gmail',
    type: 'gmail',
    icon: 'https://cdn-icons-png.flaticon.com/128/5968/5968534.png',
    isConnected: false,
    description: 'Connect your Gmail account',
  },
];

export const useAppStore = create<AppState>((set, get) => ({
  isSidebarCollapsed: false,
  activeTab: 'channels',
  selectedChannel: defaultChannels[0],
  selectedAccount: null,
  accounts: [],
  channels: defaultChannels,
  isConnectModalOpen: false,
  channelToConnect: null,

  setIsSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedChannel: (channel) => set({ selectedChannel: channel }),
  setSelectedAccount: (account) => set({ selectedAccount: account }),
  setAccounts: (accounts) => set({ accounts }),
  setIsConnectModalOpen: (open) => set({ isConnectModalOpen: open }),
  setChannelToConnect: (channel) => set({ channelToConnect: channel }),

  connectAccount: (channelId: string) => {
    const { channels, accounts } = get();
    const channel = channels.find((c) => c.id === channelId);
    if (!channel) return;

    const newAccount: Account = {
      id: Date.now().toString(),
      email: channel.type === 'gmail' ? 'user@gmail.com' : '+1234567890',
      channelId,
      channelType: channel.type,
      isConnected: true,
      avatar: '/api/placeholder/32/32',
    };

    set({
      accounts: [...accounts, newAccount],
      isConnectModalOpen: false,
      channelToConnect: null,
    });
  },
}));
