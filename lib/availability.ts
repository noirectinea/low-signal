export type AvailabilityState = "in_stock" | "low_stock" | "sold_out";

export function getAvailabilityState(stock: number): AvailabilityState {
  if (stock <= 0) {
    return "sold_out";
  }

  if (stock <= 3) {
    return "low_stock";
  }

  return "in_stock";
}

export function getAvailabilityLabel(stock: number) {
  const state = getAvailabilityState(stock);

  if (state === "sold_out") {
    return "Sold out";
  }

  if (state === "low_stock") {
    return `Low stock / ${stock} left`;
  }

  return "In stock";
}

export function getOrderStatusLabel(status: string) {
  switch (status) {
    case "paid_demo":
      return "Order placed / Payment confirmed demo";
    case "processing":
      return "Processing";
    case "packed":
      return "Packed";
    case "shipped":
      return "Shipped";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    case "refunded_demo":
      return "Refunded demo";
    case "pending":
    default:
      return "Order placed";
  }
}

export function getOrderTimelineSteps(status: string) {
  const steps = [
    {
      key: "pending",
      label:
        status === "paid_demo"
          ? "Order placed / Payment confirmed demo"
          : "Order placed",
    },
    {
      key: "processing",
      label: "Processing",
    },
    {
      key: "packed",
      label: "Packed",
    },
    {
      key: "shipped",
      label: "Shipped",
    },
    {
      key: "delivered",
      label: "Delivered",
    },
  ];
  const indexByStatus: Record<string, number> = {
    delivered: 4,
    packed: 2,
    paid_demo: 0,
    pending: 0,
    processing: 1,
    shipped: 3,
  };

  if (status === "cancelled" || status === "refunded_demo") {
    return steps.map((step, index) => ({
      ...step,
      active: index === 0,
      current: false,
      stopped: index > 0,
    }));
  }

  const activeIndex = indexByStatus[status] ?? 0;

  return steps.map((step, index) => ({
    ...step,
    active: index <= activeIndex,
    current: index === activeIndex,
    stopped: false,
  }));
}
