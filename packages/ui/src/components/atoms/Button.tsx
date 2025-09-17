import React from 'react';
import { Button as AntButton, ButtonProps as AntButtonProps } from 'antd';
import { clsx } from 'clsx';

interface ButtonProps extends Omit<AntButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  fullWidth = false,
  className,
  children,
  ...props 
}) => {
  const buttonClasses = clsx(
    'transition-all duration-200',
    {
      'w-full': fullWidth,
    },
    className
  );

  const antdType = variant === 'secondary' ? 'default' : 
                  variant === 'danger' ? 'primary' :
                  variant === 'ghost' ? 'text' : 'primary';

  const antdDanger = variant === 'danger';

  return (
    <AntButton
      type={antdType}
      danger={antdDanger}
      className={buttonClasses}
      {...props}
    >
      {children}
    </AntButton>
  );
};