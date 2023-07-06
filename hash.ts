import { crypto } from "https://deno.land/std@0.142.0/_wasm_crypto/mod.ts"
const { digest } = crypto

export function createHash(inputLocation:string) {
  const hashin = new TextEncoder().encode(inputLocation)
  const hashout = digest("SHA-1", hashin, undefined)
  let hash = hashout.toString()
  hash = hash.replaceAll(",","")
  return hash
}

