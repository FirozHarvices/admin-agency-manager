import React from "react";
import { WizardHeader } from "./WizardHeader";
import WizardFooter from "./WizardFooter";

interface WizardLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  onNext: () => void;
  onBack: () => void;
  isNextDisabled?: boolean;
  nextButtonText?: string;
}

export const WizardLayout = ({
  children,
  currentStep,
  onNext,
  onBack,
  isNextDisabled = false,
  nextButtonText = "Next",
}: WizardLayoutProps) => {
  return (
    <div className="h-screen bg-page-bg w-full flex flex-col p-4 px-8 ">
        <WizardHeader />

      <main className="flex-1 overflow-hidden">{children}</main>

      <WizardFooter
        onBack={onBack}
        currentStep={currentStep}
        nextButtonText={nextButtonText}
        onNext={onNext}
        isNextDisabled={isNextDisabled}
      />
    </div>
  );
};
