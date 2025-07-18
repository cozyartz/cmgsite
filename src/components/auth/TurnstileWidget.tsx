import React from 'react';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onError?: (error: any) => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
}

const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({
  onVerify,
  onError,
  onExpire,
  theme = 'auto',
  size = 'normal'
}) => {
  const turnstileRef = React.useRef<TurnstileInstance>(null);
  
  // Get site key from environment
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || 'placeholder-key';
  
  // Debug logging for development
  if (import.meta.env.DEV) {
    console.log('Turnstile site key:', siteKey);
  }

  const handleError = (error: any) => {
    console.error('Turnstile error:', error);
    onError?.(error);
  };

  const handleExpire = () => {
    console.log('Turnstile token expired');
    onExpire?.();
  };

  // Don't render if we don't have a valid site key
  if (!siteKey || siteKey === 'placeholder-key' || siteKey === 'your_turnstile_site_key_here') {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            Turnstile CAPTCHA is not configured. Please set VITE_TURNSTILE_SITE_KEY environment variable.
            <br />
            <span className="text-xs text-gray-600">Current key: {siteKey}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center my-4">
      <Turnstile
        ref={turnstileRef}
        siteKey={siteKey}
        onSuccess={onVerify}
        onError={handleError}
        onExpire={handleExpire}
        options={{
          theme,
          size,
          action: 'login',
          cData: 'cmgsite-auth'
        }}
      />
    </div>
  );
};

export default TurnstileWidget;