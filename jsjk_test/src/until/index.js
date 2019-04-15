import CryptoJS from 'crypto-js'

export function encryptBySHA1 (word) {
  return CryptoJS.SHA1(word).toString(CryptoJS.enc.Hex)
}
// base64加密
export function encryptByBase64 (word) {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(word))
}
// base64 解密
export function decryptByBase64 (word) {
  return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(word))
}
