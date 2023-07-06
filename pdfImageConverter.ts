import { Context } from "https://deno.land/x/oak@v12.5.0/mod.ts"
import * as inputValidation from "./inputValidation.ts"
import * as cache from "./cache.ts"
import * as hash from "./hash.ts"
import * as keyword from "./keyword.ts"
import * as pdf_handler from "./pdf_handler.ts"
import * as pdf_to_jpg from "./pdf_to_jpg.ts"

export async function convertPDFtoJPG(pdfLocation: string, pageToConvert: string){
    const hashName = hash.createHash(pdfLocation)
    
    const value_firstToNum = keyword.firstToNum(pageToConvert)

    let pageNum = -1
    if (value_firstToNum !== false) {
        pageNum = value_firstToNum
    }

    if (pageNum !== -1){
        const value_checkCache = await cache.checkCache(hashName, pageNum)
        if (value_checkCache !== false){
            return value_checkCache
        }
    }

    // Could have done early exit if for example hash-last, if saved under that name.

    await pdf_handler.fetchPDF(pdfLocation, hashName) // expensive

    const pdfLength = await pdf_handler.getPDFLength(hashName)
    
    const value_keywordToPageNum = keyword.keywordToPageNum(pageToConvert, pdfLength)
    if (value_keywordToPageNum !== false) {
        pageNum = value_keywordToPageNum
    }

    // Never happens because of added zod.
    if (value_keywordToPageNum === false && isNaN(Number(pageToConvert)) === true && pageNum === -1){
        await pdf_handler.removeTemp(hashName)
        throw new Error("Invalid keyword")
    }

    const value_checkCache = await cache.checkCache(hashName, pageNum)
    if (value_checkCache !== false) {
        await pdf_handler.removeTemp(hashName)
        return value_checkCache
    }

    if (pageNum > 0 && pageNum <= pdfLength){
        await pdf_to_jpg.pdfToJPG(String(pageNum), hashName) // expensive
        await pdf_handler.removeTemp(hashName)
    }

    // Input validation that can not be done before known page size.
    else {
        await pdf_handler.removeTemp(hashName)
        throw new Error("Page outside of valid range")
    }

    const value_checkCache2 = await cache.checkCache(hashName, pageNum)
    if (value_checkCache2 !== false) {
        return value_checkCache2
    }
    else {
        throw new Error("Conversion unsuccessful")
    }
}

export const convertPDFtoJPGOakRoute = async (context:Context) => {
    const {searchParams} = context.request.url
    const {pdf, page} = inputValidation.validateInput(searchParams)
    const file = await convertPDFtoJPG(pdf, page.toString())
    context.response.headers.set('Content-Type', 'image/jpg');
    context.response.body = file

}


// TODO at the end of each request after serving we have to check the size of the cache folder and remove (longest not read) file if it exceeds given amount.
// deno last accessed?
// Or create cron task.
// * * * 3/2 * deno run /adadas/index.ts --flush