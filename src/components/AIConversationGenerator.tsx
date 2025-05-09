import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useChatStore } from '@/hooks/use-chat-store';
import { generateConversation } from '@/lib/gemini';
import { Message } from '@/types';
import { generateRandomTime, getRandomProfile } from '@/lib/utils';

const AIConversationGenerator: React.FC = () => {
  const [theme, setTheme] = useState('');
  const [messageCount, setMessageCount] = useState(10);
  const [apiKey, setApiKey] = useState(() => {
    // Carregar a API key salva no localStorage, se existir, ou usar a padrão
    const savedApiKey = localStorage.getItem('gemini_api_key');
    return savedApiKey || 'AIzaSyC5rJnc5OOvaSDNPl3UUye14FK7o-tT3aQ';
  });
  const [selectedModel, setSelectedModel] = useState(() => {
    // Carregar o modelo salvo no localStorage, se existir
    const savedModel = localStorage.getItem('gemini_model');
    return savedModel || 'gemini-1.0-pro';
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addMessage, clearAllMessages, setContactName, setProfilePic } = useChatStore();

  // Utilizando a função de utilidade para gerar horários

  // Salvar a API key e o modelo selecionado quando eles mudam
  React.useEffect(() => {
    if (apiKey) {
      localStorage.setItem('gemini_api_key', apiKey);
    }
  }, [apiKey]);

  React.useEffect(() => {
    localStorage.setItem('gemini_model', selectedModel);
  }, [selectedModel]);

  const handleGenerateConversation = async () => {
    if (!theme.trim()) {
      toast({
        title: "Tema não informado",
        description: "Por favor, digite um tema para a conversa.",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey.trim()) {
      toast({
        title: "API Key não informada",
        description: "Por favor, informe sua API Key do Google Gemini.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Salvar a API key no localStorage
      localStorage.setItem('gemini_api_key', apiKey);
      
      // Limpar mensagens existentes se houver
      clearAllMessages();
      
      // Selecionar um perfil aleatório
      const randomProfile = getRandomProfile();
      setContactName(randomProfile.name);
      setProfilePic(randomProfile.profilePic);

      // Gerar a conversa com o Gemini
      const conversation = await generateConversation(apiKey, selectedModel, theme, messageCount);
      
      // Adicionar as mensagens ao chat com horários variados
      const baseTime = new Date();
      
      // Determinar horário base (alguns minutos atrás) para a primeira mensagem
      baseTime.setMinutes(baseTime.getMinutes() - Math.floor(messageCount / 3));
      
      let lastTime = baseTime;
      let currentMinuteOffset = 0;
      let previousType: 'sent' | 'received' | null = null;
      
      // Processar todas as mensagens primeiro para calcular os horários
      const processedMessages: Message[] = [];
      
      conversation.forEach((msg: { text: string, type: 'sent' | 'received' }, index) => {
        // Variar tempos entre mensagens para parecer mais natural
        // Se o tipo de mensagem mudou (sent -> received ou vice-versa), adicionar pequeno atraso
        if (previousType !== null && previousType !== msg.type) {
          // Adicionar 1-2 minutos para a resposta quando muda o tipo da mensagem
          currentMinuteOffset += Math.floor(Math.random() * 2) + 1;
        } else {
          // Mensagens do mesmo tipo em sequência têm intervalos menores
          // 30% de chance de incrementar o minuteOffset para mensagens do mesmo tipo
          if (Math.random() < 0.3) {
            currentMinuteOffset += 1;
          }
        }
        
        // Gerar horário para esta mensagem
        const messageTime = generateRandomTime(new Date(lastTime), currentMinuteOffset);
        
        const message: Message = {
          id: Date.now().toString() + index,
          text: msg.text,
          type: msg.type,
          time: messageTime
        };
        
        // Salvar o tipo atual para comparar com a próxima mensagem
        previousType = msg.type;
        // Atualizar último horário usado
        lastTime = new Date(baseTime);
        lastTime.setMinutes(baseTime.getMinutes() + currentMinuteOffset);
        
        processedMessages.push(message);
      });
      
      // Adicionar as mensagens com pequenos intervalos para manter o visual de chegada gradual
      processedMessages.forEach((message, index) => {
        setTimeout(() => {
          addMessage(message);
        }, index * 50);
      });
      
      toast({
        title: "Conversa gerada com sucesso!",
        description: `${conversation.length} mensagens foram adicionadas ao chat.`,
      });
      
      // Recarregar a página automaticamente após todas as mensagens serem adicionadas
      setTimeout(() => {
        window.location.reload();
      }, (processedMessages.length * 50) + 500); // Espera todas as mensagens serem adicionadas + 500ms
    } catch (error) {
      console.error('Erro ao gerar conversa:', error);
      toast({
        title: "Erro ao gerar conversa",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao conectar com o Google Gemini. Verifique sua API Key.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modern-card p-6 mb-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-emerald-600 dark:text-emerald-400">
          <path d="M12 8V4H8"></path>
          <rect x="2" y="2" width="20" height="8" rx="2"></rect>
          <path d="M8 16v4h4"></path>
          <rect x="2" y="14" width="20" height="8" rx="2"></rect>
          <path d="M18 5 6 19"></path>
        </svg>
        Gerar Conversa com IA
      </h2>
      
      <div className="space-y-5">
        <div className="bg-gray-50 dark:bg-gray-900/60 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
          <Label htmlFor="apiKey" className="block text-gray-700 dark:text-gray-300 font-medium mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-emerald-600 dark:text-emerald-400">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
            </svg>
            API Key do Google Gemini
          </Label>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Cole sua API Key aqui"
            className="w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          <div className="mt-2 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 dark:text-gray-400 mt-0.5 mr-1.5 flex-shrink-0">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Uma API Key padrão já está configurada, mas você pode alterá-la se preferir usar a sua própria.
            </p>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              Clique aqui para obter uma API Key gratuita do Google AI Studio
            </a>
          </p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-900/60 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
          <Label htmlFor="model" className="block text-gray-700 dark:text-gray-300 font-medium mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-emerald-600 dark:text-emerald-400">
              <path d="M12 2c1.103 0 2 .897 2 2v7a2 2 0 0 1-4 0V4c0-1.103.897-2 2-2z"></path>
              <path d="M10 9a5 5 0 1 0 4 0"></path>
              <path d="M19 19H5"></path>
              <path d="M17.8 19a6 6 0 0 0-11.6 0"></path>
            </svg>
            Modelo do Gemini
          </Label>
          <Select
            value={selectedModel}
            onValueChange={setSelectedModel}
          >
            <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm rounded-lg">
              <SelectValue placeholder="Selecione um modelo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini-1.0-pro">gemini-1.0-pro (estável)</SelectItem>
              <SelectItem value="gemini-pro">gemini-pro (legado)</SelectItem>
              <SelectItem value="gemini-1.5-flash">gemini-1.5-flash (mais rápido)</SelectItem>
              <SelectItem value="gemini-1.5-pro-latest">gemini-1.5-pro-latest (experimental)</SelectItem>
            </SelectContent>
          </Select>
          <div className="mt-2 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 dark:text-gray-400 mt-0.5 mr-1.5 flex-shrink-0">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Se um modelo estiver com erro de cota, tente outro.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900/60 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
          <Label htmlFor="theme" className="block text-gray-700 dark:text-gray-300 font-medium mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-emerald-600 dark:text-emerald-400">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            Tema da conversa
          </Label>
          <Textarea
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="Ex: Combinar de ir ao cinema, Discutir sobre um jogo de futebol, Planejar uma viagem..."
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            rows={2}
          />
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-900/60 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
          <Label className="block text-gray-700 dark:text-gray-300 font-medium mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-emerald-600 dark:text-emerald-400">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            Número de mensagens: <span className="font-bold ml-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-800 rounded-md text-emerald-800 dark:text-emerald-100">{messageCount}</span>
          </Label>
          <div className="px-2 mt-3">
            <Slider
              value={[messageCount]}
              min={5}
              max={20}
              step={1}
              onValueChange={(values) => setMessageCount(values[0])}
              className="my-4"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
              <span>5</span>
              <span>10</span>
              <span>15</span>
              <span>20</span>
            </div>
          </div>
        </div>
        
        <Button
          onClick={handleGenerateConversation}
          disabled={isLoading}
          className="w-full btn-primary font-semibold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl transform hover:translate-y-[-2px] mt-2"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Gerando conversa...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                <path d="M5 3v4"></path>
                <path d="M19 17v4"></path>
                <path d="M3 5h4"></path>
                <path d="M17 19h4"></path>
              </svg>
              Gerar Conversa com IA
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AIConversationGenerator;