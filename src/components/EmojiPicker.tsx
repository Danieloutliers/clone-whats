import React from 'react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

const emojis = [
  '😀', '😂', '😍', '🤔', '😊', '👍', '❤️', '🎉',
  '👋', '🙏', '🔥', '😒', '😭', '😎', '🤗', '😴',
  '👌', '🙌', '👏', '🤝', '✌️', '🤞', '🙂', '😉',
  '😋', '😘', '🥰', '😇', '🤑', '🤯', '🥳', '😡',
  '😱', '😳', '🤪', '😢', '😥', '😏', '🙄', '😬'
];

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Escolher Emoji</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="grid grid-cols-8 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar">
          {emojis.map((emoji, index) => (
            <button 
              key={index}
              onClick={() => onEmojiSelect(emoji)}
              className="p-2 text-xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmojiPicker;
