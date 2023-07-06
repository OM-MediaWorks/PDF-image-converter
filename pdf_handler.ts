export async function fetchPDF(pdfLocation:string, hashName:string) {
    const buffer = await fetch(pdfLocation).then((response) => response.arrayBuffer())
    const uint8arr = new Uint8Array(buffer)
    await Deno.writeFile(`${hashName}.pdf`, uint8arr)
}

export async function removeTemp(hashName:string) {
    const removeTempPDF = new Deno.Command("rm", {
        args: [
          `${hashName}.pdf`
        ]
    })
    await removeTempPDF.output()
}

export async function getPDFLength(hashName:string, pageInfoOffset = 16) {
    const getPDFInfo = new Deno.Command("pdfinfo", {
        args: [
            `${hashName}.pdf`
        ]
    })
    const{stdout, stderr} = await getPDFInfo.output()
    if (stderr[0] != undefined){
        await(removeTemp(hashName))
        throw new Error("Error reading PDF info")
    }
    const infoDecode = new TextDecoder().decode(stdout)
    const pageNumFinder = infoDecode.indexOf("Pages:")
    const pageNumEnd = infoDecode.indexOf("Encrypted:")
    const pageNumber = parseInt(infoDecode.substring(pageNumFinder+pageInfoOffset, pageNumEnd))
    return pageNumber
}