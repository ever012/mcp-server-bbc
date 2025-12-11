import { Agent } from "@voltagent/core";
import { openai } from "@ai-sdk/openai";
import { currentTimeTool } from "../tools/current-time";

export const assistant = new Agent({
  name: "AssistantAgent",
  purpose: "Answer general questions and call helper tools such as current time.",
  instructions: "You are a helpful assistant. Use the `current_time` tool when the user wants to know the time.",
  model: openai("gpt-4o-mini"),
  tools: [currentTimeTool],
});

