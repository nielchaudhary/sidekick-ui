import Image from "next/image";
import Link from "next/link";

export function AuthLogo() {
  return (
    <Link href="/" className="flex items-center justify-center gap-1">
      <Image src="/favicon.png" alt="Sidekick" width={44} height={44} />
      <span className="text-white font-semibold text-xl tracking-tight -ml-2">sidekick</span>
    </Link>
  );
}
