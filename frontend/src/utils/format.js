export const formatPrice = (num) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    num
  );

export const clamp = (v, min = 1, max = 999) =>
  Math.max(min, Math.min(max, v));
