import { Counter } from "counterapi";

const counter = new Counter({
  workspace: "digitalspace",
  token: process.env.COUNTER_API_KEY,
});

export async function handler() {
  try {
    const result = await counter.up("digitalspace");

    return {
      statusCode: 200,
      body: JSON.stringify({ views: result.data }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
