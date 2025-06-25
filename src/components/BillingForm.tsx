import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { MapPin, CreditCard } from 'lucide-react';

interface BillingData {
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}

interface BillingFormProps {
  onSubmit: (billingData: BillingData) => void;
  loading?: boolean;
  planName: string;
  planPrice: string;
}

// Popular countries list
const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'IN', name: 'India' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgium' },
  { code: 'IE', name: 'Ireland' },
  { code: 'PL', name: 'Poland' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'HU', name: 'Hungary' },
  { code: 'RO', name: 'Romania' },
  { code: 'GR', name: 'Greece' },
  { code: 'PT', name: 'Portugal' },
  { code: 'TR', name: 'Turkey' },
  { code: 'RU', name: 'Russia' },
  { code: 'CN', name: 'China' },
  { code: 'KR', name: 'South Korea' },
  { code: 'SG', name: 'Singapore' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'TH', name: 'Thailand' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'PH', name: 'Philippines' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'IL', name: 'Israel' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'EG', name: 'Egypt' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'PE', name: 'Peru' },
  { code: 'VE', name: 'Venezuela' },
];

export default function BillingForm({ onSubmit, loading = false, planName, planPrice }: BillingFormProps) {
  const [billingData, setBillingData] = useState<BillingData>({
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: ''
  });

  const [errors, setErrors] = useState<Partial<BillingData>>({});

  const validateForm = () => {
    const newErrors: Partial<BillingData> = {};

    if (!billingData.street.trim()) newErrors.street = 'Street address is required';
    if (!billingData.city.trim()) newErrors.city = 'City is required';
    if (!billingData.state.trim()) newErrors.state = 'State/Province is required';
    if (!billingData.zipcode.trim()) newErrors.zipcode = 'ZIP/Postal code is required';
    if (!billingData.country) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(billingData);
    }
  };

  const handleChange = (field: keyof BillingData, value: string) => {
    setBillingData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Billing Information
          </CardTitle>
          <CardDescription>
            Enter your billing address to proceed with payment for <strong>{planName}</strong> ({planPrice})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                value={billingData.street}
                onChange={(e) => handleChange('street', e.target.value)}
                placeholder="123 Main Street"
                className={errors.street ? 'border-red-500' : ''}
              />
              {errors.street && <p className="text-sm text-red-500 mt-1">{errors.street}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={billingData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="New York"
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
              </div>

              <div>
                <Label htmlFor="state">State/Province *</Label>
                <Input
                  id="state"
                  value={billingData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder="NY"
                  className={errors.state ? 'border-red-500' : ''}
                />
                {errors.state && <p className="text-sm text-red-500 mt-1">{errors.state}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zipcode">ZIP/Postal Code *</Label>
                <Input
                  id="zipcode"
                  value={billingData.zipcode}
                  onChange={(e) => handleChange('zipcode', e.target.value)}
                  placeholder="10001"
                  className={errors.zipcode ? 'border-red-500' : ''}
                />
                {errors.zipcode && <p className="text-sm text-red-500 mt-1">{errors.zipcode}</p>}
              </div>

              <div>
                <Label htmlFor="country">Country *</Label>
                <Select value={billingData.country} onValueChange={(value) => handleChange('country', value)}>
                  <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country && <p className="text-sm text-red-500 mt-1">{errors.country}</p>}
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceed to Payment
                  </>
                )}
              </Button>
            </div>

            <div className="text-xs text-gray-500 text-center">
              <p>💰 Your payment will be processed in your local currency with the best exchange rates</p>
              <p>🔒 Your billing information is securely encrypted and not stored</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
