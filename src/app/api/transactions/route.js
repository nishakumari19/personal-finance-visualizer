import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Transaction } from "@/models/Transaction";

export async function GET(req) {
  try {
    await dbConnect();
    const transactions = await Transaction.find({});
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const { amount, date, description } = await req.json();
    const newTransaction = await Transaction.create({ amount, date, description });
    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const { id, amount, date, description } = await req.json();
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { amount, date, description },
      { new: true }
    );

    if (!updatedTransaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTransaction, { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const { id } = await req.json();
    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Transaction deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
