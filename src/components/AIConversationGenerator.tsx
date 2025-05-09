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

const AIConversationGenerator: React.FC = () => {
  const [theme, setTheme] = useState('');
  const [messageCount, setMessageCount] = useState(10);
  const [apiKey, setApiKey] = useState(() => {
    // Carregar a API key salva no localStorage, se existir
    const savedApiKey = localStorage.getItem('gemini_api_key');
    return savedApiKey || '';
  });
  const [selectedModel, setSelectedModel] = useState(() => {
    // Carregar o modelo salvo no localStorage, se existir
    const savedModel = localStorage.getItem('gemini_model');
    return savedModel || 'gemini-1.0-pro';
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addMessage, clearAllMessages } = useChatStore();

  // Gerar horário com minutos variados para simular uma conversa real
  const generateRandomTime = (baseTime?: Date, offsetMinutes: number = 0): string => {
    const now = baseTime || new Date();
    // Adicionar o offset de minutos (geralmente para a próxima mensagem)
    now.setMinutes(now.getMinutes() + offsetMinutes);
    
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

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

      // Gerar a conversa com o Gemini
      const conversation = await generateConversation(apiKey, selectedModel, theme, messageCount);
      
      // Adicionar as mensagens ao chat com horários variados
      const baseTime = new Date();
      
      // Determinar horário base (alguns minutos atrás) para a primeira mensagem
      baseTime.setMinutes(baseTime.getMinutes() - Math.floor(messageCount / 3));
      
      let lastTime = baseTime;
      let currentMinuteOffset = 0;
      let previousType = null;
      
      conversation.forEach((msg, index) => {
        // Pequeno atraso para simular a ordem de chegada das mensagens
        setTimeout(() => {
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
          
          addMessage(message);
        }, index * 50);
      });
      
      toast({
        title: "Conversa gerada com sucesso!",
        description: `${conversation.length} mensagens foram adicionadas ao chat.`,
      });
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
        <i className="fas fa-robot mr-2"></i>Gerar Conversa com IA
      </h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="apiKey" className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            API Key do Google Gemini
          </Label>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Cole sua API Key aqui"
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <p className="text-xs text-gray-500 mt-1">
            Sua API Key é salva no seu navegador e não é compartilhada com nossos servidores.
          </p>
          <p className="text-xs text-blue-600 mt-1">
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">
              <i className="fas fa-external-link-alt mr-1"></i>
              Clique aqui para obter uma API Key gratuita do Google AI Studio
            </a>
          </p>
        </div>
        
        <div>
          <Label htmlFor="model" className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            Modelo do Gemini
          </Label>
          <Select
            value={selectedModel}
            onValueChange={setSelectedModel}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um modelo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini-1.0-pro">gemini-1.0-pro (estável)</SelectItem>
              <SelectItem value="gemini-pro">gemini-pro (legado)</SelectItem>
              <SelectItem value="gemini-1.5-flash">gemini-1.5-flash (mais rápido)</SelectItem>
              <SelectItem value="gemini-1.5-pro-latest">gemini-1.5-pro-latest (experimental)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            Se um modelo estiver com erro de cota, tente outro.
          </p>
        </div>

        <div>
          <Label htmlFor="theme" className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            Tema da conversa
          </Label>
          <Textarea
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="Ex: Combinar de ir ao cinema, Discutir sobre um jogo de futebol, Planejar uma viagem..."
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows={2}
          />
        </div>
        
        <div>
          <Label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            Número de mensagens: {messageCount}
          </Label>
          <div className="px-2">
            <Slider
              value={[messageCount]}
              min={5}
              max={20}
              step={1}
              onValueChange={(values) => setMessageCount(values[0])}
              className="my-4"
            />
            <div className="flex justify-between text-xs text-gray-500">
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
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          {isLoading ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Gerando conversa...
            </>
          ) : (
            <>
              <i className="fas fa-magic mr-2"></i>
              Gerar Conversa com IA
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AIConversationGenerator;
