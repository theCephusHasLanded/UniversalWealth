import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';

/**
 * A utility function that can be imported anywhere to translate text
 * @param key The translation key
 * @param defaultText Optional default text if translation is missing
 * @returns The translated text, or default text, or the key itself if no translation is found
 */
export const translate = (key: string, defaultText?: string): string => {
  try {
    // In non-component contexts, we have to work differently
    // This is why we still need to use the hook in components
    // But for dynamic text or deeply nested components, this is useful
    const translations = window.__LKHN_TRANSLATIONS || {};
    const currentLanguage = localStorage.getItem('lkhn-language') || 'en';
    
    if (translations[currentLanguage]?.[key]) {
      return translations[currentLanguage][key];
    }
    
    return defaultText || key;
  } catch (error) {
    return defaultText || key;
  }
};

/**
 * A hook that returns a function to translate text with default values
 * @param defaultLanguage The default language to use
 * @returns A translation function
 */
export const useTranslateWithDefault = (defaultLanguage = 'en') => {
  const { t, language } = useTranslation();
  
  return (key: string, defaultText?: string): string => {
    const translated = t(key);
    
    // If the translation is the same as the key, it means no translation was found
    if (translated === key && defaultText) {
      return defaultText;
    }
    
    return translated;
  };
};

// Type for translation interpolation values
export type InterpolationValues = Record<string, string | number>;

/**
 * A hook that provides translation with variable interpolation
 * @returns A translation function with interpolation
 */
export const useTranslateWithVars = () => {
  const { t } = useTranslation();
  
  // Function to interpolate variables in translation strings
  const translateWithVars = (key: string, values?: InterpolationValues): string => {
    let translated = t(key);
    
    if (values) {
      // Replace all {{variable}} with their values
      Object.entries(values).forEach(([varName, value]) => {
        const regex = new RegExp(`{{${varName}}}`, 'g');
        translated = translated.replace(regex, String(value));
      });
    }
    
    return translated;
  };
  
  return translateWithVars;
};

// Create a global declaration for storing translations
declare global {
  interface Window {
    __LKHN_TRANSLATIONS?: Record<string, Record<string, string>>;
  }
}

// High-order component to wrap components with translation capabilities
export function withTranslation<P extends object>(
  Component: React.ComponentType<P & { t: (key: string) => string; language: string }>
): React.FC<P> {
  return (props: P) => {
    const { t, language } = useTranslation();
    return <Component {...props} t={t} language={language} />;
  };
}

// Translatable component interface
interface TranslatableProps {
  translationKey: string;
  defaultText?: string;
  values?: Record<string, string | number>;
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  [key: string]: any;
}

// Component that automatically translates its content
export const Translatable: React.FC<TranslatableProps> = ({
  translationKey,
  defaultText,
  values,
  as: Component = 'span',
  ...rest
}) => {
  const { t, tWithVars } = useTranslation();
  
  let content = '';
  if (values) {
    content = tWithVars(translationKey, values);
  } else {
    content = t(translationKey);
    // Use default text if translation not found
    if (content === translationKey && defaultText) {
      content = defaultText;
    }
  }
  
  return <Component {...rest}>{content}</Component>;
};