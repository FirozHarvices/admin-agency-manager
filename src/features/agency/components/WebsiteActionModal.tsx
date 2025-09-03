import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components/ui/alert-dialog';
import { Button } from '../../../components/ui/button';
import { Trash2, Pause, Play, Globe } from 'lucide-react';

interface WebsiteActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  website: { id: number; name: string; url: string; status?: 'active' | 'suspended' } | null;
  actionType: 'delete' | 'suspend' | 'reactivate';
  isLoading?: boolean;
}

const actionConfig = {
  delete: {
    title: 'Delete Website',
    description: 'Are you sure you want to delete this website? This action cannot be undone and will permanently remove all associated data.',
    confirmText: 'Delete Website',
    icon: Trash2,
    variant: 'destructive' as const,
  },
  suspend: {
    title: 'Suspend Website',
    description: 'Are you sure you want to suspend this website? The website will be temporarily disabled until reactivated.',
    confirmText: 'Suspend Website',
    icon: Pause,
    variant: 'default' as const,
  },
  reactivate: {
    title: 'Reactivate Website',
    description: 'Are you sure you want to reactivate this website? The website will be enabled again with full access.',
    confirmText: 'Reactivate Website',
    icon: Play,
    variant: 'default' as const,
  },
};

export function WebsiteActionModal({
  isOpen,
  onClose,
  onConfirm,
  website,
  actionType,
  isLoading = false,
}: WebsiteActionModalProps) {
  if (!website) return null;

  const config = actionConfig[actionType];
  const IconComponent = config.icon;

  return (
    <AlertDialog open={isOpen} onOpenChange={isLoading ? undefined : onClose}>
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
            <Globe className="w-4 h-4 text-blue-500" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">
                {website.name}
              </span>
              <span className="text-xs text-gray-500">
                {website.url}
              </span>
            </div>
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
          <Button
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
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
