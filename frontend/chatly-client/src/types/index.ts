export interface Channel {
  id: string;
  name: string;
  type: 'whatsapp' | 'gmail';
  icon: string;
  isConnected: boolean;
  description: string;
}

export interface Account {
  id: string;
  email: string;
  channelId: string | undefined;
  channelType: 'whatsapp' | 'gmail';
  isConnected: boolean;
  avatar: string;
}


export interface Message {
  id: string;
  sender: string;
  subject?: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  accountId: string;
  type: 'sent' | 'received';
}

export interface GmailFolder {
  id: string;
  name: string;
  count: number;
  icon: string;
}