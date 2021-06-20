/* eslint-disable no-confusing-arrow */
import { BigNumber } from "bignumber.js";
import toPattern from "./toPattern";

/**
 * function unMask(
 * @param {string} value
 * @param {'custom' | 'currency'} type
 * @returns {string}
 */
function unMask(
  value: string,   
  type: "custom" | "currency" = "custom",
) {
  if(type === 'currency') {
    if(!value) return "0";

    const unMaskedValue = value.replace(/\D/g,'');
    const number = parseInt(unMaskedValue.trimStart());

    return number.toString();
  }
  
  return value.replace(/\W/g, "");
}

/**
 * function masker(
 * @param {string} value
 * @param {string} patterns
 * @param {any} options
 * @returns {string}
 */
function masker(value: string, pattern: string, options: any) {
  return toPattern(value, { pattern, ...options });
}

/**
 * function masker(
 * @param {string} value
 * @param {any} options
 * @returns {string}
 */
function currencyMasker(value: string = "0", options: any) {
  const { 
    prefix,
    decimalSeparator,
    groupSeparator,
    precision,
    groupSize,
    secondaryGroupSize,
    fractionGroupSeparator,
    fractionGroupSize,
    suffix
  } = options;

  const precisionDivider = parseInt(1 + "0".repeat(precision ||0))
  const number = parseInt(value) / precisionDivider;

  const formatter = {
    prefix,
    decimalSeparator,
    groupSeparator,
    groupSize: groupSize || 3,
    secondaryGroupSize,
    fractionGroupSeparator,
    fractionGroupSize,
    suffix
  }
  
  const bigNumber = new BigNumber(number)
  
  BigNumber.config({ FORMAT: formatter })
  
  return bigNumber.toFormat(precision)
}

/**
 * function multimasker(
 * @param {string} value
 * @param {string[]} patterns
 * @param {any} options
 * @returns {string}
 */
function multimasker(value: string, patterns: string[], options: any) {
  return masker(
    value,
    patterns.reduce(
      // eslint-disable-next-line prettier/prettier
      (memo: string, pattern: string) =>
        value.length <= unMask(memo).length ? memo : pattern,
      patterns[0]
    ),
    options
  );
}

/**
 * function mask(
 * @param {string} value
 * @param {string | string[]} patterns
 * @param {'custom' | 'currency'} type
 * @param {any} options
 * @returns {string}
 */
function mask(
  value: string | number,
  pattern: string | string[] = "",
  type: "custom" | "currency" = "custom",
  options?: any
) {
  if (type === "currency") {
    return currencyMasker(String(value), options);
  }

  if (typeof pattern === "string") {
    return masker(String(value), pattern || "", {});
  }

  return multimasker(String(value), pattern, {});
}

export { mask, unMask };
