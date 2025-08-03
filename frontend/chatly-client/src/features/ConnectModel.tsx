import React from 'react';
import { X, Link } from 'lucide-react';
import type { Channel } from '../types';
import { fetchGoogleConnectUrl } from './gmail/api';

interface ConnectModalProps {
  isOpen: boolean;
  channel: Channel | null;
  onClose: () => void;
  onConnect: (channelId: string) => void;
}

const ConnectModal: React.FC<ConnectModalProps> = ({
  isOpen,
  channel,
  onClose,
  onConnect
}) => {
  if (!isOpen || !channel) return null;



  const mapChannelToFunction:any = {
    "gmail": fetchGoogleConnectUrl
  }

const handleConnect = async () => {
  try {
    const data = await mapChannelToFunction[channel?.id]?.();

    if (data?.url) {
      window.location.href = data.url;
    } else {
      console.warn('No redirect URL found in response:', data);
    }
  } catch (error) {
    console.error('Connection failed:', error);
  }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Connect Channel</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 text-center">
           <img src={channel?.icon} className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"/>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{channel.name}</h3>
          <p className="text-gray-600 mb-6">{channel.description}</p>

          <div className="space-y-3">
            <button
              onClick={handleConnect}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Link className="w-5 h-5" />
              <span>Connect {channel.name}</span>
            </button>
            
            <button
              onClick={onClose}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            You'll be redirected to {channel.name} to authorize the connection
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConnectModal;