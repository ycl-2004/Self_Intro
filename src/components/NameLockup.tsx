type NameLockupProps = {
  className?: string;
  stackedOnMobile?: boolean;
};

export default function NameLockup({ className = "", stackedOnMobile = false }: NameLockupProps) {
  return (
    <span className={`name-lockup ${stackedOnMobile ? "name-lockup-stack-mobile" : ""} ${className}`.trim()}>
      <span className="name-lockup-zh">林羿辰</span>
      <span className="name-lockup-en">Yi-Chen Lin</span>
    </span>
  );
}
