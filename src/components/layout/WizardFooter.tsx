import { Button } from "../ui/Button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Stepper } from "../../features/create-project/components/Stepper";
import { totalSteps } from "../../data/constants/stepData";

const WizardFooter = ({
  onBack,
  currentStep,
  nextButtonText,
  onNext,
  isNextDisabled,
}: any) => {
  return (
    <footer className="flex-shrink-0 flex items-center justify-between mt-4 lg:mt-4">
      <Button className="rounded-3xl font-medium cursor-pointer" variant="ghost" onClick={onBack} disabled={currentStep === 1}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>
      <div className="hidden sm:flex">
        <Stepper currentStep={currentStep} />
      </div>
      <Button
        onClick={onNext}
        disabled={isNextDisabled || currentStep === totalSteps}
        className="rounded-3xl cursor-pointer"
      >
        {nextButtonText} <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </footer>
  );
};

export default WizardFooter;
