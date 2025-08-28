import React, { useEffect, useState } from 'react';
import { Agency } from '../types';
import { useUpdateAgency, useVerifyOtp } from '../hooks/useAgencyMutations';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Mail, Phone, Building2, Save, Shield, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface EditAgencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  agency: Agency | null;
}

type FlowStep = 'edit' | 'verify-code' | 'success';

export function EditAgencyModal({ isOpen, onClose, agency }: EditAgencyModalProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [originalEmail, setOriginalEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [currentStep, setCurrentStep] = useState<FlowStep>('edit');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [verificationError, setVerificationError] = useState('');
  
  const updateMutation = useUpdateAgency();
  const verifyOtpMutation = useVerifyOtp();

  useEffect(() => {
    if (isOpen && agency) {
      setEmail(agency.email || '');
      setPhone(agency.phone || '');
      setOriginalEmail(agency.email || '');
      setCurrentStep('edit');
      setVerificationCode(['', '', '', '', '', '']);
      setVerificationError('');
    }
  }, [isOpen, agency]);

  useEffect(() => {
    if (currentStep === 'verify-code' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    if (!agency) return;
    
    const emailChanged = email !== originalEmail;
    
    updateMutation.mutate(
      { id: agency.id, email, phone },
      {
        onSuccess: () => {
          if (emailChanged) {
            // Email changed, show verification step
            setCurrentStep('verify-code');
            setTimeLeft(120); // Reset timer
            toast.success('Verification code sent to your new email address');
          } else {
            // Only phone changed, close modal
            onClose();
          }
        },
        onError: (error) => {
          console.error('Update failed:', error);
        }
      }
    );
  };

  const handleVerificationSubmit = () => {
    if (!agency) return;
    
    const otp = verificationCode.join('');
    if (otp.length !== 6) {
      setVerificationError('Please enter all 6 digits');
      return;
    }

    setVerificationError('');
    
    verifyOtpMutation.mutate(
      { id: agency.id, email, otp },
      {
        onSuccess: () => {
          setCurrentStep('success');
          toast.success('Email verified successfully!');
        },
        onError: (error) => {
          setVerificationError(error.message || 'Invalid verification code');
        }
      }
    );
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      
      // Clear error when user starts typing
      if (verificationError) setVerificationError('');
      
      // Auto advance to next input
      if (value && index < 5) {
        const nextInput = document.querySelector(`input[data-index="${index + 1}"]`) as HTMLInputElement;
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.querySelector(`input[data-index="${index - 1}"]`) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  const resendCode = () => {
    if (!agency) return;
    
    setVerificationCode(['', '', '', '', '', '']);
    setTimeLeft(120);
    setVerificationError('');
    
    // Resend by calling the update API again
    updateMutation.mutate(
      { id: agency.id, email, phone },
      {
        onSuccess: () => {
          toast.success('New verification code sent to your email');
        }
      }
    );
  };

  const handleClose = () => {
    setCurrentStep('edit');
    setVerificationCode(['', '', '', '', '', '']);
    setVerificationError('');
    onClose();
  };

  if (!agency) return null;

  const renderEditForm = () => (
    <>
      <div className="space-y-5 py-2">
        <div className="space-y-2">
          <Label className="text-[#1A202C] font-medium">Email</Label>
          <div className="relative">
            <Mail className="absolute w-4 h-4 left-3 top-3 text-muted-foreground" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter agency email"
              className="pl-9 border-[#E2E8F0] focus:border-[#5D50FE]"
            />
          </div>
          {email !== originalEmail && (
            <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded-lg">
              <Shield className="w-4 h-4" />
              Email verification will be required after saving
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-[#1A202C] font-medium">Phone</Label>
          <div className="relative">
            <Phone className="absolute w-4 h-4 left-3 top-3 text-muted-foreground" />
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="pl-9 border-[#E2E8F0] focus:border-[#5D50FE]"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
        <Button 
          variant="outline" 
          onClick={handleClose} 
          className="border-[#E2E8F0] bg-transparent"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={updateMutation.isPending || (!email && !phone)} 
          className="bg-[#5D50FE] text-white hover:bg-[#4A3FE7] disabled:bg-opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </>
  );

  const renderVerifyCode = () => (
    <>
      <div className="space-y-5 py-2">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="font-semibold text-[#1A202C] mb-2">Verify Your New Email</h3>
          <p className="text-sm text-[#718096]">
            We've sent a 6-digit code to <br />
            <span className="font-medium text-[#1A202C]">{email}</span>
          </p>
        </div>

        {verificationError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-sm text-red-700">{verificationError}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label className="text-[#1A202C] font-medium text-sm mb-3 block">Enter verification code</Label>
            <div className="flex justify-center gap-2">
              {verificationCode.map((digit, index) => (
                <Input
                  key={index}
                  data-index={index}
                  type="text"
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-12 h-12 text-center border-2 rounded-lg text-lg font-semibold ${
                    verificationError 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-[#E2E8F0] focus:border-[#5D50FE]'
                  }`}
                  maxLength={1}
                />
              ))}
            </div>
          </div>

          <div className="text-center text-sm text-[#718096]">
            <p>Code expires in <span className="font-medium">{formatTime(timeLeft)}</span></p>
            <button
              onClick={resendCode}
              disabled={updateMutation.isPending}
              className="text-[#5D50FE] hover:text-[#4A3FE7] font-medium mt-2 hover:underline disabled:opacity-50"
            >
              {updateMutation.isPending ? 'Sending...' : "Didn't receive the code? Resend"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
        <Button 
          variant="outline"
          onClick={() => setCurrentStep('edit')}
          className="border-[#E2E8F0] bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={handleVerificationSubmit}
          disabled={verifyOtpMutation.isPending || verificationCode.some(digit => !digit)}
          className="bg-[#5D50FE] text-white hover:bg-[#4A3FE7] disabled:bg-opacity-50"
        >
          {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify Email'}
        </Button>
      </div>
    </>
  );

  const renderSuccess = () => (
    <>
      <div className="space-y-5 py-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-[#1A202C] mb-2">Email Successfully Updated!</h3>
          <p className="text-sm text-[#718096]">
            Your email address has been changed to <br />
            <span className="font-medium text-[#1A202C]">{email}</span>
          </p>
        </div>
      </div>

      <div className="flex justify-center pt-4 border-t border-[#E2E8F0]">
        <Button 
          onClick={handleClose}
          className="bg-[#5D50FE] text-white hover:bg-[#4A3FE7]"
        >
          Continue
        </Button>
      </div>
    </>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#1A202C]">
            <Building2 className="w-5 h-5 text-[#5D50FE]" />
            {currentStep === 'success' 
              ? 'Success!' 
              : currentStep === 'verify-code' 
                ? 'Email Verification'
                : `Edit Agency - ${agency.name}`
            }
          </DialogTitle>
          <DialogDescription className="text-[#718096]">
            {currentStep === 'edit' && "Update the agency's contact details."}
            {currentStep === 'verify-code' && "Complete email verification to update your contact details."}
            {currentStep === 'success' && "Your email address has been successfully updated."}
          </DialogDescription>
        </DialogHeader>

        {currentStep === 'edit' && renderEditForm()}
        {currentStep === 'verify-code' && renderVerifyCode()}
        {currentStep === 'success' && renderSuccess()}
      </DialogContent>
    </Dialog>
  );
}