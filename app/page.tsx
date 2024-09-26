"use client";

import { useState } from "react";
import { getGeminiResponse } from "../actions/llmActions";
export default function HomePage() {
  const [userInput, setUserInput] = useState("");
  const [output, setOutput] = useState<number>();

  const handleSubmit = async (data: FormData) => {
    const input = data.get("userInput");
    console.log("User input:", input);

    try {
      const response = await getGeminiResponse(input as string);
      setOutput(response);
    } catch (error) {
      console.error("Error:", error);
    }

    setUserInput("");
  };

  return (
    <div>
      <form action={handleSubmit}>
        <input
          type="text"
          name="userInput"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter your input"
          className="text-black"
        />
        <button type="submit">Submit</button>
      </form>
      {output && <div>Output: {output}</div>}
    </div>
  );
}
