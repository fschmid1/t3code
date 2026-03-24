/**
 * TextGenerationRouter - Routes text generation requests to the appropriate
 * provider (Codex or Claude) based on the model slug.
 *
 * When a Claude model is specified, requests are routed to the Claude CLI.
 * Otherwise, requests fall back to the Codex CLI.
 *
 * @module TextGenerationRouter
 */
import { Effect, Layer } from "effect";

import { inferProviderForModel } from "@t3tools/shared/model";

import { TextGeneration, type TextGenerationShape } from "../Services/TextGeneration.ts";
import { makeCodexTextGeneration } from "./CodexTextGeneration.ts";
import { makeClaudeTextGeneration } from "./ClaudeTextGeneration.ts";

const makeTextGenerationRouter = Effect.gen(function* () {
  const codex = yield* makeCodexTextGeneration;
  const claude = yield* makeClaudeTextGeneration;

  const pickProvider = (model: string | undefined): TextGenerationShape => {
    if (!model) return codex;
    const provider = inferProviderForModel(model, "codex");
    return provider === "claudeAgent" ? claude : codex;
  };

  return {
    generateCommitMessage: (input) => pickProvider(input.model).generateCommitMessage(input),
    generatePrContent: (input) => pickProvider(input.model).generatePrContent(input),
    generateBranchName: (input) => pickProvider(input.model).generateBranchName(input),
  } satisfies TextGenerationShape;
});

export const TextGenerationRouterLive = Layer.effect(TextGeneration, makeTextGenerationRouter);
