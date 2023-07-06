const clearCache = new Deno.Command("rm", {
    args: [
        "-r", "cache"
    ]
})
clearCache.output()