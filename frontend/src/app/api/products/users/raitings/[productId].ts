// import { NextApiRequest, NextApiResponse } from "next";
// import jwt from "jsonwebtoken";
// import { User } from "../../../../types/types";
// interface DecodedToken {
//   userId: string;
// }

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { productId } = req.query;
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) return res.status(401).json({ message: "Unauthorized" });

//   try {
//     // تایپ کردن decoded
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    
//     // پیدا کردن کاربر از دیتابیس
//     const user = await User.findById(decoded.userId).select("ratings");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // پیدا کردن رتبه‌بندی محصول
//     const rating =
//       user.ratings.find((r: { product: string; rating: number }) =>
//         r.product.toString() === productId
//       )?.rating || 0;

//     res.status(200).json({ rating });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// }
