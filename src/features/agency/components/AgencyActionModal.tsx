import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components/ui/alert-dialog';
import { Agency } from '../types';
import { Trash2, Pause, Play, AlertTriangle } from 'lucide-react';

interface AgencyActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  agency: Agency | null;
  actionType: 'delete' | 'suspend' | 'reactivate';
  isLoading?: boolean;
}

const actionConfig = {
  delete: {
    title: 'Delete Agency',
    description: 'Are you sure you want to delete this agency? This action cannot be undone and will permanently remove all associated data.',
    confirmText: 'Delete Agency',
    icon: Trash2,
    variant: 'destructive' as const,
  },
  suspend: {
    title: 'Suspend Agency',
    description: 'Are you sure you want to suspend this agency? The agency will be temporarily disabled until reactivated.',
    confirmText: 'Suspend Agency',
    icon: Pause,
    variant: 'default' as const,
  },
  reactivate: {
    title: 'Reactivate Agency',
    description: 'Are you sure you want to reactivate this agency? The agency will be enabled again with full access.',
    confirmText: 'Reactivate Agency',
    icon: Play,
    variant: 'default' as const,
  },
};

export function AgencyActionModal({
  isOpen,
  onClose,
  onConfirm,
  agency,
  actionType,
  isLoading = false,
}: AgencyActionModalProps) {
  if (!agency) return null;

  const config = actionConfig[actionType];
  const IconComponent = config.icon;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              actionType === 'delete' 
                ? 'bg-red-100 text-red-600' 
                : actionType === 'suspend'
                ? 'bg-yellow-100 text-yellow-600'
                : 'bg-green-100 text-green-600'
            }`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <AlertDialogTitle className="text-left">
              {config.title}
            </AlertDialogTitle>
          </div>
        </AlertDialogHeader>
        
        <AlertDialogDescription className="text-left space-y-3">
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-gray-700">
              {agency.name}
            </span>
          </div>
          <p className="text-gray-600">
            {config.description}
          </p>
        </AlertDialogDescription>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel 
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 sm:flex-none ${
              actionType === 'delete' 
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-600' 
                : ''
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              config.confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
