import React from 'react';
import { Tag as AntTag, TagProps as AntTagProps } from 'antd';

interface TagProps extends AntTagProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium' | 'large';
}

export const Tag: React.FC<TagProps> = ({
  variant = 'default',
  size = 'medium',
  children,
  ...props
}) => {
  const getColor = () => {
    switch (variant) {
      case 'success': return 'green';
      case 'warning': return 'orange';
      case 'error': return 'red';
      case 'info': return 'blue';
      default: return 'default';
    }
  };

  return (
    <AntTag
      color={getColor()}
      className={size === 'small' ? 'text-xs' : size === 'large' ? 'text-base px-3 py-1' : ''}
      {...props}
    >
      {children}
    </AntTag>
  );
};