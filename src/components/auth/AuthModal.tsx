import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import SignIn from './SignIn';
import SignUp from './SignUp';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

const AuthModal = ({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  console.log('AuthModal rendered with mode:', mode);

  const handleSwitchToSignUp = () => {
    console.log('Switching to sign up mode');
    setMode('signup');
  };

  const handleSwitchToSignIn = () => {
    console.log('Switching to sign in mode');
    setMode('signin');
  };

  const handleClose = () => {
    console.log('AuthModal closing');
    setMode('signin'); // Reset to signin when closing
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 bg-transparent border-0 shadow-none">
        {mode === 'signin' ? (
          <SignIn 
            onSwitchToSignUp={handleSwitchToSignUp} 
            onClose={handleClose}
          />
        ) : (
          <SignUp 
            onSwitchToSignIn={handleSwitchToSignIn} 
            onClose={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;