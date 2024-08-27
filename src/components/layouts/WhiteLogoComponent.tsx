import Link from "next/link";
import Image from "next/image";

const WhiteLogoComponent = () => {
  return (
    <Link href={`/`}>
      <Image
        width={250}
        height={250}
        src={"/logos/Super-Collectibles-Menu-logo.png"}
        alt="central Medica de Especialidades"
        className="main-logo-class w-[200px] maxsm:w-[120px]"
      />
    </Link>
  );
};

export default WhiteLogoComponent;
