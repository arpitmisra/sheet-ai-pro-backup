'use client';

import { useState } from 'react';
import { X, Link as LinkIcon, Check, Copy, Users, Shield } from 'lucide-react';

export default function ShareModal({ isOpen, onClose, sheetId, sheetTitle }) {
  const [copied, setCopied] = useState(false);

  const shareLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/sheets/${sheetId}` 
    : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 rounded-lg shadow-lg">
                <LinkIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Share Spreadsheet</h2>
                <p className="text-sm text-gray-600 mt-0.5">{sheetTitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Share Link Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Shareable Link
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Anyone with this link can view and edit this spreadsheet in real-time
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white px-4 py-3 rounded-lg border border-gray-300 shadow-sm">
                  <p className="font-mono text-sm text-gray-700 break-all">
                    {shareLink}
                  </p>
                </div>
                <button
                  onClick={handleCopyLink}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 ${
                    copied
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">
                      Real-time Collaboration
                    </h4>
                    <p className="text-xs text-blue-700">
                      See changes as they happen and chat with your team
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-purple-900 mb-1">
                      Full Access
                    </h4>
                    <p className="text-xs text-purple-700">
                      Everyone with the link can edit cells and formulas
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                💡 Quick Tips
              </h4>
              <ul className="space-y-1.5 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Share this link via email, Slack, or any messaging app</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>All collaborators will see each other's changes instantly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Use the chat feature to communicate with your team</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
