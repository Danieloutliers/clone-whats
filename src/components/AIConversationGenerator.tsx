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
import { generateImageFromText, shouldGenerateImage } from '@/lib/imageGenerator';
import { Message } from '@/types';
import { generateRandomTime, getRandomProfile } from '@/lib/utils';

const AIConversationGenerator: React.FC = () => {
  const [theme, setTheme] = useState('');
  const [messageCount, setMessageCount] = useState(10);
  const [apiKey, setApiKey] = useState(() => {
    // Carregar a API key salva no localStorage, se existir, ou usar a chave fornecida
    const savedApiKey = localStorage.getItem('gemini_api_key');
    return savedApiKey || 'AIzaSyC5rJnc5OOvaSDNPl3UUye14FK7o-tT3aQ';
  });
  const [selectedModel, setSelectedModel] = useState(() => {
    // Carregar o modelo salvo no localStorage, se existir
    const savedModel = localStorage.getItem('gemini_model');
    return savedModel || 'gemini-2.0-flash-lite-001';
  });
  
  // Estados para controle do humor da IA
  const [selectedMood, setSelectedMood] = useState<string>('normal');
  const [availableMoods, setAvailableMoods] = useState({
    engraçado: false,
    sério: false,
    irritado: false,
    romântico: false,
    formal: false,
    informal: false,
    sarcástico: false,
    empolgado: false
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

      // Preparar os humores selecionados
      const selectedMoods = Object.entries(availableMoods)
        .filter(([_, isSelected]) => isSelected)
        .map(([mood]) => mood);
      
      // Adicionar o humor padrão se nenhum for selecionado
      const moodsToUse = selectedMoods.length > 0 ? selectedMoods : ['normal'];
      
      // Gerar a conversa com o Gemini, incluindo os humores selecionados
      const conversation = await generateConversation(
        apiKey, 
        selectedModel, 
        theme, 
        messageCount,
        moodsToUse
      );
      
      // Adicionar as mensagens ao chat com horários variados
      const baseTime = new Date();
      
      // Determinar horário base (alguns minutos atrás) para a primeira mensagem
      baseTime.setMinutes(baseTime.getMinutes() - Math.floor(messageCount / 3));
      
      let lastTime = baseTime;
      let currentMinuteOffset = 0;
      let previousType: 'sent' | 'received' | null = null;
      
      // Processar todas as mensagens primeiro para calcular os horários
      const processedMessages: Message[] = [];
      
      // Processar cada mensagem e considerar adicionar imagens
      const processMessagesWithImages = async () => {
        for (let index = 0; index < conversation.length; index++) {
          const msg = conversation[index];
          
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
          
          // Verificar se esta mensagem deve ter uma imagem anexada
          // Apenas mensagens recebidas podem ter imagens (mais natural)
          let imageUrl: string | undefined = undefined;
          if (msg.type === 'received' && shouldGenerateImage(msg.text)) {
            try {
              const generatedImageUrl = await generateImageFromText(msg.text);
              // Só atribuir se a URL for válida (não null)
              if (generatedImageUrl) {
                imageUrl = generatedImageUrl;
              }
            } catch (error) {
              console.error('Erro ao gerar imagem:', error);
            }
          }
          
          const message: Message = {
            id: Date.now().toString() + index,
            text: msg.text,
            type: msg.type,
            time: messageTime,
            imageUrl: imageUrl
          };
          
          // Salvar o tipo atual para comparar com a próxima mensagem
          previousType = msg.type;
          // Atualizar último horário usado
          lastTime = new Date(baseTime);
          lastTime.setMinutes(baseTime.getMinutes() + currentMinuteOffset);
          
          processedMessages.push(message);
        }
      };
      
      // Processar mensagens e adicionar imagens
      await processMessagesWithImages();
      
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
    <div className="modern-card p-4 sm:p-6 mb-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md dark:shadow-gray-900/30">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 flex flex-wrap items-center">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 mr-3 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400">
            <path d="M12 8V4H8"></path>
            <rect x="2" y="2" width="20" height="8" rx="2"></rect>
            <path d="M8 16v4h4"></path>
            <rect x="2" y="14" width="20" height="8" rx="2"></rect>
            <path d="M18 5 6 19"></path>
          </svg>
        </span>
        Gerar Conversa com IA
      </h2>
      
      <div className="space-y-4 sm:space-y-5">
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900/80 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <Label htmlFor="apiKey" className="block text-gray-700 dark:text-gray-300 font-medium mb-2.5 flex items-center text-sm sm:text-base">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 mr-2.5 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
              </svg>
            </span>
            API Key do Google Gemini
          </Label>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Cole sua API Key aqui"
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          <div className="mt-3 flex items-start bg-blue-50 dark:bg-blue-900/20 p-2.5 rounded-lg border border-blue-100 dark:border-blue-900/50">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
            <div className="space-y-1.5">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Uma chave API do Google Gemini já está configurada como padrão (AIzaSyC5rJnc5OOvaSDNPl3UUye14FK7o-tT3aQ), mas você pode alterá-la se preferir usar a sua própria.
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                  Clique aqui para obter uma API Key gratuita do Google AI Studio
                </a>
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900/80 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <Label htmlFor="model" className="block text-gray-700 dark:text-gray-300 font-medium mb-2.5 flex items-center text-sm sm:text-base">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 mr-2.5 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400">
                <path d="M12 2c1.103 0 2 .897 2 2v7a2 2 0 0 1-4 0V4c0-1.103.897-2 2-2z"></path>
                <path d="M10 9a5 5 0 1 0 4 0"></path>
                <path d="M19 19H5"></path>
                <path d="M17.8 19a6 6 0 0 0-11.6 0"></path>
              </svg>
            </span>
            Modelo do Gemini
          </Label>
          <Select
            value={selectedModel}
            onValueChange={setSelectedModel}
          >
            <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm rounded-lg py-3">
              <SelectValue placeholder="Selecione um modelo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini-2.0-flash-lite-001" className="flex items-center py-2.5">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  gemini-2.0-flash-lite-001 <span className="ml-1.5 text-xs text-gray-500 dark:text-gray-400">(novo - contexto 1056k)</span>
                </span>
              </SelectItem>
              <SelectItem value="gemini-1.0-pro" className="flex items-center py-2.5">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  gemini-1.0-pro <span className="ml-1.5 text-xs text-gray-500 dark:text-gray-400">(estável)</span>
                </span>
              </SelectItem>
              <SelectItem value="gemini-pro" className="flex items-center py-2.5">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  gemini-pro <span className="ml-1.5 text-xs text-gray-500 dark:text-gray-400">(legado)</span>
                </span>
              </SelectItem>
              <SelectItem value="gemini-1.5-flash" className="flex items-center py-2.5">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  gemini-1.5-flash <span className="ml-1.5 text-xs text-gray-500 dark:text-gray-400">(mais rápido)</span>
                </span>
              </SelectItem>
              <SelectItem value="gemini-1.5-pro-latest" className="flex items-center py-2.5">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  gemini-1.5-pro-latest <span className="ml-1.5 text-xs text-gray-500 dark:text-gray-400">(experimental)</span>
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="mt-3 flex items-start bg-amber-50 dark:bg-amber-900/20 p-2.5 rounded-lg border border-amber-100 dark:border-amber-900/50">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 dark:text-amber-400 mt-0.5 mr-2 flex-shrink-0">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Se um modelo estiver com erro de cota, tente outro modelo da lista.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900/80 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <Label htmlFor="theme" className="block text-gray-700 dark:text-gray-300 font-medium mb-2.5 flex items-center text-sm sm:text-base">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 mr-2.5 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </span>
            Tema da conversa
          </Label>
          <Textarea
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="Ex: Combinar de ir ao cinema, Discutir sobre um jogo de futebol, Planejar uma viagem..."
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white min-h-[90px]"
            rows={2}
          />
          <div className="mt-3 flex items-start bg-emerald-50 dark:bg-emerald-900/20 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400 mt-0.5 mr-2 flex-shrink-0">
              <path d="M12 22s8-4 8-10V6l-8-4-8 4v6c0 6 8 10 8 10z"></path>
            </svg>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              Quanto mais detalhes sobre o tema, mais realista será a conversa gerada pela IA.
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900/80 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <Label className="block text-gray-700 dark:text-gray-300 font-medium mb-2.5 flex items-center text-sm sm:text-base">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 mr-2.5 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </span>
            Número de mensagens: <span className="inline-flex items-center justify-center min-w-[35px] font-bold ml-2 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/70 rounded-full text-emerald-800 dark:text-emerald-100 text-sm">{messageCount}</span>
          </Label>
          <div className="px-2 mt-4">
            <Slider
              value={[messageCount]}
              min={5}
              max={20}
              step={1}
              onValueChange={(values) => setMessageCount(values[0])}
              className="my-4"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">5</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">10</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">15</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">20</span>
            </div>
            
            <div className="mt-8">
              <Label className="block text-gray-700 dark:text-gray-300 font-medium mb-3 flex items-center text-sm sm:text-base">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 mr-2.5 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                  </svg>
                </span>
                Humor da conversa:
              </Label>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                {Object.keys(availableMoods).map((mood) => (
                  <div 
                    key={mood} 
                    className="flex items-center"
                  >
                    <input
                      type="checkbox"
                      id={`mood-${mood}`}
                      checked={availableMoods[mood as keyof typeof availableMoods]}
                      onChange={() => {
                        setAvailableMoods(prev => ({
                          ...prev,
                          [mood]: !prev[mood as keyof typeof availableMoods]
                        }));
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                    />
                    <label 
                      htmlFor={`mood-${mood}`}
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize"
                    >
                      {mood}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2 italic">
                Selecione um ou mais humores para personalizar o tom da conversa.
              </p>
            </div>
          </div>
        </div>
        
        <Button
          onClick={handleGenerateConversation}
          disabled={isLoading}
          className={`w-full font-semibold py-4 px-5 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:translate-y-[-2px] mt-3 ${
            isLoading 
              ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed text-white' 
              : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <span className="relative flex h-5 w-5 mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-white/90"></span>
              </span>
              <span className="text-base sm:text-lg">Gerando conversa...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/25 mr-3 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                  <path d="M5 3v4"></path>
                  <path d="M19 17v4"></path>
                  <path d="M3 5h4"></path>
                  <path d="M17 19h4"></path>
                </svg>
              </span>
              <span className="text-base sm:text-lg">Gerar Conversa com IA</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AIConversationGenerator;