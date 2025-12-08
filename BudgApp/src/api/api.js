// src/api/api.js

const API_KEY = "ERQNXJVBENJ5D5V0"; 
const API_URL = "https://www.alphavantage.co/query";

export async function fetchQuoteSafe(symbol = "AAPL") {
  try {
    const res = await fetch(
      `${API_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`,
      {
        headers: { Accept: "application/json" },
        cache: "no-store",
      }
    );

    if (!res.ok) throw new Error(`Network failed: ${res.status}`);

    const data = await res.json();
    const quote = data["Global Quote"] || {};

    let percentChange = 0;
    if (typeof quote["10. change percent"] === "string") {
      percentChange = parseFloat(quote["10. change percent"].replace("%", ""));
    }

    return {
      text: `Price: $${quote["05. price"] || "N/A"} (Change: ${quote["09. change"] || "N/A"} / ${quote["10. change percent"] || "N/A"})`,
      author: quote["01. symbol"] || symbol,
      percentChange,
    };
  } catch (err) {
    console.error("Financial quote fetch error:", err);
    return {
      text: "Could not load financial data.",
      author: "Unknown",
      percentChange: 0,
    };
  }
}