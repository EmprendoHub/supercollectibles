"use client";
import Link from "next/link";
import Image from "next/image";
import {
  FaPencilAlt,
  FaStar,
  FaExclamationCircle,
  FaEye,
} from "react-icons/fa";
import FormattedPrice from "@/backend/helpers/FormattedPrice";
import Swal, { SweetAlertIcon } from "sweetalert2";
import SearchProducts from "@/app/(manager)/admin/productos/search";
import { changeProductAvailability, deleteOneProduct } from "@/app/_actions";
import { FaShop } from "react-icons/fa6";
import { TbWorldWww } from "react-icons/tb";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SiMercadopago } from "react-icons/si";

const AdminProducts = ({
  products,
  filteredProductsCount,
  search,
}: {
  products: any;
  filteredProductsCount: any;
  search: any;
}) => {
  const getPathname = usePathname();
  let pathname: string = "";
  if (getPathname.includes("admin")) {
    pathname = "admin";
  } else if (getPathname.includes("puntodeventa")) {
    pathname = "puntodeventa";
  } else if (getPathname.includes("marketplace")) {
    pathname = "marketplace";
  }
  const searchParams = useSearchParams();
  const searchValue = searchParams.get("page");
  const [currentPage, setCurrentPage] = useState<string>("");

  useEffect(() => {
    if (searchValue !== null) {
      setCurrentPage(searchValue);
    } else {
      setCurrentPage(""); // or any default value you prefer
    }
  }, [searchValue]);

  const deleteHandler: any = (product_id: string) => {
    Swal.fire({
      title: "¿Estas seguro(a) que quieres eliminar a este producto?",
      text: "¡Esta acción es permanente y no se podrá revertir!",
      icon: "error",
      iconColor: "#fafafa",
      background: "#d33",
      color: "#fafafa",
      focusCancel: true,
      showCancelButton: true,
      confirmButtonColor: "#4E0000",
      cancelButtonColor: "#000",
      confirmButtonText: "¡Sí, Eliminar!",
      cancelButtonText: "No, cancelar!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteOneProduct(product_id);
      }
    });
  };

  const deactivateOnlineHandler = (product_id: any, active: boolean) => {
    const location = "Online";
    let title: string;
    let text: string;
    let confirmBtn: string;
    let successTitle: string;
    let successText: string;
    let icon: SweetAlertIcon;
    let confirmBtnColor: string;
    if (active === true) {
      icon = "warning";
      title = "Estas seguro(a)?";
      text =
        "¡Estas a punto de desactivar a este producto en el Sitio Web y quedara sin acceso!";
      confirmBtn = "¡Sí, desactivar producto!";
      confirmBtnColor = "#CE7E00";
      successTitle = "Desactivar!";
      successText = "El producto ha sido desactivado.";
    } else {
      icon = "success";
      title = "Estas seguro(a)?";
      text = "¡Estas a punto de Activar a este producto en el Sitio Web!";
      confirmBtn = "¡Sí, Activar producto!";
      confirmBtnColor = "#228B22";
      successTitle = "Reactivado!";
      successText = "El producto ha sido Activado.";
    }
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: confirmBtnColor,
      cancelButtonColor: "#000",
      confirmButtonText: confirmBtn,
      cancelButtonText: "No, cancelar!",
    }).then((result) => {
      if (result.isConfirmed) {
        changeProductAvailability(product_id, location);
      }
    });
  };

  const deactivateBranchHandler = (product_id: any, active: boolean) => {
    const location = "Branch";
    let title: string;
    let text: string;
    let confirmBtn: string;
    let successTitle: string;
    let successText: string;
    let icon: SweetAlertIcon;
    let confirmBtnColor: string;
    if (active === true) {
      icon = "warning";
      title = "Estas seguro(a)?";
      text =
        "¡Estas a punto de desactivar a este producto de la sucursal física y quedara sin acceso!";
      confirmBtn = "¡Sí, desactivar producto!";
      confirmBtnColor = "#CE7E00";
      successTitle = "Desactivar!";
      successText = "El producto ha sido desactivado.";
    } else {
      icon = "success";
      title = "Estas seguro(a)?";
      text = "¡Estas a punto de Activar a este producto a la sucursal física!";
      confirmBtn = "¡Sí, Activar producto!";
      confirmBtnColor = "#228B22";
      successTitle = "Reactivado!";
      successText = "El producto ha sido Activado.";
    }
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: confirmBtnColor,
      cancelButtonColor: "#000",
      confirmButtonText: confirmBtn,
      cancelButtonText: "No, cancelar!",
    }).then((result) => {
      if (result.isConfirmed) {
        changeProductAvailability(product_id, location);
      }
    });
  };

  const deactivateMercadoLibreHandler = (product_id: any, active: boolean) => {
    const location = "MercadoLibre";
    let title;
    let text;
    let confirmBtn;
    let successTitle;
    let successText;
    let icon;
    let confirmBtnColor;
    if (active === true) {
      icon = "warning";
      title = "Estas seguro(a)?";
      text = "¡Estas a punto de desactivar a este producto en MercadoLibre!";
      confirmBtn = "¡Sí, desactivar producto!";
      confirmBtnColor = "#CE7E00";
      successTitle = "Desactivar!";
      successText = "El producto ha sido desactivado en MercadoLibre.";
    } else {
      icon = "success";
      title = "Estas seguro(a)?";
      text = "¡Estas a punto de Activar a este producto en MercadoLibre!";
      confirmBtn = "¡Sí, Activar producto en MercadoLibre!";
      confirmBtnColor = "#228B22";
      successTitle = "Reactivado!";
      successText = "El producto ha sido Activado en MercadoLibre.";
    }
    Swal.fire({
      title: title,
      text: text,
      imageUrl: "/icons/mercadolibre-white.svg",
      imageWidth: 100,
      imageHeight: 100,
      showCancelButton: true,
      confirmButtonColor: confirmBtnColor,
      cancelButtonColor: "#000",
      confirmButtonText: confirmBtn,
      cancelButtonText: "No, cancelar!",
    }).then((result) => {
      if (result.isConfirmed) {
        changeProductAvailability(product_id, location);
      }
    });
  };

  return (
    <>
      <hr className="my-4 maxsm:my-1" />
      <div className="relative min-h-full shadow-md sm:rounded-xl">
        <div className=" flex flex-row  maxsm:items-start items-center justify-between">
          <h1 className="text-3xl maxsm:text-base mb-2 maxsm:mb-1 ml-4 maxsm:ml-0 font-bold font-EB_Garamond w-1/2">
            {`${filteredProductsCount} Productos `}
          </h1>
          <SearchProducts search={search} />
        </div>
        <table className="w-full text-sm  text-left h-full">
          <thead className="text-l text-gray-700 uppercase">
            <tr className="flex flex-row items-center">
              <th
                scope="col"
                className="w-full px-6 maxsm:px-0 py-3 maxsm:hidden"
              >
                Titulo
              </th>
              <th scope="col" className="w-full px-6 maxsm:px-0 py-3 ">
                Img
              </th>

              <th scope="col" className="w-full px-6 maxsm:px-0 py-3 ">
                Precio
              </th>

              <th scope="col" className="w-full px-1 py-3 ">
                Exst.
              </th>
              <th scope="col" className="w-full px-1 py-3 text-center">
                ...
              </th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product: any, index: any) => (
              <tr
                className={`flex flex-row items-center ${
                  product?.active === true
                    ? "bg-background"
                    : "bg-card text-card-foreground"
                }`}
                key={product?._id}
              >
                <td
                  className={`w-full px-6 maxsm:px-0 py-0 font-bold maxsm:hidden text-[12px]`}
                >
                  {product?.title?.substring(0, 30)}...
                </td>

                <td className="w-full px-6 maxsm:px-0 py-0 relative ">
                  <span className="relative flex items-center justify-center text-foreground w-20 h-20 maxsm:w-8 maxsm:h-8 shadow mt-2">
                    <Link
                      href={`/${pathname}/productos/variacion/${product?.slug}?&callback=${searchParams}`}
                    >
                      <Image
                        src={product?.images[0]?.url}
                        alt="Title"
                        width={200}
                        height={200}
                        className="w-14 object-cover h-14 maxsm:w-14 rounded-xl"
                      />
                    </Link>

                    {product?.featured ? (
                      <span className="absolute -top-3 -right-1 z-20">
                        <FaStar className="text-xl text-amber-600" />
                      </span>
                    ) : (
                      ""
                    )}
                  </span>
                </td>
                <td className="w-full px-6 maxsm:px-0 py-0 ">
                  <b>
                    <FormattedPrice amount={product?.variations[0]?.price} />
                  </b>
                </td>

                <td className="w-full px-1 py-0 ">{product?.stock}</td>
                <td className="w-full px-1 py-0 flex flex-row items-center gap-x-1">
                  <Link
                    href={`/${pathname}/productos/ver/${product?.slug}?&callback=${currentPage}`}
                    className="p-2 inline-block text-foreground hover:text-card-foreground bg-background shadow-sm border border-gray-200 rounded-xl hover:bg-background cursor-pointer "
                  >
                    <FaEye className="maxsm:text-[10px]" />
                  </Link>
                  <Link
                    href={`/${pathname}/productos/variacion/${product?.slug}?&callback=${currentPage}`}
                    className="p-2 inline-block text-foreground hover:text-card-foreground bg-background shadow-sm border border-gray-200 rounded-xl hover:bg-background cursor-pointer "
                  >
                    <FaPencilAlt className="maxsm:text-[10px]" />
                  </Link>

                  <button
                    onClick={() =>
                      deactivateOnlineHandler(
                        product?._id,
                        product?.availability?.online
                      )
                    }
                    className="p-2 inline-block text-foreground hover:text-card-foreground bg-background shadow-sm border border-gray-200 rounded-xl hover:bg-background cursor-pointer "
                  >
                    <TbWorldWww
                      className={` ${
                        product?.availability?.online === true
                          ? "text-green-800 maxsm:text-[10px]"
                          : "text-slate-400 maxsm:text-[10px]"
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => deleteHandler(product?._id)}
                    className="p-2 inline-block text-foreground hover:text-card-foreground bg-background shadow-sm border border-gray-200 rounded-xl hover:bg-background cursor-pointer "
                  >
                    <FaExclamationCircle
                      className={`text-red-500 maxsm:text-[10px]`}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="my-4" />
    </>
  );
};

export default AdminProducts;
