import dbConnect from "@/lib/dbConnect";
import { Transaction } from "@/models/Transaction";

export async function GET(req) {
  await dbConnect();
  const transactions = await Transaction.find({});
  return Response.json(transactions, { status: 200 });
}

export async function POST(req) {
  await dbConnect();

  try {
    const { amount, date, description } = await req.json();
    const newTransaction = await Transaction.create({ amount, date, description });
    return Response.json(newTransaction, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(req) {
  await dbConnect();

  try {
    const { id, amount, date, description } = await req.json();
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { amount, date, description },
      { new: true }
    );

    if (!updatedTransaction) {
      return Response.json({ error: "Transaction not found" }, { status: 404 });
    }

    return Response.json(updatedTransaction, { status: 200 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

// Delete Transaction (DELETE)
export async function DELETE(req) {
  await dbConnect();

  try {
    const { id } = await req.json();
    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return Response.json({ error: "Transaction not found" }, { status: 404 });
    }

    return Response.json({ message: "Transaction deleted successfully" }, { status: 200 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}