import Link from "next/link";
import navbarLogoImage from "../../public/image/navbar-logo.png";
import Image from "next/image";

const Navbar = () => {
  return (
    <>
      {/* NAVBAR CONTAINER */}
      <div className="flex pl-[30px] lg:pl-[360px] items-center w-full h-[60px] border-b-2">
        <Link href={"/"}>
          <Image src={navbarLogoImage} alt="navbar-logo" />
        </Link>
      </div>
    </>
  );
};
export default Navbar;
