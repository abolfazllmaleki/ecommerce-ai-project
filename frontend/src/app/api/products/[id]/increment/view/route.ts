export async function PATCH(
  req: Request,
  { params }: { params: { id: string; field: string } }
) {
  try {
    const { id, field } = params;

    // فراخوانی به بک‌اند NestJS
    const nestResponse = await fetch(
      `http://localhost:3000/products/${id}/increment/views`,
      {
        method: "PATCH",
      }
    );

    if (!nestResponse.ok) {
      const errorData = await nestResponse.json();
      return new Response(JSON.stringify(errorData), {
        status: nestResponse.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(await nestResponse.json()), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
