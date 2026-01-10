interface LogoProps {
  className?: string;
}

const Logo = ({ className = "" }: LogoProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Dome / jellyfish head / lamp shade */}
      <path
        d="M4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12H4Z"
        fill="currentColor"
      />

      {/* Three vertical lines */}
      <rect x="7" y="13" width="2" height="8" rx="0.5" fill="currentColor" />
      <rect x="11" y="13" width="2" height="8" rx="0.5" fill="currentColor" />
      <rect x="15" y="13" width="2" height="8" rx="0.5" fill="currentColor" />
    </svg>
  );
};

export default Logo;
