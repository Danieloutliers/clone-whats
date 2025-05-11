import React, { useState, useEffect } from 'react';
import MultiPhoneChatPreview from './MultiPhoneChatPreview';
import ChatSettings from './ChatSettings';
import MessageManagement from './MessageManagement';
import AIConversationGenerator from './AIConversationGenerator';
import { useChatStore } from '@/hooks/use-chat-store';

const WhatsAppGenerator: React.FC = () => {
  const { 
    isDarkMode, 
    setIsDarkMode
  } = useChatStore();

  useEffect(() => {
    // Apply dark mode to html element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="flex flex-col md:flex-col lg:flex-row gap-4 sm:gap-6">
      {/* Top/Left column - Phone preview with model selection */}
      <div className="w-full lg:w-1/2 mx-auto" style={{maxWidth: '450px'}}>
        <MultiPhoneChatPreview />
      </div>
      
      {/* Bottom/Right column - Generator options */}
      <div className="w-full lg:w-1/2">
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <ChatSettings />
          <AIConversationGenerator />
          <MessageManagement />
        </div>
      </div>
    </div>
  );
};

export default WhatsAppGenerator;
