/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
}

Rectangle.prototype.getArea = function getArea() {
  return this.width * this.height;
};

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}

/**
 * Css selectors builder
 */
class CssSelector {
  constructor() {
    this.parts = [];
    this.elementCount = 0;
    this.idCount = 0;
    this.pseudoElementCount = 0;
  }

  checkOrder(newType) {
    const order = ['element', 'id', 'class', 'attr', 'pseudoClass', 'pseudoElement'];
    const lastType = this.parts.length > 0 ? this.parts[this.parts.length - 1].type : '';
    const lastIndex = order.indexOf(lastType);
    const newIndex = order.indexOf(newType);

    if (lastIndex > newIndex) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
  }

  checkDuplicates(type) {
    if (type === 'element' && this.elementCount > 0) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (type === 'id' && this.idCount > 0) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (type === 'pseudoElement' && this.pseudoElementCount > 0) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
  }

  element(value) {
    this.checkOrder('element');
    this.checkDuplicates('element');
    this.parts.push({ type: 'element', value });
    this.elementCount += 1;
    return this;
  }

  id(value) {
    this.checkOrder('id');
    this.checkDuplicates('id');
    this.parts.push({ type: 'id', value: `#${value}` });
    this.idCount += 1;
    return this;
  }

  class(value) {
    this.checkOrder('class');
    this.parts.push({ type: 'class', value: `.${value}` });
    return this;
  }

  attr(value) {
    this.checkOrder('attr');
    this.parts.push({ type: 'attr', value: `[${value}]` });
    return this;
  }

  pseudoClass(value) {
    this.checkOrder('pseudoClass');
    this.parts.push({ type: 'pseudoClass', value: `:${value}` });
    return this;
  }

  pseudoElement(value) {
    this.checkOrder('pseudoElement');
    this.checkDuplicates('pseudoElement');
    this.parts.push({ type: 'pseudoElement', value: `::${value}` });
    this.pseudoElementCount += 1;
    return this;
  }

  stringify() {
    return this.parts.map((part) => part.value).join('');
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new CssSelector().element(value);
  },

  id(value) {
    return new CssSelector().id(value);
  },

  class(value) {
    return new CssSelector().class(value);
  },

  attr(value) {
    return new CssSelector().attr(value);
  },

  pseudoClass(value) {
    return new CssSelector().pseudoClass(value);
  },

  pseudoElement(value) {
    return new CssSelector().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    const result = new CssSelector();
    result.parts = [{
      type: 'combined',
      value: `${selector1.stringify()} ${combinator} ${selector2.stringify()}`,
    }];
    return result;
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
