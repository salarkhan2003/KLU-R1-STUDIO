
import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  isDestructive?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, children, confirmText = "Confirm", isDestructive = false }) => {
  if (!isOpen) return null;

  const confirmButtonClass = isDestructive 
    ? "bg-spacex-red/80 hover:bg-spacex-red text-white border-red-500" 
    : "bg-spacex-blue/80 hover:bg-spacex-blue text-white border-blue-400";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 font-sans">
      <div className="bg-spacex-card border border-spacex-border rounded-md shadow-xl p-6 w-full max-w-md m-4">
        <h2 className="text-2xl font-medium text-gray-200 mb-4 uppercase">{title}</h2>
        <div className="mb-6 text-gray-400">{children}</div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700 text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md font-medium transition-colors border ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};