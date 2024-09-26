"use server";

import { RemoteRunnable } from "@langchain/core/runnables/remote";
import { HumanMessage } from "@langchain/core/messages";

const gemini = new RemoteRunnable({
  url: "http://localhost:3000/api/gemini",
});

export async function getGeminiResponse(prompt: string) {
  const response = await gemini.stream({
    // input: {
    //   prompt: prompt,
    // },
    messages: [new HumanMessage(prompt)],
  });

  let count = 0;

  for await (const chunk of response) {
    count++;
    // console.log(chunk);
  }

  console.log(count);

  return count;
}
