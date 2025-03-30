import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import User from "@/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { productId } = req.query;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.userId).select("ratings");

    const rating =
      user.ratings.find((r: any) => r.product.toString() === productId)
        ?.rating || 0;

    res.status(200).json({ rating });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}
