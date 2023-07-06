import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts"

export const validateInput = (searchParams: URLSearchParams) => {
    const inputPdf = searchParams.get('pdf')
    let inputPage = searchParams.get('page')
    inputPage = inputPage?.toLowerCase()!

    const pageSchemaKeywords = z.enum(['first', 'middle', 'last'])
    const pageSchema = z.coerce.number().or(pageSchemaKeywords)

    return {
        pdf: z.string().url().parse(inputPdf),
        page: pageSchema.parse(inputPage),
    }
}