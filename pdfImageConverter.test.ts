import { ZodError } from 'https://deno.land/x/zod@v3.21.4/ZodError.ts';
import { validateInput } from './inputValidation.ts'
import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";

Deno.test("input validation with good input", () => {
    const input = new URLSearchParams()
    const testPdf = 'https://media.mediaworks.global/files/bible-stories-from-the-bible-in-nivkh-and-russian.niv.pdf'
    const testPage =  '81'

    input.set('pdf', testPdf)
    input.set('page', testPage)

    const { page, pdf} =  validateInput(input)

    assertEquals(pdf, testPdf)
    assertEquals(page, 81)
});

Deno.test("input validation with bad input", () => {
    const input = new URLSearchParams()
    const testPdf = 'media.mediaworks.global/files/bible-stories-from-the-bible-in-nivkh-and-russian.niv.pdf'
    const testPage = 'center'

    input.set('pdf', testPdf)
    input.set('page', testPage)

    try {
        const { page, pdf } = validateInput(input)
    }
    catch (exception: any) {
        const zodError = exception as ZodError
        assertEquals(zodError.errors[0].code, 'invalid_string')
    }

});

// TODO write test for pdf with certain amount of pages and request amount + 1