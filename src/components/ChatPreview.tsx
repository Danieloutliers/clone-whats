import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/types';

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

  // Format date for header display (like "26 November 2003")
  const getCurrentDate = () => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const now = new Date();
    return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  };
  
  console.log("Messages sendo renderizadas:", messages);
  

  return (
    <div>
      {/* Phone frame */}
      <div 
        ref={chatRef}
        className="max-w-sm mx-auto overflow-hidden shadow-lg h-[600px] flex flex-col"
        style={{ 
          backgroundColor: isDarkMode ? '#121B22' : '#e5ddd5'
        }}
      >
        {/* Status bar */}
        <div className="bg-green-600 text-white px-4 py-1 text-xs flex justify-between items-center h-8">
          <span>{statusTime}</span>
          <div className="flex space-x-1 items-center">
            <span>5G</span>
            <i className="fas fa-signal ml-1"></i>
            <span>{batteryLevel}%</span>
            <i className={`fas fa-battery-${getBatteryIcon(batteryLevel)}`}></i>
          </div>
        </div>
        
        {/* WhatsApp header */}
        <div className="bg-green-600 flex items-center px-3 py-2">
          <button className="text-white mr-2">
            <i className="fas fa-arrow-left"></i>
          </button>
          
          <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden mr-3">
            <img 
              src={profilePic || 'https://via.placeholder.com/100'} 
              alt="Foto de perfil" 
              className="h-full w-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <h3 className="text-white font-semibold text-base flex items-center">
              {contactName}
            </h3>
            <p className="text-white text-xs opacity-80">Online</p>
          </div>
          
          <div className="flex space-x-4 text-white">
            <i className="fas fa-video"></i>
            <i className="fas fa-phone"></i>
            <i className="fas fa-ellipsis-v"></i>
          </div>
        </div>
        
        {/* Date header */}
        <div className="flex justify-center mt-3 mb-2">
          <div className="bg-white dark:bg-gray-700 rounded-lg px-3 py-1 text-xs text-gray-500 dark:text-gray-300 shadow-sm flex items-center">
            {getCurrentDate()}
          </div>
        </div>
        
        {/* Chat area */}
        <div className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-3">
          {messages && messages.length > 0 ? (
            messages.map((message, index) => (
              <div key={message.id || index} className={`flex justify-${message.type === 'sent' ? 'end' : 'start'}`}>
                <div 
                  className={`${
                    message.type === 'sent' 
                      ? 'bg-[#dcf8c6] dark:bg-[#056162]' 
                      : 'bg-white dark:bg-[#262d31]'
                  } rounded-lg p-2 px-3 max-w-[80%] shadow-sm relative ${
                    message.type === 'sent' ? 'message-tail-right' : 'message-tail-left'
                  }`}
                >
                  <p className="text-sm text-gray-800 dark:text-white relative z-10">
                    {message.text}
                  </p>
                  <div className="flex justify-end items-center gap-2 mt-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{message.time}</p>
                    {message.type === 'sent' && (
                      <i className="fas fa-check-double text-xs text-blue-500"></i>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                Nenhuma mensagem para exibir. Adicione mensagens usando o formulário.
              </p>
            </div>
          )}
        </div>
        
        {/* Input area */}
        <div className="bg-[#f0f0f0] dark:bg-[#1f2c34] flex items-center p-2">
          <div className="flex items-center gap-2 w-full">
            <button className="text-gray-600 dark:text-gray-300">
              <i className="far fa-smile text-xl"></i>
            </button>
            <button className="text-gray-600 dark:text-gray-300">
              <i className="fas fa-paperclip text-xl"></i>
            </button>
            <div className="flex-1 bg-white dark:bg-[#2a3942] rounded-full px-4 py-2 mx-2">
              <p className="text-sm text-gray-400">Message</p>
            </div>
            <button className="text-white bg-[#00a884] rounded-full h-10 w-10 flex items-center justify-center">
              <i className="fas fa-microphone text-xl"></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Download button */}
      <div className="mt-4 flex justify-center">
        <Button 
          onClick={handleDownload}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full flex items-center transition"
        >
          <i className="fas fa-download mr-2"></i>Baixar Imagem
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
