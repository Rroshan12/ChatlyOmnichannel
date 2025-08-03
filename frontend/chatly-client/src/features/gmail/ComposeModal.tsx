import React, { useState } from 'react';
import { X, Send, Paperclip, Image, Smile } from 'lucide-react';
import type { Account } from '../../types';

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
}

const ComposeModal: React.FC<ComposeModalProps> = ({
  isOpen,
  onClose,
  accounts
}) => {
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.id || '');
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  const handleSend = () => {
    // Handle send logic here
    console.log('Sending email:', { to, cc, bcc, subject, body, selectedAccount });
    onClose();
    // Reset form
    setTo('');
    setCc('');
    setBcc('');
    setSubject('');
    setBody('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">New Message</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* From Account */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 w-12">From:</label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>{account.email}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Recipients */}
          <div className="p-4 space-y-3 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 w-12">To:</label>
              <input
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Recipients"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowCc(!showCc)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Cc
                </button>
                <button
                  onClick={() => setShowBcc(!showBcc)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Bcc
                </button>
              </div>
            </div>

            {showCc && (
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 w-12">Cc:</label>
                <input
                  type="email"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  placeholder="Carbon copy"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {showBcc && (
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 w-12">Bcc:</label>
                <input
                  type="email"
                  value={bcc}
                  onChange={(e) => setBcc(e.target.value)}
                  placeholder="Blind carbon copy"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 w-12">Subject:</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Message Body */}
          <div className="flex-1 p-4">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Compose your message..."
              className="w-full h-full min-h-[200px] resize-none border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Toolbar */}
          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Paperclip className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Image className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Smile className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposeModal;