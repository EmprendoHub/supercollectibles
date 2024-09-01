import ReportsComponent from "./_components/ReportsComponent";
import React from "react";
import { getCookiesName } from "@/backend/helpers";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

const getAllOrders = async (searchQuery: string, currentCookies: string) => {
  try {
    const session = await getServerSession(options);
    const stringSession = JSON.stringify(session);
    const URL = `${process.env.NEXTAUTH_URL}/api/reports?${searchQuery}`;
    const res = await fetch(URL, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: currentCookies,
        Session: stringSession,
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const ReportsPage = async ({ searchParams }: { searchParams: any }) => {
  const nextCookies = cookies();
  const cookieName = getCookiesName();
  let nextAuthSessionToken: any = nextCookies.get(cookieName);
  nextAuthSessionToken = nextAuthSessionToken?.value;
  const currentCookies = `${cookieName}=${nextAuthSessionToken}`;
  const urlParams = {
    paid: searchParams.paid,
    branch: searchParams.branch,
    "createdAt[lte]": searchParams.max,
    "createdAt[gte]": searchParams.min,
  };

  // Filter out undefined values
  const filteredUrlParams = Object.fromEntries(
    Object.entries(urlParams).filter(([key, value]) => value !== undefined)
  );

  const searchQuery = new URLSearchParams(filteredUrlParams).toString();
  const data = await getAllOrders(searchQuery, currentCookies);

  const itemCount = data?.itemCount;
  return (
    <div>
      <ReportsComponent data={data} itemCount={itemCount} />
    </div>
  );
};

export default ReportsPage;
