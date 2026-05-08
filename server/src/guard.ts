/**
 * Light-weight prompt-injection / off-topic heuristics. Run BEFORE we hit
 * the model — saves tokens and gives us deterministic refusals.
 */

const INJECTION_PATTERNS = [
  /ignore (all |any |the |your |previous |prior )?(instructions|prompts|rules|system)/i,
  /disregard (all |any |the |your |previous |prior )?(instructions|prompts|rules|system)/i,
  /forget (everything|all|your instructions|prior)/i,
  /you are (now |actually )?(a |an )?(different|new|developer mode|dan|jailbreak)/i,
  /system\s*prompt/i,
  /reveal (your |the )?(system|prompt|instructions)/i,
  /print (your |the )?(system|prompt|instructions)/i,
  /\bDAN\b|jailbreak|developer\s*mode/i,
  /pretend (to be|you are)/i,
  /act as (?!a |an )(developer|admin|root)/i,
];

export function looksLikeInjection(text: string): boolean {
  return INJECTION_PATTERNS.some((re) => re.test(text));
}

const OFF_TOPIC_HARD = [
  /write (me )?(a |an )?(poem|song|story|essay) about (?!mohammad|hammoudeh|yahya|the cv|the project|the work|himself|his work)/i,
  /\b(stock|invest(ment)?|crypto|bitcoin)\b.*\b(advice|tip|recommend)/i,
  /\b(medical|health|legal)\b.*\b(advice|diagnose|prescription)/i,
];

export function looksOffTopicHard(text: string): boolean {
  return OFF_TOPIC_HARD.some((re) => re.test(text));
}
