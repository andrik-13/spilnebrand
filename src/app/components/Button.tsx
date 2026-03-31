import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'secondary-light';
  children: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  children,
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex cursor-pointer items-center justify-center px-8 py-4 text-[14px] uppercase tracking-[1.5px] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50';

  const variantStyles = {
    primary: 'bg-[#2C2420] text-white hover:bg-[#1A1816]',
    secondary: 'border border-[#2C2420] text-[#2C2420] hover:bg-[#2C2420] hover:text-white',
    'secondary-light': 'border border-white text-white hover:bg-white hover:text-[#2C2420]',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
