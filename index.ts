import { Application, Context, Router } from "https://deno.land/x/oak@v12.5.0/mod.ts"
import { convertPDFtoJPGOakRoute } from './pdfImageConverter.ts'
import { cacheHandler, cacheSizeController } from "./cache.ts"
import { ZodError } from "https://deno.land/x/zod@v3.21.4/mod.ts"
import "https://deno.land/std@0.193.0/dotenv/load.ts"

const app = new Application()

const usage = {
    description: `A tool to convert a page of a PDF to an image.`,
    requiredArguments: {
        pdf: 'A url to the pdf',
        page: 'Must be a number or it could be one of these keywords: first, middle, last'
    }
}

app.use(async (context, next) => {
    try {
      await next();
    } catch (error) {
        context.response.type = "json";

        let message =  String(error)

        if (error instanceof ZodError) {
            const jsonBody = JSON.parse(error.message)
            message = jsonBody?.[0]?.message ?? ''

            if (jsonBody?.[0]?.unionErrors) {
                message = jsonBody?.[0]?.unionErrors.map((error: any) => error?.issues[0].message)
            }
        }

        context.response.body = { usage, error: message };
    }

  });

const router = new Router()
router
    .get("/", (context: Context) => {
        context.response.body = usage
    })
    .get("/convert", convertPDFtoJPGOakRoute)

app.use(router.routes())
app.use(router.allowedMethods())

await cacheHandler()
if (Deno.env.get("CACHE_SIZE_LIMITING") == "true"){
    cacheSizeController()
}

const port = Number(Deno.env.get("PORT"))
app.listen({ port })
console.log(`Server is listening on port: ${port}`)

// Test URL - http://localhost:8000/convert/?pdf=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf&page=first