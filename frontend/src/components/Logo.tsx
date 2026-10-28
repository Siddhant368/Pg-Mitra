export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2C9.37258 2 4 7.37258 4 14C4 22 16 30 16 30C16 30 28 22 28 14C28 7.37258 22.6274 2 16 2Z" fill="#087c75" />
      <path d="M16 8L10 13V21H13V16H19V21H22V13L16 8Z" fill="white" />
    </svg>
  );
}
