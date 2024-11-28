import React, { useState, ChangeEvent } from "react";
import { product } from "@/libs/product";

// Define a type for the transaction result
interface SnapResult {
  status_code: string;
  transaction_status: string;
  order_id: string;
  gross_amount: string;
  [key: string]: any; // Add additional fields as necessary
}

// Explicitly declare Snap as a global variable
declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        options?: {
          onSuccess?: (result: SnapResult) => void;
          onPending?: (result: SnapResult) => void;
          onError?: (result: SnapResult) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

const Checkout: React.FC = () => {
  const [quantity, setQuantity] = useState<number>(1);

  const decreaseQuantity = (): void => {
    setQuantity((prevState) => (prevState > 1 ? prevState - 1 : prevState));
  };

  const increaseQuantity = (): void => {
    setQuantity((prevState) => prevState + 1);
  };

  const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const checkout = async (): Promise<void> => {
    const data = {
      id: `ORDER-${Math.random().toString(36).substr(2, 9)}`, // Generate a unique order ID
      productName: product.name,
      price: product.price,
      quantity: quantity,
    };

    try {
      const response = await fetch("/api/tokenizer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create transaction.");
      }

      const requestData = await response.json();

      if (window.snap) {
        window.snap.pay(requestData.token, {
          onSuccess: (result: SnapResult) => {
            alert("Payment Successful!");
            console.log("Success:", result);
          },
          onPending: (result: SnapResult) => {
            alert("Payment Pending...");
            console.log("Pending:", result);
          },
          onError: (result: SnapResult) => {
            alert("Payment Failed.");
            console.error("Error:", result);
          },
          onClose: () => {
            alert("Payment Popup Closed.");
          },
        });
      } else {
        alert("Snap.js is not loaded.");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("An error occurred during checkout. Please try again.");
    }
  };

  const generatePaymentLink = async (): Promise<void> => {
    alert("Checkout Payment Link! 🔥");
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex sm:gap-4">
          <button
            className="transition-all hover:opacity-75"
            onClick={decreaseQuantity}
          >
            ➖
          </button>

          <input
            type="number"
            id="quantity"
            value={quantity}
            className="h-10 w-16 text-black border-transparent text-center"
            onChange={handleQuantityChange}
          />

          <button
            className="transition-all hover:opacity-75"
            onClick={increaseQuantity}
          >
            ➕
          </button>
        </div>
        <button
          className="rounded bg-indigo-500 p-4 text-sm font-medium transition hover:scale-105"
          onClick={checkout}
        >
          Checkout
        </button>
      </div>
      <button
        className="text-indigo-500 py-4 text-sm font-medium transition hover:scale-105"
        onClick={generatePaymentLink}
      >
        Create Payment Link
      </button>
    </>
  );
};

export default Checkout;
