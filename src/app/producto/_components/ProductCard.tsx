"use client";
import Image from "next/image";
import FormattedPrice from "@/backend/helpers/FormattedPrice";
import { motion } from "framer-motion";
import Link from "next/link";
import { addToFavorites } from "@/redux/shoppingSlice";
import { useDispatch } from "react-redux";
import { IoMdHeart } from "react-icons/io";
import { calculatePercentage } from "@/backend/helpers";

const ProductCard = ({ item }: { item: any }) => {
  const dispatch = useDispatch();
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.0 }}
      className="border-[1px] rounded-sm max-w-[350px] maxmd:max-w-[100%] overflow-hidden relative"
    >
      <Link href={`/producto/${item.slug}`}>
        <div className="w-full h-[200px]  group overflow-hidden relative">
          <Image
            src={item?.images[0].url}
            alt="product image"
            className=" ease-in-out duration-500 w-full h-full object-cover group-hover:scale-110 rounded-t-sm"
            width={450}
            height={450}
          />

          {item?.sale_price && (
            <span className="absolute top-2 right-2  border-[1px] border-black font-medium text-xs py-1 px-3 rounded-sm bg-black text-slate-100 group-hover:bg-slate-100 group-hover:text-foreground duration-200">
              Oferta
            </span>
          )}
          {item?.stock <= 0 && (
            <span className="absolute rotate-12 top-1/2 right-1/4  border-[1px] border-black font-medium text-xl py-1 px-3 rounded-sm bg-black text-slate-100 group-hover:bg-primary group-hover:text-foreground duration-200">
              SOLD OUT
            </span>
          )}
          {item?.sale_price ? (
            <div>
              <div className="absolute top-2 left-2  border-[1px] border-black w-fit py-1 px-4 rounded-sm text-xs bg-black text-slate-100 group-hover:bg-slate-100 group-hover:text-foreground duration-200">
                <p>
                  {calculatePercentage(item?.price, item?.sale_price)}% menos
                </p>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </Link>
      <div className=" px-4 py-4 flex flex-col border-card rounded-b-sm">
        <div className="flex items-center justify-between gap-x-1">
          <p className="text-foreground tracking-wide font-EB_Garamond text-sm">
            {item?.title.substring(0, 25) + "..."}
          </p>
          <div className="flex items-center justify-between my-5">
            {/* add to favorites button */}
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.9 }}
              className="bg-black h-7 w-7 text-sm flex flex-row rounded-full justify-center gap-x-2 items-center tracking-wide text-slate-100 hover:bg-black hover:text-white duration-500"
              onClick={() => dispatch(addToFavorites(item))}
            >
              <IoMdHeart className="" />
            </motion.button>
          </div>
        </div>

        <div className="pricing-class flex fle-row items-center gap-x-2">
          <div className="flex flex-col gap-y-1">
            <p className="font-semibold text-foreground tracking-wider text-xl">
              {item?.sale_price > 0 ? (
                <FormattedPrice amount={item?.sale_price} />
              ) : item?.price > 0 ? (
                <FormattedPrice amount={item?.price} />
              ) : (
                ""
              )}
            </p>
          </div>
          {item?.sale_price ? (
            <div>
              <div className="flex items-center gap-x-2">
                <p className="line-through text-sm text-foreground font-bodyFont">
                  <FormattedPrice amount={item?.price} />
                </p>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="">
          <p className="text-[12px] text-foreground">Llevatelo por solo: </p>
          <p className="font-semibold text-foreground tracking-wider">
            <FormattedPrice
              amount={
                item?.variations[0]?.price > 0
                  ? item?.variations[0].price
                  : item?.sale_price ?? item?.sale_price
              }
            />
            {item?.sale_price > 0 ? "(30%)" : ""}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
