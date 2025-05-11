import html2canvas from 'html2canvas';

// Configuração para melhorar a qualidade da imagem e manter a resolução 1080x1920
export const captureScreenshot = async (element: HTMLElement, bgColor: string = '#E5DDD5'): Promise<string> => {
  if (!element) return '';
  
  try {
    // Antes de capturar, certifique-se que os estilos estão todos carregados
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Configura o html2canvas para uma captura de alta qualidade que pareça um print real
    const canvas = await html2canvas(element, {
      allowTaint: true,
      useCORS: true,
      scale: 3, // Escala balanceada para evitar problemas de renderização
      backgroundColor: bgColor,
      logging: true, // Ativado para debug
      imageTimeout: 0, // Sem timeout para garantir carregamento
      removeContainer: false, // Mantém o contêiner para evitar problemas
      foreignObjectRendering: false, // Desativado para melhor compatibilidade
      onclone: (doc, clonedElement) => {
        // Processa todos os elementos para garantir que os estilos são aplicados
        const allElements = clonedElement.querySelectorAll('*');
        allElements.forEach(el => {
          if (el instanceof HTMLElement) {
            // Preserva transformações importantes, mas remove transições
            el.style.transition = 'none';
            
            // Força a renderização de imagens de fundo
            const computedStyle = window.getComputedStyle(el);
            if (computedStyle.backgroundImage && computedStyle.backgroundImage !== 'none') {
              // Resolve URLs completas para imagens de fundo
              let bgImage = computedStyle.backgroundImage;
              if (bgImage.includes('url(')) {
                // Clone o elemento com suas propriedades de fundo já aplicadas
                el.style.backgroundImage = bgImage;
                el.style.backgroundSize = computedStyle.backgroundSize || 'cover';
                el.style.backgroundPosition = computedStyle.backgroundPosition || 'center';
                el.style.backgroundRepeat = computedStyle.backgroundRepeat || 'no-repeat';
              }
            }
          }
        });
        
        // Adiciona um delay para permitir que o DOM clonado seja renderizado corretamente
        return new Promise(resolve => setTimeout(resolve, 300));
      }
    });
    
    // Aumenta a qualidade da compressão da imagem PNG
    return canvas.toDataURL('image/png', 1.0);
  } catch (error) {
    console.error('Failed to capture screenshot', error);
    return '';
  }
};

export default html2canvas;
