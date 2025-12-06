export async function fetchQuoteSafe() {
  try {
    const res = await fetch("https://zenquotes.io/api/random");

    if (!res.ok) throw new Error("Network failed");
    const data = await res.json();

    return {
      text: data[0]?.q || "No quote available.",
      author: data[0]?.a || "",
    };
  } catch (err) {
    // fallback mock data
    return {
      text: "Believe in yourself. Even when others don't.",
      author: "Unknown",
    };
  }
}
