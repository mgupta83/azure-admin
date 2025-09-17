import React from 'react';
import { Input as AntInput, InputProps as AntInputProps } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface InputProps extends AntInputProps {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  className,
  ...props
}) => {
  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <AntInput
        className={className}
        status={error ? 'error' : undefined}
        {...props}
      />
      {error && (
        <div className="mt-1 text-sm text-red-600">{error}</div>
      )}
    </div>
  );
};

export const SearchInput: React.FC<Omit<InputProps, 'prefix'>> = (props) => {
  return (
    <Input
      prefix={<SearchOutlined />}
      placeholder="Search..."
      {...props}
    />
  );
};