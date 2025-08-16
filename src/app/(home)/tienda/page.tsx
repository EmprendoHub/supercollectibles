import ListProducts from "./_components/ListProducts";
import { getCookiesName, removeUndefinedAndPageKeys } from "@/backend/helpers";
import { cookies } from "next/headers";
import ServerPagination from "@/components/layouts/ServerPagination";
import { SLIDER_IMAGES } from "@/backend/data/constants";
import { EmblaOptionsType } from "embla-carousel";
import EmblaCarousel from "../_components/EmblaCarousel";

const OPTIONS: EmblaOptionsType = { loop: true };

export const metadata = {
  title: "Tienda Super Collectibles MX",
  description:
    "Ven y explora nuestra tienda en linea y descubre modelos exclusivos de marcas de alta gama.",
};

const getAllProducts = async (
  searchQuery: string,
  currentCookies: string,
  perPage: any
) => {
  try {
    const URL = `${process.env.NEXTAUTH_URL}/api/products?${searchQuery}`;
    const res = await fetch(URL, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: currentCookies,
        perPage: perPage,
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const TiendaPage = async ({ searchParams }: { searchParams: any }) => {
  const nextCookies = cookies();
  const cookieName = getCookiesName();
  let nextAuthSessionToken: any = nextCookies.get(cookieName);
  nextAuthSessionToken = nextAuthSessionToken?.value;
  const currentCookies = `${cookieName}=${nextAuthSessionToken}`;
  const urlParams = {
    keyword: searchParams.keyword,
    page: searchParams.page,
    category: searchParams.category,
    brand: searchParams.brand,
    "rating[gte]": searchParams.rating,
    "price[lte]": searchParams.max,
    "price[gte]": searchParams.min,
  };
  // Filter out undefined values
  const filteredUrlParams = Object.fromEntries(
    Object.entries(urlParams).filter(([key, value]) => value !== undefined)
  );

  const searchQuery = new URLSearchParams(filteredUrlParams).toString();

  const queryUrlParams = removeUndefinedAndPageKeys(urlParams);
  const keywordQuery = new URLSearchParams(queryUrlParams).toString();

  const per_page = 15;
  const data = await getAllProducts(searchQuery, currentCookies, per_page);

  //pagination
  let page = parseInt(searchParams.page, 15);
  page = !page || page < 1 ? 1 : page;
  const perPage = 15;
  const itemCount = data?.productsCount;
  const totalPages = Math.ceil(data.filteredProductsCount / perPage);
  const prevPage = page - 1 > 0 ? page - 1 : 1;
  const nextPage = page + 1;
  const isPageOutOfRange = page > totalPages;
  const pageNumbers = [];
  const offsetNumber = 2;
  const products = data?.products.products;
  const allBrands = data?.allBrands;
  const allCategories = data?.allCategories;
  const filteredProductsCount = data?.filteredProductsCount;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;
  for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
    if (i >= 1 && i <= totalPages) {
      pageNumbers.push(i);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-5 pb-10">
      {/* <EmblaCarousel slides={SLIDER_IMAGES} options={OPTIONS} /> */}
      <ListProducts
        products={products}
        allBrands={allBrands}
        allCategories={allCategories}
        filteredProductsCount={filteredProductsCount}
      />
      <ServerPagination
        isPageOutOfRange={isPageOutOfRange}
        page={page}
        pageNumbers={pageNumbers}
        prevPage={prevPage}
        nextPage={nextPage}
        totalPages={totalPages}
        searchParams={keywordQuery}
      />
    </div>
  );
};

export default TiendaPage;
