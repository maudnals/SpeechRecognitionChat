const getIndicesOf = (searchStr, str) => {
  var searchStrLen = searchStr.length;
  if (searchStrLen === 0) {
    return [];
  }
  var startIndex = 0,
    index,
    indices = [];
  str = str.toLowerCase();
  searchStr = searchStr.toLowerCase();
  while ((index = str.indexOf(searchStr, startIndex)) > -1) {
    indices.push(index);
    startIndex = index + searchStrLen;
  }
  return indices;
};

const formatMessage = (msg, phrases) => {
  const spottedOccurences = phrases.map(p => ({
    indices: getIndicesOf(p, msg),
    length: p.length
  }));

  const formattedMsgAsArray = spottedOccurences.reduce((msgAsArray, o) => {
    const arrCopy = [...msgAsArray];
    o.indices.forEach(i => {
      arrCopy[i] = `<strong>${arrCopy[i]}`;
      arrCopy[i + o.length] = `</strong>${arrCopy[i + o.length]}`;
    });

    return arrCopy;
  }, msg.split(''));

  return formattedMsgAsArray.join('');

  // Support:
  // - case sensitivity
  // - match at start or end of the sentence
  // - multiple occurences of the same spotphrase
  // - multiple spotphrases
  // - update at runtime
  // - empty phrases

  // No support:
  // - Nested (multi-highlight)
  // - Word embedded in another still detected (bug)

  // TODO: sanitize
};

export { formatMessage };
