import { Building2 } from 'lucide-react';

interface LogoProps {
  className?: string;
  iconClassName?: string;
  badgeClassName?: string;
  textClassName?: string;
  showText?: boolean;
}

export function Logo({
  className = '',
  iconClassName = 'w-6 h-6 text-[#0F8B83]',
  badgeClassName = 'bg-[#EAF4F3] p-2 rounded-xl group-hover:bg-[#d8ece9] transition-colors',
  textClassName = 'text-2xl font-bold tracking-tight text-[#102A56]',
  showText = true,
}: LogoProps) {
  return (
    <div className={`flex items-center space-x-2.5 ${className}`}>
      <div className={`flex items-center justify-center shrink-0 ${badgeClassName}`}>
        <Building2 className={iconClassName} />
      </div>
      {showText && (
        <span className={textClassName}>
          PG<span className="text-[#0F8B83]">Mitra</span>
        </span>
      )}
    </div>
  );
}

export default Logo;
