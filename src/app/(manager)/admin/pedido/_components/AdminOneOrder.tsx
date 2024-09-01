"use client";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FormattedPrice from "@/backend/helpers/FormattedPrice";
import { formatDate, formatSpanishDate } from "@/backend/helpers";
import { FaComment } from "react-icons/fa6";
import ModalOrderUpdate from "@/components/modals/ModalOrderUpdate";
import { FaCloudUploadAlt } from "react-icons/fa";
import { toast } from "sonner";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { updateOrder } from "@/app/_actions";

const AdminOneOrder = ({
  order,
  deliveryAddress,
  id,
  orderPayments,
  customer,
  currentCookies,
}: {
  order?: any;
  deliveryAddress?: any;
  id: any;
  orderPayments?: any;
  customer?: any;
  currentCookies: any;
}) => {
  const [showModal, setShowModal] = useState(false);

  const [currentOrderStatus, setCurrentOrderStatus] = useState(
    order?.orderStatus
  );

  function getQuantities(orderItems: any[]) {
    // Use reduce to sum up the 'quantity' fields
    const totalQuantity = orderItems?.reduce(
      (sum: any, obj: { quantity: any }) => sum + obj.quantity,
      0
    );
    return totalQuantity;
  }

  function getTotal(orderItems: any[]) {
    // Use reduce to sum up the 'total' field
    const totalAmount = orderItems?.reduce(
      (acc, cartItem) => acc + cartItem.quantity * cartItem.price,
      0
    );
    return totalAmount;
  }

  function getPendingTotal(orderItems: any[], orderAmountPaid: number) {
    // Use reduce to sum up the 'total' field
    const totalAmount = orderItems?.reduce(
      (acc, cartItem) => acc + cartItem.quantity * cartItem.price,
      0
    );
    const pendingAmount = totalAmount - orderAmountPaid;
    return pendingAmount;
  }

  function subtotal() {
    let sub = order?.paymentInfo?.amountPaid - order?.ship_cost;
    return sub;
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (order?.orderStatus === currentOrderStatus) {
      toast("No hubo ningún cambio");
      return;
    }

    try {
      const formData = new FormData();
      formData.set("orderStatus", currentOrderStatus);
      formData.set("_id", id);

      try {
        const res: any = await updateOrder(formData);

        if (res.ok) {
          const data = await res.json();
          toast("El pedido se actualizo exitosamente");
          setCurrentOrderStatus(data.payload.orderStatus);

          return;
        }
      } catch (error) {
        toast("Error actualizando pedido. Por favor Intenta de nuevo.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ModalOrderUpdate
        showModal={showModal}
        setShowModal={setShowModal}
        order={order}
      />
      <div className="pl-5 maxsm:pl-3 relative overflow-x-auto shadow-md maxsm:rounded-xl p-5 maxsm:p-1 ">
        <div className="flex flex-col items-start justify-start gap-x-5 ml-4">
          <Link href={`/admin/cliente/${customer?._id}`}>
            <h2 className="text-3xl font-bold text-slate-700">
              {order?.customerName}
            </h2>
          </Link>
          <p className="text-muted">{customer?.email || customer?.phone}</p>
        </div>
        <div className="flex flex-row maxsm:flex-col items-start justify-start gap-x-5">
          <h2 className="text-3xl mb-4 ml-4 font-bold ">
            Pedido #{order?.orderId}
          </h2>
          <h2
            className={`text-3xl mb-8 ml-4 font-bold uppercase ${
              order?.orderStatus === "Apartado"
                ? "text-amber-700"
                : order?.paymentInfo?.status === "Pagado"
                ? "text-green-700"
                : ""
            }`}
          >
            {order?.orderStatus}
          </h2>
        </div>
        {order?.branch !== "Sucursal" ? (
          <table className="w-full text-sm text-left flex flex-col maxsm:flex-row">
            <thead className="text-l text-gray-700 uppercase">
              <tr className="flex flex-row maxsm:flex-col">
                <th scope="col" className="w-1/6 px-6 py-2">
                  Domicilio
                </th>
                <th scope="col" className="w-1/6 maxsm:w-full px-6 py-2">
                  Ciudad
                </th>
                <th scope="col" className="w-1/6 maxsm:w-full px-6 py-2">
                  Entidad
                </th>
                <th scope="col" className="w-1/6 maxsm:w-full px-6 py-2">
                  Código Postal
                </th>
                <th scope="col" className="w-1/6 maxsm:w-full px-6 py-2">
                  Tel
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-background flex flex-row maxsm:flex-col">
                <td className="w-1/6 maxsm:w-full px-6 py-2">
                  {deliveryAddress?.street}
                </td>
                <td className="w-1/6 maxsm:w-full px-6 py-2">
                  {deliveryAddress?.city}
                </td>
                <td className="w-1/6 maxsm:w-full px-6 py-2">
                  {deliveryAddress?.province}
                </td>
                <td className="w-1/6 maxsm:w-full px-6 py-2">
                  {deliveryAddress?.zip_code}
                </td>
                <td className="w-1/6 maxsm:w-full px-6 py-2">
                  {deliveryAddress?.phone}
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <div className="w-full flex maxsm:flex-col gap-3 justify-between">
            <div className="flex items-center gap-1 tracking-wide text-muted">
              <FaComment size={20} />
              <em className="text-blue-800">{order?.comment}</em>
            </div>
            <div>
              <div
                onClick={() => setShowModal(true)}
                className="bg-black flex gap-1 items-center text-white rounded-sm px-6 py-2 cursor-pointer"
              >
                <FaCloudUploadAlt /> Actualizar
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-xl px-5">
        <table className="w-full text-sm text-left">
          <thead className="text-l text-gray-700 uppercase">
            <tr>
              <th scope="col" className="px-2 maxsm:px-0 py-3">
                Nombre
              </th>
              <th scope="col" className="px-2 maxsm:px-0 py-3">
                Img
              </th>
              <th scope="col" className="px-2 maxsm:px-0 py-3 maxsm:hidden">
                Talla
              </th>
              <th scope="col" className="px-2 maxsm:px-0 py-3  maxsm:hidden">
                Color
              </th>
              <th scope="col" className="px-2 maxsm:px-0 py-3">
                Cant.
              </th>
              <th scope="col" className="px-2 maxsm:px-0 py-3">
                Precio
              </th>
            </tr>
          </thead>
          <tbody>
            {order?.orderItems?.map(
              (
                item: {
                  name: string;
                  image: string | StaticImport;
                  size: string | number;
                  color: string;
                  quantity: string | number;

                  price: any;
                },
                index: React.Key | null | undefined
              ) => (
                <tr className="bg-background" key={index}>
                  <td className="px-2 maxsm:px-0 py-2">
                    {item.name.substring(0, 13)}...
                  </td>
                  <td className="px-2 maxsm:px-0 py-2">
                    <Image
                      alt="producto"
                      src={item.image}
                      width={50}
                      height={50}
                    />
                  </td>
                  <td className="px-2 maxsm:px-0 py-2 maxsm:hidden">
                    {item.size}
                  </td>
                  <td className="px-2 maxsm:px-0 py-2 maxsm:hidden">
                    {item.color}
                  </td>
                  <td className="px-2 maxsm:px-0 py-2">{item.quantity}</td>
                  <td className="px-2 maxsm:px-0 py-2">
                    <FormattedPrice amount={item.price || 0} />
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
      <div className="relative flex flex-row maxmd:flex-col-reverse items-start justify-start overflow-x-auto shadow-md p-5 maxmd:p-1 gap-12">
        <div className="w-1/3 maxmd:w-full">
          <div className=" max-w-screen-xl mx-auto bg-background flex flex-col p-2">
            <h2 className="text-2xl">Totales</h2>
            {order?.orderStatus === "Apartado" ? (
              <ul className="mb-5">
                <li className="flex justify-between gap-x-5 text-muted  mb-1">
                  <span>Total de Artículos:</span>
                  <span className="text-green-700">
                    {getQuantities(order?.orderItems)} (Artículos)
                  </span>
                </li>
                <li className="flex justify-between gap-x-5 text-muted  mb-1">
                  <span>Sub-Total:</span>
                  <span>
                    <FormattedPrice amount={subtotal() || 0} />
                  </span>
                </li>

                <li className="flex justify-between gap-x-5 text-muted  mb-1">
                  <span>Total:</span>
                  <span>
                    <FormattedPrice amount={getTotal(order?.orderItems) || 0} />
                  </span>
                </li>
                <li className="text-xl font-bold border-t flex justify-between gap-x-5  pt-3">
                  <span>Abono:</span>
                  <span>
                    - <FormattedPrice amount={order?.paymentInfo?.amountPaid} />
                  </span>
                </li>

                <li className="text-xl text-amber-700 font-bold border-t flex justify-between gap-x-5  pt-1">
                  <span>Pendiente:</span>
                  <span>
                    <FormattedPrice
                      amount={
                        getPendingTotal(
                          order?.orderItems,
                          order?.paymentInfo?.amountPaid
                        ) || 0
                      }
                    />
                  </span>
                </li>
              </ul>
            ) : (
              <ul className="mb-5">
                <li className="flex justify-between gap-x-5 text-muted  mb-1">
                  <span>Sub-Total:</span>
                  <span>
                    <FormattedPrice amount={subtotal() || 0} />
                  </span>
                </li>
                <li className="flex justify-between gap-x-5 text-muted  mb-1">
                  <span>Total de Artículos:</span>
                  <span className="text-green-700">
                    {getQuantities(order?.orderItems)} (Artículos)
                  </span>
                </li>
                <li className="flex justify-between gap-x-5 text-muted  mb-1">
                  <span>Envió:</span>
                  <span>
                    <FormattedPrice amount={order?.ship_cost || 0} />
                  </span>
                </li>
                <li className="text-3xl font-bold border-t flex justify-between gap-x-5 mt-3 pt-3">
                  <span>Total:</span>
                  <span>
                    <FormattedPrice amount={getTotal(order?.orderItems) || 0} />
                  </span>
                </li>
              </ul>
            )}
          </div>
        </div>
        <div className="flex flex-col w-full ">
          <div className="relative overflow-x-auto shadow-md sm:rounded-xl p-3 w-full">
            <h2 className="text-2xl">Pagos</h2>
            <table className="w-full text-sm text-left">
              <thead className="text-l text-gray-700 uppercase">
                <tr className="flex flex-row justify-between ">
                  <th scope="col" className="px-2 maxsm:px-0 py-3  w-full">
                    Fecha
                  </th>
                  <th
                    scope="col"
                    className="px-2 maxsm:px-0 py-3 maxsm:hidden  w-full"
                  >
                    Método
                  </th>
                  <th scope="col" className="px-2 maxsm:px-0 py-3  w-full">
                    Ref
                  </th>
                  <th scope="col" className="px-2 maxsm:px-0 py-3  w-full">
                    Cant.
                  </th>
                  <th
                    scope="col"
                    className="px-2 maxsm:px-0 py-3 maxsm:hidden w-full"
                  >
                    Nota.
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderPayments?.map(
                  (payment: {
                    _id: React.Key | null | undefined;
                    pay_date: any;
                    method: string;
                    reference: string | number;

                    amount: any;
                    comment: string;
                  }) => (
                    <tr
                      className="bg-background flex flex-row justify-between "
                      key={payment?._id}
                    >
                      <td className="px-2 maxsm:px-0 py-2 w-full">
                        {formatSpanishDate(payment?.pay_date)}
                      </td>
                      <td className="px-2 maxsm:px-0 py-2  w-full uppercase text-xs maxsm:hidden">
                        {payment?.method === "card"
                          ? "tarjeta"
                          : payment?.method === "customer_balance"
                          ? "transferencia"
                          : `${payment?.method}`}
                      </td>
                      <td className="px-2 maxsm:px-0 py-2  w-full uppercase text-xs">
                        {payment?.reference}
                      </td>
                      <td className="px-2 maxsm:px-0 py-2  w-full font-bold">
                        <FormattedPrice amount={payment?.amount || 0} />
                      </td>
                      <td className="px-2 maxsm:px-0 py-2 maxsm:hidden w-full text-xs">
                        {payment?.comment}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          <hr className="border border-gray-300" />
        </div>
      </div>
    </>
  );
};

export default AdminOneOrder;
