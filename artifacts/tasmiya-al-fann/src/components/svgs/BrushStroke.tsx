export function BrushStroke({ className = "" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 400 30" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
    >
      <path 
        d="M2.5 15C50.5 15 98.5 5 146.5 5C194.5 5 242.5 25 290.5 25C338.5 25 386.5 15 397.5 15" 
        stroke="currentColor" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeDasharray="400"
        className="animate-dash"
        strokeDashoffset="400"
      />
    </svg>
  );
}
