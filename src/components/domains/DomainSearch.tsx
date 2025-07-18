import React, { useState, useRef, useEffect } from 'react';
import { Search, Globe, Star, TrendingUp, Shield, Zap } from 'lucide-react';
import { apiService } from '../../lib/api';

interface DomainResult {
  domain: string;
  available: boolean;
  pricing: {
    registration: number;
    renewal: number;
    transfer: number;
    currency: string;
  };
  serviceFees: {
    setup: number;
    management: number;
    integration: number;
  };
  totalFirstYear: number;
  seoScore: number;
  recommendations: string[];
  error?: string;
}

interface DomainSearchProps {
  onSelectDomain?: (domain: DomainResult) => void;
}

const DomainSearch: React.FC<DomainSearchProps> = ({ onSelectDomain }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<DomainResult[]>([]);
  const [selectedTlds, setSelectedTlds] = useState(['com', 'net', 'org', 'io']);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const popularTlds = [
    { tld: 'com', name: '.com', popular: true, price: '$8.86' },
    { tld: 'net', name: '.net', popular: true, price: '$11.86' },
    { tld: 'org', name: '.org', popular: true, price: '$11.86' },
    { tld: 'io', name: '.io', popular: false, price: '$54.00' },
    { tld: 'ai', name: '.ai', popular: false, price: '$120.00' },
    { tld: 'shop', name: '.shop', popular: false, price: '$3.98' },
    { tld: 'dev', name: '.dev', popular: false, price: '$12.00' },
    { tld: 'app', name: '.app', popular: false, price: '$18.00' },
  ];

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await apiService.call('/api/domains/search', {
        method: 'POST',
        body: {
          baseName: searchTerm.toLowerCase().replace(/[^a-z0-9]/g, ''),
          tlds: selectedTlds
        },
        requireAuth: true
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const domains = await response.json();
      setResults(domains);
    } catch (error) {
      console.error('Domain search error:', error);
      // Mock results for demo
      setResults(selectedTlds.map(tld => ({
        domain: `${searchTerm.toLowerCase()}.${tld}`,
        available: Math.random() > 0.5,
        pricing: {
          registration: tld === 'com' ? 8.86 : tld === 'io' ? 54.00 : 11.86,
          renewal: tld === 'com' ? 8.86 : tld === 'io' ? 54.00 : 11.86,
          transfer: tld === 'com' ? 8.86 : tld === 'io' ? 54.00 : 11.86,
          currency: 'USD'
        },
        serviceFees: {
          setup: 50.00,
          management: 15.00,
          integration: 25.00
        },
        totalFirstYear: (tld === 'com' ? 8.86 : tld === 'io' ? 54.00 : 11.86) + 50.00,
        seoScore: tld === 'com' ? 85 : tld === 'io' ? 70 : 75,
        recommendations: [
          tld === 'com' ? '✅ .com is the most trusted TLD for SEO' : '💡 Consider .com for maximum SEO benefit',
          '✅ Short domain name is easy to remember'
        ]
      })));
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleTld = (tld: string) => {
    setSelectedTlds(prev => 
      prev.includes(tld) 
        ? prev.filter(t => t !== tld)
        : [...prev, tld]
    );
  };

  const getSEOScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Search Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Find Your Perfect Domain
        </h1>
        <p className="text-lg text-gray-600">
          Search for available domains with built-in SEO optimization
        </p>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              ref={searchRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your domain name..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchTerm.trim()}
            className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* TLD Selection */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Select extensions to search:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {popularTlds.map(({ tld, name, popular, price }) => (
              <label
                key={tld}
                className={`relative flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedTlds.includes(tld)
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedTlds.includes(tld)}
                    onChange={() => toggleTld(tld)}
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span className="font-medium text-gray-900">{name}</span>
                  {popular && (
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  )}
                </div>
                <span className="text-sm text-gray-500">{price}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Search Results</h2>
          
          {results.map((result) => (
            <div
              key={result.domain}
              className={`bg-white rounded-xl shadow-lg p-6 border-2 transition-all hover:shadow-xl ${
                result.available ? 'border-green-200 hover:border-green-300' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <Globe className="w-6 h-6 text-teal-600" />
                    <h3 className="text-xl font-bold text-gray-900">{result.domain}</h3>
                    
                    {result.available ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        Available
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                        Taken
                      </span>
                    )}
                    
                    <div className={`px-3 py-1 text-sm font-medium rounded-full ${getSEOScoreColor(result.seoScore)}`}>
                      SEO Score: {result.seoScore}/100
                    </div>
                  </div>

                  {/* SEO Recommendations */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">SEO Analysis:</h4>
                    <ul className="space-y-1">
                      {result.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-sm text-gray-600">{rec}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Registration:</span>
                      <p className="font-medium">{formatPrice(result.pricing.registration)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Setup Fee:</span>
                      <p className="font-medium">{formatPrice(result.serviceFees.setup)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Monthly Mgmt:</span>
                      <p className="font-medium">{formatPrice(result.serviceFees.management)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">First Year Total:</span>
                      <p className="font-bold text-teal-600">{formatPrice(result.totalFirstYear)}</p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                {result.available && (
                  <div className="ml-6">
                    <button
                      onClick={() => onSelectDomain?.(result)}
                      className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-colors flex items-center space-x-2"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Get Domain</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Service Features */}
      <div className="mt-12 bg-gray-50 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Included with Every Domain
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <Shield className="w-8 h-8 text-teal-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Security & Protection</h4>
            <p className="text-sm text-gray-600">
              Free SSL certificates, DDoS protection, and secure DNS management
            </p>
          </div>
          
          <div className="text-center">
            <TrendingUp className="w-8 h-8 text-teal-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">SEO Optimization</h4>
            <p className="text-sm text-gray-600">
              Pre-configured DNS for optimal search engine performance
            </p>
          </div>
          
          <div className="text-center">
            <Globe className="w-8 h-8 text-teal-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Global CDN</h4>
            <p className="text-sm text-gray-600">
              Lightning-fast loading times with Cloudflare's global network
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainSearch;