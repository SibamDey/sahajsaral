// src/utils/sessionEncrypt.js
import CryptoJS from "crypto-js";

// 👉 Use a strong, long key. In production, inject via env variable.
const SECRET_KEY = "SAHAJ_SARAL_FULL_USER_ENCRYPT_KEY_32+CHARS";

export const saveEncryptedSession = (key, value) => {
  try {
    // Convert JS object -> JSON string
    const json = JSON.stringify(value);
    // Encrypt JSON string
    const ciphertext = CryptoJS.AES.encrypt(json, SECRET_KEY).toString();
    // Save encrypted string in sessionStorage
    sessionStorage.setItem(key, ciphertext);
  } catch (err) {
    console.error("saveEncryptedSession error:", err);
  }
};

export const loadDecryptedSession = (key) => {
  try {
    const ciphertext = sessionStorage.getItem(key);
    if (!ciphertext) return null;

    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedJson = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedJson) return null;

    return JSON.parse(decryptedJson); // Back to JS object
  } catch (err) {
    console.error("loadDecryptedSession error:", err);
    return null;
  }
};

export const removeSessionKey = (key) => {
  try {
    sessionStorage.removeItem(key);
  } catch (err) {
    console.error("removeSessionKey error:", err);
  }
};