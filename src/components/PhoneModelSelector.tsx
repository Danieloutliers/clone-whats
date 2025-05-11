import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type PhoneModel = 'iphone' | 'android' | 'samsung' | 'pixel';

interface PhoneModelSelectorProps {
  selectedModel: PhoneModel;
  onSelectModel: (model: PhoneModel) => void;
}

const PhoneModelSelector: React.FC<PhoneModelSelectorProps> = ({
  selectedModel,
  onSelectModel
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 mb-4">
      <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-800 dark:text-white text-center">
        Selecione o Modelo do Celular
      </h3>
      
      <RadioGroup 
        defaultValue={selectedModel}
        onValueChange={(value) => onSelectModel(value as PhoneModel)}
        className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4"
      >
        <div>
          <RadioGroupItem 
            value="iphone" 
            id="iphone" 
            className="peer sr-only" 
          />
          <Label 
            htmlFor="iphone" 
            className={cn(
              "flex flex-col items-center justify-center rounded-lg border-2 border-gray-200 p-2 sm:p-4 hover:bg-gray-50 cursor-pointer",
              "dark:border-gray-700 dark:hover:bg-gray-700",
              "peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 dark:peer-checked:border-blue-500",
              "transition-all duration-200"
            )}
          >
            <div className="mb-2 sm:mb-3 w-10 sm:w-12 h-16 sm:h-20 rounded-lg bg-black flex items-center justify-center">
              <div className="w-8 sm:w-10 h-12 sm:h-16 bg-white rounded-sm"></div>
            </div>
            <div className="text-sm sm:text-base font-medium">iPhone</div>
          </Label>
        </div>

        <div>
          <RadioGroupItem 
            value="android" 
            id="android" 
            className="peer sr-only" 
          />
          <Label 
            htmlFor="android" 
            className={cn(
              "flex flex-col items-center justify-center rounded-lg border-2 border-gray-200 p-2 sm:p-4 hover:bg-gray-50 cursor-pointer",
              "dark:border-gray-700 dark:hover:bg-gray-700",
              "peer-checked:border-green-500 peer-checked:bg-green-50 dark:peer-checked:bg-green-900/20 dark:peer-checked:border-green-500",
              "transition-all duration-200"
            )}
          >
            <div className="mb-2 sm:mb-3 w-10 sm:w-12 h-16 sm:h-20 rounded-lg bg-green-700 flex items-center justify-center">
              <div className="w-8 sm:w-10 h-12 sm:h-16 bg-white rounded-sm"></div>
            </div>
            <div className="text-sm sm:text-base font-medium">Android</div>
          </Label>
        </div>

        <div>
          <RadioGroupItem 
            value="samsung" 
            id="samsung" 
            className="peer sr-only" 
          />
          <Label 
            htmlFor="samsung" 
            className={cn(
              "flex flex-col items-center justify-center rounded-lg border-2 border-gray-200 p-2 sm:p-4 hover:bg-gray-50 cursor-pointer",
              "dark:border-gray-700 dark:hover:bg-gray-700",
              "peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-900/20 dark:peer-checked:border-indigo-500",
              "transition-all duration-200"
            )}
          >
            <div className="mb-2 sm:mb-3 w-10 sm:w-12 h-16 sm:h-20 rounded-lg bg-indigo-600 flex items-center justify-center">
              <div className="w-8 sm:w-10 h-12 sm:h-16 bg-white rounded-sm"></div>
            </div>
            <div className="text-sm sm:text-base font-medium">Samsung</div>
          </Label>
        </div>

        <div>
          <RadioGroupItem 
            value="pixel" 
            id="pixel" 
            className="peer sr-only" 
          />
          <Label 
            htmlFor="pixel" 
            className={cn(
              "flex flex-col items-center justify-center rounded-lg border-2 border-gray-200 p-2 sm:p-4 hover:bg-gray-50 cursor-pointer",
              "dark:border-gray-700 dark:hover:bg-gray-700",
              "peer-checked:border-orange-500 peer-checked:bg-orange-50 dark:peer-checked:bg-orange-900/20 dark:peer-checked:border-orange-500",
              "transition-all duration-200"
            )}
          >
            <div className="mb-2 sm:mb-3 w-10 sm:w-12 h-16 sm:h-20 rounded-lg bg-gray-800 flex items-center justify-center">
              <div className="w-8 sm:w-10 h-12 sm:h-16 bg-white rounded-sm relative">
                <div className="absolute top-1 sm:top-2 left-1 sm:left-2 w-4 sm:w-6 h-4 sm:h-6 rounded-full bg-orange-500"></div>
              </div>
            </div>
            <div className="text-sm sm:text-base font-medium">Pixel</div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default PhoneModelSelector;