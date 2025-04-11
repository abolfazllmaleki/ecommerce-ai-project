export const rateProduct = async (
  userId: string,
  productId: string,
  rating: number
) => {
  const res = await fetch(`/api/user/${userId}/ratings`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId, rating }),
  });

  if (!res.ok) throw new Error("Failed to submit rating");

  return await res.json();
};
