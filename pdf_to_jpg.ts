export async function pdfToJPG(pageNum:string, fileName:string, pageToConvert:string, totalPages:string){
  const cacheName = `./cache/${fileName}`
  const convertCommand = new Deno.Command("pdftoppm", {
    args: [
      '-jpeg', `${fileName}.pdf`, '-f', pageNum,'-l', pageNum, cacheName
    ]
  })
  await convertCommand.output()

  const padValue = totalPages.length
  await Deno.rename(`${cacheName}-${pageNum.padStart(padValue, "0")}.jpg`, `${cacheName}-${pageToConvert}.jpg`)
}