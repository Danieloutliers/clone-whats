import React, { useState, useRef } from 'react';
import { useChatStore } from '@/hooks/use-chat-store';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Message, MessageType } from '@/types';
import EmojiPicker from './EmojiPicker';
import { playReceivedSound, playSentSound } from '@/lib/sounds';

// Função para obter o horário atual em formato HH:MM
const getCurrentTime = (): string => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const MessageManagement: React.FC = () => {
  const { messages, addMessage, editMessage, deleteMessage, moveMessage, clearAllMessages } = useChatStore();
  const [messageText, setMessageText] = useState('');
  const [messageType, setMessageType] = useState<MessageType>('received');
  const [messageTime, setMessageTime] = useState('14:30');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();
  
  // State to track drag and drop
  const [draggedMessageId, setDraggedMessageId] = useState<string | null>(null);
  const [dragOverMessageId, setDragOverMessageId] = useState<string | null>(null);

  const handleAddMessage = () => {
    if (!messageText.trim()) {
      toast({
        title: "Mensagem vazia",
        description: "Por favor, digite uma mensagem.",
        variant: "destructive",
      });
      return;
    }
    
    const newMessage: Message = {
      id: editingMessageId || Date.now().toString(),
      text: messageText,
      type: messageType,
      time: messageTime
    };
    
    console.log("Adicionando/editando mensagem:", newMessage);
    
    if (editingMessageId) {
      editMessage(editingMessageId, newMessage);
      setEditingMessageId(null);
      toast({
        title: "Mensagem atualizada",
        description: "A mensagem foi editada com sucesso.",
      });
    } else {
      addMessage(newMessage);
      console.log("Mensagem adicionada com sucesso");
      
      // Play sound based on message type
      if (messageType === 'sent') {
        playSentSound();
      } else {
        playReceivedSound();
      }
    }
    
    // Reset form
    setMessageText('');
  };
  
  const handleEditClick = (message: Message) => {
    setMessageText(message.text);
    setMessageType(message.type);
    setMessageTime(message.time);
    setEditingMessageId(message.id);
  };
  
  const handleDeleteClick = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta mensagem?')) {
      deleteMessage(id);
      
      // If editing and deleting the same message, reset the form
      if (editingMessageId === id) {
        setEditingMessageId(null);
        setMessageText('');
      }
    }
  };
  
  const handleEmojiSelect = (emoji: string) => {
    setMessageText(prev => prev + emoji);
    setIsEmojiPickerOpen(false);
  };
  
  const handleDragStart = (id: string) => {
    setDraggedMessageId(id);
  };
  
  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDragOverMessageId(id);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedMessageId && dragOverMessageId && draggedMessageId !== dragOverMessageId) {
      moveMessage(draggedMessageId, dragOverMessageId);
    }
    setDraggedMessageId(null);
    setDragOverMessageId(null);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        <i className="fas fa-comment-alt mr-2"></i>Mensagens
      </h2>
      
      {/* Add message form */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="mb-3">
          <Label htmlFor="messageText" className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            {editingMessageId ? 'Editar Mensagem' : 'Nova Mensagem'}
          </Label>
          <Textarea 
            id="messageText" 
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-whatsapp-green"
          />
        </div>
        
        <div className="flex flex-wrap items-center mb-3 gap-3">
          <div className="flex items-center">
            <input 
              type="radio" 
              id="receivedMsg" 
              name="messageType" 
              value="received"
              checked={messageType === 'received'}
              onChange={() => setMessageType('received')}
              className="mr-2" 
            />
            <Label htmlFor="receivedMsg" className="text-gray-700 dark:text-gray-300">
              Recebida
            </Label>
          </div>
          <div className="flex items-center">
            <input 
              type="radio" 
              id="sentMsg" 
              name="messageType" 
              value="sent"
              checked={messageType === 'sent'}
              onChange={() => setMessageType('sent')}
              className="mr-2" 
            />
            <Label htmlFor="sentMsg" className="text-gray-700 dark:text-gray-300">
              Enviada
            </Label>
          </div>
          
          <div className="flex items-center ml-auto">
            <button 
              onClick={() => setIsEmojiPickerOpen(true)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
            >
              <i className="far fa-smile text-lg"></i>
            </button>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="flex-1">
            <Input 
              type="time" 
              value={messageTime}
              onChange={(e) => setMessageTime(e.target.value)}
              className="px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
            />
          </div>
          <div>
            <Button
              onClick={handleAddMessage}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition"
            >
              {editingMessageId ? 'Atualizar Mensagem' : 'Adicionar Mensagem'}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Bulk message import */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Importar Conversa
        </h3>
        <div className="mb-3">
          <Label htmlFor="bulkMessages" className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            Cole a conversa aqui
          </Label>
          <Textarea 
            id="bulkMessages" 
            placeholder={`Cole sua conversa aqui. Indique mensagens enviadas com "Eu:" e recebidas com "Contato:" no início.\n\nExemplo:\nContato: Olá, tudo bem?\nEu: Tudo ótimo, e você?\nContato: Estou bem também!`}
            rows={6}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-whatsapp-green"
          />
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Use "Eu:" para mensagens enviadas e "Contato:" para recebidas
          </p>
          <Button
            onClick={() => {
              const textarea = document.getElementById('bulkMessages') as HTMLTextAreaElement;
              if (textarea && textarea.value) {
                const lines = textarea.value.split('\n').filter(line => line.trim() !== '');
                
                let newMessages: Array<{text: string, type: 'sent' | 'received', time: string}> = [];
                
                lines.forEach(line => {
                  const currentTime = getCurrentTime();
                  
                  if (line.startsWith('Eu:')) {
                    newMessages.push({
                      text: line.substring(3).trim(),
                      type: 'sent',
                      time: currentTime
                    });
                  } else if (line.startsWith('Contato:')) {
                    newMessages.push({
                      text: line.substring(8).trim(),
                      type: 'received',
                      time: currentTime
                    });
                  } else {
                    // Se não tiver prefixo, assume que é uma continuação da mensagem anterior
                    if (newMessages.length > 0) {
                      const lastMessage = newMessages[newMessages.length - 1];
                      lastMessage.text += '\n' + line.trim();
                    } else {
                      // Se for a primeira linha sem prefixo, assume que é recebida
                      newMessages.push({
                        text: line.trim(),
                        type: 'received',
                        time: currentTime
                      });
                    }
                  }
                });
                
                // Adiciona todas as mensagens processadas
                newMessages.forEach(msg => {
                  addMessage({
                    id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
                    text: msg.text,
                    type: msg.type,
                    time: msg.time
                  });
                });
                
                // Limpa o textarea
                textarea.value = '';
                
                toast({
                  title: "Conversa importada",
                  description: `${newMessages.length} mensagens foram importadas com sucesso.`,
                });
              }
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition"
          >
            Importar Mensagens
          </Button>
        </div>
      </div>
      
      {/* Messages list */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Mensagens adicionadas
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Arraste para reordenar
            </span>
            <Button
              onClick={() => {
                if (window.confirm('Tem certeza que deseja limpar todas as mensagens? Esta ação não pode ser desfeita.')) {
                  clearAllMessages();
                  toast({
                    title: "Mensagens apagadas",
                    description: "Todas as mensagens foram removidas com sucesso.",
                  });
                }
              }}
              variant="destructive"
              size="sm"
              className="px-2 py-1 text-xs"
            >
              <i className="fas fa-trash-alt mr-1"></i> Limpar Tudo
            </Button>
          </div>
        </div>
        
        <div 
          ref={messageListRef}
          className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar"
        >
          {messages.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              Nenhuma mensagem adicionada. Comece criando uma nova mensagem acima.
            </p>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id}
                draggable
                onDragStart={() => handleDragStart(message.id)}
                onDragOver={(e) => handleDragOver(e, message.id)}
                onDrop={handleDrop}
                className={`bg-gray-50 dark:bg-gray-700 p-3 rounded-lg flex items-start ${
                  draggedMessageId === message.id ? 'opacity-50' : 'opacity-100'
                } ${
                  dragOverMessageId === message.id ? 'border-2 border-blue-400' : ''
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center text-sm font-medium text-gray-800 dark:text-white">
                    <i className={`fas fa-arrow-${message.type === 'sent' ? 'left' : 'right'} text-${message.type === 'sent' ? 'blue' : 'green'}-500 mr-2`}></i>
                    <span className="truncate">{message.text}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span className="font-medium">{message.type === 'sent' ? 'Enviada' : 'Recebida'}</span> • {message.time}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => handleEditClick(message)}
                    className="p-1 text-blue-500 hover:text-blue-700"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(message.id)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600 cursor-move">
                    <i className="fas fa-grip-lines"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Emoji picker */}
      {isEmojiPickerOpen && (
        <EmojiPicker 
          onEmojiSelect={handleEmojiSelect} 
          onClose={() => setIsEmojiPickerOpen(false)} 
        />
      )}
    </div>
  );
};

export default MessageManagement;
