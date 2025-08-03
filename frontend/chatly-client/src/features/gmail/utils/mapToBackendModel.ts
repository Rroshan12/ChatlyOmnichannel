import type { Message } from "../../../types";

export const mapBackendEmailToMessage = (email: any, accountId: string): Message => {
  // Helper to get header value by name (case-insensitive)
  const getHeader = (name: string) => {
    const header = email.payload.headers.find(
      (h: any) => h.name.toLowerCase() === name.toLowerCase()
    );
    return header ? header.value : '';
  };

  return {
    id: email.id,
    sender: getHeader('From') || 'Unknown Sender',
    subject: getHeader('Subject') || '(No Subject)',
    content: email.snippet || '',
    timestamp: new Date(parseInt(email.internalDate)),
    isRead: !email.labelIds.includes('UNREAD'), // true if no UNREAD label
    accountId: accountId,
    type: email.labelIds.includes('INBOX') ? 'received' : 'sent',
  };
};