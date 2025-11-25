import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Input = forwardRef(({ className, type, error, ...props }, ref) => {
  return (
    <div className="w-full">
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-ios border border-transparent bg-white px-3 py-2 text-sm text-ios-label placeholder:text-ios-gray2 shadow-ios-sm transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ios-blue",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "ring-2 ring-ios-red/50 focus-visible:ring-ios-red",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-ios-red animate-enter">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export { Input };