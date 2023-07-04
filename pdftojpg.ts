import { crypto } from "https://deno.land/std@0.142.0/_wasm_crypto/mod.ts"
const { digest } = crypto

export async function convertPDFtoJPG(pdfLocation = "", pageToConvert = -1){
  const hashin = new TextEncoder().encode(pdfLocation)
  const hashout = digest("SHA-1", hashin, undefined)
  const hash = hashout.toString()
  let hashFileName = hash
  hashFileName = hashFileName.replaceAll(",","")
  hashFileName = "./cache/".concat(hashFileName)

  let valueHolder
  if (typeof pageToConvert == "string") {
    valueHolder = String(pageToConvert)
    valueHolder = valueHolder.toLowerCase()
    if (valueHolder == "first") {
      pageToConvert = 1
    }
  }

  const buffer = await fetch(pdfLocation).then((response) => response.arrayBuffer())
  const uint8arr = new Uint8Array(buffer)
  await Deno.writeFile("temp.pdf" /** should be a hash of the pdflocation */, uint8arr)
  const getPDFInfo = new Deno.Command("pdfinfo", {
    args: [
      "temp.pdf" /** should be a hash of the pdflocation */
    ]
  })


  const { stdout, stderr } = await getPDFInfo.output()
  let pageNumber
  let generalError = false
  if (stderr[0] == undefined) {
      const infoDecode = new TextDecoder().decode(stdout)
      const pageNumFinder = infoDecode.indexOf("Pages:")
      const pageNumEnd = infoDecode.indexOf("Encrypted:")
      const pageInfoOffset = 16
      pageNumber = infoDecode.substring(pageNumFinder+pageInfoOffset, pageNumEnd)
      pageNumber = parseInt(pageNumber)


      if (valueHolder == "middle"){
        pageToConvert = Math.round(pageNumber/2)
      }

      if (valueHolder == "last"){
        pageToConvert = pageNumber
      }

      if (pageNumber < pageToConvert){
        console.error("Selected page is out of range")
        generalError = true
      }
  }
  else {
    const errorMessage = new TextDecoder().decode(stderr)
    throw new Error(errorMessage)
  }
  const pageToConvertstr = String(pageToConvert)


// checking for/creating cache
  try {
    await Deno.readFile("./cache/cache")
  }
  catch (_error) {
    console.log("Cache not found, generating...")
    const createCache = new Deno.Command("mkdir", {
      args: [
        "cache"
      ]
    })

    const createCacheChecker = new Deno.Command("touch", {
      args: [
        "./cache/cache"
      ]
    })
    await createCache.output()
    await createCacheChecker.output()
  }


  const pdfToJPG = new Deno.Command("pdftoppm", {
    args: [
      '-jpeg', "temp.pdf", '-f', pageToConvertstr,'-l', pageToConvertstr, /*'-scale-to-x', '1000', '-scale-to-y', '1600',*/ hashFileName
    ]
  })
  await pdfToJPG.output()

  const removeTempPDF = new Deno.Command("rm", {
    args: [
      "temp.pdf"
    ]
  })

  await removeTempPDF.output()

  if (generalError == false){
    let padValue = 1
    while (padValue < 6) {
      try {
        await Deno.readFile(`${hashFileName}-${pageToConvert.toString().padStart(padValue,"0")}.jpg`)
        break
      }
      catch {
        padValue += 1
      }
    }
    return Deno.readFile(`${hashFileName}-${pageToConvert.toString().padStart(padValue,"0")}.jpg`)
  }
  else {
    return null
  }
}
