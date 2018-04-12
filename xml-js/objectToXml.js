const elementTypes12 = require('../inline-elements/ElementTypes').elementTypes12;

function makeElement(name, attributes, elements) {
  const el = {
    type: 'element',
    name: name
  };
  if (attributes !== null && attributes !== undefined) {
    el.attributes = attributes;
  }
  if (Array.isArray(elements)) {
    el.elements = elements;
  } else if (elements === true) {
    el.elements = [];
  }
  return el;
}
exports.makeElement = makeElement;

function makeText(text) {
  return {
    type: 'text',
    text
  };
}
exports.makeText = makeText;


function makeValue(content) {
  if (!Array.isArray(content)) {
    return [makeText(content)];
  }

  return content.map((segment) => {
    if (typeof segment === 'string' || segment instanceof String) {
      return makeText(segment);
    }
    // Inline elements
    // Each inline element object should only have one property (key) -- the element type
    const elementType = Object.keys(segment)[0];
    if (elementTypes12.hasOwnProperty(elementType)) {
      const attrsSrc = Object.assign({}, segment[elementType]);
      delete attrsSrc.id;
      delete attrsSrc.contents;
      const contents = segment[elementType].hasOwnProperty('contents') ? makeValue(segment[elementType].contents) : undefined;
      const attrs = {
        id: segment[elementType].id,
      };
      Object.keys(attrsSrc).forEach((attrKey) => {
        attrs[attrKey] = attrsSrc[attrKey];
      });
      return makeElement(elementType, attrs, contents);
    }
    // If an invalid object is included as a segment in a source/target value array,
    // just turn it into an XML comment
    const segmentString =
      '{ ' +
      Object.keys(segment).reduce((result, segmentKey) => {
        return result + segmentKey + ': "' + segment[segmentKey].toString() + '"';
      }, '') +
      ' }';
    return { type: 'comment', comment: 'Warning: unexpected segment ' + segmentString + ' was ignored' };
  });
}
exports.makeValue = makeValue;
