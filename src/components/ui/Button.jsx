import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const Button = forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'default', 
  isLoading = false, 
  children, 
  disabled, 
  ...props 
}, ref) => {
  
  const variants = {
    primary: "bg-ios-blue text-white hover:bg-ios-blue/90 active:opacity-80 shadow-ios-sm",
    secondary: "bg-ios-gray6 text-ios-blue hover:bg-ios-gray5 active:bg-ios-gray4",
    outline: "border border-ios-blue text-ios-blue bg-transparent hover:bg-ios-blue/10",
    ghost: "bg-transparent text-ios-blue hover:bg-ios-gray6",
    destructive: "bg-ios-red text-white hover:bg-ios-red/90 active:opacity-80 shadow-ios-sm",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs rounded-lg",
    default: "h-10 px-4 py-2 text-sm rounded-ios",
    lg: "h-12 px-6 text-base rounded-xl",
    icon: "h-10 w-10 p-0 rounded-full flex items-center justify-center",
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ios-blue disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };