import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'secondaryLight';
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
    primary: 'bg-dark text-white hover:bg-primary',
    secondary: 'border border-dark text-dark hover:bg-dark hover:text-white',
    secondaryLight: 'border border-white text-white hover:bg-white hover:text-dark'
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
