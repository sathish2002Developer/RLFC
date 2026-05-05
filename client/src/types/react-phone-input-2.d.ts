declare module 'react-phone-input-2' {
  import * as React from 'react';

  type PhoneInputProps = {
    country?: string;
    value?: string;
    onChange?: (value: string, data: unknown, event: unknown, formattedValue: string) => void;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    placeholder?: string;
    containerClass?: string;
    inputClass?: string;
    buttonClass?: string;
    [key: string]: unknown;
  };

  const PhoneInput: React.ComponentType<PhoneInputProps>;
  export default PhoneInput;
}

