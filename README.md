# PDF to Image Converter

### Requirements

- Deno runtime
- poppler-utils


### Setup

.env needs to be configured on first use, simply duplicate .env.default and remove .default from the name then adjust environment variables accordingly.

Port is 8000 by default, can be adjusted in .env

There is an adjustable cron schedule which will clear the oldest items in cache above a customisable size threshold, all configurable inside .env

https://crontab.guru/ <- Useful for formulating cron expressions

Cache limiting is disabled by default


### Usage

#### Deno

Deno users should import from "https://deno.land/x/pdf_to_jpg@v0.9.1/pdfImageConverter.ts"
For standalone use of the converter, import "convertPDFtoJPG"
For integrated use with Oak, import "convertPDFtoJPGOakRoute"


#### Standalone Server

Run index.ts to start the converter which will then begin an Oak server on the configured port

---

To convert a page of a PDF document to JPG, a PDF URL and either the page number or one of the keywords ("first", "middle" and "end")

Syntax: http://localhost:{port}/convert/?pdf={pdf url}&{page number or keyword}

Example URL: http://localhost:8000/convert/?pdf=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf&page=first