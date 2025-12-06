// src/api/currency.js

// Public free API for currency rates
const API_URL = "https://api.exchangerate.host/latest?base=USD";

// Fallback rates if API fails
const fallbackRates = {
  USD: 1,
  CAD: 1.35,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83,
};

/**
 * Fetch live currency exchange rates.
 * Returns a rates object, or fallback if network fails.
 */
export async function getLatestRates() {
  try {
    const res = await fetch(API_URL);

    if (!res.ok) {
      console.log("Currency API failed → using fallback");
      return fallbackRates;
    }

    const data = await res.json();

    if (!data || !data.rates) {
      console.log("Currency API invalid → using fallback");
      return fallbackRates;
    }

    return data.rates;
  } catch (err) {
    console.log("Currency error:", err);
    return fallbackRates;
  }
}

/**
 * Convert an amount between currencies.
 * Example: convert(100, "USD", "CAD")
 */
export async function convert(amount, from = "USD", to = "USD") {
  const rates = await getLatestRates();

  if (!rates[from] || !rates[to]) {
    console.log("Missing rate → using USD fallback");
    return amount;
  }

  // Convert from → USD → target currency
  const inUSD = amount / rates[from];
  const converted = inUSD * rates[to];

  return Number(converted.toFixed(2));
}
