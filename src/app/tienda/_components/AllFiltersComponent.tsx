import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineClose } from "react-icons/ai";
import styles from "./boxfilterstyle.module.css";
import { getPriceQueryParams } from "@/backend/helpers";
import Search from "@/components/layouts/Search";

const AllFiltersComponent = ({
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
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const router = useRouter();
  let queryParams: any;

  function handleClick(checkbox: any) {
    if (typeof window !== "undefined") {
      queryParams = new URLSearchParams(window.location.search);
    }

    const checkboxes = document.getElementsByName(checkbox.name);

    checkboxes.forEach((item: any) => {
      if (item !== checkbox) item.checked = false;
    });

    if (checkbox.checked === false) {
      //delete filter
      queryParams.delete(checkbox.name);
    } else {
      //set query filter
      if (queryParams.has(checkbox.name)) {
        queryParams.set(checkbox.name, checkbox.value);
      } else {
        queryParams.append(checkbox.name, checkbox.value);
        SetIsActive(!isActive);
      }
    }
    const path = window.location.pathname + "?" + queryParams.toString();
    router.push(path);
  }

  function checkHandler(checkBoxType: any, checkBoxValue: any) {
    if (typeof window !== "undefined") {
      queryParams = new URLSearchParams(window.location.search);

      const value = queryParams.get(checkBoxType);
      if (checkBoxValue === value) {
        return true;
      }
      return false;
    }
  }

  function handlePriceButtonClick() {
    if (typeof window !== "undefined") {
      queryParams = new URLSearchParams(window.location.search);

      queryParams = getPriceQueryParams(queryParams, "min", minAmount);
      queryParams = getPriceQueryParams(queryParams, "max", maxAmount);

      const path = window.location.pathname + "?" + queryParams.toString();
      SetIsActive(!isActive);
      router.push(path);
    }
  }

  return (
    <>
      <aside>
        <div
          className={` burger-class flex flex-row text-muted items-center absolute right-1 top-1 cursor-pointer p-4`}
        >
          <div
            onClick={() => {
              SetIsActive(!isActive);
            }}
            className={"button-class"}
          >
            <AiOutlineClose />
          </div>
        </div>
        <div className=" mb-2  w-full text-start  py-2 inline-block text-sm text-foreground   ">
          Filtrar por
        </div>
        {/* Search Filter */}

        <Search SetIsActive={SetIsActive} />
        {/* Price Filter */}

        <div className="flex flex-col w-full p-4 border border-muted bg-background rounded shadow-sm my-3">
          <h3 className=" mb-2 text-foreground text-xs">Precio ($)</h3>

          <div className="grid maxsm:grid-cols-3 gap-x-2 text-foreground">
            <div className="mb-4">
              <input
                name="min"
                min={0}
                className="appearance-none border border-muted bg-input rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full text-sm"
                type="number"
                placeholder="Min"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <input
                name="max"
                min={0}
                className="appearance-none border border-muted bg-input rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full text-sm"
                type="number"
                placeholder="Max"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <button
                className="px-1 py-2 text-center text-xs w-full inline-block text-white bg-black border border-transparent rounded-md hover:bg-slate-700 hover:text-foreground"
                onClick={handlePriceButtonClick}
              >
                Filtrar
              </button>
            </div>
          </div>
        </div>
        {/* Category Filter */}
        <div className="p-5 pt-4  mb-3 sm:p-1 border border-muted bg-background rounded shadow-sm">
          <h3 className="font-semibold mb-2 text-foreground text-xs">
            Categoría
          </h3>
          <ul className="space-y-1 text-sm">
            {allCategories?.map((category: any, index: number) => (
              <li key={index}>
                <div className={`box py-[1px]  ${styles.box}`}>
                  <input
                    name="category"
                    type="checkbox"
                    value={category}
                    defaultChecked={checkHandler("category", `${category}`)}
                    onClick={(e) => handleClick(e.target)}
                    className={`checkboxBipolarInput ${styles.checkboxBipolarInput}`}
                    id={category}
                  />
                  <label
                    htmlFor={category}
                    className="flex flex-row items-center cursor-pointer"
                  >
                    <span
                      className={`checkboxBipolar ${styles.checkboxBipolar}`}
                    >
                      <span className={`on ${styles.on}`}>I</span>
                      <span className={`off ${styles.off}`}>O</span>
                    </span>
                    <span className="brandName ml-2 text-muted capitalize">
                      {" "}
                      {category}{" "}
                    </span>
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Brand Filter */}
        <div className="p-5 pt-4 sm:p-1 border border-muted bg-background rounded shadow-sm">
          <h3 className="font-semibold mb-2 text-gray-700">Marca</h3>
          <ul className="space-y-1">
            {allBrands?.map((brand: any, index: number) => (
              <li key={index}>
                <div className={`box  py-[1px]  ${styles.box}`}>
                  <input
                    name="brand"
                    type="checkbox"
                    value={brand}
                    defaultChecked={checkHandler("brand", `${brand}`)}
                    onClick={(e) => handleClick(e.target)}
                    className={`checkboxBipolarInput ${styles.checkboxBipolarInput}`}
                    id={brand}
                  />
                  <label
                    htmlFor={brand}
                    className="flex flex-row items-center cursor-pointer"
                  >
                    <span
                      className={`checkboxBipolar ${styles.checkboxBipolar}`}
                    >
                      <span className={`on ${styles.on}`}>I</span>
                      <span className={`off ${styles.off}`}>O</span>
                    </span>
                    <span className="brandName ml-2 text-gray-500 capitalize">
                      {" "}
                      {brand}{" "}
                    </span>
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default AllFiltersComponent;
