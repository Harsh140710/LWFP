import cron from "node-cron";
import { Order } from "./models/order.models.js";

// Runs every day at midnight
cron.schedule("0 0 * * *", async () => {
  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

  const codOrders = await Order.updateMany(
    { paymentMethod: "cod", isPaid: false, createdAt: { $lte: tenDaysAgo } },
    { isPaid: true, paidAt: new Date(), status: "delivered" }
  );

  if (codOrders.modifiedCount > 0) {
    console.log(`Updated ${codOrders.modifiedCount} COD orders to Paid`);
  }
});
