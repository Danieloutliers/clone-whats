import React, { useRef, useState } from 'react';
import { captureScreenshot } from '@/lib/html2canvas';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/types';
import { formatLongDate } from '@/lib/utils';
import bgImage from '@/assets/Whatsapp_background_image.webp';

interface ChatPreviewProps {
  isDarkMode: boolean;
  messages: Message[];
  contactName: string;
  profilePic: string;
  statusTime: string;
  batteryLevel: number;
}

const ChatPreview: React.FC<ChatPreviewProps> = ({
  isDarkMode,
  messages,
  contactName,
  profilePic,
  statusTime,
  batteryLevel
}) => {
  const chatRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [customDate] = useState("Wed, 26 Nov"); // Data fixa conforme exemplo

  // Mensagens de exemplo que imitam a imagem do referência
  const defaultMessages: Message[] = [
    {
      id: '1',
      text: 'Oi, amor',
      type: 'sent',
      time: '08:42 am'
    },
    {
      id: '2',
      text: 'Falar vida',
      type: 'received',
      time: '08:42 am'
    },
    {
      id: '3',
      text: 'Acabe de ver um desafio de Casal no Tiktok pra junta 10.000 mil em 1 ano vamos fazer em 2025? amor',
      type: 'sent',
      time: '08:42 am'
    },
    {
      id: '4',
      text: 'Vamos vida manda ai',
      type: 'received',
      time: '08:42 am'
    },
  ];

  // Use as mensagens customizadas ou as mensagens da props
  const displayMessages = messages.length > 0 ? messages : defaultMessages;

  const handleDownload = async () => {
    if (!chatRef.current) return;

    try {
      const bgColor = isDarkMode ? '#121B22' : '#E5DDD5';
      const dataUrl = await captureScreenshot(chatRef.current, bgColor);
      
      if (dataUrl) {
        const link = document.createElement('a');
        link.download = `whatsapp-chat-iphone-${new Date().getTime()}.png`;
        link.href = dataUrl;
        link.click();
        
        toast({
          title: "Imagem salva com sucesso!",
          description: "A imagem da conversa foi baixada em resolução 1080x1920.",
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
      {/* iPhone frame */}
      <div 
        ref={chatRef}
        className="max-w-sm mx-auto overflow-hidden rounded-[40px] shadow-2xl h-[700px] flex flex-col border-[5px] border-black"
        style={{ 
          backgroundColor: isDarkMode ? '#121B22' : '#e5ddd5'
        }}
      >
        {/* Status bar - iPhone style */}
        <div className="bg-black text-white px-4 py-1 text-xs flex justify-between items-center h-7">
          <span className="font-medium">{statusTime}</span>
          <div className="flex space-x-2 items-center">
            <span className="font-semibold">5G</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        
        {/* iOS WhatsApp header */}
        <div className="bg-gray-100 flex items-center px-4 py-2 shadow-sm border-b border-gray-200">
          <button className="text-blue-500 mr-2 text-xl">
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"></path>
              </svg>
              <span className="ml-1">117</span>
            </span>
          </button>
          
          <div className="flex-1 flex items-center">
            <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden mr-2">
              <img 
                src={profilePic || 'https://via.placeholder.com/100'} 
                alt="Foto de perfil" 
                className="h-full w-full object-cover"
              />
            </div>
            
            <div>
              <h3 className="text-black font-bold text-base">
                {"Amor"}
              </h3>
              <div className="text-gray-500 text-xs">
                Online
              </div>
            </div>
          </div>
          
          <div className="flex gap-5 text-blue-500">
            <button className="p-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="1" ry="1"></rect>
                <path d="M8 12h8"></path>
                <path d="M12 8v8"></path>
              </svg>
            </button>
            <button className="p-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Chat area - iOS style */}
        <div 
          className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-3 whatsapp-chat-background" 
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'repeat',
            backgroundAttachment: 'local'
          }}
        >
          {/* Date header - iOS style */}
          <div className="flex justify-center mb-3">
            <div className="bg-white px-3 py-1 text-xs text-gray-500 rounded-xl text-center">
              {customDate}
            </div>
          </div>
          
          {displayMessages.map((message, index) => (
            <div 
              key={message.id || index} 
              className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'} mb-2`}
            >
              <div 
                className={`rounded-xl p-2.5 max-w-[75%] relative ${
                  message.type === 'sent' 
                    ? 'bg-[#dcf8c6]' 
                    : 'bg-white'
                }`}
                style={{
                  borderRadius: message.type === 'sent' 
                    ? '16px 16px 4px 16px' 
                    : '16px 16px 16px 4px'
                }}
              >
                <p className="text-sm text-gray-800 leading-relaxed">
                  {message.text}
                </p>
                <div className="flex justify-end items-center gap-1 mt-1">
                  <p className="text-[10px] text-gray-500">{message.time}</p>
                  {message.type === 'sent' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34b7f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 12 5 5L20 7"></path>
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Input bar - iOS style */}
        <div className="bg-gray-100 flex items-center p-2 border-t border-gray-200">
          <div className="flex items-center gap-2 w-full">
            <button className="text-gray-600 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <path d="M9 9h.01"></path>
                <path d="M15 9h.01"></path>
              </svg>
            </button>
            <div className="flex-1 bg-white rounded-full px-4 py-2 border border-gray-300">
              <input type="text" className="w-full text-sm outline-none" placeholder="Digite uma mensagem" disabled />
            </div>
            <button className="bg-gray-200 p-2 rounded-full ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="22"></line>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Bottom iPhone home indicator */}
        <div className="h-1 bg-black w-36 mx-auto rounded-full my-1"></div>
      </div>
      
      {/* Download button */}
      <div className="mt-6 flex justify-center">
        <Button 
          onClick={handleDownload}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Baixar Imagem do Chat
        </Button>
      </div>
    </div>
  );
};

export default ChatPreview;
