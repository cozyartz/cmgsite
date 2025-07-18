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

  const handleError = (error: any) => {
    console.error('Turnstile error:', error);
    onError?.(error);
  };

  const handleExpire = () => {
    console.log('Turnstile token expired');
    onExpire?.();
  };

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