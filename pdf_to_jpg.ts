export async function pdfToJPG(pageToConvert:string, fileName:string){
    const cacheName = `./cache/${fileName}`
    const convertCommand = new Deno.Command("pdftoppm", {
        args: [
          '-jpeg', `${fileName}.pdf`, '-f', pageToConvert,'-l', pageToConvert, cacheName
        ]
      })
      await convertCommand.output()
}