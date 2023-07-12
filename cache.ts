import { cron } from "https://deno.land/x/deno_cron@v1.0.0/cron.ts"

export async function cacheHandler() {
  try {
    await Deno.stat("cache")
  }
  catch (_error) {
    console.log("Cache not found, generating...")
    await Deno.mkdir("cache")
  }
}

export async function checkCache(inputHashName:string, pageValue:string): Promise<Uint8Array | false> {
  try {
      return await Deno.readFile(`./cache/${inputHashName}-${pageValue}.jpg`)
  }
  catch {
      return Promise.resolve(false)
  }
}

export function cacheSizeController() {
  async function checkCacheSize() {
    let returnCacheSize = 0
    const itemNames = []
    let cacheCount = 0
    for await (const dirEntry of Deno.readDir("./cache/")) {
      itemNames[cacheCount] = dirEntry.name
      cacheCount ++
    }

    const accessTimeArray = []
    for (let i = 0; i < cacheCount; i++) {
      const { size, atime } = await Deno.stat(`./cache/${itemNames[i]}`)
      returnCacheSize += size
      accessTimeArray[i] = atime
    }

    return {
      returnCacheSize, cacheCount, itemNames, accessTimeArray
    }
  }

  async function limitCache(){
    const cacheLimit = Number(Deno.env.get("CACHE_SIZE")) ?? 100000000
    const { returnCacheSize } = await checkCacheSize()
    let cacheSize = returnCacheSize
    
    while (cacheSize > cacheLimit){
      const { cacheCount, itemNames, accessTimeArray } = await checkCacheSize()
      let oldestAccess = accessTimeArray[0]
      let arrayPosition = 0
      for (let i = 0; i < cacheCount; i++) {
        if (oldestAccess! > accessTimeArray[i]!){
          oldestAccess = accessTimeArray[i]
          arrayPosition = i
        }
      }
      await Deno.remove(`./cache/${itemNames[arrayPosition]}`)
      const { returnCacheSize } = await checkCacheSize()
      cacheSize = returnCacheSize
    }
    console.log("Cache cleanup complete!")
  }

  const cronEnv = Deno.env.get("CRON_TIMING") ?? "*,*,*,*,*"
  let cronTiming = cronEnv.replaceAll(',', ' ')
  cron(cronTiming, () => {
    limitCache()
  })
}