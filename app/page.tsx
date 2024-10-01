"use client";

import { useState } from "react";

const Home = () => {
  const [response, setResponse] = useState("");

  const getStreamingResponse = async () => {
    // const response = await fetch("/api/gemini/stream", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     // input: { topic: "Food" },
    //     input: { prompt: "Tell me about the quantum theory." },
    //   }),
    // });
    const response = await fetch("/api/gemini-old", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: "What is the meaning of life?",
      }),
    });

    if (!response.body) {
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    // while (true) {
    //   const { done, value } = await reader.read();
    //   if (done) break;

    //   const chunk = decoder.decode(value, { stream: true });

    //   chunk.split("\n").forEach((line) => {
    //     if (line.trim().startsWith("data:")) {
    //       const dataString = line.replace("data:", "").trim();
    //       try {
    //         const data = JSON.parse(dataString);
    //         console.log(data);
    //         if (data.content) {
    //           setResponse((prev) => prev + data.content);
    //         }
    //       } catch (error) {
    //         console.log(error);
    //       }
    //     }
    //   });
    // }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      const parts = chunk.split("data: ");
      for (let i = 1; i < parts.length; i++) {
        const data = parts[i].trim();

        if (data.includes("[DONE]")) {
          break;
        }

        if (data) {
          setResponse((prev) => prev + data);
          await new Promise((resolve) => setTimeout(resolve, 50)); // Add a small delay for streaming effect
        }
      }
    }
  };

  return (
    <div>
      <h1>Home</h1>
      <button onClick={getStreamingResponse}>Get Streaming Response</button>
      {response && <p>{response}</p>}
    </div>
  );
};

export default Home;
