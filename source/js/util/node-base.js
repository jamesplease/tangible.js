/*
 * Node Base
 * For performance purposes we clone as many nodes as we can.
 *
 */

var base = {
  text: document.createTextNode(''),
  span: document.createElement('span'),
  div: document.createElement('div'),
  pre: document.createElement('pre'),
  a: document.createElement('a')
};

var templates = {
  arrow : domUtil.createEl('span', 'icon-arrow'),
  number: domUtil.createEl('span', 'number'),
  string: domUtil.createEl('span', 'string'),
  key   : domUtil.createEl('span', 'key'),
  empty : domUtil.createEl('span', 'null'),
  innerBlock: domUtil.createEl('span', 'inner-block'),
  entryList: domUtil.createEl('span', 'entry-list'),
  quote : domUtil.createEl('span', 'quote', '"'),
  bracketOpen : domUtil.createEl('span', 'bracket bracket-open', '['),
  bracketClose : domUtil.createEl('span', 'bracket bracket-close', ']'),
  braceOpen : domUtil.createEl('span', 'brace brace-open', '{'),
  braceClose : domUtil.createEl('span', 'brace brace-close', '}'),
  ellipsis: domUtil.createEl('span', 'ellipsis'),
  comma: domUtil.createEl('span', 'comma', ','),
  sep: domUtil.createEl('span', 'sep', ':\u00A0')
};
