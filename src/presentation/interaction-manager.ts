import * as readLine from "node:readline";
const { stdin: input, stdout: output } = require("node:process");
export type ValidatorFn = (value: string) => boolean;

export interface AskOptions {
  defaultAnswer?: string | undefined;
  validator: ValidatorFn | undefined;
}

export interface Choice {
  label: string;
  value: string;
}

export const openInteractionManager = () => {
  const rl = readLine.createInterface({ input, output });

  const ask = async (question: string, options?: AskOptions) => {
    const { defaultAnswer, validator } = options || {};
    return new Promise((resolve) => {
      rl.question(
        question + ` ${defaultAnswer ? "(" + defaultAnswer + ")" : ""}`,
        (answer: string) => {
          if (validator && !validator(answer)) {
            console.log("Invalid input. Please try again.");
            return resolve(
              ask(question, {
                defaultAnswer: defaultAnswer,
                validator: validator,
              }),
            );
          }
          resolve(answer || defaultAnswer);
        },
      );
    });
  };

  const choose = async (question: string, choices: Choice[]) => {
    console.log(question);
    choices.forEach((choice) => {
      console.log(`${choice.value}.${choice.label}`);
    });
    const choice = await ask("Please enter you choice:", {
      validator: (input) => {
        if (Option && input.trim() === "") {
          return true;
        }
        return choices.some((choice) => choice.value === input);
      },
    });
    return choices.find((c) => c.value === choice);
  };

  return {
    ask,
    choose,
    close,
  };
};
