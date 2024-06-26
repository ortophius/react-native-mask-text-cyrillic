import { DIGIT, ALPHA, ALPHANUM, MINUTES, SECONDS, HOURS } from './constants'
import addPlaceholder from './addPlaceholder'

type OptionPattern = {
  pattern: string
  placeholder: string
}

/**
 * function toPattern
 * @param {number | string} value
 * @param {string | OptionPattern} optionPattern
 * @returns {string}
 */
function toPattern(
  value: number | string,
  optionPattern: string | OptionPattern
): string {
  const pattern =
    typeof optionPattern === 'object' ? optionPattern.pattern : optionPattern
  const patternChars = pattern.replace(/[^A-Za-zа-яА-Я0-9_]/g, '')
  const output = pattern.split('')
  const values = value.toString().replace(/[^A-Za-zа-яА-Я0-9_]/g, '')
  const charsValues = values.replace(/[^A-Za-zа-яА-Я0-9_]/g, '')
  const placeholder =
    typeof optionPattern === 'object' ? optionPattern.placeholder : undefined
  let charCounter = 0
  let index

  const outputLength = output.length
  for (index = 0; index < outputLength; index++) {
    // Reached the end of input
    if (charCounter >= values.length) {
      if (patternChars.length === charsValues.length) {
        return output.join('')
      }
      if (
        placeholder !== undefined &&
        patternChars.length > charsValues.length
      ) {
        return addPlaceholder(output, index, placeholder).join('')
      }
      break
    } else if (
      (output[index] === DIGIT && values[charCounter].match(/[0-9]/)) ||
      (output[index] === ALPHA &&
        values[charCounter].match(/[a-zA-Zа-яА-Я]/)) ||
      (output[index] === ALPHANUM &&
        values[charCounter].match(/[0-9a-zA-Zа-яА-Я]/)) ||
      (output[index] === HOURS && values[charCounter].match(/[0-23]/)) ||
      (output[index] === MINUTES && values[charCounter].match(/[0-59]/)) ||
      (output[index] === SECONDS && values[charCounter].match(/[0-59]/))
    ) {
      output[index] = values[charCounter++]
    } else if (
      output[index] === DIGIT ||
      output[index] === ALPHA ||
      output[index] === ALPHANUM ||
      output[index] === HOURS ||
      output[index] === MINUTES ||
      output[index] === SECONDS
    ) {
      if (placeholder !== undefined) {
        return addPlaceholder(output, index, placeholder).join('')
      }
      return output.slice(0, index).join('')

      // exact match for a non-magic character
    } else if (output[index] === values[charCounter]) {
      charCounter++
    }
  }
  return output.join('').substr(0, index)
}

export default toPattern
