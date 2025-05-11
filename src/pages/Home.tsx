import React from 'react';
import WhatsAppGenerator from '@/components/WhatsAppGenerator';
import { Toaster } from '@/components/ui/toaster';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <header className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Gerador de Chat Falso do WhatsApp
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2">
            Crie conversas falsas do WhatsApp com mensagens personalizáveis, fotos de perfil, 
            emojis e muito mais. Compartilhe com seus amigos!
          </p>
        </header>
        
        <WhatsAppGenerator />
        <Toaster />
      </div>
      
      <footer className="mt-8 sm:mt-12 py-4 sm:py-6 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <p>Este gerador de chat é apenas para fins de entretenimento.</p>
          <p className="mt-2">© {new Date().getFullYear()} Gerador de Chat Falso do WhatsApp</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
