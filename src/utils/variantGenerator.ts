/**
 * Automatic Variant Generator for Questions
 * This utility automatically generates 2 variants for any question that doesn't have them.
 * It works by parsing Arabic and English numbers in the question and modifying them.
 */

import { Question } from "@/components/LessonGrid";

// Arabic-Western number mapping
const arabicToWestern: Record<string, string> = {
  "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
  "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9"
};

const westernToArabic: Record<string, string> = {
  "0": "٠", "1": "١", "2": "٢", "3": "٣", "4": "٤",
  "5": "٥", "6": "٦", "7": "٧", "8": "٨", "9": "٩"
};

// Convert Arabic number string to Western
function arabicToNumber(str: string): number {
  const western = str.split("").map(c => arabicToWestern[c] || c).join("");
  return parseFloat(western);
}

// Convert number to Arabic string
function numberToArabic(num: number): string {
  const str = num.toString();
  return str.split("").map(c => westernToArabic[c] || c).join("");
}

// Find all numbers (Arabic or Western) in a string
function findNumbers(text: string): { value: number; original: string; index: number; isArabic: boolean }[] {
  const results: { value: number; original: string; index: number; isArabic: boolean }[] = [];

  // Match Arabic numbers (including decimals)
  const arabicRegex = /[٠-٩]+(?:[٫\.][٠-٩]+)?/g;
  let match;
  while ((match = arabicRegex.exec(text)) !== null) {
    results.push({
      value: arabicToNumber(match[0]),
      original: match[0],
      index: match.index,
      isArabic: true
    });
  }

  // Match Western numbers (including decimals)
  const westernRegex = /\d+(?:\.\d+)?/g;
  while ((match = westernRegex.exec(text)) !== null) {
    // Check if this overlaps with an Arabic number (shouldn't happen, but just in case)
    const overlaps = results.some(r =>
      match!.index >= r.index && match!.index < r.index + r.original.length
    );
    if (!overlaps) {
      results.push({
        value: parseFloat(match[0]),
        original: match[0],
        index: match.index,
        isArabic: false
      });
    }
  }

  return results.sort((a, b) => a.index - b.index);
}

// Generate a modified number based on the original
function modifyNumber(num: number, variantIndex: number): number {
  // Different modification strategies based on the number
  if (num === 0) return num;

  if (Number.isInteger(num)) {
    // For integers, add or subtract based on variant
    const modifier = variantIndex === 0 ?
      (num > 10 ? Math.floor(num * 0.1) : 1) :
      (num > 10 ? Math.floor(num * 0.2) : 2);

    // Alternate between adding and subtracting
    const result = variantIndex % 2 === 0 ? num + modifier : num - modifier;
    return Math.max(1, result); // Ensure positive
  } else {
    // For decimals, modify slightly
    const modifier = variantIndex === 0 ? 0.25 : 0.5;
    return Math.round((num + modifier) * 100) / 100;
  }
}

// Replace a number in text with a new value
function replaceNumber(
  text: string,
  original: string,
  newValue: number,
  isArabic: boolean
): string {
  const newStr = isArabic ? numberToArabic(newValue) : newValue.toString();
  return text.replace(original, newStr);
}

// Generate a variant of the prompt by modifying numbers
function generateVariantPrompt(prompt: string, variantIndex: number): string {
  const numbers = findNumbers(prompt);

  if (numbers.length === 0) {
    // No numbers to modify, add a small variation indicator
    return prompt;
  }

  let result = prompt;
  // Modify up to 3 numbers to create variation
  const numbersToModify = numbers.slice(0, Math.min(3, numbers.length));

  // Process in reverse order to maintain indices
  for (let i = numbersToModify.length - 1; i >= 0; i--) {
    const numInfo = numbersToModify[i];
    const newValue = modifyNumber(numInfo.value, variantIndex + i);
    const newStr = numInfo.isArabic ? numberToArabic(newValue) : newValue.toString();
    result = result.substring(0, numInfo.index) + newStr + result.substring(numInfo.index + numInfo.original.length);
  }

  return result;
}

// Generate variants for options if they contain numbers
function generateVariantOptions(options: string[], variantIndex: number): string[] {
  return options.map((option, i) => {
    const numbers = findNumbers(option);
    if (numbers.length === 0) return option;

    let result = option;
    // Modify numbers in reverse order
    for (let j = numbers.length - 1; j >= 0; j--) {
      const numInfo = numbers[j];
      const newValue = modifyNumber(numInfo.value, variantIndex + i);
      const newStr = numInfo.isArabic ? numberToArabic(newValue) : newValue.toString();
      result = result.substring(0, numInfo.index) + newStr + result.substring(numInfo.index + numInfo.original.length);
    }
    return result;
  });
}

/**
 * Generate 2 variants for a question
 * The variants have modified numbers but same structure and correct answer index
 */
export function generateVariantsForQuestion(question: Question): Question["variants"] {
  const variants: Question["variants"] = [];

  for (let i = 0; i < 2; i++) {
    const variantPrompt = generateVariantPrompt(question.prompt, i);

    // Only generate variant options if prompt numbers changed
    // Keep same correct answer index
    const variantOptions = generateVariantOptions(question.options, i);

    variants.push({
      id: `${question.id}-v${i + 1}`,
      prompt: variantPrompt,
      options: variantOptions,
      correctAnswer: question.correctAnswer,
      explanation: `نفس طريقة الحل مع أرقام مختلفة`
    });
  }

  return variants;
}

/**
 * Ensure a question has variants - generate them if missing
 */
export function ensureVariants(question: Question): Question {
  if (question.variants && question.variants.length >= 2) {
    return question;
  }

  return {
    ...question,
    variants: generateVariantsForQuestion(question)
  };
}

/**
 * Process an array of questions to ensure all have variants
 */
export function ensureAllVariants(questions: Question[]): Question[] {
  return questions.map(ensureVariants);
}

/**
 * Process a bank's questions to ensure all have variants
 */
export function processBankQuestions(bank: { id: string; name: string; questions: Question[] }): typeof bank {
  return {
    ...bank,
    questions: ensureAllVariants(bank.questions)
  };
}
