import { CreditCard, Wallet } from "lucide-react";
import { useState } from "react";
import { EmptyState, SectionHeader } from "../components";
import {
  formatPaymentMethod,
  formatPrice,
  getDiscountedPrice,
  pickPalette,
} from "../../appBackend/appBackendUtils";

export const CheckoutPage = ({
  product,
  currentBalance,
  onConfirmPayment,
  onCancel,
}) => {
  const [method, setMethod] = useState("balance");
  const accent = pickPalette(product?.id || 0);

  if (!product) {
    return (
      <EmptyState
        title="Select a product"
        description="Pilih game dulu dari katalog sebelum masuk ke checkout."
      />
    );
  }

  const price = getDiscountedPrice(product);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-4 rounded-[2rem] border border-white/10 bg-carbon/80 p-6">
        <SectionHeader
          label="Checkout"
          title="Payment"
          description="Pembelian balance diproses atomik oleh backend sebelum library diperbarui."
        />
        <div
          className={`rounded-[1.75rem] border border-white/10 bg-gradient-to-br ${accent} p-5`}
        >
          <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-300">
              Summary
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white">
              {product.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-200">
              {product.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-200">
              <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1">
                Publisher: {product.publisher?.name || "Unknown"}
              </span>
              <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1">
                {(product.platforms || [])
                  .map((platform) => platform.name)
                  .join(", ")}
              </span>
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Payment Method
          </label>
          <div className="mt-2 grid gap-2 md:grid-cols-3">
            {[
              { value: "balance", label: "Balance", icon: Wallet },
              { value: "ewallet", label: "E-Wallet", icon: Wallet },
              { value: "credit_card", label: "Credit Card", icon: CreditCard },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.value}
                  onClick={() => setMethod(item.value)}
                  className={`rounded-2xl border px-3 py-3 text-xs transition ${
                    method === item.value
                      ? "border-rose-500/50 bg-rose-500/10 text-white"
                      : "border-white/10 bg-black/25 text-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-full border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirmPayment(product.id, method)}
            className="flex-1 rounded-full bg-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/20"
          >
            Confirm Payment
          </button>
        </div>
      </section>

      <section className="space-y-4 rounded-[2rem] border border-white/10 bg-carbon/80 p-6">
        <SectionHeader
          label="Order"
          title="Summary"
          description="Konfirmasi harga akhir sebelum backend memproses transaksi."
        />
        <div className="space-y-3 rounded-[1.75rem] border border-white/10 bg-black/20 p-5 text-sm text-slate-300">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(price)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Payment Method</span>
            <span>{formatPaymentMethod(method)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 pt-3 text-base font-semibold text-white">
            <span>Total</span>
            <span>{formatPrice(price)}</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-xs text-slate-400">
            Current Balance: {formatPrice(currentBalance)}
          </div>
        </div>
      </section>
    </div>
  );
};
