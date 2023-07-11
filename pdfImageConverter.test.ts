import { ZodError } from 'https://deno.land/x/zod@v3.21.4/ZodError.ts';
import { validateInput } from './inputValidation.ts'
import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { convertPDFtoJPG } from './pdfImageConverter.ts';

function unwantedError() {
    throw new Error("Unwanted error")
}

Deno.test("input validation with good input", () => {
    const input = new URLSearchParams()
    const testPdf = 'https://media.mediaworks.global/files/bible-stories-from-the-bible-in-nivkh-and-russian.niv.pdf'
    const testPage =  '81'

    input.set('pdf', testPdf)
    input.set('page', testPage)

    const { page, pdf} =  validateInput(input)

    assertEquals(pdf, testPdf)
    assertEquals(page, 81)
})

Deno.test("input validation with bad input", () => {
    const input = new URLSearchParams()
    const testPdf = 'media.mediaworks.global/files/bible-stories-from-the-bible-in-nivkh-and-russian.niv.pdf'
    const testPage = 'center'

    input.set('pdf', testPdf)
    input.set('page', testPage)

    try {
        const { page, pdf } = validateInput(input)
        page 
        pdf
    }
    catch (exception) {
        const zodError = exception as ZodError
        assertEquals(zodError.errors[0].code, 'invalid_string')
    }

})

Deno.test("request for invalid pdf link", async () => {
    try {
        await convertPDFtoJPG(`https://www.pdf`, "first")
    }
    catch (error) {
        if (String(error).search("error sending request for url")) {
            //success
        }
        else {
            unwantedError()
        }
    }

    try {
        await convertPDFtoJPG(`https://media.mediaworks.tories-from-the-bible-inand-russian.niv.pdf`, "first")
    }
    catch (error) {
        if (String(error).search("Error reading PDF info, PDF file may not be present at this URL")) {
            //success
        }
        else {
            unwantedError()
        }
    }
})

Deno.test("request for page outside of range", async () => {
    try {
        await convertPDFtoJPG(`https://media.mediaworks.global/files/bible-stories-from-the-bible-in-nivkh-and-russian.niv.pdf`, "1000")
    }
    catch (error) {
        if (String(error).search("Page outside of valid range")) {
            //success
        }
        else {
            unwantedError()
        }
    }
})

Deno.test("invalid pdf file", async () => {
    try {
        await convertPDFtoJPG(`https://github.com/ArturT/Test-PDF-Files/blob/master/corrupted.pdf`, "first")
    }
    catch (error) {
        if (String(error).search("Error reading PDF info")) {
            //success
        }
        else {
            unwantedError()
        }
    }
})