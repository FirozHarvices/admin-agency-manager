"use client";

import { useState, useEffect } from "react";
import {
  Database,
  Cpu,
  Globe,
  ImageIcon,
  Plus,
  Building2,
  DollarSign,
} from "lucide-react";
import { type Agency, type TopUpAgencyPayload } from "../types"; // Make sure types are correctly imported
import { useTopUpAgency } from "../hooks/useAgencyMutations"; // The mutation hook for the API call
import { useSystemData } from "../hooks/useSystemData";

// UI Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/Select";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Separator } from "../../../components/ui/separator";
import { Badge } from "../../../components/ui/badge";
import { currencyOptions } from "../../UserMaster/data/dummy-data";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";

// --- Props Interface ---
interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  agency: Agency;
}

// --- Local State for the Form ---
interface TopUpFormState {
  storage: number;
  tokens: number;
  websites: number;
  images: number;
  amount: number;
  currency: string;
}

const initialFormState: TopUpFormState = {
  storage: 0,
  tokens: 0,
  websites: 0,
  images: 0,
  amount: 0,
  currency: "USD",
};

const presetOptions = {
  storage: [600, 1000, 5000, 10000, 20000],
  tokens: [20000, 50000, 100000, 500000, 1000000],
  websites: [1,5, 10, 25, 50],
  images: [35, 100, 250, 500, 1000],
};

