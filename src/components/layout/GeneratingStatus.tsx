import { CheckCircle, CircleDashed } from 'lucide-react';
import { cn } from '../../lib/utils';

interface GeneratingStatusProps {
  steps: string[];
  currentStepIndex: number;
}

export const GeneratingStatus = ({ steps, currentStepIndex }: GeneratingStatusProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 w-full h-full">
      <h2 className="text-xl font-bold mb-2">Generating your personalized AI website</h2>
      <p className="text-gray-500 text-sm mb-8">Please wait a moment...</p>

      <ul className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex + 1;

          return (
            <li key={index} className="flex items-center gap-3">
              {isCompleted ? (
                <CheckCircle className="w-5 h-5 text-brand-primary" />
              ) : (
                <CircleDashed 
                  className={cn(
                    "w-5 h-5 text-gray-300",
                    isCurrent && "animate-spin text-brand-primary"
                  )} 
                />
              )}
              <span className={cn(
                "transition-colors",
                isCompleted ? "text-gray-800" : "text-gray-400",
                isCurrent && "font-semibold text-brand-primary"
              )}>
                {step}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};