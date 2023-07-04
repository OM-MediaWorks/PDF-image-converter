import { Application, Context, send, Router } from "https://deno.land/x/oak/mod.ts"
import { convertPDFtoJPG } from "./pdftojpg.ts"
const oakApp = new Application()

const oakRouter = new Router()
oakRouter
        .get("/", (context: Context) => {
            context.response.body = "Hi"
        })

        .get("/convert", async (context: Context) => {
            const {searchParams} = context.request.url
            const pdfTest = searchParams.get('pdf')
            const pageTest = searchParams.get('page')
            if (pdfTest.includes(".pdf") && pageTest != null){
                const file = await convertPDFtoJPG(searchParams.get('pdf')!, searchParams.get('page')!)
                context.response.headers.set('Content-Type', 'image/jpg');
                context.response.body = file
            }
            else {
                context.response.body = "Invalid query"
            }
        })

oakApp.use(async(context: Context, next) => {
    await next()
    context.response.headers.set("About","PDF to JPG converter")
})
oakApp.use(oakRouter.routes())
oakApp.use(oakRouter.allowedMethods())
await oakApp.listen({port: 8000})

//Test query: http://localhost:8000/convert/?pdf=https://media.mediaworks.global/files/bible-stories-from-the-bible-in-nivkh-and-russian.niv.pdf&page=first

/*TODO Type checking of input✔
Caching of output image✔
Allow keywords e.g first, last for page number✔
Removal of temp.pdf after usage✔
Index page
Reading from cache
*/