import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/types';
import { captureScreenshot, saveImage } from '@/lib/html2canvas';
import { hasImageUrl } from '@/lib/utils';
import bgImage from '@/assets/Whatsapp_background_image.webp';

interface SamsungChatPreviewProps {
  isDarkMode: boolean;
  messages: Message[];
  contactName: string;
  profilePic: string;
  statusTime: string;
  batteryLevel: number;
}

const SamsungChatPreview: React.FC<SamsungChatPreviewProps> = ({
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
      text: 'Oi, amor',
      type: 'sent',
      time: '08:42 am',
      imageUrl: undefined
    },
    {
      id: '2',
      text: 'Falar vida',
      type: 'received',
      time: '08:42 am',
      imageUrl: undefined
    },
    {
      id: '3',
      text: 'Acabe de ver um desafio de Casal no Tiktok pra junta 10.000 mil em 1 ano vamos fazer em 2025? amor',
      type: 'sent',
      time: '08:42 am',
      imageUrl: undefined
    },
    {
      id: '4',
      text: 'Vamos vida manda ai',
      type: 'received',
      time: '08:42 am',
      imageUrl: undefined
    },
  ] as Message[];

  const handleDownload = async () => {
    if (!chatRef.current) return;

    try {
      const bgColor = isDarkMode ? '#121B22' : '#E5DDD5';
      const dataUrl = await captureScreenshot(chatRef.current, bgColor);
      
      if (dataUrl) {
        const fileName = `whatsapp-chat-samsung-${new Date().getTime()}.png`;
        const success = await saveImage(dataUrl, fileName);
        
        if (success) {
          toast({
            title: "Imagem salva com sucesso!",
            description: "A imagem da conversa foi disponibilizada em alta resolução.",
          });
        } else {
          throw new Error('Falha ao salvar a imagem');
        }
      } else {
        throw new Error('Falha ao gerar a URL da imagem');
      }
    } catch (error) {
      console.error('Falha ao capturar screenshot', error);
      toast({
        title: "Erro ao salvar a imagem",
        description: "Não foi possível gerar a imagem da conversa.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div>
      {/* Samsung Galaxy frame */}
      <div 
        ref={chatRef}
        className="max-w-sm mx-auto overflow-hidden rounded-[30px] shadow-2xl h-[700px] flex flex-col border-[5px] border-black"
        style={{ 
          backgroundColor: isDarkMode ? '#121B22' : '#e5ddd5'
        }}
      >
        {/* Samsung Status bar */}
        <div className="bg-black text-white px-4 py-1 text-xs flex justify-between items-center h-6">
          <span className="font-medium">{statusTime}</span>
          <div className="flex space-x-2 items-center">
            <span className="font-semibold">5G</span>
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
        
        {/* WhatsApp header - Samsung style */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 flex items-center px-4 py-2.5">
          <div className="flex space-x-3 items-center text-white w-full">
            <div className="flex items-center">
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
                <h3 className="text-white font-semibold text-base">
                  {contactName || 'Amor'}
                </h3>
                <div className="text-white text-xs opacity-80">
                  Online
                </div>
              </div>
            </div>
            
            <div className="flex space-x-5 justify-end">
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 7l-7 5 7 5V7z"></path>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
              </button>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </button>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="19" cy="12" r="1"></circle>
                  <circle cx="5" cy="12" r="1"></circle>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Chat area - Samsung One UI style */}
        <div 
          className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-2.5"
          style={{
            backgroundColor: '#e5ddd5',
            backgroundImage: 'linear-gradient(to bottom, rgba(229, 221, 213, 0.9), rgba(229, 221, 213, 0.9))'
          }}
        >
          {/* Date header - Samsung style */}
          <div className="flex justify-center mb-3">
            <div className="bg-gray-200 dark:bg-gray-700 px-3 py-1 text-xs text-gray-600 dark:text-gray-300 rounded-lg shadow-sm">
              Quarta-feira, 26 Nov
            </div>
          </div>
          
          {displayMessages.map((message, index) => (
            <div 
              key={message.id || index} 
              className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`rounded-2xl p-2.5 max-w-[75%] relative ${
                  message.type === 'sent' 
                    ? 'bg-[#D9FDD3] text-black' 
                    : 'bg-white text-black'
                }`}
                style={{
                  borderRadius: message.type === 'sent' 
                    ? '20px 20px 5px 20px' 
                    : '20px 20px 20px 5px'
                }}
              >
                <p className="text-sm leading-relaxed">
                  {message.text}
                </p>
                
                {hasImageUrl(message) && (
                  <div className="mt-2 mb-1 overflow-hidden rounded-lg">
                    <img 
                      src={message.imageUrl} 
                      alt="Imagem de mídia" 
                      className="max-w-full w-full h-auto max-h-[200px] object-cover rounded-lg"
                      loading="lazy"
                      onError={(e) => {
                        // Remover a imagem se falhar ao carregar
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
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
        
        {/* Input area - Samsung One UI style */}
        <div className="bg-white dark:bg-gray-800 flex items-center p-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 w-full">
            <button className="text-gray-500 dark:text-gray-400 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15.5 8A2.5 2.5 0 1 1 20 3.5"></path>
                <path d="M19.11 7.95a8 8 0 1 0-14.33 7.18"></path>
                <path d="m15 17 .5-3.7"></path>
                <path d="M18.1 13.143a3 3 0 1 0-5.3.429"></path>
                <path d="M8.286 20a1 1 0 1 0 2 0"></path>
                <path d="M11.286 22a1 1 0 1 0 2 0"></path>
                <path d="M8 16l.714 4"></path>
              </svg>
            </button>
            <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 h-10 flex items-center">
              <input type="text" className="w-full text-sm outline-none bg-transparent" placeholder="Mensagem" disabled />
            </div>
            <button className="text-white bg-green-600 rounded-full p-3 ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 3 3 9-3 9 19-9Z"></path>
                <path d="M6 12h16"></path>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Samsung navigation bar */}
        <div className="bg-black flex justify-between items-center py-1.5 px-12">
          <button className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </button>
          <button className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            </svg>
          </button>
          <button className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Download button */}
      <div className="mt-6 flex justify-center">
        <Button 
          onClick={handleDownload}
          className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-300"
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

export default SamsungChatPreview;