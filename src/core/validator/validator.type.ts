import type { ValidatorFn } from "../../presentation/interaction-manager.js";

const numberValidator: ValidatorFn = (input: string) => {
  return !isNaN(+input);
};
