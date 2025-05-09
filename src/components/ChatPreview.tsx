import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/types';
import { formatLongDate } from '@/lib/utils';

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

  const handleDownload = async () => {
    if (!chatRef.current) return;

    try {
      const canvas = await html2canvas(chatRef.current, {
        allowTaint: true,
        useCORS: true,
        scale: 2,
        backgroundColor: isDarkMode ? '#121B22' : '#E5DDD5',
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `whatsapp-chat-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
      
      toast({
        title: "Imagem salva com sucesso!",
        description: "A imagem da conversa foi baixada.",
      });
    } catch (error) {
      console.error('Failed to capture screenshot', error);
      toast({
        title: "Erro ao salvar a imagem",
        description: "Não foi possível gerar a imagem da conversa.",
        variant: "destructive",
      });
    }
  };

  // Usando a função utilitária para formatar a data
  
  return (
    <div>
      {/* Phone frame - Design modernizado com bordas arredondadas e efeito de elevação */}
      <div 
        ref={chatRef}
        className="max-w-sm mx-auto overflow-hidden rounded-3xl shadow-2xl h-[600px] flex flex-col border border-gray-200 dark:border-gray-700 transform hover:scale-[1.01] transition-all duration-300"
        style={{ 
          backgroundColor: isDarkMode ? '#121B22' : '#e5ddd5'
        }}
      >
        {/* Status bar - Design melhorado com ícones mais modernos */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-700 dark:to-teal-800 text-white px-4 py-1 text-xs flex justify-between items-center h-8">
          <span className="font-medium">{statusTime}</span>
          <div className="flex space-x-2 items-center">
            <span className="bg-white bg-opacity-20 px-1.5 py-0.5 rounded-sm">5G</span>
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
        
        {/* WhatsApp header - Design mais moderno e elegante */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 dark:from-emerald-700 dark:to-teal-800 flex items-center px-4 py-3">
          <button className="text-white mr-3 hover:bg-white hover:bg-opacity-10 p-1 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"></path>
            </svg>
          </button>
          
          <div className="h-12 w-12 rounded-full bg-gray-300 overflow-hidden mr-3 ring-2 ring-white ring-opacity-40 shadow-md">
            <img 
              src={profilePic || 'https://via.placeholder.com/100'} 
              alt="Foto de perfil" 
              className="h-full w-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <h3 className="text-white font-semibold text-base">
              {contactName}
            </h3>
            <div className="flex items-center text-white text-xs opacity-80">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1.5"></span>
              Online agora
            </div>
          </div>
          
          <div className="flex space-x-4 text-white">
            <button className="hover:bg-white hover:bg-opacity-10 p-1.5 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 7l-7 5 7 5V7z"></path>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
            </button>
            <button className="hover:bg-white hover:bg-opacity-10 p-1.5 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </button>
            <button className="hover:bg-white hover:bg-opacity-10 p-1.5 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Date header - Estilo modernizado e mais evidente */}
        <div className="flex justify-center mt-3 mb-2">
          <div className="bg-white dark:bg-gray-700 rounded-full px-3.5 py-1 text-xs text-gray-500 dark:text-gray-300 shadow-lg border border-gray-200 dark:border-gray-600">
            {formatLongDate(new Date())}
          </div>
        </div>
        
        {/* Chat area - Bolhas de mensagem mais modernas com animação suave */}
        <div className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-3">
          {messages && messages.length > 0 ? (
            messages.map((message, index) => (
              <div 
                key={message.id || index} 
                className={`flex justify-${message.type === 'sent' ? 'end' : 'start'} animate-in fade-in slide-in-from-${message.type === 'sent' ? 'right' : 'left'} duration-300 ease-out`}
              >
                <div 
                  className={`${
                    message.type === 'sent' 
                      ? 'bg-[#dcf8c6] dark:bg-[#056162]' 
                      : 'bg-white dark:bg-[#262d31]'
                  } rounded-xl p-3 px-4 max-w-[80%] shadow-md relative ${
                    message.type === 'sent' ? 'message-tail-right' : 'message-tail-left'
                  } hover:shadow-lg transition-shadow duration-300`}
                >
                  <p className="text-sm text-gray-800 dark:text-white relative z-10 leading-relaxed">
                    {message.text}
                  </p>
                  <div className="flex justify-end items-center gap-1.5 mt-1.5">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{message.time}</p>
                    {message.type === 'sent' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                        <path d="M18 6 7 17l-5-5"></path>
                        <path d="m22 10-8 8-4-4"></path>
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-full">
              <div className="text-center p-4 bg-white bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-80 rounded-xl shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 text-gray-400 dark:text-gray-500">
                  <path d="M17.5 5.5C19 7 20.5 9 21 11"></path>
                  <path d="M5.5 17.5C7 19 9 20.5 11 21"></path>
                  <path d="M14 3a11 11 0 0 0-7.14 16.5"></path>
                  <path d="M21 14a11 11 0 0 1-16.5 7.14"></path>
                  <path d="M7 7 17 17"></path>
                </svg>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Nenhuma mensagem para exibir. Adicione mensagens usando o formulário.
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Input area - Campo de entrada mais moderno e atrativo */}
        <div className="bg-gray-100 dark:bg-gray-800 flex items-center p-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 w-full">
            <button className="text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-500 transition-colors p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
            </button>
            <button className="text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-500 transition-colors p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
              </svg>
            </button>
            <div className="flex-1 bg-white dark:bg-gray-700 rounded-full px-4 py-2.5 mx-2 border border-gray-200 dark:border-gray-600 shadow-inner">
              <p className="text-sm text-gray-400 dark:text-gray-300">Digite uma mensagem</p>
            </div>
            <button className="text-white bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 rounded-full h-11 w-11 flex items-center justify-center shadow-md transition-all duration-300 hover:shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="22"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Download button - Design mais moderno e atrativo */}
      <div className="mt-6 flex justify-center">
        <Button 
          onClick={handleDownload}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 px-8 rounded-full flex items-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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

function getBatteryIcon(level: number): string {
  if (level <= 25) return 'quarter';
  if (level <= 50) return 'half';
  if (level <= 75) return 'three-quarters';
  return 'full';
}

export default ChatPreview;
