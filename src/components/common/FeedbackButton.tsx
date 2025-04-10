import React, { useState } from 'react';
import { MessageSquare, X, Check, Send } from 'lucide-react';
import Button from './Button';

interface FeedbackButtonProps {
  onSubmit?: (feedback: string, rating: number) => void;
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({ onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = () => {
    if (feedbackText.trim() && rating > 0) {
      if (onSubmit) {
        onSubmit(feedbackText, rating);
      }
      setSubmitted(true);
      
      // Reset after a few seconds
      setTimeout(() => {
        setIsOpen(false);
        setTimeout(() => {
          setFeedbackText('');
          setRating(0);
          setSubmitted(false);
        }, 300);
      }, 2000);
    }
  };
  
  return (
    <>
      {/* Floating button */}
      <button
        className="fixed right-6 bottom-6 z-40 h-12 w-12 rounded-full bg-gold shadow-lg flex items-center justify-center text-navy-900 hover:bg-gold-600 transition-all transform hover:scale-105"
        onClick={() => setIsOpen(true)}
        aria-label="Provide feedback"
      >
        <MessageSquare size={20} />
      </button>
      
      {/* Feedback panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-6 pointer-events-none">
          <div 
            className="bg-navy-800 border border-navy-700 shadow-xl w-full max-w-sm pointer-events-auto animate-slide-up"
          >
            <div className="p-4 border-b border-navy-700 flex justify-between items-center">
              <h3 className="text-sm uppercase tracking-wider text-gold font-medium">
                {submitted ? 'Thank You' : 'Member Feedback'}
              </h3>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-5">
              {!submitted ? (
                <>
                  {/* Rating */}
                  <div className="mb-4">
                    <div className="text-xs text-neutral-300 mb-2">How would you rate your experience?</div>
                    <div className="flex justify-between">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          className={`w-10 h-10 rounded-sm transition-colors ${
                            star <= (hoveredRating || rating) 
                              ? 'bg-gold text-navy-900' 
                              : 'bg-navy-700 text-neutral-400'
                          }`}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onClick={() => setRating(star)}
                        >
                          {star}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Feedback text */}
                  <div className="mb-4">
                    <div className="text-xs text-neutral-300 mb-2">Your feedback</div>
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      className="w-full h-24 bg-navy-700 border border-navy-600 text-white p-3 text-sm focus:outline-none focus:border-gold/50 placeholder:text-neutral-500 resize-none"
                      placeholder="Share your thoughts on the platform..."
                    />
                  </div>
                  
                  {/* Submit button */}
                  <div className="flex justify-end">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSubmit}
                      icon={<Send size={14} />}
                      disabled={!feedbackText.trim() || rating === 0}
                    >
                      Submit Feedback
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="h-16 w-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-gold" />
                  </div>
                  <div className="text-white text-lg mb-2">Feedback Received</div>
                  <p className="text-neutral-400 text-sm">
                    Thank you for helping us improve the LKHN Universal Wealth experience.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackButton;