import axios from "axios";
import { useEffect, useState } from "react";

const PayPalButton = ({ amount, onSuccess, onError }) => {
  const [exchangeRate, setExchangeRate] = useState(null);
  const [isPayPalButtonRendered, setIsPayPalButtonRendered] = useState(false);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await axios.get(
          "https://v6.exchangerate-api.com/v6/4f3248892be516271282559b/latest/USD"
        );
        const data = response.data;
        if (data.conversion_rates.VND) {
          setExchangeRate(data.conversion_rates.VND);
        }
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };

    fetchExchangeRate();
  }, []);

  useEffect(() => {
    if (exchangeRate === null) return;

    const amountInUSD = (amount / exchangeRate).toFixed(2);

    if (!isPayPalButtonRendered) {
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amountInUSD,
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            onSuccess(order);
          },
          onError: (err) => {
            onError(err);
          },
        })
        .render("#paypal-button");
      setIsPayPalButtonRendered(true);
    }
  }, [amount, onSuccess, onError, exchangeRate, isPayPalButtonRendered]);

  if (exchangeRate === null) {
    return <div>Loading...</div>;
  }

  return <div id="paypal-button"></div>;
};

export default PayPalButton;
