import React, { createContext, useContext, useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import WaitlistModal from '../components/common/WaitlistModal';

interface WaitlistContextType {
  showWaitlistModal: () => void;
  hideWaitlistModal: () => void;
}

const WaitlistContext = createContext<WaitlistContextType | null>(null);

export const useWaitlist = () => {
  const context = useContext(WaitlistContext);
  if (!context) {
    throw new Error('useWaitlist must be used within a WaitlistProvider');
  }
  return context;
};

export const WaitlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const showWaitlistModal = () => setIsOpen(true);
  const hideWaitlistModal = () => setIsOpen(false);
  
  const handleWaitlistSubmit = async (email: string, name: string) => {
    console.log(`Waitlist request submitted: ${name} (${email})`);
    
    try {
      // Call the Firebase function to send email
      const functions = getFunctions();
      const sendWaitlistEmail = httpsCallable(functions, 'sendWaitlistConfirmation');
      
      // This is wrapped in a try/catch so if Firebase Functions isn't set up yet,
      // the app will still work and just log the submission
      await sendWaitlistEmail({ email, name });
      console.log('Waitlist confirmation email sent');
      
      // Store in Firestore for backup
      // We could also implement this to store data even if the email fails
    } catch (error) {
      console.error('Error submitting waitlist request:', error);
      // The UI will still show success, but we log the error
    }
    
    // Analytics event could be tracked here
  };
  
  return (
    <WaitlistContext.Provider value={{ showWaitlistModal, hideWaitlistModal }}>
      <WaitlistModal 
        isOpen={isOpen}
        onClose={hideWaitlistModal}
        onSubmit={handleWaitlistSubmit}
      />
      {children}
    </WaitlistContext.Provider>
  );
};

export default WaitlistContext;