import { Context } from "https://deno.land/x/oak@v12.5.0/mod.ts"
import * as inputValidation from "./inputValidation.ts"
import * as cache from "./cache.ts"
import * as hash from "./hash.ts"
import * as keyword from "./keyword.ts"
import * as pdf_handler from "./pdf_handler.ts"
import * as pdf_to_jpg from "./pdf_to_jpg.ts"

export async function pdfImageConverter(pdfLocation: string, pageToConvert: string){
    const pdfHash = hash.createHash(pdfLocation)
    
    const value_firstToNum = keyword.firstToNum(pageToConvert)

    let pageNum = -1
    if (value_firstToNum !== false) {
        pageNum = value_firstToNum
    }

    const value_checkCache = await cache.checkCache(pdfHash, pageToConvert)
    if (value_checkCache !== false){
        return value_checkCache
    }

    await pdf_handler.fetchPDF(pdfLocation, pdfHash)

    const pdfLength = await pdf_handler.getPDFLength(pdfHash)
    
    const value_keywordToPageNum = keyword.keywordToPageNum(pageToConvert, pdfLength)
    if (value_keywordToPageNum !== false) {
        pageNum = value_keywordToPageNum
    }

    if (pageNum > 0 && pageNum <= pdfLength){
        await pdf_to_jpg.pdfToJPG(String(pageNum), pdfHash, pageToConvert, String(pdfLength))
        await pdf_handler.removeTemp(pdfHash)
    }

    else {
        await pdf_handler.removeTemp(pdfHash)
        throw new Error("Page outside of valid range")
    }

    const value_checkCache2 = await cache.checkCache(pdfHash, pageToConvert)
    if (value_checkCache2 !== false) {
        return value_checkCache2
    }
    else {
        throw new Error("Conversion unsuccessful")
    }
}

export const pdfImageConverterOakRoute = async (context:Context) => {
    const {searchParams} = context.request.url
    const {pdf, page} = inputValidation.validateInput(searchParams)
    const file = await pdfImageConverter(pdf, page.toString())
    context.response.headers.set('Content-Type', 'image/jpg');
    context.response.body = file

}
