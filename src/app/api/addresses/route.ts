import dbConnect from "@/lib/db";
import Address from "@/backend/models/Address";
import { headers } from "next/headers";
import { userAgent } from "next/server";

export async function GET(request: Request) {
  const sessionRaw = request.headers.get("session");
  const session = sessionRaw ? JSON.parse(sessionRaw) : null;

  // Extract the user agent string from the browser
  const header = headers();
  const { device } = userAgent({ headers: request.headers });
  const viewport = device.type === "mobile" ? "mobile" : "desktop";
  const ip = (header.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0];
  console.log(ip, "userip");
  console.log(viewport, "viewport");

  if (!session) {
    // Not Signed in
    return new Response("You are not authorized, eh eh eh, no no no", {
      status: 401,
    });
  }

  try {
    await dbConnect();
    const addresses = await Address.find({ user: session.user?._id });

    return new Response(JSON.stringify(addresses), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
