import React, { useState } from 'react';
import { useChatStore } from '@/hooks/use-chat-store';
import PhoneModelSelector, { PhoneModel } from './PhoneModelSelector';
import AndroidChatPreview from './AndroidChatPreview';
import ChatPreview from './ChatPreview';
import SamsungChatPreview from './SamsungChatPreview';
import PixelChatPreview from './PixelChatPreview';

const MultiPhoneChatPreview: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<PhoneModel>('iphone');
  
  const { 
    isDarkMode, 
    messages,
    contactName,
    profilePic,
    statusTime,
    batteryLevel
  } = useChatStore();

  // Props comuns para os componentes de prévia
  const previewProps = {
    isDarkMode,
    messages,
    contactName,
    profilePic,
    statusTime,
    batteryLevel
  };

  // Renderiza o componente de prévia baseado no modelo selecionado
  const renderPhonePreview = () => {
    switch (selectedModel) {
      case 'android':
        return <AndroidChatPreview {...previewProps} />;
      case 'iphone':
        return <ChatPreview {...previewProps} />;
      case 'samsung':
        return <SamsungChatPreview {...previewProps} />;
      case 'pixel':
        return <PixelChatPreview {...previewProps} />;
      default:
        return <ChatPreview {...previewProps} />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4 text-center sm:text-left">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        Prévia da Conversa
      </h2>
      
      <PhoneModelSelector 
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
      />
      
      <div className="flex justify-center">
        {renderPhonePreview()}
      </div>
    </div>
  );
};

export default MultiPhoneChatPreview;