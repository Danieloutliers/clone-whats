import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/types';
import { captureScreenshot } from '@/lib/html2canvas';
import bgImage from '@/assets/Whatsapp_background_image.webp';

interface AndroidChatPreviewProps {
  isDarkMode: boolean;
  messages: Message[];
  contactName: string;
  profilePic: string;
  statusTime: string;
  batteryLevel: number;
}

const AndroidChatPreview: React.FC<AndroidChatPreviewProps> = ({
  isDarkMode,
  messages,
  contactName,
  profilePic,
  statusTime,
  batteryLevel
}) => {
  const chatRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Mensagens de exemplo caso não haja mensagens
  const displayMessages = messages.length > 0 ? messages : [
    {
      id: '1',
      text: 'Olá, tudo bem?',
      type: 'received',
      time: '14:22'
    },
    {
      id: '2',
      text: 'Tudo ótimo! E com você?',
      type: 'sent',
      time: '14:23'
    }
  ];

  const handleDownload = async () => {
    if (!chatRef.current) return;

    try {
      const bgColor = isDarkMode ? '#121B22' : '#E5DDD5';
      const dataUrl = await captureScreenshot(chatRef.current, bgColor);
      
      if (dataUrl) {
        const link = document.createElement('a');
        link.download = `whatsapp-chat-android-${new Date().getTime()}.png`;
        link.href = dataUrl;
        link.click();
        
        toast({
          title: "Imagem salva com sucesso!",
          description: "A imagem da conversa foi baixada em alta resolução.",
        });
      } else {
        throw new Error('Failed to generate image URL');
      }
    } catch (error) {
      console.error('Failed to capture screenshot', error);
      toast({
        title: "Erro ao salvar a imagem",
        description: "Não foi possível gerar a imagem da conversa.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div>
      {/* Android frame */}
      <div 
        ref={chatRef}
        className="max-w-sm mx-auto overflow-hidden rounded-3xl shadow-2xl h-[700px] flex flex-col border-[5px] border-black"
        style={{ 
          backgroundColor: isDarkMode ? '#121B22' : '#e5ddd5'
        }}
      >
        {/* Status bar - Android style */}
        <div className="bg-green-700 text-white px-4 py-1.5 text-xs flex justify-between items-center">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            WhatsApp
          </div>
          <div className="flex space-x-2 items-center">
            <span className="text-xs">{statusTime}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 20h.01"></path>
              <path d="M7 20v-4"></path>
              <path d="M12 20v-8"></path>
              <path d="M17 20v-12"></path>
            </svg>
            <div className="flex items-center gap-1">
              <span>{batteryLevel}%</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="18" height="10" rx="2" ry="2"></rect>
                <line x1="22" y1="11" x2="22" y2="13"></line>
              </svg>
            </div>
          </div>
        </div>
        
        {/* WhatsApp header - Android style */}
        <div className="bg-green-700 flex items-center px-4 py-3">
          <button className="text-white mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"></path>
            </svg>
          </button>
          
          <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden mr-3">
            <img 
              src={profilePic || 'https://via.placeholder.com/100'} 
              alt="Foto de perfil" 
              className="h-full w-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <h3 className="text-white font-medium text-base">
              {contactName}
            </h3>
            <div className="text-white text-xs opacity-80">
              Online
            </div>
          </div>
          
          <div className="flex space-x-5 text-white">
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </button>
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Chat area - Android style */}
        <div 
          className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-2 whatsapp-chat-background"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'repeat',
            backgroundAttachment: 'local'
          }}
        >
          {/* Date bubble - Android style */}
          <div className="flex justify-center mb-3">
            <div className="bg-gray-200 dark:bg-gray-700 px-3 py-1 text-xs text-gray-600 dark:text-gray-300 rounded-lg">
              HOJE
            </div>
          </div>
          
          {displayMessages.map((message, index) => (
            <div 
              key={message.id || index} 
              className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`rounded-lg p-2 max-w-[75%] relative ${
                  message.type === 'sent' 
                    ? 'bg-[#E1FFC7] text-black' 
                    : 'bg-white text-black'
                }`}
              >
                <p className="text-sm leading-relaxed">
                  {message.text}
                </p>
                <div className="flex justify-end items-center gap-1 mt-1">
                  <p className="text-[10px] text-gray-500">{message.time}</p>
                  {message.type === 'sent' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4FC3F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 12 5 5L20 7"></path>
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Input area - Android style */}
        <div className="bg-gray-200 dark:bg-gray-800 flex items-center p-2">
          <div className="flex items-center gap-2 w-full">
            <button className="text-gray-600 dark:text-gray-400 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
            </button>
            <div className="flex-1 bg-white dark:bg-gray-700 rounded-full px-4 py-2">
              <input type="text" className="w-full text-sm outline-none bg-transparent" placeholder="Mensagem" disabled />
            </div>
            <button className="text-white bg-green-600 rounded-full p-2 ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="22"></line>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Android navigation buttons */}
        <div className="bg-black flex justify-center items-center py-2 space-x-8">
          <div className="w-5 h-5 border-2 border-white rounded-sm"></div>
          <div className="w-5 h-5 bg-white rounded-full"></div>
          <div className="w-5 h-5 border-2 border-white rotate-45"></div>
        </div>
      </div>
      
      {/* Download button */}
      <div className="mt-6 flex justify-center">
        <Button 
          onClick={handleDownload}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full flex items-center shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Baixar Imagem
        </Button>
      </div>
    </div>
  );
};

export default AndroidChatPreview;