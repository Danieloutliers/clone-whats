import html2canvas from 'html2canvas';

// Verifica se o dispositivo é iOS
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

// Verifica se está rodando como PWA
const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
              (window.navigator as any).standalone || 
              document.referrer.includes('android-app://');

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

// Função para salvar a imagem, compatível com PWA
export const saveImage = async (dataUrl: string, fileName: string): Promise<boolean> => {
  if (!dataUrl) return false;
  
  try {
    // Se for PWA em iOS, usa um método alternativo de download
    if (isPWA && isIOS) {
      const img = document.createElement('img');
      img.src = dataUrl;
      img.style.maxWidth = '100%';
      
      const modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.backgroundColor = 'rgba(0,0,0,0.9)';
      modal.style.zIndex = '9999';
      modal.style.display = 'flex';
      modal.style.flexDirection = 'column';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      modal.style.padding = '20px';
      
      const instructions = document.createElement('p');
      instructions.textContent = 'Mantenha pressionada a imagem e selecione "Salvar imagem"';
      instructions.style.color = 'white';
      instructions.style.marginBottom = '20px';
      instructions.style.textAlign = 'center';
      
      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Fechar';
      closeBtn.style.padding = '10px 20px';
      closeBtn.style.backgroundColor = '#075e54';
      closeBtn.style.color = 'white';
      closeBtn.style.border = 'none';
      closeBtn.style.borderRadius = '4px';
      closeBtn.style.marginTop = '20px';
      closeBtn.style.cursor = 'pointer';
      
      closeBtn.onclick = () => document.body.removeChild(modal);
      
      modal.appendChild(instructions);
      modal.appendChild(img);
      modal.appendChild(closeBtn);
      
      document.body.appendChild(modal);
      return true;
    } 
    // Para PWA em Android ou navegador normal
    else {
      // Tenta usar a nova File System Access API (navegadores modernos)
      if ('showSaveFilePicker' in window) {
        try {
          const handle = await (window as any).showSaveFilePicker({
            suggestedName: fileName,
            types: [{
              description: 'PNG Image',
              accept: {'image/png': ['.png']},
            }],
          });
          
          const writable = await handle.createWritable();
          
          // Converte o dataURL para um blob
          const blob = await (await fetch(dataUrl)).blob();
          
          await writable.write(blob);
          await writable.close();
          return true;
        } catch (err) {
          // Se o usuário cancelar ou a API falhar, usamos o método tradicional
          console.warn('File System Access API falhou, usando método alternativo', err);
        }
      }
      
      // Método tradicional de download como fallback
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    }
  } catch (error) {
    console.error('Erro ao salvar imagem:', error);
    return false;
  }
};

export default html2canvas;
