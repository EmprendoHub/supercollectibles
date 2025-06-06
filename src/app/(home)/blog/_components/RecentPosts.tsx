import { sortBlogs } from "@/backend/helpers";
import Link from "next/link";
import React from "react";
import BlogLayoutThree from "./BlogLayoutThree";

const RecentPosts = ({ blogs }: { blogs: any }) => {
  const sortedBlogs = sortBlogs(blogs);
  return (
    <section className="w-full  mt-16 sm:mt-24 md:mt-32 px-5 sm:px-10 md:px-12 sxl:px-32 py-20 flex flex-col items-center justify-center">
      <div className="w-full flex  justify-between">
        <h2 className="w-fit font-EB_Garamond  inline-block font-bold capitalize text-2xl md:text-4xl text-dark dark:text-light">
          Publicaciones recientes
        </h2>
        <Link
          href="/blog/categorias"
          className="inline-block font-medium text-accent dark:text-accentDark underline underline-offset-2      text-base md:text-lg"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-rows-2 gap-16 mt-16">
        {sortedBlogs.slice(4, 10).map((blog: any, index: number) => {
          return (
            <article key={index} className="col-span-1 row-span-1 relative">
              <BlogLayoutThree blog={blog} />
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default RecentPosts;
