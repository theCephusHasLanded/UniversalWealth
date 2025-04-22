import React from 'react';
import { useTranslation } from '../../contexts/TranslationContext';
import { 
  Translatable, 
  useTranslateWithVars,
  useTranslateWithDefault,
  withTranslation 
} from '../../utils/translation';

// Example component showing different ways to use translations
const TranslationDemo: React.FC = () => {
  // Standard translation hook
  const { t, language, tWithVars, tPlural } = useTranslation();
  
  // Enhanced translation hooks
  const translateWithVars = useTranslateWithVars();
  const translateWithDefault = useTranslateWithDefault();
  
  // Example dynamic content
  const count = 5;
  const userName = "Alex";
  
  return (
    <div className="p-4 rounded-md bg-navy-800 border border-navy-700">
      <h3 className="text-gold text-sm uppercase tracking-wider mb-4">
        Translation Demo ({language})
      </h3>
      
      <div className="space-y-4">
        {/* Standard translation */}
        <div className="pb-2 border-b border-navy-700">
          <h4 className="text-xs text-neutral-400 mb-1">Standard translation:</h4>
          <p className="text-white">{t('app.name')}</p>
        </div>
        
        {/* Using Translatable component */}
        <div className="pb-2 border-b border-navy-700">
          <h4 className="text-xs text-neutral-400 mb-1">Using Translatable component:</h4>
          <Translatable 
            translationKey="app.tagline" 
            className="text-white block" 
          />
        </div>
        
        {/* With variables */}
        <div className="pb-2 border-b border-navy-700">
          <h4 className="text-xs text-neutral-400 mb-1">With variable interpolation:</h4>
          <p className="text-white">
            {tWithVars('profile.welcome', { name: userName })}
          </p>
        </div>
        
        {/* With pluralization */}
        <div className="pb-2 border-b border-navy-700">
          <h4 className="text-xs text-neutral-400 mb-1">With pluralization:</h4>
          <p className="text-white">
            {tPlural('notification.count', count)}
          </p>
        </div>
        
        {/* With default text */}
        <div>
          <h4 className="text-xs text-neutral-400 mb-1">With default text fallback:</h4>
          <p className="text-white">
            {translateWithDefault('nonexistent.key', 'This is the default text')}
          </p>
        </div>
      </div>
    </div>
  );
};

// Example of a component wrapped with translation HOC
const SimpleComponent: React.FC<{ t: (key: string) => string; language: string }> = ({ t, language }) => (
  <div className="p-3 bg-navy-700 mt-4 rounded-md">
    <p className="text-xs text-neutral-400 mb-1">HOC Example ({language}):</p>
    <p className="text-white">{t('app.overview')}</p>
  </div>
);

const WrappedComponent = withTranslation(SimpleComponent);

// Export the combined components
const TranslationDemoContainer: React.FC = () => (
  <div className="space-y-4">
    <TranslationDemo />
    <WrappedComponent />
  </div>
);

export default TranslationDemoContainer;