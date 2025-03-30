// import { NextRequest, NextResponse } from "next/server";

// export async function PATCH(req: NextRequest) {
//   try {
//     const { productId, quantity } = await req.json();

//     // فراخوانی به بک‌اند NestJS
//     const res = await fetch(`http://localhost:3000/cart`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: req.headers.get("Authorization") || "",
//       },
//       body: JSON.stringify({ productId, quantity }),
//     });

//     if (!res.ok) throw new Error("Update failed");

//     return NextResponse.json(await res.json());
//   } catch (error) {
//     return NextResponse.json(
//       { error: error || "Server error" },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(req: NextRequest) {
//   try {
//     const productId = req.nextUrl.searchParams.get("productId");

//     const res = await fetch(
//       `http://localhost:3000/cart?productId=${productId}`,
//       {
//         method: "DELETE",
//         headers: {
//           Authorization: req.headers.get("Authorization") || "",
//         },
//       }
//     );

//     if (!res.ok) throw new Error("Deletion failed");

//     return NextResponse.json(await res.json());
//   } catch (error) {
//     return NextResponse.json(
//       { error: error || "Server error" },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("add to cart is called post");
  try {
    const { productId } = await req.json();

    // ارسال درخواست به بکاند
    const response = await fetch(`http://localhost:3000/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.get("Authorization") || "",
      },
      body: JSON.stringify({ productId }),
    });

    // بررسی وضعیت پاسخ
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText || "خطا در افزودن به سبد خرید" },
        { status: response.status }
      );
    }

    // پردازش پاسخ موفق
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("خطا:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
