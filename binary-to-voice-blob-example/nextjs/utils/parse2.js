/**
* @flow
*/

// import {
//   convertToRaw,
// } from 'helpers'

import {
  REGEX_PARSE_BOUNDARY,
  REGEX_PARSE_HEADER,
} from 'regex'

// Flow Typing
type HeaderObject = {
  name?: string,
  value?: string,
}

type MultipartParsedObject = {
  index: number,
  value?: string,
  headers?: Array<HeaderObject>,
}


/**
 * Parse the content-type header received in the response
 * @param  {String}  contentType The response global content-type
 * @return {String}
 */
const parseBoundary = (contentType: string): string => {
  const arrayResults = contentType.match(REGEX_PARSE_BOUNDARY)

  if (!arrayResults) {
    throw new Error('Bad content-type header, no multipart boundary')
  }

  const boundary = arrayResults[1]

  // \r\n is part of the boundary.
  return String(`\r\n--${boundary}`)
}


/**
 * Parse headers values from the the current part
 * @param  {Array<String>}  headers HeaderObject array
 * @return {Array<HeaderObject>}
 */
const parseHeader = (headers: Array<string>): Array<HeaderObject> => headers.map((header: string): HeaderObject => {
  const matchResult: ?Array<string> = header.match(REGEX_PARSE_HEADER)
  if (!matchResult) {
    return {}
  }
  return { name: matchResult[1], value: matchResult[2] }
})


/**
 * Parse a multipart/data raw response
 * @param  {string}  body Response string
 * @param  {String}  contentType  The response global content-type
 * @return {Array<MultipartParsedObject>}
 */
const parse = (body, contentType)  => {
  // Parse body boundary
  const boundary: string = parseBoundary(contentType)

  // Convert and work on body if type is not a raw string
  // const isRaw = (typeof (body) !== 'string')
  let rawBody: string = body

  // if (isRaw) {
  //   rawBody = convertToRaw(body, isRaw)
  // }
  // Prepend what has been stripped by the body parsing mechanism.
  rawBody = (`\r\n${rawBody}`)
  // Parse content using the boundary and remove empty element
  const contents = rawBody.split(new RegExp(boundary)).filter(Boolean)

  const res = contents.map((content, index) => {
    const subparts = content.split('\r\n\r\n')
    const headers = subparts[0].split('\r\n').filter(Boolean)
    const value = (subparts[1] ? subparts[1] : '')
    const headerFields = parseHeader(headers)
    // @TODO Convert value content using the right content-type available in headers
    // or let it as a string

    return {
      index,
      value,
      headers: headerFields,
    }
  })

  return res
}

export {
  parse,
  parseBoundary,
  parseHeader,
}
