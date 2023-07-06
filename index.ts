import { Application, Context, Router } from "https://deno.land/x/oak/mod.ts"
import { convertPDFtoJPGOakRoute } from './pdfImageConverter.ts'
import { cacheHandler } from "./cache.ts"

const app = new Application()

const router = new Router()
router
    .get("/", (context: Context) => {
        context.response.body = "TODO Add documentation"
    })
    .get("/convert", convertPDFtoJPGOakRoute)

app.use(router.routes())
app.use(router.allowedMethods())

await cacheHandler()

await app.listen({ port: 8000 })