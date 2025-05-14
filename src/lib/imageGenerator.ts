/**
 * Módulo para gerar imagens para as conversas
 * Usa o serviço Unsplash como fonte de imagens gratuitas baseadas em palavras-chave
 */

// Função para buscar uma imagem aleatória baseada em uma palavra-chave
export const generateImageFromText = async (text: string): Promise<string | undefined> => {
  try {
    // Extrair palavras-chave do texto (máximo 2 palavras para melhor resultado)
    const keywords = extractKeywords(text);
    if (!keywords) return undefined;

    // Montando a URL da Unsplash Source (serviço gratuito sem necessidade de API key)
    const width = 400;
    const height = 300;
    const query = encodeURIComponent(keywords);
    const imageUrl = `https://source.unsplash.com/random/${width}x${height}/?${query}`;
    
    // Faz um fetch para obter a URL real da imagem após redirecionamentos
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      console.error('Erro ao buscar imagem:', response.status);
      return undefined;
    }
    
    // Retorna a URL final (após redirecionamentos)
    return response.url;
  } catch (error) {
    console.error('Erro ao gerar imagem:', error);
    return undefined;
  }
};

// Função auxiliar para extrair palavras-chave relevantes do texto
const extractKeywords = (text: string): string | undefined => {
  if (!text || text.trim().length < 3) return undefined;

  // Lista de palavras a serem removidas (stop words)
  const stopWords = [
    'e', 'do', 'da', 'dos', 'das', 'no', 'na', 'nos', 'nas', 'o', 'a', 'os', 'as',
    'um', 'uma', 'uns', 'umas', 'de', 'para', 'com', 'em', 'por', 'pelo', 'pela',
    'que', 'se', 'ou', 'como', 'mas', 'eu', 'tu', 'ele', 'ela', 'nós', 'vós', 'eles',
    'elas', 'você', 'vocês', 'este', 'esta', 'isto', 'esse', 'essa', 'isso',
    'aquele', 'aquela', 'aquilo', 'tudo', 'nada', 'algo', 'algum', 'alguma', 'alguns',
    'algumas', 'muito', 'muita', 'muitos', 'muitas', 'pouco', 'pouca', 'poucos',
    'poucas', 'todo', 'toda', 'todos', 'todas'
  ];

  // Remover caracteres especiais e converter para minúsculas
  const cleanText = text.toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, ' ');

  // Dividir em palavras e filtrar as stop words
  const words = cleanText.split(' ')
    .filter(word => word.length > 3)
    .filter(word => !stopWords.includes(word));

  // Selecionar até 2 palavras mais longas (provavelmente mais significativas)
  let keywords = words
    .sort((a, b) => b.length - a.length)
    .slice(0, 2)
    .join(',');

  // Se não tiver palavras suficientes após filtragem, retornar undefined
  if (!keywords || keywords.length < 3) return undefined;

  return keywords;
};

// Função para verificar se um texto deve ter uma imagem gerada
// (para não tentar gerar imagens para textos muito curtos ou irrelevantes)
export const shouldGenerateImage = (text: string): boolean => {
  // Textos muito curtos não merecem imagens
  if (text.length < 20) return false;
  
  // Mensagens que são apenas emoticons não merecem imagens
  if (/^[\s:;()]+$/.test(text)) return false;
  
  // Verificar se existem substantivos ou palavras relevantes
  const hasRelevantContent = extractKeywords(text) !== undefined;
  
  // Gerar imagem com uma probabilidade de ~30% para mensagens relevantes
  // (para não sobrecarregar a conversa com muitas imagens)
  return hasRelevantContent && Math.random() < 0.3;
};