// app/api/users/me/wishlist/[action]/route.ts
export async function PATCH(
  req: Request,
  { params }: { params: { action: string } }
) {
  console.log("yess");
  try {
    const { action } = params;
    const token = req.headers.get("Authorization")?.split(" ")[1];

    const response = await fetch(
      `http://localhost:3000/users/me/wishlist/${action}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: await req.text(),
      }
    );

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
