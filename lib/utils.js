
export function selector(selectorString) {
  var domPathArray = selectorString.split(' props')[0].split(' ');
  var fullDomPathArray = domPathArray.reduce(function(cur, val, index) {
    return domPathArray.length === index+1 ? (val === 'children' ? cur : cur.concat([val])) : cur.concat([val, 'children']);
  },[]);
  var toConcat = [];
  if (selectorString.indexOf('props') > 0) {
    var propsPathArray = selectorString.split('props')[1].split(' ');
      toConcat = ['props'].concat(propsPathArray.slice(1));
  }
  return ['ui'].concat(fullDomPathArray.concat(toConcat));
};
