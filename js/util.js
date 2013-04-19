var util = {}

/**
 * Gets the first property of an object.
 */
util.getFirstProperty = function(object) {
    var firstProperty = {};        
    for (var property in object) {
        firstProperty = object[property];
        break;
    }
    return firstProperty;
}

/**
 * Calls processItem on item, or if item is a list it calls it for each element
 * in the list.
 */
util.each = function(item, processItem) {
    if ($.isArray(item)) {
        $.each(item, function(index, value) {
            processItem(value);
        });
    } else {
        processItem(item);
    }
}

/**
 * Calls the processValue function for each value in a hash.
 **/
util.eachValue = function(hash, processValue) {
    for (var key in hash) {
        util.each(hash[key], processValue);
    }
}

/**
 * Returns a list with the values in the hash.
 */
util.values = function(hash) {
    var values = [];
    util.eachValue(hash, $.proxy(values.push, values));
    return values;
}

/**
 * Returns a list with the keys in the hash.
 */
util.keys = function(hash) {
    var keys = [];
    for (var key in hash) {
        keys.push(key);
    }
    return keys;
}

/**
 * Returns true if predicate is true for all items.
 **/
util.and = function(items, predicate) {
    var result = true;
    util.each(items, function(item) {
        result = result && predicate(item);
    });
    
    return result;
}

/**
 * Returns true if predicate is true for some of the items.
 */
util.or = function(items, predicate) {
    var result = false;
    util.each(items, function(item) {
        result = result || predicate(item);
    });
    
    return result;
}

/**
 * Checks if the input is string.
 **/
util.is_string = function(input) {
    return $.type(input) === 'string';
}

/**
 * Class that facilitates building the html for a table.
 */
function TableBuilder(columns, optionalClass) {
    optionalClass = optionalClass || "";
    this.html = '<table class="table table-striped ' + optionalClass + '">';
    this.html += '<thead>';
    for (var i = 0; i < columns.length; i++) {
        columns[i] += '&nbsp;&nbsp;&nbsp;&nbsp;';
    }
    this._addRow(columns, 'th');
    this.html += '</thead><tbody>';
}

TableBuilder.prototype._addRow = function(values, columnTag) {
    this.html += '<tr>';
    for (var i = 0; i < values.length; i++) {
        this.html += '<' + columnTag + '>' + values[i] + '</' + columnTag + '>';
    }
    this.html += '</tr>';
}

TableBuilder.prototype.addRow = function(values) {
    this._addRow(values, 'td');
}

TableBuilder.prototype.build = function() {
    this.html += "</tbody></table>";
    return this.html;
}