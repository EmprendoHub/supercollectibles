"use client";
import React from "react";
import AdminSidebar, { SideBarItem } from "../_components/AdminSidebar";
import { usePathname } from "next/navigation";
import { TbDeviceIpadDollar, TbReport } from "react-icons/tb";
import { PiUserListLight } from "react-icons/pi";
import { CiGrid31 } from "react-icons/ci";
import { TfiDashboard } from "react-icons/tfi";
import { MdOutlinePostAdd } from "react-icons/md";
import { GiClothes } from "react-icons/gi";
import { FaCartPlus } from "react-icons/fa6";

const SideBarRender = () => {
  const pathname = usePathname();
  return (
    <AdminSidebar>
      <SideBarItem
        icon={<TfiDashboard size={20} />}
        text={"Tablero"}
        active={pathname === "/admin" ? "true" : "false"}
        url={"/admin"}
      />
      <SideBarItem
        icon={<TbDeviceIpadDollar size={20} />}
        text={"Pedidos"}
        active={pathname === "/admin/pedidos" ? "true" : "false"}
        url={"/admin/pedidos"}
      />
      <SideBarItem
        icon={<CiGrid31 size={20} />}
        text={"Publicaciones"}
        active={pathname === "/admin/blog" ? "true" : "false"}
        url={"/admin/blog"}
        alert
        dropdownItems={[
          {
            text: "Publicaciones",
            url: "/admin/blog",
            active: pathname === "/admin/blog" ? "true" : "false",
            icon: <CiGrid31 size={20} />,
          },
          {
            text: "Nueva",
            url: "/admin/blog/editor",
            active: pathname === "/admin/blog/editor" ? "true" : "false",
            icon: <MdOutlinePostAdd size={20} />,
          },
          // Add more dropdown items as needed
        ]}
      />

      <SideBarItem
        icon={<GiClothes size={20} />}
        text={"Productos"}
        active={
          pathname === "/admin/productos" ||
          pathname === "/admin/productos/nuevo"
            ? "true"
            : "false"
        }
        url={"/admin/productos"}
        alert
        dropdownItems={[
          {
            text: "Productos",
            url: "/admin/productos",
            active: pathname === "/admin/productos" ? "true" : "false",
            icon: <GiClothes size={20} />,
          },
          {
            text: "Nuevo",
            url: "/admin/productos/nuevo",
            active: pathname === "/admin/productos/nuevo" ? "true" : "false",
            icon: <FaCartPlus size={20} />,
          },
          // Add more dropdown items as needed
        ]}
      />
      <SideBarItem
        icon={<PiUserListLight size={20} />}
        text={"Clientes"}
        active={pathname === "/admin/clientes" ? "true" : "false"}
        url={"/admin/clientes"}
      />
      <SideBarItem
        icon={<TbReport size={20} />}
        text={"Reportes"}
        active={pathname === "/admin/reportes" ? "true" : "false"}
        url={"/admin/reportes"}
      />
    </AdminSidebar>
  );
};

export default SideBarRender;
