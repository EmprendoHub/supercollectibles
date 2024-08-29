import dbConnect from "@/lib/db";
import Address from "@/backend/models/Address";
import { headers } from "next/headers";
import { userAgent } from "next/server";

export async function GET(request: any) {
  const sessionRaw = await request.headers.get("session");
  const session = JSON.parse(sessionRaw);

  // Extract the user agent string from the browser
  const header = headers();
  const { device } = userAgent(request);
  const viewport = device.type === "mobile" ? "mobile" : "desktop";
  const ip = (header.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0];
  console.log(ip, "userip");
  console.log(viewport, "viewport");

  if (!session) {
    // Not Signed in
    return new Response("You are not authorized, eh eh eh, no no no", {
      status: 400,
    });
  }

  try {
    await dbConnect();
    const addresses = await Address.find({ user: session?.user?._id });

    return new Response(JSON.stringify(addresses), { status: 201 });
  } catch (error: any) {
    return new Response(JSON.stringify(error.message), { status: 500 });
  }
}
