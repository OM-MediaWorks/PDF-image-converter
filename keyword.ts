export function keywordToPageNum(keyword:string, pdfLength:number) {
    console.log(keyword, pdfLength)
    let pageNum:number
    keyword = keyword.toLowerCase()
    if (keyword == "middle"){
        pageNum = Math.round(pdfLength/2)
        return pageNum
    }

    if (keyword == "last"){
        pageNum = pdfLength
        return pageNum
    }

    else {
        return false
    }
}

export function firstToNum(keyword:string) {
    console.log(keyword)
    keyword = keyword.toLowerCase()
    if (keyword == "first"){
        return 1
    }
    else {
        const pageNum = Number(keyword)
        if (isNaN(pageNum) == false){
            return pageNum
        }
        else {
            return false
        }
    }
}