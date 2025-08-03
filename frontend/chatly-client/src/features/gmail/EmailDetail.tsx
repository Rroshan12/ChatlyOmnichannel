import React, { useState } from 'react';
import { ArrowLeft, Reply, ReplyAll, Forward, Archive, Trash2, Star, MoreHorizontal, Download, Printer as Print, User } from 'lucide-react';
import type { Message, Account } from '../../types';

interface EmailDetailProps {
  message: Message;
  accounts: Account[];
  onBack: () => void;
  onReply: (message: Message) => void;
  onReplyAll: (message: Message) => void;
  onForward: (message: Message) => void;
}

const EmailDetail: React.FC<EmailDetailProps> = ({
  message,
  accounts,
  onBack,
  onReply,
  onReplyAll,
  onForward
}) => {
  const [isStarred, setIsStarred] = useState(false);

  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const extractEmailParts = (sender: string) => {
    const match = sender.match(/^(.+?)\s*<(.+)>$/);
    if (match) {
      return { name: match[1].trim(), email: match[2].trim() };
    }
    return { name: sender, email: sender };
  };

  const senderInfo = extractEmailParts(message.sender);

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 truncate max-w-md">
                {message.subject}
              </h1>
              <p className="text-sm text-gray-500">
                {formatFullDate(message.timestamp)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsStarred(!isStarred)}
              className={`p-2 rounded-lg transition-colors ${
                isStarred ? 'text-yellow-500 bg-yellow-50' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Star className={`w-5 h-5 ${isStarred ? 'fill-current' : ''}`} />
            </button>
            <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <Archive className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <Trash2 className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <Print className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          {/* Sender Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {senderInfo.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{senderInfo.name}</h3>
                    <p className="text-sm text-gray-600">{senderInfo.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {formatFullDate(message.timestamp)}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">to me</span>
                      <button className="text-xs text-blue-600 hover:text-blue-700">
                        show details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Email Body */}
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
              {message.content}
              
              {/* Extended content for demo */}
              <div className="mt-6">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                  nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                
                <p className="mt-4">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                  eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt 
                  in culpa qui officia deserunt mollit anim id est laborum.
                </p>

                <p className="mt-4">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
                  doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore 
                  veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>

                <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                  <p className="text-blue-800 font-medium">Important Note:</p>
                  <p className="text-blue-700 mt-1">
                    Please review the attached documents and provide feedback by end of week.
                  </p>
                </div>

                <p className="mt-6">
                  Best regards,<br />
                  {senderInfo.name}
                </p>
              </div>
            </div>
          </div>

          {/* Attachments (if any) */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Attachments (2)
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                    <span className="text-xs font-medium text-red-600">PDF</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Project_Report.pdf</p>
                    <p className="text-sm text-gray-500">2.4 MB</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                    <span className="text-xs font-medium text-green-600">XLS</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Budget_Analysis.xlsx</p>
                    <p className="text-sm text-gray-500">1.8 MB</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => onReply(message)}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Reply className="w-4 h-4" />
            <span>Reply</span>
          </button>
          <button
            onClick={() => onReplyAll(message)}
            className="flex items-center space-x-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ReplyAll className="w-4 h-4" />
            <span>Reply All</span>
          </button>
          <button
            onClick={() => onForward(message)}
            className="flex items-center space-x-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Forward className="w-4 h-4" />
            <span>Forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailDetail;