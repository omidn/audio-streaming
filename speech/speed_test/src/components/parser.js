/**
 *  This parses multipart/form-data when passed into a Lambda function through
 *  API Gateway using the following Integration Request Mapping Template:

#set($allParams = $input.params())
{
  "body" : $input.json('$'),
  "params" : {
    #foreach($type in $allParams.keySet())
    #set($params = $allParams.get($type))
    "$type" : {
      #foreach($paramName in $params.keySet())
      "$paramName" : "$util.escapeJavaScript($params.get($paramName))"
      #if($foreach.hasNext),#end
      #end
    }
    #if($foreach.hasNext),#end
    #end
  }
}

 */

  
let b, fields;

try {
  b = Boundary_parse(event.body);
  fields = MultiPart_parse(event.body, 'multipart/form-body; boundary=' + b);
} catch (err) {
  context.fail(err);
}


/* 
 * MultiPart_parse decodes a multipart/form-data encoded response into a named-part-map.
 * The response can be a string or raw bytes.
 *
 * Usage for string response:
 *      var map = MultiPart_parse(xhr.responseText, xhr.getResponseHeader('Content-Type'));
 *
 * Usage for raw bytes:
 *      xhr.open(..);     
 *      xhr.responseType = "arraybuffer";
 *      ...
 *      var map = MultiPart_parse(xhr.response, xhr.getResponseHeader('Content-Type'));
 *
 * Copyright@ 2013-2014 Wolfgang Kuehn, released under the MIT license.
 */
function MultiPart_parse(body, contentType) {
  // Examples for content types:
  //      multipart/form-data; boundary="----7dd322351017c"; ...
  //      multipart/form-data; boundary=----7dd322351017c; ...
  var m = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);

  if (!m) {
    throw new Error('Bad content-type header, no multipart boundary');
  }

  let s, fieldName;
  let boundary = m[1] || m[2];

  function Header_parse(header) {
    var headerFields = {};
    var matchResult = header.match(/^.*name="([^"]*)"$/);
    if (matchResult) headerFields.name = matchResult[1];
    return headerFields;
  }

  function rawStringToBuffer(str) {
    var idx, len = str.length,
      arr = new Array(len);
    for (idx = 0; idx < len; ++idx) {
      arr[idx] = str.charCodeAt(idx) & 0xFF;
    }
    return new Uint8Array(arr).buffer;
  }

  // \r\n is part of the boundary.
  boundary = '\r\n--' + boundary;

  var isRaw = typeof(body) !== 'string';

  if (isRaw) {
    var view = new Uint8Array(body);
    s = String.fromCharCode.apply(null, view);
  } else {
    s = body;
  }

  // Prepend what has been stripped by the body parsing mechanism.
  s = '\r\n' + s;

  var parts = s.split(new RegExp(boundary)),
    partsByName = {};

  // First part is a preamble, last part is closing '--'
  for (var i = 1; i < parts.length - 1; i++) {
    var subparts = parts[i].split('\r\n\r\n');
    var headers = subparts[0].split('\r\n');
    for (var j = 1; j < headers.length; j++) {
      var headerFields = Header_parse(headers[j]);
      if (headerFields.name) {
        fieldName = headerFields.name;
      }
    }

    partsByName[fieldName] = isRaw ? rawStringToBuffer(subparts[1]) : subparts[1];
  }

  return partsByName;
}

function Boundary_parse(body) {
  var bndry = body.split('Content-Disposition: form-data;')[0];
  return bndry.trim().slice(2);
}

export