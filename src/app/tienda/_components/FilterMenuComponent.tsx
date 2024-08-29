"use client";
import styles from "./menufilterstyle.module.css";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { filterMenuSlide } from "./anim";
import { useSession } from "next-auth/react";
import AllFiltersComponent from "./AllFiltersComponent";

const FilterMenuComponent = ({
  allBrands,
  allCategories,
  SetIsActive,
  isActive,
}: {
  allBrands: any;
  allCategories: any;
  SetIsActive: any;
  isActive: any;
}) => {
  const pathname = usePathname();

  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user);

  return (
    <motion.div
      variants={filterMenuSlide}
      initial="initial"
      animate="enter"
      exit="exit"
      className={`${styles.menu} bg-transparent`}
    >
      <div
        className={`${styles.body} bg-background max-w-[350px]  overflow-y-auto px-5 py-10`}
      >
        <AllFiltersComponent
          allBrands={allBrands}
          allCategories={allCategories}
          SetIsActive={SetIsActive}
          isActive={isActive}
        />
      </div>
    </motion.div>
  );
};

export default FilterMenuComponent;
