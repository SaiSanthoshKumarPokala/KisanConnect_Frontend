import { useState } from "react";
import { UseAppContext } from "../../context/AppContext";
import CartItemRow from "./CartItemRow";

export default function PurchasableSection({
  title,
  subtitle,
  items,
  total,
  onIncrease,
  onDecrease,
  onRemove,
  onPay,
  moduleLabel,
}) {
  const { axios } = UseAppContext();
  const [paying, setPaying] = useState(false);

  const initPay = (order) => {
    if (typeof window.Razorpay === "undefined") {
      window.alert("Payment SDK failed to load. Check your internet connection.");
      setPaying(false);
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency || "INR",
      name: "KisanConnect",
      description: `${moduleLabel} Purchase`,
      order_id: order.id,
      handler: async (response) => {
        try {
          const { data } = await axios.post("/api/buy/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (data.success) {
            onPay(items, total);
            window.alert("Payment successful! Your order has been placed.");
          } else {
            window.alert("Payment verification failed: " + (data.message || "Unknown error"));
          }
        } catch (error) {
          window.alert("Verification error: " + (error.response?.data?.message || error.message));
        } finally {
          setPaying(false);
        }
      },
      prefill: { name: "", email: "", contact: "" },
      theme: { color: "#D4AF37" },
      modal: {
        ondismiss: () => {
          setPaying(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const createOrder = async () => {
    if (paying) return;
    setPaying(true);

    try {
      const product = items.map((item) => ({
        id: item._id || item.id,
        name: item.name,
        brand: item.brand || item.seller || item.category || "",
        price: item.price,
        quantity: item.quantity || 1,
        owner: item.owner || null,
      }));

      const { data } = await axios.post("/api/buy/order", {
        product,
        amount: total,
      });

      if (data.success) {
        initPay(data.order);
      } else {
        window.alert(data.message || "Unable to initiate payment.");
        setPaying(false);
      }
    } catch (error) {
      window.alert(error.response?.data?.message || error.message || "Order setup failed.");
      setPaying(false);
    }
  };

  return (
    <section className="rounded-[22px] border border-gold/25 bg-[#040404] p-5 font-montserrat md:p-6">
      <div className="mb-5 flex items-center justify-between border-b border-gold/15 pb-4">
        <div>
          <h2 className="text-xl font-black text-amber-200">{title}</h2>
          <p className="mt-1 text-xs text-white/50">{subtitle}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-amber-200">₹{total.toLocaleString()}</p>
          <p className="text-xs text-white/40">total</p>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-3">
        {items.map((item) => (
          <CartItemRow
            key={item._id || item.id}
            item={item}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
            onRemove={onRemove}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={createOrder}
        disabled={paying}
        className="w-full cursor-pointer rounded-[14px] bg-linear-to-r from-amber-200 to-gold py-4 text-[15px] font-black text-[#0a1a0c] shadow-[0_8px_24px_rgba(212,175,55,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(212,175,55,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {paying ? "Opening Payment..." : `Pay Now — ₹${total.toLocaleString()}`}
      </button>
    </section>
  );
}