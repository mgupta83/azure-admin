import React from 'react';
import { Card as AntCard, CardProps as AntCardProps } from 'antd';
import { clsx } from 'clsx';

interface CardProps extends AntCardProps {
  padding?: 'none' | 'small' | 'medium' | 'large';
  shadow?: 'none' | 'small' | 'medium' | 'large';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  padding = 'medium',
  shadow = 'small',
  hover = false,
  className,
  children,
  ...props
}) => {
  const cardClasses = clsx(
    'transition-all duration-200',
    {
      'hover:shadow-lg hover:-translate-y-1': hover,
      'shadow-none': shadow === 'none',
      'shadow-sm': shadow === 'small',
      'shadow-md': shadow === 'medium',
      'shadow-lg': shadow === 'large',
    },
    className
  );

  const bodyStyle = {
    padding: padding === 'none' ? 0 : 
             padding === 'small' ? '12px' :
             padding === 'large' ? '32px' : '24px',
  };

  return (
    <AntCard
      className={cardClasses}
      bodyStyle={bodyStyle}
      {...props}
    >
      {children}
    </AntCard>
  );
};