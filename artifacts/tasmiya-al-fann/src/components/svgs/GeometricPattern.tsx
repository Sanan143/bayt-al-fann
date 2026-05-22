export function GeometricPattern({ className = "" }: { className?: string }) {
  return (
    <svg 
      className={className}
      width="100%" 
      height="100%" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="islamic-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <path 
            d="M30 0L60 30L30 60L0 30Z M15 15L45 45 M15 45L45 15" 
            stroke="currentColor" 
            strokeWidth="0.5" 
            fill="none" 
            opacity="0.1" 
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
    </svg>
  );
}
