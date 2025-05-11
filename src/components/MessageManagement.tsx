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
import { getCurrentTime, generateRandomTime } from '@/lib/utils';

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
    <div className="modern-card p-6 mb-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-emerald-600 dark:text-emerald-400">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        Mensagens
      </h2>

      {/* Add message form */}
      <div className="mb-5 bg-gray-50 dark:bg-gray-900/60 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="mb-4">
          <Label htmlFor="messageText" className="block text-gray-700 dark:text-gray-300 font-medium mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-emerald-600 dark:text-emerald-400">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            {editingMessageId ? 'Editar Mensagem' : 'Nova Mensagem'}
          </Label>
          <Textarea 
            id="messageText" 
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            rows={2}
            placeholder="Digite o texto da mensagem aqui..."
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <Label className="text-gray-700 dark:text-gray-300 font-medium mb-2 sm:mb-0">Tipo de mensagem</Label>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="receivedMsg" 
                    name="messageType" 
                    value="received"
                    checked={messageType === 'received'}
                    onChange={() => setMessageType('received')}
                    className="mr-2 h-4 w-4 accent-emerald-600" 
                  />
                  <Label htmlFor="receivedMsg" className="text-gray-700 dark:text-gray-300 flex items-center text-sm sm:text-base">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-emerald-600">
                      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0-1.79 1.11z"></path>
                    </svg>
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
                    className="mr-2 h-4 w-4 accent-blue-600" 
                  />
                  <Label htmlFor="sentMsg" className="text-gray-700 dark:text-gray-300 flex items-center text-sm sm:text-base">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-blue-600">
                      <path d="m22 2-7 20-4-9-9-4Z"></path>
                      <path d="M22 2 11 13"></path>
                    </svg>
                    Enviada
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <Label htmlFor="messageTime" className="text-gray-700 dark:text-gray-300 font-medium mb-2 sm:mb-0 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-emerald-600 dark:text-emerald-400">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Horário
              </Label>
              <Input 
                id="messageTime"
                type="time" 
                value={messageTime}
                onChange={(e) => setMessageTime(e.target.value)}
                className="w-full sm:w-24 px-2 py-1 text-sm border rounded-md shadow-sm focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <button 
            onClick={() => setIsEmojiPickerOpen(true)}
            className="flex items-center justify-center w-full sm:w-auto text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
            Emojis
          </button>

          <Button
            onClick={handleAddMessage}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg transform hover:translate-y-[-1px] w-full sm:w-auto"
          >
            {editingMessageId ? (
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                <span className="whitespace-nowrap">Atualizar Mensagem</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span className="whitespace-nowrap">Adicionar Mensagem</span>
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Bulk message import */}
      <div className="mb-5 bg-gray-50 dark:bg-gray-900/60 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-emerald-600 dark:text-emerald-400">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          Importar Conversa
        </h3>

        <div className="p-4 mb-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Label htmlFor="bulkMessages" className="block text-gray-700 dark:text-gray-300 font-medium mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-emerald-600 dark:text-emerald-400">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
            Cole a conversa aqui
          </Label>
          <Textarea 
            id="bulkMessages" 
            placeholder={`Cole sua conversa aqui. Indique mensagens enviadas com "Eu:" e recebidas com "Contato:" no início.\n\nExemplo:\nContato: Olá, tudo bem?\nEu: Tudo ótimo, e você?\nContato: Estou bem também!`}
            rows={6}
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg border border-blue-100 dark:border-blue-800 mb-4 gap-3">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                Formato para importar
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Use <span className="font-bold">Eu:</span> para mensagens enviadas e <span className="font-bold">Contato:</span> para recebidas
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              const textarea = document.getElementById('bulkMessages') as HTMLTextAreaElement;
              if (!textarea || !textarea.value.trim()) {
                toast({
                  title: "Nenhum texto para importar",
                  description: "Por favor, digite ou cole algum texto para importar.",
                  variant: "destructive"
                });
                return;
              }

              const lines = textarea.value.split('\n').filter(line => line.trim() !== '');

              if (lines.length === 0) {
                toast({
                  title: "Nenhum texto válido",
                  description: "O texto não contém linhas válidas para importar.",
                  variant: "destructive"
                });
                return;
              }

              let newMessages: Array<{text: string, type: 'sent' | 'received', time: string}> = [];

              // Baseado no horário atual, vamos definir um horário base para começar a conversa
              // alguns minutos atrás para que a conversa pareça mais natural
              const baseTime = new Date();
              baseTime.setMinutes(baseTime.getMinutes() - Math.min(10, Math.floor(lines.length / 3)));

              let currentMinuteOffset = 0;
              let previousType: 'sent' | 'received' | null = null;

              lines.forEach(line => {
                // Variação realista nos horários das mensagens
                if (previousType !== null) {
                  // Adiciona 1-2 minutos quando muda o tipo
                  if ((line.startsWith('Eu:') && previousType === 'received') || 
                      (line.startsWith('Contato:') && previousType === 'sent')) {
                    currentMinuteOffset += 1 + Math.floor(Math.random() * 2);
                  } 
                  // Pequena chance de incrementar o tempo mesmo para mensagens do mesmo tipo
                  else if (Math.random() < 0.3) {
                    currentMinuteOffset += 1;
                  }
                }

                const currentTime = generateRandomTime(new Date(baseTime), currentMinuteOffset);

                if (line.startsWith('Eu:')) {
                  newMessages.push({
                    text: line.substring(3).trim(),
                    type: 'sent',
                    time: currentTime
                  });
                  previousType = 'sent';
                } else if (line.startsWith('Contato:')) {
                  newMessages.push({
                    text: line.substring(8).trim(),
                    type: 'received',
                    time: currentTime
                  });
                  previousType = 'received';
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
                    previousType = 'received';
                  }
                }
              });

              if (newMessages.length === 0) {
                toast({
                  title: "Nenhuma mensagem identificada",
                  description: "Não foi possível identificar mensagens no formato esperado.",
                  variant: "destructive"
                });
                return;
              }

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
            }}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg transform hover:translate-y-[-1px] w-full sm:w-auto"
          >
            <div className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                <path d="M12 12v9"></path>
                <path d="m16 16-4-4-4 4"></path>
              </svg>
              <span className="whitespace-nowrap">Importar Conversas</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Messages list */}
      <div className="bg-gray-50 dark:bg-gray-900/60 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-emerald-600 dark:text-emerald-400">
              <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
              <path d="m15 5 4 4"></path>
            </svg>
            Mensagens Adicionadas
          </h3>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 py-1 px-3 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-500">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Arraste para reordenar
            </div>
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
              className="px-2 py-1.5 text-xs rounded-lg flex items-center whitespace-nowrap text-[11px] sm:text-xs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
              Limpar Tudo
            </Button>
          </div>
        </div>

        <div 
          ref={messageListRef}
          className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500 mb-3">
                <rect width="18" height="12" x="3" y="6" rx="2"></rect>
                <path d="M3 10h18"></path>
                <path d="M10 14h4"></path>
              </svg>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Nenhuma mensagem adicionada ainda
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                Comece criando uma nova mensagem acima
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id}
                draggable
                onDragStart={() => handleDragStart(message.id)}
                onDragOver={(e) => handleDragOver(e, message.id)}
                onDrop={handleDrop}
                className={`bg-gray-50 dark:bg-gray-700 p-3 rounded-lg flex items-start border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all duration-200 ${
                  draggedMessageId === message.id ? 'opacity-50' : 'opacity-100'
                } ${
                  dragOverMessageId === message.id ? 'border-2 border-blue-400 shadow-md' : ''
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center text-sm font-medium text-gray-800 dark:text-white">
                    {message.type === 'sent' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mr-2">
                        <path d="m22 2-7 20-4-9-9-4Z"></path>
                        <path d="M22 2 11 13"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 mr-2">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                      </svg>
                    )}
                    <span className={`truncate ${message.text.length > 40 ? 'max-w-xs' : ''}`}>{message.text}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                    <span className={`font-medium inline-block px-1.5 py-0.5 rounded-full text-xs ${
                      message.type === 'sent' 
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' 
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                    }`}>
                      {message.type === 'sent' ? 'Enviada' : 'Recebida'}
                    </span>
                    <span className="mx-1.5">•</span>
                    <span>{message.time}</span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => handleEditClick(message)}
                    className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                    title="Editar mensagem"
                  >
                    <svg xmlns="http://www.w3.org/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(message.id)}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
                    title="Excluir mensagem"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                  <button 
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors cursor-move"
                    title="Arrastar para reordenar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="21" x2="3" y1="6" y2="6"></line>
                      <line x1="21" x2="3" y1="12" y2="12"></line>
                      <line x1="21" x2="3" y1="18" y2="18"></line>
                    </svg>
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