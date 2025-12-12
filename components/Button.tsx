import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  // Added min-h to ensure touch targets are large enough
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all focus:outline-none focus:ring-4 focus:ring-offset-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none";
  
  const variants = {
    // #007AFF on white is ~4:1. With Bold text, it passes WCAG for large text.
    primary: "bg-[#007AFF] text-white hover:bg-blue-600 focus:ring-blue-300",
    secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 focus:ring-gray-200 shadow-sm",
    danger: "bg-[#FF3B30] text-white hover:bg-red-700 focus:ring-red-300",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-300",
    outline: "border-2 border-[#007AFF] text-[#007AFF] bg-transparent hover:bg-blue-50 focus:ring-blue-200"
  };

  // Increased sizes for dexterity:
  // sm -> 48px (h-12)
  // md -> 56px (h-14)
  // lg -> 64px (h-16)
  const sizes = {
    sm: "h-12 px-5 text-base", // bumped from h-9
    md: "h-14 px-6 text-lg",   // bumped from h-12 (48px) to 56px
    lg: "h-16 px-8 text-xl"    // kept large (64px)
  };

  const width = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-6 w-6 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};