export function TopUpModal({ isOpen, onClose, agency }: TopUpModalProps) {
  const [formState, setFormState] = useState<TopUpFormState>(initialFormState);
  const topUpMutation = useTopUpAgency();
  const { data: systemData } = useSystemData();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<TopUpAgencyPayload | null>(null);

  // Reset the form whenever the modal is opened
  useEffect(() => {
    if (isOpen) {
      setFormState(initialFormState);
    }
  }, [isOpen]);

  const handleInputChange = (
    field: keyof TopUpFormState,
    value: string | number
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // 1. Validation
    const totalResourcesAdded =
      formState.storage +
      formState.tokens +
      formState.websites +
      formState.images;
    if (totalResourcesAdded === 0) {
      toast.error("Please add at least one resource to top up.")
      
      return;
    }
    // if (formState.amount <= 0) {
    //         toast.error("Please enter a valid billing amount for this top-up")
    //   return;
    // }

    const payload: TopUpAgencyPayload = {
      id: agency.id,
      top_up: true,
      storage: formState.storage,
      token_count: formState.tokens,
      website_count: formState.websites,
      image_count: formState.images,
      amount: formState.amount,
      currency: formState.currency,
    };

    // Compute available capacity in MB if system data exists
    const availableMB = systemData
      ? Math.max(
          (systemData.workerNodeStorageGB - systemData.agencyAllottedGB) * 1000,
          0
        )
      : undefined;

    // If requesting more than available, ask for confirmation
    if (availableMB !== undefined && payload.storage > availableMB) {
      setPendingPayload(payload);
      setConfirmOpen(true);
      return;
    }

    // 3. Execute the Mutation
    topUpMutation.mutate(payload, {
      onSuccess: () => {
        onClose(); // Close the modal only on a successful API call
        // The success toast is likely handled inside the useTopUpAgency hook
      },
      // onError is also handled globally/in the hook
    });
  };

  const formatResourceDisplay = (type: string, value: number) => {
    switch (type) {
      case "storage":
        return `${(value / 1000).toFixed(1)} GB`;
      case "tokens":
        return `${(value / 1000).toFixed(0)}K tokens`;
      case "websites":
        return `${value} websites`;
      case "images":
        return `${value} credits`;
      default:
        return value.toString();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#1A202C]">
            <Building2 className="w-5 h-5 text-[#5D50FE]" />
            Top Up Resources - {agency.name}
          </DialogTitle>
          <DialogDescription className="text-[#718096]">
            Add additional resources to this agency's allocation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Limits Display */}
          <div className="bg-[#F3F2FF] p-4 rounded-lg border border-[#E2E8F0]">
            <h4 className="font-medium text-[#1A202C] mb-3">Current Limits</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#5D50FE]" />
                <span>{(agency.storage / 1000).toFixed(1)} GB</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#5D50FE]" />
                <span>{(agency.token_count / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#5D50FE]" />
                <span>{agency.website_count} sites</span>
              </div>
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#5D50FE]" />
                <span>{agency.image_count} credits</span>
              </div>
            </div>
          </div>

          {/* Storage Top-Up */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#5D50FE]" />
              <Label className="text-[#1A202C] font-medium">Storage (MB)</Label>
            </div>
            <div className="flex gap-2 flex-wrap">
              {presetOptions.storage.map((value) => (
                <Button
                  key={value}
                  variant="outline"
                  size="sm"
                  onClick={() => handleInputChange("storage", value)}
                  className={`border-[#E2E8F0] ${
                    formState.storage === value
                      ? "bg-[#5D50FE] text-white hover:bg-[#4A3FE7]"
                      : ""
                  }`}
                >
                  +{(value / 1000).toFixed(1)} GB
                </Button>
              ))}
            </div>
            <Input
              type="number"
              placeholder="Custom amount (MB)"
              value={formState.storage || ""}
              onChange={(e) =>
                handleInputChange(
                  "storage",
                  Number.parseInt(e.target.value) || 0
                )
              }
              className="border-[#E2E8F0] focus:border-[#5D50FE]"
            />
          </div>

          <Separator className="bg-[#E2E8F0]" />

          {/* Token Top-Up */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#5D50FE]" />
              <Label className="text-[#1A202C] font-medium">AI Tokens</Label>
            </div>
            <div className="flex gap-2 flex-wrap">
              {presetOptions.tokens.map((value) => (
                <Button
                  key={value}
                  variant="outline"
                  size="sm"
                  onClick={() => handleInputChange("tokens", value)}
                  className={`border-[#E2E8F0] ${
                    formState.tokens === value
                      ? "bg-[#5D50FE] text-white hover:bg-[#4A3FE7]"
                      : ""
                  }`}
                >
                  +{(value / 1000).toFixed(0)}K
                </Button>
              ))}
            </div>
            <Input
              type="number"
              placeholder="Custom token amount"
              value={formState.tokens || ""}
              onChange={(e) =>
                handleInputChange(
                  "tokens",
                  Number.parseInt(e.target.value) || 0
                )
              }
              className="border-[#E2E8F0] focus:border-[#5D50FE]"
            />
          </div>

          <Separator className="bg-[#E2E8F0]" />

          {/* Website Top-Up */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#5D50FE]" />
              <Label className="text-[#1A202C] font-medium">
                Website Slots
              </Label>
            </div>
            <div className="flex gap-2 flex-wrap">
              {presetOptions.websites.map((value) => (
                <Button
                  key={value}
                  variant="outline"
                  size="sm"
                  onClick={() => handleInputChange("websites", value)}
                  className={`border-[#E2E8F0] ${
                    formState.websites === value
                      ? "bg-[#5D50FE] text-white hover:bg-[#4A3FE7]"
                      : ""
                  }`}
                >
                  +{value} sites
                </Button>
              ))}
            </div>
            <Input
              type="number"
              placeholder="Custom website count"
              value={formState.websites || ""}
              onChange={(e) =>
                handleInputChange(
                  "websites",
                  Number.parseInt(e.target.value) || 0
                )
              }
              className="border-[#E2E8F0] focus:border-[#5D50FE]"
            />
          </div>

          <Separator className="bg-[#E2E8F0]" />

          {/* Image Top-Up */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#5D50FE]" />
              <Label className="text-[#1A202C] font-medium">
                Image Credits
              </Label>
            </div>
            <div className="flex gap-2 flex-wrap">
              {presetOptions.images.map((value) => (
                <Button
                  key={value}
                  variant="outline"
                  size="sm"
                  onClick={() => handleInputChange("images", value)}
                  className={`border-[#E2E8F0] ${
                    formState.images === value
                      ? "bg-[#5D50FE] text-white hover:bg-[#4A3FE7]"
                      : ""
                  }`}
                >
                  +{value} credits
                </Button>
              ))}
            </div>
            <Input
              type="number"
              placeholder="Custom image credits"
              value={formState.images || ""}
              onChange={(e) =>
                handleInputChange(
                  "images",
                  Number.parseInt(e.target.value) || 0
                )
              }
              className="border-[#E2E8F0] focus:border-[#5D50FE]"
            />
          </div>

          <Separator className="bg-[#E2E8F0]" />

          {/* Billing Information */}
          <div className="pt-2 space-y-4">
            <Badge
              variant="outline"
              className="bg-[#F3F2FF] text-[#5D50FE] border-[#5D50FE]"
            >
              Billing Information
            </Badge>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-[#1A202C] font-medium">
                  Amount *
                </Label>
                <div className="relative">
                  <DollarSign className="absolute w-4 h-4 left-3 top-3 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formState.amount}
                    onChange={(e) =>
                      handleInputChange(
                        "amount",
                        Number.parseFloat(e.target.value)
                      )
                    }
                    className="pl-10 border-[#E2E8F0] focus:border-[#5D50FE]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[#1A202C] font-medium">Currency *</Label>
                <Select
                  value={formState.currency}
                  onValueChange={(value) =>
                    handleInputChange("currency", value)
                  }
                >
                  <SelectTrigger className="border-[#E2E8F0] focus:border-[#5D50FE]">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          {Object.values(formState).some((v) => v > 0) && (
            <div className="bg-[#F3F2FF] p-4 rounded-lg border border-[#E2E8F0]">
              <h4 className="font-medium text-[#1A202C] mb-3">
                Top-Up Summary
              </h4>
              <div className="space-y-2">
                {Object.entries(formState).map(([key, value]) => {
                  if (
                    typeof value === "number" &&
                    value > 0 &&
                    key !== "amount" &&
                    key !== "currency"
                  ) {
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="capitalize text-muted-foreground">
                          {key}:
                        </span>
                        <Badge
                          variant="outline"
                          className="bg-white text-[#5D50FE] border-[#5D50FE]"
                        >
                          +{formatResourceDisplay(key, value)}
                        </Badge>
                      </div>
                    );
                  }
                  return null;
                })}
                <Separator className="my-2" />
                <div className="flex items-center justify-between font-semibold">
                  <span>Total Cost:</span>
                  <span>
                    {
                      currencyOptions.find(
                        (c) => c.value === formState.currency
                      )?.symbol
                    }
                    {formState.amount.toFixed(2)} {formState.currency}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#E2E8F0] bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={topUpMutation.isPending}
            className="bg-[#5D50FE] text-white hover:bg-[#4A3FE7] disabled:bg-opacity-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            {topUpMutation.isPending ? "Applying..." : "Apply Top-Up"}
          </Button>
        </div>
        {/* Confirmation dialog when requested storage exceeds available */}
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Requested storage exceeds available capacity</AlertDialogTitle>
              <AlertDialogDescription>
                {(() => {
                  const availableGB = systemData
                    ? Math.max(
                        systemData.workerNodeStorageGB - systemData.agencyAllottedGB,
                        0
                      )
                    : 0;
                  return (
                    <div>
                      <p>
                        You're trying to add {(formState.storage / 1000).toFixed(1)} GB, but only {availableGB.toFixed(1)} GB is currently available.
                      </p>
                      <p className="mt-2">Do you want to proceed anyway?</p>
                    </div>
                  );
                })()}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setConfirmOpen(false);
                setPendingPayload(null);
              }}>Go back</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                if (pendingPayload) {
                  topUpMutation.mutate(pendingPayload, {
                    onSuccess: () => {
                      setConfirmOpen(false);
                      setPendingPayload(null);
                      onClose();
                    },
                  });
                } else {
                  setConfirmOpen(false);
                }
              }}>Proceed anyway</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}
