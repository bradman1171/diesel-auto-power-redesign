import { Link } from "@tanstack/react-router";
import logo from "@/assets/dap-logo-white.png";

/** Official DAP mark (white version, captured from the live site header). */
export function Logo({ className = "h-12" }: { className?: string }) {
  return (
    <Link to="/" className="flex shrink-0 items-center" aria-label="Diesel Auto Power home">
      <img src={logo} alt="Diesel Auto Power" width={344} height={172} className={`${className} w-auto`} />
    </Link>
  );
}
