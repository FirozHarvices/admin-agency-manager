import { Building2 } from "lucide-react";
import { ReusableModal } from "../../../components/ui/ReusableModal";
import { AgencyCreationForm } from "./AgencyCreationForm";

interface CreateAgencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateAgencyModal({ isOpen, onClose }: CreateAgencyModalProps) {
  const handleAgencyCreated = () => {
    onClose();
  };

  return (
    <ReusableModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Agency"
      description="Set up a new agency with custom resource limits and billing configuration."
      maxWidth="4xl"
      icon={<Building2 className="w-5 h-5 text-[#5D50FE]" />}
    >
      <div className="py-4">
        <AgencyCreationForm onAgencyCreated={handleAgencyCreated} />
      </div>
    </ReusableModal>
  );
}
