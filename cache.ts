export async function cacheHandler() {
    try {
      await Deno.readFile("./cache/cache")
    }
    catch (_error) {
      // TODO make cross platform.
      console.log("Cache not found, generating...")
      const createCache = new Deno.Command("mkdir", {
        args: [
          "cache"
        ]
      })

      const createCacheChecker = new Deno.Command("touch", {
        args: [
          "./cache/cache"
        ]
      })
    await createCache.output()
    await createCacheChecker.output()
    }
}

export async function checkCache(inputHashName:string, pageValue:number) {
    let padValue = 1
    let returnValue = new Uint8Array()
    while (padValue <= 6) {
      try {
        returnValue = await Deno.readFile(`./cache/${inputHashName}-${pageValue.toString().padStart(padValue,"0")}.jpg`)
        return returnValue
      }
      catch {
        padValue += 1
      }
    }
    return false
}

/*export function createHashName(hash:string) {
    const newName = `./cache/${hash}`
    return newName
}*/