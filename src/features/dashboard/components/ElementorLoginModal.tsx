import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/ui/dialog';

interface ElementorLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (username: string, password: string) => Promise<void>;
  siteUrl: string | null;
  isLoading: boolean;
}

export const ElementorLoginModal = ({ isOpen, onClose, onSubmit, siteUrl, isLoading }: ElementorLoginModalProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    onSubmit(username, password);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Admin Credentials</DialogTitle>
          <DialogDescription>
            For <span className="font-semibold text-brand-primary">{siteUrl}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <Input 
            label="Username"
            id="elementor-username"
            placeholder="WordPress Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input 
            label="Password"
            id="elementor-password"
            type="password"
            placeholder="WordPress Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Login & Edit'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};