import Sidebar from './features/SideBar';
import MainContent from './features/MainContent';
import { useAppStore } from './store/Home/useAppStore';


function Home() {
  const {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    activeTab,
    setActiveTab,
    selectedChannel,
    setSelectedChannel,
    selectedAccount,
    setSelectedAccount,
    accounts,
    setIsConnectModalOpen,
    isConnectModalOpen,
    channelToConnect,
    setChannelToConnect,
    channels,
    connectAccount,
  } = useAppStore();

  const channelsWithConnectionStatus = channels.map((channel) => ({
    ...channel,
    isConnected: accounts.some((account) => account.channelId === channel.id),
  }));

  const handleChannelConnect = (channel: typeof selectedChannel) => {
    setChannelToConnect(channel);
    setIsConnectModalOpen(true);
  };

  const handleAccountSelect = (account: typeof selectedAccount) => {
    setSelectedAccount(account);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onCollapse={setIsSidebarCollapsed}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        channels={channelsWithConnectionStatus}
        accounts={accounts}
        selectedChannel={selectedChannel}
        onChannelSelect={setSelectedChannel}
        onChannelConnect={handleChannelConnect}
        onAccountSelect={handleAccountSelect}
      />

      <MainContent
        selectedChannel={selectedChannel}
        selectedAccount={selectedAccount}
        accounts={accounts}
        activeTab={activeTab}
        channels={channelsWithConnectionStatus}
        isConnectModalOpen={isConnectModalOpen}
        channelToConnect={channelToConnect}
        onCloseModal={() => setIsConnectModalOpen(false)}
        onConnectAccount={connectAccount}
      />
    </div>
  );
}

export default Home;
