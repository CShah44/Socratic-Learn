"use server";

import { RemoteRunnable } from "@langchain/core/runnables/remote";
import { HumanMessage } from "@langchain/core/messages";

const gemini = new RemoteRunnable({
  url: "http://localhost:3000/api/gemini",
});

async function* makeIterator(prompt: string) {
  const stream = await gemini.stream({
    // input: {
    //   prompt: prompt,
    // },
    messages: [new HumanMessage(prompt)],
  });

  for await (const chunk of stream) {
    const answerChunk = chunk as any;
    if (answerChunk.content) {
      yield answerChunk.content;
    }
  }
}

function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

export async function getGeminiResponse(prompt: string) {
  // const iterator = makeIterator(prompt);
  // const stream = iteratorToStream(iterator);

  // return new Response(stream);

  const res = await gemini.stream({
    // input: {
    //   prompt: prompt,
    // },
    messages: [new HumanMessage(prompt)],
  });

  return JSON.parse(JSON.stringify(res));
}
