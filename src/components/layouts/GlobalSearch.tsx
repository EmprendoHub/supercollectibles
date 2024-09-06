"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

const GlobalSearch = ({
  className,
}: {
  SetIsActive?: any;
  className: string;
}) => {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();
  const submitHandler = (e: any) => {
    e.preventDefault();
    if (keyword) {
      router.push(`/tienda/?keyword=${keyword}`);
    } else {
      router.push("/tienda");
    }
  };
  return (
    <form
      onSubmit={submitHandler}
      className={`${className} relative flex flex-col gap-3 items-center w-[500px] maxmd:w-[380px] `}
    >
      <input
        className="flex-grow text-foreground text-sm appearance-none border border-gray-200 bg-slate-100  mr-2 py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-[95%]"
        type="text"
        placeholder="Buscar productos, marcas..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        required
      />
      <div
        className="absolute right-6 top-2 cursor-pointer"
        onClick={submitHandler}
      >
        <Search className="text-muted" />
      </div>
    </form>
  );
};

export default GlobalSearch;
