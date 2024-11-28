import MidtransClient from "midtrans-client";
import { NextResponse } from "next/server";

// Initialize Snap client
const snap = new MidtransClient.Snap({
  isProduction: false,
  serverKey: process.env.SECRET as string, // Ensure this is defined in your .env
  clientKey: process.env.NEXT_PUBLIC_CLIENT as string, // Ensure this is defined in your .env
});

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Extract data from the request body
    const { id, productName, price, quantity } = (await request.json()) as {
      id: string;
      productName: string;
      price: number;
      quantity: number;
    };

    // Create transaction parameters with 'id' field in item_details
    const parameter = {
      item_details: [
        {
          id: "ITEM-" + Math.random().toString(36).substr(2, 9), // Generate a unique ID for the item
          name: productName,
          price: price,
          quantity: quantity,
        },
      ],
      transaction_details: {
        order_id: id,
        gross_amount: price * quantity,
      },
    };

    // Generate transaction token
    const transaction = await snap.createTransaction(parameter);

    // Return the token as JSON
    return NextResponse.json({ token: transaction.token });
  } catch (error: any) {
    console.error("Error creating transaction:", error.message);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
