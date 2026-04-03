/**
 * Validation Regex and Helpers (Guide Section 6)
 */

export const VALIDATION_REGEX = {
  PHONE: /^[6-9][0-9]{9}$/,
  PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  GSTIN: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}Z[0-9A-Z]{1}$/,
  FSSAI: /^[0-9]{14}$/,
  IFSC: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  IMAGE: /\.(jpg|jpeg|png|webp)$/i,
};

export const validatePhone = (phone: string) => VALIDATION_REGEX.PHONE.test(phone);
export const validatePAN = (pan: string) => VALIDATION_REGEX.PAN.test(pan);
export const validateGSTIN = (gstin: string) => VALIDATION_REGEX.GSTIN.test(gstin);
export const validateFSSAI = (fssai: string) => VALIDATION_REGEX.FSSAI.test(fssai);
export const validateIFSC = (ifsc: string) => VALIDATION_REGEX.IFSC.test(ifsc);
export const validateImageFormat = (filename: string) => VALIDATION_REGEX.IMAGE.test(filename);
