# PDF to Image Converter

### Requirements
* Deno runtime
* poppler-utils


### Setup
.env needs to be configured on first use, simply duplicate .env.default and remove .default from the name then adjust environment variables accordingly.

Port is 8000 by default, can be adjusted in .env


### Usage
Run index.ts to start the converter

To convert a page of a PDF document to JPG, a PDF URL and either the page number or one of the keywords ("first", "middle" and "end")

Syntax: http://localhost:{port}/convert/?pdf={pdf url}&{page number or keyword}

Example URL: http://localhost:8000/convert/?pdf=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf&page=first