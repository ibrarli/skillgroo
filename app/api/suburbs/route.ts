import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || q.length < 2) return NextResponse.json([]);

  try {
    // Calling the AU Postcode API from the server
    const response = await fetch(`https://v0.postcodeapi.com.au/suburbs.json?q=${q}`);
    const data = await response.json();
    
    // Format to: Suburb, STATE Postcode
    const formatted = data.map((item: any) => 
      `${item.name}, ${item.state.abbreviation} ${item.postcode}`
    );

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch suburbs" }, { status: 500 });
  }
}