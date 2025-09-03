import { History } from "lucide-react";
import { ReusableModal } from "../../../components/ui/ReusableModal";
import { TopUpHistory } from "./TopupHistory";
import { Agency } from "../types";

interface TopUpHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  agencies: Agency[];
  isLoadingAgencies: boolean;
}

export function TopUpHistoryModal({ 
  isOpen, 
  onClose, 
  agencies, 
  isLoadingAgencies 
}: TopUpHistoryModalProps) {
  return (
    <ReusableModal
      isOpen={isOpen}
      onClose={onClose}
      title="Top-Up History"
      description="Track all resource top-ups and billing transactions."
      maxWidth="4xl"
      icon={<History className="w-5 h-5 text-[#5D50FE]" />}
    >
      <div className="py-4">
        <TopUpHistory agencies={agencies} isLoading={isLoadingAgencies} />
      </div>
    </ReusableModal>
  );
}
