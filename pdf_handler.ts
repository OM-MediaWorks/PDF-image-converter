export async function fetchPDF(pdfLocation:string, antiOverlapNum:number, hashName:string) {
    const buffer = await fetch(pdfLocation).then((response) => response.arrayBuffer())
    const uint8arr = new Uint8Array(buffer)
    await Deno.writeFile(`${hashName+antiOverlapNum}.pdf`, uint8arr)
}

export async function removeTemp(hashName:string, antiOverlapNum:number) {
    await Deno.remove(`${hashName+antiOverlapNum}.pdf`)
}

export async function getPDFLength(hashName:string, antiOverlapNum:number, pageInfoOffset = 16) {
    const getPDFInfo = new Deno.Command("pdfinfo", {
        args: [
            `${hashName+antiOverlapNum}.pdf`
        ]
    })
    const{stdout, stderr} = await getPDFInfo.output()
    if (stderr[0] != undefined){
        if ((new TextDecoder().decode(stderr)).search("May not be a PDF file")) {
            await(removeTemp(hashName, antiOverlapNum))
            throw new Error("Error reading PDF info, PDF file may not be present at this URL")
        }
        else {
            await(removeTemp(hashName, antiOverlapNum))
            throw new Error("Error reading PDF info")
        }
    }
    const infoDecode = new TextDecoder().decode(stdout)
    const pageNumFinder = infoDecode.indexOf("Pages:")
    const pageNumEnd = infoDecode.indexOf("Encrypted:")
    const pageNumber = parseInt(infoDecode.substring(pageNumFinder+pageInfoOffset, pageNumEnd))
    return pageNumber
}
