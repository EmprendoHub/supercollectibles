"use client";
import React from "react";
import { useSelector } from "react-redux";
import { AiOutlineUser } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { loadStripe } from "@stripe/stripe-js";
import { resetCart, saveOrder } from "@/redux/shoppingSlice";
import { useDispatch } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import FormattedPrice from "@/backend/helpers/FormattedPrice";
import { revalidatePath } from "next/cache";

const PaymentForm = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user);
  const { productsData, shippingInfo, userInfo, affiliateInfo } = useSelector(
    (state: any) => state.compras
  );

  const amountTotal = productsData?.reduce(
    (acc: any, cartItem: any) => acc + cartItem.quantity * cartItem.price,
    0
  );

  const shipAmount = 0;
  const layawayAmount = Number(amountTotal) * 0.3;

  const totalAmountCalc = Number(amountTotal) + Number(shipAmount);

  // Helper function to extract device information from user agent string

  //=============================== Stripe Payment starts here ============================

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE__KEY!);
  const handleCheckout = async (payType: any) => {
    const stripe = await stripePromise;

    const response = await fetch(`/api/checkout?${payType}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: productsData,
        email: session?.user?.email,
        user: userInfo,
        shipping: shippingInfo,
        affiliateInfo: affiliateInfo,
        payType: payType,
      }),
    });

    try {
      const data = await response.json();

      dispatch(saveOrder({ order: productsData, id: data.id }));
      stripe?.redirectToCheckout({ sessionId: data.id });
      dispatch(resetCart());
      revalidatePath("/admin/pedidos");
    } catch (error) {
      console.log(error);
    }
  };

  //=============================== Stripe Payment ends here ============================
  return (
    <section className="p-1 maxsm:py-7 bg-card rounded-xl">
      <div className=" max-w-screen-xl mx-auto bg-background flex flex-col justify-between p-2 rounded-xl">
        <ul className="mb-5">
          <li className="flex justify-between text-muted  mb-1">
            <span>Sub-Total:</span>
            <span>
              <FormattedPrice amount={amountTotal} />
            </span>
          </li>
          <li className="flex justify-between text-muted  mb-1">
            <span className="text-xs">Total de Artículos:</span>
            <span className="text-emerald-700 text-[11px]">
              {productsData?.reduce(
                (acc: any, cartItem: any) => acc + cartItem.quantity,
                0
              )}
              (Artículos)
            </span>
          </li>

          <li className="flex justify-between text-gray-600  mb-1">
            <span>Envió:</span>
            <span>
              <FormattedPrice amount={shipAmount} />
            </span>
          </li>
          <li className="text-lg font-bold border-t flex justify-between mt-3 pt-3">
            <span>Total:</span>
            <span>
              <FormattedPrice amount={totalAmountCalc} />
            </span>
          </li>
        </ul>

        {isLoggedIn ? (
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => handleCheckout("total")}
              className="bg-emerald-600 rounded-xl w-full text-slate-100 mt-4 py-3 px-6 hover:bg-emerald-800 hover:text-foreground duration-300 ease-in-out cursor-pointer"
            >
              Pagar Total{" "}
            </button>
            <p className="text-[11px]">
              Si realizaste un pago por Oxxo o Transferencia Bancaria
            </p>
            <p className="text-[11px]">
              Permite hasta 24 horas después de tu pago para que se refleje en
              tu cuenta.
            </p>
            <Link
              href="/carrito"
              className="w-full mt-4 text-center px-5 rounded-xl py-2 inline-block text-muted bg-background shadow-sm border border-gray-200 hover:bg-card hover:text-white"
            >
              Regresar
            </Link>
          </div>
        ) : (
          <div>
            {/** Login/Register */}
            {!session && (
              <>
                <Link href={"/iniciar"}>
                  <div className=" w-1/4 maxmd:w-2/3 sm:w-full bg-black text-slate-100 mt-4 py-3 px-6 hover:bg-green-600 duration-500 cursor-pointer">
                    <div className="flex flex-row justify-center items-center gap-x-3 ">
                      <AiOutlineUser className="text-ld" />
                      <p className="text-sm font-base">Iniciar/Registro</p>
                    </div>
                  </div>
                </Link>
              </>
            )}
            <p className="text-[10px] mt-1 text-orange-600 py-2">
              Por favor inicie sesión para continuar
            </p>
          </div>
        )}
        <div className="trustfactor-class">
          <Image
            src={"/icons/stripe-badge-transparente.webp"}
            width={500}
            height={200}
            alt="Stripe Payment"
          />
        </div>
      </div>
    </section>
  );
};

export default PaymentForm;
