import ServerPagination from "@/components/layouts/ServerPagination";
import UserOrders from "../_components/UserOrders";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

import { revalidatePath } from "next/cache";
import React from "react";
import { removeUndefinedAndPageKeys } from "@/backend/helpers";

async function getAllOrders(searchQuery: any, session: any) {
  try {
    const stringSession = JSON.stringify(session);
    const URL = `${process.env.NEXTAUTH_URL}/api/orders?${searchQuery}`;
    const res = await fetch(URL, {
      headers: {
        Session: stringSession,
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.log(error.message);
  }
}

const UserOrdersPage = async ({ searchParams }: { searchParams: any }) => {
  const urlParams = {
    keyword: searchParams.keyword,
    page: searchParams.page,
  };

  // Filter out undefined values
  const filteredUrlParams = Object.fromEntries(
    Object.entries(urlParams).filter(([key, value]) => value !== undefined)
  );
  const searchQuery = new URLSearchParams(filteredUrlParams).toString();

  const queryUrlParams = removeUndefinedAndPageKeys(urlParams);
  const keywordQuery = new URLSearchParams(queryUrlParams).toString();

  const session = await getServerSession(options);
  const data = await getAllOrders(searchQuery, session);
  const filteredOrdersCount = data?.itemCount;
  const orders = data?.orders.orders;
  let page = parseInt(searchParams.page, 10);
  page = !page || page < 1 ? 1 : page;
  const perPage = Number(data?.resPerPage);
  const totalPages = Math.ceil(data.itemCount / perPage);
  const prevPage = page - 1 > 0 ? page - 1 : 1;
  const nextPage = page + 1;
  const isPageOutOfRange = page > totalPages;
  const pageNumbers = [];
  const offsetNumber = 1;
  for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
    if (i >= 1 && i <= totalPages) {
      pageNumbers.push(i);
    }
  }

  revalidatePath("/perfil/pedidos");
  return (
    <>
      <UserOrders orders={orders} filteredOrdersCount={filteredOrdersCount} />
      <ServerPagination
        isPageOutOfRange={isPageOutOfRange}
        page={page}
        pageNumbers={pageNumbers}
        prevPage={prevPage}
        nextPage={nextPage}
        totalPages={totalPages}
        searchParams={keywordQuery}
      />
    </>
  );
};

export default UserOrdersPage;
