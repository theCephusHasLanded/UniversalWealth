import React, { createContext, useContext, useState } from 'react';
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
  
  const handleWaitlistSubmit = (email: string, name: string) => {
    console.log(`Waitlist request submitted: ${name} (${email})`);
    // In a real app, you would send this data to your backend
    // This is just a mock implementation
    
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