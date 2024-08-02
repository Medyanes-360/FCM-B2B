import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { getAllData, getDataByMany } from "@/services/serviceOperations";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let orders;

    if (session.user.role === "admin") {
      // Admin için tüm siparişleri getir
      orders = await getAllData("ALLORDERS");
    } else {
      // Normal kullanıcı için sadece kendi siparişlerini getir
      orders = await getDataByMany("ALLORDERS", { CARKOD: session.user.id });
    }

    if (orders.error) {
      throw new Error(orders.error);
    }

    return res.status(200).json(orders);
  } catch (error) {
    console.error("API Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
