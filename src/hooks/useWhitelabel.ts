import { useState, useEffect } from 'react';
import { WhitelabelConfig, getWhitelabelConfig } from '../config/whitelabel';

export const useWhitelabel = () => {
  const [config, setConfig] = useState<WhitelabelConfig>(getWhitelabelConfig());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // In production, this would fetch config from API based on domain
    const loadConfig = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 100));
        const newConfig = getWhitelabelConfig();
        setConfig(newConfig);
      } catch (error) {
        console.error('Failed to load whitelabel config:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  return {
    config,
    isLoading,
    isWhitelabelEnabled: config.features.whitelabel,
    brandName: config.brandName,
    companyName: config.companyName,
    logo: config.logo,
    primaryColor: config.primaryColor,
    secondaryColor: config.secondaryColor,
    contact: config.contact,
    social: config.social,
    pricing: config.pricing,
    services: config.services,
    legal: config.legal
  };
};