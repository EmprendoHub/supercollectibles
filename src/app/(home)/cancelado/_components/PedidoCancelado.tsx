"use client";
import React, { useEffect } from "react";
import { addToCart } from "@/redux/shoppingSlice";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

const PedidoCancelado = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { orderData } = useSelector((state: any) => state?.compras);
  useEffect(() => {
    orderData.order.forEach((product: any) => {
      dispatch(addToCart(product));
    });
    router.replace("/carrito");
    // eslint-disable-next-line
  }, [orderData]);
  return <div className="text-black"></div>;
};

export default PedidoCancelado;
