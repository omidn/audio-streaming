const REGEX_PARSE_HEADER = /^(.*):(.*)$/m
const REGEX_PARSE_BOUNDARY = /boundary=((?:"([^"]+)")|([^(;|\s)]+))/i

export {
  REGEX_PARSE_HEADER,
  REGEX_PARSE_BOUNDARY,
}
