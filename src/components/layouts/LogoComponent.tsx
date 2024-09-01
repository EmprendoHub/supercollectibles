import Link from "next/link";
import Image from "next/image";

const LogoComponent = ({ className }: { className: string }) => {
  return (
    <Link href={`/`}>
      <Image
        width={250}
        height={250}
        src={"/logos/Super-Collectibles-Menu-logo.png"}
        alt="Super Collectibles Mx"
        className={`${className} max-w-[150px]`}
      />
    </Link>
  );
};

export default LogoComponent;
