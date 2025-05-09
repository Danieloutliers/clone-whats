import React, { useState, useRef } from 'react';
import { useChatStore } from '@/hooks/use-chat-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const ChatSettings: React.FC = () => {
  const { 
    isDarkMode, 
    setIsDarkMode,
    contactName,
    setContactName,
    profilePic,
    setProfilePic,
    statusTime,
    setStatusTime,
    batteryLevel,
    setBatteryLevel
  } = useChatStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "Por favor, escolha uma imagem menor que 2MB.",
        variant: "destructive",
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setProfilePic(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleChangeProfileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleBatteryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setBatteryLevel(Math.min(Math.max(value, 1), 100));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        <i className="fas fa-cog mr-2"></i>Configurações do Chat
      </h2>
      
      <div className="space-y-4">
        {/* Theme toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="themeToggle" className="text-gray-700 dark:text-gray-300 font-medium">
            Modo escuro
          </Label>
          <div className="relative inline-block w-12 align-middle select-none">
            <input 
              type="checkbox" 
              id="themeToggle" 
              checked={isDarkMode}
              onChange={() => setIsDarkMode(!isDarkMode)}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-whatsapp-green transition-all duration-200"
            />
            <label 
              htmlFor="themeToggle" 
              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
            ></label>
          </div>
        </div>
        
        {/* Contact info */}
        <div>
          <Label htmlFor="contactName" className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            Nome do Contato
          </Label>
          <Input 
            type="text" 
            id="contactName" 
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-whatsapp-green"
          />
        </div>
        
        {/* Profile picture */}
        <div>
          <Label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            Foto de Perfil
          </Label>
          <div className="flex items-center space-x-3">
            <div className="h-14 w-14 rounded-full bg-gray-200 overflow-hidden">
              <img 
                src={profilePic || 'https://via.placeholder.com/100'} 
                alt="Foto de perfil" 
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleProfilePicChange}
                className="hidden" 
                accept="image/*"
              />
              <Button
                onClick={handleChangeProfileClick}
                className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-md text-sm transition"
              >
                Escolher foto
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Recomendado: 200x200px
              </p>
            </div>
          </div>
        </div>
        
        {/* Status bar settings */}
        <div>
          <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">
            Barra de Status
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="timeDisplay" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                Horário
              </Label>
              <Input 
                type="time" 
                id="timeDisplay" 
                value={statusTime}
                onChange={(e) => setStatusTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-whatsapp-green"
              />
            </div>
            <div>
              <Label htmlFor="batteryLevel" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                Bateria (%)
              </Label>
              <Input 
                type="number" 
                id="batteryLevel" 
                min="1" 
                max="100" 
                value={batteryLevel}
                onChange={handleBatteryChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-whatsapp-green"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSettings;
