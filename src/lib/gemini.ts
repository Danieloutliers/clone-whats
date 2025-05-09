import { GoogleGenerativeAI } from '@google/generative-ai';

// Inicializar o Google Gemini
const initGemini = (apiKey: string) => {
  return new GoogleGenerativeAI(apiKey);
};

// Função para gerar conversa com base no tema
export const generateConversation = async (
  apiKey: string, 
  modelName: string,
  topic: string, 
  messageCount: number = 10
): Promise<Array<{ text: string, type: 'sent' | 'received' }>> => {
  try {
    // Verificar se a API key foi fornecida
    if (!apiKey) {
      throw new Error('API key do Google Gemini não fornecida');
    }

    const genAI = initGemini(apiKey);
    // Usando o modelo fornecido pelo usuário ou um modelo padrão
    const model = genAI.getGenerativeModel({ model: modelName });

    // Criar um prompt detalhado para gerar uma conversa WhatsApp realista
    const prompt = `
    Crie uma conversa de WhatsApp realista entre duas pessoas em português brasileiro sobre o tema: "${topic}".
    
    A conversa deve ter aproximadamente ${messageCount} mensagens alternando entre as duas pessoas.
    
    Formate a saída como um JSON array com objetos que contém:
    - "text": o texto da mensagem
    - "type": "sent" para mensagens enviadas ou "received" para mensagens recebidas
    
    Exemplo do formato esperado:
    [
      {"text": "Oi, tudo bem?", "type": "sent"},
      {"text": "Tudo ótimo, e com você?", "type": "received"},
      ...
    ]

    Certifique-se que o conteúdo seja realista, use gírias comuns, abreviações e emojis como em conversas reais de WhatsApp. 
    Evite formalidades excessivas.
    
    Responda APENAS com o array JSON sem nenhum outro texto ou explicação.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Tentar extrair apenas o JSON da resposta
      let jsonStr = text;
      
      // Tentar encontrar um array JSON na resposta
      if (text.includes('[') && text.includes(']')) {
        const startIdx = text.indexOf('[');
        const endIdx = text.lastIndexOf(']') + 1;
        if (startIdx >= 0 && endIdx > startIdx) {
          jsonStr = text.substring(startIdx, endIdx);
        }
      }
      
      // Analisar o JSON
      const conversation = JSON.parse(jsonStr);
      
      // Verificar se é um array válido de mensagens
      if (!Array.isArray(conversation)) {
        throw new Error('Resposta não é um array válido');
      }
      
      return conversation;
    } catch (parseError) {
      console.error('Erro ao analisar a resposta JSON:', parseError);
      throw new Error('O formato da resposta da API é inválido. Tente novamente com outro modelo ou tema diferente.');
    }
  } catch (error) {
    console.error('Erro ao gerar conversa com o Gemini:', error);
    if (error instanceof Error) {
      // Melhorar as mensagens de erro comuns
      if (error.message.includes('API key')) {
        throw new Error('API key inválida ou não autorizada. Verifique se a chave foi digitada corretamente.');
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        throw new Error('Limite de cota excedido para esta API key. Tente novamente mais tarde ou use outro modelo.');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Error('Erro de conexão com a API do Google. Verifique sua conexão com a internet.');
      }
    }
    throw error;
  }
};