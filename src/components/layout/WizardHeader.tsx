import { Sparkles } from 'lucide-react';

export const WizardHeader = () => {
  return (
    <header className="flex-shrink-0 mb-4 lg:mb-4">
      <div className="flex items-center">
        <Sparkles className="h-6 w-6 text-brand-primary mr-2" />
        <span className="text-lg font-bold text-brand-secondary">
          Magicpagez
        </span>
      </div>
    </header>
  );
};