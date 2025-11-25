import { cn } from '../../utils/cn';

/* Responsive Table Component
  - Uses standard HTML table elements for semantic correctness.
  - Tailwind classes handle hiding columns on smaller screens.
  - Supports a clean, bordered look typical of iOS settings lists.
*/

export function Table({ className, children, ...props }) {
  return (
    <div className="w-full overflow-hidden rounded-ios-lg border border-ios-separator/50 bg-white shadow-ios-sm">
      <table className={cn("w-full text-sm text-left", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className, children, ...props }) {
  return (
    <thead className={cn("bg-ios-gray6/50 border-b border-ios-separator/50", className)} {...props}>
      {children}
    </thead>
  );
}

export function TableRow({ className, children, ...props }) {
  return (
    <tr 
      className={cn(
        "border-b border-ios-separator/50 transition-colors hover:bg-ios-blue/5 last:border-0", 
        className
      )} 
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({ className, children, ...props }) {
  return (
    <th 
      className={cn(
        "h-10 px-4 align-middle font-medium text-ios-secondaryLabel [&:has([role=checkbox])]:pr-0", 
        className
      )} 
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ className, children, ...props }) {
  return (
    <td 
      className={cn(
        "p-4 align-middle [&:has([role=checkbox])]:pr-0 text-ios-label", 
        className
      )} 
      {...props}
    >
      {children}
    </td>
  );
}