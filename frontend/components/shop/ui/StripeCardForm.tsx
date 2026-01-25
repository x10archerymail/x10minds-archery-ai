import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";

interface StripeCardFormProps {
  onSuccess: (cardData: {
    number: string;
    expiry: string;
    holder: string;
    type: string;
  }) => void;
  onCancel: () => void;
  btnLabel?: string;
}

const StripeCardForm: React.FC<StripeCardFormProps> = ({
  onSuccess,
  onCancel,
  btnLabel = "Save Card",
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [holderName, setHolderName] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    if (!holderName) {
      setError("Please enter the card holder's name");
      return;
    }

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setProcessing(false);
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        name: holderName,
      },
    });

    if (error) {
      setError(error.message || "An unexpected error occurred");
      setProcessing(false);
    } else if (paymentMethod) {
      // Simulate real-world usage
      onSuccess({
        number: `**** **** **** ${paymentMethod.card?.last4}`,
        expiry: `${paymentMethod.card?.exp_month}/${paymentMethod.card?.exp_year}`,
        holder: holderName,
        type: paymentMethod.card?.brand || "unknown",
      });
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">
          Card Holder Name
        </label>
        <input
          type="text"
          value={holderName}
          onChange={(e) => setHolderName(e.target.value)}
          placeholder="JOHN DOE"
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-[#FFD700] outline-none text-white transition-all"
          disabled={processing}
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">
          Card Details
        </label>
        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl focus-within:border-[#FFD700] transition-all">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#ffffff",
                  fontFamily: '"Outfit", sans-serif',
                  "::placeholder": {
                    color: "#6b7280",
                  },
                },
                invalid: {
                  color: "#ef4444",
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs font-bold bg-red-500/10 p-3 rounded-xl border border-red-500/20"
        >
          {error}
        </motion.p>
      )}

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="flex-1 py-4 text-gray-400 font-bold hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 py-4 bg-[#FFD700] text-black rounded-2xl font-black shadow-xl shadow-[#FFD700]/10 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          {processing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>Verifying...</span>
            </div>
          ) : (
            btnLabel
          )}
        </button>
      </div>
    </form>
  );
};

export default StripeCardForm;
