(function(f, define){
    define([], f);
})(function(){



/*jshint eqnull: true, loopfunc: true, evil: true, boss: true, freeze: false*/
(function($, window, undefined) {
    var kendo = window.kendo = window.kendo || { cultures: {} },
        extend = $.extend,
        each = $.each,
        isArray = $.isArray,
        proxy = $.proxy,
        noop = $.noop,
        math = Math,
        Template,
        JSON = window.JSON || {},
        support = {},
        percentRegExp = /%/,
        formatRegExp = /\{(\d+)(:[^\}]+)?\}/g,
        boxShadowRegExp = /(\d+(?:\.?)\d*)px\s*(\d+(?:\.?)\d*)px\s*(\d+(?:\.?)\d*)px\s*(\d+)?/i,
        numberRegExp = /^(\+|-?)\d+(\.?)\d*$/,
        FUNCTION = "function",
        STRING = "string",
        NUMBER = "number",
        OBJECT = "object",
        NULL = "null",
        BOOLEAN = "boolean",
        UNDEFINED = "undefined",
        getterCache = {},
        setterCache = {},
        slice = [].slice,
        globalize = window.Globalize;

    kendo.version = "$KENDO_VERSION";

    function Class() {}

    Class.extend = function(proto) {
        var base = function() {},
            member,
            that = this,
            subclass = proto && proto.init ? proto.init : function () {
                that.apply(this, arguments);
            },
            fn;

        base.prototype = that.prototype;
        fn = subclass.fn = subclass.prototype = new base();

        for (member in proto) {
            if (proto[member] != null && proto[member].constructor === Object) {
                // Merge object members
                fn[member] = extend(true, {}, base.prototype[member], proto[member]);
            } else {
                fn[member] = proto[member];
            }
        }

        fn.constructor = subclass;
        subclass.extend = that.extend;

        return subclass;
    };

    Class.prototype._initOptions = function(options) {
        this.options = deepExtend({}, this.options, options);
    };

    var isFunction = kendo.isFunction = function(fn) {
        return typeof fn === "function";
    };

    var preventDefault = function() {
        this._defaultPrevented = true;
    };

    var isDefaultPrevented = function() {
        return this._defaultPrevented === true;
    };

    var Observable = Class.extend({
        init: function() {
            this._events = {};
        },

        bind: function(eventName, handlers, one) {
            var that = this,
                idx,
                eventNames = typeof eventName === STRING ? [eventName] : eventName,
                length,
                original,
                handler,
                handlersIsFunction = typeof handlers === FUNCTION,
                events;

            if (handlers === undefined) {
                for (idx in eventName) {
                    that.bind(idx, eventName[idx]);
                }
                return that;
            }

            for (idx = 0, length = eventNames.length; idx < length; idx++) {
                eventName = eventNames[idx];

                handler = handlersIsFunction ? handlers : handlers[eventName];

                if (handler) {
                    if (one) {
                        original = handler;
                        handler = function() {
                            that.unbind(eventName, handler);
                            original.apply(that, arguments);
                        };
                        handler.original = original;
                    }
                    events = that._events[eventName] = that._events[eventName] || [];
                    events.push(handler);
                }
            }

            return that;
        },

        one: function(eventNames, handlers) {
            return this.bind(eventNames, handlers, true);
        },

        first: function(eventName, handlers) {
            var that = this,
                idx,
                eventNames = typeof eventName === STRING ? [eventName] : eventName,
                length,
                handler,
                handlersIsFunction = typeof handlers === FUNCTION,
                events;

            for (idx = 0, length = eventNames.length; idx < length; idx++) {
                eventName = eventNames[idx];

                handler = handlersIsFunction ? handlers : handlers[eventName];

                if (handler) {
                    events = that._events[eventName] = that._events[eventName] || [];
                    events.unshift(handler);
                }
            }

            return that;
        },

        trigger: function(eventName, e) {
            var that = this,
                events = that._events[eventName],
                idx,
                length;

            if (events) {
                e = e || {};

                e.sender = that;

                e._defaultPrevented = false;

                e.preventDefault = preventDefault;

                e.isDefaultPrevented = isDefaultPrevented;

                events = events.slice();

                for (idx = 0, length = events.length; idx < length; idx++) {
                    events[idx].call(that, e);
                }

                return e._defaultPrevented === true;
            }

            return false;
        },

        unbind: function(eventName, handler) {
            var that = this,
                events = that._events[eventName],
                idx;

            if (eventName === undefined) {
                that._events = {};
            } else if (events) {
                if (handler) {
                    for (idx = events.length - 1; idx >= 0; idx--) {
                        if (events[idx] === handler || events[idx].original === handler) {
                            events.splice(idx, 1);
                        }
                    }
                } else {
                    that._events[eventName] = [];
                }
            }

            return that;
        }
    });


     function compilePart(part, stringPart) {
         if (stringPart) {
             return "'" +
                 part.split("'").join("\\'")
                     .split('\\"').join('\\\\\\"')
                     .replace(/\n/g, "\\n")
                     .replace(/\r/g, "\\r")
                     .replace(/\t/g, "\\t") + "'";
         } else {
             var first = part.charAt(0),
                 rest = part.substring(1);

             if (first === "=") {
                 return "+(" + rest + ")+";
             } else if (first === ":") {
                 return "+e(" + rest + ")+";
             } else {
                 return ";" + part + ";o+=";
             }
         }
     }

    var argumentNameRegExp = /^\w+/,
        encodeRegExp = /\$\{([^}]*)\}/g,
        escapedCurlyRegExp = /\\\}/g,
        curlyRegExp = /__CURLY__/g,
        escapedSharpRegExp = /\\#/g,
        sharpRegExp = /__SHARP__/g,
        zeros = ["", "0", "00", "000", "0000"];

    Template = {
        paramName: "data", // name of the parameter of the generated template
        useWithBlock: true, // whether to wrap the template in a with() block
        render: function(template, data) {
            var idx,
                length,
                html = "";

            for (idx = 0, length = data.length; idx < length; idx++) {
                html += template(data[idx]);
            }

            return html;
        },
        compile: function(template, options) {
            var settings = extend({}, this, options),
                paramName = settings.paramName,
                argumentName = paramName.match(argumentNameRegExp)[0],
                useWithBlock = settings.useWithBlock,
                functionBody = "var o,e=kendo.htmlEncode;",
                fn,
                parts,
                idx;

            if (isFunction(template)) {
                return template;
            }

            functionBody += useWithBlock ? "with(" + paramName + "){" : "";

            functionBody += "o=";

            parts = template
                .replace(escapedCurlyRegExp, "__CURLY__")
                .replace(encodeRegExp, "#=e($1)#")
                .replace(curlyRegExp, "}")
                .replace(escapedSharpRegExp, "__SHARP__")
                .split("#");

            for (idx = 0; idx < parts.length; idx ++) {
                functionBody += compilePart(parts[idx], idx % 2 === 0);
            }

            functionBody += useWithBlock ? ";}" : ";";

            functionBody += "return o;";

            functionBody = functionBody.replace(sharpRegExp, "#");

            try {
                fn = new Function(argumentName, functionBody);
                fn._slotCount = Math.floor(parts.length / 2);
                return fn;
            } catch(e) {
                throw new Error(kendo.format("Invalid template:'{0}' Generated code:'{1}'", template, functionBody));
            }
        }
    };

function pad(number, digits, end) {
    number = number + "";
    digits = digits || 2;
    end = digits - number.length;

    if (end) {
        return zeros[digits].substring(0, end) + number;
    }

    return number;
}

    //JSON stringify
(function() {
    var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"" : '\\"',
            "\\": "\\\\"
        },
        rep,
        toString = {}.toString;


    if (typeof Date.prototype.toJSON !== FUNCTION) {

        Date.prototype.toJSON = function () {
            var that = this;

            return isFinite(that.valueOf()) ?
                pad(that.getUTCFullYear(), 4) + "-" +
                pad(that.getUTCMonth() + 1)   + "-" +
                pad(that.getUTCDate())        + "T" +
                pad(that.getUTCHours())       + ":" +
                pad(that.getUTCMinutes())     + ":" +
                pad(that.getUTCSeconds())     + "Z" : null;
        };

        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function () {
            return this.valueOf();
        };
    }

    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? "\"" + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === STRING ? c :
                "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
        }) + "\"" : "\"" + string + "\"";
    }

    function str(key, holder) {
        var i,
            k,
            v,
            length,
            mind = gap,
            partial,
            value = holder[key],
            type;

        if (value && typeof value === OBJECT && typeof value.toJSON === FUNCTION) {
            value = value.toJSON(key);
        }

        if (typeof rep === FUNCTION) {
            value = rep.call(holder, key, value);
        }

        type = typeof value;
        if (type === STRING) {
            return quote(value);
        } else if (type === NUMBER) {
            return isFinite(value) ? String(value) : NULL;
        } else if (type === BOOLEAN || type === NULL) {
            return String(value);
        } else if (type === OBJECT) {
            if (!value) {
                return NULL;
            }
            gap += indent;
            partial = [];
            if (toString.apply(value) === "[object Array]") {
                length = value.length;
                for (i = 0; i < length; i++) {
                    partial[i] = str(i, value) || NULL;
                }
                v = partial.length === 0 ? "[]" : gap ?
                    "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" :
                    "[" + partial.join(",") + "]";
                gap = mind;
                return v;
            }
            if (rep && typeof rep === OBJECT) {
                length = rep.length;
                for (i = 0; i < length; i++) {
                    if (typeof rep[i] === STRING) {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ": " : ":") + v);
                        }
                    }
                }
            } else {
                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ": " : ":") + v);
                        }
                    }
                }
            }

            v = partial.length === 0 ? "{}" : gap ?
                "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" :
                "{" + partial.join(",") + "}";
            gap = mind;
            return v;
        }
    }

    if (typeof JSON.stringify !== FUNCTION) {
        JSON.stringify = function (value, replacer, space) {
            var i;
            gap = "";
            indent = "";

            if (typeof space === NUMBER) {
                for (i = 0; i < space; i += 1) {
                    indent += " ";
                }

            } else if (typeof space === STRING) {
                indent = space;
            }

            rep = replacer;
            if (replacer && typeof replacer !== FUNCTION && (typeof replacer !== OBJECT || typeof replacer.length !== NUMBER)) {
                throw new Error("JSON.stringify");
            }

            return str("", {"": value});
        };
    }
})();

// Date and Number formatting
(function() {
    var dateFormatRegExp = /dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|HH|H|hh|h|mm|m|fff|ff|f|tt|ss|s|zzz|zz|z|"[^"]*"|'[^']*'/g,
        standardFormatRegExp =  /^(n|c|p|e)(\d*)$/i,
        literalRegExp = /(\\.)|(['][^']*[']?)|(["][^"]*["]?)/g,
        commaRegExp = /\,/g,
        EMPTY = "",
        POINT = ".",
        COMMA = ",",
        SHARP = "#",
        ZERO = "0",
        PLACEHOLDER = "??",
        EN = "en-US",
        objectToString = {}.toString;

    //cultures
    kendo.cultures["en-US"] = {
        name: EN,
        numberFormat: {
            pattern: ["-n"],
            decimals: 2,
            ",": ",",
            ".": ".",
            groupSize: [3],
            percent: {
                pattern: ["-n %", "n %"],
                decimals: 2,
                ",": ",",
                ".": ".",
                groupSize: [3],
                symbol: "%"
            },
            currency: {
                pattern: ["($n)", "$n"],
                decimals: 2,
                ",": ",",
                ".": ".",
                groupSize: [3],
                symbol: "$"
            }
        },
        calendars: {
            standard: {
                days: {
                    names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                    namesAbbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                    namesShort: [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ]
                },
                months: {
                    names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                    namesAbbr: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                },
                AM: [ "AM", "am", "AM" ],
                PM: [ "PM", "pm", "PM" ],
                patterns: {
                    d: "M/d/yyyy",
                    D: "dddd, MMMM dd, yyyy",
                    F: "dddd, MMMM dd, yyyy h:mm:ss tt",
                    g: "M/d/yyyy h:mm tt",
                    G: "M/d/yyyy h:mm:ss tt",
                    m: "MMMM dd",
                    M: "MMMM dd",
                    s: "yyyy'-'MM'-'ddTHH':'mm':'ss",
                    t: "h:mm tt",
                    T: "h:mm:ss tt",
                    u: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
                    y: "MMMM, yyyy",
                    Y: "MMMM, yyyy"
                },
                "/": "/",
                ":": ":",
                firstDay: 0,
                twoDigitYearMax: 2029
            }
        }
    };


     function findCulture(culture) {
        if (culture) {
            if (culture.numberFormat) {
                return culture;
            }

            if (typeof culture === STRING) {
                var cultures = kendo.cultures;
                return cultures[culture] || cultures[culture.split("-")[0]] || null;
            }

            return null;
        }

        return null;
    }

    function getCulture(culture) {
        if (culture) {
            culture = findCulture(culture);
        }

        return culture || kendo.cultures.current;
    }

    function expandNumberFormat(numberFormat) {
        numberFormat.groupSizes = numberFormat.groupSize;
        numberFormat.percent.groupSizes = numberFormat.percent.groupSize;
        numberFormat.currency.groupSizes = numberFormat.currency.groupSize;
    }

    kendo.culture = function(cultureName) {
        var cultures = kendo.cultures, culture;

        if (cultureName !== undefined) {
            culture = findCulture(cultureName) || cultures[EN];
            culture.calendar = culture.calendars.standard;
            cultures.current = culture;

            if (globalize && !globalize.load) {
                expandNumberFormat(culture.numberFormat);
            }

        } else {
            return cultures.current;
        }
    };

    kendo.findCulture = findCulture;
    kendo.getCulture = getCulture;

    //set current culture to en-US.
    kendo.culture(EN);

    function formatDate(date, format, culture) {
        culture = getCulture(culture);

        var calendar = culture.calendars.standard,
            days = calendar.days,
            months = calendar.months;

        format = calendar.patterns[format] || format;

        return format.replace(dateFormatRegExp, function (match) {
            var minutes;
            var result;
            var sign;

            if (match === "d") {
                result = date.getDate();
            } else if (match === "dd") {
                result = pad(date.getDate());
            } else if (match === "ddd") {
                result = days.namesAbbr[date.getDay()];
            } else if (match === "dddd") {
                result = days.names[date.getDay()];
            } else if (match === "M") {
                result = date.getMonth() + 1;
            } else if (match === "MM") {
                result = pad(date.getMonth() + 1);
            } else if (match === "MMM") {
                result = months.namesAbbr[date.getMonth()];
            } else if (match === "MMMM") {
                result = months.names[date.getMonth()];
            } else if (match === "yy") {
                result = pad(date.getFullYear() % 100);
            } else if (match === "yyyy") {
                result = pad(date.getFullYear(), 4);
            } else if (match === "h" ) {
                result = date.getHours() % 12 || 12;
            } else if (match === "hh") {
                result = pad(date.getHours() % 12 || 12);
            } else if (match === "H") {
                result = date.getHours();
            } else if (match === "HH") {
                result = pad(date.getHours());
            } else if (match === "m") {
                result = date.getMinutes();
            } else if (match === "mm") {
                result = pad(date.getMinutes());
            } else if (match === "s") {
                result = date.getSeconds();
            } else if (match === "ss") {
                result = pad(date.getSeconds());
            } else if (match === "f") {
                result = math.floor(date.getMilliseconds() / 100);
            } else if (match === "ff") {
                result = date.getMilliseconds();
                if (result > 99) {
                    result = math.floor(result / 10);
                }
                result = pad(result);
            } else if (match === "fff") {
                result = pad(date.getMilliseconds(), 3);
            } else if (match === "tt") {
                result = date.getHours() < 12 ? calendar.AM[0] : calendar.PM[0];
            } else if (match === "zzz") {
                minutes = date.getTimezoneOffset();
                sign = minutes < 0;

                result = math.abs(minutes / 60).toString().split(".")[0];
                minutes = math.abs(minutes) - (result * 60);

                result = (sign ? "+" : "-") + pad(result);
                result += ":" + pad(minutes);
            } else if (match === "zz" || match === "z") {
                result = date.getTimezoneOffset() / 60;
                sign = result < 0;

                result = math.abs(result).toString().split(".")[0];
                result = (sign ? "+" : "-") + (match === "zz" ? pad(result) : result);
            }

            return result !== undefined ? result : match.slice(1, match.length - 1);
        });
    }

    //number formatting
    function formatNumber(number, format, culture) {
        culture = getCulture(culture);

        var numberFormat = culture.numberFormat,
            groupSize = numberFormat.groupSize[0],
            groupSeparator = numberFormat[COMMA],
            decimal = numberFormat[POINT],
            precision = numberFormat.decimals,
            pattern = numberFormat.pattern[0],
            literals = [],
            symbol,
            isCurrency, isPercent,
            customPrecision,
            formatAndPrecision,
            negative = number < 0,
            integer,
            fraction,
            integerLength,
            fractionLength,
            replacement = EMPTY,
            value = EMPTY,
            idx,
            length,
            ch,
            hasGroup,
            hasNegativeFormat,
            decimalIndex,
            sharpIndex,
            zeroIndex,
            hasZero, hasSharp,
            percentIndex,
            currencyIndex,
            startZeroIndex,
            start = -1,
            end;

        //return empty string if no number
        if (number === undefined) {
            return EMPTY;
        }

        if (!isFinite(number)) {
            return number;
        }

        //if no format then return number.toString() or number.toLocaleString() if culture.name is not defined
        if (!format) {
            return culture.name.length ? number.toLocaleString() : number.toString();
        }

        formatAndPrecision = standardFormatRegExp.exec(format);

        // standard formatting
        if (formatAndPrecision) {
            format = formatAndPrecision[1].toLowerCase();

            isCurrency = format === "c";
            isPercent = format === "p";

            if (isCurrency || isPercent) {
                //get specific number format information if format is currency or percent
                numberFormat = isCurrency ? numberFormat.currency : numberFormat.percent;
                groupSize = numberFormat.groupSize[0];
                groupSeparator = numberFormat[COMMA];
                decimal = numberFormat[POINT];
                precision = numberFormat.decimals;
                symbol = numberFormat.symbol;
                pattern = numberFormat.pattern[negative ? 0 : 1];
            }

            customPrecision = formatAndPrecision[2];

            if (customPrecision) {
                precision = +customPrecision;
            }

            //return number in exponential format
            if (format === "e") {
                return customPrecision ? number.toExponential(precision) : number.toExponential(); // toExponential() and toExponential(undefined) differ in FF #653438.
            }

            // multiply if format is percent
            if (isPercent) {
                number *= 100;
            }

            number = round(number, precision);
            negative = number < 0;
            number = number.split(POINT);

            integer = number[0];
            fraction = number[1];

            //exclude "-" if number is negative.
            if (negative) {
                integer = integer.substring(1);
            }

            value = integer;
            integerLength = integer.length;

            //add group separator to the number if it is longer enough
            if (integerLength >= groupSize) {
                value = EMPTY;
                for (idx = 0; idx < integerLength; idx++) {
                    if (idx > 0 && (integerLength - idx) % groupSize === 0) {
                        value += groupSeparator;
                    }
                    value += integer.charAt(idx);
                }
            }

            if (fraction) {
                value += decimal + fraction;
            }

            if (format === "n" && !negative) {
                return value;
            }

            number = EMPTY;

            for (idx = 0, length = pattern.length; idx < length; idx++) {
                ch = pattern.charAt(idx);

                if (ch === "n") {
                    number += value;
                } else if (ch === "$" || ch === "%") {
                    number += symbol;
                } else {
                    number += ch;
                }
            }

            return number;
        }

        //custom formatting
        //
        //separate format by sections.

        //make number positive
        if (negative) {
            number = -number;
        }

        if (format.indexOf("'") > -1 || format.indexOf("\"") > -1 || format.indexOf("\\") > -1) {
            format = format.replace(literalRegExp, function (match) {
                var quoteChar = match.charAt(0).replace("\\", ""),
                    literal = match.slice(1).replace(quoteChar, "");

                literals.push(literal);

                return PLACEHOLDER;
            });
        }

        format = format.split(";");
        if (negative && format[1]) {
            //get negative format
            format = format[1];
            hasNegativeFormat = true;
        } else if (number === 0) {
            //format for zeros
            format = format[2] || format[0];
            if (format.indexOf(SHARP) == -1 && format.indexOf(ZERO) == -1) {
                //return format if it is string constant.
                return format;
            }
        } else {
            format = format[0];
        }

        percentIndex = format.indexOf("%");
        currencyIndex = format.indexOf("$");

        isPercent = percentIndex != -1;
        isCurrency = currencyIndex != -1;

        //multiply number if the format has percent
        if (isPercent) {
            number *= 100;
        }

        if (isCurrency && format[currencyIndex - 1] === "\\") {
            format = format.split("\\").join("");
            isCurrency = false;
        }

        if (isCurrency || isPercent) {
            //get specific number format information if format is currency or percent
            numberFormat = isCurrency ? numberFormat.currency : numberFormat.percent;
            groupSize = numberFormat.groupSize[0];
            groupSeparator = numberFormat[COMMA];
            decimal = numberFormat[POINT];
            precision = numberFormat.decimals;
            symbol = numberFormat.symbol;
        }

        hasGroup = format.indexOf(COMMA) > -1;
        if (hasGroup) {
            format = format.replace(commaRegExp, EMPTY);
        }

        decimalIndex = format.indexOf(POINT);
        length = format.length;

        if (decimalIndex != -1) {
            fraction = number.toString().split("e");
            if (fraction[1]) {
                fraction = round(number, Math.abs(fraction[1]));
            } else {
                fraction = fraction[0];
            }
            fraction = fraction.split(POINT)[1] || EMPTY;
            zeroIndex = format.lastIndexOf(ZERO) - decimalIndex;
            sharpIndex = format.lastIndexOf(SHARP) - decimalIndex;
            hasZero = zeroIndex > -1;
            hasSharp = sharpIndex > -1;
            idx = fraction.length;

            if (!hasZero && !hasSharp) {
                format = format.substring(0, decimalIndex) + format.substring(decimalIndex + 1);
                length = format.length;
                decimalIndex = -1;
                idx = 0;
            } if (hasZero && zeroIndex > sharpIndex) {
                idx = zeroIndex;
            } else if (sharpIndex > zeroIndex) {
                if (hasSharp && idx > sharpIndex) {
                    idx = sharpIndex;
                } else if (hasZero && idx < zeroIndex) {
                    idx = zeroIndex;
                }
            }

            if (idx > -1) {
                number = round(number, idx);
            }
        } else {
            number = round(number);
        }

        sharpIndex = format.indexOf(SHARP);
        startZeroIndex = zeroIndex = format.indexOf(ZERO);

        //define the index of the first digit placeholder
        if (sharpIndex == -1 && zeroIndex != -1) {
            start = zeroIndex;
        } else if (sharpIndex != -1 && zeroIndex == -1) {
            start = sharpIndex;
        } else {
            start = sharpIndex > zeroIndex ? zeroIndex : sharpIndex;
        }

        sharpIndex = format.lastIndexOf(SHARP);
        zeroIndex = format.lastIndexOf(ZERO);

        //define the index of the last digit placeholder
        if (sharpIndex == -1 && zeroIndex != -1) {
            end = zeroIndex;
        } else if (sharpIndex != -1 && zeroIndex == -1) {
            end = sharpIndex;
        } else {
            end = sharpIndex > zeroIndex ? sharpIndex : zeroIndex;
        }

        if (start == length) {
            end = start;
        }

        if (start != -1) {
            value = number.toString().split(POINT);
            integer = value[0];
            fraction = value[1] || EMPTY;

            integerLength = integer.length;
            fractionLength = fraction.length;

            if (negative && (number * -1) >= 0) {
                negative = false;
            }

            //add group separator to the number if it is longer enough
            if (hasGroup) {
                if (integerLength === groupSize && integerLength < decimalIndex - startZeroIndex) {
                    integer = groupSeparator + integer;
                } else if (integerLength > groupSize) {
                    value = EMPTY;
                    for (idx = 0; idx < integerLength; idx++) {
                        if (idx > 0 && (integerLength - idx) % groupSize === 0) {
                            value += groupSeparator;
                        }
                        value += integer.charAt(idx);
                    }

                    integer = value;
                }
            }

            number = format.substring(0, start);

            if (negative && !hasNegativeFormat) {
                number += "-";
            }

            for (idx = start; idx < length; idx++) {
                ch = format.charAt(idx);

                if (decimalIndex == -1) {
                    if (end - idx < integerLength) {
                        number += integer;
                        break;
                    }
                } else {
                    if (zeroIndex != -1 && zeroIndex < idx) {
                        replacement = EMPTY;
                    }

                    if ((decimalIndex - idx) <= integerLength && decimalIndex - idx > -1) {
                        number += integer;
                        idx = decimalIndex;
                    }

                    if (decimalIndex === idx) {
                        number += (fraction ? decimal : EMPTY) + fraction;
                        idx += end - decimalIndex + 1;
                        continue;
                    }
                }

                if (ch === ZERO) {
                    number += ch;
                    replacement = ch;
                } else if (ch === SHARP) {
                    number += replacement;
                }
            }

            if (end >= start) {
                number += format.substring(end + 1);
            }

            //replace symbol placeholders
            if (isCurrency || isPercent) {
                value = EMPTY;
                for (idx = 0, length = number.length; idx < length; idx++) {
                    ch = number.charAt(idx);
                    value += (ch === "$" || ch === "%") ? symbol : ch;
                }
                number = value;
            }

            length = literals.length;

            if (length) {
                for (idx = 0; idx < length; idx++) {
                    number = number.replace(PLACEHOLDER, literals[idx]);
                }
            }
        }

        return number;
    }

    var round = function(value, precision) {
        precision = precision || 0;

        value = value.toString().split('e');
        value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + precision) : precision)));

        value = value.toString().split('e');
        value = +(value[0] + 'e' + (value[1] ? (+value[1] - precision) : -precision));

        return value.toFixed(precision);
    };

    var toString = function(value, fmt, culture) {
        if (fmt) {
            if (objectToString.call(value) === "[object Date]") {
                return formatDate(value, fmt, culture);
            } else if (typeof value === NUMBER) {
                return formatNumber(value, fmt, culture);
            }
        }

        return value !== undefined ? value : "";
    };

    if (globalize && !globalize.load) {
        toString = function(value, format, culture) {
            if ($.isPlainObject(culture)) {
                culture = culture.name;
            }

            return globalize.format(value, format, culture);
        };
    }

    kendo.format = function(fmt) {
        var values = arguments;

        return fmt.replace(formatRegExp, function(match, index, placeholderFormat) {
            var value = values[parseInt(index, 10) + 1];

            return toString(value, placeholderFormat ? placeholderFormat.substring(1) : "");
        });
    };

    kendo._extractFormat = function (format) {
        if (format.slice(0,3) === "{0:") {
            format = format.slice(3, format.length - 1);
        }

        return format;
    };

    kendo._activeElement = function() {
        try {
            return document.activeElement;
        } catch(e) {
            return document.documentElement.activeElement;
        }
    };

    kendo._round = round;
    kendo.toString = toString;
})();


(function() {
    var nonBreakingSpaceRegExp = /\u00A0/g,
        exponentRegExp = /[eE][\-+]?[0-9]+/,
        shortTimeZoneRegExp = /[+|\-]\d{1,2}/,
        longTimeZoneRegExp = /[+|\-]\d{1,2}:?\d{2}/,
        dateRegExp = /^\/Date\((.*?)\)\/$/,
        offsetRegExp = /[+-]\d*/,
        formatsSequence = ["G", "g", "d", "F", "D", "y", "m", "T", "t"],
        numberRegExp = {
            2: /^\d{1,2}/,
            3: /^\d{1,3}/,
            4: /^\d{4}/
        },
        objectToString = {}.toString;

    function outOfRange(value, start, end) {
        return !(value >= start && value <= end);
    }

    function designatorPredicate(designator) {
        return designator.charAt(0);
    }

    function mapDesignators(designators) {
        return $.map(designators, designatorPredicate);
    }

    //if date's day is different than the typed one - adjust
    function adjustDST(date, hours) {
        if (!hours && date.getHours() === 23) {
            date.setHours(date.getHours() + 2);
        }
    }

    function lowerArray(data) {
        var idx = 0,
            length = data.length,
            array = [];

        for (; idx < length; idx++) {
            array[idx] = (data[idx] + "").toLowerCase();
        }

        return array;
    }

    function lowerLocalInfo(localInfo) {
        var newLocalInfo = {}, property;

        for (property in localInfo) {
            newLocalInfo[property] = lowerArray(localInfo[property]);
        }

        return newLocalInfo;
    }

    function parseExact(value, format, culture) {
        if (!value) {
            return null;
        }

        var lookAhead = function (match) {
                var i = 0;
                while (format[idx] === match) {
                    i++;
                    idx++;
                }
                if (i > 0) {
                    idx -= 1;
                }
                return i;
            },
            getNumber = function(size) {
                var rg = numberRegExp[size] || new RegExp('^\\d{1,' + size + '}'),
                    match = value.substr(valueIdx, size).match(rg);

                if (match) {
                    match = match[0];
                    valueIdx += match.length;
                    return parseInt(match, 10);
                }
                return null;
            },
            getIndexByName = function (names, lower) {
                var i = 0,
                    length = names.length,
                    name, nameLength,
                    subValue;

                for (; i < length; i++) {
                    name = names[i];
                    nameLength = name.length;
                    subValue = value.substr(valueIdx, nameLength);

                    if (lower) {
                        subValue = subValue.toLowerCase();
                    }

                    if (subValue == name) {
                        valueIdx += nameLength;
                        return i + 1;
                    }
                }
                return null;
            },
            checkLiteral = function() {
                var result = false;
                if (value.charAt(valueIdx) === format[idx]) {
                    valueIdx++;
                    result = true;
                }
                return result;
            },
            calendar = culture.calendars.standard,
            year = null,
            month = null,
            day = null,
            hours = null,
            minutes = null,
            seconds = null,
            milliseconds = null,
            idx = 0,
            valueIdx = 0,
            literal = false,
            date = new Date(),
            twoDigitYearMax = calendar.twoDigitYearMax || 2029,
            defaultYear = date.getFullYear(),
            ch, count, length, pattern,
            pmHour, UTC, matches,
            amDesignators, pmDesignators,
            hoursOffset, minutesOffset,
            hasTime, match;

        if (!format) {
            format = "d"; //shord date format
        }

        //if format is part of the patterns get real format
        pattern = calendar.patterns[format];
        if (pattern) {
            format = pattern;
        }

        format = format.split("");
        length = format.length;

        for (; idx < length; idx++) {
            ch = format[idx];

            if (literal) {
                if (ch === "'") {
                    literal = false;
                } else {
                    checkLiteral();
                }
            } else {
                if (ch === "d") {
                    count = lookAhead("d");
                    if (!calendar._lowerDays) {
                        calendar._lowerDays = lowerLocalInfo(calendar.days);
                    }

                    day = count < 3 ? getNumber(2) : getIndexByName(calendar._lowerDays[count == 3 ? "namesAbbr" : "names"], true);

                    if (day === null || outOfRange(day, 1, 31)) {
                        return null;
                    }
                } else if (ch === "M") {
                    count = lookAhead("M");
                    if (!calendar._lowerMonths) {
                        calendar._lowerMonths = lowerLocalInfo(calendar.months);
                    }
                    month = count < 3 ? getNumber(2) : getIndexByName(calendar._lowerMonths[count == 3 ? 'namesAbbr' : 'names'], true);

                    if (month === null || outOfRange(month, 1, 12)) {
                        return null;
                    }
                    month -= 1; //because month is zero based
                } else if (ch === "y") {
                    count = lookAhead("y");
                    year = getNumber(count);

                    if (year === null) {
                        return null;
                    }

                    if (count == 2) {
                        if (typeof twoDigitYearMax === "string") {
                            twoDigitYearMax = defaultYear + parseInt(twoDigitYearMax, 10);
                        }

                        year = (defaultYear - defaultYear % 100) + year;
                        if (year > twoDigitYearMax) {
                            year -= 100;
                        }
                    }
                } else if (ch === "h" ) {
                    lookAhead("h");
                    hours = getNumber(2);
                    if (hours == 12) {
                        hours = 0;
                    }
                    if (hours === null || outOfRange(hours, 0, 11)) {
                        return null;
                    }
                } else if (ch === "H") {
                    lookAhead("H");
                    hours = getNumber(2);
                    if (hours === null || outOfRange(hours, 0, 23)) {
                        return null;
                    }
                } else if (ch === "m") {
                    lookAhead("m");
                    minutes = getNumber(2);
                    if (minutes === null || outOfRange(minutes, 0, 59)) {
                        return null;
                    }
                } else if (ch === "s") {
                    lookAhead("s");
                    seconds = getNumber(2);
                    if (seconds === null || outOfRange(seconds, 0, 59)) {
                        return null;
                    }
                } else if (ch === "f") {
                    count = lookAhead("f");

                    match = value.substr(valueIdx, count).match(numberRegExp[3]);
                    milliseconds = getNumber(count);

                    if (milliseconds !== null) {
                        match = match[0].length;

                        if (match < 3) {
                            milliseconds *= Math.pow(10, (3 - match));
                        }

                        if (count > 3) {
                            milliseconds = parseInt(milliseconds.toString().substring(0, 3), 10);
                        }
                    }

                    if (milliseconds === null || outOfRange(milliseconds, 0, 999)) {
                        return null;
                    }

                } else if (ch === "t") {
                    count = lookAhead("t");
                    amDesignators = calendar.AM;
                    pmDesignators = calendar.PM;

                    if (count === 1) {
                        amDesignators = mapDesignators(amDesignators);
                        pmDesignators = mapDesignators(pmDesignators);
                    }

                    pmHour = getIndexByName(pmDesignators);
                    if (!pmHour && !getIndexByName(amDesignators)) {
                        return null;
                    }
                }
                else if (ch === "z") {
                    UTC = true;
                    count = lookAhead("z");

                    if (value.substr(valueIdx, 1) === "Z") {
                        checkLiteral();
                        continue;
                    }

                    matches = value.substr(valueIdx, 6)
                                   .match(count > 2 ? longTimeZoneRegExp : shortTimeZoneRegExp);

                    if (!matches) {
                        return null;
                    }

                    matches = matches[0].split(":");

                    hoursOffset = matches[0];
                    minutesOffset = matches[1];

                    if (!minutesOffset && hoursOffset.length > 3) { //(+|-)[hh][mm] format is used
                        valueIdx = hoursOffset.length - 2;
                        minutesOffset = hoursOffset.substring(valueIdx);
                        hoursOffset = hoursOffset.substring(0, valueIdx);
                    }

                    hoursOffset = parseInt(hoursOffset, 10);
                    if (outOfRange(hoursOffset, -12, 13)) {
                        return null;
                    }

                    if (count > 2) {
                        minutesOffset = parseInt(minutesOffset, 10);
                        if (isNaN(minutesOffset) || outOfRange(minutesOffset, 0, 59)) {
                            return null;
                        }
                    }
                } else if (ch === "'") {
                    literal = true;
                    checkLiteral();
                } else if (!checkLiteral()) {
                    return null;
                }
            }
        }

        hasTime = hours !== null || minutes !== null || seconds || null;

        if (year === null && month === null && day === null && hasTime) {
            year = defaultYear;
            month = date.getMonth();
            day = date.getDate();
        } else {
            if (year === null) {
                year = defaultYear;
            }

            if (day === null) {
                day = 1;
            }
        }

        if (pmHour && hours < 12) {
            hours += 12;
        }

        if (UTC) {
            if (hoursOffset) {
                hours += -hoursOffset;
            }

            if (minutesOffset) {
                minutes += -minutesOffset;
            }

            value = new Date(Date.UTC(year, month, day, hours, minutes, seconds, milliseconds));
        } else {
            value = new Date(year, month, day, hours, minutes, seconds, milliseconds);
            adjustDST(value, hours);
        }

        if (year < 100) {
            value.setFullYear(year);
        }

        if (value.getDate() !== day && UTC === undefined) {
            return null;
        }

        return value;
    }

    function parseMicrosoftFormatOffset(offset) {
        var sign = offset.substr(0, 1) === "-" ? -1 : 1;

        offset = offset.substring(1);
        offset = (parseInt(offset.substr(0, 2), 10) * 60) + parseInt(offset.substring(2), 10);

        return sign * offset;
    }

    kendo.parseDate = function(value, formats, culture) {
        if (objectToString.call(value) === "[object Date]") {
            return value;
        }

        var idx = 0;
        var date = null;
        var length, patterns;
        var tzoffset;
        var sign;

        if (value && value.indexOf("/D") === 0) {
            date = dateRegExp.exec(value);
            if (date) {
                date = date[1];
                tzoffset = offsetRegExp.exec(date.substring(1));

                date = new Date(parseInt(date, 10));

                if (tzoffset) {
                    tzoffset = parseMicrosoftFormatOffset(tzoffset[0]);
                    date = kendo.timezone.apply(date, 0);
                    date = kendo.timezone.convert(date, 0, -1 * tzoffset);
                }

                return date;
            }
        }

        culture = kendo.getCulture(culture);

        if (!formats) {
            formats = [];
            patterns = culture.calendar.patterns;
            length = formatsSequence.length;

            for (; idx < length; idx++) {
                formats[idx] = patterns[formatsSequence[idx]];
            }

            idx = 0;

            formats = [
                "yyyy/MM/dd HH:mm:ss",
                "yyyy/MM/dd HH:mm",
                "yyyy/MM/dd",
                "ddd MMM dd yyyy HH:mm:ss",
                "yyyy-MM-ddTHH:mm:ss.fffffffzzz",
                "yyyy-MM-ddTHH:mm:ss.fffzzz",
                "yyyy-MM-ddTHH:mm:sszzz",
                "yyyy-MM-ddTHH:mm:ss.fffffff",
                "yyyy-MM-ddTHH:mm:ss.fff",
                "yyyy-MM-ddTHH:mmzzz",
                "yyyy-MM-ddTHH:mmzz",
                "yyyy-MM-ddTHH:mm:ss",
                "yyyy-MM-ddTHH:mm",
                "yyyy-MM-dd HH:mm:ss",
                "yyyy-MM-dd HH:mm",
                "yyyy-MM-dd",
                "HH:mm:ss",
                "HH:mm"
            ].concat(formats);
        }

        formats = isArray(formats) ? formats: [formats];
        length = formats.length;

        for (; idx < length; idx++) {
            date = parseExact(value, formats[idx], culture);
            if (date) {
                return date;
            }
        }

        return date;
    };

    kendo.parseInt = function(value, culture) {
        var result = kendo.parseFloat(value, culture);
        if (result) {
            result = result | 0;
        }
        return result;
    };

    kendo.parseFloat = function(value, culture, format) {
        if (!value && value !== 0) {
           return null;
        }

        if (typeof value === NUMBER) {
           return value;
        }

        value = value.toString();
        culture = kendo.getCulture(culture);

        var number = culture.numberFormat,
            percent = number.percent,
            currency = number.currency,
            symbol = currency.symbol,
            percentSymbol = percent.symbol,
            negative = value.indexOf("-"),
            parts, isPercent;

        //handle exponential number
        if (exponentRegExp.test(value)) {
            value = parseFloat(value.replace(number["."], "."));
            if (isNaN(value)) {
                value = null;
            }
            return value;
        }

        if (negative > 0) {
            return null;
        } else {
            negative = negative > -1;
        }

        if (value.indexOf(symbol) > -1 || (format && format.toLowerCase().indexOf("c") > -1)) {
            number = currency;
            parts = number.pattern[0].replace("$", symbol).split("n");
            if (value.indexOf(parts[0]) > -1 && value.indexOf(parts[1]) > -1) {
                value = value.replace(parts[0], "").replace(parts[1], "");
                negative = true;
            }
        } else if (value.indexOf(percentSymbol) > -1) {
            isPercent = true;
            number = percent;
            symbol = percentSymbol;
        }

        value = value.replace("-", "")
                     .replace(symbol, "")
                     .replace(nonBreakingSpaceRegExp, " ")
                     .split(number[","].replace(nonBreakingSpaceRegExp, " ")).join("")
                     .replace(number["."], ".");

        value = parseFloat(value);

        if (isNaN(value)) {
            value = null;
        } else if (negative) {
            value *= -1;
        }

        if (value && isPercent) {
            value /= 100;
        }

        return value;
    };

    if (globalize && !globalize.load) {
        kendo.parseDate = function (value, format, culture) {
            if (objectToString.call(value) === "[object Date]") {
                return value;
            }

            return globalize.parseDate(value, format, culture);
        };

        kendo.parseFloat = function (value, culture) {
            if (typeof value === NUMBER) {
                return value;
            }

            if (value === undefined || value === null) {
               return null;
            }

            if ($.isPlainObject(culture)) {
                culture = culture.name;
            }

            value = globalize.parseFloat(value, culture);

            return isNaN(value) ? null : value;
        };
    }
})();

    function getShadows(element) {
        var shadow = element.css(kendo.support.transitions.css + "box-shadow") || element.css("box-shadow"),
            radius = shadow ? shadow.match(boxShadowRegExp) || [ 0, 0, 0, 0, 0 ] : [ 0, 0, 0, 0, 0 ],
            blur = math.max((+radius[3]), +(radius[4] || 0));

        return {
            left: (-radius[1]) + blur,
            right: (+radius[1]) + blur,
            bottom: (+radius[2]) + blur
        };
    }

    function wrap(element, autosize) {
        var browser = support.browser,
            percentage,
            isRtl = element.css("direction") == "rtl";

        if (!element.parent().hasClass("k-animation-container")) {
            var shadows = getShadows(element),
                width = element[0].style.width,
                height = element[0].style.height,
                percentWidth = percentRegExp.test(width),
                percentHeight = percentRegExp.test(height);

            if (browser.opera) { // Box shadow can't be retrieved in Opera
                shadows.left = shadows.right = shadows.bottom = 5;
            }

            percentage = percentWidth || percentHeight;

            if (!percentWidth && (!autosize || (autosize && width))) { width = element.outerWidth(); }
            if (!percentHeight && (!autosize || (autosize && height))) { height = element.outerHeight(); }

            element.wrap(
                         $("<div/>")
                         .addClass("k-animation-container")
                         .css({
                             width: width,
                             height: height,
                             marginLeft: shadows.left * (isRtl ? 1 : -1),
                             paddingLeft: shadows.left,
                             paddingRight: shadows.right,
                             paddingBottom: shadows.bottom
                         }));

            if (percentage) {
                element.css({
                    width: "100%",
                    height: "100%",
                    boxSizing: "border-box",
                    mozBoxSizing: "border-box",
                    webkitBoxSizing: "border-box"
                });
            }
        } else {
            var wrapper = element.parent(".k-animation-container"),
                wrapperStyle = wrapper[0].style;

            if (wrapper.is(":hidden")) {
                wrapper.show();
            }

            percentage = percentRegExp.test(wrapperStyle.width) || percentRegExp.test(wrapperStyle.height);

            if (!percentage) {
                wrapper.css({
                    width: element.outerWidth(),
                    height: element.outerHeight(),
                    boxSizing: "content-box",
                    mozBoxSizing: "content-box",
                    webkitBoxSizing: "content-box"
                });
            }
        }

        if (browser.msie && math.floor(browser.version) <= 7) {
            element.css({ zoom: 1 });
            element.children(".k-menu").width(element.width());
        }

        return element.parent();
    }

    function deepExtend(destination) {
        var i = 1,
            length = arguments.length;

        for (i = 1; i < length; i++) {
            deepExtendOne(destination, arguments[i]);
        }

        return destination;
    }

    function deepExtendOne(destination, source) {
        var ObservableArray = kendo.data.ObservableArray,
            LazyObservableArray = kendo.data.LazyObservableArray,
            DataSource = kendo.data.DataSource,
            HierarchicalDataSource = kendo.data.HierarchicalDataSource,
            property,
            propValue,
            propType,
            propInit,
            destProp;

        for (property in source) {
            propValue = source[property];
            propType = typeof propValue;

            if (propType === OBJECT && propValue !== null) {
                propInit = propValue.constructor;
            } else {
                propInit = null;
            }

            if (propInit &&
                propInit !== Array && propInit !== ObservableArray && propInit !== LazyObservableArray &&
                propInit !== DataSource && propInit !== HierarchicalDataSource) {

                if (propValue instanceof Date) {
                    destination[property] = new Date(propValue.getTime());
                } else if (isFunction(propValue.clone)) {
                    destination[property] = propValue.clone();
                } else {
                    destProp = destination[property];
                    if (typeof (destProp) === OBJECT) {
                        destination[property] = destProp || {};
                    } else {
                        destination[property] = {};
                    }
                    deepExtendOne(destination[property], propValue);
                }
            } else if (propType !== UNDEFINED) {
                destination[property] = propValue;
            }
        }

        return destination;
    }

    function testRx(agent, rxs, dflt) {
        for (var rx in rxs) {
            if (rxs.hasOwnProperty(rx) && rxs[rx].test(agent)) {
                return rx;
            }
        }
        return dflt !== undefined ? dflt : agent;
    }

    function toHyphens(str) {
        return str.replace(/([a-z][A-Z])/g, function (g) {
            return g.charAt(0) + '-' + g.charAt(1).toLowerCase();
        });
    }

    function toCamelCase(str) {
        return str.replace(/\-(\w)/g, function (strMatch, g1) {
            return g1.toUpperCase();
        });
    }

    function getComputedStyles(element, properties) {
        var styles = {}, computedStyle;

        if (document.defaultView && document.defaultView.getComputedStyle) {
            computedStyle = document.defaultView.getComputedStyle(element, "");

            if (properties) {
                $.each(properties, function(idx, value) {
                    styles[value] = computedStyle.getPropertyValue(value);
                });
            }
        } else {
            computedStyle = element.currentStyle;

            if (properties) {
                $.each(properties, function(idx, value) {
                    styles[value] = computedStyle[toCamelCase(value)];
                });
            }
        }

        if (!kendo.size(styles)) {
            styles = computedStyle;
        }

        return styles;
    }

    (function () {
        support._scrollbar = undefined;

        support.scrollbar = function (refresh) {
            if (!isNaN(support._scrollbar) && !refresh) {
                return support._scrollbar;
            } else {
                var div = document.createElement("div"),
                    result;

                div.style.cssText = "overflow:scroll;overflow-x:hidden;zoom:1;clear:both;display:block";
                div.innerHTML = "&nbsp;";
                document.body.appendChild(div);

                support._scrollbar = result = div.offsetWidth - div.scrollWidth;

                document.body.removeChild(div);

                return result;
            }
        };

        support.isRtl = function(element) {
            return $(element).closest(".k-rtl").length > 0;
        };

        var table = document.createElement("table");

        // Internet Explorer does not support setting the innerHTML of TBODY and TABLE elements
        try {
            table.innerHTML = "<tr><td></td></tr>";

            support.tbodyInnerHtml = true;
        } catch (e) {
            support.tbodyInnerHtml = false;
        }

        support.touch = "ontouchstart" in window;
        support.msPointers = window.MSPointerEvent;
        support.pointers = window.PointerEvent;

        var transitions = support.transitions = false,
            transforms = support.transforms = false,
            elementProto = "HTMLElement" in window ? HTMLElement.prototype : [];

        support.hasHW3D = ("WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix()) || "MozPerspective" in document.documentElement.style || "msPerspective" in document.documentElement.style;

        each([ "Moz", "webkit", "O", "ms" ], function () {
            var prefix = this.toString(),
                hasTransitions = typeof table.style[prefix + "Transition"] === STRING;

            if (hasTransitions || typeof table.style[prefix + "Transform"] === STRING) {
                var lowPrefix = prefix.toLowerCase();

                transforms = {
                    css: (lowPrefix != "ms") ? "-" + lowPrefix + "-" : "",
                    prefix: prefix,
                    event: (lowPrefix === "o" || lowPrefix === "webkit") ? lowPrefix : ""
                };

                if (hasTransitions) {
                    transitions = transforms;
                    transitions.event = transitions.event ? transitions.event + "TransitionEnd" : "transitionend";
                }

                return false;
            }
        });

        table = null;

        support.transforms = transforms;
        support.transitions = transitions;

        support.devicePixelRatio = window.devicePixelRatio === undefined ? 1 : window.devicePixelRatio;

        try {
            support.screenWidth = window.outerWidth || window.screen ? window.screen.availWidth : window.innerWidth;
            support.screenHeight = window.outerHeight || window.screen ? window.screen.availHeight : window.innerHeight;
        } catch(e) {
            //window.outerWidth throws error when in IE showModalDialog.
            support.screenWidth = window.screen.availWidth;
            support.screenHeight = window.screen.availHeight;
        }

        support.detectOS = function (ua) {
            var os = false, minorVersion, match = [],
                notAndroidPhone = !/mobile safari/i.test(ua),
                agentRxs = {
                    wp: /(Windows Phone(?: OS)?)\s(\d+)\.(\d+(\.\d+)?)/,
                    fire: /(Silk)\/(\d+)\.(\d+(\.\d+)?)/,
                    android: /(Android|Android.*(?:Opera|Firefox).*?\/)\s*(\d+)\.(\d+(\.\d+)?)/,
                    iphone: /(iPhone|iPod).*OS\s+(\d+)[\._]([\d\._]+)/,
                    ipad: /(iPad).*OS\s+(\d+)[\._]([\d_]+)/,
                    meego: /(MeeGo).+NokiaBrowser\/(\d+)\.([\d\._]+)/,
                    webos: /(webOS)\/(\d+)\.(\d+(\.\d+)?)/,
                    blackberry: /(BlackBerry|BB10).*?Version\/(\d+)\.(\d+(\.\d+)?)/,
                    playbook: /(PlayBook).*?Tablet\s*OS\s*(\d+)\.(\d+(\.\d+)?)/,
                    windows: /(MSIE)\s+(\d+)\.(\d+(\.\d+)?)/,
                    tizen: /(tizen).*?Version\/(\d+)\.(\d+(\.\d+)?)/i,
                    sailfish: /(sailfish).*rv:(\d+)\.(\d+(\.\d+)?).*firefox/i,
                    ffos: /(Mobile).*rv:(\d+)\.(\d+(\.\d+)?).*Firefox/
                },
                osRxs = {
                    ios: /^i(phone|pad|pod)$/i,
                    android: /^android|fire$/i,
                    blackberry: /^blackberry|playbook/i,
                    windows: /windows/,
                    wp: /wp/,
                    flat: /sailfish|ffos|tizen/i,
                    meego: /meego/
                },
                formFactorRxs = {
                    tablet: /playbook|ipad|fire/i
                },
                browserRxs = {
                    omini: /Opera\sMini/i,
                    omobile: /Opera\sMobi/i,
                    firefox: /Firefox|Fennec/i,
                    mobilesafari: /version\/.*safari/i,
                    ie: /MSIE|Windows\sPhone/i,
                    chrome: /chrome|crios/i,
                    webkit: /webkit/i
                };

            for (var agent in agentRxs) {
                if (agentRxs.hasOwnProperty(agent)) {
                    match = ua.match(agentRxs[agent]);
                    if (match) {
                        if (agent == "windows" && "plugins" in navigator) { return false; } // Break if not Metro/Mobile Windows

                        os = {};
                        os.device = agent;
                        os.tablet = testRx(agent, formFactorRxs, false);
                        os.browser = testRx(ua, browserRxs, "default");
                        os.name = testRx(agent, osRxs);
                        os[os.name] = true;
                        os.majorVersion = match[2];
                        os.minorVersion = match[3].replace("_", ".");
                        minorVersion = os.minorVersion.replace(".", "").substr(0, 2);
                        os.flatVersion = os.majorVersion + minorVersion + (new Array(3 - (minorVersion.length < 3 ? minorVersion.length : 2)).join("0"));
                        os.cordova = typeof window.PhoneGap !== UNDEFINED || typeof window.cordova !== UNDEFINED; // Use file protocol to detect appModes.
                        os.appMode = window.navigator.standalone || (/file|local|wmapp/).test(window.location.protocol) || os.cordova; // Use file protocol to detect appModes.

                        if (os.android && (support.devicePixelRatio < 1.5 && os.flatVersion < 400 || notAndroidPhone) && (support.screenWidth > 800 || support.screenHeight > 800)) {
                            os.tablet = agent;
                        }

                        break;
                    }
                }
            }
            return os;
        };

        var mobileOS = support.mobileOS = support.detectOS(navigator.userAgent);

        support.wpDevicePixelRatio = mobileOS.wp ? screen.width / 320 : 0;
        support.kineticScrollNeeded = mobileOS && (support.touch || support.msPointers || support.pointers);

        support.hasNativeScrolling = false;

        if (mobileOS.ios || (mobileOS.android && mobileOS.majorVersion > 2) || mobileOS.wp) {
            support.hasNativeScrolling = mobileOS;
        }

        support.mouseAndTouchPresent = support.touch && !(support.mobileOS.ios || support.mobileOS.android);

        support.detectBrowser = function(ua) {
            var browser = false, match = [],
                browserRxs = {
                    webkit: /(chrome)[ \/]([\w.]+)/i,
                    safari: /(webkit)[ \/]([\w.]+)/i,
                    opera: /(opera)(?:.*version|)[ \/]([\w.]+)/i,
                    msie: /(msie\s|trident.*? rv:)([\w.]+)/i,
                    mozilla: /(mozilla)(?:.*? rv:([\w.]+)|)/i
                };

            for (var agent in browserRxs) {
                if (browserRxs.hasOwnProperty(agent)) {
                    match = ua.match(browserRxs[agent]);
                    if (match) {
                        browser = {};
                        browser[agent] = true;
                        browser[match[1].toLowerCase().split(" ")[0].split("/")[0]] = true;
                        browser.version = parseInt(document.documentMode || match[2], 10);

                        break;
                    }
                }
            }

            return browser;
        };

        support.browser = support.detectBrowser(navigator.userAgent);

        support.zoomLevel = function() {
            try {
                return support.touch ? (document.documentElement.clientWidth / window.innerWidth) :
                       support.browser.msie && support.browser.version >= 10 ? ((top || window).document.documentElement.offsetWidth / (top || window).innerWidth) : 1;
            } catch(e) {
                return 1;
            }
        };

        support.cssBorderSpacing = typeof document.documentElement.style.borderSpacing != "undefined" && !(support.browser.msie && support.browser.version < 8);

        (function(browser) {
            // add browser-specific CSS class
            var cssClass = "",
                docElement = $(document.documentElement),
                majorVersion = parseInt(browser.version, 10);

            if (browser.msie) {
                cssClass = "ie";
            } else if (browser.mozilla) {
                cssClass = "ff";
            } else if (browser.safari) {
                cssClass = "safari";
            } else if (browser.webkit) {
                cssClass = "webkit";
            } else if (browser.opera) {
                cssClass = "opera";
            }

            if (cssClass) {
                cssClass = "k-" + cssClass + " k-" + cssClass + majorVersion;
            }
            if (support.mobileOS) {
                cssClass += " k-mobile";
            }

            docElement.addClass(cssClass);
        })(support.browser);

        support.eventCapture = document.documentElement.addEventListener;

        var input = document.createElement("input");

        support.placeholder = "placeholder" in input;
        support.propertyChangeEvent = "onpropertychange" in input;

        support.input = (function() {
            var types = ["number", "date", "time", "month", "week", "datetime", "datetime-local"];
            var length = types.length;
            var value = "test";
            var result = {};
            var idx = 0;
            var type;

            for (;idx < length; idx++) {
                type = types[idx];
                input.setAttribute("type", type);
                input.value = value;

                result[type.replace("-", "")] = input.type !== "text" && input.value !== value;
            }

            return result;
        })();

        input.style.cssText = "float:left;";

        support.cssFloat = !!input.style.cssFloat;

        input = null;

        support.stableSort = (function() {
            // Chrome sort is not stable for more than *10* items
            // IE9+ sort is not stable for than *512* items
            var threshold = 513;

            var sorted = [{
                index: 0,
                field: "b"
            }];

            for (var i = 1; i < threshold; i++) {
                sorted.push({
                    index: i,
                    field: "a"
                });
            }

            sorted.sort(function(a, b) {
                return a.field > b.field ? 1 : (a.field < b.field ? -1 : 0);
            });

            return sorted[0].index === 1;
        })();

        support.matchesSelector = elementProto.webkitMatchesSelector || elementProto.mozMatchesSelector ||
                                  elementProto.msMatchesSelector || elementProto.oMatchesSelector ||
                                  elementProto.matchesSelector || elementProto.matches ||
          function( selector ) {
              var nodeList = document.querySelectorAll ? ( this.parentNode || document ).querySelectorAll( selector ) || [] : $(selector),
                  i = nodeList.length;

              while (i--) {
                  if (nodeList[i] == this) {
                      return true;
                  }
              }

              return false;
          };

        support.pushState = window.history && window.history.pushState;

        var documentMode = document.documentMode;

        support.hashChange = ("onhashchange" in window) && !(support.browser.msie && (!documentMode || documentMode <= 8)); // old IE detection
    })();


    function size(obj) {
        var result = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key) && key != "toJSON") { // Ignore fake IE7 toJSON.
                result++;
            }
        }

        return result;
    }

    function getOffset(element, type, positioned) {
        if (!type) {
            type = "offset";
        }

        var result = element[type](),
            mobileOS = support.mobileOS;

        // IE10 touch zoom is living in a separate viewport
        if (support.browser.msie && (support.pointers || support.msPointers) && !positioned) {
            result.top -= (window.pageYOffset - document.documentElement.scrollTop);
            result.left -= (window.pageXOffset - document.documentElement.scrollLeft);
        }

        return result;
    }

    var directions = {
        left: { reverse: "right" },
        right: { reverse: "left" },
        down: { reverse: "up" },
        up: { reverse: "down" },
        top: { reverse: "bottom" },
        bottom: { reverse: "top" },
        "in": { reverse: "out" },
        out: { reverse: "in" }
    };

    function parseEffects(input) {
        var effects = {};

        each((typeof input === "string" ? input.split(" ") : input), function(idx) {
            effects[idx] = this;
        });

        return effects;
    }

    function fx(element) {
        return new kendo.effects.Element(element);
    }

    var effects = {};

    $.extend(effects, {
        enabled: true,
        Element: function(element) {
            this.element = $(element);
        },

        promise: function(element, options) {
            if (!element.is(":visible")) {
                element.css({ display: element.data("olddisplay") || "block" }).css("display");
            }

            if (options.hide) {
                element.data("olddisplay", element.css("display")).hide();
            }

            if (options.init) {
                options.init();
            }

            if (options.completeCallback) {
                options.completeCallback(element); // call the external complete callback with the element
            }

            element.dequeue();
        },

        disable: function() {
            this.enabled = false;
            this.promise = this.promiseShim;
        },

        enable: function() {
            this.enabled = true;
            this.promise = this.animatedPromise;
        }
    });

    effects.promiseShim = effects.promise;

    function prepareAnimationOptions(options, duration, reverse, complete) {
        if (typeof options === STRING) {
            // options is the list of effect names separated by space e.g. animate(element, "fadeIn slideDown")

            // only callback is provided e.g. animate(element, options, function() {});
            if (isFunction(duration)) {
                complete = duration;
                duration = 400;
                reverse = false;
            }

            if (isFunction(reverse)) {
                complete = reverse;
                reverse = false;
            }

            if (typeof duration === BOOLEAN){
                reverse = duration;
                duration = 400;
            }

            options = {
                effects: options,
                duration: duration,
                reverse: reverse,
                complete: complete
            };
        }

        return extend({
            //default options
            effects: {},
            duration: 400, //jQuery default duration
            reverse: false,
            init: noop,
            teardown: noop,
            hide: false
        }, options, { completeCallback: options.complete, complete: noop }); // Move external complete callback, so deferred.resolve can be always executed.

    }

    function animate(element, options, duration, reverse, complete) {
        var idx = 0,
            length = element.length,
            instance;

        for (; idx < length; idx ++) {
            instance = $(element[idx]);
            instance.queue(function() {
                effects.promise(instance, prepareAnimationOptions(options, duration, reverse, complete));
            });
        }

        return element;
    }

    function toggleClass(element, classes, options, add) {
        if (classes) {
            classes = classes.split(" ");

            each(classes, function(idx, value) {
                element.toggleClass(value, add);
            });
        }

        return element;
    }

    if (!("kendoAnimate" in $.fn)) {
        extend($.fn, {
            kendoStop: function(clearQueue, gotoEnd) {
                return this.stop(clearQueue, gotoEnd);
            },

            kendoAnimate: function(options, duration, reverse, complete) {
                return animate(this, options, duration, reverse, complete);
            },

            kendoAddClass: function(classes, options){
                return kendo.toggleClass(this, classes, options, true);
            },

            kendoRemoveClass: function(classes, options){
                return kendo.toggleClass(this, classes, options, false);
            },
            kendoToggleClass: function(classes, options, toggle){
                return kendo.toggleClass(this, classes, options, toggle);
            }
        });
    }

    var ampRegExp = /&/g,
        ltRegExp = /</g,
        quoteRegExp = /"/g,
        aposRegExp = /'/g,
        gtRegExp = />/g;
    function htmlEncode(value) {
        return ("" + value).replace(ampRegExp, "&amp;").replace(ltRegExp, "&lt;").replace(gtRegExp, "&gt;").replace(quoteRegExp, "&quot;").replace(aposRegExp, "&#39;");
    }

    var eventTarget = function (e) {
        return e.target;
    };

    if (support.touch) {

        eventTarget = function(e) {
            var touches = "originalEvent" in e ? e.originalEvent.changedTouches : "changedTouches" in e ? e.changedTouches : null;

            return touches ? document.elementFromPoint(touches[0].clientX, touches[0].clientY) : e.target;
        };

        each(["swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown", "doubleTap", "tap"], function(m, value) {
            $.fn[value] = function(callback) {
                return this.bind(value, callback);
            };
        });
    }

    if (support.touch) {
        if (!support.mobileOS) {
            support.mousedown = "mousedown touchstart";
            support.mouseup = "mouseup touchend";
            support.mousemove = "mousemove touchmove";
            support.mousecancel = "mouseleave touchcancel";
            support.click = "click";
            support.resize = "resize";
        } else {
            support.mousedown = "touchstart";
            support.mouseup = "touchend";
            support.mousemove = "touchmove";
            support.mousecancel = "touchcancel";
            support.click = "touchend";
            support.resize = "orientationchange";
        }
    } else if (support.pointers) {
        support.mousemove = "pointermove";
        support.mousedown = "pointerdown";
        support.mouseup = "pointerup";
        support.mousecancel = "pointercancel";
        support.click = "pointerup";
        support.resize = "orientationchange resize";
    } else if (support.msPointers) {
        support.mousemove = "MSPointerMove";
        support.mousedown = "MSPointerDown";
        support.mouseup = "MSPointerUp";
        support.mousecancel = "MSPointerCancel";
        support.click = "MSPointerUp";
        support.resize = "orientationchange resize";
    } else {
        support.mousemove = "mousemove";
        support.mousedown = "mousedown";
        support.mouseup = "mouseup";
        support.mousecancel = "mouseleave";
        support.click = "click";
        support.resize = "resize";
    }

    var wrapExpression = function(members, paramName) {
        var result = paramName || "d",
            index,
            idx,
            length,
            member,
            count = 1;

        for (idx = 0, length = members.length; idx < length; idx++) {
            member = members[idx];
            if (member !== "") {
                index = member.indexOf("[");

                if (index !== 0) {
                    if (index == -1) {
                        member = "." + member;
                    } else {
                        count++;
                        member = "." + member.substring(0, index) + " || {})" + member.substring(index);
                    }
                }

                count++;
                result += member + ((idx < length - 1) ? " || {})" : ")");
            }
        }
        return new Array(count).join("(") + result;
    },
    localUrlRe = /^([a-z]+:)?\/\//i;

    extend(kendo, {
        ui: kendo.ui || {},
        fx: kendo.fx || fx,
        effects: kendo.effects || effects,
        mobile: kendo.mobile || { },
        data: kendo.data || {},
        dataviz: kendo.dataviz || {},
        keys: {
            INSERT: 45,
            DELETE: 46,
            BACKSPACE: 8,
            TAB: 9,
            ENTER: 13,
            ESC: 27,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            END: 35,
            HOME: 36,
            SPACEBAR: 32,
            PAGEUP: 33,
            PAGEDOWN: 34,
            F2: 113,
            F10: 121,
            F12: 123,
            NUMPAD_PLUS: 107,
            NUMPAD_MINUS: 109,
            NUMPAD_DOT: 110
        },
        support: kendo.support || support,
        animate: kendo.animate || animate,
        ns: "",
        attr: function(value) {
            return "data-" + kendo.ns + value;
        },
        getShadows: getShadows,
        wrap: wrap,
        deepExtend: deepExtend,
        getComputedStyles: getComputedStyles,
        size: size,
        toCamelCase: toCamelCase,
        toHyphens: toHyphens,
        getOffset: kendo.getOffset || getOffset,
        parseEffects: kendo.parseEffects || parseEffects,
        toggleClass: kendo.toggleClass || toggleClass,
        directions: kendo.directions || directions,
        Observable: Observable,
        Class: Class,
        Template: Template,
        template: proxy(Template.compile, Template),
        render: proxy(Template.render, Template),
        stringify: proxy(JSON.stringify, JSON),
        eventTarget: eventTarget,
        htmlEncode: htmlEncode,
        isLocalUrl: function(url) {
            return url && !localUrlRe.test(url);
        },

        expr: function(expression, safe, paramName) {
            expression = expression || "";

            if (typeof safe == STRING) {
                paramName = safe;
                safe = false;
            }

            paramName = paramName || "d";

            if (expression && expression.charAt(0) !== "[") {
                expression = "." + expression;
            }

            if (safe) {
                expression = wrapExpression(expression.split("."), paramName);
            } else {
                expression = paramName + expression;
            }

            return expression;
        },

        getter: function(expression, safe) {
            var key = expression + safe;
            return getterCache[key] = getterCache[key] || new Function("d", "return " + kendo.expr(expression, safe));
        },

        setter: function(expression) {
            return setterCache[expression] = setterCache[expression] || new Function("d,value", kendo.expr(expression) + "=value");
        },

        accessor: function(expression) {
            return {
                get: kendo.getter(expression),
                set: kendo.setter(expression)
            };
        },

        guid: function() {
            var id = "", i, random;

            for (i = 0; i < 32; i++) {
                random = math.random() * 16 | 0;

                if (i == 8 || i == 12 || i == 16 || i == 20) {
                    id += "-";
                }
                id += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
            }

            return id;
        },

        roleSelector: function(role) {
            return role.replace(/(\S+)/g, "[" + kendo.attr("role") + "=$1],").slice(0, -1);
        },

        directiveSelector: function(directives) {
            var selectors = directives.split(" ");

            if (selectors) {
                for (var i = 0; i < selectors.length; i++) {
                    if (selectors[i] != "view") {
                        selectors[i] = selectors[i].replace(/(\w*)(view|bar|strip|over)$/, "$1-$2");
                    }
                }
            }

            return selectors.join(" ").replace(/(\S+)/g, "kendo-mobile-$1,").slice(0, -1);
        },

        triggeredByInput: function(e) {
            return (/^(label|input|textarea|select)$/i).test(e.target.tagName);
        },

        logToConsole: function(message) {
            var console = window.console;

            if (!kendo.suppressLog && typeof(console) != "undefined" && console.log) {
                console.log(message);
            }
        }
    });

    var Widget = Observable.extend( {
        init: function(element, options) {
            var that = this;

            that.element = kendo.jQuery(element).handler(that);

            that.angular("init", options);

            Observable.fn.init.call(that);

            var dataSource = options ? options.dataSource : null;

            if (dataSource) {
                // avoid deep cloning the data source
                options = extend({}, options, { dataSource: {} });
            }

            options = that.options = extend(true, {}, that.options, options);

            if (dataSource) {
                options.dataSource = dataSource;
            }

            if (!that.element.attr(kendo.attr("role"))) {
                that.element.attr(kendo.attr("role"), (options.name || "").toLowerCase());
            }

            that.element.data("kendo" + options.prefix + options.name, that);

            that.bind(that.events, options);
        },

        events: [],

        options: {
            prefix: ""
        },

        _hasBindingTarget: function() {
            return !!this.element[0].kendoBindingTarget;
        },

        _tabindex: function(target) {
            target = target || this.wrapper;

            var element = this.element,
                TABINDEX = "tabindex",
                tabindex = target.attr(TABINDEX) || element.attr(TABINDEX);

            element.removeAttr(TABINDEX);

            target.attr(TABINDEX, !isNaN(tabindex) ? tabindex : 0);
        },

        setOptions: function(options) {
            this._setEvents(options);
            $.extend(this.options, options);
        },

        _setEvents: function(options) {
            var that = this,
                idx = 0,
                length = that.events.length,
                e;

            for (; idx < length; idx ++) {
                e = that.events[idx];
                if (that.options[e] && options[e]) {
                    that.unbind(e, that.options[e]);
                }
            }

            that.bind(that.events, options);
        },

        resize: function(force) {
            var size = this.getSize(),
                currentSize = this._size;

            if (force || !currentSize || size.width !== currentSize.width || size.height !== currentSize.height) {
                this._size = size;
                this._resize(size);
                this.trigger("resize", size);
            }
        },

        getSize: function() {
            return kendo.dimensions(this.element);
        },

        size: function(size) {
            if (!size) {
                return this.getSize();
            } else {
                this.setSize(size);
            }
        },

        setSize: $.noop,
        _resize: $.noop,

        destroy: function() {
            var that = this;

            that.element.removeData("kendo" + that.options.prefix + that.options.name);
            that.element.removeData("handler");
            that.unbind();
        },

        angular: function(){}
    });

    var DataBoundWidget = Widget.extend({
        // Angular consumes these.
        dataItems: function() {
            return this.dataSource.flatView();
        },

        _angularItems: function(cmd) {
            var that = this;
            that.angular(cmd, function(){
                return {
                    elements: that.items(),
                    data: $.map(that.dataItems(), function(dataItem){
                        return { dataItem: dataItem };
                    })
                };
            });
        }
    });

    kendo.dimensions = function(element, dimensions) {
        var domElement = element[0];

        if (dimensions) {
            element.css(dimensions);
        }

        return { width: domElement.offsetWidth, height: domElement.offsetHeight };
    };

    kendo.notify = noop;

    var templateRegExp = /template$/i,
        jsonRegExp = /^\s*(?:\{(?:.|\r\n|\n)*\}|\[(?:.|\r\n|\n)*\])\s*$/,
        jsonFormatRegExp = /^\{(\d+)(:[^\}]+)?\}|^\[[A-Za-z_]*\]$/,
        dashRegExp = /([A-Z])/g;

    function parseOption(element, option) {
        var value;

        if (option.indexOf("data") === 0) {
            option = option.substring(4);
            option = option.charAt(0).toLowerCase() + option.substring(1);
        }

        option = option.replace(dashRegExp, "-$1");
        value = element.getAttribute("data-" + kendo.ns + option);

        if (value === null) {
            value = undefined;
        } else if (value === "null") {
            value = null;
        } else if (value === "true") {
            value = true;
        } else if (value === "false") {
            value = false;
        } else if (numberRegExp.test(value)) {
            value = parseFloat(value);
        } else if (jsonRegExp.test(value) && !jsonFormatRegExp.test(value)) {
            value = new Function("return (" + value + ")")();
        }

        return value;
    }

    function parseOptions(element, options) {
        var result = {},
            option,
            value;

        for (option in options) {
            value = parseOption(element, option);

            if (value !== undefined) {

                if (templateRegExp.test(option)) {
                    value = kendo.template($("#" + value).html());
                }

                result[option] = value;
            }
        }

        return result;
    }

    kendo.initWidget = function(element, options, roles) {
        var result,
            option,
            widget,
            idx,
            length,
            role,
            value,
            dataSource,
            fullPath,
            widgetKeyRegExp;

        // Preserve backwards compatibility with (element, options, namespace) signature, where namespace was kendo.ui
        if (!roles) {
            roles = kendo.ui.roles;
        } else if (roles.roles) {
            roles = roles.roles;
        }

        element = element.nodeType ? element : element[0];

        role = element.getAttribute("data-" + kendo.ns + "role");

        if (!role) {
            return;
        }

        fullPath = role.indexOf(".") === -1;

        // look for any widget that may be already instantiated based on this role.
        // The prefix used is unknown, hence the regexp
        //

        if (fullPath) {
            widget = roles[role];
        } else { // full namespace path - like kendo.ui.Widget
            widget = kendo.getter(role)(window);
        }

        var data = $(element).data(),
            widgetKey = widget ? "kendo" + widget.fn.options.prefix + widget.fn.options.name : "";

        if (fullPath) {
            widgetKeyRegExp = new RegExp("^kendo.*" + role + "$", "i");
        } else { // full namespace path - like kendo.ui.Widget
            widgetKeyRegExp = new RegExp("^" + widgetKey + "$", "i");
        }

        for(var key in data) {
            if (key.match(widgetKeyRegExp)) {
                // we have detected a widget of the same kind - save its reference, we will set its options
                if (key === widgetKey) {
                    result = data[key];
                } else {
                    return data[key];
                }
            }
        }

        if (!widget) {
            return;
        }

        dataSource = parseOption(element, "dataSource");

        options = $.extend({}, parseOptions(element, widget.fn.options), options);

        if (dataSource) {
            if (typeof dataSource === STRING) {
                options.dataSource = kendo.getter(dataSource)(window);
            } else {
                options.dataSource = dataSource;
            }
        }

        for (idx = 0, length = widget.fn.events.length; idx < length; idx++) {
            option = widget.fn.events[idx];

            value = parseOption(element, option);

            if (value !== undefined) {
                options[option] = kendo.getter(value)(window);
            }
        }

        if (!result) {
            result = new widget(element, options);
        } else {
            result.setOptions(options);
        }

        return result;
    };

    kendo.rolesFromNamespaces = function(namespaces) {
        var roles = [],
            idx,
            length;

        if (!namespaces[0]) {
            namespaces = [kendo.ui, kendo.dataviz.ui];
        }

        for (idx = 0, length = namespaces.length; idx < length; idx ++) {
            roles[idx] = namespaces[idx].roles;
        }

        return extend.apply(null, [{}].concat(roles.reverse()));
    };

    kendo.init = function(element) {
        var roles = kendo.rolesFromNamespaces(slice.call(arguments, 1));

        $(element).find("[data-" + kendo.ns + "role]").addBack().each(function(){
            kendo.initWidget(this, {}, roles);
        });
    };

    kendo.destroy = function(element) {
        $(element).find("[data-" + kendo.ns + "role]").addBack().each(function(){
            var data = $(this).data();

            for (var key in data) {
                if (key.indexOf("kendo") === 0 && typeof data[key].destroy === FUNCTION) {
                    data[key].destroy();
                }
            }
        });
    };

    function containmentComparer(a, b) {
        return $.contains(a, b) ? -1 : 1;
    }

    function resizableWidget() {
        var widget = $(this);
        return ($.inArray(widget.attr("data-" + kendo.ns + "role"), ["slider", "rangeslider"]) > -1) || widget.is(":visible");
    }

    kendo.resize = function(element, force) {
        var widgets = $(element).find("[data-" + kendo.ns + "role]").addBack().filter(resizableWidget);

        if (!widgets.length) {
            return;
        }

        // sort widgets based on their parent-child relation
        var widgetsArray = $.makeArray(widgets);
        widgetsArray.sort(containmentComparer);

        // resize widgets
        $.each(widgetsArray, function () {
            var widget = kendo.widgetInstance($(this));
            if (widget) {
                widget.resize(force);
            }
        });
    };

    kendo.parseOptions = parseOptions;

    extend(kendo.ui, {
        Widget: Widget,
        DataBoundWidget: DataBoundWidget,
        roles: {},
        progress: function(container, toggle) {
            var mask = container.find(".k-loading-mask"),
                support = kendo.support,
                browser = support.browser,
                isRtl, leftRight, webkitCorrection, containerScrollLeft;

            if (toggle) {
                if (!mask.length) {
                    isRtl = support.isRtl(container);
                    leftRight = isRtl ? "right" : "left";
                    containerScrollLeft = container.scrollLeft();
                    webkitCorrection = browser.webkit ? (!isRtl ? 0 : container[0].scrollWidth - container.width() - 2 * containerScrollLeft) : 0;

                    mask = $("<div class='k-loading-mask'><span class='k-loading-text'>Loading...</span><div class='k-loading-image'/><div class='k-loading-color'/></div>")
                        .width("100%").height("100%")
                        .css("top", container.scrollTop())
                        .css(leftRight, Math.abs(containerScrollLeft) + webkitCorrection)
                        .prependTo(container);
                }
            } else if (mask) {
                mask.remove();
            }
        },
        plugin: function(widget, register, prefix) {
            var name = widget.fn.options.name,
                getter;

            register = register || kendo.ui;
            prefix = prefix || "";

            register[name] = widget;

            register.roles[name.toLowerCase()] = widget;

            getter = "getKendo" + prefix + name;
            name = "kendo" + prefix + name;

            $.fn[name] = function(options) {
                var value = this,
                    args;

                if (typeof options === STRING) {
                    args = slice.call(arguments, 1);

                    this.each(function(){
                        var widget = $.data(this, name),
                            method,
                            result;

                        if (!widget) {
                            throw new Error(kendo.format("Cannot call method '{0}' of {1} before it is initialized", options, name));
                        }

                        method = widget[options];

                        if (typeof method !== FUNCTION) {
                            throw new Error(kendo.format("Cannot find method '{0}' of {1}", options, name));
                        }

                        result = method.apply(widget, args);

                        if (result !== undefined) {
                            value = result;
                            return false;
                        }
                    });
                } else {
                    this.each(function() {
                        new widget(this, options);
                    });
                }

                return value;
            };

            $.fn[name].widget = widget;

            $.fn[getter] = function() {
                return this.data(name);
            };
        }
    });

    var ContainerNullObject = { bind: function () { return this; }, nullObject: true, options: {} };

    var MobileWidget = Widget.extend({
        init: function(element, options) {
            Widget.fn.init.call(this, element, options);
            this.element.autoApplyNS();
            this.wrapper = this.element;
            this.element.addClass("km-widget");
        },

        destroy: function() {
            Widget.fn.destroy.call(this);
            this.element.kendoDestroy();
        },

        options: {
            prefix: "Mobile"
        },

        events: [],

        view: function() {
            var viewElement = this.element.closest(kendo.roleSelector("view splitview modalview drawer"));
            return kendo.widgetInstance(viewElement, kendo.mobile.ui) || ContainerNullObject;
        },

        viewHasNativeScrolling: function() {
            var view = this.view();
            return view && view.options.useNativeScrolling;
        },

        container: function() {
            var element = this.element.closest(kendo.roleSelector("view layout modalview drawer splitview"));
            return kendo.widgetInstance(element.eq(0), kendo.mobile.ui) || ContainerNullObject;
        }
    });

    extend(kendo.mobile, {
        init: function(element) {
            kendo.init(element, kendo.mobile.ui, kendo.ui, kendo.dataviz.ui);
        },

        appLevelNativeScrolling: function() {
            return kendo.mobile.application && kendo.mobile.application.options && kendo.mobile.application.options.useNativeScrolling;
        },

        roles: {},

        ui: {
            Widget: MobileWidget,
            DataBoundWidget: DataBoundWidget.extend(MobileWidget.prototype),
            roles: {},
            plugin: function(widget) {
                kendo.ui.plugin(widget, kendo.mobile.ui, "Mobile");
            }
        }
    });

    deepExtend(kendo.dataviz, {
        init: function(element) {
            kendo.init(element, kendo.dataviz.ui);
        },
        ui: {
            roles: {},
            themes: {},
            views: [],
            plugin: function(widget) {
                kendo.ui.plugin(widget, kendo.dataviz.ui);
            }
        },
        roles: {}
    });

    kendo.touchScroller = function(elements, options) {
        // return the first touch scroller
        return $(elements).map(function(idx, element) {
            element = $(element);
            if (support.kineticScrollNeeded && kendo.mobile.ui.Scroller && !element.data("kendoMobileScroller")) {
                element.kendoMobileScroller(options);
                return element.data("kendoMobileScroller");
            } else {
                return false;
            }
        })[0];
    };

    kendo.preventDefault = function(e) {
        e.preventDefault();
    };

    kendo.widgetInstance = function(element, suites) {
        var role = element.data(kendo.ns + "role"),
            widgets = [], i, length;

        if (role) {
            // HACK!!! mobile view scroller widgets are instantiated on data-role="content" elements. We need to discover them when resizing.
            if (role === "content") {
                role = "scroller";
            }

            if (suites) {
                if (suites[0]) {
                    for (i = 0, length = suites.length; i < length; i ++) {
                        widgets.push(suites[i].roles[role]);
                    }
                } else {
                    widgets.push(suites.roles[role]);
                }
            }
            else {
                widgets = [ kendo.ui.roles[role], kendo.dataviz.ui.roles[role],  kendo.mobile.ui.roles[role] ];
            }

            if (role.indexOf(".") >= 0) {
                widgets = [ kendo.getter(role)(window) ];
            }

            for (i = 0, length = widgets.length; i < length; i ++) {
                var widget = widgets[i];
                if (widget) {
                    var instance = element.data("kendo" + widget.fn.options.prefix + widget.fn.options.name);
                    if (instance) {
                        return instance;
                    }
                }
            }
        }
    };

    kendo.onResize = function(callback) {
        var handler = callback;
        if (support.mobileOS.android) {
            handler = function() { setTimeout(callback, 600); };
        }

        $(window).on(support.resize, handler);
        return handler;
    };

    kendo.unbindResize = function(callback) {
        $(window).off(support.resize, callback);
    };

    kendo.attrValue = function(element, key) {
        return element.data(kendo.ns + key);
    };

    kendo.days = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6
    };

    function focusable(element, isTabIndexNotNaN) {
        var nodeName = element.nodeName.toLowerCase();

        return (/input|select|textarea|button|object/.test(nodeName) ?
                !element.disabled :
                "a" === nodeName ?
                element.href || isTabIndexNotNaN :
                isTabIndexNotNaN
               ) &&
            visible(element);
    }

    function visible(element) {
        return !$(element).parents().addBack().filter(function() {
            return $.css(this,"visibility") === "hidden" || $.expr.filters.hidden(this);
        }).length;
    }

    $.extend($.expr[ ":" ], {
        kendoFocusable: function(element) {
            var idx = $.attr(element, "tabindex");
            return focusable(element, !isNaN(idx) && idx > -1);
        }
    });

    var MOUSE_EVENTS = ["mousedown", "mousemove", "mouseenter", "mouseleave", "mouseover", "mouseout", "mouseup", "click"];
    var EXCLUDE_BUST_CLICK_SELECTOR = "label, input, [data-rel=external]";

    var MouseEventNormalizer = {
        setupMouseMute: function() {
            var idx = 0,
                length = MOUSE_EVENTS.length,
                element = document.documentElement;

            if (MouseEventNormalizer.mouseTrap || !support.eventCapture) {
                return;
            }

            MouseEventNormalizer.mouseTrap = true;

            MouseEventNormalizer.bustClick = false;
            MouseEventNormalizer.captureMouse = false;

            var handler = function(e) {
                if (MouseEventNormalizer.captureMouse) {
                    if (e.type === "click") {
                        if (MouseEventNormalizer.bustClick && !$(e.target).is(EXCLUDE_BUST_CLICK_SELECTOR)) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    } else {
                        e.stopPropagation();
                    }
                }
            };

            for (; idx < length; idx++) {
                element.addEventListener(MOUSE_EVENTS[idx], handler, true);
            }
        },

        muteMouse: function(e) {
            MouseEventNormalizer.captureMouse = true;
            if (e.data.bustClick) {
                MouseEventNormalizer.bustClick = true;
            }
            clearTimeout(MouseEventNormalizer.mouseTrapTimeoutID);
        },

        unMuteMouse: function() {
            clearTimeout(MouseEventNormalizer.mouseTrapTimeoutID);
            MouseEventNormalizer.mouseTrapTimeoutID = setTimeout(function() {
                MouseEventNormalizer.captureMouse = false;
                MouseEventNormalizer.bustClick = false;
            }, 400);
        }
    };

    var eventMap = {
        down: "touchstart mousedown",
        move: "mousemove touchmove",
        up: "mouseup touchend touchcancel",
        cancel: "mouseleave touchcancel"
    };

    if (support.touch && (support.mobileOS.ios || support.mobileOS.android)) {
        eventMap = {
            down: "touchstart",
            move: "touchmove",
            up: "touchend touchcancel",
            cancel: "touchcancel"
        };
    } else if (support.pointers) {
        eventMap = {
            down: "pointerdown",
            move: "pointermove",
            up: "pointerup",
            cancel: "pointercancel pointerleave"
        };
    } else if (support.msPointers) {
        eventMap = {
            down: "MSPointerDown",
            move: "MSPointerMove",
            up: "MSPointerUp",
            cancel: "MSPointerCancel MSPointerLeave"
        };
    }

    if (support.msPointers && !("onmspointerenter" in window)) { // IE10
        // Create MSPointerEnter/MSPointerLeave events using mouseover/out and event-time checks
        $.each({
            MSPointerEnter: "MSPointerOver",
            MSPointerLeave: "MSPointerOut"
        }, function( orig, fix ) {
            $.event.special[ orig ] = {
                delegateType: fix,
                bindType: fix,

                handle: function( event ) {
                    var ret,
                        target = this,
                        related = event.relatedTarget,
                        handleObj = event.handleObj;

                    // For mousenter/leave call the handler if related is outside the target.
                    // NB: No relatedTarget if the mouse left/entered the browser window
                    if ( !related || (related !== target && !$.contains( target, related )) ) {
                        event.type = handleObj.origType;
                        ret = handleObj.handler.apply( this, arguments );
                        event.type = fix;
                    }
                    return ret;
                }
            };
        });
    }


    var getEventMap = function(e) { return (eventMap[e] || e); },
        eventRegEx = /([^ ]+)/g;

    kendo.applyEventMap = function(events, ns) {
        events = events.replace(eventRegEx, getEventMap);

        if (ns) {
            events = events.replace(eventRegEx, "$1." + ns);
        }

        return events;
    };

    var on = $.fn.on;

    function kendoJQuery(selector, context) {
        return new kendoJQuery.fn.init(selector, context);
    }

    extend(true, kendoJQuery, $);

    kendoJQuery.fn = kendoJQuery.prototype = new $();

    kendoJQuery.fn.constructor = kendoJQuery;

    kendoJQuery.fn.init = function(selector, context) {
        if (context && context instanceof $ && !(context instanceof kendoJQuery)) {
            context = kendoJQuery(context);
        }

        return $.fn.init.call(this, selector, context, rootjQuery);
    };

    kendoJQuery.fn.init.prototype = kendoJQuery.fn;

    var rootjQuery = kendoJQuery(document);

    extend(kendoJQuery.fn, {
        handler: function(handler) {
            this.data("handler", handler);
            return this;
        },

        autoApplyNS: function(ns) {
            this.data("kendoNS", ns || kendo.guid());
            return this;
        },

        on: function() {
            var that = this,
                ns = that.data("kendoNS");

            // support for event map signature
            if (arguments.length === 1) {
                return on.call(that, arguments[0]);
            }

            var context = that,
                args = slice.call(arguments);

            if (typeof args[args.length -1] === UNDEFINED) {
                args.pop();
            }

            var callback =  args[args.length - 1],
                events = kendo.applyEventMap(args[0], ns);

            // setup mouse trap
            if (support.mouseAndTouchPresent && events.search(/mouse|click/) > -1 && this[0] !== document.documentElement) {
                MouseEventNormalizer.setupMouseMute();

                var selector = args.length === 2 ? null : args[1],
                    bustClick = events.indexOf("click") > -1 && events.indexOf("touchend") > -1;

                on.call(this,
                    {
                        touchstart: MouseEventNormalizer.muteMouse,
                        touchend: MouseEventNormalizer.unMuteMouse
                    },
                    selector,
                    {
                        bustClick: bustClick
                    });
            }

            if (typeof callback === STRING) {
                context = that.data("handler");
                callback = context[callback];

                args[args.length - 1] = function(e) {
                    callback.call(context, e);
                };
            }

            args[0] = events;

            on.apply(that, args);

            return that;
        },

        kendoDestroy: function(ns) {
            ns = ns || this.data("kendoNS");

            if (ns) {
                this.off("." + ns);
            }

            return this;
        }
    });

    kendo.jQuery = kendoJQuery;
    kendo.eventMap = eventMap;

    kendo.timezone = (function(){
        var months =  { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
        var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

        function ruleToDate(year, rule) {
            var date;
            var targetDay;
            var ourDay;
            var month = rule[3];
            var on = rule[4];
            var time = rule[5];
            var cache = rule[8];

            if (!cache) {
                rule[8] = cache = {};
            }

            if (cache[year]) {
                return cache[year];
            }

            if (!isNaN(on)) {
                date = new Date(Date.UTC(year, months[month], on, time[0], time[1], time[2], 0));
            } else if (on.indexOf("last") === 0) {
                date = new Date(Date.UTC(year, months[month] + 1, 1, time[0] - 24, time[1], time[2], 0));

                targetDay = days[on.substr(4, 3)];
                ourDay = date.getUTCDay();

                date.setUTCDate(date.getUTCDate() + targetDay - ourDay - (targetDay > ourDay ? 7 : 0));
            } else if (on.indexOf(">=") >= 0) {
                date = new Date(Date.UTC(year, months[month], on.substr(5), time[0], time[1], time[2], 0));

                targetDay = days[on.substr(0, 3)];
                ourDay = date.getUTCDay();

                date.setUTCDate(date.getUTCDate() + targetDay - ourDay + (targetDay < ourDay ? 7 : 0));
            }

            return cache[year] = date;
        }

        function findRule(utcTime, rules, zone) {
            rules = rules[zone];

            if (!rules) {
                var time = zone.split(":");
                var offset = 0;

                if (time.length > 1) {
                    offset = time[0] * 60 + Number(time[1]);
                }

                return [-1000000, 'max', '-', 'Jan', 1, [0, 0, 0], offset, '-'];
            }

            var year = new Date(utcTime).getUTCFullYear();

            rules = jQuery.grep(rules, function(rule) {
                var from = rule[0];
                var to = rule[1];

                return from <= year && (to >= year || (from == year && to == "only") || to == "max");
            });

            rules.push(utcTime);

            rules.sort(function(a, b) {
                if (typeof a != "number") {
                    a = Number(ruleToDate(year, a));
                }

                if (typeof b != "number") {
                    b = Number(ruleToDate(year, b));
                }

                return a - b;
            });

            var rule = rules[jQuery.inArray(utcTime, rules) - 1] || rules[rules.length - 1];

            return isNaN(rule) ? rule : null;
        }

        function findZone(utcTime, zones, timezone) {
            var zoneRules = zones[timezone];

            if (typeof zoneRules === "string") {
                zoneRules = zones[zoneRules];
            }

            if (!zoneRules) {
                throw new Error('Timezone "' + timezone + '" is either incorrect, or kendo.timezones.min.js is not included.');
            }

            for (var idx = zoneRules.length - 1; idx >= 0; idx--) {
                var until = zoneRules[idx][3];

                if (until && utcTime > until) {
                    break;
                }
            }

            var zone = zoneRules[idx + 1];

            if (!zone) {
                throw new Error('Timezone "' + timezone + '" not found on ' + utcTime + ".");
            }

            return zone;
        }

        function zoneAndRule(utcTime, zones, rules, timezone) {
            if (typeof utcTime != NUMBER) {
                utcTime = Date.UTC(utcTime.getFullYear(), utcTime.getMonth(),
                    utcTime.getDate(), utcTime.getHours(), utcTime.getMinutes(),
                    utcTime.getSeconds(), utcTime.getMilliseconds());
            }

            var zone = findZone(utcTime, zones, timezone);

            return {
                zone: zone,
                rule: findRule(utcTime, rules, zone[1])
            };
        }

        function offset(utcTime, timezone) {
            if (timezone == "Etc/UTC" || timezone == "Etc/GMT") {
                return 0;
            }

            var info = zoneAndRule(utcTime, this.zones, this.rules, timezone);
            var zone = info.zone;
            var rule = info.rule;

            return kendo.parseFloat(rule? zone[0] - rule[6] : zone[0]);
        }

        function abbr(utcTime, timezone) {
            var info = zoneAndRule(utcTime, this.zones, this.rules, timezone);
            var zone = info.zone;
            var rule = info.rule;

            var base = zone[2];

            if (base.indexOf("/") >= 0) {
                return base.split("/")[rule && +rule[6] ? 1 : 0];
            } else if (base.indexOf("%s") >= 0) {
                return base.replace("%s", (!rule || rule[7] == "-") ? '' : rule[7]);
            }

            return base;
        }

        function convert(date, fromOffset, toOffset) {
            if (typeof fromOffset == STRING) {
                fromOffset = this.offset(date, fromOffset);
            }

            if (typeof toOffset == STRING) {
                toOffset = this.offset(date, toOffset);
            }

            var fromLocalOffset = date.getTimezoneOffset();

            date = new Date(date.getTime() + (fromOffset - toOffset) * 60000);

            var toLocalOffset = date.getTimezoneOffset();

            return new Date(date.getTime() + (toLocalOffset - fromLocalOffset) * 60000);
        }

        function apply(date, timezone) {
           return this.convert(date, date.getTimezoneOffset(), timezone);
        }

        function remove(date, timezone) {
           return this.convert(date, timezone, date.getTimezoneOffset());
        }

        function toLocalDate(time) {
            return this.apply(new Date(time), "Etc/UTC");
        }

        return {
           zones: {},
           rules: {},
           offset: offset,
           convert: convert,
           apply: apply,
           remove: remove,
           abbr: abbr,
           toLocalDate: toLocalDate
        };
    })();

    kendo.date = (function(){
        var MS_PER_MINUTE = 60000,
            MS_PER_DAY = 86400000;

        function adjustDST(date, hours) {
            if (hours === 0 && date.getHours() === 23) {
                date.setHours(date.getHours() + 2);
                return true;
            }

            return false;
        }

        function setDayOfWeek(date, day, dir) {
            var hours = date.getHours();

            dir = dir || 1;
            day = ((day - date.getDay()) + (7 * dir)) % 7;

            date.setDate(date.getDate() + day);
            adjustDST(date, hours);
        }

        function dayOfWeek(date, day, dir) {
            date = new Date(date);
            setDayOfWeek(date, day, dir);
            return date;
        }

        function firstDayOfMonth(date) {
            return new Date(
                date.getFullYear(),
                date.getMonth(),
                1
            );
        }

        function lastDayOfMonth(date) {
            var last = new Date(date.getFullYear(), date.getMonth() + 1, 0),
                first = firstDayOfMonth(date),
                timeOffset = Math.abs(last.getTimezoneOffset() - first.getTimezoneOffset());

            if (timeOffset) {
                last.setHours(first.getHours() + (timeOffset / 60));
            }

            return last;
        }

        function getDate(date) {
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
            adjustDST(date, 0);
            return date;
        }

        function toUtcTime(date) {
            return Date.UTC(date.getFullYear(), date.getMonth(),
                        date.getDate(), date.getHours(), date.getMinutes(),
                        date.getSeconds(), date.getMilliseconds());
        }

        function getMilliseconds(date) {
            return date.getTime() - getDate(date);
        }

        function isInTimeRange(value, min, max) {
            var msMin = getMilliseconds(min),
                msMax = getMilliseconds(max),
                msValue;

            if (!value || msMin == msMax) {
                return true;
            }

            if (min >= max) {
                max += MS_PER_DAY;
            }

            msValue = getMilliseconds(value);

            if (msMin > msValue) {
                msValue += MS_PER_DAY;
            }

            if (msMax < msMin) {
                msMax += MS_PER_DAY;
            }

            return msValue >= msMin && msValue <= msMax;
        }

        function isInDateRange(value, min, max) {
            var msMin = min.getTime(),
                msMax = max.getTime(),
                msValue;

            if (msMin >= msMax) {
                msMax += MS_PER_DAY;
            }

            msValue = value.getTime();

            return msValue >= msMin && msValue <= msMax;
        }

        function addDays(date, offset) {
            var hours = date.getHours();
                date = new Date(date);

            setTime(date, offset * MS_PER_DAY);
            adjustDST(date, hours);
            return date;
        }

        function setTime(date, milliseconds, ignoreDST) {
            var offset = date.getTimezoneOffset();
            var difference;

            date.setTime(date.getTime() + milliseconds);

            if (!ignoreDST) {
                difference = date.getTimezoneOffset() - offset;
                date.setTime(date.getTime() + difference * MS_PER_MINUTE);
            }
        }

        function today() {
            return getDate(new Date());
        }

        function isToday(date) {
           return getDate(date).getTime() == today().getTime();
        }

        function toInvariantTime(date) {
            var staticDate = new Date(1980, 1, 1, 0, 0, 0);

            if (date) {
                staticDate.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
            }

            return staticDate;
        }

        return {
            adjustDST: adjustDST,
            dayOfWeek: dayOfWeek,
            setDayOfWeek: setDayOfWeek,
            getDate: getDate,
            isInDateRange: isInDateRange,
            isInTimeRange: isInTimeRange,
            isToday: isToday,
            nextDay: function(date) {
                return addDays(date, 1);
            },
            previousDay: function(date) {
                return addDays(date, -1);
            },
            toUtcTime: toUtcTime,
            MS_PER_DAY: MS_PER_DAY,
            MS_PER_HOUR: 60 * MS_PER_MINUTE,
            MS_PER_MINUTE: MS_PER_MINUTE,
            setTime: setTime,
            addDays: addDays,
            today: today,
            toInvariantTime: toInvariantTime,
            firstDayOfMonth: firstDayOfMonth,
            lastDayOfMonth: lastDayOfMonth,
            getMilliseconds: getMilliseconds
            //TODO methods: combine date portion and time portion from arguments - date1, date 2
        };
    })();


    kendo.stripWhitespace = function(element) {
        if (document.createNodeIterator) {
            var iterator = document.createNodeIterator(element, NodeFilter.SHOW_TEXT, function(node) {
                    return node.parentNode == element ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }, false);

            while (iterator.nextNode()) {
                if (iterator.referenceNode && !iterator.referenceNode.textContent.trim()) {
                    iterator.referenceNode.parentNode.removeChild(iterator.referenceNode);
                }
            }
        } else { // IE7/8 support
            for (var i = 0; i < element.childNodes.length; i++) {
                var child = element.childNodes[i];

                if (child.nodeType == 3 && !/\S/.test(child.nodeValue)) {
                    element.removeChild(child);
                    i--;
                }

                if (child.nodeType == 1) {
                    kendo.stripWhitespace(child);
                }
            }
        }
    };

    var animationFrame  = window.requestAnimationFrame       ||
                          window.webkitRequestAnimationFrame ||
                          window.mozRequestAnimationFrame    ||
                          window.oRequestAnimationFrame      ||
                          window.msRequestAnimationFrame     ||
                          function(callback){ setTimeout(callback, 1000 / 60); };

    kendo.animationFrame = function(callback) {
        animationFrame.call(window, callback);
    };

    var animationQueue = [];

    kendo.queueAnimation = function(callback) {
        animationQueue[animationQueue.length] = callback;
        if (animationQueue.length === 1) {
            kendo.runNextAnimation();
        }
    };

    kendo.runNextAnimation = function() {
        kendo.animationFrame(function() {
            if (animationQueue[0]) {
                animationQueue.shift()();
                if (animationQueue[0]) {
                    kendo.runNextAnimation();
                }
            }
        });
    };

    kendo.parseQueryStringParams = function(url) {
        var queryString = url.split('?')[1] || "",
            params = {},
            paramParts = queryString.split(/&|=/),
            length = paramParts.length,
            idx = 0;

        for (; idx < length; idx += 2) {
            if(paramParts[idx] !== "") {
                params[decodeURIComponent(paramParts[idx])] = decodeURIComponent(paramParts[idx + 1]);
            }
        }

        return params;
    };

    kendo.elementUnderCursor = function(e) {
        return document.elementFromPoint(e.x.client, e.y.client);
    };

    kendo.wheelDeltaY = function(jQueryEvent) {
        var e = jQueryEvent.originalEvent,
            deltaY = e.wheelDeltaY,
            delta;

            if (e.wheelDelta) { // Webkit and IE
                if (deltaY === undefined || deltaY) { // IE does not have deltaY, thus always scroll (horizontal scrolling is treated as vertical)
                    delta = e.wheelDelta;
                }
            } else if (e.detail && e.axis === e.VERTICAL_AXIS) { // Firefox and Opera
                delta = (-e.detail) * 10;
            }

        return delta;
    };

    kendo.throttle = function(fn, delay) {
        var timeout;
        var lastExecTime = 0;

        if (!delay || delay <= 0) {
            return fn;
        }

        return function() {
            var that = this;
            var elapsed = +new Date() - lastExecTime;
            var args = arguments;

            function exec() {
                fn.apply(that, args);
                lastExecTime = +new Date();
            }

            // first execution
            if (!lastExecTime) {
                return exec();
            }

            if (timeout) {
                clearTimeout(timeout);
            }

            if (elapsed > delay) {
                exec();
            } else {
                timeout = setTimeout(exec, delay - elapsed);
            }
        };
    };


    kendo.caret = function (element, start, end) {
        var rangeElement;
        var isPosition = start !== undefined;

        if (end === undefined) {
            end = start;
        }

        if (element[0]) {
            element = element[0];
        }

        if (isPosition && element.disabled) {
            return;
        }

        try {
            if (element.selectionStart !== undefined) {
                if (isPosition) {
                    element.focus();
                    element.setSelectionRange(start, end);
                } else {
                    start = [element.selectionStart, element.selectionEnd];
                }
            } else if (document.selection) {
                if ($(element).is(":visible")) {
                    element.focus();
                }

                rangeElement = element.createTextRange();

                if (isPosition) {
                    rangeElement.collapse(true);
                    rangeElement.moveStart("character", start);
                    rangeElement.moveEnd("character", end - start);
                    rangeElement.select();
                } else {
                    var rangeDuplicated = rangeElement.duplicate(),
                        selectionStart, selectionEnd;

                        rangeElement.moveToBookmark(document.selection.createRange().getBookmark());
                        rangeDuplicated.setEndPoint('EndToStart', rangeElement);
                        selectionStart = rangeDuplicated.text.length;
                        selectionEnd = selectionStart + rangeElement.text.length;

                    start = [selectionStart, selectionEnd];
                }
            }
        } catch(e) {
            /* element is not focused or it is not in the DOM */
            start = [];
        }

        return start;
    };

    kendo.compileMobileDirective = function(element, scopeSetup) {
        var angular = window.angular;

        element.attr("data-" + kendo.ns + "role", element[0].tagName.toLowerCase().replace('kendo-mobile-', '').replace('-', ''));

        angular.element(element).injector().invoke(["$compile", function($compile) {
            var scope = angular.element(element).scope();
            if (scopeSetup) {
                scopeSetup(scope);
            }
            $compile(element)(scope);
            scope.$digest();
        }]);

        return kendo.widgetInstance(element, kendo.mobile.ui);
    };

    // kendo.saveAs -----------------------------------------------
    (function() {
        function postToProxy(dataURI, fileName, proxyURL) {
            var form = $("<form>").attr({
                action: proxyURL,
                method: "POST"
            });

            var parts = dataURI.split(";base64,");

            $('<input>').attr({
                value: parts[0].replace("data:", ""),
                name: "contentType",
                type: "hidden"
            }).appendTo(form);

            $('<input>').attr({
                value: parts[1],
                name: "base64",
                type: "hidden"
            }).appendTo(form);

            $('<input>').attr({
                value: fileName,
                name: "fileName",
                type: "hidden"
            }).appendTo(form);

            form.appendTo("body").submit().remove();
        }

        var fileSaver = document.createElement("a");
        var downloadAttribute = "download" in fileSaver;

        function saveAsBlob(dataURI, fileName) {
            var blob = dataURI; // could be a Blob object

            if (typeof dataURI == "string") {
                var parts = dataURI.split(";base64,");
                var contentType = parts[0];
                var base64 = atob(parts[1]);
                var array = new Uint8Array(base64.length);

                for (var idx = 0; idx < base64.length; idx++) {
                    array[idx] = base64.charCodeAt(idx);
                }
                blob = new Blob([array.buffer], { type: contentType });
            }

            navigator.msSaveBlob(blob, fileName);
        }

        function saveAsDataURI(dataURI, fileName) {
            if (window.Blob && dataURI instanceof Blob) {
                dataURI = URL.createObjectURL(dataURI);
            }

            fileSaver.download = fileName;
            fileSaver.href = dataURI;

            var e = document.createEvent("MouseEvents");
            e.initMouseEvent("click", true, false, window,
                0, 0, 0, 0, 0, false, false, false, false, 0, null);

            fileSaver.dispatchEvent(e);
        }

        kendo.saveAs = function(options) {
            var save = postToProxy;

            if (!options.forceProxy) {
                if (downloadAttribute) {
                    save = saveAsDataURI;
                } else if (navigator.msSaveBlob) {
                    save = saveAsBlob;
                }
            }

            save(options.dataURI, options.fileName, options.proxyURL);
        };
    })();
})(jQuery, window);





(function ($, undefined) {
    var kendo = window.kendo,
        support = kendo.support,
        document = window.document,
        Class = kendo.Class,
        Observable = kendo.Observable,
        now = $.now,
        extend = $.extend,
        OS = support.mobileOS,
        invalidZeroEvents = OS && OS.android,
        DEFAULT_MIN_HOLD = 800,
        DEFAULT_THRESHOLD = support.browser.msie ? 5 : 0, // WP8 and W8 are very sensitive and always report move.

        // UserEvents events
        PRESS = "press",
        HOLD = "hold",
        SELECT = "select",
        START = "start",
        MOVE = "move",
        END = "end",
        CANCEL = "cancel",
        TAP = "tap",
        RELEASE = "release",
        GESTURESTART = "gesturestart",
        GESTURECHANGE = "gesturechange",
        GESTUREEND = "gestureend",
        GESTURETAP = "gesturetap";

    var THRESHOLD = {
        "api": 0,
        "touch": 0,
        "mouse": 9,
        "pointer": 9
    };

    function touchDelta(touch1, touch2) {
        var x1 = touch1.x.location,
            y1 = touch1.y.location,
            x2 = touch2.x.location,
            y2 = touch2.y.location,
            dx = x1 - x2,
            dy = y1 - y2;

        return {
            center: {
               x: (x1 + x2) / 2,
               y: (y1 + y2) / 2
            },

            distance: Math.sqrt(dx*dx + dy*dy)
        };
    }

    function getTouches(e) {
        var touches = [],
            originalEvent = e.originalEvent,
            currentTarget = e.currentTarget,
            idx = 0, length,
            changedTouches,
            touch;

        if (e.api) {
            touches.push({
                id: 2,  // hardcoded ID for API call;
                event: e,
                target: e.target,
                currentTarget: e.target,
                location: e,
                type: "api"
            });
        }
        else if (e.type.match(/touch/)) {
            changedTouches = originalEvent ? originalEvent.changedTouches : [];
            for (length = changedTouches.length; idx < length; idx ++) {
                touch = changedTouches[idx];
                touches.push({
                    location: touch,
                    event: e,
                    target: touch.target,
                    currentTarget: currentTarget,
                    id: touch.identifier,
                    type: "touch"
                });
            }
        }
        else if (support.pointers || support.msPointers) {
            touches.push({
                location: originalEvent,
                event: e,
                target: e.target,
                currentTarget: currentTarget,
                id: originalEvent.pointerId,
                type: "pointer"
            });
        } else {
            touches.push({
                id: 1, // hardcoded ID for mouse event;
                event: e,
                target: e.target,
                currentTarget: currentTarget,
                location: e,
                type: "mouse"
            });
        }

        return touches;
    }

    var TouchAxis = Class.extend({
        init: function(axis, location) {
            var that = this;

            that.axis = axis;

            that._updateLocationData(location);

            that.startLocation = that.location;
            that.velocity = that.delta = 0;
            that.timeStamp = now();
        },

        move: function(location) {
            var that = this,
                offset = location["page" + that.axis],
                timeStamp = now(),
                timeDelta = (timeStamp - that.timeStamp) || 1; // Firing manually events in tests can make this 0;

            if (!offset && invalidZeroEvents) {
                return;
            }

            that.delta = offset - that.location;

            that._updateLocationData(location);

            that.initialDelta = offset - that.startLocation;
            that.velocity = that.delta / timeDelta;
            that.timeStamp = timeStamp;
        },

        _updateLocationData: function(location) {
            var that = this, axis = that.axis;

            that.location = location["page" + axis];
            that.client = location["client" + axis];
            that.screen = location["screen" + axis];
        }
    });

    var Touch = Class.extend({
        init: function(userEvents, target, touchInfo) {
            extend(this, {
                x: new TouchAxis("X", touchInfo.location),
                y: new TouchAxis("Y", touchInfo.location),
                type: touchInfo.type,
                threshold: userEvents.threshold || THRESHOLD[touchInfo.type],
                userEvents: userEvents,
                target: target,
                currentTarget: touchInfo.currentTarget,
                initialTouch: touchInfo.target,
                id: touchInfo.id,
                pressEvent: touchInfo,
                _moved: false,
                _finished: false
            });
        },

        press: function() {
            this._holdTimeout = setTimeout($.proxy(this, "_hold"), this.userEvents.minHold);
            this._trigger(PRESS, this.pressEvent);
        },

        _hold: function() {
            this._trigger(HOLD, this.pressEvent);
        },

        move: function(touchInfo) {
            var that = this;

            if (that._finished) { return; }

            that.x.move(touchInfo.location);
            that.y.move(touchInfo.location);

            if (!that._moved) {
                if (that._withinIgnoreThreshold()) {
                    return;
                }

                if (!UserEvents.current || UserEvents.current === that.userEvents) {
                    that._start(touchInfo);
                } else {
                    return that.dispose();
                }
            }

            // Event handlers may cancel the drag in the START event handler, hence the double check for pressed.
            if (!that._finished) {
                that._trigger(MOVE, touchInfo);
            }
        },

        end: function(touchInfo) {
            var that = this;

            that.endTime = now();

            if (that._finished) { return; }

            // Mark the object as finished if there are blocking operations in the event handlers (alert/confirm)
            that._finished = true;

            that._trigger(RELEASE, touchInfo); // Release should be fired before TAP (as click is after mouseup/touchend)

            if (that._moved) {
                that._trigger(END, touchInfo);
            } else {
                that._trigger(TAP, touchInfo);
            }

            clearTimeout(that._holdTimeout);

            that.dispose();
        },

        dispose: function() {
            var userEvents = this.userEvents,
                activeTouches = userEvents.touches;

            this._finished = true;
            this.pressEvent = null;
            clearTimeout(this._holdTimeout);

            activeTouches.splice($.inArray(this, activeTouches), 1);
        },

        skip: function() {
            this.dispose();
        },

        cancel: function() {
            this.dispose();
        },

        isMoved: function() {
            return this._moved;
        },

        _start: function(touchInfo) {
            clearTimeout(this._holdTimeout);

            this.startTime = now();
            this._moved = true;
            this._trigger(START, touchInfo);
        },

        _trigger: function(name, touchInfo) {
            var that = this,
                jQueryEvent = touchInfo.event,
                data = {
                    touch: that,
                    x: that.x,
                    y: that.y,
                    target: that.target,
                    event: jQueryEvent
                };

            if(that.userEvents.notify(name, data)) {
                jQueryEvent.preventDefault();
            }
        },

        _withinIgnoreThreshold: function() {
            var xDelta = this.x.initialDelta,
                yDelta = this.y.initialDelta;

            return Math.sqrt(xDelta * xDelta + yDelta * yDelta) <= this.threshold;
        }
    });

    function withEachUpEvent(callback) {
        var downEvents = kendo.eventMap.up.split(" "),
            idx = 0,
            length = downEvents.length;

        for(; idx < length; idx ++) {
            callback(downEvents[idx]);
        }
    }

    var UserEvents = Observable.extend({
        init: function(element, options) {
            var that = this,
                filter,
                ns = kendo.guid();

            options = options || {};
            filter = that.filter = options.filter;
            that.threshold = options.threshold || DEFAULT_THRESHOLD;
            that.minHold = options.minHold || DEFAULT_MIN_HOLD;
            that.touches = [];
            that._maxTouches = options.multiTouch ? 2 : 1;
            that.allowSelection = options.allowSelection;
            that.captureUpIfMoved = options.captureUpIfMoved;
            that.eventNS = ns;

            element = $(element).handler(that);
            Observable.fn.init.call(that);

            extend(that, {
                element: element,
                surface: options.global ? $(document.documentElement) : $(options.surface || element),
                stopPropagation: options.stopPropagation,
                pressed: false
            });

            that.surface.handler(that)
                .on(kendo.applyEventMap("move", ns), "_move")
                .on(kendo.applyEventMap("up cancel", ns), "_end");

            element.on(kendo.applyEventMap("down", ns), filter, "_start");

            if (support.pointers || support.msPointers) {
                element.css("-ms-touch-action", "pinch-zoom double-tap-zoom");
            }

            if (options.preventDragEvent) {
                element.on(kendo.applyEventMap("dragstart", ns), kendo.preventDefault);
            }

            element.on(kendo.applyEventMap("mousedown", ns), filter, { root: element }, "_select");

            if (that.captureUpIfMoved && support.eventCapture) {
                var surfaceElement = that.surface[0],
                    preventIfMovingProxy = $.proxy(that.preventIfMoving, that);

                withEachUpEvent(function(eventName) {
                    surfaceElement.addEventListener(eventName, preventIfMovingProxy, true);
                });
            }

            that.bind([
            PRESS,
            HOLD,
            TAP,
            START,
            MOVE,
            END,
            RELEASE,
            CANCEL,
            GESTURESTART,
            GESTURECHANGE,
            GESTUREEND,
            GESTURETAP,
            SELECT
            ], options);
        },

        preventIfMoving: function(e) {
            if (this._isMoved()) {
                e.preventDefault();
            }
        },

        destroy: function() {
            var that = this;

            if (that._destroyed) {
                return;
            }

            that._destroyed = true;

            if (that.captureUpIfMoved && support.eventCapture) {
                var surfaceElement = that.surface[0];
                withEachUpEvent(function(eventName) {
                    surfaceElement.removeEventListener(eventName, that.preventIfMoving);
                });
            }

            that.element.kendoDestroy(that.eventNS);
            that.surface.kendoDestroy(that.eventNS);
            that.element.removeData("handler");
            that.surface.removeData("handler");
            that._disposeAll();

            that.unbind();
            delete that.surface;
            delete that.element;
            delete that.currentTarget;
        },

        capture: function() {
            UserEvents.current = this;
        },

        cancel: function() {
            this._disposeAll();
            this.trigger(CANCEL);
        },

        notify: function(eventName, data) {
            var that = this,
                touches = that.touches;

            if (this._isMultiTouch()) {
                switch(eventName) {
                    case MOVE:
                        eventName = GESTURECHANGE;
                        break;
                    case END:
                        eventName = GESTUREEND;
                        break;
                    case TAP:
                        eventName = GESTURETAP;
                        break;
                }

                extend(data, {touches: touches}, touchDelta(touches[0], touches[1]));
            }

            return this.trigger(eventName, extend(data, {type: eventName}));
        },

        // API
        press: function(x, y, target) {
            this._apiCall("_start", x, y, target);
        },

        move: function(x, y) {
            this._apiCall("_move", x, y);
        },

        end: function(x, y) {
            this._apiCall("_end", x, y);
        },

        _isMultiTouch: function() {
            return this.touches.length > 1;
        },

        _maxTouchesReached: function() {
            return this.touches.length >= this._maxTouches;
        },

        _disposeAll: function() {
            var touches = this.touches;
            while (touches.length > 0) {
                touches.pop().dispose();
            }
        },

        _isMoved: function() {
            return $.grep(this.touches, function(touch) {
                return touch.isMoved();
            }).length;
        },

        _select: function(e) {
           if (!this.allowSelection || this.trigger(SELECT, { event: e })) {
               e.preventDefault();
           }
        },

        _start: function(e) {
            var that = this,
                idx = 0,
                filter = that.filter,
                target,
                touches = getTouches(e),
                length = touches.length,
                touch,
                which = e.which;

            if ((which && which > 1) || (that._maxTouchesReached())){
                return;
            }

            UserEvents.current = null;

            that.currentTarget = e.currentTarget;

            if (that.stopPropagation) {
                e.stopPropagation();
            }

            for (; idx < length; idx ++) {
                if (that._maxTouchesReached()) {
                    break;
                }

                touch = touches[idx];

                if (filter) {
                    target = $(touch.currentTarget); // target.is(filter) ? target : target.closest(filter, that.element);
                } else {
                    target = that.element;
                }

                if (!target.length) {
                    continue;
                }

                touch = new Touch(that, target, touch);
                that.touches.push(touch);
                touch.press();

                if (that._isMultiTouch()) {
                    that.notify("gesturestart", {});
                }
            }
        },

        _move: function(e) {
            this._eachTouch("move", e);
        },

        _end: function(e) {
            this._eachTouch("end", e);
        },

        _eachTouch: function(methodName, e) {
            var that = this,
                dict = {},
                touches = getTouches(e),
                activeTouches = that.touches,
                idx,
                touch,
                touchInfo,
                matchingTouch;

            for (idx = 0; idx < activeTouches.length; idx ++) {
                touch = activeTouches[idx];
                dict[touch.id] = touch;
            }

            for (idx = 0; idx < touches.length; idx ++) {
                touchInfo = touches[idx];
                matchingTouch = dict[touchInfo.id];

                if (matchingTouch) {
                    matchingTouch[methodName](touchInfo);
                }
            }
        },

        _apiCall: function(type, x, y, target) {
            this[type]({
                api: true,
                pageX: x,
                pageY: y,
                clientX: x,
                clientY: y,
                target: $(target || this.element)[0],
                stopPropagation: $.noop,
                preventDefault: $.noop
            });
        }
    });

    UserEvents.defaultThreshold = function(value) {
        DEFAULT_THRESHOLD = value;
    };

    UserEvents.minHold = function(value) {
        DEFAULT_MIN_HOLD = value;
    };

    kendo.getTouches = getTouches;
    kendo.touchDelta = touchDelta;
    kendo.UserEvents = UserEvents;
 })(window.kendo.jQuery);





(function ($, undefined) {
    var kendo = window.kendo,
        support = kendo.support,
        document = window.document,
        Class = kendo.Class,
        Widget = kendo.ui.Widget,
        Observable = kendo.Observable,
        UserEvents = kendo.UserEvents,
        proxy = $.proxy,
        extend = $.extend,
        getOffset = kendo.getOffset,
        draggables = {},
        dropTargets = {},
        dropAreas = {},
        lastDropTarget,
        elementUnderCursor = kendo.elementUnderCursor,
        KEYUP = "keyup",
        CHANGE = "change",

        // Draggable events
        DRAGSTART = "dragstart",
        HOLD = "hold",
        DRAG = "drag",
        DRAGEND = "dragend",
        DRAGCANCEL = "dragcancel",

        // DropTarget events
        DRAGENTER = "dragenter",
        DRAGLEAVE = "dragleave",
        DROP = "drop";

    function contains(parent, child) {
        try {
            return $.contains(parent, child) || parent == child;
        } catch (e) {
            return false;
        }
    }

    function numericCssPropery(element, property) {
        return parseInt(element.css(property), 10) || 0;
    }

    function within(value, range) {
        return Math.min(Math.max(value, range.min), range.max);
    }

    function containerBoundaries(container, element) {
        var offset = getOffset(container),
            minX = offset.left + numericCssPropery(container, "borderLeftWidth") + numericCssPropery(container, "paddingLeft"),
            minY = offset.top + numericCssPropery(container, "borderTopWidth") + numericCssPropery(container, "paddingTop"),
            maxX = minX + container.width() - element.outerWidth(true),
            maxY = minY + container.height() - element.outerHeight(true);

        return {
            x: { min: minX, max: maxX },
            y: { min: minY, max: maxY }
        };
    }

    function checkTarget(target, targets, areas) {
        var theTarget, theFilter, i = 0,
            targetLen = targets && targets.length,
            areaLen = areas && areas.length;

        while (target && target.parentNode) {
            for (i = 0; i < targetLen; i ++) {
                theTarget = targets[i];
                if (theTarget.element[0] === target) {
                    return { target: theTarget, targetElement: target };
                }
            }

            for (i = 0; i < areaLen; i ++) {
                theFilter = areas[i];
                if (support.matchesSelector.call(target, theFilter.options.filter)) {
                    return { target: theFilter, targetElement: target };
                }
            }

            target = target.parentNode;
        }

        return undefined;
    }

    var TapCapture = Observable.extend({
        init: function(element, options) {
            var that = this,
                domElement = element[0];

            that.capture = false;

            if (domElement.addEventListener) {
                $.each(kendo.eventMap.down.split(" "), function() {
                    domElement.addEventListener(this, proxy(that._press, that), true);
                });
                $.each(kendo.eventMap.up.split(" "), function() {
                    domElement.addEventListener(this, proxy(that._release, that), true);
                });
            } else {
                $.each(kendo.eventMap.down.split(" "), function() {
                    domElement.attachEvent(this, proxy(that._press, that));
                });
                $.each(kendo.eventMap.up.split(" "), function() {
                    domElement.attachEvent(this, proxy(that._release, that));
                });
            }

            Observable.fn.init.call(that);

            that.bind(["press", "release"], options || {});
        },

        captureNext: function() {
            this.capture = true;
        },

        cancelCapture: function() {
            this.capture = false;
        },

        _press: function(e) {
            var that = this;
            that.trigger("press");
            if (that.capture) {
                e.preventDefault();
            }
        },

        _release: function(e) {
            var that = this;
            that.trigger("release");

            if (that.capture) {
                e.preventDefault();
                that.cancelCapture();
            }
        }
    });

    var PaneDimension = Observable.extend({
        init: function(options) {
            var that = this;
            Observable.fn.init.call(that);

            that.forcedEnabled = false;

            $.extend(that, options);

            that.scale = 1;

            if (that.horizontal) {
                that.measure = "offsetWidth";
                that.scrollSize = "scrollWidth";
                that.axis = "x";
            } else {
                that.measure = "offsetHeight";
                that.scrollSize = "scrollHeight";
                that.axis = "y";
            }
        },

        makeVirtual: function() {
            $.extend(this, {
                virtual: true,
                forcedEnabled: true,
                _virtualMin: 0,
                _virtualMax: 0
            });
        },

        virtualSize: function(min, max) {
            if (this._virtualMin !== min || this._virtualMax !== max) {
                this._virtualMin = min;
                this._virtualMax = max;
                this.update();
            }
        },

        outOfBounds: function(offset) {
            return offset > this.max || offset < this.min;
        },

        forceEnabled: function() {
            this.forcedEnabled = true;
        },

        getSize: function() {
            return this.container[0][this.measure];
        },

        getTotal: function() {
            return this.element[0][this.scrollSize];
        },

        rescale: function(scale) {
            this.scale = scale;
        },

        update: function(silent) {
            var that = this,
                total = that.virtual ? that._virtualMax : that.getTotal(),
                scaledTotal = total * that.scale,
                size = that.getSize();

            if (total === 0) {
                return; // we are not visible.
            }

            that.max = that.virtual ? -that._virtualMin : 0;
            that.size = size;
            that.total = scaledTotal;
            that.min = Math.min(that.max, size - scaledTotal);
            that.minScale = size / total;
            that.centerOffset = (scaledTotal - size) / 2;

            that.enabled = that.forcedEnabled || (scaledTotal > size);

            if (!silent) {
                that.trigger(CHANGE, that);
            }
        }
    });

    var PaneDimensions = Observable.extend({
        init: function(options) {
            var that = this;

            Observable.fn.init.call(that);

            that.x = new PaneDimension(extend({horizontal: true}, options));
            that.y = new PaneDimension(extend({horizontal: false}, options));
            that.container = options.container;
            that.forcedMinScale = options.minScale;
            that.maxScale = options.maxScale || 100;

            that.bind(CHANGE, options);
        },

        rescale: function(newScale) {
            this.x.rescale(newScale);
            this.y.rescale(newScale);
            this.refresh();
        },

        centerCoordinates: function() {
            return { x: Math.min(0, -this.x.centerOffset), y: Math.min(0, -this.y.centerOffset) };
        },

        refresh: function() {
            var that = this;
            that.x.update();
            that.y.update();
            that.enabled = that.x.enabled || that.y.enabled;
            that.minScale = that.forcedMinScale || Math.min(that.x.minScale, that.y.minScale);
            that.fitScale = Math.max(that.x.minScale, that.y.minScale);
            that.trigger(CHANGE);
        }
    });

    var PaneAxis = Observable.extend({
        init: function(options) {
            var that = this;
            extend(that, options);
            Observable.fn.init.call(that);
        },

        outOfBounds: function() {
            return this.dimension.outOfBounds(this.movable[this.axis]);
        },

        dragMove: function(delta) {
            var that = this,
                dimension = that.dimension,
                axis = that.axis,
                movable = that.movable,
                position = movable[axis] + delta;

            if (!dimension.enabled) {
                return;
            }

            if ((position < dimension.min && delta < 0) || (position > dimension.max && delta > 0)) {
                delta *= that.resistance;
            }

            movable.translateAxis(axis, delta);
            that.trigger(CHANGE, that);
        }
    });

    var Pane = Class.extend({

        init: function(options) {
            var that = this,
                x,
                y,
                resistance,
                movable;

            extend(that, {elastic: true}, options);

            resistance = that.elastic ? 0.5 : 0;
            movable = that.movable;

            that.x = x = new PaneAxis({
                axis: "x",
                dimension: that.dimensions.x,
                resistance: resistance,
                movable: movable
            });

            that.y = y = new PaneAxis({
                axis: "y",
                dimension: that.dimensions.y,
                resistance: resistance,
                movable: movable
            });

            that.userEvents.bind(["move", "end", "gesturestart", "gesturechange"], {
                gesturestart: function(e) {
                    that.gesture = e;
                    that.offset = that.dimensions.container.offset();
                },

                gesturechange: function(e) {
                    var previousGesture = that.gesture,
                        previousCenter = previousGesture.center,

                        center = e.center,

                        scaleDelta = e.distance / previousGesture.distance,

                        minScale = that.dimensions.minScale,
                        maxScale = that.dimensions.maxScale,
                        coordinates;

                    if (movable.scale <= minScale && scaleDelta < 1) {
                        // Resist shrinking. Instead of shrinking from 1 to 0.5, it will shrink to 0.5 + (1 /* minScale */ - 0.5) * 0.8 = 0.9;
                        scaleDelta += (1 - scaleDelta) * 0.8;
                    }

                    if (movable.scale * scaleDelta >= maxScale) {
                        scaleDelta = maxScale / movable.scale;
                    }

                    var offsetX = movable.x + that.offset.left,
                        offsetY = movable.y + that.offset.top;

                    coordinates = {
                        x: (offsetX - previousCenter.x) * scaleDelta + center.x - offsetX,
                        y: (offsetY - previousCenter.y) * scaleDelta + center.y - offsetY
                    };

                    movable.scaleWith(scaleDelta);

                    x.dragMove(coordinates.x);
                    y.dragMove(coordinates.y);

                    that.dimensions.rescale(movable.scale);
                    that.gesture = e;
                    e.preventDefault();
                },

                move: function(e) {
                    if (e.event.target.tagName.match(/textarea|input/i)) {
                        return;
                    }

                    if (x.dimension.enabled || y.dimension.enabled) {
                        x.dragMove(e.x.delta);
                        y.dragMove(e.y.delta);
                        e.preventDefault();
                    } else {
                        e.touch.skip();
                    }
                },

                end: function(e) {
                    e.preventDefault();
                }
            });
        }
    });

    var TRANSFORM_STYLE = support.transitions.prefix + "Transform",
        translate;


    if (support.hasHW3D) {
        translate = function(x, y, scale) {
            return "translate3d(" + x + "px," + y +"px,0) scale(" + scale + ")";
        };
    } else {
        translate = function(x, y, scale) {
            return "translate(" + x + "px," + y +"px) scale(" + scale + ")";
        };
    }

    var Movable = Observable.extend({
        init: function(element) {
            var that = this;

            Observable.fn.init.call(that);

            that.element = $(element);
            that.element[0].style.webkitTransformOrigin = "left top";
            that.x = 0;
            that.y = 0;
            that.scale = 1;
            that._saveCoordinates(translate(that.x, that.y, that.scale));
        },

        translateAxis: function(axis, by) {
            this[axis] += by;
            this.refresh();
        },

        scaleTo: function(scale) {
            this.scale = scale;
            this.refresh();
        },

        scaleWith: function(scaleDelta) {
            this.scale *= scaleDelta;
            this.refresh();
        },

        translate: function(coordinates) {
            this.x += coordinates.x;
            this.y += coordinates.y;
            this.refresh();
        },

        moveAxis: function(axis, value) {
            this[axis] = value;
            this.refresh();
        },

        moveTo: function(coordinates) {
            extend(this, coordinates);
            this.refresh();
        },

        refresh: function() {
            var that = this,
                x = that.x,
                y = that.y,
                newCoordinates;

            if (that.round) {
                x = Math.round(x);
                y = Math.round(y);
            }

            newCoordinates = translate(x, y, that.scale);

            if (newCoordinates != that.coordinates) {
                if (kendo.support.browser.msie && kendo.support.browser.version < 10) {
                    that.element[0].style.position = "absolute";
                    that.element[0].style.left = that.x + "px";
                    that.element[0].style.top = that.y + "px";

                } else {
                    that.element[0].style[TRANSFORM_STYLE] = newCoordinates;
                }
                that._saveCoordinates(newCoordinates);
                that.trigger(CHANGE);
            }
        },

        _saveCoordinates: function(coordinates) {
            this.coordinates = coordinates;
        }
    });

    var DropTarget = Widget.extend({
        init: function(element, options) {
            var that = this;

            Widget.fn.init.call(that, element, options);

            var group = that.options.group;

            if (!(group in dropTargets)) {
                dropTargets[group] = [ that ];
            } else {
                dropTargets[group].push( that );
            }
        },

        events: [
            DRAGENTER,
            DRAGLEAVE,
            DROP
        ],

        options: {
            name: "DropTarget",
            group: "default"
        },

        destroy: function() {
            var groupName = this.options.group,
                group = dropTargets[groupName] || dropAreas[groupName],
                i;

            if (group.length > 1) {
                Widget.fn.destroy.call(this);

                for (i = 0; i < group.length; i++) {
                    if (group[i] == this) {
                        group.splice(i, 1);
                        break;
                    }
                }
            } else {
                DropTarget.destroyGroup(groupName);
            }
        },

        _trigger: function(eventName, e) {
            var that = this,
                draggable = draggables[that.options.group];

            if (draggable) {
                return that.trigger(eventName, extend({}, e.event, {
                           draggable: draggable,
                           dropTarget: e.dropTarget
                       }));
            }
        },

        _over: function(e) {
            this._trigger(DRAGENTER, e);
        },

        _out: function(e) {
            this._trigger(DRAGLEAVE, e);
        },

        _drop: function(e) {
            var that = this,
                draggable = draggables[that.options.group];

            if (draggable) {
                draggable.dropped = !that._trigger(DROP, e);
            }
        }
    });

    DropTarget.destroyGroup = function(groupName) {
        var group = dropTargets[groupName] || dropAreas[groupName],
            i;

        if (group) {
            for (i = 0; i < group.length; i++) {
                Widget.fn.destroy.call(group[i]);
            }

            group.length = 0;
            delete dropTargets[groupName];
            delete dropAreas[groupName];
        }
    };

    DropTarget._cache = dropTargets;

    var DropTargetArea = DropTarget.extend({
        init: function(element, options) {
            var that = this;

            Widget.fn.init.call(that, element, options);

            var group = that.options.group;

            if (!(group in dropAreas)) {
                dropAreas[group] = [ that ];
            } else {
                dropAreas[group].push( that );
            }
        },

        options: {
            name: "DropTargetArea",
            group: "default",
            filter: null
        }
    });

    var Draggable = Widget.extend({
        init: function (element, options) {
            var that = this;

            Widget.fn.init.call(that, element, options);

            that._activated = false;

            that.userEvents = new UserEvents(that.element, {
                global: true,
                allowSelection: true,
                filter: that.options.filter,
                threshold: that.options.distance,
                start: proxy(that._start, that),
                hold: proxy(that._hold, that),
                move: proxy(that._drag, that),
                end: proxy(that._end, that),
                cancel: proxy(that._cancel, that),
                select: proxy(that._select, that)
            });

            that._afterEndHandler = proxy(that._afterEnd, that);
            that._captureEscape = proxy(that._captureEscape, that);
        },

        events: [
            HOLD,
            DRAGSTART,
            DRAG,
            DRAGEND,
            DRAGCANCEL
        ],

        options: {
            name: "Draggable",
            distance: 5,
            group: "default",
            cursorOffset: null,
            axis: null,
            container: null,
            filter: null,
            ignore: null,
            holdToDrag: false,
            dropped: false
        },

        cancelHold: function() {
            this._activated = false;
        },

        _captureEscape: function(e) {
            var that = this;

            if (e.keyCode === kendo.keys.ESC) {
                that._trigger(DRAGCANCEL, { event: e });
                that.userEvents.cancel();
            }
        },

        _updateHint: function(e) {
            var that = this,
                coordinates,
                options = that.options,
                boundaries = that.boundaries,
                axis = options.axis,
                cursorOffset = that.options.cursorOffset;

            if (cursorOffset) {
               coordinates = { left: e.x.location + cursorOffset.left, top: e.y.location + cursorOffset.top };
            } else {
               that.hintOffset.left += e.x.delta;
               that.hintOffset.top += e.y.delta;
               coordinates = $.extend({}, that.hintOffset);
            }

            if (boundaries) {
                coordinates.top = within(coordinates.top, boundaries.y);
                coordinates.left = within(coordinates.left, boundaries.x);
            }

            if (axis === "x") {
                delete coordinates.top;
            } else if (axis === "y") {
                delete coordinates.left;
            }

            that.hint.css(coordinates);
        },

        _shouldIgnoreTarget: function(target) {
            var ignoreSelector = this.options.ignore;
            return ignoreSelector && $(target).is(ignoreSelector);
        },

        _select: function(e) {
            if (!this._shouldIgnoreTarget(e.event.target)) {
                e.preventDefault();
            }
        },

        _start: function(e) {
            var that = this,
                options = that.options,
                container = options.container,
                hint = options.hint;

            if (this._shouldIgnoreTarget(e.touch.initialTouch) || (options.holdToDrag && !that._activated)) {
                that.userEvents.cancel();
                return;
            }

            that.currentTarget = e.target;
            that.currentTargetOffset = getOffset(that.currentTarget);

            if (hint) {
                if (that.hint) {
                    that.hint.stop(true, true).remove();
                }

                that.hint = kendo.isFunction(hint) ? $(hint.call(that, that.currentTarget)) : hint;

                var offset = getOffset(that.currentTarget);
                that.hintOffset = offset;

                that.hint.css( {
                    position: "absolute",
                    zIndex: 20000, // the Window's z-index is 10000 and can be raised because of z-stacking
                    left: offset.left,
                    top: offset.top
                })
                .appendTo(document.body);

                that.angular("compile", function(){
                    that.hint.removeAttr("ng-repeat");
                    return {
                        elements: that.hint.get(),
                        scopeFrom: e.target
                    };
                });
            }

            draggables[options.group] = that;

            that.dropped = false;

            if (container) {
                that.boundaries = containerBoundaries(container, that.hint);
            }

            if (that._trigger(DRAGSTART, e)) {
                that.userEvents.cancel();
                that._afterEnd();
            }

            $(document).on(KEYUP, that._captureEscape);
        },

        _hold: function(e) {
            this.currentTarget = e.target;

            if (this._trigger(HOLD, e)) {
                this.userEvents.cancel();
            } else {
                this._activated = true;
            }
        },

        _drag: function(e) {
            var that = this;

            e.preventDefault();

            that._withDropTarget(e, function(target, targetElement) {
                if (!target) {
                    if (lastDropTarget) {
                        lastDropTarget._trigger(DRAGLEAVE, extend(e, { dropTarget: $(lastDropTarget.targetElement) }));
                        lastDropTarget = null;
                    }
                    return;
                }

                if (lastDropTarget) {
                    if (targetElement === lastDropTarget.targetElement) {
                        return;
                    }

                    lastDropTarget._trigger(DRAGLEAVE, extend(e, { dropTarget: $(lastDropTarget.targetElement) }));
                }

                target._trigger(DRAGENTER, extend(e, { dropTarget: $(targetElement) }));
                lastDropTarget = extend(target, { targetElement: targetElement });
            });

            that._trigger(DRAG, extend(e, { dropTarget: lastDropTarget }));

            if (that.hint) {
                that._updateHint(e);
            }
        },

        _end: function(e) {
            var that = this;

            that._withDropTarget(e, function(target, targetElement) {
                if (target) {
                    target._drop(extend({}, e, { dropTarget: $(targetElement) }));
                    lastDropTarget = null;
                }
            });

            that._trigger(DRAGEND, e);
            that._cancel(e.event);
        },

        _cancel: function() {
            var that = this;

            that._activated = false;

            if (that.hint && !that.dropped) {
                setTimeout(function() {
                    that.hint.stop(true, true).animate(that.currentTargetOffset, "fast", that._afterEndHandler);
                }, 0);

            } else {
                that._afterEnd();
            }
        },

        _trigger: function(eventName, e) {
            var that = this;

            return that.trigger(
                eventName, extend(
                {},
                e.event,
                {
                    x: e.x,
                    y: e.y,
                    currentTarget: that.currentTarget,
                    dropTarget: e.dropTarget
                }
            ));
        },

        _withDropTarget: function(e, callback) {
            var that = this,
                target, result,
                options = that.options,
                targets = dropTargets[options.group],
                areas = dropAreas[options.group];

            if (targets && targets.length || areas && areas.length) {

                target = elementUnderCursor(e);

                if (that.hint && contains(that.hint[0], target)) {
                    that.hint.hide();
                    target = elementUnderCursor(e);
                    // IE8 does not return the element in iframe from first attempt
                    if (!target) {
                        target = elementUnderCursor(e);
                    }
                    that.hint.show();
                }

                result = checkTarget(target, targets, areas);

                if (result) {
                    callback(result.target, result.targetElement);
                } else {
                    callback();
                }
            }
        },

        destroy: function() {
            var that = this;

            Widget.fn.destroy.call(that);

            that._afterEnd();

            that.userEvents.destroy();

            that.currentTarget = null;
        },

        _afterEnd: function() {
            var that = this;

            if (that.hint) {
                that.hint.remove();
            }

            delete draggables[that.options.group];

            that.trigger("destroy");
            $(document).off(KEYUP, that._captureEscape);
        }
    });

    kendo.ui.plugin(DropTarget);
    kendo.ui.plugin(DropTargetArea);
    kendo.ui.plugin(Draggable);
    kendo.TapCapture = TapCapture;
    kendo.containerBoundaries = containerBoundaries;

    extend(kendo.ui, {
        Pane: Pane,
        PaneDimensions: PaneDimensions,
        Movable: Movable
    });

 })(window.kendo.jQuery);





(function($, undefined) {
    var kendo = window.kendo,
        ui = kendo.ui,
        Widget = ui.Widget,
        proxy = $.proxy,
        isFunction = kendo.isFunction,
        extend = $.extend,
        HORIZONTAL = "horizontal",
        VERTICAL = "vertical",
        START = "start",
        RESIZE = "resize",
        RESIZEEND = "resizeend";

    var Resizable = Widget.extend({
        init: function(element, options) {
            var that = this;

            Widget.fn.init.call(that, element, options);

            that.orientation = that.options.orientation.toLowerCase() != VERTICAL ? HORIZONTAL : VERTICAL;
            that._positionMouse = that.orientation == HORIZONTAL ? "x" : "y";
            that._position = that.orientation == HORIZONTAL ? "left" : "top";
            that._sizingDom = that.orientation == HORIZONTAL ? "outerWidth" : "outerHeight";

            that.draggable = new ui.Draggable(element, {
                distance: 0,
                filter: options.handle,
                drag: proxy(that._resize, that),
                dragcancel: proxy(that._cancel, that),
                dragstart: proxy(that._start, that),
                dragend: proxy(that._stop, that)
            });

            that.userEvents = that.draggable.userEvents;
        },

        events: [
            RESIZE,
            RESIZEEND,
            START
        ],

        options: {
            name: "Resizable",
            orientation: HORIZONTAL
        },

        resize: function() {
            // Overrides base widget resize
        },

        _max: function(e) {
            var that = this,
                hintSize = that.hint ? that.hint[that._sizingDom]() : 0,
                size = that.options.max;

            return isFunction(size) ? size(e) : size !== undefined ? (that._initialElementPosition + size) - hintSize : size;
        },

        _min: function(e) {
            var that = this,
                size = that.options.min;

            return isFunction(size) ? size(e) : size !== undefined ? that._initialElementPosition + size : size;
        },

        _start: function(e) {
            var that = this,
                hint = that.options.hint,
                el = $(e.currentTarget);

            that._initialElementPosition = el.position()[that._position];
            that._initialMousePosition = e[that._positionMouse].startLocation;

            if (hint) {
                that.hint = isFunction(hint) ? $(hint(el)) : hint;

                that.hint.css({
                    position: "absolute"
                })
                .css(that._position, that._initialElementPosition)
                .appendTo(that.element);
            }

            that.trigger(START, e);

            that._maxPosition = that._max(e);
            that._minPosition = that._min(e);

            $(document.body).css("cursor", el.css("cursor"));
        },

        _resize: function(e) {
            var that = this,
                maxPosition = that._maxPosition,
                minPosition = that._minPosition,
                currentPosition = that._initialElementPosition + (e[that._positionMouse].location - that._initialMousePosition),
                position;

            position = minPosition !== undefined ? Math.max(minPosition, currentPosition) : currentPosition;
            that.position = position =  maxPosition !== undefined ? Math.min(maxPosition, position) : position;

            if(that.hint) {
                that.hint.toggleClass(that.options.invalidClass || "", position == maxPosition || position == minPosition)
                         .css(that._position, position);
            }

            that.resizing = true;
            that.trigger(RESIZE, extend(e, { position: position }));
        },

        _stop: function(e) {
            var that = this;

            if(that.hint) {
                that.hint.remove();
            }

            that.resizing = false;
            that.trigger(RESIZEEND, extend(e, { position: that.position }));
            $(document.body).css("cursor", "");
        },

        _cancel: function(e) {
            var that = this;

            if (that.hint) {
                that.position = undefined;
                that.hint.css(that._position, that._initialElementPosition);
                that._stop(e);
            }
        },

        destroy: function() {
            var that = this;

            Widget.fn.destroy.call(that);

            if (that.draggable) {
                that.draggable.destroy();
            }
        },

        press: function(target) {
            if (!target) {
                return;
            }

            var position = target.position(),
                that = this;

            that.userEvents.press(position.left, position.top, target[0]);
            that.targetPosition = position;
            that.target = target;
        },

        move: function(delta) {
            var that = this,
                orientation = that._position,
                position = that.targetPosition,
                current = that.position;

            if (current === undefined) {
                current = position[orientation];
            }

            position[orientation] = current + delta;

            that.userEvents.move(position.left, position.top);
        },

        end: function() {
            this.userEvents.end();
            this.target = this.position = undefined;
        }
    });

    kendo.ui.plugin(Resizable);

})(window.kendo.jQuery);





(function ($, undefined) {
    var kendo = window.kendo,
        ui = kendo.ui,
        keys = kendo.keys,
        extend = $.extend,
        proxy = $.proxy,
        Widget = ui.Widget,
        pxUnitsRegex = /^\d+(\.\d+)?px$/i,
        percentageUnitsRegex = /^\d+(\.\d+)?%$/i,
        NS = ".kendoSplitter",
        EXPAND = "expand",
        COLLAPSE = "collapse",
        CONTENTLOAD = "contentLoad",
        ERROR = "error",
        RESIZE = "resize",
        LAYOUTCHANGE = "layoutChange",
        HORIZONTAL = "horizontal",
        VERTICAL = "vertical",
        MOUSEENTER = "mouseenter",
        CLICK = "click",
        PANE = "pane",
        MOUSELEAVE = "mouseleave",
        FOCUSED = "k-state-focused",
        KPANE = "k-" + PANE,
        PANECLASS = "." + KPANE;

    function isPercentageSize(size) {
        return percentageUnitsRegex.test(size);
    }

    function isPixelSize(size) {
        return pxUnitsRegex.test(size) || /^\d+$/.test(size);
    }

    function isFluid(size) {
        return !isPercentageSize(size) && !isPixelSize(size);
    }

    function calculateSize(size, total) {
        var output = parseInt(size, 10);

        if (isPercentageSize(size)) {
            output = Math.floor(output * total / 100);
        }

        return output;
    }

    function panePropertyAccessor(propertyName, triggersResize) {
        return function(pane, value) {
            var paneConfig = this.element.find(pane).data(PANE);

            if (arguments.length == 1) {
                return paneConfig[propertyName];
            }

            paneConfig[propertyName] = value;

            if (triggersResize) {
                var splitter = this.element.data("kendo" + this.options.name);
                splitter.resize(true);
            }
        };
    }

    var Splitter = Widget.extend({
        init: function(element, options) {
            var that = this,
                isHorizontal;

            Widget.fn.init.call(that, element, options);

            that.wrapper = that.element;

            isHorizontal = that.options.orientation.toLowerCase() != VERTICAL;
            that.orientation = isHorizontal ? HORIZONTAL : VERTICAL;
            that._dimension = isHorizontal ? "width" : "height";
            that._keys = {
                decrease: isHorizontal ? keys.LEFT : keys.UP,
                increase: isHorizontal ? keys.RIGHT : keys.DOWN
            };

            that._resizeStep = 10;

            that._marker = kendo.guid().substring(0, 8);

            that._initPanes();

            that.resizing = new PaneResizing(that);

            that.element.triggerHandler("init" + NS);
        },
        events: [
            EXPAND,
            COLLAPSE,
            CONTENTLOAD,
            ERROR,
            RESIZE,
            LAYOUTCHANGE
        ],

        _attachEvents: function() {
            var that = this,
                orientation = that.options.orientation;

            // do not use delegated events to increase performance of nested elements
            that.element
                .children(".k-splitbar-draggable-" + orientation)
                    .on("keydown" + NS, $.proxy(that._keydown, that))
                    .on("mousedown" + NS, function(e) { e.currentTarget.focus(); })
                    .on("focus" + NS, function(e) { $(e.currentTarget).addClass(FOCUSED);  })
                    .on("blur" + NS, function(e) { $(e.currentTarget).removeClass(FOCUSED);
                        if (that.resizing) {
                            that.resizing.end();
                        }
                    })
                    .on(MOUSEENTER + NS, function() { $(this).addClass("k-splitbar-" + that.orientation + "-hover"); })
                    .on(MOUSELEAVE + NS, function() { $(this).removeClass("k-splitbar-" + that.orientation + "-hover"); })
                    .on("mousedown" + NS, function() { that._panes().append("<div class='k-splitter-overlay k-overlay' />"); })
                    .on("mouseup" + NS, function() { that._panes().children(".k-splitter-overlay").remove(); })
                .end()
                .children(".k-splitbar")
                    .on("dblclick" + NS, proxy(that._togglePane, that))
                    .children(".k-collapse-next, .k-collapse-prev").on(CLICK + NS, that._arrowClick(COLLAPSE)).end()
                    .children(".k-expand-next, .k-expand-prev").on(CLICK + NS, that._arrowClick(EXPAND)).end()
                .end();

            $(window).on("resize" + NS + that._marker, proxy(that.resize, that));
        },

        _detachEvents: function() {
            var that = this;

            that.element
                .children(".k-splitbar-draggable-" + that.orientation).off(NS).end()
                .children(".k-splitbar").off("dblclick" + NS)
                    .children(".k-collapse-next, .k-collapse-prev, .k-expand-next, .k-expand-prev").off(NS);

            $(window).off("resize" + NS + that._marker);
        },

        options: {
            name: "Splitter",
            orientation: HORIZONTAL,
            panes: []
        },

        destroy: function() {
            Widget.fn.destroy.call(this);

            this._detachEvents();

            if (this.resizing) {
                this.resizing.destroy();
            }

            kendo.destroy(this.element);

            this.wrapper = this.element = null;
        },

        _keydown: function(e) {
            var that = this,
                key = e.keyCode,
                resizing = that.resizing,
                target = $(e.currentTarget),
                navigationKeys = that._keys,
                increase = key === navigationKeys.increase,
                decrease = key === navigationKeys.decrease,
                pane;

            if (increase || decrease) {
                if (e.ctrlKey) {
                    pane = target[decrease ? "next" : "prev"]();

                    if (resizing && resizing.isResizing()) {
                        resizing.end();
                    }

                    if (!pane[that._dimension]()) {
                        that._triggerAction(EXPAND, pane);
                    } else {
                        that._triggerAction(COLLAPSE, target[decrease ? "prev" : "next"]());
                    }
                } else if (resizing) {
                    resizing.move((decrease ? -1 : 1) * that._resizeStep, target);
                }
                e.preventDefault();
            } else if (key === keys.ENTER && resizing) {
                resizing.end();
                e.preventDefault();
            }
        },

        _initPanes: function() {
            var panesConfig = this.options.panes || [];
            var that = this;

            this.element
                .addClass("k-widget").addClass("k-splitter")
                .children()
                    .each(function(i, pane) {
                        if (pane.nodeName.toLowerCase() != "script") {
                            that._initPane(pane, panesConfig[i]);
                        }
                    });

            this.resize();
        },

        _initPane: function(pane, config) {
            pane = $(pane)
                .attr("role", "group")
                .addClass(KPANE);

            pane.data(PANE, config ? config : {})
                .toggleClass("k-scrollable", config ? config.scrollable !== false : true);

            this.ajaxRequest(pane);
        },

        ajaxRequest: function(pane, url, data) {
            var that = this,
                paneConfig;

            pane = that.element.find(pane);
            paneConfig = pane.data(PANE);

            url = url || paneConfig.contentUrl;

            if (url) {
                pane.append("<span class='k-icon k-loading k-pane-loading' />");

                if (kendo.isLocalUrl(url)) {
                    jQuery.ajax({
                        url: url,
                        data: data || {},
                        type: "GET",
                        dataType: "html",
                        success: function (data) {
                            that.angular("cleanup", function(){ return { elements: pane.get() }; });
                            pane.html(data);
                            that.angular("compile", function(){ return { elements: pane.get() }; });

                            that.trigger(CONTENTLOAD, { pane: pane[0] });
                        },
                        error: function (xhr, status) {
                            that.trigger(ERROR, {
                                pane: pane[0],
                                status: status,
                                xhr: xhr
                            });
                        }
                    });
                } else {
                    pane.removeClass("k-scrollable")
                        .html("<iframe src='" + url + "' frameborder='0' class='k-content-frame'>" +
                                "This page requires frames in order to show content" +
                              "</iframe>");
                }
            }
        },

        _triggerAction: function(type, pane) {
            if (!this.trigger(type, { pane: pane[0] })) {
                this[type](pane[0]);
            }
        },

        _togglePane: function(e) {
            var that = this,
                target = $(e.target),
                arrow;

            if (target.closest(".k-splitter")[0] != that.element[0]) {
                return;
            }

            arrow = target.children(".k-icon:not(.k-resize-handle)");

            if (arrow.length !== 1) {
                return;
            }

            if (arrow.is(".k-collapse-prev")) {
                that._triggerAction(COLLAPSE, target.prev());
            } else if (arrow.is(".k-collapse-next")) {
                that._triggerAction(COLLAPSE, target.next());
            } else if (arrow.is(".k-expand-prev")) {
                that._triggerAction(EXPAND, target.prev());
            } else if (arrow.is(".k-expand-next")) {
                that._triggerAction(EXPAND, target.next());
            }
        },
        _arrowClick: function (arrowType) {
            var that = this;

            return function(e) {
                var target = $(e.target),
                    pane;

                if (target.closest(".k-splitter")[0] != that.element[0]) {
                    return;
                }

                if (target.is(".k-" + arrowType + "-prev")) {
                    pane = target.parent().prev();
                } else {
                    pane = target.parent().next();
                }
                that._triggerAction(arrowType, pane);
            };
        },
        _updateSplitBar: function(splitbar, previousPane, nextPane) {
            var catIconIf = function(iconType, condition) {
                   return condition ? "<div class='k-icon " + iconType + "' />" : "";
                },
                orientation = this.orientation,
                draggable = (previousPane.resizable !== false) && (nextPane.resizable !== false),
                prevCollapsible = previousPane.collapsible,
                prevCollapsed = previousPane.collapsed,
                nextCollapsible = nextPane.collapsible,
                nextCollapsed = nextPane.collapsed;

            splitbar.addClass("k-splitbar k-state-default k-splitbar-" + orientation)
                    .attr("role", "separator")
                    .attr("aria-expanded", !(prevCollapsed || nextCollapsed))
                    .removeClass("k-splitbar-" + orientation + "-hover")
                    .toggleClass("k-splitbar-draggable-" + orientation,
                        draggable && !prevCollapsed && !nextCollapsed)
                    .toggleClass("k-splitbar-static-" + orientation,
                        !draggable && !prevCollapsible && !nextCollapsible)
                    .html(
                        catIconIf("k-collapse-prev", prevCollapsible && !prevCollapsed && !nextCollapsed) +
                        catIconIf("k-expand-prev", prevCollapsible && prevCollapsed && !nextCollapsed) +
                        catIconIf("k-resize-handle", draggable) +
                        catIconIf("k-collapse-next", nextCollapsible && !nextCollapsed && !prevCollapsed) +
                        catIconIf("k-expand-next", nextCollapsible && nextCollapsed && !prevCollapsed)
                    );

            if (!draggable && !prevCollapsible && !nextCollapsible) {
                splitbar.removeAttr("tabindex");
            }
        },
        _updateSplitBars: function() {
            var that = this;

            this.element.children(".k-splitbar").each(function() {
                var splitbar = $(this),
                    previousPane = splitbar.prevAll(PANECLASS).first().data(PANE),
                    nextPane = splitbar.nextAll(PANECLASS).first().data(PANE);

                if (!nextPane) {
                    return;
                }

                that._updateSplitBar(splitbar, previousPane, nextPane);
            });
        },
        _removeSplitBars: function() {
            this.element.children(".k-splitbar").remove();
        },
        _panes: function() {
            return this.element.children(PANECLASS);
        },

        _resize: function() {
            var that = this,
                element = that.element,
                panes = element.children(PANECLASS),
                isHorizontal = that.orientation == HORIZONTAL,
                splitBars = element.children(".k-splitbar"),
                splitBarsCount = splitBars.length,
                sizingProperty = isHorizontal ? "width" : "height",
                totalSize = element[sizingProperty]();

            if (splitBarsCount === 0) {
                splitBarsCount = panes.length - 1;
                panes.slice(0, splitBarsCount)
                     .after("<div tabindex='0' class='k-splitbar' data-marker='" + that._marker + "' />");

                that._updateSplitBars();
                splitBars = element.children(".k-splitbar");
            } else {
                that._updateSplitBars();
            }

            // discard splitbar sizes from total size
            splitBars.each(function() {
                totalSize -= this[isHorizontal ? "offsetWidth" : "offsetHeight"];
            });

            var sizedPanesWidth = 0,
                sizedPanesCount = 0,
                freeSizedPanes = $();

            panes.css({ position: "absolute", top: 0 })
                [sizingProperty](function() {
                    var element = $(this),
                        config = element.data(PANE) || {}, size;

                    element.removeClass("k-state-collapsed");
                    if (config.collapsed) {
                        size = config.collapsedSize ? calculateSize(config.collapsedSize, totalSize) : 0;
                        element.css("overflow", "hidden").addClass("k-state-collapsed");
                    } else if (isFluid(config.size)) {
                        freeSizedPanes = freeSizedPanes.add(this);
                        return;
                    } else { // sized in px/%, not collapsed
                        size = calculateSize(config.size, totalSize);
                    }

                    sizedPanesCount++;
                    sizedPanesWidth += size;

                    return size;
                });

            totalSize -= sizedPanesWidth;

            var freeSizePanesCount = freeSizedPanes.length,
                freeSizePaneWidth = Math.floor(totalSize / freeSizePanesCount);

            freeSizedPanes
                .slice(0, freeSizePanesCount - 1)
                    .css(sizingProperty, freeSizePaneWidth)
                .end()
                .eq(freeSizePanesCount - 1)
                    .css(sizingProperty, totalSize - (freeSizePanesCount - 1) * freeSizePaneWidth);

            // arrange panes
            var sum = 0,
                alternateSizingProperty = isHorizontal ? "height" : "width",
                positioningProperty = isHorizontal ? "left" : "top",
                sizingDomProperty = isHorizontal ? "offsetWidth" : "offsetHeight";

            if (freeSizePanesCount === 0) {
                var lastNonCollapsedPane = panes.filter(function() {
                    return !(($(this).data(PANE) || {}).collapsed);
                }).last();

                lastNonCollapsedPane[sizingProperty](totalSize + lastNonCollapsedPane[0][sizingDomProperty]);
            }

            element.children()
                .css(alternateSizingProperty, element[alternateSizingProperty]())
                .each(function (i, child) {
                    if (child.tagName.toLowerCase() != "script") {
                        child.style[positioningProperty] = Math.floor(sum) + "px";
                        sum += child[sizingDomProperty];
                    }
                });

            that._detachEvents();
            that._attachEvents();

            kendo.resize(panes);
            that.trigger(LAYOUTCHANGE);
        },

        toggle: function(pane, expand) {
            var that = this,
                paneConfig;

            pane = that.element.find(pane);
            paneConfig = pane.data(PANE);

            if (!expand && !paneConfig.collapsible) {
                return;
            }

            if (arguments.length == 1) {
                expand = paneConfig.collapsed === undefined ? false : paneConfig.collapsed;
            }

            paneConfig.collapsed = !expand;

            if (paneConfig.collapsed) {
                pane.css("overflow", "hidden");
            } else {
                pane.css("overflow", "");
            }

            that.resize(true);
        },

        collapse: function(pane) {
            this.toggle(pane, false);
        },

        expand: function(pane) {
            this.toggle(pane, true);
        },

        _addPane: function(config, idx, paneElement) {
            var that = this;

            if (paneElement.length) {
                that.options.panes.splice(idx, 0, config);
                that._initPane(paneElement, config);

                that._removeSplitBars();

                that.resize(true);
            }

            return paneElement;
        },

        append: function(config) {
            config = config || {};

            var that = this,
                paneElement = $("<div />").appendTo(that.element);

            return that._addPane(config, that.options.panes.length, paneElement);
        },

        insertBefore: function(config, referencePane) {
            referencePane = $(referencePane);
            config = config || {};

            var that = this,
                idx = that.wrapper.children(".k-pane").index(referencePane),
                paneElement = $("<div />").insertBefore($(referencePane));

            return that._addPane(config, idx, paneElement);
        },

        insertAfter: function(config, referencePane) {
            referencePane = $(referencePane);
            config = config || {};

            var that = this,
                idx = that.wrapper.children(".k-pane").index(referencePane),
                paneElement = $("<div />").insertAfter($(referencePane));

            return that._addPane(config, idx + 1, paneElement);
        },

        remove: function(pane) {
            pane = $(pane);

            var that = this;

            if (pane.length) {
                kendo.destroy(pane);
                pane.each(function(idx, element){
                    that.options.panes.splice(that.wrapper.children(".k-pane").index(element), 1);
                    $(element).remove();
                });

                that._removeSplitBars();

                if (that.options.panes.length) {
                    that.resize(true);
                }
            }

            return that;
        },

        size: panePropertyAccessor("size", true),

        min: panePropertyAccessor("min"),

        max: panePropertyAccessor("max")
    });

    ui.plugin(Splitter);

    var verticalDefaults = {
            sizingProperty: "height",
            sizingDomProperty: "offsetHeight",
            alternateSizingProperty: "width",
            positioningProperty: "top",
            mousePositioningProperty: "pageY"
        };

    var horizontalDefaults = {
            sizingProperty: "width",
            sizingDomProperty: "offsetWidth",
            alternateSizingProperty: "height",
            positioningProperty: "left",
            mousePositioningProperty: "pageX"
        };

    function PaneResizing(splitter) {
        var that = this,
            orientation = splitter.orientation;

        that.owner = splitter;
        that._element = splitter.element;
        that.orientation = orientation;

        extend(that, orientation === HORIZONTAL ? horizontalDefaults : verticalDefaults);

        that._resizable = new kendo.ui.Resizable(splitter.element, {
            orientation: orientation,
            handle: ".k-splitbar-draggable-" + orientation + "[data-marker=" + splitter._marker + "]",
            hint: proxy(that._createHint, that),
            start: proxy(that._start, that),
            max: proxy(that._max, that),
            min: proxy(that._min, that),
            invalidClass:"k-restricted-size-" + orientation,
            resizeend: proxy(that._stop, that)
        });
    }

    PaneResizing.prototype = {
        press: function(target) {
            this._resizable.press(target);
        },

        move: function(delta, target) {
            if (!this.pressed) {
                this.press(target);
                this.pressed = true;
            }

            if (!this._resizable.target) {
                this._resizable.press(target);
            }

            this._resizable.move(delta);
        },

        end: function() {
            this._resizable.end();
            this.pressed = false;
        },

        destroy: function() {
            this._resizable.destroy();
            this._resizable = this._element = this.owner = null;
        },

        isResizing: function() {
            return this._resizable.resizing;
        },

        _createHint: function(handle) {
            var that = this;
            return $("<div class='k-ghost-splitbar k-ghost-splitbar-" + that.orientation + " k-state-default' />")
                        .css(that.alternateSizingProperty, handle[that.alternateSizingProperty]());
        },

        _start: function(e) {
            var that = this,
                splitbar = $(e.currentTarget),
                previousPane = splitbar.prev(),
                nextPane = splitbar.next(),
                previousPaneConfig = previousPane.data(PANE),
                nextPaneConfig = nextPane.data(PANE),
                prevBoundary = parseInt(previousPane[0].style[that.positioningProperty], 10),
                nextBoundary = parseInt(nextPane[0].style[that.positioningProperty], 10) + nextPane[0][that.sizingDomProperty] - splitbar[0][that.sizingDomProperty],
                totalSize = parseInt(that._element.css(that.sizingProperty), 10),
                toPx = function (value) {
                    var val = parseInt(value, 10);
                    return (isPixelSize(value) ? val : (totalSize * val) / 100) || 0;
                },
                prevMinSize = toPx(previousPaneConfig.min),
                prevMaxSize = toPx(previousPaneConfig.max) || nextBoundary - prevBoundary,
                nextMinSize = toPx(nextPaneConfig.min),
                nextMaxSize = toPx(nextPaneConfig.max) || nextBoundary - prevBoundary;

            that.previousPane = previousPane;
            that.nextPane = nextPane;
            that._maxPosition = Math.min(nextBoundary - nextMinSize, prevBoundary + prevMaxSize);
            that._minPosition = Math.max(prevBoundary + prevMinSize, nextBoundary - nextMaxSize);
        },
        _max: function() {
              return this._maxPosition;
        },
        _min: function() {
            return this._minPosition;
        },
        _stop: function(e) {
            var that = this,
                splitbar = $(e.currentTarget),
                owner = that.owner;

            owner._panes().children(".k-splitter-overlay").remove();

            if (e.keyCode !== kendo.keys.ESC) {
                var ghostPosition = e.position,
                    previousPane = splitbar.prev(),
                    nextPane = splitbar.next(),
                    previousPaneConfig = previousPane.data(PANE),
                    nextPaneConfig = nextPane.data(PANE),
                    previousPaneNewSize = ghostPosition - parseInt(previousPane[0].style[that.positioningProperty], 10),
                    nextPaneNewSize = parseInt(nextPane[0].style[that.positioningProperty], 10) + nextPane[0][that.sizingDomProperty] - ghostPosition - splitbar[0][that.sizingDomProperty],
                    fluidPanesCount = that._element.children(PANECLASS).filter(function() { return isFluid($(this).data(PANE).size); }).length;

                if (!isFluid(previousPaneConfig.size) || fluidPanesCount > 1) {
                    if (isFluid(previousPaneConfig.size)) {
                        fluidPanesCount--;
                    }

                    previousPaneConfig.size = previousPaneNewSize + "px";
                }

                if (!isFluid(nextPaneConfig.size) || fluidPanesCount > 1) {
                    nextPaneConfig.size = nextPaneNewSize + "px";
                }

                owner.resize(true);
            }

            return false;
        }
    };

})(window.kendo.jQuery);





(function($, undefined) {
    var kendo = window.kendo,
        support = kendo.support,
        ui = kendo.ui,
        Widget = ui.Widget,
        keys = kendo.keys,
        parse = kendo.parseDate,
        adjustDST = kendo.date.adjustDST,
        extractFormat = kendo._extractFormat,
        template = kendo.template,
        getCulture = kendo.getCulture,
        transitions = kendo.support.transitions,
        transitionOrigin = transitions ? transitions.css + "transform-origin" : "",
        cellTemplate = template('<td#=data.cssClass# role="gridcell"><a tabindex="-1" class="k-link" href="\\#" data-#=data.ns#value="#=data.dateString#">#=data.value#</a></td>', { useWithBlock: false }),
        emptyCellTemplate = template('<td role="gridcell">&nbsp;</td>', { useWithBlock: false }),
        browser = kendo.support.browser,
        isIE8 = browser.msie && browser.version < 9,
        ns = ".kendoCalendar",
        CLICK = "click" + ns,
        KEYDOWN_NS = "keydown" + ns,
        ID = "id",
        MIN = "min",
        LEFT = "left",
        SLIDE = "slideIn",
        MONTH = "month",
        CENTURY = "century",
        CHANGE = "change",
        NAVIGATE = "navigate",
        VALUE = "value",
        HOVER = "k-state-hover",
        DISABLED = "k-state-disabled",
        FOCUSED = "k-state-focused",
        OTHERMONTH = "k-other-month",
        OTHERMONTHCLASS = ' class="' + OTHERMONTH + '"',
        TODAY = "k-nav-today",
        CELLSELECTOR = "td:has(.k-link)",
        BLUR = "blur" + ns,
        FOCUS = "focus",
        FOCUS_WITH_NS = FOCUS + ns,
        MOUSEENTER = support.touch ? "touchstart" : "mouseenter",
        MOUSEENTER_WITH_NS = support.touch ? "touchstart" + ns : "mouseenter" + ns,
        MOUSELEAVE = support.touch ? "touchend" + ns + " touchmove" + ns : "mouseleave" + ns,
        MS_PER_MINUTE = 60000,
        MS_PER_DAY = 86400000,
        PREVARROW = "_prevArrow",
        NEXTARROW = "_nextArrow",
        ARIA_DISABLED = "aria-disabled",
        ARIA_SELECTED = "aria-selected",
        proxy = $.proxy,
        extend = $.extend,
        DATE = Date,
        views = {
            month: 0,
            year: 1,
            decade: 2,
            century: 3
        };

    var Calendar = Widget.extend({
        init: function(element, options) {
            var that = this, value, id;

            Widget.fn.init.call(that, element, options);

            element = that.wrapper = that.element;
            options = that.options;

            options.url = window.unescape(options.url);

            that._templates();

            that._header();

            that._footer(that.footer);

            id = element
                    .addClass("k-widget k-calendar")
                    .on(MOUSEENTER_WITH_NS + " " + MOUSELEAVE, CELLSELECTOR, mousetoggle)
                    .on(KEYDOWN_NS, "table.k-content", proxy(that._move, that))
                    .on(CLICK, CELLSELECTOR, function(e) {
                        var link = e.currentTarget.firstChild;

                        if (link.href.indexOf("#") != -1) {
                            e.preventDefault();
                        }

                        that._click($(link));
                    })
                    .on("mouseup" + ns, "table.k-content, .k-footer", function() {
                        that._focusView(that.options.focusOnNav !== false);
                    })
                    .attr(ID);

            if (id) {
                that._cellID = id + "_cell_selected";
            }

            normalize(options);
            value = parse(options.value, options.format, options.culture);

            that._index = views[options.start];
            that._current = new DATE(+restrictValue(value, options.min, options.max));

            that._addClassProxy = function() {
                that._active = true;
                that._cell.addClass(FOCUSED);
            };

            that._removeClassProxy = function() {
                that._active = false;
                that._cell.removeClass(FOCUSED);
            };

            that.value(value);

            kendo.notify(that);
        },

        options: {
            name: "Calendar",
            value: null,
            min: new DATE(1900, 0, 1),
            max: new DATE(2099, 11, 31),
            dates: [],
            url: "",
            culture: "",
            footer : "",
            format : "",
            month : {},
            start: MONTH,
            depth: MONTH,
            animation: {
                horizontal: {
                    effects: SLIDE,
                    reverse: true,
                    duration: 500,
                    divisor: 2
                },
                vertical: {
                    effects: "zoomIn",
                    duration: 400
                }
            }
        },

        events: [
            CHANGE,
            NAVIGATE
        ],

        setOptions: function(options) {
            var that = this;

            normalize(options);

            if (!options.dates[0]) {
                options.dates = that.options.dates;
            }

            Widget.fn.setOptions.call(that, options);

            that._templates();

            that._footer(that.footer);
            that._index = views[that.options.start];

            that.navigate();
        },

        destroy: function() {
            var that = this,
                today = that._today;

            that.element.off(ns);
            that._title.off(ns);
            that[PREVARROW].off(ns);
            that[NEXTARROW].off(ns);

            kendo.destroy(that._table);

            if (today) {
                kendo.destroy(today.off(ns));
            }

            Widget.fn.destroy.call(that);
        },

        current: function() {
            return this._current;
        },

        view: function() {
            return this._view;
        },

        focus: function(table) {
            table = table || this._table;
            this._bindTable(table);
            table.focus();
        },

        min: function(value) {
            return this._option(MIN, value);
        },

        max: function(value) {
            return this._option("max", value);
        },

        navigateToPast: function() {
            this._navigate(PREVARROW, -1);
        },

        navigateToFuture: function() {
            this._navigate(NEXTARROW, 1);
        },

        navigateUp: function() {
            var that = this,
                index = that._index;

            if (that._title.hasClass(DISABLED)) {
                return;
            }

            that.navigate(that._current, ++index);
        },

        navigateDown: function(value) {
            var that = this,
            index = that._index,
            depth = that.options.depth;

            if (!value) {
                return;
            }

            if (index === views[depth]) {
                if (+that._value != +value) {
                    that.value(value);
                    that.trigger(CHANGE);
                }
                return;
            }

            that.navigate(value, --index);
        },

        navigate: function(value, view) {
            view = isNaN(view) ? views[view] : view;

            var that = this,
                options = that.options,
                culture = options.culture,
                min = options.min,
                max = options.max,
                title = that._title,
                from = that._table,
                old = that._oldTable,
                selectedValue = that._value,
                currentValue = that._current,
                future = value && +value > +currentValue,
                vertical = view !== undefined && view !== that._index,
                to, currentView, compare,
                disabled;

            if (!value) {
                value = currentValue;
            }

            that._current = value = new DATE(+restrictValue(value, min, max));

            if (view === undefined) {
                view = that._index;
            } else {
                that._index = view;
            }

            that._view = currentView = calendar.views[view];
            compare = currentView.compare;

            disabled = view === views[CENTURY];
            title.toggleClass(DISABLED, disabled).attr(ARIA_DISABLED, disabled);

            disabled = compare(value, min) < 1;
            that[PREVARROW].toggleClass(DISABLED, disabled).attr(ARIA_DISABLED, disabled);

            disabled = compare(value, max) > -1;
            that[NEXTARROW].toggleClass(DISABLED, disabled).attr(ARIA_DISABLED, disabled);

            if (from && old && old.data("animating")) {
                old.kendoStop(true, true);
                from.kendoStop(true, true);
            }

            that._oldTable = from;

            if (!from || that._changeView) {
                title.html(currentView.title(value, min, max, culture));

                that._table = to = $(currentView.content(extend({
                    min: min,
                    max: max,
                    date: value,
                    url: options.url,
                    dates: options.dates,
                    format: options.format,
                    culture: culture
                }, that[currentView.name])));

                makeUnselectable(to);

                that._animate({
                    from: from,
                    to: to,
                    vertical: vertical,
                    future: future
                });

                that._focus(value);
                that.trigger(NAVIGATE);
            }

            if (view === views[options.depth] && selectedValue) {
                that._class("k-state-selected", currentView.toDateString(selectedValue));
            }

            that._class(FOCUSED, currentView.toDateString(value));

            if (!from && that._cell) {
                that._cell.removeClass(FOCUSED);
            }

            that._changeView = true;
        },

        value: function(value) {
            var that = this,
            view = that._view,
            options = that.options,
            old = that._view,
            min = options.min,
            max = options.max;

            if (value === undefined) {
                return that._value;
            }

            value = parse(value, options.format, options.culture);

            if (value !== null) {
                value = new DATE(+value);

                if (!isInRange(value, min, max)) {
                    value = null;
                }
            }

            that._value = value;

            if (old && value === null && that._cell) {
                that._cell.removeClass("k-state-selected");
            } else {
                that._changeView = !value || view && view.compare(value, that._current) !== 0;
                that.navigate(value);
            }
        },

        _move: function(e) {
            var that = this,
                options = that.options,
                key = e.keyCode,
                view = that._view,
                index = that._index,
                currentValue = new DATE(+that._current),
                isRtl = kendo.support.isRtl(that.wrapper),
                value, prevent, method, temp;

            if (e.target === that._table[0]) {
                that._active = true;
            }

            if (e.ctrlKey) {
                if (key == keys.RIGHT && !isRtl || key == keys.LEFT && isRtl) {
                    that.navigateToFuture();
                    prevent = true;
                } else if (key == keys.LEFT && !isRtl || key == keys.RIGHT && isRtl) {
                    that.navigateToPast();
                    prevent = true;
                } else if (key == keys.UP) {
                    that.navigateUp();
                    prevent = true;
                } else if (key == keys.DOWN) {
                    that._click($(that._cell[0].firstChild));
                    prevent = true;
                }
            } else {
                if (key == keys.RIGHT && !isRtl || key == keys.LEFT && isRtl) {
                    value = 1;
                    prevent = true;
                } else if (key == keys.LEFT && !isRtl || key == keys.RIGHT && isRtl) {
                    value = -1;
                    prevent = true;
                } else if (key == keys.UP) {
                    value = index === 0 ? -7 : -4;
                    prevent = true;
                } else if (key == keys.DOWN) {
                    value = index === 0 ? 7 : 4;
                    prevent = true;
                } else if (key == keys.ENTER) {
                    that._click($(that._cell[0].firstChild));
                    prevent = true;
                } else if (key == keys.HOME || key == keys.END) {
                    method = key == keys.HOME ? "first" : "last";
                    temp = view[method](currentValue);
                    currentValue = new DATE(temp.getFullYear(), temp.getMonth(), temp.getDate(), currentValue.getHours(), currentValue.getMinutes(), currentValue.getSeconds(), currentValue.getMilliseconds());
                    prevent = true;
                } else if (key == keys.PAGEUP) {
                    prevent = true;
                    that.navigateToPast();
                } else if (key == keys.PAGEDOWN) {
                    prevent = true;
                    that.navigateToFuture();
                }

                if (value || method) {
                    if (!method) {
                        view.setDate(currentValue, value);
                    }

                    that._focus(restrictValue(currentValue, options.min, options.max));
                }
            }

            if (prevent) {
                e.preventDefault();
            }

            return that._current;
        },

        _animate: function(options) {
            var that = this,
                from = options.from,
                to = options.to,
                active = that._active;

            if (!from) {
                to.insertAfter(that.element[0].firstChild);
                that._bindTable(to);
            } else if (from.parent().data("animating")) {
                from.off(ns);
                from.parent().kendoStop(true, true).remove();
                from.remove();

                to.insertAfter(that.element[0].firstChild);
                that._focusView(active);
            } else if (!from.is(":visible") || that.options.animation === false) {
                to.insertAfter(from);
                from.off(ns).remove();

                that._focusView(active);
            } else {
                that[options.vertical ? "_vertical" : "_horizontal"](from, to, options.future);
            }
        },

        _horizontal: function(from, to, future) {
            var that = this,
                active = that._active,
                horizontal = that.options.animation.horizontal,
                effects = horizontal.effects,
                viewWidth = from.outerWidth();

            if (effects && effects.indexOf(SLIDE) != -1) {
                from.add(to).css({ width: viewWidth });

                from.wrap("<div/>");

                that._focusView(active, from);

                from.parent()
                    .css({
                        position: "relative",
                        width: viewWidth * 2,
                        "float": LEFT,
                        "margin-left": future ? 0 : -viewWidth
                    });

                to[future ? "insertAfter" : "insertBefore"](from);

                extend(horizontal, {
                    effects: SLIDE + ":" + (future ? "right" : LEFT),
                    complete: function() {
                        from.off(ns).remove();
                        that._oldTable = null;

                        to.unwrap();

                        that._focusView(active);

                    }
                });

                from.parent().kendoStop(true, true).kendoAnimate(horizontal);
            }
        },

        _vertical: function(from, to) {
            var that = this,
                vertical = that.options.animation.vertical,
                effects = vertical.effects,
                active = that._active, //active state before from's blur
                cell, position;

            if (effects && effects.indexOf("zoom") != -1) {
                to.css({
                    position: "absolute",
                    top: from.prev().outerHeight(),
                    left: 0
                }).insertBefore(from);

                if (transitionOrigin) {
                    cell = that._cellByDate(that._view.toDateString(that._current));
                    position = cell.position();
                    position = (position.left + parseInt(cell.width() / 2, 10)) + "px" + " " + (position.top + parseInt(cell.height() / 2, 10) + "px");
                    to.css(transitionOrigin, position);
                }

                from.kendoStop(true, true).kendoAnimate({
                    effects: "fadeOut",
                    duration: 600,
                    complete: function() {
                        from.off(ns).remove();
                        that._oldTable = null;

                        to.css({
                            position: "static",
                            top: 0,
                            left: 0
                        });

                        that._focusView(active);
                    }
                });

                to.kendoStop(true, true).kendoAnimate(vertical);
            }
        },

        _cellByDate: function(value) {
            return this._table.find("td:not(." + OTHERMONTH + ")")
                       .filter(function() {
                           return $(this.firstChild).attr(kendo.attr(VALUE)) === value;
                       });
        },

        _class: function(className, value) {
            var that = this,
                id = that._cellID,
                cell = that._cell;

            if (cell) {
                cell.removeAttr(ARIA_SELECTED)
                    .removeAttr("aria-label")
                    .removeAttr(ID);
            }

            cell = that._table
                       .find("td:not(." + OTHERMONTH + ")")
                       .removeClass(className)
                       .filter(function() {
                          return $(this.firstChild).attr(kendo.attr(VALUE)) === value;
                       })
                       .attr(ARIA_SELECTED, true);

            if (className === FOCUSED && !that._active && that.options.focusOnNav !== false) {
                className = "";
            }

            cell.addClass(className);

            if (cell[0]) {
                that._cell = cell;
            }

            if (id) {
                cell.attr(ID, id);
                that._table.removeAttr("aria-activedescendant").attr("aria-activedescendant", id);
            }
        },

        _bindTable: function (table) {
            table
                .on(FOCUS_WITH_NS, this._addClassProxy)
                .on(BLUR, this._removeClassProxy);
        },

        _click: function(link) {
            var that = this,
                options = that.options,
                currentValue = new Date(+that._current),
                value = link.attr(kendo.attr(VALUE)).split("/");

            //Safari cannot create correctly date from "1/1/2090"
            value = new DATE(value[0], value[1], value[2]);
            adjustDST(value, 0);

            that._view.setDate(currentValue, value);

            that.navigateDown(restrictValue(currentValue, options.min, options.max));
        },

        _focus: function(value) {
            var that = this,
                view = that._view;

            if (view.compare(value, that._current) !== 0) {
                that.navigate(value);
            } else {
                that._current = value;
                that._class(FOCUSED, view.toDateString(value));
            }
        },

        _focusView: function(active, table) {
            if (active) {
                this.focus(table);
            }
        },

        _footer: function(template) {
            var that = this,
                today = getToday(),
                element = that.element,
                footer = element.find(".k-footer");

            if (!template) {
                that._toggle(false);
                footer.hide();
                return;
            }

            if (!footer[0]) {
                footer = $('<div class="k-footer"><a href="#" class="k-link k-nav-today"></a></div>').appendTo(element);
            }

            that._today = footer.show()
                                .find(".k-link")
                                .html(template(today))
                                .attr("title", kendo.toString(today, "D", that.options.culture));

            that._toggle();
        },

        _header: function() {
            var that = this,
            element = that.element,
            links;

            if (!element.find(".k-header")[0]) {
                element.html('<div class="k-header">' +
                             '<a href="#" role="button" class="k-link k-nav-prev"><span class="k-icon k-i-arrow-w"></span></a>' +
                             '<a href="#" role="button" aria-live="assertive" aria-atomic="true" class="k-link k-nav-fast"></a>' +
                             '<a href="#" role="button" class="k-link k-nav-next"><span class="k-icon k-i-arrow-e"></span></a>' +
                             '</div>');
            }

            links = element.find(".k-link")
                           .on(MOUSEENTER_WITH_NS + " " + MOUSELEAVE + " " + FOCUS_WITH_NS + " " + BLUR, mousetoggle)
                           .click(false);

            that._title = links.eq(1).on(CLICK, function() { that._active = that.options.focusOnNav !== false; that.navigateUp(); });
            that[PREVARROW] = links.eq(0).on(CLICK, function() { that._active = that.options.focusOnNav !== false; that.navigateToPast(); });
            that[NEXTARROW] = links.eq(2).on(CLICK, function() { that._active = that.options.focusOnNav !== false; that.navigateToFuture(); });
        },

        _navigate: function(arrow, modifier) {
            var that = this,
                index = that._index + 1,
                currentValue = new DATE(+that._current);

            arrow = that[arrow];

            if (!arrow.hasClass(DISABLED)) {
                if (index > 3) {
                    currentValue.setFullYear(currentValue.getFullYear() + 100 * modifier);
                } else {
                    calendar.views[index].setDate(currentValue, modifier);
                }

                that.navigate(currentValue);
            }
        },

        _option: function(option, value) {
            var that = this,
                options = that.options,
                currentValue = that._value || that._current,
                isBigger;

            if (value === undefined) {
                return options[option];
            }

            value = parse(value, options.format, options.culture);

            if (!value) {
                return;
            }

            options[option] = new DATE(+value);

            if (option === MIN) {
                isBigger = value > currentValue;
            } else {
                isBigger = currentValue > value;
            }

            if (isBigger || isEqualMonth(currentValue, value)) {
                if (isBigger) {
                    that._value = null;
                }
                that._changeView = true;
            }

            if (!that._changeView) {
                that._changeView = !!(options.month.content || options.month.empty);
            }

            that.navigate(that._value);

            that._toggle();
        },

        _toggle: function(toggle) {
            var that = this,
                options = that.options,
                link = that._today;

            if (toggle === undefined) {
                toggle = isInRange(getToday(), options.min, options.max);
            }

            if (link) {
                link.off(CLICK);

                if (toggle) {
                    link.addClass(TODAY)
                        .removeClass(DISABLED)
                        .on(CLICK, proxy(that._todayClick, that));
                } else {
                    link.removeClass(TODAY)
                        .addClass(DISABLED)
                        .on(CLICK, prevent);
                }
            }
        },

        _todayClick: function(e) {
            var that = this,
                depth = views[that.options.depth],
                today = getToday();

            e.preventDefault();

            if (that._view.compare(that._current, today) === 0 && that._index == depth) {
                that._changeView = false;
            }

            that._value = today;
            that.navigate(today, depth);

            that.trigger(CHANGE);
        },

        _templates: function() {
            var that = this,
                options = that.options,
                footer = options.footer,
                month = options.month,
                content = month.content,
                empty = month.empty;

            that.month = {
                content: template('<td#=data.cssClass# role="gridcell"><a tabindex="-1" class="k-link#=data.linkClass#" href="#=data.url#" ' + kendo.attr("value") + '="#=data.dateString#" title="#=data.title#">' + (content || "#=data.value#") + '</a></td>', { useWithBlock: !!content }),
                empty: template('<td role="gridcell">' + (empty || "&nbsp;") + "</td>", { useWithBlock: !!empty })
            };

            that.footer = footer !== false ? template(footer || '#= kendo.toString(data,"D","' + options.culture +'") #', { useWithBlock: false }) : null;
        }
    });

    ui.plugin(Calendar);

    var calendar = {
        firstDayOfMonth: function (date) {
            return new DATE(
                date.getFullYear(),
                date.getMonth(),
                1
            );
        },

        firstVisibleDay: function (date, calendarInfo) {
            calendarInfo = calendarInfo || kendo.culture().calendar;

            var firstDay = calendarInfo.firstDay,
            firstVisibleDay = new DATE(date.getFullYear(), date.getMonth(), 0, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());

            while (firstVisibleDay.getDay() != firstDay) {
                calendar.setTime(firstVisibleDay, -1 * MS_PER_DAY);
            }

            return firstVisibleDay;
        },

        setTime: function (date, time) {
            var tzOffsetBefore = date.getTimezoneOffset(),
            resultDATE = new DATE(date.getTime() + time),
            tzOffsetDiff = resultDATE.getTimezoneOffset() - tzOffsetBefore;

            date.setTime(resultDATE.getTime() + tzOffsetDiff * MS_PER_MINUTE);
        },
        views: [{
            name: MONTH,
            title: function(date, min, max, culture) {
                return getCalendarInfo(culture).months.names[date.getMonth()] + " " + date.getFullYear();
            },
            content: function(options) {
                var that = this,
                idx = 0,
                min = options.min,
                max = options.max,
                date = options.date,
                dates = options.dates,
                format = options.format,
                culture = options.culture,
                navigateUrl = options.url,
                hasUrl = navigateUrl && dates[0],
                currentCalendar = getCalendarInfo(culture),
                firstDayIdx = currentCalendar.firstDay,
                days = currentCalendar.days,
                names = shiftArray(days.names, firstDayIdx),
                shortNames = shiftArray(days.namesShort, firstDayIdx),
                start = calendar.firstVisibleDay(date, currentCalendar),
                firstDayOfMonth = that.first(date),
                lastDayOfMonth = that.last(date),
                toDateString = that.toDateString,
                today = new DATE(),
                html = '<table tabindex="0" role="grid" class="k-content" cellspacing="0"><thead><tr role="row">';

                for (; idx < 7; idx++) {
                    html += '<th scope="col" title="' + names[idx] + '">' + shortNames[idx] + '</th>';
                }

                today = new DATE(today.getFullYear(), today.getMonth(), today.getDate());
                adjustDST(today, 0);
                today = +today;

                return view({
                    cells: 42,
                    perRow: 7,
                    html: html += '</tr></thead><tbody><tr role="row">',
                    start: new DATE(start.getFullYear(), start.getMonth(), start.getDate()),
                    min: new DATE(min.getFullYear(), min.getMonth(), min.getDate()),
                    max: new DATE(max.getFullYear(), max.getMonth(), max.getDate()),
                    content: options.content,
                    empty: options.empty,
                    setter: that.setDate,
                    build: function(date) {
                        var cssClass = [],
                            day = date.getDay(),
                            linkClass = "",
                            url = "#";

                        if (date < firstDayOfMonth || date > lastDayOfMonth) {
                            cssClass.push(OTHERMONTH);
                        }

                        if (+date === today) {
                            cssClass.push("k-today");
                        }

                        if (day === 0 || day === 6) {
                            cssClass.push("k-weekend");
                        }

                        if (hasUrl && inArray(+date, dates)) {
                            url = navigateUrl.replace("{0}", kendo.toString(date, format, culture));
                            linkClass = " k-action-link";
                        }

                        return {
                            date: date,
                            dates: dates,
                            ns: kendo.ns,
                            title: kendo.toString(date, "D", culture),
                            value: date.getDate(),
                            dateString: toDateString(date),
                            cssClass: cssClass[0] ? ' class="' + cssClass.join(" ") + '"' : "",
                            linkClass: linkClass,
                            url: url
                        };
                    }
                });
            },
            first: function(date) {
                return calendar.firstDayOfMonth(date);
            },
            last: function(date) {
                var last = new DATE(date.getFullYear(), date.getMonth() + 1, 0),
                    first = calendar.firstDayOfMonth(date),
                    timeOffset = Math.abs(last.getTimezoneOffset() - first.getTimezoneOffset());

                if (timeOffset) {
                    last.setHours(first.getHours() + (timeOffset / 60));
                }

                return last;
            },
            compare: function(date1, date2) {
                var result,
                month1 = date1.getMonth(),
                year1 = date1.getFullYear(),
                month2 = date2.getMonth(),
                year2 = date2.getFullYear();

                if (year1 > year2) {
                    result = 1;
                } else if (year1 < year2) {
                    result = -1;
                } else {
                    result = month1 == month2 ? 0 : month1 > month2 ? 1 : -1;
                }

                return result;
            },
            setDate: function(date, value) {
                var hours = date.getHours();
                if (value instanceof DATE) {
                    date.setFullYear(value.getFullYear(), value.getMonth(), value.getDate());
                } else {
                    calendar.setTime(date, value * MS_PER_DAY);
                }
                adjustDST(date, hours);
            },
            toDateString: function(date) {
                return date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate();
            }
        },
        {
            name: "year",
            title: function(date) {
                return date.getFullYear();
            },
            content: function(options) {
                var namesAbbr = getCalendarInfo(options.culture).months.namesAbbr,
                toDateString = this.toDateString,
                min = options.min,
                max = options.max;

                return view({
                    min: new DATE(min.getFullYear(), min.getMonth(), 1),
                    max: new DATE(max.getFullYear(), max.getMonth(), 1),
                    start: new DATE(options.date.getFullYear(), 0, 1),
                    setter: this.setDate,
                    build: function(date) {
                        return {
                            value: namesAbbr[date.getMonth()],
                            ns: kendo.ns,
                            dateString: toDateString(date),
                            cssClass: ""
                        };
                    }
                });
            },
            first: function(date) {
                return new DATE(date.getFullYear(), 0, date.getDate());
            },
            last: function(date) {
                return new DATE(date.getFullYear(), 11, date.getDate());
            },
            compare: function(date1, date2){
                return compare(date1, date2);
            },
            setDate: function(date, value) {
                var month,
                    hours = date.getHours();

                if (value instanceof DATE) {
                    month = value.getMonth();

                    date.setFullYear(value.getFullYear(), month, date.getDate());

                    if (month !== date.getMonth()) {
                        date.setDate(0);
                    }
                } else {
                    month = date.getMonth() + value;

                    date.setMonth(month);

                    if (month > 11) {
                        month -= 12;
                    }

                    if (month > 0 && date.getMonth() != month) {
                        date.setDate(0);
                    }
                }

                adjustDST(date, hours);
            },
            toDateString: function(date) {
                return date.getFullYear() + "/" + date.getMonth() + "/1";
            }
        },
        {
            name: "decade",
            title: function(date, min, max) {
                return title(date, min, max, 10);
            },
            content: function(options) {
                var year = options.date.getFullYear(),
                toDateString = this.toDateString;

                return view({
                    start: new DATE(year - year % 10 - 1, 0, 1),
                    min: new DATE(options.min.getFullYear(), 0, 1),
                    max: new DATE(options.max.getFullYear(), 0, 1),
                    setter: this.setDate,
                    build: function(date, idx) {
                        return {
                            value: date.getFullYear(),
                            ns: kendo.ns,
                            dateString: toDateString(date),
                            cssClass: idx === 0 || idx == 11 ? OTHERMONTHCLASS : ""
                        };
                    }
                });
            },
            first: function(date) {
                var year = date.getFullYear();
                return new DATE(year - year % 10, date.getMonth(), date.getDate());
            },
            last: function(date) {
                var year = date.getFullYear();
                return new DATE(year - year % 10 + 9, date.getMonth(), date.getDate());
            },
            compare: function(date1, date2) {
                return compare(date1, date2, 10);
            },
            setDate: function(date, value) {
                setDate(date, value, 1);
            },
            toDateString: function(date) {
                return date.getFullYear() + "/0/1";
            }
        },
        {
            name: CENTURY,
            title: function(date, min, max) {
                return title(date, min, max, 100);
            },
            content: function(options) {
                var year = options.date.getFullYear(),
                min = options.min.getFullYear(),
                max = options.max.getFullYear(),
                toDateString = this.toDateString,
                minYear = min,
                maxYear = max;

                minYear = minYear - minYear % 10;
                maxYear = maxYear - maxYear % 10;

                if (maxYear - minYear < 10) {
                    maxYear = minYear + 9;
                }

                return view({
                    start: new DATE(year - year % 100 - 10, 0, 1),
                    min: new DATE(minYear, 0, 1),
                    max: new DATE(maxYear, 0, 1),
                    setter: this.setDate,
                    build: function(date, idx) {
                        var start = date.getFullYear(),
                            end = start + 9;

                        if (start < min) {
                            start = min;
                        }

                        if (end > max) {
                            end = max;
                        }

                        return {
                            ns: kendo.ns,
                            value: start + " - " + end,
                            dateString: toDateString(date),
                            cssClass: idx === 0 || idx == 11 ? OTHERMONTHCLASS : ""
                        };
                    }
                });
            },
            first: function(date) {
                var year = date.getFullYear();
                return new DATE(year - year % 100, date.getMonth(), date.getDate());
            },
            last: function(date) {
                var year = date.getFullYear();
                return new DATE(year - year % 100 + 99, date.getMonth(), date.getDate());
            },
            compare: function(date1, date2) {
                return compare(date1, date2, 100);
            },
            setDate: function(date, value) {
                setDate(date, value, 10);
            },
            toDateString: function(date) {
                var year = date.getFullYear();
                return (year - year % 10) + "/0/1";
            }
        }]
    };

    function title(date, min, max, modular) {
        var start = date.getFullYear(),
            minYear = min.getFullYear(),
            maxYear = max.getFullYear(),
            end;

        start = start - start % modular;
        end = start + (modular - 1);

        if (start < minYear) {
            start = minYear;
        }
        if (end > maxYear) {
            end = maxYear;
        }

        return start + "-" + end;
    }

    function view(options) {
        var idx = 0,
            data,
            min = options.min,
            max = options.max,
            start = options.start,
            setter = options.setter,
            build = options.build,
            length = options.cells || 12,
            cellsPerRow = options.perRow || 4,
            content = options.content || cellTemplate,
            empty = options.empty || emptyCellTemplate,
            html = options.html || '<table tabindex="0" role="grid" class="k-content k-meta-view" cellspacing="0"><tbody><tr role="row">';

        for(; idx < length; idx++) {
            if (idx > 0 && idx % cellsPerRow === 0) {
                html += '</tr><tr role="row">';
            }

            data = build(start, idx);

            html += isInRange(start, min, max) ? content(data) : empty(data);

            setter(start, 1);
        }

        return html + "</tr></tbody></table>";
    }

    function compare(date1, date2, modifier) {
        var year1 = date1.getFullYear(),
            start  = date2.getFullYear(),
            end = start,
            result = 0;

        if (modifier) {
            start = start - start % modifier;
            end = start - start % modifier + modifier - 1;
        }

        if (year1 > end) {
            result = 1;
        } else if (year1 < start) {
            result = -1;
        }

        return result;
    }

    function getToday() {
        var today = new DATE();
        return new DATE(today.getFullYear(), today.getMonth(), today.getDate());
    }

    function restrictValue (value, min, max) {
        var today = getToday();

        if (value) {
            today = new DATE(+value);
        }

        if (min > today) {
            today = new DATE(+min);
        } else if (max < today) {
            today = new DATE(+max);
        }
        return today;
    }

    function isInRange(date, min, max) {
        return +date >= +min && +date <= +max;
    }

    function shiftArray(array, idx) {
        return array.slice(idx).concat(array.slice(0, idx));
    }

    function setDate(date, value, multiplier) {
        value = value instanceof DATE ? value.getFullYear() : date.getFullYear() + multiplier * value;
        date.setFullYear(value);
    }

    function mousetoggle(e) {
        $(this).toggleClass(HOVER, MOUSEENTER.indexOf(e.type) > -1 || e.type == FOCUS);
    }

    function prevent (e) {
        e.preventDefault();
    }

    function getCalendarInfo(culture) {
        return getCulture(culture).calendars.standard;
    }

    function normalize(options) {
        var start = views[options.start],
            depth = views[options.depth],
            culture = getCulture(options.culture);

        options.format = extractFormat(options.format || culture.calendars.standard.patterns.d);

        if (isNaN(start)) {
            start = 0;
            options.start = MONTH;
        }

        if (depth === undefined || depth > start) {
            options.depth = MONTH;
        }

        if (!options.dates) {
            options.dates = [];
        }
    }

    function makeUnselectable(element) {
        if (isIE8) {
            element.find("*").attr("unselectable", "on");
        }
    }

    function inArray(date, dates) {
        for(var i = 0, length = dates.length; i < length; i++) {
            if (date === +dates[i]) {
                return true;
            }
        }
        return false;
    }

    function isEqualDatePart(value1, value2) {
        if (value1) {
            return value1.getFullYear() === value2.getFullYear() &&
                   value1.getMonth() === value2.getMonth() &&
                   value1.getDate() === value2.getDate();
        }

        return false;
    }

    function isEqualMonth(value1, value2) {
        if (value1) {
            return value1.getFullYear() === value2.getFullYear() &&
                   value1.getMonth() === value2.getMonth();
        }

        return false;
    }

    calendar.isEqualDatePart = isEqualDatePart;
    calendar.makeUnselectable =  makeUnselectable;
    calendar.restrictValue = restrictValue;
    calendar.isInRange = isInRange;
    calendar.normalize = normalize;
    calendar.viewsEnum = views;

    kendo.calendar = calendar;
})(window.kendo.jQuery);





(function ($, angular, undefined) {
    "use strict";

    if (!angular) {
        return;
    }

    /*jshint eqnull:true,loopfunc:true,-W052,-W028  */

    var module = angular.module('kendo.directives', []),
        $injector = angular.injector(['ng']),
        $parse = $injector.get('$parse'),
        $timeout = $injector.get('$timeout'),
        $defaultCompile,
        $log = $injector.get('$log');

    function withoutTimeout(f) {
        var save = $timeout;
        try {
            $timeout = function(f){ return f(); };
            return f();
        } finally {
            $timeout = save;
        }
    }

    var OPTIONS_NOW;

    var createDataSource = (function() {
        var types = {
            TreeList    : 'TreeListDataSource',
            TreeView    : 'HierarchicalDataSource',
            Scheduler   : 'SchedulerDataSource',
            PanelBar    : '$PLAIN',
            Menu        : "$PLAIN",
            ContextMenu : "$PLAIN"
        };
        var toDataSource = function(dataSource, type) {
            if (type == '$PLAIN') {
                return dataSource;
            }
            return kendo.data[type].create(dataSource);
        };
        return function(scope, element, role, source) {
            var type = types[role] || 'DataSource';
            var ds = toDataSource(scope.$eval(source), type);

            // not recursive -- this triggers when the whole data source changed
            scope.$watch(source, function(mew, old){
                if (mew !== old) {
                    var ds = toDataSource(mew, type);
                    var widget = kendoWidgetInstance(element);
                    if (widget && typeof widget.setDataSource == "function") {
                        widget.setDataSource(ds);
                    }
                }
            });
            return ds;
        };
    }());

    var ignoredAttributes = {
        kDataSource : true,
        kOptions    : true,
        kRebind     : true,
        kNgModel    : true,
        kNgDelay    : true
    };

    var ignoredOwnProperties = {
        // XXX: other names to ignore here?
        name    : true,
        title   : true,
        style   : true
    };

    function addOption(scope, options, name, value) {
        options[name] = angular.copy(scope.$eval(value));
        if (options[name] === undefined && value.match(/^\w*$/)) {
            $log.warn(name + ' attribute resolved to undefined. Maybe you meant to use a string literal like: \'' + value + '\'?');
        }
    }

    function createWidget(scope, element, attrs, widget, origAttr) {
        var kNgDelay = attrs.kNgDelay;

        if (kNgDelay) {
            var unregister = scope.$watch(kNgDelay, function(newValue, oldValue){
                if (newValue !== oldValue) {
                    unregister();
                    // remove subsequent delays, to make ng-rebind work
                    element.removeAttr(attrs.$attr.kNgDelay);
                    kNgDelay = null;
                    $timeout(createIt); // XXX: won't work without `timeout` ;-\
                }
            });

            return;
        } else {
            return createIt();
        }

        function createIt() {
            var originalElement;

            if (attrs.kRebind) {
                originalElement = $($(element)[0].cloneNode(true));
            }


            var role = widget.replace(/^kendo/, '');
            var options = angular.extend({}, attrs.defaultOptions, scope.$eval(attrs.kOptions || attrs.options));
            var ctor = $(element)[widget];

            if (!ctor) {
                window.console.error("Could not find: " + widget);
                return null;
            }

            var widgetOptions = ctor.widget.prototype.options;
            var widgetEvents = ctor.widget.prototype.events;

            $.each(attrs, function(name, value) {
                if (name === "source" || name === "kDataSource") {
                    return;
                }

                var dataName = "data" + name.charAt(0).toUpperCase() + name.slice(1);

                if (name.indexOf("on") === 0) { // let's search for such event.
                    var eventKey = name.replace(/^on./, function(prefix) {
                        return prefix.charAt(2).toLowerCase();
                    });

                    if (widgetEvents.indexOf(eventKey) > -1) {
                        options[eventKey] = value;
                    }
                } // don't elsif here - there are on* options

                if (widgetOptions.hasOwnProperty(dataName)) {
                    addOption(scope, options, dataName, value);
                } else if (widgetOptions.hasOwnProperty(name) && !ignoredOwnProperties[name]) {
                    addOption(scope, options, name, value);
                } else if (!ignoredAttributes[name]) {
                    var match = name.match(/^k(On)?([A-Z].*)/);
                    if (match) {
                        var optionName = match[2].charAt(0).toLowerCase() + match[2].slice(1);
                        if (match[1] && name != "kOnLabel" // XXX: k-on-label can be used on MobileSwitch :-\
                        ) {
                            options[optionName] = value;
                        } else {
                            if (name == "kOnLabel") {
                                optionName = "onLabel"; // XXX: that's awful.
                            }
                            addOption(scope, options, optionName, value);
                        }
                    }
                }
            });

            // parse the datasource attribute
            var dataSource = attrs.kDataSource || attrs.source;

            if (dataSource) {
                options.dataSource = createDataSource(scope, element, role, dataSource);
            }

            // deepExtend in kendo.core (used in Editor) will fail with stack
            // overflow if we don't put it in an array :-\
                options.$angular = [ scope ];

            if (element.is("select")) {
                (function(options){
                    if (options.length > 0) {
                        var first = $(options[0]);
                        if (!/\S/.test(first.text()) && /^\?/.test(first.val())) {
                            first.remove();
                        }
                    }
                }(element[0].options));
            }

            var object = ctor.call(element, OPTIONS_NOW = options).data(widget);

            exposeWidget(object, scope, attrs, widget, origAttr);

            scope.$emit("kendoWidgetCreated", object);

            var destroyRegister = destroyWidgetOnScopeDestroy(scope, object);

            if (attrs.kRebind) {
                setupRebind(object, scope, element, originalElement, attrs.kRebind, destroyRegister);
            }

            return object;
        }
    }

    function exposeWidget(widget, scope, attrs, kendoWidget, origAttr) {
        if (attrs[origAttr]) {
            var set = $parse(attrs[origAttr]).assign;
            if (set) {
                // set the value of the expression to the kendo widget object to expose its api
                set(scope, widget);
            } else {
                throw new Error(origAttr + ' attribute used but expression in it is not assignable: ' + attrs[kendoWidget]);
            }
        }
    }

    function formValue(element) {
        if (/checkbox|radio/i.test(element.attr("type"))) {
            return element.prop("checked");
        }
        return element.val();
    }

    var formRegExp = /^(input|select|textarea)$/i;

    function isForm(element) {
        return formRegExp.test(element[0].tagName);
    }

    function bindToNgModel(widget, scope, element, ngModel, ngForm) {
        if (!widget.value) {
            return;
        }

        var value;

        if (isForm(element)) {
            value = function() {
                return formValue(element);
            };
        } else {
            value = function() {
                return widget.value();
            };
        }

        // Angular will invoke $render when the view needs to be updated with the view value.
        ngModel.$render = function() {
            // Update the widget with the view value.

            // delaying with setTimout for cases where the datasource is set thereafter.
            // https://github.com/kendo-labs/angular-kendo/issues/304
            var val = ngModel.$viewValue;
            if (val === undefined) {
                val = ngModel.$modelValue;
            }
            setTimeout(function(){
                if (widget) { // might have been destroyed in between. :-(
                    widget.value(val);
                }
            }, 0);
        };

        // Some widgets trigger "change" on the input field
        // and this would result in two events sent (#135)
        var haveChangeOnElement = false;

        if (isForm(element)) {
            element.on("change", function() {
                haveChangeOnElement = true;
            });
        }

        var onChange = function(pristine) {
            return function() {
                var formPristine;
                if (haveChangeOnElement) {
                    return;
                }
                haveChangeOnElement = false;
                if (pristine && ngForm) {
                    formPristine = ngForm.$pristine;
                }
                ngModel.$setViewValue(value());
                if (pristine) {
                    ngModel.$setPristine();
                    if (formPristine) {
                        ngForm.$setPristine();
                    }
                }
                digest(scope);
            };
        };

        widget.first("change", onChange(false));
        widget.first("dataBound", onChange(true));

        var currentVal = value();

        // if the model value is undefined, then we set the widget value to match ( == null/undefined )
        if (currentVal != ngModel.$viewValue) {
            if (!ngModel.$isEmpty(ngModel.$viewValue)) {
                widget.value(ngModel.$viewValue);
            } else if (currentVal != null && currentVal !== "" && currentVal != ngModel.$viewValue) {
                ngModel.$setViewValue(currentVal);
            }
        }

        ngModel.$setPristine();
    }

    function bindToKNgModel(widget, scope, kNgModel) {
        if (typeof widget.value != "function") {
            $log.warn("k-ng-model specified on a widget that does not have the value() method: " + (widget.options.name));
            return;
        }

        var getter = $parse(kNgModel);
        var setter = getter.assign;
        var updating = false;

        widget.$angular_setLogicValue(getter(scope));

        // keep in sync
        scope.$watch(kNgModel, function(newValue, oldValue){
            if (newValue === undefined) {
                // because widget's value() method usually checks if the new value is undefined,
                // in which case it returns the current value rather than clearing the field.
                // https://github.com/telerik/kendo-ui-core/issues/299
                newValue = null;
            }
            if (updating) {
                return;
            }
            if (newValue === oldValue) {
                return;
            }
            widget.$angular_setLogicValue(newValue);
        });

        widget.first("change", function(){
            updating = true;
            scope.$apply(function(){
                setter(scope, widget.$angular_getLogicValue());
            });
            updating = false;
        });
    }

    function destroyWidgetOnScopeDestroy(scope, widget) {
        var deregister = scope.$on("$destroy", function() {
            deregister();
            if (widget) {
                if (widget.element) {
                    widget = kendoWidgetInstance(widget.element);
                    if (widget) {
                        widget.destroy();
                    }
                }
                widget = null;
            }
        });

        return deregister;
    }

    // mutation observers — propagate the original
    // element's class to the widget wrapper.
    function propagateClassToWidgetWrapper(widget, element) {
        if (!(window.MutationObserver && widget.wrapper)) {
            return;
        }

        var prevClassList = [].slice.call($(element)[0].classList);

        var mo = new MutationObserver(function(changes){
            suspend();    // make sure we don't trigger a loop
            if (!widget) {
                return;
            }

            changes.forEach(function(chg){
                var w = $(widget.wrapper)[0];
                switch (chg.attributeName) {

                    case "class":
                        // sync classes to the wrapper element
                        var currClassList = [].slice.call(chg.target.classList);
                        currClassList.forEach(function(cls){
                            if (prevClassList.indexOf(cls) < 0) {
                                w.classList.add(cls);
                                if (kendo.ui.ComboBox && widget instanceof kendo.ui.ComboBox) { // https://github.com/kendo-labs/angular-kendo/issues/356
                                    widget.input[0].classList.add(cls);
                                }
                            }
                        });
                        prevClassList.forEach(function(cls){
                            if (currClassList.indexOf(cls) < 0) {
                                w.classList.remove(cls);
                                if (kendo.ui.ComboBox && widget instanceof kendo.ui.ComboBox) { // https://github.com/kendo-labs/angular-kendo/issues/356
                                    widget.input[0].classList.remove(cls);
                                }
                            }
                        });
                        prevClassList = currClassList;
                        break;

                    case "disabled":
                        if (typeof widget.enable == "function") {
                            widget.enable(!$(chg.target).attr("disabled"));
                        }
                        break;

                    case "readonly":
                        if (typeof widget.readonly == "function") {
                            widget.readonly(!!$(chg.target).attr("readonly"));
                        }
                        break;
                }
            });

            resume();
        });

        function suspend() {
            mo.disconnect();
        }

        function resume() {
            mo.observe($(element)[0], { attributes: true });
        }

        resume();
        widget.first("destroy", suspend);
    }

    function setupRebind(widget, scope, element, originalElement, rebindAttr, destroyRegister) {
        // watch for changes on the expression passed in the k-rebind attribute
        var unregister = scope.$watch(rebindAttr, function(newValue, oldValue) {
            if (newValue !== oldValue) {
                unregister(); // this watcher will be re-added if we compile again!

                /****************************************************************
                // XXX: this is a gross hack that might not even work with all
                // widgets.  we need to destroy the current widget and get its
                // wrapper element out of the DOM, then make the original element
                // visible so we can initialize a new widget on it.
                //
                // kRebind is probably impossible to get right at the moment.
                ****************************************************************/

                var _wrapper = $(widget.wrapper)[0];
                var _element = $(widget.element)[0];
                var compile = element.injector().get("$compile");
                widget.destroy();

                if (destroyRegister) {
                    destroyRegister();
                }

                widget = null;

                if (_wrapper && _element) {
                    _wrapper.parentNode.replaceChild(_element, _wrapper);
                    $(element).replaceWith(originalElement);
                }

                compile(originalElement)(scope);
            }
        }, true); // watch for object equality. Use native or simple values.
        digest(scope);
    }

    module.factory('directiveFactory', [ '$compile', function(compile) {
        var KENDO_COUNT = 0;
        var RENDERED = false;

        // caching $compile for the dirty hack upstairs. This is awful, but we happen to have elements outside of the bootstrapped root :(.
        $defaultCompile = compile;

        var create = function(role, origAttr) {

            return {
                // Parse the directive for attributes and classes
                restrict: "AC",
                require: [ "?ngModel", "^?form" ],
                scope: false,

                controller: [ '$scope', '$attrs', '$element', function($scope, $attrs, $element) {
                    this.template = function(key, value) {
                        $attrs[key] = kendo.stringify(value);
                    };
                }],

                link: function(scope, element, attrs, controllers) {
                    var ngModel = controllers[0];
                    var ngForm = controllers[1];

                    // we must remove data-kendo-widget-name attribute because
                    // it breaks kendo.widgetInstance; can generate all kinds
                    // of funny issues like
                    //
                    //   https://github.com/kendo-labs/angular-kendo/issues/167
                    //
                    // but we still keep the attribute without the
                    // `data-` prefix, so k-rebind would work.
                    var roleattr = role.replace(/([A-Z])/g, "-$1");
                    $(element).attr(roleattr, $(element).attr("data-" + roleattr));
                    $(element)[0].removeAttribute("data-" + roleattr);

                    ++KENDO_COUNT;

                    $timeout(function() {
                        var widget = createWidget(scope, element, attrs, role, origAttr);

                        if (!widget) {
                            return;
                        }

                        // 2 way binding: ngModel <-> widget.value()
                        if (ngModel) {
                            bindToNgModel(widget, scope, element, ngModel, ngForm);
                        }

                        // kNgModel is used for the "logical" value
                        if (attrs.kNgModel) {
                            bindToKNgModel(widget, scope, attrs.kNgModel);
                        }

                        propagateClassToWidgetWrapper(widget, element);

                        --KENDO_COUNT;
                        if (KENDO_COUNT === 0) {
                            if (!RENDERED) {
                                RENDERED = true;
                                scope.$emit("kendoRendered");
                                $("form").each(function(){
                                    var form = $(this).controller("form");
                                    if (form) {
                                        form.$setPristine();
                                    }
                                });
                            }
                        }
                    });
                }
            };
        };

        return {
            create: create
        };
    }]);

    var TAGNAMES = {
        Editor         : "textarea",
        NumericTextBox : "input",
        DatePicker     : "input",
        DateTimePicker : "input",
        TimePicker     : "input",
        AutoComplete   : "input",
        ColorPicker    : "input",
        MaskedTextBox  : "input",
        MultiSelect    : "input",
        Upload         : "input",
        Validator      : "form",
        Button         : "button",
        MobileButton        : "a",
        MobileBackButton    : "a",
        MobileDetailButton  : "a",
        ListView       : "ul",
        MobileListView : "ul",
        TreeView       : "ul",
        Menu           : "ul",
        ContextMenu    : "ul",
        ActionSheet    : "ul"
    };

    var SKIP_SHORTCUTS = [
        'MobileView',
        'MobileLayout',
        'MobileSplitView',
        'MobilePane',
        'MobileModalView'
    ];

    var MANUAL_DIRECTIVES = [
        'MobileApplication',
        'MobileView',
        'MobileModalView',
        'MobileLayout',
        'MobileActionSheet',
        'MobileDrawer',
        'MobileSplitView',
        'MobilePane',
        'MobileScrollView',
        'MobilePopOver'
    ];

    angular.forEach(['MobileNavBar', 'MobileButton', 'MobileBackButton', 'MobileDetailButton', 'MobileTabStrip', 'MobileScrollView'], function(widget) {
        MANUAL_DIRECTIVES.push(widget);
        widget = "kendo" + widget;
        module.directive(widget, function() {
            return {
                restrict: "A",
                link: function(scope, element, attrs, controllers) {
                    createWidget(scope, element, attrs, widget, widget);
                }
            };
        });
    });

    function createDirectives(klass, isMobile) {
        function make(directiveName, widgetName) {
            module.directive(directiveName, [
                "directiveFactory",
                function(directiveFactory) {
                    return directiveFactory.create(widgetName, directiveName);
                }
            ]);
        }

        var name = isMobile ? "Mobile" : "";
        name += klass.fn.options.name;

        var className = name;
        var shortcut = "kendo" + name.charAt(0) + name.substr(1).toLowerCase();
        name = "kendo" + name;

        // <kendo-numerictextbox>-type directives
        var dashed = name.replace(/([A-Z])/g, "-$1");

        if (SKIP_SHORTCUTS.indexOf(name.replace("kendo", "")) == -1) {
            var names = name === shortcut ? [ name ] : [ name, shortcut ];
            angular.forEach(names, function(directiveName) {
                module.directive(directiveName, function(){
                    return {
                        restrict : "E",
                        replace  : true,
                        template : function(element, attributes) {
                            var tag = TAGNAMES[className] || "div";
                            return "<" + tag + " " + dashed + ">" + element.html() + "</" + tag + ">";
                        }
                    };
                });
            });
        }

        if (MANUAL_DIRECTIVES.indexOf(name.replace("kendo", "")) > -1) {
            return;
        }

        // here name should be like kendoMobileListView so kendo-mobile-list-view works,
        // and shortcut like kendoMobilelistview, for kendo-mobilelistview

        make(name, name);
        if (shortcut != name) {
            make(shortcut, name);
        }

    }

    (function(){
        function doAll(isMobile) {
            return function(namespace) {
                angular.forEach(namespace, function(value) {
                    if (value.fn && value.fn.options && value.fn.options.name && (/^[A-Z]/).test(value.fn.options.name)) {
                        createDirectives(value, isMobile);
                    }
                });
            };
        }
        angular.forEach([ kendo.ui, kendo.dataviz && kendo.dataviz.ui ], doAll(false));
        angular.forEach([ kendo.mobile && kendo.mobile.ui ], doAll(true));
    })();

    /* -----[ utils ]----- */

    function kendoWidgetInstance(el) {
        el = $(el);
        return kendo.widgetInstance(el, kendo.ui) ||
            kendo.widgetInstance(el, kendo.mobile.ui) ||
            kendo.widgetInstance(el, kendo.dataviz.ui);
    }

    function digest(scope, func) {
        var root = scope.$root || scope;
        var isDigesting = /^\$(digest|apply)$/.test(root.$$phase);
        if (func) {
            if (isDigesting) {
                func();
            } else {
                root.$apply(func);
            }
        } else if (!isDigesting) {
            root.$digest();
        }
    }

    function destroyScope(scope, el) {
        scope.$destroy();
        if (el) {
            // prevent leaks. https://github.com/kendo-labs/angular-kendo/issues/237
            $(el)
                .removeData("$scope")
                .removeData("$isolateScope")
                .removeData("$isolateScopeNoTemplate")
                .removeClass("ng-scope");
        }
    }

    var pendingPatches = [];

    // defadvice will patch a class' method with another function.  That
    // function will be called in a context containing `next` (to call
    // the next method) and `object` (a reference to the original
    // object).
    function defadvice(klass, methodName, func) {
        if ($.isArray(klass)) {
            return angular.forEach(klass, function(klass){
                defadvice(klass, methodName, func);
            });
        }
        if (typeof klass == "string") {
            var a = klass.split(".");
            var x = kendo;
            while (x && a.length > 0) {
                x = x[a.shift()];
            }
            if (!x) {
                pendingPatches.push([ klass, methodName, func ]);
                return false;
            }
            klass = x.prototype;
        }
        var origMethod = klass[methodName];
        klass[methodName] = function() {
            var self = this, args = arguments;
            return func.apply({
                self: self,
                next: function() {
                    return origMethod.apply(self, arguments.length > 0 ? arguments : args);
                }
            }, args);
        };
        return true;
    }

    defadvice(kendo.ui, "plugin", function(klass, register, prefix){
        this.next();
        pendingPatches = $.grep(pendingPatches, function(args){
            return !defadvice.apply(null, args);
        });
        createDirectives(klass, prefix == "Mobile");
    });

    /* -----[ Customize widgets for Angular ]----- */

    defadvice([ "ui.Widget", "mobile.ui.Widget" ], "angular", function(cmd, arg){
        var self = this.self;
        if (cmd == "init") {
            // `arg` here should be the widget options.
            // the Chart doesn't send the options to Widget::init in constructor
            // hence the OPTIONS_NOW hack (initialized in createWidget).
            if (!arg && OPTIONS_NOW) {
                arg = OPTIONS_NOW;
            }
            OPTIONS_NOW = null;
            if (arg && arg.$angular) {
                self.$angular_scope = arg.$angular[0];
                self.$angular_init(self.element, arg);
            }
            return;
        }

        var scope = self.$angular_scope || angular.element(self.element).scope();

        if (scope) {
            withoutTimeout(function(){
                var x = arg(), elements = x.elements, data = x.data;
                if (elements.length > 0) {
                    switch (cmd) {

                      case "cleanup":
                        angular.forEach(elements, function(el){
                            var itemScope = angular.element(el).scope();
                            if (itemScope && itemScope !== scope && itemScope.$$kendoScope) {
                                destroyScope(itemScope, el);
                            }
                        });
                        break;

                      case "compile":
                        var injector = self.element.injector();
                        // gross gross gross hack :(. Works for popups that may be out of the ng-app directive.
                        // they don't have injectors. Same thing happens in our tests, too.
                        var compile = injector ? injector.get("$compile") : $defaultCompile;

                        angular.forEach(elements, function(el, i){
                            var itemScope;
                            if (x.scopeFrom) {
                                itemScope = angular.element(x.scopeFrom).scope();
                            } else {
                                var vars = data && data[i];
                                if (vars !== undefined) {
                                    itemScope = $.extend(scope.$new(), vars);
                                    itemScope.$$kendoScope = true;
                                }
                            }

                            compile(el)(itemScope || scope);
                        });
                        digest(scope);
                        break;
                    }
                }
            });
        }
    });

    defadvice("ui.Widget", "$angular_getLogicValue", function(){
        return this.self.value();
    });

    defadvice("ui.Widget", "$angular_setLogicValue", function(val){
        this.self.value(val);
    });

    defadvice("ui.Select", "$angular_getLogicValue", function(){
        var item = this.self.dataItem();
        if (item) {
            if (this.self.options.valuePrimitive) {
                return item[this.self.options.dataValueField];
            } else {
                return item.toJSON();
            }
        } else {
            return null;
        }
    });

    defadvice("ui.Select", "$angular_setLogicValue", function(val){
        var self = this.self;
        var options = self.options;
        var valueField = options.dataValueField;

        if (valueField && !options.valuePrimitive) {
            val = val != null ? val[options.dataValueField || options.dataTextField] : null;
        }

        self.value(val);
    });

    defadvice("ui.MultiSelect", "$angular_getLogicValue", function() {
        var value = this.self.dataItems();
        var valueField = this.self.options.dataValueField;

        if (valueField && this.self.options.valuePrimitive) {
            value = $.map(value, function(item) {
                return item[valueField];
            });
        }

        return value;
    });

    defadvice("ui.MultiSelect", "$angular_setLogicValue", function(val){
        if (val == null) {
            val = [];
        }
        var self = this.self,
            valueField = self.options.dataValueField;

        if (valueField && !self.options.valuePrimitive) {
            val = $.map(val, function(item) {
                return item[valueField];
            });
        }

        self.value(val);
    });

    defadvice("ui.AutoComplete", "$angular_getLogicValue", function(){
        var options = this.self.options;

        var values = this.self.value().split(options.separator);
        var valuePrimitive = options.valuePrimitive;
        var data = this.self.dataSource.data();
        var dataItems = [];
        for (var idx = 0, length = data.length; idx < length; idx++) {
            var item = data[idx];
            var dataValue = options.dataTextField ? item[options.dataTextField] : item;
            for (var j = 0; j < values.length; j++) {
                if (dataValue === values[j]) {
                    if (valuePrimitive) {
                        dataItems.push(dataValue);
                    } else {
                        dataItems.push(item.toJSON());
                    }

                    break;
                }
            }
        }

        return dataItems;
    });

    defadvice("ui.AutoComplete", "$angular_setLogicValue", function(value) {
        if (value == null) {
            value = [];
        }

        var self = this.self,
            dataTextField = self.options.dataTextField;

        if (dataTextField && !self.options.valuePrimitive) {
            value = $.map(value, function(item){
                return item[dataTextField];
            });
        }

        self.value(value);
    });

    // All event handlers that are strings are compiled the Angular way.
    defadvice("ui.Widget", "$angular_init", function(element, options) {
        var self = this.self;
        if (options && !$.isArray(options)) {
            var scope = self.$angular_scope;
            for (var i = self.events.length; --i >= 0;) {
                var event = self.events[i];
                var handler = options[event];
                if (handler && typeof handler == "string") {
                    options[event] = self.$angular_makeEventHandler(event, scope, handler);
                }
            }
        }
    });

    // most handers will only contain a kendoEvent in the scope.
    defadvice("ui.Widget", "$angular_makeEventHandler", function(event, scope, handler){
        handler = $parse(handler);
        return function(e) {
            digest(scope, function() {
                handler(scope, { kendoEvent: e });
            });
        };
    });

    // for the Grid and ListView we add `data` and `selected` too.
    defadvice([ "ui.Grid", "ui.ListView", "ui.TreeView" ], "$angular_makeEventHandler", function(event, scope, handler){
        if (event != "change") {
            return this.next();
        }
        handler = $parse(handler);
        return function(ev) {
            var widget = ev.sender;
            var options = widget.options;
            var cell, multiple, locals = { kendoEvent: ev }, elems, items, columns, colIdx;

            if (angular.isString(options.selectable)) {
                cell = options.selectable.indexOf('cell') !== -1;
                multiple = options.selectable.indexOf('multiple') !== -1;
            }

            elems = locals.selected = this.select();
            items = locals.data = [];
            columns = locals.columns = [];
            for (var i = 0; i < elems.length; i++) {
                var item = cell ? elems[i].parentNode : elems[i];
                var dataItem = widget.dataItem(item);
                if (cell) {
                    if (angular.element.inArray(dataItem, items) < 0) {
                        items.push(dataItem);
                    }
                    colIdx = angular.element(elems[i]).index();
                    if (angular.element.inArray(colIdx, columns) < 0 ) {
                        columns.push(colIdx);
                    }
                } else {
                    items.push(dataItem);
                }
            }

            if (!multiple) {
                locals.dataItem = locals.data = items[0];
                locals.selected = elems[0];
            }

            digest(scope, function() {
                handler(scope, locals);
            });
        };
    });

    // If no `template` is supplied for Grid columns, provide an Angular
    // template.  The reason is that in this way AngularJS will take
    // care to update the view as the data in scope changes.
    defadvice("ui.Grid", "$angular_init", function(element, options){
        this.next();
        if (options.columns) {
            var settings = $.extend({}, kendo.Template, options.templateSettings);
            angular.forEach(options.columns, function(col){
                if (col.field && !col.template && !col.format && !col.values && (col.encoded === undefined || col.encoded)) {
                    col.template = "<span ng-bind='" +
                        kendo.expr(col.field, "dataItem") + "'>#: " +
                        kendo.expr(col.field, settings.paramName) + "#</span>";
                }
            });
        }
    });

    {
        // mobile/ButtonGroup does not have a "value" method, but looks
        // like it would be useful.  We provide it here.

        defadvice("mobile.ui.ButtonGroup", "value", function(mew){
            var self = this.self;
            if (mew != null) {
                self.select(self.element.children("li.km-button").eq(mew));
                self.trigger("change");
                self.trigger("select", { index: self.selectedIndex });
            }
            return self.selectedIndex;
        });

        defadvice("mobile.ui.ButtonGroup", "_select", function(){
            this.next();
            this.self.trigger("change");
        });
    }

    // mobile directives
    module
    .directive('kendoMobileApplication', function() {
        return {
            terminal: true,
            link: function(scope, element, attrs, controllers) {
                createWidget(scope, element, attrs, 'kendoMobileApplication', 'kendoMobileApplication');
            }
        };
    }).directive('kendoMobileView', function() {
        return {
            scope: true,
            link: {
                pre: function(scope, element, attrs, controllers) {
                    attrs.defaultOptions = scope.viewOptions;
                    attrs._instance = createWidget(scope, element, attrs, 'kendoMobileView', 'kendoMobileView');
                },

                post: function(scope, element, attrs) {
                    attrs._instance._layout();
                    attrs._instance._scroller();
                }
            }
        };
    }).directive('kendoMobileDrawer', function() {
        return {
            scope: true,
            link: {
                pre: function(scope, element, attrs, controllers) {
                    attrs.defaultOptions = scope.viewOptions;
                    attrs._instance = createWidget(scope, element, attrs, 'kendoMobileDrawer', 'kendoMobileDrawer');
                },

                post: function(scope, element, attrs) {
                    attrs._instance._layout();
                    attrs._instance._scroller();
                }
            }
        };
    }).directive('kendoMobileModalView', function() {
        return {
            scope: true,
            link: {
                pre: function(scope, element, attrs, controllers) {
                    attrs.defaultOptions = scope.viewOptions;
                    attrs._instance = createWidget(scope, element, attrs, 'kendoMobileModalView', 'kendoMobileModalView');
                },

                post: function(scope, element, attrs) {
                    attrs._instance._layout();
                    attrs._instance._scroller();
                }
            }
        };
    }).directive('kendoMobileSplitView', function() {
        return {
            terminal: true,
            link: {
                pre: function(scope, element, attrs, controllers) {
                    attrs.defaultOptions = scope.viewOptions;
                    attrs._instance = createWidget(scope, element, attrs, 'kendoMobileSplitView', 'kendoMobileSplitView');
                },

                post: function(scope, element, attrs) {
                    attrs._instance._layout();
                }
            }
        };
    }).directive('kendoMobilePane', function() {
        return {
            terminal: true,
            link: {
                pre: function(scope, element, attrs, controllers) {
                    attrs.defaultOptions = scope.viewOptions;
                    createWidget(scope, element, attrs, 'kendoMobilePane', 'kendoMobilePane');
                }
            }
        };
    }).directive('kendoMobileLayout', function() {
        return {
            link: {
                pre: function (scope, element, attrs, controllers) {
                    createWidget(scope, element, attrs, 'kendoMobileLayout', 'kendoMobileLayout');
                }
            }
        };
    }).directive('kendoMobileActionSheet', function() {
        return {
            restrict: "A",
            link: function(scope, element, attrs, controllers) {
                element.find("a[k-action]").each(function() {
                    $(this).attr("data-" + kendo.ns + "action", $(this).attr("k-action"));
                });

                createWidget(scope, element, attrs, 'kendoMobileActionSheet', 'kendoMobileActionSheet');
            }
        };
    }).directive('kendoMobilePopOver', function() {
        return {
            terminal: true,
            link: {
                pre: function(scope, element, attrs, controllers) {
                    attrs.defaultOptions = scope.viewOptions;
                    createWidget(scope, element, attrs, 'kendoMobilePopOver', 'kendoMobilePopOver');
                }
            }
        };
    }).directive('kendoViewTitle', function(){
        return {
            restrict : "E",
            replace  : true,
            template : function(element, attributes) {
                return "<span data-" + kendo.ns + "role='view-title'>" + element.html() + "</span>";
            }
        };
    }).directive('kendoMobileHeader', function() {
            return {
                restrict: "E",
                link: function(scope, element, attrs, controllers) {
                    element.addClass("km-header").attr("data-role", "header");
                }
            };
    }).directive('kendoMobileFooter', function() {
            return {
                restrict: 'E',
                link: function(scope, element, attrs, controllers) {
                    element.addClass("km-footer").attr("data-role", "footer");
                }
            };
    }).directive('kendoMobileScrollViewPage', function(){
        return {
            restrict : "E",
            replace  : true,
            template : function(element, attributes) {
                return "<div data-" + kendo.ns + "role='page'>" + element.html() + "</div>";
            }
        };
    });

    angular.forEach(['align', 'icon', 'rel', 'transition', 'actionsheetContext'], function(attr) {
          var kAttr = "k" + attr.slice(0, 1).toUpperCase() + attr.slice(1);

          module.directive(kAttr, function() {
              return {
                  restrict: 'A',
                  priority: 2,
                  link: function(scope, element, attrs) {
                      element.attr(kendo.attr(kendo.toHyphens(attr)), scope.$eval(attrs[kAttr]));
                  }
              };
          });
    });

    var WIDGET_TEMPLATE_OPTIONS = {
        "TreeMap": [ "Template" ],
        "MobileListView": [ "HeaderTemplate", "Template" ],
        "MobileScrollView": [ "EmptyTemplate", "Template" ],
        "Grid": [ "AltRowTemplate", "DetailTemplate", "RowTemplate" ],
        "ListView": [ "EditTemplate", "Template", "AltTemplate" ],
        "Pager": [ "SelectTemplate", "LinkTemplate" ],
        "PivotGrid": [ "ColumnHeaderTemplate", "DataCellTemplate", "RowHeaderTemplate" ],
        "Scheduler": [ "AllDayEventTemplate", "DateHeaderTemplate", "EventTemplate", "MajorTimeHeaderTemplate", "MinorTimeHeaderTemplate" ],
        "TreeView": [ "Template" ],
        "Validator": [ "ErrorTemplate" ]
    };

    (function() {
        var templateDirectives = {};
        angular.forEach(WIDGET_TEMPLATE_OPTIONS, function(templates, widget) {
            angular.forEach(templates, function(template) {
                if (!templateDirectives[template]) {
                    templateDirectives[template] = [ ];
                }
                templateDirectives[template].push("?^^kendo" + widget);
            });
        });

        angular.forEach(templateDirectives, function(parents, directive) {
            var templateName = "k" + directive;
            var attrName = kendo.toHyphens(templateName);

            module.directive(templateName, function() {
                return {
                    restrict: "A",
                    require: parents,
                    replace: true,
                    template: "",
                    compile: function($element, $attrs) {
                        if ($attrs[templateName] !== "") {
                            return;
                        }
                        $element.removeAttr(attrName);
                        var template = $element[0].outerHTML;

                        return function(scope, element, attrs, controllers) {
                            var controller;

                            while(!controller && controllers.length) {
                                controller = controllers.shift();
                            }

                            if (!controller) {
                                $log.warn(attrName + " without a matching parent widget found. It can be one of the following: " + parents.join(", "));
                            } else {
                                controller.template(templateName, template);
                            }
                        };
                    }
                };
            });
        });

    })();


})(window.kendo.jQuery, window.angular);





(function($, undefined) {
    var kendo = window.kendo,
        fx = kendo.effects,
        each = $.each,
        extend = $.extend,
        proxy = $.proxy,
        support = kendo.support,
        browser = support.browser,
        transforms = support.transforms,
        transitions = support.transitions,
        scaleProperties = { scale: 0, scalex: 0, scaley: 0, scale3d: 0 },
        translateProperties = { translate: 0, translatex: 0, translatey: 0, translate3d: 0 },
        hasZoom = (typeof document.documentElement.style.zoom !== "undefined") && !transforms,
        matrix3dRegExp = /matrix3?d?\s*\(.*,\s*([\d\.\-]+)\w*?,\s*([\d\.\-]+)\w*?,\s*([\d\.\-]+)\w*?,\s*([\d\.\-]+)\w*?/i,
        cssParamsRegExp = /^(-?[\d\.\-]+)?[\w\s]*,?\s*(-?[\d\.\-]+)?[\w\s]*/i,
        translateXRegExp = /translatex?$/i,
        oldEffectsRegExp = /(zoom|fade|expand)(\w+)/,
        singleEffectRegExp = /(zoom|fade|expand)/,
        unitRegExp = /[xy]$/i,
        transformProps = ["perspective", "rotate", "rotatex", "rotatey", "rotatez", "rotate3d", "scale", "scalex", "scaley", "scalez", "scale3d", "skew", "skewx", "skewy", "translate", "translatex", "translatey", "translatez", "translate3d", "matrix", "matrix3d"],
        transform2d = ["rotate", "scale", "scalex", "scaley", "skew", "skewx", "skewy", "translate", "translatex", "translatey", "matrix"],
        transform2units = { "rotate": "deg", scale: "", skew: "px", translate: "px" },
        cssPrefix = transforms.css,
        round = Math.round,
        BLANK = "",
        PX = "px",
        NONE = "none",
        AUTO = "auto",
        WIDTH = "width",
        HEIGHT = "height",
        HIDDEN = "hidden",
        ORIGIN = "origin",
        ABORT_ID = "abortId",
        OVERFLOW = "overflow",
        TRANSLATE = "translate",
        POSITION = "position",
        COMPLETE_CALLBACK = "completeCallback",
        TRANSITION = cssPrefix + "transition",
        TRANSFORM = cssPrefix + "transform",
        BACKFACE = cssPrefix + "backface-visibility",
        PERSPECTIVE = cssPrefix + "perspective",
        DEFAULT_PERSPECTIVE = "1500px",
        TRANSFORM_PERSPECTIVE = "perspective(" + DEFAULT_PERSPECTIVE + ")",
        ios7 = support.mobileOS && support.mobileOS.majorVersion == 7,
        directions = {
            left: {
                reverse: "right",
                property: "left",
                transition: "translatex",
                vertical: false,
                modifier: -1
            },
            right: {
                reverse: "left",
                property: "left",
                transition: "translatex",
                vertical: false,
                modifier: 1
            },
            down: {
                reverse: "up",
                property: "top",
                transition: "translatey",
                vertical: true,
                modifier: 1
            },
            up: {
                reverse: "down",
                property: "top",
                transition: "translatey",
                vertical: true,
                modifier: -1
            },
            top: {
                reverse: "bottom"
            },
            bottom: {
                reverse: "top"
            },
            "in": {
                reverse: "out",
                modifier: -1
            },
            out: {
                reverse: "in",
                modifier: 1
            },

            vertical: {
                reverse: "vertical"
            },

            horizontal: {
                reverse: "horizontal"
            }
        };

    kendo.directions = directions;

    extend($.fn, {
        kendoStop: function(clearQueue, gotoEnd) {
            if (transitions) {
                return fx.stopQueue(this, clearQueue || false, gotoEnd || false);
            } else {
                return this.stop(clearQueue, gotoEnd);
            }
        }
    });

    /* jQuery support for all transform animations (FF 3.5/3.6, Opera 10.x, IE9 */

    if (transforms && !transitions) {
        each(transform2d, function(idx, value) {
            $.fn[value] = function(val) {
                if (typeof val == "undefined") {
                    return animationProperty(this, value);
                } else {
                    var that = $(this)[0],
                        transformValue = value + "(" + val + transform2units[value.replace(unitRegExp, "")] + ")";

                    if (that.style.cssText.indexOf(TRANSFORM) == -1) {
                        $(this).css(TRANSFORM, transformValue);
                    } else {
                        that.style.cssText = that.style.cssText.replace(new RegExp(value + "\\(.*?\\)", "i"), transformValue);
                    }
                }
                return this;
            };

            $.fx.step[value] = function (fx) {
                $(fx.elem)[value](fx.now);
            };
        });

        var curProxy = $.fx.prototype.cur;
        $.fx.prototype.cur = function () {
            if (transform2d.indexOf(this.prop) != -1) {
                return parseFloat($(this.elem)[this.prop]());
            }

            return curProxy.apply(this, arguments);
        };
    }

    kendo.toggleClass = function(element, classes, options, add) {
        if (classes) {
            classes = classes.split(" ");

            if (transitions) {
                options = extend({
                    exclusive: "all",
                    duration: 400,
                    ease: "ease-out"
                }, options);

                element.css(TRANSITION, options.exclusive + " " + options.duration + "ms " + options.ease);
                setTimeout(function() {
                    element.css(TRANSITION, "").css(HEIGHT);
                }, options.duration); // TODO: this should fire a kendoAnimate session instead.
            }

            each(classes, function(idx, value) {
                element.toggleClass(value, add);
            });
        }

        return element;
    };

    kendo.parseEffects = function(input, mirror) {
        var effects = {};

        if (typeof input === "string") {
            each(input.split(" "), function(idx, value) {
                var redirectedEffect = !singleEffectRegExp.test(value),
                    resolved = value.replace(oldEffectsRegExp, function(match, $1, $2) {
                        return $1 + ":" + $2.toLowerCase();
                    }), // Support for old zoomIn/fadeOut style, now deprecated.
                    effect = resolved.split(":"),
                    direction = effect[1],
                    effectBody = {};

                if (effect.length > 1) {
                    effectBody.direction = (mirror && redirectedEffect ? directions[direction].reverse : direction);
                }

                effects[effect[0]] = effectBody;
            });
        } else {
            each(input, function(idx) {
                var direction = this.direction;

                if (direction && mirror && !singleEffectRegExp.test(idx)) {
                    this.direction = directions[direction].reverse;
                }

                effects[idx] = this;
            });
        }

        return effects;
    };

    function parseInteger(value) {
        return parseInt(value, 10);
    }

    function parseCSS(element, property) {
        return parseInteger(element.css(property));
    }

    function keys(obj) {
        var acc = [];
        for (var propertyName in obj) {
            acc.push(propertyName);
        }
        return acc;
    }

    function strip3DTransforms(properties) {
        for (var key in properties) {
            if (transformProps.indexOf(key) != -1 && transform2d.indexOf(key) == -1) {
                delete properties[key];
            }
        }

        return properties;
    }

    function normalizeCSS(element, properties) {
        var transformation = [], cssValues = {}, lowerKey, key, value, isTransformed;

        for (key in properties) {
            lowerKey = key.toLowerCase();
            isTransformed = transforms && transformProps.indexOf(lowerKey) != -1;

            if (!support.hasHW3D && isTransformed && transform2d.indexOf(lowerKey) == -1) {
                delete properties[key];
            } else {
                value = properties[key];

                if (isTransformed) {
                    transformation.push(key + "(" + value + ")");
                } else {
                    cssValues[key] = value;
                }
            }
        }

        if (transformation.length) {
            cssValues[TRANSFORM] = transformation.join(" ");
        }

        return cssValues;
    }

    if (transitions) {
        extend(fx, {
            transition: function(element, properties, options) {
                var css,
                    delay = 0,
                    oldKeys = element.data("keys") || [],
                    timeoutID;

                options = extend({
                        duration: 200,
                        ease: "ease-out",
                        complete: null,
                        exclusive: "all"
                    },
                    options
                );

                var stopTransitionCalled = false;

                var stopTransition = function() {
                    if (!stopTransitionCalled) {
                        stopTransitionCalled = true;

                        if (timeoutID) {
                            clearTimeout(timeoutID);
                            timeoutID = null;
                        }

                        element
                        .removeData(ABORT_ID)
                        .dequeue()
                        .css(TRANSITION, "")
                        .css(TRANSITION);

                        options.complete.call(element);
                    }
                };

                options.duration = $.fx ? $.fx.speeds[options.duration] || options.duration : options.duration;

                css = normalizeCSS(element, properties);

                $.merge(oldKeys, keys(css));
                element
                    .data("keys", $.unique(oldKeys))
                    .height();

                element.css(TRANSITION, options.exclusive + " " + options.duration + "ms " + options.ease).css(TRANSITION);
                element.css(css).css(TRANSFORM);

                /**
                 * Use transitionEnd event for browsers who support it - but duplicate it with setTimeout, as the transitionEnd event will not be triggered if no CSS properties change.
                 * This should be cleaned up at some point (widget by widget), and refactored to widgets not relying on the complete callback if no transition occurs.
                 *
                 * For IE9 and below, resort to setTimeout.
                 */
                if (transitions.event) {
                    element.one(transitions.event, stopTransition);
                    if (options.duration !== 0) {
                        delay = 500;
                    }
                }

                timeoutID = setTimeout(stopTransition, options.duration + delay);
                element.data(ABORT_ID, timeoutID);
                element.data(COMPLETE_CALLBACK, stopTransition);
            },

            stopQueue: function(element, clearQueue, gotoEnd) {
                var cssValues,
                    taskKeys = element.data("keys"),
                    retainPosition = (!gotoEnd && taskKeys),
                    completeCallback = element.data(COMPLETE_CALLBACK);

                if (retainPosition) {
                    cssValues = kendo.getComputedStyles(element[0], taskKeys);
                }

                if (completeCallback) {
                    completeCallback();
                }

                if (retainPosition) {
                    element.css(cssValues);
                }

                return element
                        .removeData("keys")
                        .stop(clearQueue);
            }
        });
    }

    function animationProperty(element, property) {
        if (transforms) {
            var transform = element.css(TRANSFORM);
            if (transform == NONE) {
                return property == "scale" ? 1 : 0;
            }

            var match = transform.match(new RegExp(property + "\\s*\\(([\\d\\w\\.]+)")),
                computed = 0;

            if (match) {
                computed = parseInteger(match[1]);
            } else {
                match = transform.match(matrix3dRegExp) || [0, 0, 0, 0, 0];
                property = property.toLowerCase();

                if (translateXRegExp.test(property)) {
                    computed = parseFloat(match[3] / match[2]);
                } else if (property == "translatey") {
                    computed = parseFloat(match[4] / match[2]);
                } else if (property == "scale") {
                    computed = parseFloat(match[2]);
                } else if (property == "rotate") {
                    computed = parseFloat(Math.atan2(match[2], match[1]));
                }
            }

            return computed;
        } else {
            return parseFloat(element.css(property));
        }
    }

    var EffectSet = kendo.Class.extend({
        init: function(element, options) {
            var that = this;

            that.element = element;
            that.effects = [];
            that.options = options;
            that.restore = [];
        },

        run: function(effects) {
            var that = this,
                effect,
                idx, jdx,
                length = effects.length,
                element = that.element,
                options = that.options,
                deferred = $.Deferred(),
                start = {},
                end = {},
                target,
                children,
                childrenLength;

            that.effects = effects;

            deferred.then($.proxy(that, "complete"));

            element.data("animating", true);

            for (idx = 0; idx < length; idx ++) {
                effect = effects[idx];

                effect.setReverse(options.reverse);
                effect.setOptions(options);

                that.addRestoreProperties(effect.restore);

                effect.prepare(start, end);

                children = effect.children();

                for (jdx = 0, childrenLength = children.length; jdx < childrenLength; jdx ++) {
                    children[jdx].duration(options.duration).run();
                }
            }

            // legacy support for options.properties
            for (var effectName in options.effects) {
                extend(end, options.effects[effectName].properties);
            }

            // Show the element initially
            if (!element.is(":visible")) {
                extend(start, { display: element.data("olddisplay") || "block" });
            }

            if (transforms && !options.reset) {
                target = element.data("targetTransform");

                if (target) {
                    start = extend(target, start);
                }
            }

            start = normalizeCSS(element, start);

            if (transforms && !transitions) {
                start = strip3DTransforms(start);
            }

            element.css(start)
                   .css(TRANSFORM); // Nudge

            for (idx = 0; idx < length; idx ++) {
                effects[idx].setup();
            }

            if (options.init) {
                options.init();
            }

            element.data("targetTransform", end);
            fx.animate(element, end, extend({}, options, { complete: deferred.resolve }));

            return deferred.promise();
        },

        stop: function() {
            $(this.element).kendoStop(true, true);
        },

        addRestoreProperties: function(restore) {
            var element = this.element,
                value,
                i = 0,
                length = restore.length;

            for (; i < length; i ++) {
                value = restore[i];

                this.restore.push(value);

                if (!element.data(value)) {
                    element.data(value, element.css(value));
                }
            }
        },

        restoreCallback: function() {
            var element = this.element;

            for (var i = 0, length = this.restore.length; i < length; i ++) {
                var value = this.restore[i];
                element.css(value, element.data(value));
            }
        },

        complete: function() {
            var that = this,
                idx = 0,
                element = that.element,
                options = that.options,
                effects = that.effects,
                length = effects.length;

            element
                .removeData("animating")
                .dequeue(); // call next animation from the queue

            if (options.hide) {
                element.data("olddisplay", element.css("display")).hide();
            }

            this.restoreCallback();

            if (hasZoom && !transforms) {
                setTimeout($.proxy(this, "restoreCallback"), 0); // Again jQuery callback in IE8-
            }

            for (; idx < length; idx ++) {
                effects[idx].teardown();
            }

            if (options.completeCallback) {
                options.completeCallback(element);
            }
        }
    });

    fx.promise = function(element, options) {
        var effects = [],
            effectClass,
            effectSet = new EffectSet(element, options),
            parsedEffects = kendo.parseEffects(options.effects),
            effect;

        options.effects = parsedEffects;

        for (var effectName in parsedEffects) {
            effectClass = fx[capitalize(effectName)];

            if (effectClass) {
                effect = new effectClass(element, parsedEffects[effectName].direction);
                effects.push(effect);
           }
        }

        if (effects[0]) {
            effectSet.run(effects);
        } else { // Not sure how would an fx promise reach this state - means that you call kendoAnimate with no valid effects? Why?
            if (!element.is(":visible")) {
                element.css({ display: element.data("olddisplay") || "block" }).css("display");
            }

            if (options.init) {
                options.init();
            }

            element.dequeue();
            effectSet.complete();
        }
    };

    extend(fx, {
        animate: function(elements, properties, options) {
            var useTransition = options.transition !== false;
            delete options.transition;

            if (transitions && "transition" in fx && useTransition) {
                fx.transition(elements, properties, options);
            } else {
                if (transforms) {
                    elements.animate(strip3DTransforms(properties), { queue: false, show: false, hide: false, duration: options.duration, complete: options.complete }); // Stop animate from showing/hiding the element to be able to hide it later on.
                } else {
                    elements.each(function() {
                        var element = $(this),
                            multiple = {};

                        each(transformProps, function(idx, value) { // remove transforms to avoid IE and older browsers confusion
                            var params,
                                currentValue = properties ? properties[value]+ " " : null; // We need to match

                            if (currentValue) {
                                var single = properties;

                                if (value in scaleProperties && properties[value] !== undefined) {
                                    params = currentValue.match(cssParamsRegExp);
                                    if (transforms) {
                                        extend(single, { scale: +params[0] });
                                    }
                                } else {
                                    if (value in translateProperties && properties[value] !== undefined) {
                                        var position = element.css(POSITION),
                                            isFixed = (position == "absolute" || position == "fixed");

                                        if (!element.data(TRANSLATE)) {
                                            if (isFixed) {
                                                element.data(TRANSLATE, {
                                                    top: parseCSS(element, "top") || 0,
                                                    left: parseCSS(element, "left") || 0,
                                                    bottom: parseCSS(element, "bottom"),
                                                    right: parseCSS(element, "right")
                                                });
                                            } else {
                                                element.data(TRANSLATE, {
                                                    top: parseCSS(element, "marginTop") || 0,
                                                    left: parseCSS(element, "marginLeft") || 0
                                                });
                                            }
                                        }

                                        var originalPosition = element.data(TRANSLATE);

                                        params = currentValue.match(cssParamsRegExp);
                                        if (params) {

                                            var dX = value == TRANSLATE + "y" ? +null : +params[1],
                                                dY = value == TRANSLATE + "y" ? +params[1] : +params[2];

                                            if (isFixed) {
                                                if (!isNaN(originalPosition.right)) {
                                                    if (!isNaN(dX)) { extend(single, { right: originalPosition.right - dX }); }
                                                } else {
                                                    if (!isNaN(dX)) { extend(single, { left: originalPosition.left + dX }); }
                                                }

                                                if (!isNaN(originalPosition.bottom)) {
                                                    if (!isNaN(dY)) { extend(single, { bottom: originalPosition.bottom - dY }); }
                                                } else {
                                                    if (!isNaN(dY)) { extend(single, { top: originalPosition.top + dY }); }
                                                }
                                            } else {
                                                if (!isNaN(dX)) { extend(single, { marginLeft: originalPosition.left + dX }); }
                                                if (!isNaN(dY)) { extend(single, { marginTop: originalPosition.top + dY }); }
                                            }
                                        }
                                    }
                                }

                                if (!transforms && value != "scale" && value in single) {
                                    delete single[value];
                                }

                                if (single) {
                                    extend(multiple, single);
                                }
                            }
                        });

                        if (browser.msie) {
                            delete multiple.scale;
                        }

                        element.animate(multiple, { queue: false, show: false, hide: false, duration: options.duration, complete: options.complete }); // Stop animate from showing/hiding the element to be able to hide it later on.
                    });
                }
            }
        }
    });

    fx.animatedPromise = fx.promise;

    var Effect = kendo.Class.extend({
        init: function(element, direction) {
            var that = this;
            that.element = element;
            that._direction = direction;
            that.options = {};
            that._additionalEffects = [];

            if (!that.restore) {
                that.restore = [];
            }
        },

// Public API
        reverse: function() {
            this._reverse = true;
            return this.run();
        },

        play: function() {
            this._reverse = false;
            return this.run();
        },

        add: function(additional) {
            this._additionalEffects.push(additional);
            return this;
        },

        direction: function(value) {
            this._direction = value;
            return this;
        },

        duration: function(duration) {
            this._duration = duration;
            return this;
        },

        compositeRun: function() {
            var that = this,
                effectSet = new EffectSet(that.element, { reverse: that._reverse, duration: that._duration }),
                effects = that._additionalEffects.concat([ that ]);

            return effectSet.run(effects);
        },

        run: function() {
            if (this._additionalEffects && this._additionalEffects[0]) {
                return this.compositeRun();
            }

            var that = this,
                element = that.element,
                idx = 0,
                restore = that.restore,
                length = restore.length,
                value,
                deferred = $.Deferred(),
                start = {},
                end = {},
                target,
                children = that.children(),
                childrenLength = children.length;

            deferred.then($.proxy(that, "_complete"));

            element.data("animating", true);

            for (idx = 0; idx < length; idx ++) {
                value = restore[idx];

                if (!element.data(value)) {
                    element.data(value, element.css(value));
                }
            }

            for (idx = 0; idx < childrenLength; idx ++) {
                children[idx].duration(that._duration).run();
            }

            that.prepare(start, end);

            if (!element.is(":visible")) {
                extend(start, { display: element.data("olddisplay") || "block" });
            }

            if (transforms) {
                target = element.data("targetTransform");

                if (target) {
                    start = extend(target, start);
                }
            }

            start = normalizeCSS(element, start);

            if (transforms && !transitions) {
                start = strip3DTransforms(start);
            }

            element.css(start).css(TRANSFORM); // Trick webkit into re-rendering

            that.setup();

            element.data("targetTransform", end);
            fx.animate(element, end, { duration: that._duration, complete: deferred.resolve });

            return deferred.promise();
        },

        stop: function() {
            var idx = 0,
                children = this.children(),
                childrenLength = children.length;

            for (idx = 0; idx < childrenLength; idx ++) {
                children[idx].stop();
            }

            $(this.element).kendoStop(true, true);
            return this;
        },

        restoreCallback: function() {
            var element = this.element;

            for (var i = 0, length = this.restore.length; i < length; i ++) {
                var value = this.restore[i];
                element.css(value, element.data(value));
            }
        },

        _complete: function() {
            var that = this,
                element = that.element;

            element
                .removeData("animating")
                .dequeue(); // call next animation from the queue

            that.restoreCallback();

            if (that.shouldHide()) {
                element.data("olddisplay", element.css("display")).hide();
            }

            if (hasZoom && !transforms) {
                setTimeout($.proxy(that, "restoreCallback"), 0); // Again jQuery callback in IE8-
            }

            that.teardown();
        },

        /////////////////////////// Support for kendo.animate;
        setOptions: function(options) {
            extend(true, this.options, options);
        },

        children: function() {
            return [];
        },

        shouldHide: $.noop,

        setup: $.noop,
        prepare: $.noop,
        teardown: $.noop,
        directions: [],

        setReverse: function(reverse) {
            this._reverse = reverse;
            return this;
        }
    });

    function capitalize(word) {
        return word.charAt(0).toUpperCase() + word.substring(1);
    }

    function createEffect(name, definition) {
        var effectClass = Effect.extend(definition),
            directions = effectClass.prototype.directions;

        fx[capitalize(name)] = effectClass;

        fx.Element.prototype[name] = function(direction, opt1, opt2, opt3) {
            return new effectClass(this.element, direction, opt1, opt2, opt3);
        };

        each(directions, function(idx, theDirection) {
            fx.Element.prototype[name + capitalize(theDirection)] = function(opt1, opt2, opt3) {
                return new effectClass(this.element, theDirection, opt1, opt2, opt3);
            };
        });
    }

    var FOUR_DIRECTIONS = ["left", "right", "up", "down"],
        IN_OUT = ["in", "out"];

    createEffect("slideIn", {
        directions: FOUR_DIRECTIONS,

        divisor: function(value) {
            this.options.divisor = value;
            return this;
        },

        prepare: function(start, end) {
            var that = this,
                tmp,
                element = that.element,
                direction = directions[that._direction],
                offset = -direction.modifier * (direction.vertical ? element.outerHeight() : element.outerWidth()),
                startValue = offset / (that.options && that.options.divisor || 1) + PX,
                endValue = "0px";

            if (that._reverse) {
                tmp = start;
                start = end;
                end = tmp;
            }

            if (transforms) {
                start[direction.transition] = startValue;
                end[direction.transition] = endValue;
            } else {
                start[direction.property] = startValue;
                end[direction.property] = endValue;
            }
        }
    });

    createEffect("tile", {
        directions: FOUR_DIRECTIONS,

        init: function(element, direction, previous) {
            Effect.prototype.init.call(this, element, direction);
            this.options = { previous: previous };
        },

        previousDivisor: function(value) {
            this.options.previousDivisor = value;
            return this;
        },

        children: function() {
            var that = this,
                reverse = that._reverse,
                previous = that.options.previous,
                divisor = that.options.previousDivisor || 1,
                dir = that._direction;

            var children = [ kendo.fx(that.element).slideIn(dir).setReverse(reverse) ];

            if (previous) {
                children.push( kendo.fx(previous).slideIn(directions[dir].reverse).divisor(divisor).setReverse(!reverse) );
            }

            return children;
        }
    });

    function createToggleEffect(name, property, defaultStart, defaultEnd) {
        createEffect(name, {
            directions: IN_OUT,

            startValue: function(value) {
                this._startValue = value;
                return this;
            },

            endValue: function(value) {
                this._endValue = value;
                return this;
            },

            shouldHide: function() {
               return this._shouldHide;
            },

            prepare: function(start, end) {
                var that = this,
                    startValue,
                    endValue,
                    out = this._direction === "out",
                    startDataValue = that.element.data(property),
                    startDataValueIsSet = !(isNaN(startDataValue) || startDataValue == defaultStart);

                if (startDataValueIsSet) {
                    startValue = startDataValue;
                } else if (typeof this._startValue !== "undefined") {
                    startValue = this._startValue;
                } else {
                    startValue = out ? defaultStart : defaultEnd;
                }

                if (typeof this._endValue !== "undefined") {
                    endValue = this._endValue;
                } else {
                    endValue = out ? defaultEnd : defaultStart;
                }

                if (this._reverse) {
                    start[property] = endValue;
                    end[property] = startValue;
                } else {
                    start[property] = startValue;
                    end[property] = endValue;
                }

                that._shouldHide = end[property] === defaultEnd;
            }
        });
    }

    createToggleEffect("fade", "opacity", 1, 0);
    createToggleEffect("zoom", "scale", 1, 0.01);

    createEffect("slideMargin", {
        prepare: function(start, end) {
            var that = this,
                element = that.element,
                options = that.options,
                origin = element.data(ORIGIN),
                offset = options.offset,
                margin,
                reverse = that._reverse;

            if (!reverse && origin === null) {
                element.data(ORIGIN, parseFloat(element.css("margin-" + options.axis)));
            }

            margin = (element.data(ORIGIN) || 0);
            end["margin-" + options.axis] = !reverse ? margin + offset : margin;
        }
    });

    createEffect("slideTo", {
        prepare: function(start, end) {
            var that = this,
                element = that.element,
                options = that.options,
                offset = options.offset.split(","),
                reverse = that._reverse;

            if (transforms) {
                end.translatex = !reverse ? offset[0] : 0;
                end.translatey = !reverse ? offset[1] : 0;
            } else {
                end.left = !reverse ? offset[0] : 0;
                end.top = !reverse ? offset[1] : 0;
            }
            element.css("left");
        }
    });

    createEffect("expand", {
        directions: ["horizontal", "vertical"],

        restore: [ OVERFLOW ],

        prepare: function(start, end) {
            var that = this,
                element = that.element,
                options = that.options,
                reverse = that._reverse,
                property = that._direction === "vertical" ? HEIGHT : WIDTH,
                setLength = element[0].style[property],
                oldLength = element.data(property),
                length = parseFloat(oldLength || setLength),
                realLength = round(element.css(property, AUTO)[property]());

            start.overflow = HIDDEN;

            length = (options && options.reset) ? realLength || length : length || realLength;

            end[property] = (reverse ? 0 : length) + PX;
            start[property] = (reverse ? length : 0) + PX;

            if (oldLength === undefined) {
                element.data(property, setLength);
            }
        },

        shouldHide: function() {
           return this._reverse;
        },

        teardown: function() {
            var that = this,
                element = that.element,
                property = that._direction === "vertical" ? HEIGHT : WIDTH,
                length = element.data(property);

            if (length == AUTO || length === BLANK) {
                setTimeout(function() { element.css(property, AUTO).css(property); }, 0); // jQuery animate complete callback in IE is called before the last animation step!
            }
        }
    });

    var TRANSFER_START_STATE = { position: "absolute", marginLeft: 0, marginTop: 0, scale: 1 };
    /**
     * Intersection point formulas are taken from here - http://zonalandeducation.com/mmts/intersections/intersectionOfTwoLines1/intersectionOfTwoLines1.html
     * Formula for a linear function from two points from here - http://demo.activemath.org/ActiveMath2/search/show.cmd?id=mbase://AC_UK_calculus/functions/ex_linear_equation_two_points
     * The transform origin point is the intersection point of the two lines from the top left corners/top right corners of the element and target.
     * The math and variables below MAY BE SIMPLIFIED (zeroes removed), but this would make the formula too cryptic.
     */
    createEffect("transfer", {
        init: function(element, target) {
            this.element = element;
            this.options = { target: target };
            this.restore = [];
        },

        setup: function() {
            this.element.appendTo(document.body);
        },

        prepare: function(start, end) {
            var that = this,
                element = that.element,
                outerBox = fx.box(element),
                innerBox = fx.box(that.options.target),
                currentScale = animationProperty(element, "scale"),
                scale = fx.fillScale(innerBox, outerBox),
                transformOrigin = fx.transformOrigin(innerBox, outerBox);

            extend(start, TRANSFER_START_STATE);
            end.scale = 1;

            element.css(TRANSFORM, "scale(1)").css(TRANSFORM);
            element.css(TRANSFORM, "scale(" + currentScale + ")");

            start.top = outerBox.top;
            start.left = outerBox.left;
            start.transformOrigin = transformOrigin.x + PX + " " + transformOrigin.y + PX;

            if (that._reverse) {
                start.scale = scale;
            } else {
                end.scale = scale;
            }
        }
    });


    var CLIPS = {
        top: "rect(auto auto $size auto)",
        bottom: "rect($size auto auto auto)",
        left: "rect(auto $size auto auto)",
        right: "rect(auto auto auto $size)"
    };

    var ROTATIONS = {
        top:    { start: "rotatex(0deg)", end: "rotatex(180deg)" },
        bottom: { start: "rotatex(-180deg)", end: "rotatex(0deg)" },
        left:   { start: "rotatey(0deg)", end: "rotatey(-180deg)" },
        right:  { start: "rotatey(180deg)", end: "rotatey(0deg)" }
    };

    function clipInHalf(container, direction) {
        var vertical = kendo.directions[direction].vertical,
            size = (container[vertical ? HEIGHT : WIDTH]() / 2) + "px";

        return CLIPS[direction].replace("$size", size);
    }

    createEffect("turningPage", {
        directions: FOUR_DIRECTIONS,

        init: function(element, direction, container) {
            Effect.prototype.init.call(this, element, direction);
            this._container = container;
        },

        prepare: function(start, end) {
            var that = this,
                reverse = that._reverse,
                direction = reverse ? directions[that._direction].reverse : that._direction,
                rotation = ROTATIONS[direction];

            start.zIndex = 1;

            if (that._clipInHalf) {
               start.clip = clipInHalf(that._container, kendo.directions[direction].reverse);
            }

            start[BACKFACE] = HIDDEN;

            end[TRANSFORM] = TRANSFORM_PERSPECTIVE + (reverse ? rotation.start : rotation.end);
            start[TRANSFORM] = TRANSFORM_PERSPECTIVE + (reverse ? rotation.end : rotation.start);
        },

        setup: function() {
            this._container.append(this.element);
        },

        face: function(value) {
            this._face = value;
            return this;
        },

        shouldHide: function() {
            var that = this,
                reverse = that._reverse,
                face = that._face;

            return (reverse && !face) || (!reverse && face);
        },

        clipInHalf: function(value) {
            this._clipInHalf = value;
            return this;
        },

        temporary: function() {
            this.element.addClass('temp-page');
            return this;
        }
    });

    createEffect("staticPage", {
        directions: FOUR_DIRECTIONS,

        init: function(element, direction, container) {
            Effect.prototype.init.call(this, element, direction);
            this._container = container;
        },

        restore: ["clip"],

        prepare: function(start, end) {
            var that = this,
                direction = that._reverse ? directions[that._direction].reverse : that._direction;

            start.clip = clipInHalf(that._container, direction);
            start.opacity = 0.999;
            end.opacity = 1;
        },

        shouldHide: function() {
            var that = this,
                reverse = that._reverse,
                face = that._face;

            return (reverse && !face) || (!reverse && face);
        },

        face: function(value) {
            this._face = value;
            return this;
        }
    });

    createEffect("pageturn", {
        directions: ["horizontal", "vertical"],

        init: function(element, direction, face, back) {
            Effect.prototype.init.call(this, element, direction);
            this.options = {};
            this.options.face = face;
            this.options.back = back;
        },

        children: function() {
            var that = this,
                options = that.options,
                direction = that._direction === "horizontal" ? "left" : "top",
                reverseDirection = kendo.directions[direction].reverse,
                reverse = that._reverse,
                temp,
                faceClone = options.face.clone(true).removeAttr("id"),
                backClone = options.back.clone(true).removeAttr("id"),
                element = that.element;

            if (reverse) {
                temp = direction;
                direction = reverseDirection;
                reverseDirection = temp;
            }

            return [
                kendo.fx(options.face).staticPage(direction, element).face(true).setReverse(reverse),
                kendo.fx(options.back).staticPage(reverseDirection, element).setReverse(reverse),
                kendo.fx(faceClone).turningPage(direction, element).face(true).clipInHalf(true).temporary().setReverse(reverse),
                kendo.fx(backClone).turningPage(reverseDirection, element).clipInHalf(true).temporary().setReverse(reverse)
            ];
        },

        prepare: function(start, end) {
            start[PERSPECTIVE] = DEFAULT_PERSPECTIVE;
            start.transformStyle = "preserve-3d";
            // hack to trigger transition end.
            start.opacity = 0.999;
            end.opacity = 1;
        },

        teardown: function() {
            this.element.find(".temp-page").remove();
        }
    });

    createEffect("flip", {
        directions: ["horizontal", "vertical"],

        init: function(element, direction, face, back) {
            Effect.prototype.init.call(this, element, direction);
            this.options = {};
            this.options.face = face;
            this.options.back = back;
        },

        children: function() {
            var that = this,
                options = that.options,
                direction = that._direction === "horizontal" ? "left" : "top",
                reverseDirection = kendo.directions[direction].reverse,
                reverse = that._reverse,
                temp,
                element = that.element;

            if (reverse) {
                temp = direction;
                direction = reverseDirection;
                reverseDirection = temp;
            }

            return [
                kendo.fx(options.face).turningPage(direction, element).face(true).setReverse(reverse),
                kendo.fx(options.back).turningPage(reverseDirection, element).setReverse(reverse)
            ];
        },

        prepare: function(start) {
            start[PERSPECTIVE] = DEFAULT_PERSPECTIVE;
            start.transformStyle = "preserve-3d";
        }
    });

    var RESTORE_OVERFLOW = !support.mobileOS.android;
    var IGNORE_TRANSITION_EVENT_SELECTOR = ".km-touch-scrollbar, .km-actionsheet-wrapper";

    createEffect("replace", {
        _before: $.noop,
        _after: $.noop,
        init: function(element, previous, transitionClass) {
            Effect.prototype.init.call(this, element);
            this._previous = $(previous);
            this._transitionClass = transitionClass;
        },

        duration: function() {
            throw new Error("The replace effect does not support duration setting; the effect duration may be customized through the transition class rule");
        },

        beforeTransition: function(callback) {
            this._before = callback;
            return this;
        },

        afterTransition: function(callback) {
            this._after = callback;
            return this;
        },

        _both: function() {
            return $().add(this._element).add(this._previous);
        },

        _containerClass: function() {
            var direction = this._direction,
                containerClass = "k-fx k-fx-start k-fx-" + this._transitionClass;

            if (direction) {
                containerClass += " k-fx-" + direction;
            }

            if (this._reverse) {
                containerClass += " k-fx-reverse";
            }

            return containerClass;
        },

        complete: function(e) {
            if (!this.deferred || (e && $(e.target).is(IGNORE_TRANSITION_EVENT_SELECTOR))) {
                return;
            }

            var container = this.container;

            container
                .removeClass("k-fx-end")
                .removeClass(this._containerClass())
                .off(transitions.event, this.completeProxy);

            this._previous.hide().removeClass("k-fx-current");
            this.element.removeClass("k-fx-next");

            if (RESTORE_OVERFLOW) {
                container.css(OVERFLOW, "");
            }

            if (!this.isAbsolute) {
                this._both().css(POSITION, "");
            }

            this.deferred.resolve();
            delete this.deferred;
        },

        run: function() {
            if (this._additionalEffects && this._additionalEffects[0]) {
                return this.compositeRun();
            }

            var that = this,
                element = that.element,
                previous = that._previous,
                container = element.parents().filter(previous.parents()).first(),
                both = that._both(),
                deferred = $.Deferred(),
                originalPosition = element.css(POSITION),
                originalOverflow;

            // edge case for grid/scheduler, where the previous is already destroyed.
            if (!container.length) {
                container = element.parent();
            }

            this.container = container;
            this.deferred = deferred;
            this.isAbsolute = originalPosition  == "absolute";

            if (!this.isAbsolute) {
                both.css(POSITION, "absolute");
            }

            if (RESTORE_OVERFLOW) {
                originalOverflow = container.css(OVERFLOW);
                container.css(OVERFLOW, "hidden");
            }

            if (!transitions) {
                this.complete();
            } else {
                element.addClass("k-fx-hidden");

                container.addClass(this._containerClass());

                this.completeProxy = $.proxy(this, "complete");
                container.on(transitions.event, this.completeProxy);

                kendo.animationFrame(function() {
                    element.removeClass("k-fx-hidden").addClass("k-fx-next");
                    previous.css("display", "").addClass("k-fx-current");
                    that._before(previous, element);
                    kendo.animationFrame(function() {
                        container.removeClass("k-fx-start").addClass("k-fx-end");
                        that._after(previous, element);
                    });
                });
            }

            return deferred.promise();
        },

        stop: function() {
            this.complete();
        }
    });

    var Animation = kendo.Class.extend({
        init: function() {
            var that = this;
            that._tickProxy = proxy(that._tick, that);
            that._started = false;
        },

        tick: $.noop,
        done: $.noop,
        onEnd: $.noop,
        onCancel: $.noop,

        start: function() {
            if (!this.enabled()) {
                return;
            }

            if (!this.done()) {
                this._started = true;
                kendo.animationFrame(this._tickProxy);
            } else {
                this.onEnd();
            }
        },

        enabled: function() {
            return true;
        },

        cancel: function() {
            this._started = false;
            this.onCancel();
        },

        _tick: function() {
            var that = this;
            if (!that._started) { return; }

            that.tick();

            if (!that.done()) {
                kendo.animationFrame(that._tickProxy);
            } else {
                that._started = false;
                that.onEnd();
            }
        }
    });

    var Transition = Animation.extend({
        init: function(options) {
            var that = this;
            extend(that, options);
            Animation.fn.init.call(that);
        },

        done: function() {
            return this.timePassed() >= this.duration;
        },

        timePassed: function() {
            return Math.min(this.duration, (new Date()) - this.startDate);
        },

        moveTo: function(options) {
            var that = this,
                movable = that.movable;

            that.initial = movable[that.axis];
            that.delta = options.location - that.initial;

            that.duration = typeof options.duration == "number" ? options.duration : 300;

            that.tick = that._easeProxy(options.ease);

            that.startDate = new Date();
            that.start();
        },

        _easeProxy: function(ease) {
            var that = this;

            return function() {
                that.movable.moveAxis(that.axis, ease(that.timePassed(), that.initial, that.delta, that.duration));
            };
        }
    });

    extend(Transition, {
        easeOutExpo: function (t, b, c, d) {
            return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        },

        easeOutBack: function (t, b, c, d, s) {
            s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        }
    });

    fx.Animation = Animation;
    fx.Transition = Transition;
    fx.createEffect = createEffect;

    fx.box = function(element) {
        element = $(element);
        var result = element.offset();
        result.width = element.outerWidth();
        result.height = element.outerHeight();
        return result;
    };

    fx.transformOrigin = function(inner, outer) {
        var x = (inner.left - outer.left) * outer.width / (outer.width - inner.width),
            y = (inner.top - outer.top) * outer.height / (outer.height - inner.height);

        return {
            x: isNaN(x) ? 0 : x,
            y: isNaN(y) ? 0 : y
        };
    };

    fx.fillScale = function(inner, outer) {
        return Math.min(inner.width / outer.width, inner.height / outer.height);
    };

    fx.fitScale = function(inner, outer) {
        return Math.max(inner.width / outer.width, inner.height / outer.height);
    };
})(window.kendo.jQuery);





(function($, undefined) {
    var kendo = window.kendo,
        Widget = kendo.ui.Widget,
        Draggable = kendo.ui.Draggable,
        isPlainObject = $.isPlainObject,
        activeElement = kendo._activeElement,
        proxy = $.proxy,
        extend = $.extend,
        each = $.each,
        template = kendo.template,
        BODY = "body",
        templates,
        NS = ".kendoWindow",
        // classNames
        KWINDOW = ".k-window",
        KWINDOWTITLE = ".k-window-title",
        KWINDOWTITLEBAR = KWINDOWTITLE + "bar",
        KWINDOWCONTENT = ".k-window-content",
        KWINDOWRESIZEHANDLES = ".k-resize-handle",
        KOVERLAY = ".k-overlay",
        KCONTENTFRAME = "k-content-frame",
        LOADING = "k-loading",
        KHOVERSTATE = "k-state-hover",
        KFOCUSEDSTATE = "k-state-focused",
        MAXIMIZEDSTATE = "k-window-maximized",
        // constants
        VISIBLE = ":visible",
        HIDDEN = "hidden",
        CURSOR = "cursor",
        // events
        OPEN = "open",
        ACTIVATE = "activate",
        DEACTIVATE = "deactivate",
        CLOSE = "close",
        REFRESH = "refresh",
        RESIZE = "resize",
        RESIZEEND = "resizeEnd",
        DRAGSTART = "dragstart",
        DRAGEND = "dragend",
        ERROR = "error",
        OVERFLOW = "overflow",
        ZINDEX = "zIndex",
        MINIMIZE_MAXIMIZE = ".k-window-actions .k-i-minimize,.k-window-actions .k-i-maximize",
        KPIN = ".k-i-pin",
        KUNPIN = ".k-i-unpin",
        PIN_UNPIN = KPIN + "," + KUNPIN,
        TITLEBAR_BUTTONS = ".k-window-titlebar .k-window-action",
        REFRESHICON = ".k-window-titlebar .k-i-refresh",
        isLocalUrl = kendo.isLocalUrl;

    function defined(x) {
        return (typeof x != "undefined");
    }

    function constrain(value, low, high) {
        return Math.max(Math.min(parseInt(value, 10), high === Infinity ? high : parseInt(high, 10)), parseInt(low, 10));
    }

    function sizingAction(actionId, callback) {
        return function() {
            var that = this,
                wrapper = that.wrapper,
                style = wrapper[0].style,
                options = that.options;

            if (options.isMaximized || options.isMinimized) {
                return;
            }

            that.restoreOptions = {
                width: style.width,
                height: style.height
            };

            wrapper
                .children(KWINDOWRESIZEHANDLES).hide().end()
                .children(KWINDOWTITLEBAR).find(MINIMIZE_MAXIMIZE).parent().hide()
                    .eq(0).before(templates.action({ name: "Restore" }));

            callback.call(that);

            if (actionId == "maximize") {
                that.wrapper.children(KWINDOWTITLEBAR).find(PIN_UNPIN).parent().hide();
            } else {
                that.wrapper.children(KWINDOWTITLEBAR).find(PIN_UNPIN).parent().show();
            }

            return that;
        };
    }

    function executableScript() {
        return !this.type || this.type.toLowerCase().indexOf("script") >= 0;
    }

    var Window = Widget.extend({
        init: function(element, options) {
            var that = this,
                wrapper,
                offset = {},
                visibility, display, position,
                isVisible = false,
                content,
                windowContent,
                suppressActions = options && options.actions && !options.actions.length,
                id;

            Widget.fn.init.call(that, element, options);
            options = that.options;
            position = options.position;
            element = that.element;
            content = options.content;

            if (suppressActions) {
                options.actions = [];
            }

            that.appendTo = $(options.appendTo);

            that._animations();

            if (content && !isPlainObject(content)) {
                content = options.content = { url: content };
            }

            // remove script blocks to prevent double-execution
            element.find("script").filter(executableScript).remove();

            if (!element.parent().is(that.appendTo) && (position.top === undefined || position.left === undefined)) {
                if (element.is(VISIBLE)) {
                    offset = element.offset();
                    isVisible = true;
                } else {
                    visibility = element.css("visibility");
                    display = element.css("display");

                    element.css({ visibility: HIDDEN, display: "" });
                    offset = element.offset();
                    element.css({ visibility: visibility, display: display });
                }

                if (position.top === undefined) {
                    position.top = offset.top;
                }
                if (position.left === undefined) {
                    position.left = offset.left;
                }
            }

            if (!defined(options.visible) || options.visible === null) {
                options.visible = element.is(VISIBLE);
            }

            wrapper = that.wrapper = element.closest(KWINDOW);

            if (!element.is(".k-content") || !wrapper[0]) {
                element.addClass("k-window-content k-content");
                that._createWindow(element, options);
                wrapper = that.wrapper = element.closest(KWINDOW);

                that._dimensions();
            }

            that._position();

            if (options.pinned) {
                that.pin(true);
            }

            if (content) {
                that.refresh(content);
            }

            if (options.visible) {
                that.toFront();
            }

            windowContent = wrapper.children(KWINDOWCONTENT);
            that._tabindex(windowContent);

            if (options.visible && options.modal) {
                that._overlay(wrapper.is(VISIBLE)).css({ opacity: 0.5 });
            }

            wrapper
                .on("mouseenter" + NS, TITLEBAR_BUTTONS, proxy(that._buttonEnter, that))
                .on("mouseleave" + NS, TITLEBAR_BUTTONS, proxy(that._buttonLeave, that))
                .on("click" + NS, "> " + TITLEBAR_BUTTONS, proxy(that._windowActionHandler, that));

            windowContent
                .on("keydown" + NS, proxy(that._keydown, that))
                .on("focus" + NS, proxy(that._focus, that))
                .on("blur" + NS, proxy(that._blur, that));

            this._resizable();

            this._draggable();

            id = element.attr("id");
            if (id) {
                id = id + "_wnd_title";
                wrapper.children(KWINDOWTITLEBAR)
                       .children(KWINDOWTITLE)
                       .attr("id", id);

                windowContent
                    .attr({
                        "role": "dialog",
                        "aria-labelledby": id
                    });
            }

            wrapper.add(wrapper.children(".k-resize-handle," + KWINDOWTITLEBAR))
                    .on("mousedown" + NS, proxy(that.toFront, that));

            that.touchScroller = kendo.touchScroller(element);

            that._resizeHandler = proxy(that._onDocumentResize, that);

            that._marker = kendo.guid().substring(0, 8);

            $(window).on("resize" + NS + that._marker, that._resizeHandler);

            if (options.visible) {
                that.trigger(OPEN);
                that.trigger(ACTIVATE);
            }

            kendo.notify(that);
        },

        _buttonEnter: function(e) {
            $(e.currentTarget).addClass(KHOVERSTATE);
        },

        _buttonLeave: function(e) {
            $(e.currentTarget).removeClass(KHOVERSTATE);
        },

        _focus: function() {
            this.wrapper.addClass(KFOCUSEDSTATE);
        },

        _blur: function() {
            this.wrapper.removeClass(KFOCUSEDSTATE);
        },

        _dimensions: function() {
            var wrapper = this.wrapper;
            var options = this.options;
            var width = options.width;
            var height = options.height;
            var maxHeight = options.maxHeight;
            var dimensions = ["minWidth","minHeight","maxWidth","maxHeight"];

            this.title(options.title);

            for (var i = 0; i < dimensions.length; i++) {
                var value = options[dimensions[i]];
                if (value && value != Infinity) {
                    wrapper.css(dimensions[i], value);
                }
            }

            if (maxHeight && maxHeight != Infinity) {
                this.element.css("maxHeight", maxHeight);
            }

            if (width) {
                if (width.toString().indexOf("%") > 0) {
                    wrapper.width(width);
                } else {
                    wrapper.width(constrain(width, options.minWidth, options.maxWidth));
                }
            }

            if (height) {
                if (height.toString().indexOf("%") > 0) {
                    wrapper.height(height);
                } else {
                    wrapper.height(constrain(height, options.minHeight, options.maxHeight));
                }
            }

            if (!options.visible) {
                wrapper.hide();
            }
        },

        _position: function() {
            var wrapper = this.wrapper,
                position = this.options.position;

            if (position.top === 0) {
                position.top = position.top.toString();
            }

            if (position.left === 0) {
                position.left = position.left.toString();
            }

            wrapper.css({
                top: position.top || "",
                left: position.left || ""
            });
        },

        _animations: function() {
            var options = this.options;

            if (options.animation === false) {
                options.animation = { open: { effects: {} }, close: { hide: true, effects: {} } };
            }
        },

        _resize: function() {
            kendo.resize(this.element.children());
        },

        _resizable: function() {
            var resizable = this.options.resizable;
            var wrapper = this.wrapper;

            if (this.resizing) {
                wrapper
                    .off("dblclick" + NS)
                    .children(KWINDOWRESIZEHANDLES).remove();

                this.resizing.destroy();
                this.resizing = null;
            }

            if (resizable) {
                wrapper.on("dblclick" + NS, KWINDOWTITLEBAR, proxy(function(e) {
                    if (!$(e.target).closest(".k-window-action").length) {
                        this.toggleMaximization();
                    }
                }, this));

                each("n e s w se sw ne nw".split(" "), function(index, handler) {
                    wrapper.append(templates.resizeHandle(handler));
                });

                this.resizing = new WindowResizing(this);
            }

            wrapper = null;
        },

        _draggable: function() {
            var draggable = this.options.draggable;

            if (this.dragging) {
                this.dragging.destroy();
                this.dragging = null;
            }
            if (draggable) {
                this.dragging = new WindowDragging(this, draggable.dragHandle || KWINDOWTITLEBAR);
            }
        },

        _actions: function() {
            var actions = this.options.actions;
            var titlebar = this.wrapper.children(KWINDOWTITLEBAR);
            var container = titlebar.find(".k-window-actions");

            actions = $.map(actions, function(action) {
                return { name: action };
            });

            container.html(kendo.render(templates.action, actions));
        },

        setOptions: function(options) {
            Widget.fn.setOptions.call(this, options);
            this._animations();
            this._dimensions();
            this._position();
            this._resizable();
            this._draggable();
            this._actions();
        },

        events:[
            OPEN,
            ACTIVATE,
            DEACTIVATE,
            CLOSE,
            REFRESH,
            RESIZE,
            RESIZEEND,
            DRAGSTART,
            DRAGEND,
            ERROR
        ],

        options: {
            name: "Window",
            animation: {
                open: {
                    effects: { zoom: { direction: "in" }, fade: { direction: "in" } },
                    duration: 350
                },
                close: {
                    effects: { zoom: { direction: "out", properties: { scale: 0.7 } }, fade: { direction: "out" } },
                    duration: 350,
                    hide: true
                }
            },
            title: "",
            actions: ["Close"],
            autoFocus: true,
            modal: false,
            resizable: true,
            draggable: true,
            minWidth: 90,
            minHeight: 50,
            maxWidth: Infinity,
            maxHeight: Infinity,
            pinned: false,
            position: {},
            content: null,
            visible: null,
            height: null,
            width: null,
            appendTo: "body"
        },

        _closable: function() {
            return $.inArray("close", $.map(this.options.actions, function(x) { return x.toLowerCase(); })) > -1;
        },

        _keydown: function(e) {
            var that = this,
                options = that.options,
                keys = kendo.keys,
                keyCode = e.keyCode,
                wrapper = that.wrapper,
                offset, handled,
                distance = 10,
                isMaximized = that.options.isMaximized,
                newWidth, newHeight, w, h;

            if (e.target != e.currentTarget || that._closing) {
                return;
            }

            if (keyCode == keys.ESC && that._closable()) {
                that._close(false);
            }

            if (options.draggable && !e.ctrlKey && !isMaximized) {
                offset = kendo.getOffset(wrapper);

                if (keyCode == keys.UP) {
                    handled = wrapper.css("top", offset.top - distance);
                } else if (keyCode == keys.DOWN) {
                    handled = wrapper.css("top", offset.top + distance);
                } else if (keyCode == keys.LEFT) {
                    handled = wrapper.css("left", offset.left - distance);
                } else if (keyCode == keys.RIGHT) {
                    handled = wrapper.css("left", offset.left + distance);
                }
            }

            if (options.resizable && e.ctrlKey && !isMaximized) {
                if (keyCode == keys.UP) {
                    handled = true;
                    newHeight = wrapper.height() - distance;
                } else if (keyCode == keys.DOWN) {
                    handled = true;
                    newHeight = wrapper.height() + distance;
                } if (keyCode == keys.LEFT) {
                    handled = true;
                    newWidth = wrapper.width() - distance;
                } else if (keyCode == keys.RIGHT) {
                    handled = true;
                    newWidth = wrapper.width() + distance;
                }

                if (handled) {
                    w = constrain(newWidth, options.minWidth, options.maxWidth);
                    h = constrain(newHeight, options.minHeight, options.maxHeight);

                    if (!isNaN(w)) {
                        wrapper.width(w);
                        that.options.width = w + "px";
                    }
                    if (!isNaN(h)) {
                        wrapper.height(h);
                        that.options.height = h + "px";
                    }

                    that.resize();
                }
            }

            if (handled) {
                e.preventDefault();
            }
        },

        _overlay: function (visible) {
            var overlay = this.appendTo.children(KOVERLAY),
                wrapper = this.wrapper;

            if (!overlay.length) {
                overlay = $("<div class='k-overlay' />");
            }

            overlay
                .insertBefore(wrapper[0])
                .toggle(visible)
                .css(ZINDEX, parseInt(wrapper.css(ZINDEX), 10) - 1);

            return overlay;
        },

        _actionForIcon: function(icon) {
            var iconClass = /\bk-i-\w+\b/.exec(icon[0].className)[0];

            return {
                "k-i-close": "_close",
                "k-i-maximize": "maximize",
                "k-i-minimize": "minimize",
                "k-i-restore": "restore",
                "k-i-refresh": "refresh",
                "k-i-pin": "pin",
                "k-i-unpin": "unpin"
            }[iconClass];
        },

        _windowActionHandler: function (e) {
            if (this._closing) {
                return;
            }

            var icon = $(e.target).closest(".k-window-action").find(".k-icon");
            var action = this._actionForIcon(icon);

            if (action) {
                e.preventDefault();
                this[action]();
                return false;
            }
        },

        _modals: function() {
            var that = this;

            var zStack = $(KWINDOW).filter(function() {
                var dom = $(this);
                var object = that._object(dom);
                var options = object && object.options;

                return options && options.modal && options.visible && dom.is(VISIBLE);
            }).sort(function(a, b){
                return +$(a).css("zIndex") - +$(b).css("zIndex");
            });

            that = null;

            return zStack;
        },

        _object: function(element) {
            var content = element.children(KWINDOWCONTENT);

            return content.data("kendoWindow") || content.data("kendo" + this.options.name);
        },

        center: function () {
            var that = this,
                position = that.options.position,
                wrapper = that.wrapper,
                documentWindow = $(window),
                scrollTop = 0,
                scrollLeft = 0,
                newTop, newLeft;

            if (that.options.isMaximized) {
                return that;
            }

            if (!that.options.pinned) {
                scrollTop = documentWindow.scrollTop();
                scrollLeft = documentWindow.scrollLeft();
            }

            newLeft = scrollLeft + Math.max(0, (documentWindow.width() - wrapper.width()) / 2);
            newTop = scrollTop + Math.max(0, (documentWindow.height() - wrapper.height() - parseInt(wrapper.css("paddingTop"), 10)) / 2);

            wrapper.css({
                left: newLeft,
                top: newTop
            });

            position.top = newTop;
            position.left = newLeft;

            return that;
        },

        title: function (text) {
            var that = this,
                wrapper = that.wrapper,
                options = that.options,
                titleBar = wrapper.children(KWINDOWTITLEBAR),
                title = titleBar.children(KWINDOWTITLE),
                titleBarHeight;

            if (!arguments.length) {
                return title.text();
            }

            if (text === false) {
                wrapper.addClass("k-window-titleless");
                titleBar.remove();
            } else {
                if (!titleBar.length) {
                    wrapper.prepend(templates.titlebar(options));
                    that._actions();
                    titleBar = wrapper.children(KWINDOWTITLEBAR);
                } else {
                    title.html(text);
                }

                titleBarHeight = titleBar.outerHeight();

                wrapper.css("padding-top", titleBarHeight);
                titleBar.css("margin-top", -titleBarHeight);
            }

            that.options.title = text;

            return that;
        },

        content: function (html, data) {
            var content = this.wrapper.children(KWINDOWCONTENT),
                scrollContainer = content.children(".km-scroll-container");

            content = scrollContainer[0] ? scrollContainer : content;

            if (!defined(html)) {
                return content.html();
            }

            this.angular("cleanup", function(){
                return { elements: content.children() };
            });

            kendo.destroy(this.element.children());

            content.empty().html(html);

            this.angular("compile", function(){
                var a = [];
                for (var i = content.length; --i >= 0;) {
                    a.push({ dataItem: data });
                }
                return {
                    elements: content.children(),
                    data: a
                };
            });

            return this;
        },

        open: function () {
            var that = this,
                wrapper = that.wrapper,
                options = that.options,
                showOptions = options.animation.open,
                contentElement = wrapper.children(KWINDOWCONTENT),
                overlay;

            if (!that.trigger(OPEN)) {
                if (that._closing) {
                    wrapper.kendoStop(true, true);
                }

                that._closing = false;

                that.toFront();

                if (options.autoFocus) {
                    that.element.focus();
                }

                options.visible = true;

                if (options.modal) {
                    overlay = that._overlay(false);

                    overlay.kendoStop(true, true);

                    if (showOptions.duration && kendo.effects.Fade) {
                        var overlayFx = kendo.fx(overlay).fadeIn();
                        overlayFx.duration(showOptions.duration || 0);
                        overlayFx.endValue(0.5);
                        overlayFx.play();
                    } else {
                        overlay.css("opacity", 0.5);
                    }

                    overlay.show();
                }

                if (!wrapper.is(VISIBLE)) {
                    contentElement.css(OVERFLOW, HIDDEN);
                    wrapper.show().kendoStop().kendoAnimate({
                        effects: showOptions.effects,
                        duration: showOptions.duration,
                        complete: proxy(this._activate, this)
                    });
                }
            }

            if (options.isMaximized) {
                that._documentScrollTop = $(document).scrollTop();
                $("html, body").css(OVERFLOW, HIDDEN);
            }

            return that;
        },

        _activate: function() {
            if (this.options.autoFocus) {
                this.element.focus();
            }
            this.trigger(ACTIVATE);
            this.wrapper.children(KWINDOWCONTENT).css(OVERFLOW, "");
        },

        _removeOverlay: function(suppressAnimation) {
            var modals = this._modals();
            var options = this.options;
            var hideOverlay = options.modal && !modals.length;
            var overlay = options.modal ? this._overlay(true) : $(undefined);
            var hideOptions = options.animation.close;

            if (hideOverlay) {
                if (!suppressAnimation && hideOptions.duration && kendo.effects.Fade) {
                    var overlayFx = kendo.fx(overlay).fadeOut();
                    overlayFx.duration(hideOptions.duration || 0);
                    overlayFx.startValue(0.5);
                    overlayFx.play();
                } else {
                    this._overlay(false).remove();
                }
            } else if (modals.length) {
                this._object(modals.last())._overlay(true);
            }
        },

        _close: function(systemTriggered) {
            var that = this,
                wrapper = that.wrapper,
                options = that.options,
                showOptions = options.animation.open,
                hideOptions = options.animation.close;

            if (wrapper.is(VISIBLE) && !that.trigger(CLOSE, { userTriggered: !systemTriggered })) {
                if (that._closing) {
                    return;
                }

                that._closing = true;
                options.visible = false;

                $(KWINDOW).each(function(i, element) {
                    var contentElement = $(element).children(KWINDOWCONTENT);

                    // Remove overlay set by toFront
                    if (element != wrapper && contentElement.find("> ." + KCONTENTFRAME).length > 0) {
                        contentElement.children(KOVERLAY).remove();
                    }
                });

                this._removeOverlay();

                wrapper.kendoStop().kendoAnimate({
                    effects: hideOptions.effects || showOptions.effects,
                    reverse: hideOptions.reverse === true,
                    duration: hideOptions.duration,
                    complete: proxy(this._deactivate, this)
                });
            }

            if (that.options.isMaximized) {
                $("html, body").css(OVERFLOW, "");
                if (that._documentScrollTop && that._documentScrollTop > 0) {
                    $(document).scrollTop(that._documentScrollTop);
                }
            }
        },

        _deactivate: function() {
            this.wrapper.hide().css("opacity","");
            this.trigger(DEACTIVATE);
            var lastModal = this._object(this._modals().last());
            if (lastModal) {
                lastModal.toFront();
            }
        },

        close: function () {
            this._close(true);
            return this;
        },

        _actionable: function(element) {
            return $(element).is(TITLEBAR_BUTTONS + "," + TITLEBAR_BUTTONS + " .k-icon,:input,a");
        },

        _shouldFocus: function(target) {
            var active = activeElement(),
                element = this.element;

            return this.options.autoFocus &&
                    !$(active).is(element) &&
                    !this._actionable(target) &&
                    (!element.find(active).length || !element.find(target).length);
        },

        toFront: function (e) {
            var that = this,
                wrapper = that.wrapper,
                currentWindow = wrapper[0],
                zIndex = +wrapper.css(ZINDEX),
                originalZIndex = zIndex,
                target = (e && e.target) || null;

            $(KWINDOW).each(function(i, element) {
                var windowObject = $(element),
                    zIndexNew = windowObject.css(ZINDEX),
                    contentElement = windowObject.children(KWINDOWCONTENT);

                if (!isNaN(zIndexNew)) {
                    zIndex = Math.max(+zIndexNew, zIndex);
                }

                // Add overlay to windows with iframes and lower z-index to prevent
                // trapping of events when resizing / dragging
                if (element != currentWindow && contentElement.find("> ." + KCONTENTFRAME).length > 0) {
                    contentElement.append(templates.overlay);
                }
            });

            if (!wrapper[0].style.zIndex || originalZIndex < zIndex) {
                wrapper.css(ZINDEX, zIndex + 2);
            }
            that.element.find("> .k-overlay").remove();

            if (that._shouldFocus(target)) {
                that.element.focus();

                var scrollTop = $(window).scrollTop(),
                    windowTop = parseInt(wrapper.position().top, 10);

                if (windowTop > 0 && windowTop < scrollTop) {
                    if (scrollTop > 0) {
                        $(window).scrollTop(windowTop);
                    } else {
                        wrapper.css("top", scrollTop);
                    }
                }
            }

            wrapper = null;

            return that;
        },

        toggleMaximization: function () {
            if (this._closing) {
                return this;
            }

            return this[this.options.isMaximized ? "restore" : "maximize"]();
        },

        restore: function () {
            var that = this;
            var options = that.options;
            var minHeight = options.minHeight;
            var restoreOptions = that.restoreOptions;

            if (!options.isMaximized && !options.isMinimized) {
                return that;
            }

            if (minHeight && minHeight != Infinity) {
                that.wrapper.css("min-height", minHeight);
            }

            that.wrapper
                .css({
                    position: options.pinned ? "fixed" : "absolute",
                    left: restoreOptions.left,
                    top: restoreOptions.top,
                    width: restoreOptions.width,
                    height: restoreOptions.height
                })
                .removeClass(MAXIMIZEDSTATE)
                .find(".k-window-content,.k-resize-handle").show().end()
                .find(".k-window-titlebar .k-i-restore").parent().remove().end().end()
                .find(MINIMIZE_MAXIMIZE).parent().show().end().end()
                .find(PIN_UNPIN).parent().show();

            that.options.width = restoreOptions.width;
            that.options.height = restoreOptions.height;

            $("html, body").css(OVERFLOW, "");
            if (this._documentScrollTop && this._documentScrollTop > 0) {
                $(document).scrollTop(this._documentScrollTop);
            }

            options.isMaximized = options.isMinimized = false;

            that.resize();

            return that;
        },

        maximize: sizingAction("maximize", function() {
            var that = this,
                wrapper = that.wrapper,
                position = wrapper.position();

            extend(that.restoreOptions, {
                left: position.left,
                top: position.top
            });

            wrapper.css({
                    left: 0,
                    top: 0,
                    position: "fixed"
                })
                .addClass(MAXIMIZEDSTATE);

            this._documentScrollTop = $(document).scrollTop();
            $("html, body").css(OVERFLOW, HIDDEN);

            that.options.isMaximized = true;

            that._onDocumentResize();
        }),

        minimize: sizingAction("minimize", function() {
            var that = this;

            that.wrapper.css({
                height: "",
                minHeight: ""
            });

            that.element.hide();

            that.options.isMinimized = true;
        }),

        pin: function(force) {
            var that = this,
                win = $(window),
                wrapper = that.wrapper,
                top = parseInt(wrapper.css("top"), 10),
                left = parseInt(wrapper.css("left"), 10);

            if (force || !that.options.pinned && !that.options.isMaximized) {
                wrapper.css({position: "fixed", top: top - win.scrollTop(), left: left - win.scrollLeft()});
                wrapper.children(KWINDOWTITLEBAR).find(KPIN).addClass("k-i-unpin").removeClass("k-i-pin");

                that.options.pinned = true;
            }
        },

        unpin: function() {
            var that = this,
                win = $(window),
                wrapper = that.wrapper,
                top = parseInt(wrapper.css("top"), 10),
                left = parseInt(wrapper.css("left"), 10);

            if (that.options.pinned && !that.options.isMaximized) {
                wrapper.css({position: "", top: top + win.scrollTop(), left: left + win.scrollLeft()});
                wrapper.children(KWINDOWTITLEBAR).find(KUNPIN).addClass("k-i-pin").removeClass("k-i-unpin");

                that.options.pinned = false;
            }
        },

        _onDocumentResize: function () {
            var that = this,
                wrapper = that.wrapper,
                wnd = $(window),
                w, h;

            if (!that.options.isMaximized) {
                return;
            }

            w = wnd.width();
            h = wnd.height() - parseInt(wrapper.css("padding-top"), 10);

            wrapper.css({
                    width: w,
                    height: h
                });
            that.options.width = w;
            that.options.height = h;

            that.resize();
        },

        refresh: function (options) {
            var that = this,
                initOptions = that.options,
                element = $(that.element),
                iframe,
                showIframe,
                url;

            if (!isPlainObject(options)) {
                options = { url: options };
            }

            options = extend({}, initOptions.content, options);

            showIframe = defined(initOptions.iframe) ? initOptions.iframe : options.iframe;

            url = options.url;

            if (url) {
                if (!defined(showIframe)) {
                    showIframe = !isLocalUrl(url);
                }

                if (!showIframe) {
                    // perform AJAX request
                    that._ajaxRequest(options);
                } else {
                    iframe = element.find("." + KCONTENTFRAME)[0];

                    if (iframe) {
                        // refresh existing iframe
                        iframe.src = url || iframe.src;
                    } else {
                        // render new iframe
                        element.html(templates.contentFrame(extend({}, initOptions, { content: options })));
                    }

                    element.find("." + KCONTENTFRAME)
                        .unbind("load" + NS)
                        .on("load" + NS, proxy(this._triggerRefresh, this));
                }
            } else {
                if (options.template) {
                    // refresh template
                    that.content(template(options.template)({}));
                }

                that.trigger(REFRESH);
            }

            element.toggleClass("k-window-iframecontent", !!showIframe);

            return that;
        },

        _triggerRefresh: function() {
            this.trigger(REFRESH);
        },

        _ajaxComplete: function() {
            clearTimeout(this._loadingIconTimeout);
            this.wrapper.find(REFRESHICON).removeClass(LOADING);
        },

        _ajaxError: function (xhr, status) {
            this.trigger(ERROR, { status: status, xhr: xhr });
        },

        _ajaxSuccess: function (contentTemplate) {
            return function (data) {
                var html = data;
                if (contentTemplate) {
                    html = template(contentTemplate)(data || {});
                }

                this.content(html, data);
                this.element.prop("scrollTop", 0);

                this.trigger(REFRESH);
            };
        },

        _showLoading: function() {
            this.wrapper.find(REFRESHICON).addClass(LOADING);
        },

        _ajaxRequest: function (options) {
            this._loadingIconTimeout = setTimeout(proxy(this._showLoading, this), 100);

            $.ajax(extend({
                type: "GET",
                dataType: "html",
                cache: false,
                error: proxy(this._ajaxError, this),
                complete: proxy(this._ajaxComplete, this),
                success: proxy(this._ajaxSuccess(options.template), this)
            }, options));
        },

        destroy: function () {
            var that = this;

            if (that.resizing) {
                that.resizing.destroy();
            }

            if (that.dragging) {
                that.dragging.destroy();
            }

            that.wrapper.off(NS)
                .children(KWINDOWCONTENT).off(NS).end()
                .find(".k-resize-handle,.k-window-titlebar").off(NS);

            $(window).off("resize" + NS + that._marker);

            clearTimeout(that._loadingIconTimeout);

            Widget.fn.destroy.call(that);

            that.unbind(undefined);

            kendo.destroy(that.wrapper);

            that._removeOverlay(true);

            that.wrapper.empty().remove();

            that.wrapper = that.appendTo = that.element = $();
        },

        _createWindow: function() {
            var contentHtml = this.element,
                options = this.options,
                iframeSrcAttributes,
                wrapper,
                isRtl = kendo.support.isRtl(contentHtml);

            if (options.scrollable === false) {
                contentHtml.attr("style", "overflow:hidden;");
            }

            wrapper = $(templates.wrapper(options));

            // Collect the src attributes of all iframes and then set them to empty string.
            // This seems to fix this IE9 "feature": http://msdn.microsoft.com/en-us/library/gg622929%28v=VS.85%29.aspx?ppud=4
            iframeSrcAttributes = contentHtml.find("iframe:not(.k-content)").map(function() {
                var src = this.getAttribute("src");
                this.src = "";
                return src;
            });

            // Make sure the wrapper is appended to the body only once. IE9+ will throw exceptions if you move iframes in DOM
            wrapper
                .toggleClass("k-rtl", isRtl)
                .appendTo(this.appendTo)
                .append(contentHtml)
                .find("iframe:not(.k-content)").each(function(index) {
                   // Restore the src attribute of the iframes when they are part of the live DOM tree
                   this.src = iframeSrcAttributes[index];
                });

            wrapper.find(".k-window-title")
                .css(isRtl ? "left" : "right", wrapper.find(".k-window-actions").outerWidth() + 10);

            contentHtml.css("visibility", "").show();

            contentHtml.find("[data-role=editor]").each(function() {
                var editor = $(this).data("kendoEditor");

                if (editor) {
                    editor.refresh();
                }
            });

            wrapper = contentHtml = null;
        }
    });

    templates = {
        wrapper: template("<div class='k-widget k-window' />"),
        action: template(
            "<a role='button' href='\\#' class='k-window-action k-link'>" +
                "<span role='presentation' class='k-icon k-i-#= name.toLowerCase() #'>#= name #</span>" +
            "</a>"
        ),
        titlebar: template(
            "<div class='k-window-titlebar k-header'>&nbsp;" +
                "<span class='k-window-title'>#= title #</span>" +
                "<div class='k-window-actions' />" +
            "</div>"
        ),
        overlay: "<div class='k-overlay' />",
        contentFrame: template(
            "<iframe frameborder='0' title='#= title #' class='" + KCONTENTFRAME + "' " +
                "src='#= content.url #'>" +
                    "This page requires frames in order to show content" +
            "</iframe>"
        ),
        resizeHandle: template("<div class='k-resize-handle k-resize-#= data #'></div>")
    };


    function WindowResizing(wnd) {
        var that = this;
        that.owner = wnd;
        that._draggable = new Draggable(wnd.wrapper, {
            filter: ">" + KWINDOWRESIZEHANDLES,
            group: wnd.wrapper.id + "-resizing",
            dragstart: proxy(that.dragstart, that),
            drag: proxy(that.drag, that),
            dragend: proxy(that.dragend, that)
        });

        that._draggable.userEvents.bind("press", proxy(that.addOverlay, that));
        that._draggable.userEvents.bind("release", proxy(that.removeOverlay, that));
    }

    WindowResizing.prototype = {
        addOverlay: function () {
            this.owner.wrapper.append(templates.overlay);
        },
        removeOverlay: function () {
            this.owner.wrapper.find(KOVERLAY).remove();
        },
        dragstart: function (e) {
            var that = this;
            var wnd = that.owner;
            var wrapper = wnd.wrapper;

            that.elementPadding = parseInt(wrapper.css("padding-top"), 10);
            that.initialPosition = kendo.getOffset(wrapper, "position");

            that.resizeDirection = e.currentTarget.prop("className").replace("k-resize-handle k-resize-", "");

            that.initialSize = {
                width: wrapper.width(),
                height: wrapper.height()
            };

            that.containerOffset = kendo.getOffset(wnd.appendTo, "position");

            wrapper
                .children(KWINDOWRESIZEHANDLES).not(e.currentTarget).hide();

            $(BODY).css(CURSOR, e.currentTarget.css(CURSOR));
        },
        drag: function (e) {
            var that = this,
                wnd = that.owner,
                wrapper = wnd.wrapper,
                options = wnd.options,
                direction = that.resizeDirection,
                containerOffset = that.containerOffset,
                initialPosition = that.initialPosition,
                initialSize = that.initialSize,
                newWidth, newHeight,
                windowBottom, windowRight,
                x = Math.max(e.x.location, containerOffset.left),
                y = Math.max(e.y.location, containerOffset.top);

            if (direction.indexOf("e") >= 0) {
                newWidth = x - initialPosition.left;

                wrapper.width(constrain(newWidth, options.minWidth, options.maxWidth));
            } else if (direction.indexOf("w") >= 0) {
                windowRight = initialPosition.left + initialSize.width;
                newWidth = constrain(windowRight - x, options.minWidth, options.maxWidth);

                wrapper.css({
                    left: windowRight - newWidth - containerOffset.left,
                    width: newWidth
                });
            }

            if (direction.indexOf("s") >= 0) {
                newHeight = y - initialPosition.top - that.elementPadding;

                wrapper.height(constrain(newHeight, options.minHeight, options.maxHeight));
            } else if (direction.indexOf("n") >= 0) {
                windowBottom = initialPosition.top + initialSize.height;
                newHeight = constrain(windowBottom - y, options.minHeight, options.maxHeight);

                wrapper.css({
                    top: windowBottom - newHeight - containerOffset.top,
                    height: newHeight
                });
            }

            if (newWidth) {
                wnd.options.width = newWidth + "px";
            }
            if (newHeight) {
                wnd.options.height = newHeight + "px";
            }

            wnd.resize();
        },
        dragend: function (e) {
            var that = this,
                wnd = that.owner,
                wrapper = wnd.wrapper;

            wrapper
                .children(KWINDOWRESIZEHANDLES).not(e.currentTarget).show();

            $(BODY).css(CURSOR, "");

            if (wnd.touchScroller) {
               wnd.touchScroller.reset();
            }

            if (e.keyCode == 27) {
                wrapper.css(that.initialPosition)
                    .css(that.initialSize);
            }

            wnd.trigger(RESIZEEND);

            return false;
        },
        destroy: function() {
            if (this._draggable) {
                this._draggable.destroy();
            }

            this._draggable = this.owner = null;
        }
    };

    function WindowDragging(wnd, dragHandle) {
        var that = this;
        that.owner = wnd;
        that._draggable = new Draggable(wnd.wrapper, {
            filter: dragHandle,
            group: wnd.wrapper.id + "-moving",
            dragstart: proxy(that.dragstart, that),
            drag: proxy(that.drag, that),
            dragend: proxy(that.dragend, that),
            dragcancel: proxy(that.dragcancel, that)
        });

        that._draggable.userEvents.stopPropagation = false;
    }

    WindowDragging.prototype = {
        dragstart: function (e) {
            var wnd = this.owner,
                element = wnd.element,
                actions = element.find(".k-window-actions"),
                containerOffset = kendo.getOffset(wnd.appendTo);

            wnd.trigger(DRAGSTART);

            wnd.initialWindowPosition = kendo.getOffset(wnd.wrapper, "position");

            wnd.startPosition = {
                left: e.x.client - wnd.initialWindowPosition.left,
                top: e.y.client - wnd.initialWindowPosition.top
            };

            if (actions.length > 0) {
                wnd.minLeftPosition = actions.outerWidth() + parseInt(actions.css("right"), 10) - element.outerWidth();
            } else {
                wnd.minLeftPosition =  20 - element.outerWidth(); // at least 20px remain visible
            }

            wnd.minLeftPosition -= containerOffset.left;
            wnd.minTopPosition = -containerOffset.top;

            wnd.wrapper
                .append(templates.overlay)
                .children(KWINDOWRESIZEHANDLES).hide();

            $(BODY).css(CURSOR, e.currentTarget.css(CURSOR));
        },

        drag: function (e) {
            var wnd = this.owner,
                position = wnd.options.position,
                newTop = Math.max(e.y.client - wnd.startPosition.top, wnd.minTopPosition),
                newLeft = Math.max(e.x.client - wnd.startPosition.left, wnd.minLeftPosition),
                coordinates = {
                    left: newLeft,
                    top: newTop
                };

            $(wnd.wrapper).css(coordinates);
            position.top = newTop;
            position.left = newLeft;
        },

        _finishDrag: function() {
            var wnd = this.owner;

            wnd.wrapper
                .children(KWINDOWRESIZEHANDLES).toggle(!wnd.options.isMinimized).end()
                .find(KOVERLAY).remove();

            $(BODY).css(CURSOR, "");
        },

        dragcancel: function (e) {
            this._finishDrag();

            e.currentTarget.closest(KWINDOW).css(this.owner.initialWindowPosition);
        },

        dragend: function () {
            this._finishDrag();

            this.owner.trigger(DRAGEND);

            return false;
        },
        destroy: function() {
            if (this._draggable) {
                this._draggable.destroy();
            }

            this._draggable = this.owner = null;
        }
    };

    kendo.ui.plugin(Window);

})(window.kendo.jQuery);





(function ($, undefined) {
    var kendo = window.kendo,
        ui = kendo.ui,
        Widget = ui.Widget,
        HORIZONTAL = "horizontal",
        VERTICAL = "vertical",
        DEFAULTMIN = 0,
        DEFAULTMAX = 100,
        DEFAULTVALUE = 0,
        DEFAULTCHUNKCOUNT = 5,
        KPROGRESSBAR = "k-progressbar",
        KPROGRESSBARREVERSE = "k-progressbar-reverse",
        KPROGRESSBARINDETERMINATE = "k-progressbar-indeterminate",
        KPROGRESSBARCOMPLETE = "k-complete",
        KPROGRESSWRAPPER = "k-state-selected",
        KPROGRESSSTATUS = "k-progress-status",
        KCOMPLETEDCHUNK = "k-state-selected",
        KUPCOMINGCHUNK = "k-state-default",
        KSTATEDISABLED = "k-state-disabled",
        PROGRESSTYPE = {
            VALUE: "value",
            PERCENT: "percent",
            CHUNK: "chunk"
        },
        CHANGE = "change",
        COMPLETE = "complete",
        BOOLEAN = "boolean",
        math = Math,
        extend = $.extend,
        proxy = $.proxy,
        HUNDREDPERCENT = 100,
        DEFAULTANIMATIONDURATION = 400,
        PRECISION = 3,
        templates = {
            progressStatus: "<span class='k-progress-status-wrap'><span class='k-progress-status'></span></span>"
        };

    var ProgressBar = Widget.extend({
        init: function(element, options) {
            var that = this;

            Widget.fn.init.call(this, element, options);

            options = that.options;

            that._progressProperty = (options.orientation === HORIZONTAL) ? "width" : "height";

            that._fields();

            options.value = that._validateValue(options.value);

            that._validateType(options.type);

            that._wrapper();

            that._progressAnimation();

            if ((options.value !== options.min) && (options.value !== false)) {
               that._updateProgress();
            }
        },

        setOptions: function(options) {
            var that = this;
            
            Widget.fn.setOptions.call(that, options);

            if (options.hasOwnProperty("reverse")) {
                that.wrapper.toggleClass("k-progressbar-reverse", options.reverse);
            }

            if (options.hasOwnProperty("enable")) {
                that.enable(options.enable);
            }

            that._progressAnimation();

            that._validateValue();

            that._updateProgress();
        },

        events: [
            CHANGE,
            COMPLETE
        ],

        options: {
            name: "ProgressBar",
            orientation: HORIZONTAL,
            reverse: false,
            min: DEFAULTMIN,
            max: DEFAULTMAX,
            value: DEFAULTVALUE,
            enable: true,
            type: PROGRESSTYPE.VALUE,
            chunkCount: DEFAULTCHUNKCOUNT,
            showStatus: true,
            animation: { }
        },

        _fields: function() {
            var that = this;

            that._isStarted = false;

            that.progressWrapper = that.progressStatus = $();
        },

        _validateType: function(currentType) {
            var isValid = false;

            $.each(PROGRESSTYPE, function(k, type) {
                if (type === currentType) {
                    isValid = true;
                    return false;
                }
            });

            if (!isValid) {
                throw new Error(kendo.format("Invalid ProgressBar type '{0}'", currentType));
            }
        },

        _wrapper: function() {
            var that = this;
            var container = that.wrapper = that.element;
            var options = that.options;
            var orientation = options.orientation;
            var initialStatusValue;

            container.addClass("k-widget " + KPROGRESSBAR);

            container.addClass(KPROGRESSBAR + "-" + ((orientation === HORIZONTAL) ? HORIZONTAL : VERTICAL));

            if(options.enable === false) {
                container.addClass(KSTATEDISABLED);
            }

            if (options.reverse) {
                container.addClass(KPROGRESSBARREVERSE);
            }

            if (options.value === false) {
                container.addClass(KPROGRESSBARINDETERMINATE);
            }

            if (options.type === PROGRESSTYPE.CHUNK) {
                that._addChunkProgressWrapper();
            } else {
                if (options.showStatus){
                    that.progressStatus = that.wrapper.prepend(templates.progressStatus)
                                              .find("." + KPROGRESSSTATUS);

                    initialStatusValue = (options.value !== false) ? options.value : options.min;

                    if (options.type === PROGRESSTYPE.VALUE) {
                        that.progressStatus.text(initialStatusValue);
                    } else {
                        that.progressStatus.text(that._calculatePercentage(initialStatusValue) + "%");
                    }
                }
            }
        },

        value: function(value) {
            return this._value(value);
        },

        _value: function(value){
            var that = this;
            var options = that.options;
            var validated;

            if (value === undefined) {
                return options.value;
            } else {
                if (typeof value !== BOOLEAN) {
                    value = that._roundValue(value);

                    if(!isNaN(value)) {
                        validated = that._validateValue(value);

                        if (validated !== options.value) {
                            that.wrapper.removeClass(KPROGRESSBARINDETERMINATE);

                            options.value = validated;

                            that._isStarted = true;

                            that._updateProgress();
                        }
                    }
                } else if (!value) {
                    that.wrapper.addClass(KPROGRESSBARINDETERMINATE);
                    options.value = false;
                }
            }
        },

        _roundValue: function(value) {
            value = parseFloat(value);

            var power = math.pow(10, PRECISION);

            return math.floor(value * power) / power;
        },

        _validateValue: function(value) {
            var that = this;
            var options = that.options;

            if (value !== false) {
                if (value <= options.min || value === true) {
                    return options.min;
                } else if (value >= options.max) {
                    return options.max;
                }
            } else if (value === false) {
                return false;
            }

            if(isNaN(that._roundValue(value))) {
                return options.min;
            }

            return value;
        },

        _updateProgress: function() {
            var that = this;
            var options = that.options;
            var percentage = that._calculatePercentage();

            if (options.type === PROGRESSTYPE.CHUNK) {
                that._updateChunks(percentage);
                that._onProgressUpdateAlways(options.value);
            } else {
                that._updateProgressWrapper(percentage);
            }
        },

        _updateChunks: function(percentage) {
            var that = this;
            var options = that.options;
            var chunkCount = options.chunkCount;
            var percentagesPerChunk =  parseInt((HUNDREDPERCENT / chunkCount) * 100, 10) / 100;
            var percentageParsed = parseInt(percentage * 100, 10) / 100;
            var completedChunksCount = math.floor(percentageParsed / percentagesPerChunk);
            var completedChunks;

            if((options.orientation === HORIZONTAL && !(options.reverse)) ||
               (options.orientation === VERTICAL && options.reverse)) {
                completedChunks = that.wrapper.find("li.k-item:lt(" + completedChunksCount + ")");
            } else {
                completedChunks = that.wrapper.find("li.k-item:gt(-" + (completedChunksCount + 1) + ")");
            }

            that.wrapper.find("." + KCOMPLETEDCHUNK)
                        .removeClass(KCOMPLETEDCHUNK)
                        .addClass(KUPCOMINGCHUNK);

            completedChunks.removeClass(KUPCOMINGCHUNK)
                           .addClass(KCOMPLETEDCHUNK);
        },

        _updateProgressWrapper: function(percentage) {
            var that = this;
            var options = that.options;
            var progressWrapper = that.wrapper.find("." + KPROGRESSWRAPPER);
            var animationDuration = that._isStarted ? that._animation.duration : 0;
            var animationCssOptions = { };

            if (progressWrapper.length === 0) {
                that._addRegularProgressWrapper();
            }

            animationCssOptions[that._progressProperty] = percentage + "%";
            that.progressWrapper.animate(animationCssOptions, {
                duration: animationDuration,
                start: proxy(that._onProgressAnimateStart, that),
                progress: proxy(that._onProgressAnimate, that),
                complete: proxy(that._onProgressAnimateComplete, that, options.value),
                always: proxy(that._onProgressUpdateAlways, that, options.value)
            });
        },

        _onProgressAnimateStart: function() {
            this.progressWrapper.show();
        },

        _onProgressAnimate: function(e) {
            var that = this;
            var options = that.options;
            var progressInPercent = parseFloat(e.elem.style[that._progressProperty], 10);
            var progressStatusWrapSize;

            if (options.showStatus) {
                progressStatusWrapSize = 10000 / parseFloat(that.progressWrapper[0].style[that._progressProperty]);

                that.progressWrapper.find(".k-progress-status-wrap").css(that._progressProperty, progressStatusWrapSize + "%");
            }

            if (options.type !== PROGRESSTYPE.CHUNK && progressInPercent <= 98) {
                that.progressWrapper.removeClass(KPROGRESSBARCOMPLETE);
            }
        },

        _onProgressAnimateComplete: function(currentValue) {
            var that = this;
            var options = that.options;
            var progressWrapperSize = parseFloat(that.progressWrapper[0].style[that._progressProperty]);

            if (options.type !== PROGRESSTYPE.CHUNK && progressWrapperSize > 98) {
                that.progressWrapper.addClass(KPROGRESSBARCOMPLETE);
            }

            if (options.showStatus) {
                if (options.type === PROGRESSTYPE.VALUE) {
                    that.progressStatus.text(currentValue);
                } else {
                    that.progressStatus.text(math.floor(that._calculatePercentage(currentValue)) + "%");
                }
            }

            if (currentValue === options.min) {
                that.progressWrapper.hide();
            }
        },

        _onProgressUpdateAlways: function(currentValue) {
            var that = this;
            var options = that.options;

            if (that._isStarted) {
                that.trigger(CHANGE, { value: currentValue });
            }

            if (currentValue === options.max && that._isStarted) {
                that.trigger(COMPLETE, { value: options.max });
            }
        },

        enable: function(enable) {
            var that = this;
            var options = that.options;

            options.enable = typeof(enable) === "undefined" ? true : enable;
            that.wrapper.toggleClass(KSTATEDISABLED, !options.enable);
        },

        destroy: function() {
            var that = this;

            Widget.fn.destroy.call(that);
        },

        _addChunkProgressWrapper: function () {
            var that = this;
            var options = that.options;
            var container = that.wrapper;
            var chunkSize = HUNDREDPERCENT / options.chunkCount;
            var html = "";

            if (options.chunkCount <= 1) {
                options.chunkCount = DEFAULTCHUNKCOUNT;
            }

            html += "<ul class='k-reset'>";
            for (var i = options.chunkCount - 1; i >= 0; i--) {
                html += "<li class='k-item k-state-default'></li>";
            }
            html += "</ul>";

            container.append(html).find(".k-item").css(that._progressProperty, chunkSize + "%")
                     .first().addClass("k-first")
                     .end()
                     .last().addClass("k-last");

            that._normalizeChunkSize();
        },

        _normalizeChunkSize: function() {
            var that = this;
            var options = that.options;
            var lastChunk = that.wrapper.find(".k-item:last");
            var currentSize = parseFloat(lastChunk[0].style[that._progressProperty]);
            var difference = HUNDREDPERCENT - (options.chunkCount * currentSize);

            if (difference > 0) {
                lastChunk.css(that._progressProperty, (currentSize + difference) + "%");
            }
        },

        _addRegularProgressWrapper: function() {
            var that = this;

            that.progressWrapper = $("<div class='" + KPROGRESSWRAPPER + "'></div>").appendTo(that.wrapper);

            if (that.options.showStatus) {
                that.progressWrapper.append(templates.progressStatus);

                that.progressStatus = that.wrapper.find("." + KPROGRESSSTATUS);
            }
        },

        _calculateChunkSize: function() {
            var that = this;
            var chunkCount = that.options.chunkCount;
            var chunkContainer = that.wrapper.find("ul.k-reset");

            return (parseInt(chunkContainer.css(that._progressProperty), 10) - (chunkCount - 1)) / chunkCount;
        },

        _calculatePercentage: function(currentValue) {
            var that = this;
            var options = that.options;
            var value = (currentValue !== undefined) ? currentValue : options.value;
            var min = options.min;
            var max = options.max;
            that._onePercent = math.abs((max - min) / 100);

            return math.abs((value - min) / that._onePercent);
        },

        _progressAnimation: function() {
            var that = this;
            var options = that.options;
            var animation = options.animation;

            if (animation === false) {
                that._animation = { duration: 0 };
            } else {
                that._animation = extend({
                    duration: DEFAULTANIMATIONDURATION
                }, options.animation);
            }
        }
    });

    kendo.ui.plugin(ProgressBar);
})(window.kendo.jQuery);





(function ($, parseFloat, parseInt) {
    var Color = function(value) {
        var color = this,
            formats = Color.formats,
            re,
            processor,
            parts,
            i,
            channels;

        if (arguments.length === 1) {
            value = color.resolveColor(value);

            for (i = 0; i < formats.length; i++) {
                re = formats[i].re;
                processor = formats[i].process;
                parts = re.exec(value);

                if (parts) {
                    channels = processor(parts);
                    color.r = channels[0];
                    color.g = channels[1];
                    color.b = channels[2];
                }
            }
        } else {
            color.r = arguments[0];
            color.g = arguments[1];
            color.b = arguments[2];
        }

        color.r = color.normalizeByte(color.r);
        color.g = color.normalizeByte(color.g);
        color.b = color.normalizeByte(color.b);
    };

    Color.prototype = {
        toHex: function() {
            var color = this,
                pad = color.padDigit,
                r = color.r.toString(16),
                g = color.g.toString(16),
                b = color.b.toString(16);

            return "#" + pad(r) + pad(g) + pad(b);
        },

        resolveColor: function(value) {
            value = value || "black";

            if (value.charAt(0) == "#") {
                value = value.substr(1, 6);
            }

            value = value.replace(/ /g, "");
            value = value.toLowerCase();
            value = Color.namedColors[value] || value;

            return value;
        },

        normalizeByte: function(value) {
            return (value < 0 || isNaN(value)) ? 0 : ((value > 255) ? 255 : value);
        },

        padDigit: function(value) {
            return (value.length === 1) ? "0" + value : value;
        },

        brightness: function(value) {
            var color = this,
                round = Math.round;

            color.r = round(color.normalizeByte(color.r * value));
            color.g = round(color.normalizeByte(color.g * value));
            color.b = round(color.normalizeByte(color.b * value));

            return color;
        },

        percBrightness: function() {
            var color = this;

            return Math.sqrt(0.241 * color.r * color.r + 0.691 * color.g * color.g + 0.068 * color.b * color.b);
        }
    };

    Color.formats = [{
            re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
            process: function(parts) {
                return [
                    parseInt(parts[1], 10), parseInt(parts[2], 10), parseInt(parts[3], 10)
                ];
            }
        }, {
            re: /^(\w{2})(\w{2})(\w{2})$/,
            process: function(parts) {
                return [
                    parseInt(parts[1], 16), parseInt(parts[2], 16), parseInt(parts[3], 16)
                ];
            }
        }, {
            re: /^(\w{1})(\w{1})(\w{1})$/,
            process: function(parts) {
                return [
                    parseInt(parts[1] + parts[1], 16),
                    parseInt(parts[2] + parts[2], 16),
                    parseInt(parts[3] + parts[3], 16)
                ];
            }
        }
    ];

    Color.namedColors = {
        aqua: "00ffff", azure: "f0ffff", beige: "f5f5dc",
        black: "000000", blue: "0000ff", brown: "a52a2a",
        coral: "ff7f50", cyan: "00ffff", darkblue: "00008b",
        darkcyan: "008b8b", darkgray: "a9a9a9", darkgreen: "006400",
        darkorange: "ff8c00", darkred: "8b0000", dimgray: "696969",
        fuchsia: "ff00ff", gold: "ffd700", goldenrod: "daa520",
        gray: "808080", green: "008000", greenyellow: "adff2f",
        indigo: "4b0082", ivory: "fffff0", khaki: "f0e68c",
        lightblue: "add8e6", lightgrey: "d3d3d3", lightgreen: "90ee90",
        lightpink: "ffb6c1", lightyellow: "ffffe0", lime: "00ff00",
        limegreen: "32cd32", linen: "faf0e6", magenta: "ff00ff",
        maroon: "800000", mediumblue: "0000cd", navy: "000080",
        olive: "808000", orange: "ffa500", orangered: "ff4500",
        orchid: "da70d6", pink: "ffc0cb", plum: "dda0dd",
        purple: "800080", red: "ff0000", royalblue: "4169e1",
        salmon: "fa8072", silver: "c0c0c0", skyblue: "87ceeb",
        slateblue: "6a5acd", slategray: "708090", snow: "fffafa",
        steelblue: "4682b4", tan: "d2b48c", teal: "008080",
        tomato: "ff6347", turquoise: "40e0d0", violet: "ee82ee",
        wheat: "f5deb3", white: "ffffff", whitesmoke: "f5f5f5",
        yellow: "ffff00", yellowgreen: "9acd32"
    };

    // Tools from ColorPicker =================================================

    /*jshint eqnull:true  */

    function parseColor(color, nothrow) {
        if (color == null || color == "none") {
            return null;
        }
        if (color == "transparent") {
            return new _RGB(0, 0, 0, 0);
        }
        if (color instanceof _Color) {
            return color;
        }
        color = color.toLowerCase();
        if (Color.namedColors.hasOwnProperty(color)) {
            color = Color.namedColors[color];
        }
        var m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(color);
        if (m) {
            return new _Bytes(parseInt(m[1], 16),
                              parseInt(m[2], 16),
                              parseInt(m[3], 16), 1);
        }
        m = /^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(color);
        if (m) {
            return new _Bytes(parseInt(m[1] + m[1], 16),
                              parseInt(m[2] + m[2], 16),
                              parseInt(m[3] + m[3], 16), 1);
        }
        m = /^rgb\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*\)/.exec(color);
        if (m) {
            return new _Bytes(parseInt(m[1], 10),
                              parseInt(m[2], 10),
                              parseInt(m[3], 10), 1);
        }
        m = /^rgba\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9.]+)\s*\)/.exec(color);
        if (m) {
            return new _Bytes(parseInt(m[1], 10),
                              parseInt(m[2], 10),
                              parseInt(m[3], 10), parseFloat(m[4]));
        }
        m = /^rgb\(\s*([0-9]*\.?[0-9]+)%\s*,\s*([0-9]*\.?[0-9]+)%\s*,\s*([0-9]*\.?[0-9]+)%\s*\)/.exec(color);
        if (m) {
            return new _RGB(parseFloat(m[1]) / 100,
                            parseFloat(m[2]) / 100,
                            parseFloat(m[3]) / 100, 1);
        }
        m = /^rgba\(\s*([0-9]*\.?[0-9]+)%\s*,\s*([0-9]*\.?[0-9]+)%\s*,\s*([0-9]*\.?[0-9]+)%\s*,\s*([0-9.]+)\s*\)/.exec(color);
        if (m) {
            return new _RGB(parseFloat(m[1]) / 100,
                            parseFloat(m[2]) / 100,
                            parseFloat(m[3]) / 100, parseFloat(m[4]));
        }
        if (!nothrow) {
            throw new Error("Cannot parse color: " + color);
        }
        return undefined;
    }

    function hex(n, width, pad) {
        if (!pad) { pad = "0"; }
        n = n.toString(16);
        while (width > n.length) {
            n = "0" + n;
        }
        return n;
    }

    var _Color = kendo.Class.extend({
        toHSV: function() { return this; },
        toRGB: function() { return this; },
        toHex: function() { return this.toBytes().toHex(); },
        toBytes: function() { return this; },
        toCss: function() { return "#" + this.toHex(); },
        toCssRgba: function() {
            var rgb = this.toBytes();
            return "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + parseFloat((+this.a).toFixed(3)) + ")";
        },
        toDisplay: function() {
            if (kendo.support.browser.msie && kendo.support.browser.version < 9) {
                return this.toCss(); // no RGBA support; does it support any opacity in colors?
            }
            return this.toCssRgba();
        },
        equals: function(c) { return c === this || c !== null && this.toCssRgba() == parseColor(c).toCssRgba(); },
        diff: function(c2) {
            if (c2 == null) {
                return NaN;
            }
            var c1 = this.toBytes();
            c2 = c2.toBytes();
            return Math.sqrt(Math.pow((c1.r - c2.r) * 0.30, 2) +
                             Math.pow((c1.g - c2.g) * 0.59, 2) +
                             Math.pow((c1.b - c2.b) * 0.11, 2));
        },
        clone: function() {
            var c = this.toBytes();
            if (c === this) {
                c = new _Bytes(c.r, c.g, c.b, c.a);
            }
            return c;
        }
    });

    var _RGB = _Color.extend({
        init: function(r, g, b, a) {
            this.r = r; this.g = g; this.b = b; this.a = a;
        },
        toHSV: function() {
            var min, max, delta, h, s, v;
            var r = this.r, g = this.g, b = this.b;
            min = Math.min(r, g, b);
            max = Math.max(r, g, b);
            v = max;
            delta = max - min;
            if (delta === 0) {
                return new _HSV(0, 0, v, this.a);
            }
            if (max !== 0) {
                s = delta / max;
                if (r == max) {
                    h = (g - b) / delta;
                } else if (g == max) {
                    h = 2 + (b - r) / delta;
                } else {
                    h = 4 + (r - g) / delta;
                }
                h *= 60;
                if (h < 0) {
                    h += 360;
                }
            } else {
                s = 0;
                h = -1;
            }
            return new _HSV(h, s, v, this.a);
        },
        toBytes: function() {
            return new _Bytes(this.r * 255, this.g * 255, this.b * 255, this.a);
        }
    });

    var _Bytes = _RGB.extend({
        init: function(r, g, b, a) {
            this.r = Math.round(r); this.g = Math.round(g); this.b = Math.round(b); this.a = a;
        },
        toRGB: function() {
            return new _RGB(this.r / 255, this.g / 255, this.b / 255, this.a);
        },
        toHSV: function() {
            return this.toRGB().toHSV();
        },
        toHex: function() {
            return hex(this.r, 2) + hex(this.g, 2) + hex(this.b, 2);
        },
        toBytes: function() {
            return this;
        }
    });

    var _HSV = _Color.extend({
        init: function(h, s, v, a) {
            this.h = h; this.s = s; this.v = v; this.a = a;
        },
        toRGB: function() {
            var h = this.h, s = this.s, v = this.v;
            var i, r, g, b, f, p, q, t;
            if (s === 0) {
                r = g = b = v;
            } else {
                h /= 60;
                i = Math.floor(h);
                f = h - i;
                p = v * (1 - s);
                q = v * (1 - s * f);
                t = v * (1 - s * (1 - f));
                switch (i) {
                  case 0  : r = v; g = t; b = p; break;
                  case 1  : r = q; g = v; b = p; break;
                  case 2  : r = p; g = v; b = t; break;
                  case 3  : r = p; g = q; b = v; break;
                  case 4  : r = t; g = p; b = v; break;
                  default : r = v; g = p; b = q; break;
                }
            }
            return new _RGB(r, g, b, this.a);
        },
        toBytes: function() {
            return this.toRGB().toBytes();
        }
    });

    Color.fromBytes = function(r, g, b, a) {
        return new _Bytes(r, g, b, a != null ? a : 1);
    };

    Color.fromRGB = function(r, g, b, a) {
        return new _RGB(r, g, b, a != null ? a : 1);
    };

    Color.fromHSV = function(h, s, v, a) {
        return new _HSV(h, s, v, a != null ? a : 1);
    };

    // Exports ================================================================
    kendo.Color = Color;
    kendo.parseColor = parseColor;

})(window.kendo.jQuery, parseFloat, parseInt);



(function($, undefined) {
    var kendo = window.kendo,
        ui = kendo.ui,
        Widget = ui.Widget,
        support = kendo.support,
        getOffset = kendo.getOffset,
        activeElement = kendo._activeElement,
        OPEN = "open",
        CLOSE = "close",
        DEACTIVATE = "deactivate",
        ACTIVATE = "activate",
        CENTER = "center",
        LEFT = "left",
        RIGHT = "right",
        TOP = "top",
        BOTTOM = "bottom",
        ABSOLUTE = "absolute",
        HIDDEN = "hidden",
        BODY = "body",
        LOCATION = "location",
        POSITION = "position",
        VISIBLE = "visible",
        EFFECTS = "effects",
        ACTIVE = "k-state-active",
        ACTIVEBORDER = "k-state-border",
        ACTIVEBORDERREGEXP = /k-state-border-(\w+)/,
        ACTIVECHILDREN = ".k-picker-wrap, .k-dropdown-wrap, .k-link",
        MOUSEDOWN = "down",
        DOCUMENT_ELEMENT = $(document.documentElement),
        WINDOW = $(window),
        SCROLL = "scroll",
        RESIZE_SCROLL = "resize scroll",
        cssPrefix = support.transitions.css,
        TRANSFORM = cssPrefix + "transform",
        extend = $.extend,
        NS = ".kendoPopup",
        styles = ["font-size",
                  "font-family",
                  "font-stretch",
                  "font-style",
                  "font-weight",
                  "line-height"];

    function contains(container, target) {
        return container === target || $.contains(container, target);
    }

    var Popup = Widget.extend({
        init: function(element, options) {
            var that = this, parentPopup;

            options = options || {};

            if (options.isRtl) {
                options.origin = options.origin || BOTTOM + " " + RIGHT;
                options.position = options.position || TOP + " " + RIGHT;
            }

            Widget.fn.init.call(that, element, options);

            element = that.element;
            options = that.options;

            that.collisions = options.collision ? options.collision.split(" ") : [];
            that.downEvent = kendo.applyEventMap(MOUSEDOWN, kendo.guid());

            if (that.collisions.length === 1) {
                that.collisions.push(that.collisions[0]);
            }

            parentPopup = $(that.options.anchor).closest(".k-popup,.k-group").filter(":not([class^=km-])"); // When popup is in another popup, make it relative.
            options.appendTo = $($(options.appendTo)[0] || parentPopup[0] || BODY);

            that.element.hide()
                .addClass("k-popup k-group k-reset")
                .toggleClass("k-rtl", !!options.isRtl)
                .css({ position : ABSOLUTE })
                .appendTo(options.appendTo)
                .on("mouseenter" + NS, function() {
                    that._hovered = true;
                })
                .on("mouseleave" + NS, function() {
                    that._hovered = false;
                });

            that.wrapper = $();

            if (options.animation === false) {
                options.animation = { open: { effects: {} }, close: { hide: true, effects: {} } };
            }

            extend(options.animation.open, {
                complete: function() {
                    that.wrapper.css({ overflow: VISIBLE }); // Forcing refresh causes flickering in mobile.
                    that._trigger(ACTIVATE);
                }
            });

            extend(options.animation.close, {
                complete: function() {
                    that._animationClose();
                }
            });

            that._mousedownProxy = function(e) {
                that._mousedown(e);
            };

            that._resizeProxy = function(e) {
                that._resize(e);
            };

            if (options.toggleTarget) {
                $(options.toggleTarget).on(options.toggleEvent + NS, $.proxy(that.toggle, that));
            }
        },

        events: [
            OPEN,
            ACTIVATE,
            CLOSE,
            DEACTIVATE
        ],

        options: {
            name: "Popup",
            toggleEvent: "click",
            origin: BOTTOM + " " + LEFT,
            position: TOP + " " + LEFT,
            anchor: BODY,
            appendTo: null,
            collision: "flip fit",
            viewport: window,
            copyAnchorStyles: true,
            autosize: false,
            modal: false,
            animation: {
                open: {
                    effects: "slideIn:down",
                    transition: true,
                    duration: 200
                },
                close: { // if close animation effects are defined, they will be used instead of open.reverse
                    duration: 100,
                    hide: true
                }
            }
        },

        _animationClose: function() {
            var that = this,
                options = that.options;

            that.wrapper.hide();

            var location = that.wrapper.data(LOCATION),
                anchor = $(options.anchor),
                direction, dirClass;

            if (location) {
                that.wrapper.css(location);
            }

            if (options.anchor != BODY) {
                direction = (anchor[0].className.match(ACTIVEBORDERREGEXP) || ["", "down"])[1];
                dirClass = ACTIVEBORDER + "-" + direction;

                anchor
                    .removeClass(dirClass)
                    .children(ACTIVECHILDREN)
                    .removeClass(ACTIVE)
                    .removeClass(dirClass);

                that.element.removeClass(ACTIVEBORDER + "-" + kendo.directions[direction].reverse);
            }

            that._closing = false;
            that._trigger(DEACTIVATE);
        },

        destroy: function() {
            var that = this,
                options = that.options,
                element = that.element.off(NS),
                parent;

            Widget.fn.destroy.call(that);

            if (options.toggleTarget) {
                $(options.toggleTarget).off(NS);
            }

            if (!options.modal) {
                DOCUMENT_ELEMENT.unbind(that.downEvent, that._mousedownProxy);
                that._scrollableParents().unbind(SCROLL, that._resizeProxy);
                WINDOW.unbind(RESIZE_SCROLL, that._resizeProxy);
            }

            kendo.destroy(that.element.children());
            element.removeData();

            if (options.appendTo[0] === document.body) {
                parent = element.parent(".k-animation-container");

                if (parent[0]) {
                    parent.remove();
                } else {
                    element.remove();
                }
            }
        },

        open: function(x, y) {
            var that = this,
                fixed = { isFixed: !isNaN(parseInt(y,10)), x: x, y: y },
                element = that.element,
                options = that.options,
                direction = "down",
                animation, wrapper,
                anchor = $(options.anchor),
                mobile = element[0] && element.hasClass("km-widget");

            if (!that.visible()) {
                if (options.copyAnchorStyles) {
                    if (mobile && styles[0] == "font-size") {
                        styles.shift();
                    }
                    element.css(kendo.getComputedStyles(anchor[0], styles));
                }

                if (element.data("animating") || that._trigger(OPEN)) {
                    return;
                }

                if (!options.modal) {
                    DOCUMENT_ELEMENT.unbind(that.downEvent, that._mousedownProxy)
                                .bind(that.downEvent, that._mousedownProxy);

                    // this binding hangs iOS in editor
                    if (!(support.mobileOS.ios || support.mobileOS.android)) {
                        // all elements in IE7/8 fire resize event, causing mayhem
                        that._scrollableParents()
                            .unbind(SCROLL, that._resizeProxy)
                            .bind(SCROLL, that._resizeProxy);
                        WINDOW.unbind(RESIZE_SCROLL, that._resizeProxy)
                              .bind(RESIZE_SCROLL, that._resizeProxy);
                    }
                }

                that.wrapper = wrapper = kendo.wrap(element, options.autosize)
                                        .css({
                                            overflow: HIDDEN,
                                            display: "block",
                                            position: ABSOLUTE
                                        });

                if (support.mobileOS.android) {
                    wrapper.css(TRANSFORM, "translatez(0)"); // Android is VERY slow otherwise. Should be tested in other droids as well since it may cause blur.
                }

                wrapper.css(POSITION);

                if ($(options.appendTo)[0] == document.body) {
                    wrapper.css(TOP, "-10000px");
                }

                animation = extend(true, {}, options.animation.open);
                that.flipped = that._position(fixed);
                animation.effects = kendo.parseEffects(animation.effects, that.flipped);

                direction = animation.effects.slideIn ? animation.effects.slideIn.direction : direction;

                if (options.anchor != BODY) {
                    var dirClass = ACTIVEBORDER + "-" + direction;

                    element.addClass(ACTIVEBORDER + "-" + kendo.directions[direction].reverse);

                    anchor
                        .addClass(dirClass)
                        .children(ACTIVECHILDREN)
                        .addClass(ACTIVE)
                        .addClass(dirClass);
                }

                element.data(EFFECTS, animation.effects)
                       .kendoStop(true)
                       .kendoAnimate(animation);
            }
        },

        toggle: function() {
            var that = this;

            that[that.visible() ? CLOSE : OPEN]();
        },

        visible: function() {
            return this.element.is(":" + VISIBLE);
        },

        close: function(skipEffects) {
            var that = this,
                options = that.options, wrap,
                animation, openEffects, closeEffects;

            if (that.visible()) {
                wrap = (that.wrapper[0] ? that.wrapper : kendo.wrap(that.element).hide());

                if (that._closing || that._trigger(CLOSE)) {
                    return;
                }

                // Close all inclusive popups.
                that.element.find(".k-popup").each(function () {
                    var that = $(this),
                        popup = that.data("kendoPopup");

                    if (popup) {
                        popup.close(skipEffects);
                    }
                });

                DOCUMENT_ELEMENT.unbind(that.downEvent, that._mousedownProxy);
                that._scrollableParents().unbind(SCROLL, that._resizeProxy);
                WINDOW.unbind(RESIZE_SCROLL, that._resizeProxy);

                if (skipEffects) {
                    animation = { hide: true, effects: {} };
                } else {
                    animation = extend(true, {}, options.animation.close);
                    openEffects = that.element.data(EFFECTS);
                    closeEffects = animation.effects;

                    if (!closeEffects && !kendo.size(closeEffects) && openEffects && kendo.size(openEffects)) {
                        animation.effects = openEffects;
                        animation.reverse = true;
                    }

                    that._closing = true;
                }

                that.element.kendoStop(true);
                wrap.css({ overflow: HIDDEN }); // stop callback will remove hidden overflow
                that.element.kendoAnimate(animation);
            }
        },

        _trigger: function(ev) {
            return this.trigger(ev, { type: ev });
        },

        _resize: function(e) {
            var that = this;

            if (e.type === "resize") {
                clearTimeout(that._resizeTimeout);
                that._resizeTimeout = setTimeout(function() {
                    that._position();
                    that._resizeTimeout = null;
                }, 50);
            } else {
                if (!that._hovered && !contains(that.element[0], activeElement())) {
                    that.close();
                }
            }
        },

        _mousedown: function(e) {
            var that = this,
                container = that.element[0],
                options = that.options,
                anchor = $(options.anchor)[0],
                toggleTarget = options.toggleTarget,
                target = kendo.eventTarget(e),
                popup = $(target).closest(".k-popup"),
                mobile = popup.parent().parent(".km-shim").length;

            popup = popup[0];
            if (!mobile && popup && popup !== that.element[0]){
                return;
            }

            // This MAY result in popup not closing in certain cases.
            if ($(e.target).closest("a").data("rel") === "popover") {
                return;
            }

            if (!contains(container, target) && !contains(anchor, target) && !(toggleTarget && contains($(toggleTarget)[0], target))) {
                that.close();
            }
        },

        _fit: function(position, size, viewPortSize) {
            var output = 0;

            if (position + size > viewPortSize) {
                output = viewPortSize - (position + size);
            }

            if (position < 0) {
                output = -position;
            }

            return output;
        },

        _flip: function(offset, size, anchorSize, viewPortSize, origin, position, boxSize) {
            var output = 0;
                boxSize = boxSize || size;

            if (position !== origin && position !== CENTER && origin !== CENTER) {
                if (offset + boxSize > viewPortSize) {
                    output += -(anchorSize + size);
                }

                if (offset + output < 0) {
                    output += anchorSize + size;
                }
            }
            return output;
        },

        _scrollableParents: function() {
            return $(this.options.anchor)
                       .parentsUntil("body")
                       .filter(function(index, element) {
                            var computedStyle = kendo.getComputedStyles(element, ["overflow"]);
                            return computedStyle.overflow != "visible";
                       });
        },

        _position: function(fixed) {
            var that = this,
                element = that.element.css(POSITION, ""),
                wrapper = that.wrapper,
                options = that.options,
                viewport = $(options.viewport),
                viewportOffset = viewport.offset(),
                anchor = $(options.anchor),
                origins = options.origin.toLowerCase().split(" "),
                positions = options.position.toLowerCase().split(" "),
                collisions = that.collisions,
                zoomLevel = support.zoomLevel(),
                siblingContainer, parents,
                parentZIndex, zIndex = 10002,
                isWindow = !!((viewport[0] == window) && window.innerWidth && (zoomLevel <= 1.02)),
                idx = 0, length, viewportWidth, viewportHeight;

            // $(window).height() uses documentElement to get the height
            viewportWidth = isWindow ? window.innerWidth : viewport.width();
            viewportHeight = isWindow ? window.innerHeight : viewport.height();

            siblingContainer = anchor.parents().filter(wrapper.siblings());

            if (siblingContainer[0]) {
                parentZIndex = Math.max(Number(siblingContainer.css("zIndex")), 0);

                // set z-index to be more than that of the container/sibling
                // compensate with more units for window z-stack
                if (parentZIndex) {
                    zIndex = parentZIndex + 10;
                } else {
                    parents = anchor.parentsUntil(siblingContainer);
                    for (length = parents.length; idx < length; idx++) {
                        parentZIndex = Number($(parents[idx]).css("zIndex"));
                        if (parentZIndex && zIndex < parentZIndex) {
                            zIndex = parentZIndex + 10;
                        }
                    }
                }
            }

            wrapper.css("zIndex", zIndex);

            if (fixed && fixed.isFixed) {
                wrapper.css({ left: fixed.x, top: fixed.y });
            } else {
                wrapper.css(that._align(origins, positions));
            }

            var pos = getOffset(wrapper, POSITION, anchor[0] === wrapper.offsetParent()[0]),
                offset = getOffset(wrapper),
                anchorParent = anchor.offsetParent().parent(".k-animation-container,.k-popup,.k-group"); // If the parent is positioned, get the current positions

            if (anchorParent.length) {
                pos = getOffset(wrapper, POSITION, true);
                offset = getOffset(wrapper);
            }

            if (viewport[0] === window) {
                offset.top -= (window.pageYOffset || document.documentElement.scrollTop || 0);
                offset.left -= (window.pageXOffset || document.documentElement.scrollLeft || 0);
            }
            else {
                offset.top -= viewportOffset.top;
                offset.left -= viewportOffset.left;
            }

            if (!that.wrapper.data(LOCATION)) { // Needed to reset the popup location after every closure - fixes the resize bugs.
                wrapper.data(LOCATION, extend({}, pos));
            }

            var offsets = extend({}, offset),
                location = extend({}, pos);

            if (collisions[0] === "fit") {
                location.top += that._fit(offsets.top, wrapper.outerHeight(), viewportHeight / zoomLevel);
            }

            if (collisions[1] === "fit") {
                location.left += that._fit(offsets.left, wrapper.outerWidth(), viewportWidth / zoomLevel);
            }

            var flipPos = extend({}, location);

            if (collisions[0] === "flip") {
                location.top += that._flip(offsets.top, element.outerHeight(), anchor.outerHeight(), viewportHeight / zoomLevel, origins[0], positions[0], wrapper.outerHeight());
            }

            if (collisions[1] === "flip") {
                location.left += that._flip(offsets.left, element.outerWidth(), anchor.outerWidth(), viewportWidth / zoomLevel, origins[1], positions[1], wrapper.outerWidth());
            }

            element.css(POSITION, ABSOLUTE);
            wrapper.css(location);

            return (location.left != flipPos.left || location.top != flipPos.top);
        },

        _align: function(origin, position) {
            var that = this,
                element = that.wrapper,
                anchor = $(that.options.anchor),
                verticalOrigin = origin[0],
                horizontalOrigin = origin[1],
                verticalPosition = position[0],
                horizontalPosition = position[1],
                anchorOffset = getOffset(anchor),
                appendTo = $(that.options.appendTo),
                appendToOffset,
                width = element.outerWidth(),
                height = element.outerHeight(),
                anchorWidth = anchor.outerWidth(),
                anchorHeight = anchor.outerHeight(),
                top = anchorOffset.top,
                left = anchorOffset.left,
                round = Math.round;

            if (appendTo[0] != document.body) {
                appendToOffset = getOffset(appendTo);
                top -= appendToOffset.top;
                left -= appendToOffset.left;
            }


            if (verticalOrigin === BOTTOM) {
                top += anchorHeight;
            }

            if (verticalOrigin === CENTER) {
                top += round(anchorHeight / 2);
            }

            if (verticalPosition === BOTTOM) {
                top -= height;
            }

            if (verticalPosition === CENTER) {
                top -= round(height / 2);
            }

            if (horizontalOrigin === RIGHT) {
                left += anchorWidth;
            }

            if (horizontalOrigin === CENTER) {
                left += round(anchorWidth / 2);
            }

            if (horizontalPosition === RIGHT) {
                left -= width;
            }

            if (horizontalPosition === CENTER) {
                left -= round(width / 2);
            }

            return {
                top: top,
                left: left
            };
        }
    });

    ui.plugin(Popup);
})(window.kendo.jQuery);





(function($, undefined) {
    var kendo = window.kendo,
        Widget = kendo.ui.Widget,
        Draggable = kendo.ui.Draggable,
        extend = $.extend,
        format = kendo.format,
        parse = kendo.parseFloat,
        proxy = $.proxy,
        isArray = $.isArray,
        math = Math,
        support = kendo.support,
        pointers = support.pointers,
        msPointers = support.msPointers,
        CHANGE = "change",
        SLIDE = "slide",
        NS = ".slider",
        MOUSE_DOWN = "touchstart" + NS + " mousedown" + NS,
        TRACK_MOUSE_DOWN = pointers ? "pointerdown" + NS : (msPointers ? "MSPointerDown" + NS : MOUSE_DOWN),
        MOUSE_UP = "touchend" + NS + " mouseup" + NS,
        TRACK_MOUSE_UP = pointers ? "pointerup" : (msPointers ? "MSPointerUp" + NS : MOUSE_UP),
        MOVE_SELECTION = "moveSelection",
        KEY_DOWN = "keydown" + NS,
        CLICK = "click" + NS,
        MOUSE_OVER = "mouseover" + NS,
        FOCUS = "focus" + NS,
        BLUR = "blur" + NS,
        DRAG_HANDLE = ".k-draghandle",
        TRACK_SELECTOR = ".k-slider-track",
        TICK_SELECTOR = ".k-tick",
        STATE_SELECTED = "k-state-selected",
        STATE_FOCUSED = "k-state-focused",
        STATE_DEFAULT = "k-state-default",
        STATE_DISABLED = "k-state-disabled",
        PRECISION = 3,
        DISABLED = "disabled",
        UNDEFINED = "undefined",
        TABINDEX = "tabindex",
        getTouches = kendo.getTouches;

    var SliderBase = Widget.extend({
        init: function(element, options) {
            var that = this;

            Widget.fn.init.call(that, element, options);

            options = that.options;

            that._distance = round(options.max - options.min);
            that._isHorizontal = options.orientation == "horizontal";
            that._isRtl = that._isHorizontal && kendo.support.isRtl(element);
            that._position = that._isHorizontal ? "left" : "bottom";
            that._sizeFn = that._isHorizontal ? "width" : "height";
            that._outerSize = that._isHorizontal ? "outerWidth" : "outerHeight";

            options.tooltip.format = options.tooltip.enabled ? options.tooltip.format || "{0}" : "{0}";

            that._createHtml();
            that.wrapper = that.element.closest(".k-slider");
            that._trackDiv = that.wrapper.find(TRACK_SELECTOR);

            that._setTrackDivWidth();

            that._maxSelection = that._trackDiv[that._sizeFn]();

            that._sliderItemsInit();

            that._tabindex(that.wrapper.find(DRAG_HANDLE));
            that[options.enabled ? "enable" : "disable"]();

            var rtlDirectionSign = kendo.support.isRtl(that.wrapper) ? -1 : 1;

            that._keyMap = {
                37: step(-1 * rtlDirectionSign * options.smallStep), // left arrow
                40: step(-options.smallStep), // down arrow
                39: step(+1 * rtlDirectionSign * options.smallStep), // right arrow
                38: step(+options.smallStep), // up arrow
                35: setValue(options.max), // end
                36: setValue(options.min), // home
                33: step(+options.largeStep), // page up
                34: step(-options.largeStep)  // page down
            };

            kendo.notify(that);
        },

        events: [
            CHANGE,
            SLIDE
        ],

        options: {
            enabled: true,
            min: 0,
            max: 10,
            smallStep: 1,
            largeStep: 5,
            orientation: "horizontal",
            tickPlacement: "both",
            tooltip: { enabled: true, format: "{0}" }
        },

        _resize: function() {
            this._setTrackDivWidth();
            this.wrapper.find(".k-slider-items").remove();

            this._maxSelection = this._trackDiv[this._sizeFn]();
            this._sliderItemsInit();
            this._refresh();
        },

        _sliderItemsInit: function() {
            var that = this,
                options = that.options;

            var sizeBetweenTicks = that._maxSelection / ((options.max - options.min) / options.smallStep);
            var pixelWidths = that._calculateItemsWidth(math.floor(that._distance / options.smallStep));

            if (options.tickPlacement != "none" && sizeBetweenTicks >= 2) {
                that._trackDiv.before(createSliderItems(options, that._distance));
                that._setItemsWidth(pixelWidths);
                that._setItemsTitle();
            }

            that._calculateSteps(pixelWidths);

            if (options.tickPlacement != "none" && sizeBetweenTicks >= 2 &&
                options.largeStep >= options.smallStep) {
                that._setItemsLargeTick();
            }
        },

        getSize: function() {
            return kendo.dimensions(this.wrapper);
        },

        _setTrackDivWidth: function() {
            var that = this,
                trackDivPosition = parseFloat(that._trackDiv.css(that._isRtl ? "right" : that._position), 10) * 2;

            that._trackDiv[that._sizeFn]((that.wrapper[that._sizeFn]() - 2) - trackDivPosition);
        },

        _setItemsWidth: function(pixelWidths) {
            var that = this,
                options = that.options,
                first = 0,
                last = pixelWidths.length - 1,
                items = that.wrapper.find(TICK_SELECTOR),
                i,
                paddingTop = 0,
                bordersWidth = 2,
                count = items.length,
                selection = 0;

            for (i = 0; i < count - 2; i++) {
                $(items[i + 1])[that._sizeFn](pixelWidths[i]);
            }

            if (that._isHorizontal) {
                $(items[first]).addClass("k-first")[that._sizeFn](pixelWidths[last - 1]);
                $(items[last]).addClass("k-last")[that._sizeFn](pixelWidths[last]);
            } else {
                $(items[last]).addClass("k-first")[that._sizeFn](pixelWidths[last]);
                $(items[first]).addClass("k-last")[that._sizeFn](pixelWidths[last - 1]);
            }

            if (that._distance % options.smallStep !== 0 && !that._isHorizontal) {
                for (i = 0; i < pixelWidths.length; i++) {
                    selection += pixelWidths[i];
                }

                paddingTop = that._maxSelection - selection;
                paddingTop += parseFloat(that._trackDiv.css(that._position), 10) + bordersWidth;

                that.wrapper.find(".k-slider-items").css("padding-top", paddingTop);
            }
        },

        _setItemsTitle: function() {
            var that = this,
                options = that.options,
                items = that.wrapper.find(TICK_SELECTOR),
                titleNumber = options.min,
                count = items.length,
                i = that._isHorizontal && !that._isRtl ? 0 : count - 1,
                limit = that._isHorizontal && !that._isRtl ? count : -1,
                increment = that._isHorizontal && !that._isRtl ? 1 : -1;

            for (; i - limit !== 0 ; i += increment) {
                $(items[i]).attr("title", format(options.tooltip.format, round(titleNumber)));
                titleNumber += options.smallStep;
            }
        },

        _setItemsLargeTick: function() {
            var that = this,
                options = that.options,
                items = that.wrapper.find(TICK_SELECTOR),
                i = 0, item, value;

            if (removeFraction(options.largeStep) % removeFraction(options.smallStep) === 0 || that._distance / options.largeStep >= 3) {
                if (!that._isHorizontal && !that._isRtl) {
                    items = $.makeArray(items).reverse();
                }

                for (i = 0; i < items.length; i++) {
                    item = $(items[i]);
                    value = that._values[i];
                    var valueWithoutFraction = removeFraction(value - this.options.min);
                    if (valueWithoutFraction % removeFraction(options.smallStep) === 0 && valueWithoutFraction % removeFraction(options.largeStep) === 0) {
                        item.addClass("k-tick-large")
                            .html("<span class='k-label'>" + item.attr("title") + "</span>");

                        if (i !== 0 && i !== items.length - 1) {
                            item.css("line-height", item[that._sizeFn]() + "px");
                        }
                    }
                }
            }
        },

        _calculateItemsWidth: function(itemsCount) {
            var that = this,
                options = that.options,
                trackDivSize = parseFloat(that._trackDiv.css(that._sizeFn)) + 1,
                pixelStep = trackDivSize / that._distance,
                itemWidth,
                pixelWidths,
                i;

            if ((that._distance / options.smallStep) - math.floor(that._distance / options.smallStep) > 0) {
                trackDivSize -= ((that._distance % options.smallStep) * pixelStep);
            }

            itemWidth = trackDivSize / itemsCount;
            pixelWidths = [];

            for (i = 0; i < itemsCount - 1; i++) {
                pixelWidths[i] = itemWidth;
            }

            pixelWidths[itemsCount - 1] = pixelWidths[itemsCount] = itemWidth / 2;
            return that._roundWidths(pixelWidths);
        },

        _roundWidths: function(pixelWidthsArray) {
            var balance = 0,
                count = pixelWidthsArray.length,
                i;

            for (i = 0; i < count; i++) {
                balance += (pixelWidthsArray[i] - math.floor(pixelWidthsArray[i]));
                pixelWidthsArray[i] = math.floor(pixelWidthsArray[i]);
            }

            balance = math.round(balance);

            return this._addAdditionalSize(balance, pixelWidthsArray);
        },

        _addAdditionalSize: function(additionalSize, pixelWidthsArray) {
            if (additionalSize === 0) {
                return pixelWidthsArray;
            }

            //set step size
            var step = parseFloat(pixelWidthsArray.length - 1) / parseFloat(additionalSize == 1 ? additionalSize : additionalSize - 1),
                i;

            for (i = 0; i < additionalSize; i++) {
                pixelWidthsArray[parseInt(math.round(step * i), 10)] += 1;
            }

            return pixelWidthsArray;
        },

        _calculateSteps: function(pixelWidths) {
            var that = this,
                options = that.options,
                val = options.min,
                selection = 0,
                itemsCount = math.ceil(that._distance / options.smallStep),
                i = 1,
                lastItem;

            itemsCount += (that._distance / options.smallStep) % 1 === 0 ? 1 : 0;
            pixelWidths.splice(0, 0, pixelWidths[itemsCount - 2] * 2);
            pixelWidths.splice(itemsCount -1, 1, pixelWidths.pop() * 2);

            that._pixelSteps = [selection];
            that._values = [val];

            if (itemsCount === 0) {
                return;
            }

            while (i < itemsCount) {
                selection += (pixelWidths[i - 1] + pixelWidths[i]) / 2;
                that._pixelSteps[i] = selection;
                val += options.smallStep;
                that._values[i] = round(val);

                i++;
            }

            lastItem = that._distance % options.smallStep === 0 ? itemsCount - 1 : itemsCount;

            that._pixelSteps[lastItem] = that._maxSelection;
            that._values[lastItem] = options.max;

            if (that._isRtl) {
                that._pixelSteps.reverse();
                that._values.reverse();
            }
        },

        _getValueFromPosition: function(mousePosition, dragableArea) {
            var that = this,
                options = that.options,
                step = math.max(options.smallStep * (that._maxSelection / that._distance), 0),
                position = 0,
                halfStep = (step / 2),
                i;

            if (that._isHorizontal) {
                position = mousePosition - dragableArea.startPoint;
                if (that._isRtl) {
                    position = that._maxSelection - position;
                }
            } else {
                position = dragableArea.startPoint - mousePosition;
            }

            if (that._maxSelection - ((parseInt(that._maxSelection % step, 10) - 3) / 2) < position) {
                return options.max;
            }

            for (i = 0; i < that._pixelSteps.length; i++) {
                if (math.abs(that._pixelSteps[i] - position) - 1 <= halfStep) {
                    return round(that._values[i]);
                }
            }
        },

        _getFormattedValue: function(val, drag) {
            var that = this,
                html = "",
                tooltip = that.options.tooltip,
                tooltipTemplate,
                selectionStart,
                selectionEnd;

            if (isArray(val)) {
                selectionStart = val[0];
                selectionEnd = val[1];
            } else if (drag && drag.type) {
                selectionStart = drag.selectionStart;
                selectionEnd = drag.selectionEnd;
            }

            if (drag) {
                tooltipTemplate = drag.tooltipTemplate;
            }

            if (!tooltipTemplate && tooltip.template) {
                tooltipTemplate = kendo.template(tooltip.template);
            }

            if (isArray(val) || (drag && drag.type)) {

                if (tooltipTemplate) {
                    html = tooltipTemplate({
                        selectionStart: selectionStart,
                        selectionEnd: selectionEnd
                    });
                } else {
                    selectionStart = format(tooltip.format, selectionStart);
                    selectionEnd = format(tooltip.format, selectionEnd);
                    html = selectionStart + " - " + selectionEnd;
                }
            } else {
                if (drag) {
                    drag.val = val;
                }

                if (tooltipTemplate) {
                    html = tooltipTemplate({
                        value: val
                    });
                } else {
                    html = format(tooltip.format, val);
                }
            }
            return html;
        },

        _getDraggableArea: function() {
            var that = this,
                offset = kendo.getOffset(that._trackDiv);

            return {
                startPoint: that._isHorizontal ? offset.left : offset.top + that._maxSelection,
                endPoint: that._isHorizontal ? offset.left + that._maxSelection : offset.top
            };
        },

        _createHtml: function() {
            var that = this,
                element = that.element,
                options = that.options,
                inputs = element.find("input");

            if (inputs.length == 2) {
                inputs.eq(0).prop("value", formatValue(options.selectionStart));
                inputs.eq(1).prop("value", formatValue(options.selectionEnd));
            } else {
                element.prop("value", formatValue(options.value));
            }

            element.wrap(createWrapper(options, element, that._isHorizontal)).hide();

            if (options.showButtons) {
                element.before(createButton(options, "increase", that._isHorizontal))
                       .before(createButton(options, "decrease", that._isHorizontal));
            }

            element.before(createTrack(options, element));
        },

        _focus: function(e) {
            var that = this,
                target = e.target,
                val = that.value(),
                drag = that._drag;

            if (!drag) {
                if (target == that.wrapper.find(DRAG_HANDLE).eq(0)[0]) {
                    drag = that._firstHandleDrag;
                    that._activeHandle = 0;
                } else {
                    drag = that._lastHandleDrag;
                    that._activeHandle = 1;
                }
                val = val[that._activeHandle];
            }

            $(target).addClass(STATE_FOCUSED + " " + STATE_SELECTED);

            if (drag) {
                that._activeHandleDrag = drag;

                drag.selectionStart = that.options.selectionStart;
                drag.selectionEnd = that.options.selectionEnd;

                drag._updateTooltip(val);
            }
        },

        _focusWithMouse: function(target) {
            target = $(target);

            var that = this,
                idx = target.is(DRAG_HANDLE) ? target.index() : 0;

            window.setTimeout(function(){
                that.wrapper.find(DRAG_HANDLE)[idx == 2 ? 1 : 0].focus();
            }, 1);

            that._setTooltipTimeout();
        },

        _blur: function(e) {
            var that = this,
                drag = that._activeHandleDrag;

            $(e.target).removeClass(STATE_FOCUSED + " " + STATE_SELECTED);

            if (drag) {
                drag._removeTooltip();
                delete that._activeHandleDrag;
                delete that._activeHandle;
            }
        },

        _setTooltipTimeout: function() {
            var that = this;
            that._tooltipTimeout = window.setTimeout(function(){
                var drag = that._drag || that._activeHandleDrag;
                if (drag) {
                    drag._removeTooltip();
                }
            }, 300);
        },

        _clearTooltipTimeout: function() {
            var that = this;
            window.clearTimeout(this._tooltipTimeout);
            var drag = that._drag || that._activeHandleDrag;
            if (drag && drag.tooltipDiv) {
                drag.tooltipDiv.stop(true, false).css("opacity", 1);
            }
        }
    });

    function createWrapper (options, element, isHorizontal) {
        var orientationCssClass = isHorizontal ? " k-slider-horizontal" : " k-slider-vertical",
            style = options.style ? options.style : element.attr("style"),
            cssClasses = element.attr("class") ? (" " + element.attr("class")) : "",
            tickPlacementCssClass = "";

        if (options.tickPlacement == "bottomRight") {
            tickPlacementCssClass = " k-slider-bottomright";
        } else if (options.tickPlacement == "topLeft") {
            tickPlacementCssClass = " k-slider-topleft";
        }

        style = style ? " style='" + style + "'" : "";

        return "<div class='k-widget k-slider" + orientationCssClass + cssClasses + "'" + style + ">" +
               "<div class='k-slider-wrap" + (options.showButtons ? " k-slider-buttons" : "") + tickPlacementCssClass +
               "'></div></div>";
    }

    function createButton (options, type, isHorizontal) {
        var buttonCssClass = "";

        if (type == "increase") {
            buttonCssClass = isHorizontal ? "k-i-arrow-e" : "k-i-arrow-n";
        } else {
            buttonCssClass = isHorizontal ? "k-i-arrow-w" : "k-i-arrow-s";
        }

        return "<a class='k-button k-button-" + type + "'><span class='k-icon " + buttonCssClass +
               "' title='" + options[type + "ButtonTitle"] + "'>" + options[type + "ButtonTitle"] + "</span></a>";
    }

    function createSliderItems (options, distance) {
        var result = "<ul class='k-reset k-slider-items'>",
            count = math.floor(round(distance / options.smallStep)) + 1,
            i;

        for(i = 0; i < count; i++) {
            result += "<li class='k-tick' role='presentation'>&nbsp;</li>";
        }

        result += "</ul>";

        return result;
    }

    function createTrack (options, element) {
        var dragHandleCount = element.is("input") ? 1 : 2,
            firstDragHandleTitle = dragHandleCount == 2 ? options.leftDragHandleTitle : options.dragHandleTitle;

        return "<div class='k-slider-track'><div class='k-slider-selection'><!-- --></div>" +
               "<a href='#' class='k-draghandle' title='" + firstDragHandleTitle + "' role='slider' aria-valuemin='" + options.min + "' aria-valuemax='" + options.max + "' aria-valuenow='" + (dragHandleCount > 1 ? (options.selectionStart || options.min) : options.value || options.min) + "'>Drag</a>" +
               (dragHandleCount > 1 ? "<a href='#' class='k-draghandle' title='" + options.rightDragHandleTitle + "'role='slider' aria-valuemin='" + options.min + "' aria-valuemax='" + options.max + "' aria-valuenow='" + (options.selectionEnd || options.max) + "'>Drag</a>" : "") +
               "</div>";
    }

    function step(stepValue) {
        return function (value) {
            return value + stepValue;
        };
    }

    function setValue(value) {
        return function () {
            return value;
        };
    }

    function formatValue(value) {
        return (value + "").replace(".", kendo.cultures.current.numberFormat["."]);
    }

    function round(value) {
        value = parseFloat(value, 10);
        var power = math.pow(10, PRECISION || 0);
        return math.round(value * power) / power;
    }

    function parseAttr(element, name) {
        var value = parse(element.getAttribute(name));
        if (value === null) {
            value = undefined;
        }
        return value;
    }

    function defined(value) {
        return typeof value !== UNDEFINED;
    }

    function removeFraction(value) {
        return value * 10000;
    }

    var Slider = SliderBase.extend({
        init: function(element, options) {
            var that = this,
                dragHandle;

            element.type = "text";
            options = extend({}, {
                value: parseAttr(element, "value"),
                min: parseAttr(element, "min"),
                max: parseAttr(element, "max"),
                smallStep: parseAttr(element, "step")
            }, options);

            element = $(element);

            if (options && options.enabled === undefined) {
                options.enabled = !element.is("[disabled]");
            }

            SliderBase.fn.init.call(that, element, options);
            options = that.options;
            if (!defined(options.value) || options.value === null) {
                options.value = options.min;
                element.prop("value", formatValue(options.min));
            }
            options.value = math.max(math.min(options.value, options.max), options.min);

            dragHandle = that.wrapper.find(DRAG_HANDLE);

            new Slider.Selection(dragHandle, that, options);
            that._drag = new Slider.Drag(dragHandle, "", that, options);
        },

        options: {
            name: "Slider",
            showButtons: true,
            increaseButtonTitle: "Increase",
            decreaseButtonTitle: "Decrease",
            dragHandleTitle: "drag",
            tooltip: { format: "{0:#,#.##}" },
            value: null
        },

        enable: function (enable) {
            var that = this,
                options = that.options,
                clickHandler,
                move;

            that.disable();
            if (enable === false) {
                return;
            }

            that.wrapper
                .removeClass(STATE_DISABLED)
                .addClass(STATE_DEFAULT);

            that.wrapper.find("input").removeAttr(DISABLED);

            clickHandler = function (e) {
                var touch = getTouches(e)[0];

                if (!touch) {
                    return;
                }

                var mousePosition = that._isHorizontal ? touch.location.pageX : touch.location.pageY,
                    dragableArea = that._getDraggableArea(),
                    target = $(e.target);

                if (target.hasClass("k-draghandle")) {
                    target.addClass(STATE_FOCUSED + " " + STATE_SELECTED);
                    return;
                }

                that._update(that._getValueFromPosition(mousePosition, dragableArea));

                that._focusWithMouse(e.target);

                that._drag.dragstart(e);
                e.preventDefault();
            };

            that.wrapper
                .find(TICK_SELECTOR + ", " + TRACK_SELECTOR)
                    .on(TRACK_MOUSE_DOWN, clickHandler)
                    .end()
                    .on(TRACK_MOUSE_DOWN, function() {
                        $(document.documentElement).one("selectstart", kendo.preventDefault);
                    })
                    .on(TRACK_MOUSE_UP, function() {
                        that._drag._end();
                    });

            that.wrapper
                .find(DRAG_HANDLE)
                .attr(TABINDEX, 0)
                .on(MOUSE_UP, function () {
                    that._setTooltipTimeout();
                })
                .on(CLICK, function (e) {
                    that._focusWithMouse(e.target);
                    e.preventDefault();
                })
                .on(FOCUS, proxy(that._focus, that))
                .on(BLUR, proxy(that._blur, that));

            move = proxy(function (sign) {
                var newVal = that._nextValueByIndex(that._valueIndex + (sign * 1));
                that._setValueInRange(newVal);
                that._drag._updateTooltip(newVal);
            }, that);

            if (options.showButtons) {
                var mouseDownHandler = proxy(function(e, sign) {
                    this._clearTooltipTimeout();
                    if (e.which === 1 || (support.touch && e.which === 0)) {
                        move(sign);

                        this.timeout = setTimeout(proxy(function () {
                            this.timer = setInterval(function () {
                                move(sign);
                            }, 60);
                        }, this), 200);
                    }
                }, that);

                that.wrapper.find(".k-button")
                    .on(MOUSE_UP, proxy(function (e) {
                        this._clearTimer();
                        that._focusWithMouse(e.target);
                    }, that))
                    .on(MOUSE_OVER, function (e) {
                        $(e.currentTarget).addClass("k-state-hover");
                    })
                    .on("mouseout" + NS, proxy(function (e) {
                        $(e.currentTarget).removeClass("k-state-hover");
                        this._clearTimer();
                    }, that))
                    .eq(0)
                    .on(MOUSE_DOWN, proxy(function (e) {
                        mouseDownHandler(e, 1);
                    }, that))
                    .click(false)
                    .end()
                    .eq(1)
                    .on(MOUSE_DOWN, proxy(function (e) {
                        mouseDownHandler(e, -1);
                    }, that))
                    .click(kendo.preventDefault);
            }

            that.wrapper
                .find(DRAG_HANDLE)
                .off(KEY_DOWN, false)
                .on(KEY_DOWN, proxy(this._keydown, that));

            options.enabled = true;
        },

        disable: function () {
            var that = this;

            that.wrapper
                .removeClass(STATE_DEFAULT)
                .addClass(STATE_DISABLED);

            $(that.element).prop(DISABLED, DISABLED);

            that.wrapper
                .find(".k-button")
                .off(MOUSE_DOWN)
                .on(MOUSE_DOWN, kendo.preventDefault)
                .off(MOUSE_UP)
                .on(MOUSE_UP, kendo.preventDefault)
                .off("mouseleave" + NS)
                .on("mouseleave" + NS, kendo.preventDefault)
                .off(MOUSE_OVER)
                .on(MOUSE_OVER, kendo.preventDefault);

            that.wrapper
                .find(TICK_SELECTOR + ", " + TRACK_SELECTOR).off(TRACK_MOUSE_DOWN).off(TRACK_MOUSE_UP);

            that.wrapper
                .find(DRAG_HANDLE)
                .attr(TABINDEX, -1)
                .off(MOUSE_UP)
                .off(KEY_DOWN)
                .off(CLICK)
                .off(FOCUS)
                .off(BLUR);

            that.options.enabled = false;
        },

        _update: function (val) {
            var that = this,
                change = that.value() != val;

            that.value(val);

            if (change) {
                that.trigger(CHANGE, { value: that.options.value });
            }
        },

        value: function (value) {
            var that = this,
                options = that.options;

            value = round(value);
            if (isNaN(value)) {
                return options.value;
            }

            if (value >= options.min && value <= options.max) {
                if (options.value != value) {
                    that.element.prop("value", formatValue(value));
                    options.value = value;
                    that._refreshAriaAttr(value);
                    that._refresh();
                }
            }
        },

        _refresh: function () {
            this.trigger(MOVE_SELECTION, { value: this.options.value });
        },

        _refreshAriaAttr: function(value) {
            var that = this,
                drag = that._drag,
                formattedValue;

            if (drag && drag._tooltipDiv) {
                formattedValue = drag._tooltipDiv.text();
            } else {
                formattedValue = that._getFormattedValue(value, null);
            }
            this.wrapper.find(DRAG_HANDLE).attr("aria-valuenow", value).attr("aria-valuetext", formattedValue);
        },

        _clearTimer: function () {
            clearTimeout(this.timeout);
            clearInterval(this.timer);
        },

        _keydown: function (e) {
            var that = this;

            if (e.keyCode in that._keyMap) {
                that._clearTooltipTimeout();
                that._setValueInRange(that._keyMap[e.keyCode](that.options.value));
                that._drag._updateTooltip(that.value());
                e.preventDefault();
            }
        },

        _setValueInRange: function (val) {
            var that = this,
                options = that.options;

            val = round(val);
            if (isNaN(val)) {
                that._update(options.min);
                return;
            }

            val = math.max(math.min(val, options.max), options.min);
            that._update(val);
        },

        _nextValueByIndex: function (index) {
            var count = this._values.length;
            if (this._isRtl) {
                index = count - 1 - index;
            }
            return this._values[math.max(0, math.min(index, count - 1))];
        },

        destroy: function() {
            var that = this;

            Widget.fn.destroy.call(that);

            that.wrapper.off(NS)
                .find(".k-button").off(NS)
                .end()
                .find(DRAG_HANDLE).off(NS)
                .end()
                .find(TICK_SELECTOR + ", " + TRACK_SELECTOR).off(NS)
                .end();

            that._drag.draggable.destroy();
            that._drag._removeTooltip(true);
        }
    });

    Slider.Selection = function (dragHandle, that, options) {
        function moveSelection (val) {
            var selectionValue = val - options.min,
                index = that._valueIndex = math.ceil(round(selectionValue / options.smallStep)),
                selection = parseInt(that._pixelSteps[index], 10),
                selectionDiv = that._trackDiv.find(".k-slider-selection"),
                halfDragHanndle = parseInt(dragHandle[that._outerSize]() / 2, 10),
                rtlCorrection = that._isRtl ? 2 : 0;

            selectionDiv[that._sizeFn](that._isRtl ? that._maxSelection - selection : selection);
            dragHandle.css(that._position, selection - halfDragHanndle - rtlCorrection);
        }

        moveSelection(options.value);

        that.bind([CHANGE, SLIDE, MOVE_SELECTION], function (e) {
            moveSelection(parseFloat(e.value, 10));
        });
    };

    Slider.Drag = function (element, type, owner, options) {
        var that = this;
        that.owner = owner;
        that.options = options;
        that.element = element;
        that.type = type;

        that.draggable = new Draggable(element, {
            distance: 0,
            dragstart: proxy(that._dragstart, that),
            drag: proxy(that.drag, that),
            dragend: proxy(that.dragend, that),
            dragcancel: proxy(that.dragcancel, that)
        });

        element.click(false);
    };

    Slider.Drag.prototype = {
        dragstart: function(e) {
            // add reference to the last active drag handle.
            this.owner._activeDragHandle = this;
            // HACK to initiate click on the line
            this.draggable.userEvents.cancel();
            this.draggable.userEvents._start(e);
        },

        _dragstart: function(e) {
            var that = this,
                owner = that.owner,
                options = that.options;

            if (!options.enabled) {
                e.preventDefault();
                return;
            }

            // add reference to the last active drag handle.
            this.owner._activeDragHandle = this;

            owner.element.off(MOUSE_OVER);
            owner.wrapper.find("." + STATE_FOCUSED).removeClass(STATE_FOCUSED + " " + STATE_SELECTED);
            that.element.addClass(STATE_FOCUSED + " " + STATE_SELECTED);
            $(document.documentElement).css("cursor", "pointer");

            that.dragableArea = owner._getDraggableArea();
            that.step = math.max(options.smallStep * (owner._maxSelection / owner._distance), 0);

            if (that.type) {
                that.selectionStart = options.selectionStart;
                that.selectionEnd = options.selectionEnd;
                owner._setZIndex(that.type);
            } else {
                that.oldVal = that.val = options.value;
            }

            that._removeTooltip(true);
            that._createTooltip();
        },

        _createTooltip: function() {
            var that = this,
                owner = that.owner,
                tooltip = that.options.tooltip,
                html = '',
                wnd = $(window),
                tooltipTemplate, colloutCssClass;

            if (!tooltip.enabled) {
                return;
            }

            if (tooltip.template) {
                tooltipTemplate = that.tooltipTemplate = kendo.template(tooltip.template);
            }

            $(".k-slider-tooltip").remove(); // if user changes window while tooltip is visible, a second one will be created
            that.tooltipDiv = $("<div class='k-widget k-tooltip k-slider-tooltip'><!-- --></div>").appendTo(document.body);

            html = owner._getFormattedValue(that.val || owner.value(), that);

            if (!that.type) {
                colloutCssClass = "k-callout-" + (owner._isHorizontal ? 's' : 'e');
                that.tooltipInnerDiv = "<div class='k-callout " + colloutCssClass + "'><!-- --></div>";
                html += that.tooltipInnerDiv;
            }

            that.tooltipDiv.html(html);

            that._scrollOffset = {
                top: wnd.scrollTop(),
                left: wnd.scrollLeft()
            };

            that.moveTooltip();
        },

        drag: function (e) {
            var that = this,
                owner = that.owner,
                x = e.x.location,
                y = e.y.location,
                startPoint = that.dragableArea.startPoint,
                endPoint = that.dragableArea.endPoint,
                slideParams;

            e.preventDefault();

            if (owner._isHorizontal) {
                if (owner._isRtl) {
                    that.val = that.constrainValue(x, startPoint, endPoint, x < endPoint);
                } else {
                    that.val = that.constrainValue(x, startPoint, endPoint, x >= endPoint);
                }
            } else {
                that.val = that.constrainValue(y, endPoint, startPoint, y <= endPoint);
            }

            if (that.oldVal != that.val) {
                that.oldVal = that.val;

                if (that.type) {
                    if (that.type == "firstHandle") {
                        if (that.val < that.selectionEnd) {
                            that.selectionStart = that.val;
                        } else {
                            that.selectionStart = that.selectionEnd = that.val;
                        }
                    } else {
                        if (that.val > that.selectionStart) {
                            that.selectionEnd = that.val;
                        } else {
                            that.selectionStart = that.selectionEnd = that.val;
                        }
                    }
                    slideParams = {
                        values: [that.selectionStart, that.selectionEnd],
                        value: [that.selectionStart, that.selectionEnd]
                    };
                } else {
                    slideParams = { value: that.val };
                }

                owner.trigger(SLIDE, slideParams);
            }

            that._updateTooltip(that.val);
        },

        _updateTooltip: function(val) {
            var that = this,
                options = that.options,
                tooltip = options.tooltip,
                html = "";

            if (!tooltip.enabled) {
                return;
            }

            if (!that.tooltipDiv) {
                that._createTooltip();
            }

            html = that.owner._getFormattedValue(round(val), that);

            if (!that.type) {
                html += that.tooltipInnerDiv;
            }

            that.tooltipDiv.html(html);
            that.moveTooltip();
        },

        dragcancel: function() {
            this.owner._refresh();
            $(document.documentElement).css("cursor", "");
            return this._end();
        },

        dragend: function() {
            var that = this,
                owner = that.owner;

            $(document.documentElement).css("cursor", "");

            if (that.type) {
                owner._update(that.selectionStart, that.selectionEnd);
            } else {
                owner._update(that.val);
                that.draggable.userEvents._disposeAll();
            }

            return that._end();
        },

        _end: function() {
            var that = this,
                owner = that.owner;

            owner._focusWithMouse(that.element);

            owner.element.on(MOUSE_OVER);

            return false;
        },

        _removeTooltip: function(noAnimation) {
            var that = this,
                owner = that.owner;

            if (that.tooltipDiv && owner.options.tooltip.enabled && owner.options.enabled) {
                if (noAnimation) {
                    that.tooltipDiv.remove();
                    that.tooltipDiv = null;
                } else {
                    that.tooltipDiv.fadeOut("slow", function(){
                        $(this).remove();
                        that.tooltipDiv = null;
                    });
                }
            }
        },

        moveTooltip: function () {
            var that = this,
                owner = that.owner,
                top = 0,
                left = 0,
                element = that.element,
                offset = kendo.getOffset(element),
                margin = 8,
                viewport = $(window),
                callout = that.tooltipDiv.find(".k-callout"),
                width = that.tooltipDiv.outerWidth(),
                height = that.tooltipDiv.outerHeight(),
                dragHandles, sdhOffset, diff, anchorSize;

            if (that.type) {
                dragHandles = owner.wrapper.find(DRAG_HANDLE);
                offset = kendo.getOffset(dragHandles.eq(0));
                sdhOffset = kendo.getOffset(dragHandles.eq(1));

                if (owner._isHorizontal) {
                    top = sdhOffset.top;
                    left = offset.left + ((sdhOffset.left - offset.left) / 2);
                } else {
                    top = offset.top + ((sdhOffset.top - offset.top) / 2);
                    left = sdhOffset.left;
                }

                anchorSize = dragHandles.eq(0).outerWidth() + 2 * margin;
            } else {
                top = offset.top;
                left = offset.left;
                anchorSize = element.outerWidth() + 2 * margin;
            }

            if (owner._isHorizontal) {
                left -= parseInt((width - element[owner._outerSize]()) / 2, 10);
                top -= height + callout.height() + margin;
            } else {
                top -= parseInt((height - element[owner._outerSize]()) / 2, 10);
                left -= width + callout.width() + margin;
            }

            if (owner._isHorizontal) {
                diff = that._flip(top, height, anchorSize, viewport.outerHeight() + that._scrollOffset.top);
                top += diff;
                left += that._fit(left, width, viewport.outerWidth() + that._scrollOffset.left);
            } else {
                diff = that._flip(left, width, anchorSize, viewport.outerWidth() + that._scrollOffset.left);
                top += that._fit(top, height, viewport.outerHeight() + that._scrollOffset.top);
                left += diff;
            }

            if (diff > 0 && callout) {
                callout.removeClass();
                callout.addClass("k-callout k-callout-" + (owner._isHorizontal ? "n" : "w"));
            }

            that.tooltipDiv.css({ top: top, left: left });
        },

        _fit: function(position, size, viewPortEnd) {
            var output = 0;

            if (position + size > viewPortEnd) {
                output = viewPortEnd - (position + size);
            }

            if (position < 0) {
                output = -position;
            }

            return output;
        },

        _flip: function(offset, size, anchorSize, viewPortEnd) {
            var output = 0;

            if (offset + size > viewPortEnd) {
                output += -(anchorSize + size);
            }

            if (offset + output < 0) {
                output += anchorSize + size;
            }

            return output;
        },

        constrainValue: function (position, min, max, maxOverflow) {
            var that = this,
                val = 0;

            if (min < position && position < max) {
                val = that.owner._getValueFromPosition(position, that.dragableArea);
            } else {
                if (maxOverflow ) {
                    val = that.options.max;
                } else {
                    val = that.options.min;
                }
            }

            return val;
        }

    };

    kendo.ui.plugin(Slider);

    var RangeSlider = SliderBase.extend({
        init: function(element, options) {
            var that = this,
                inputs = $(element).find("input"),
                firstInput = inputs.eq(0)[0],
                secondInput = inputs.eq(1)[0];

            firstInput.type = "text";
            secondInput.type = "text";

            options = extend({}, {
                selectionStart: parseAttr(firstInput, "value"),
                min: parseAttr(firstInput, "min"),
                max: parseAttr(firstInput, "max"),
                smallStep: parseAttr(firstInput, "step")
            }, {
                selectionEnd: parseAttr(secondInput, "value"),
                min: parseAttr(secondInput, "min"),
                max: parseAttr(secondInput, "max"),
                smallStep: parseAttr(secondInput, "step")
            }, options);

            if (options && options.enabled === undefined) {
                options.enabled = !inputs.is("[disabled]");
            }

            SliderBase.fn.init.call(that, element, options);
            options = that.options;
            if (!defined(options.selectionStart) || options.selectionStart === null) {
                options.selectionStart = options.min;
                inputs.eq(0).prop("value", formatValue(options.min));
            }

            if (!defined(options.selectionEnd) || options.selectionEnd === null) {
                options.selectionEnd = options.max;
                inputs.eq(1).prop("value", formatValue(options.max));
            }

            var dragHandles = that.wrapper.find(DRAG_HANDLE);

            new RangeSlider.Selection(dragHandles, that, options);
            that._firstHandleDrag = new Slider.Drag(dragHandles.eq(0), "firstHandle", that, options);
            that._lastHandleDrag = new Slider.Drag(dragHandles.eq(1), "lastHandle" , that, options);
        },

        options: {
            name: "RangeSlider",
            leftDragHandleTitle: "drag",
            rightDragHandleTitle: "drag",
            tooltip: { format: "{0:#,#.##}" },
            selectionStart: null,
            selectionEnd: null
        },

        enable: function (enable) {
            var that = this,
                options = that.options,
                clickHandler;

            that.disable();
            if (enable === false) {
                return;
            }

            that.wrapper
                .removeClass(STATE_DISABLED)
                .addClass(STATE_DEFAULT);

            that.wrapper.find("input").removeAttr(DISABLED);

            clickHandler = function (e) {
                var touch = getTouches(e)[0];

                if (!touch) {
                    return;
                }

                var mousePosition = that._isHorizontal ? touch.location.pageX : touch.location.pageY,
                    dragableArea = that._getDraggableArea(),
                    val = that._getValueFromPosition(mousePosition, dragableArea),
                    target = $(e.target),
                    from, to, drag;

                if (target.hasClass("k-draghandle")) {
                    that.wrapper.find("." + STATE_FOCUSED).removeClass(STATE_FOCUSED + " " + STATE_SELECTED);
                    target.addClass(STATE_FOCUSED + " " + STATE_SELECTED);
                    return;
                }

                if (val < options.selectionStart) {
                    from = val;
                    to = options.selectionEnd;
                    drag = that._firstHandleDrag;
                } else if (val > that.selectionEnd) {
                    from = options.selectionStart;
                    to = val;
                    drag = that._lastHandleDrag;
                } else {
                    if (val - options.selectionStart <= options.selectionEnd - val) {
                        from = val;
                        to = options.selectionEnd;
                        drag = that._firstHandleDrag;
                    } else {
                        from = options.selectionStart;
                        to = val;
                        drag = that._lastHandleDrag;
                    }
                }

                drag.dragstart(e);
                that._setValueInRange(from, to);
                that._focusWithMouse(drag.element);
            };

            that.wrapper
                .find(TICK_SELECTOR + ", " + TRACK_SELECTOR)
                    .on(TRACK_MOUSE_DOWN, clickHandler)
                    .end()
                    .on(TRACK_MOUSE_DOWN, function() {
                        $(document.documentElement).one("selectstart", kendo.preventDefault);
                    })
                    .on(TRACK_MOUSE_UP, function() {
                        if (that._activeDragHandle) {
                            that._activeDragHandle._end();
                        }
                    });

            that.wrapper
                .find(DRAG_HANDLE)
                .attr(TABINDEX, 0)
                .on(MOUSE_UP, function () {
                    that._setTooltipTimeout();
                })
                .on(CLICK, function (e) {
                    that._focusWithMouse(e.target);
                    e.preventDefault();
                })
                .on(FOCUS, proxy(that._focus, that))
                .on(BLUR, proxy(that._blur, that));

            that.wrapper.find(DRAG_HANDLE)
                .off(KEY_DOWN, kendo.preventDefault)
                .eq(0).on(KEY_DOWN,
                    proxy(function(e) {
                        this._keydown(e, "firstHandle");
                    }, that)
                )
                .end()
                .eq(1).on(KEY_DOWN,
                    proxy(function(e) {
                        this._keydown(e, "lastHandle");
                    }, that)
                );

            that.options.enabled = true;
        },

        disable: function () {
            var that = this;

            that.wrapper
                .removeClass(STATE_DEFAULT)
                .addClass(STATE_DISABLED);

            that.wrapper.find("input").prop(DISABLED, DISABLED);

            that.wrapper
                .find(TICK_SELECTOR + ", " + TRACK_SELECTOR).off(TRACK_MOUSE_DOWN).off(TRACK_MOUSE_UP);

            that.wrapper
                .find(DRAG_HANDLE)
                .attr(TABINDEX, -1)
                .off(MOUSE_UP)
                .off(KEY_DOWN)
                .off(CLICK)
                .off(FOCUS)
                .off(BLUR);

            that.options.enabled = false;
        },

        _keydown: function (e, handle) {
            var that = this,
                selectionStartValue = that.options.selectionStart,
                selectionEndValue = that.options.selectionEnd,
                dragSelectionStart,
                dragSelectionEnd,
                activeHandleDrag;

            if (e.keyCode in that._keyMap) {

                that._clearTooltipTimeout();

                if (handle == "firstHandle") {
                    activeHandleDrag = that._activeHandleDrag = that._firstHandleDrag;
                    selectionStartValue = that._keyMap[e.keyCode](selectionStartValue);

                    if (selectionStartValue > selectionEndValue) {
                        selectionEndValue = selectionStartValue;
                    }
                } else {
                    activeHandleDrag = that._activeHandleDrag = that._lastHandleDrag;
                    selectionEndValue = that._keyMap[e.keyCode](selectionEndValue);

                    if (selectionStartValue > selectionEndValue) {
                        selectionStartValue = selectionEndValue;
                    }
                }

                that._setValueInRange(selectionStartValue, selectionEndValue);

                dragSelectionStart = Math.max(selectionStartValue, that.options.selectionStart);
                dragSelectionEnd = Math.min(selectionEndValue, that.options.selectionEnd);

                activeHandleDrag.selectionEnd = Math.max(dragSelectionEnd, that.options.selectionStart);
                activeHandleDrag.selectionStart = Math.min(dragSelectionStart, that.options.selectionEnd);

                activeHandleDrag._updateTooltip(that.value()[that._activeHandle]);

                e.preventDefault();
            }
        },

        _update: function (selectionStart, selectionEnd) {
            var that = this,
                values = that.value();

            var change = values[0] != selectionStart || values[1] != selectionEnd;

            that.value([selectionStart, selectionEnd]);

            if (change) {
                that.trigger(CHANGE, {
                    values: [selectionStart, selectionEnd],
                    value: [selectionStart, selectionEnd]
                });
            }
        },

        value: function(value) {
            if (value && value.length) {
                return this._value(value[0], value[1]);
            } else {
                return this._value();
            }
        },

        _value: function(start, end) {
            var that = this,
                options = that.options,
                selectionStart = options.selectionStart,
                selectionEnd = options.selectionEnd;

            if (isNaN(start) && isNaN(end)) {
                return [selectionStart, selectionEnd];
            } else {
                start = round(start);
                end = round(end);
            }

            if (start >= options.min && start <= options.max &&
                end >= options.min && end <= options.max && start <= end) {
                if (selectionStart != start || selectionEnd != end) {
                    that.element.find("input")
                        .eq(0).prop("value", formatValue(start))
                        .end()
                        .eq(1).prop("value", formatValue(end));

                    options.selectionStart = start;
                    options.selectionEnd = end;
                    that._refresh();
                    that._refreshAriaAttr(start, end);
                }
            }
        },

        values: function (start, end) {
            if (isArray(start)) {
                return this._value(start[0], start[1]);
            } else {
                return this._value(start, end);
            }
        },

        _refresh: function() {
            var that = this,
                options = that.options;

            that.trigger(MOVE_SELECTION, {
                values: [options.selectionStart, options.selectionEnd],
                value: [options.selectionStart, options.selectionEnd]
            });

            if (options.selectionStart == options.max && options.selectionEnd == options.max) {
                that._setZIndex("firstHandle");
            }
        },

        _refreshAriaAttr: function(start, end) {
            var that = this,
                dragHandles = that.wrapper.find(DRAG_HANDLE),
                drag = that._activeHandleDrag,
                formattedValue;

            formattedValue = that._getFormattedValue([start, end], drag);

            dragHandles.eq(0).attr("aria-valuenow", start);
            dragHandles.eq(1).attr("aria-valuenow", end);
            dragHandles.attr("aria-valuetext", formattedValue);
        },

        _setValueInRange: function (selectionStart, selectionEnd) {
            var options = this.options;

            selectionStart = math.max(math.min(selectionStart, options.max), options.min);

            selectionEnd = math.max(math.min(selectionEnd, options.max), options.min);

            if (selectionStart == options.max && selectionEnd == options.max) {
                this._setZIndex("firstHandle");
            }

            this._update(math.min(selectionStart, selectionEnd), math.max(selectionStart, selectionEnd));
        },

        _setZIndex: function (type) {
            this.wrapper.find(DRAG_HANDLE).each(function (index) {
                $(this).css("z-index", type == "firstHandle" ? 1 - index : index);
            });
        },

        destroy: function() {
            var that = this;

            Widget.fn.destroy.call(that);

            that.wrapper.off(NS)
                .find(TICK_SELECTOR + ", " + TRACK_SELECTOR).off(NS)
                .end()
                .find(DRAG_HANDLE).off(NS);

            that._firstHandleDrag.draggable.destroy();
            that._lastHandleDrag.draggable.destroy();
        }
    });

    RangeSlider.Selection = function (dragHandles, that, options) {
        function moveSelection(value) {
            value = value || [];
            var selectionStartValue = value[0] - options.min,
                selectionEndValue = value[1] - options.min,
                selectionStartIndex = math.ceil(round(selectionStartValue / options.smallStep)),
                selectionEndIndex = math.ceil(round(selectionEndValue / options.smallStep)),
                selectionStart = that._pixelSteps[selectionStartIndex],
                selectionEnd = that._pixelSteps[selectionEndIndex],
                halfHandle = parseInt(dragHandles.eq(0)[that._outerSize]() / 2, 10),
                rtlCorrection = that._isRtl ? 2 : 0;

            dragHandles.eq(0).css(that._position, selectionStart - halfHandle - rtlCorrection)
                       .end()
                       .eq(1).css(that._position, selectionEnd - halfHandle - rtlCorrection);

            makeSelection(selectionStart, selectionEnd);
        }

        function makeSelection(selectionStart, selectionEnd) {
            var selection,
                selectionPosition,
                selectionDiv = that._trackDiv.find(".k-slider-selection");

            selection = math.abs(selectionStart - selectionEnd);

            selectionDiv[that._sizeFn](selection);
            if (that._isRtl) {
                selectionPosition = math.max(selectionStart, selectionEnd);
                selectionDiv.css("right", that._maxSelection - selectionPosition - 1);
            } else {
                selectionPosition = math.min(selectionStart, selectionEnd);
                selectionDiv.css(that._position, selectionPosition - 1);
            }
        }

        moveSelection(that.value());

        that.bind([ CHANGE, SLIDE, MOVE_SELECTION ], function (e) {
            moveSelection(e.values);
        });
    };

    kendo.ui.plugin(RangeSlider);

})(window.kendo.jQuery);





(function($, parseInt, undefined){
    // WARNING: removing the following jshint declaration and turning
    // == into === to make JSHint happy will break functionality.
    /*jshint eqnull:true  */
    var kendo = window.kendo,
        ui = kendo.ui,
        Widget = ui.Widget,
        parseColor = kendo.parseColor,
        Color = kendo.Color,
        KEYS = kendo.keys,
        BACKGROUNDCOLOR = "background-color",
        ITEMSELECTEDCLASS = "k-state-selected",
        SIMPLEPALETTE = "000000,7f7f7f,880015,ed1c24,ff7f27,fff200,22b14c,00a2e8,3f48cc,a349a4,ffffff,c3c3c3,b97a57,ffaec9,ffc90e,efe4b0,b5e61d,99d9ea,7092be,c8bfe7",
        WEBPALETTE = "FFFFFF,FFCCFF,FF99FF,FF66FF,FF33FF,FF00FF,CCFFFF,CCCCFF,CC99FF,CC66FF,CC33FF,CC00FF,99FFFF,99CCFF,9999FF,9966FF,9933FF,9900FF,FFFFCC,FFCCCC,FF99CC,FF66CC,FF33CC,FF00CC,CCFFCC,CCCCCC,CC99CC,CC66CC,CC33CC,CC00CC,99FFCC,99CCCC,9999CC,9966CC,9933CC,9900CC,FFFF99,FFCC99,FF9999,FF6699,FF3399,FF0099,CCFF99,CCCC99,CC9999,CC6699,CC3399,CC0099,99FF99,99CC99,999999,996699,993399,990099,FFFF66,FFCC66,FF9966,FF6666,FF3366,FF0066,CCFF66,CCCC66,CC9966,CC6666,CC3366,CC0066,99FF66,99CC66,999966,996666,993366,990066,FFFF33,FFCC33,FF9933,FF6633,FF3333,FF0033,CCFF33,CCCC33,CC9933,CC6633,CC3333,CC0033,99FF33,99CC33,999933,996633,993333,990033,FFFF00,FFCC00,FF9900,FF6600,FF3300,FF0000,CCFF00,CCCC00,CC9900,CC6600,CC3300,CC0000,99FF00,99CC00,999900,996600,993300,990000,66FFFF,66CCFF,6699FF,6666FF,6633FF,6600FF,33FFFF,33CCFF,3399FF,3366FF,3333FF,3300FF,00FFFF,00CCFF,0099FF,0066FF,0033FF,0000FF,66FFCC,66CCCC,6699CC,6666CC,6633CC,6600CC,33FFCC,33CCCC,3399CC,3366CC,3333CC,3300CC,00FFCC,00CCCC,0099CC,0066CC,0033CC,0000CC,66FF99,66CC99,669999,666699,663399,660099,33FF99,33CC99,339999,336699,333399,330099,00FF99,00CC99,009999,006699,003399,000099,66FF66,66CC66,669966,666666,663366,660066,33FF66,33CC66,339966,336666,333366,330066,00FF66,00CC66,009966,006666,003366,000066,66FF33,66CC33,669933,666633,663333,660033,33FF33,33CC33,339933,336633,333333,330033,00FF33,00CC33,009933,006633,003333,000033,66FF00,66CC00,669900,666600,663300,660000,33FF00,33CC00,339900,336600,333300,330000,00FF00,00CC00,009900,006600,003300,000000",
        APPLY_CANCEL = {
            apply  : "Apply",
            cancel : "Cancel"
        },
        NS = ".kendoColorTools",
        CLICK_NS = "click" + NS,
        KEYDOWN_NS = "keydown" + NS,

        browser = kendo.support.browser,
        isIE8 = browser.msie && browser.version < 9;

    var ColorSelector = Widget.extend({
        init: function(element, options) {
            var that = this, ariaId;

            Widget.fn.init.call(that, element, options);
            element = that.element;
            options = that.options;
            that._value = options.value = parseColor(options.value);
            that._tabIndex = element.attr("tabIndex") || 0;

            ariaId = that._ariaId = options.ariaId;
            if (ariaId) {
                element.attr("aria-labelledby", ariaId);
            }

            if (options._standalone) {
                that._triggerSelect = that._triggerChange;
            }
        },
        options: {
            name: "ColorSelector",
            value: null,
            _standalone: true
        },
        events: [
            "change",
            "select",
            "cancel"
        ],
        color: function(value) {
            if (value !== undefined) {
                this._value = parseColor(value);
                this._updateUI(this._value);
            }

            return this._value;
        },
        value: function(color) {
            color = this.color(color);

            if (color) {
                if (this.options.opacity) {
                    color = color.toCssRgba();
                } else {
                    color = color.toCss();
                }
            }

            return color || null;
        },
        enable: function(enable) {
            if (arguments.length === 0) {
                enable = true;
            }
            $(".k-disabled-overlay", this.wrapper).remove();
            if (!enable) {
                this.wrapper.append("<div class='k-disabled-overlay'></div>");
            }
            this._onEnable(enable);
        },
        _select: function(color, nohooks) {
            var prev = this._value;
            color = this.color(color);
            if (!nohooks) {
                this.element.trigger("change");
                if (!color.equals(prev)) {
                    this.trigger("change", { value: this.value() });
                } else if (!this._standalone) {
                    this.trigger("cancel");
                }
            }
        },
        _triggerSelect: function(color) {
            triggerEvent(this, "select", color);
        },
        _triggerChange: function(color) {
            triggerEvent(this, "change", color);
        },
        destroy: function() {
            if (this.element) {
                this.element.off(NS);
            }
            if (this.wrapper) {
                this.wrapper.off(NS).find("*").off(NS);
            }
            this.wrapper = null;
            Widget.fn.destroy.call(this);
        },
        _updateUI: $.noop,
        _selectOnHide: function() {
            return null;
        },
        _cancel: function() {
            this.trigger("cancel");
        }
    });

    function triggerEvent(self, type, color) {
        color = parseColor(color);
        if (color && !color.equals(self.color())) {
            if (type == "change") {
                // UI is already updated.  setting _value directly
                // rather than calling self.color(color) to avoid an
                // endless loop.
                self._value = color;
            }
            if (color.a != 1) {
                color = color.toCssRgba();
            } else {
                color = color.toCss();
            }
            self.trigger(type, { value: color });
        }
    }

    var ColorPalette = ColorSelector.extend({
        init: function(element, options) {
            var that = this;
            ColorSelector.fn.init.call(that, element, options);
            element = that.wrapper = that.element;
            options = that.options;
            var colors = options.palette;

            if (colors == "websafe") {
                colors = WEBPALETTE;
                options.columns = 18;
            } else if (colors == "basic") {
                colors = SIMPLEPALETTE;
            }

            if (typeof colors == "string") {
                colors = colors.split(",");
            }

            if ($.isArray(colors)) {
                colors = $.map(colors, function(x) { return parseColor(x); });
            }

            that._selectedID = (options.ariaId || kendo.guid()) + "_selected";

            element.addClass("k-widget k-colorpalette")
                .attr("role", "grid")
                .attr("aria-readonly", "true")
                .append($(that._template({
                    colors   : colors,
                    columns  : options.columns,
                    tileSize : options.tileSize,
                    value    : that._value,
                    id       : options.ariaId
                })))
                .on(CLICK_NS, ".k-item", function(ev){
                    that._select($(ev.currentTarget).css(BACKGROUNDCOLOR));
                })
                .attr("tabIndex", that._tabIndex)
                .on(KEYDOWN_NS, bind(that._keydown, that));

            var tileSize = options.tileSize, width, height;
            if (tileSize) {
                if (/number|string/.test(typeof tileSize)) {
                    width = height = parseFloat(tileSize);
                } else if (typeof tileSize == "object") {
                    width = parseFloat(tileSize.width);
                    height = parseFloat(tileSize.height);
                } else {
                    throw new Error("Unsupported value for the 'tileSize' argument");
                }
                element.find(".k-item").css({ width: width, height: height });
            }
        },
        focus: function(){
            this.wrapper.focus();
        },
        options: {
            name: "ColorPalette",
            columns: 10,
            tileSize: null,
            palette: "basic"
        },
        _onEnable: function(enable) {
            if (enable) {
                this.wrapper.attr("tabIndex", this._tabIndex);
            } else {
                this.wrapper.removeAttr("tabIndex");
            }
        },
        _keydown: function(e) {
            var selected,
                wrapper = this.wrapper,
                items = wrapper.find(".k-item"),
                current = items.filter("." + ITEMSELECTEDCLASS).get(0),
                keyCode = e.keyCode;

            if (keyCode == KEYS.LEFT) {
                selected = relative(items, current, -1);
            } else if (keyCode == KEYS.RIGHT) {
                selected = relative(items, current, 1);
            } else if (keyCode == KEYS.DOWN) {
                selected = relative(items, current, this.options.columns);
            } else if (keyCode == KEYS.UP) {
                selected = relative(items, current, -this.options.columns);
            } else if (keyCode == KEYS.ENTER) {
                preventDefault(e);
                if (current) {
                    this._select($(current).css(BACKGROUNDCOLOR));
                }
            } else if (keyCode == KEYS.ESC) {
                this._cancel();
            }

            if (selected) {
                preventDefault(e);

                this._current(selected);

                try {
                    var color = parseColor(selected.css(BACKGROUNDCOLOR));
                    this._triggerSelect(color);
                } catch(ex) {}
            }
        },
        _current: function(item) {
            this.wrapper.find("." + ITEMSELECTEDCLASS)
                .removeClass(ITEMSELECTEDCLASS)
                .attr("aria-selected", false)
                .removeAttr("id");

            $(item)
                .addClass(ITEMSELECTEDCLASS)
                .attr("aria-selected", true)
                .attr("id", this._selectedID);

            this.element
                .removeAttr("aria-activedescendant")
                .attr("aria-activedescendant", this._selectedID);
        },
        _updateUI: function(color) {
            var item = null;

            this.wrapper.find(".k-item").each(function(){
                var c = parseColor($(this).css(BACKGROUNDCOLOR));

                if (c && c.equals(color)) {
                    item = this;

                    return false;
                }
            });

            this._current(item);
        },
        _template: kendo.template(
            '<table class="k-palette k-reset" role="presentation"><tr role="row">' +
              '# for (var i = 0; i < colors.length; ++i) { #' +
                '# var selected = colors[i].equals(value); #' +
                '# if (i && i % columns == 0) { # </tr><tr role="row"> # } #' +
                '<td role="gridcell" unselectable="on" style="background-color:#= colors[i].toCss() #"' +
                    '#= selected ? " aria-selected=true" : "" # ' +
                    '#=(id && i === 0) ? "id=\\""+id+"\\" " : "" # ' +
                    'class="k-item#= selected ? " ' + ITEMSELECTEDCLASS + '" : "" #" ' +
                    'aria-label="#= colors[i].toCss() #"></td>' +
              '# } #' +
            '</tr></table>'
        )
    });

    var FlatColorPicker = ColorSelector.extend({
        init: function(element, options) {
            var that = this;
            ColorSelector.fn.init.call(that, element, options);
            options = that.options;
            element = that.element;

            that.wrapper = element.addClass("k-widget k-flatcolorpicker")
                .append(that._template(options));

            that._hueElements = $(".k-hsv-rectangle, .k-transparency-slider .k-slider-track", element);

            that._selectedColor = $(".k-selected-color-display", element);

            that._colorAsText = $("input.k-color-value", element);

            that._sliders();

            that._hsvArea();

            that._updateUI(that._value || parseColor("#f00"));

            element
                .find("input.k-color-value").on(KEYDOWN_NS, function(ev){
                    var input = this;
                    if (ev.keyCode == KEYS.ENTER) {
                        try {
                            var color = parseColor(input.value);
                            var val = that.color();
                            that._select(color, color.equals(val));
                        } catch(ex) {
                            $(input).addClass("k-state-error");
                        }
                    } else if (that.options.autoupdate) {
                        setTimeout(function(){
                            var color = parseColor(input.value, true);
                            if (color) {
                                that._updateUI(color, true);
                            }
                        }, 10);
                    }
                }).end()

                .on(CLICK_NS, ".k-controls button.apply", function(){
                    // calling select for the currently displayed
                    // color will trigger the "change" event.
                    that._select(that._getHSV());
                })
                .on(CLICK_NS, ".k-controls button.cancel", function(){
                    // but on cancel, we simply select the previous
                    // value (again, triggers "change" event).
                    that._updateUI(that.color());
                    that._cancel();
                });

            if (isIE8) {
                // IE filters require absolute URLs
                that._applyIEFilter();
            }
        },
        destroy: function() {
            this._hueSlider.destroy();
            if (this._opacitySlider) {
                this._opacitySlider.destroy();
            }
            this._hueSlider = this._opacitySlider = this._hsvRect = this._hsvHandle =
                this._hueElements = this._selectedColor = this._colorAsText = null;
            ColorSelector.fn.destroy.call(this);
        },
        options: {
            name       : "FlatColorPicker",
            opacity    : false,
            buttons    : false,
            input      : true,
            preview    : true,
            autoupdate : true,
            messages   : APPLY_CANCEL
        },
        _applyIEFilter: function() {
            var track = this.element.find(".k-hue-slider .k-slider-track")[0],
                url = track.currentStyle.backgroundImage;

            url = url.replace(/^url\([\'\"]?|[\'\"]?\)$/g, "");
            track.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + url + "', sizingMethod='scale')";
        },
        _sliders: function() {
            var that = this,
                element = that.element;

            function hueChange(e) {
                that._updateUI(that._getHSV(e.value, null, null, null));
            }

            that._hueSlider = element.find(".k-hue-slider").kendoSlider({
                min: 0,
                max: 359,
                tickPlacement: "none",
                showButtons: false,
                slide: hueChange,
                change: hueChange
            }).data("kendoSlider");

            function opacityChange(e) {
                that._updateUI(that._getHSV(null, null, null, e.value / 100));
            }

            that._opacitySlider = element.find(".k-transparency-slider").kendoSlider({
                min: 0,
                max: 100,
                tickPlacement: "none",
                showButtons: false,
                slide: opacityChange,
                change: opacityChange
            }).data("kendoSlider");
        },
        _hsvArea: function() {
            var that = this,
                element = that.element,
                hsvRect = element.find(".k-hsv-rectangle"),
                hsvHandle = hsvRect.find(".k-draghandle").attr("tabIndex", 0).on(KEYDOWN_NS, bind(that._keydown, that));

            function update(x, y) {
                var offset = this.offset,
                    dx = x - offset.left, dy = y - offset.top,
                    rw = this.width, rh = this.height;

                dx = dx < 0 ? 0 : dx > rw ? rw : dx;
                dy = dy < 0 ? 0 : dy > rh ? rh : dy;
                that._svChange(dx / rw, 1 - dy / rh);
            }

            that._hsvEvents = new kendo.UserEvents(hsvRect, {
                global: true,
                press: function(e) {
                    this.offset = kendo.getOffset(hsvRect);
                    this.width = hsvRect.width();
                    this.height = hsvRect.height();
                    hsvHandle.focus();
                    update.call(this, e.x.location, e.y.location);
                },
                start: function() {
                    hsvRect.addClass("k-dragging");
                    hsvHandle.focus();
                },
                move: function(e) {
                    e.preventDefault();
                    update.call(this, e.x.location, e.y.location);
                },
                end: function() {
                    hsvRect.removeClass("k-dragging");
                }
            });

            that._hsvRect = hsvRect;
            that._hsvHandle = hsvHandle;
        },
        _onEnable: function(enable) {
            this._hueSlider.enable(enable);

            if (this._opacitySlider) {
                this._opacitySlider.enable(enable);
            }

            this.wrapper.find("input").attr("disabled", !enable);

            var handle = this._hsvRect.find(".k-draghandle");

            if (enable) {
                handle.attr("tabIndex", this._tabIndex);
            } else {
                handle.removeAttr("tabIndex");
            }
        },
        _keydown: function(ev) {
            var that = this;
            function move(prop, d) {
                var c = that._getHSV();
                c[prop] += d * (ev.shiftKey ? 0.01 : 0.05);
                if (c[prop] < 0) { c[prop] = 0; }
                if (c[prop] > 1) { c[prop] = 1; }
                that._updateUI(c);
                preventDefault(ev);
            }
            function hue(d) {
                var c = that._getHSV();
                c.h += d * (ev.shiftKey ? 1 : 5);
                if (c.h < 0) { c.h = 0; }
                if (c.h > 359) { c.h = 359; }
                that._updateUI(c);
                preventDefault(ev);
            }
            switch (ev.keyCode) {
              case KEYS.LEFT:
                if (ev.ctrlKey) {
                    hue(-1);
                } else {
                    move("s", -1);
                }
                break;
              case KEYS.RIGHT:
                if (ev.ctrlKey) {
                    hue(1);
                } else {
                    move("s", 1);
                }
                break;
              case KEYS.UP:
                move(ev.ctrlKey && that._opacitySlider ? "a" : "v", 1);
                break;
              case KEYS.DOWN:
                move(ev.ctrlKey && that._opacitySlider ? "a" : "v", -1);
                break;
              case KEYS.ENTER:
                that._select(that._getHSV());
                break;
              case KEYS.F2:
                that.wrapper.find("input.k-color-value").focus().select();
                break;
              case KEYS.ESC:
                that._cancel();
                break;
            }
        },
        focus: function() {
            this._hsvHandle.focus();
        },
        _getHSV: function(h, s, v, a) {
            var rect = this._hsvRect,
                width = rect.width(),
                height = rect.height(),
                handlePosition = this._hsvHandle.position();

            if (h == null) {
                h = this._hueSlider.value();
            }
            if (s == null) {
                s = handlePosition.left / width;
            }
            if (v == null) {
                v = 1 - handlePosition.top / height;
            }
            if (a == null) {
                a = this._opacitySlider ? this._opacitySlider.value() / 100 : 1;
            }
            return Color.fromHSV(h, s, v, a);
        },
        _svChange: function(s, v) {
            var color = this._getHSV(null, s, v, null);
            this._updateUI(color);
        },
        _updateUI: function(color, dontChangeInput) {
            var that = this,
                rect = that._hsvRect;

            if (!color) {
                return;
            }

            this._colorAsText.removeClass("k-state-error");

            that._selectedColor.css(BACKGROUNDCOLOR, color.toDisplay());
            if (!dontChangeInput) {
                that._colorAsText.val(that._opacitySlider ? color.toCssRgba() : color.toCss());
            }
            that._triggerSelect(color);

            color = color.toHSV();
            that._hsvHandle.css({
                // saturation is 0 on the left side, full (1) on the right
                left: color.s * rect.width() + "px",
                // value is 0 on the bottom, full on the top.
                top: (1 - color.v) * rect.height() + "px"
            });

            that._hueElements.css(BACKGROUNDCOLOR, Color.fromHSV(color.h, 1, 1, 1).toCss());
            that._hueSlider.value(color.h);

            if (that._opacitySlider) {
                that._opacitySlider.value(100 * color.a);
            }
        },
        _selectOnHide: function() {
            return this.options.buttons ? null : this._getHSV();
        },
        _template: kendo.template(
            '# if (preview) { #' +
                '<div class="k-selected-color"><div class="k-selected-color-display"><input class="k-color-value" #= !data.input ? \'style=\"visibility: hidden;\"\' : \"\" #></div></div>' +
            '# } #' +
            '<div class="k-hsv-rectangle"><div class="k-hsv-gradient"></div><div class="k-draghandle"></div></div>' +
            '<input class="k-hue-slider" />' +
            '# if (opacity) { #' +
                '<input class="k-transparency-slider" />' +
            '# } #' +
            '# if (buttons) { #' +
                '<div unselectable="on" class="k-controls"><button class="k-button k-primary apply">#: messages.apply #</button> <button class="k-button cancel">#: messages.cancel #</button></div>' +
            '# } #'
        )
    });

    function relative(array, element, delta) {
        array = Array.prototype.slice.call(array);
        var n = array.length;
        var pos = array.indexOf(element);
        if (pos < 0) {
            return delta < 0 ? array[n - 1] : array[0];
        }
        pos += delta;
        if (pos < 0) {
            pos += n;
        } else {
            pos %= n;
        }
        return array[pos];
    }

    /* -----[ The ColorPicker widget ]----- */

    var ColorPicker = Widget.extend({
        init: function(element, options) {
            var that = this;
            Widget.fn.init.call(that, element, options);
            options = that.options;
            element = that.element;

            var value = element.attr("value") || element.val();
            if (value) {
                value = parseColor(value, true);
            } else {
                value = parseColor(options.value, true);
            }
            that._value = options.value = value;

            var content = that.wrapper = $(that._template(options));
            element.hide().after(content);

            if (element.is("input")) {
                element.appendTo(content);

                // if there exists a <label> associated with this
                // input field, we must catch clicks on it to prevent
                // the built-in color picker from showing up.
                // https://github.com/telerik/kendo-ui-core/issues/292

                var label = element.closest("label");
                var id = element.attr("id");
                if (id) {
                    label = label.add('label[for="' + id + '"]');
                }
                label.click(function(ev){
                    that.open();
                    ev.preventDefault();
                });
            }

            that._tabIndex = element.attr("tabIndex") || 0;

            that.enable(!element.attr("disabled"));

            var accesskey = element.attr("accesskey");
            if (accesskey) {
                element.attr("accesskey", null);
                content.attr("accesskey", accesskey);
            }

            that.bind("activate", function(ev){
                if (!ev.isDefaultPrevented()) {
                    that.toggle();
                }
            });

            that._updateUI(value);
        },
        destroy: function() {
            this.wrapper.off(NS).find("*").off(NS);
            if (this._popup) {
                this._selector.destroy();
                this._popup.destroy();
            }
            this._selector = this._popup = this.wrapper = null;
            Widget.fn.destroy.call(this);
        },
        enable: function(enable) {
            var that = this,
                wrapper = that.wrapper,
                innerWrapper = wrapper.children(".k-picker-wrap"),
                icon = innerWrapper.find(".k-select");

            if (arguments.length === 0) {
                enable = true;
            }

            that.element.attr("disabled", !enable);
            wrapper.attr("aria-disabled", !enable);

            icon.off(NS).on("mousedown" + NS, preventDefault);

            wrapper.addClass("k-state-disabled")
                .removeAttr("tabIndex")
                .add("*", wrapper).off(NS);

            if (enable) {
                wrapper.removeClass("k-state-disabled")
                    .attr("tabIndex", that._tabIndex)
                    .on("mouseenter" + NS, function() { innerWrapper.addClass("k-state-hover"); })
                    .on("mouseleave" + NS, function() { innerWrapper.removeClass("k-state-hover"); })
                    .on("focus" + NS, function () { innerWrapper.addClass("k-state-focused"); })
                    .on("blur" + NS, function () { innerWrapper.removeClass("k-state-focused"); })
                    .on(KEYDOWN_NS, bind(that._keydown, that))
                    .on(CLICK_NS, ".k-icon", bind(that.toggle, that))
                    .on(CLICK_NS, that.options.toolIcon ? ".k-tool-icon" : ".k-selected-color", function(){
                        that.trigger("activate");
                    });
            }
        },

        _template: kendo.template(
            '<span role="textbox" aria-haspopup="true" class="k-widget k-colorpicker k-header">' +
                '<span class="k-picker-wrap k-state-default">' +
                    '# if (toolIcon) { #' +
                        '<span class="k-tool-icon #= toolIcon #">' +
                            '<span class="k-selected-color"></span>' +
                        '</span>' +
                    '# } else { #' +
                        '<span class="k-selected-color"></span>' +
                    '# } #' +
                    '<span class="k-select" unselectable="on">' +
                        '<span class="k-icon k-i-arrow-s" unselectable="on"></span>' +
                    '</span>' +
                '</span>' +
            '</span>'
        ),

        options: {
            name: "ColorPicker",
            palette: null,
            columns: 10,
            toolIcon: null,
            value: null,
            messages: APPLY_CANCEL,
            opacity: false,
            buttons: true,
            preview: true,
            ARIATemplate: 'Current selected color is #=data || ""#'
        },

        events: [ "activate", "change", "select", "open", "close" ],

        open: function() {
            this._getPopup().open();
        },
        close: function() {
            this._getPopup().close();
        },
        toggle: function() {
            this._getPopup().toggle();
        },
        color: ColorSelector.fn.color,
        value: ColorSelector.fn.value,
        _select: ColorSelector.fn._select,
        _triggerSelect: ColorSelector.fn._triggerSelect,
        _isInputTypeColor: function() {
            var el = this.element[0];
            return (/^input$/i).test(el.tagName) && (/^color$/i).test(el.type);
        },

        _updateUI: function(value) {
            var formattedValue = "";

            if (value) {
                if (this._isInputTypeColor() || value.a == 1) {
                    // seems that input type="color" doesn't support opacity
                    // in colors; the only accepted format is hex #RRGGBB
                    formattedValue = value.toCss();
                } else {
                    formattedValue = value.toCssRgba();
                }

                this.element.val(formattedValue);
            }

            if (!this._ariaTemplate) {
                this._ariaTemplate = kendo.template(this.options.ARIATemplate);
            }

            this.wrapper.attr("aria-label", this._ariaTemplate(formattedValue));

            this._triggerSelect(value);
            this.wrapper.find(".k-selected-color").css(
                BACKGROUNDCOLOR,
                value ? value.toDisplay() : "transparent"
            );
        },
        _keydown: function(ev) {
            var key = ev.keyCode;
            if (this._getPopup().visible()) {
                if (key == KEYS.ESC) {
                    this._selector._cancel();
                } else {
                    this._selector._keydown(ev);
                }
                preventDefault(ev);
            }
            else if (key == KEYS.ENTER || key == KEYS.DOWN) {
                this.open();
                preventDefault(ev);
            }
        },
        _getPopup: function() {
            var that = this, popup = that._popup;

            if (!popup) {
                var options = that.options;
                var selectorType;

                if (options.palette) {
                    selectorType = ColorPalette;
                } else {
                    selectorType = FlatColorPicker;
                }

                options._standalone = false;
                delete options.select;
                delete options.change;
                delete options.cancel;

                var id = kendo.guid();
                var selector = that._selector = new selectorType($('<div id="' + id +'"/>').appendTo(document.body), options);

                that.wrapper.attr("aria-owns", id);

                that._popup = popup = selector.wrapper.kendoPopup({
                    anchor: that.wrapper
                }).data("kendoPopup");

                selector.bind({
                    select: function(ev){
                        that._updateUI(parseColor(ev.value));
                    },
                    change: function(){
                        that._select(selector.color());
                        that.close();
                    },
                    cancel: function() {
                        that.close();
                    }
                });
                popup.bind({
                    close: function(ev){
                        if (that.trigger("close")) {
                            ev.preventDefault();
                            return;
                        }
                        that.wrapper.children(".k-picker-wrap").removeClass("k-state-focused");
                        var color = selector._selectOnHide();
                        if (!color) {
                            that.wrapper.focus();
                            that._updateUI(that.color());
                        } else {
                            that._select(color);
                        }
                    },
                    open: function(ev) {
                        if (that.trigger("open")) {
                            ev.preventDefault();
                        } else {
                            that.wrapper.children(".k-picker-wrap").addClass("k-state-focused");
                        }
                    },
                    activate: function(){
                        selector._select(that.color(), true);
                        selector.focus();
                        that.wrapper.children(".k-picker-wrap").addClass("k-state-focused");
                    }
                });
            }
            return popup;
        }
    });

    function preventDefault(ev) { ev.preventDefault(); }

    function bind(callback, obj) {
        return function() {
            return callback.apply(obj, arguments);
        };
    }

    ui.plugin(ColorPalette);
    ui.plugin(FlatColorPicker);
    ui.plugin(ColorPicker);

})(jQuery, parseInt);



;

(function($, undefined) {
    var kendo = window.kendo,
        Widget = kendo.ui.Widget,
        proxy = $.proxy,
        extend = $.extend,
        setTimeout = window.setTimeout,
        CLICK = "click",
        SHOW = "show",
        HIDE = "hide",
        KNOTIFICATION = "k-notification",
        KICLOSE = ".k-notification-wrap .k-i-close",
        INFO = "info",
        SUCCESS = "success",
        WARNING = "warning",
        ERROR = "error",
        TOP = "top",
        LEFT = "left",
        BOTTOM = "bottom",
        RIGHT = "right",
        UP = "up",
        NS = ".kendoNotification",
        WRAPPER = '<div class="k-widget k-notification"></div>',
        TEMPLATE = '<div class="k-notification-wrap">' +
                '<span class="k-icon k-i-note">#=typeIcon#</span>' +
                '#=content#' +
                '<span class="k-icon k-i-close">Hide</span>' +
            '</div>';

    var Notification = Widget.extend({
        init: function(element, options) {
            var that = this;

            Widget.fn.init.call(that, element, options);

            options = that.options;

            if (!options.appendTo || !$(options.appendTo).is(element)) {
                that.element.hide();
            }

            that._compileTemplates(options.templates);
            that._guid = "_" + kendo.guid();
            that._isRtl = kendo.support.isRtl(element);
            that._compileStacking(options.stacking, options.position.top);

            kendo.notify(that);
        },

        events: [
            SHOW,
            HIDE
        ],

        options: {
            name: "Notification",
            position: {
                pinned: true,
                top: null,
                left: null,
                bottom: 20,
                right: 20
            },
            stacking: "default",
            hideOnClick: true,
            button: false,
            allowHideAfter: 0,
            autoHideAfter: 5000,
            appendTo: null,
            width: null,
            height: null,
            templates: [],
            animation: {
                open: {
                    effects: "fade:in",
                    duration: 300
                },
                close: {
                    effects: "fade:out",
                    duration: 600,
                    hide: true
                }
            }
        },

        _compileTemplates: function(templates) {
            var that = this;
            var kendoTemplate = kendo.template;

            that._compiled = {};

            $.each(templates, function(key, value) {
                that._compiled[value.type] = kendoTemplate(value.template || $("#" + value.templateId).html());
            });

            that._defaultCompiled = kendoTemplate(TEMPLATE);
        },

        _getCompiled: function(type) {
            var that = this;
            var defaultCompiled = that._defaultCompiled;

            return type ? that._compiled[type] || defaultCompiled : defaultCompiled;
        },

        _compileStacking: function(stacking, top) {
            var that = this,
                paddings = { paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0 },
                origin, position;

            switch (stacking) {
                case "down":
                    origin = BOTTOM + " " + LEFT;
                    position = TOP + " " + LEFT;
                    delete paddings.paddingBottom;
                break;
                case RIGHT:
                    origin = TOP + " " + RIGHT;
                    position = TOP + " " + LEFT;
                    delete paddings.paddingRight;
                break;
                case LEFT:
                    origin = TOP + " " + LEFT;
                    position = TOP + " " + RIGHT;
                    delete paddings.paddingLeft;
                break;
                case UP:
                    origin = TOP + " " + LEFT;
                    position = BOTTOM + " " + LEFT;
                    delete paddings.paddingTop;
                break;
                default:
                    if (top !== null) {
                        origin = BOTTOM + " " + LEFT;
                        position = TOP + " " + LEFT;
                        delete paddings.paddingBottom;
                    } else {
                        origin = TOP + " " + LEFT;
                        position = BOTTOM + " " + LEFT;
                        delete paddings.paddingTop;
                    }
                break;
            }

            that._popupOrigin = origin;
            that._popupPosition = position;
            that._popupPaddings = paddings;
        },

        _attachPopupEvents: function(options, popup) {
            var that = this,
                allowHideAfter = options.allowHideAfter,
                attachDelay = !isNaN(allowHideAfter) && allowHideAfter > 0,
                closeIcon;

            function attachClick(target) {
                target.on(CLICK + NS, function() {
                    popup.close();
                });
            }

            if (options.hideOnClick) {
                popup.bind("activate", function(e) {
                    if (attachDelay) {
                        setTimeout(function(){
                            attachClick(popup.element);
                        }, allowHideAfter);
                    } else {
                        attachClick(popup.element);
                    }
                });
            } else if (options.button) {
                closeIcon = popup.element.find(KICLOSE);
                if (attachDelay) {
                    setTimeout(function(){
                        attachClick(closeIcon);
                    }, allowHideAfter);
                } else {
                    attachClick(closeIcon);
                }
            }
        },

        _showPopup: function(wrapper, options) {
            var that = this,
                autoHideAfter = options.autoHideAfter,
                x = options.position.left,
                y = options.position.top,
                allowHideAfter = options.allowHideAfter,
                popup, openPopup, attachClick, closeIcon;

            openPopup = $("." + that._guid).last();

            popup = new kendo.ui.Popup(wrapper, {
                anchor: openPopup[0] ? openPopup : document.body,
                origin: that._popupOrigin,
                position: that._popupPosition,
                animation: options.animation,
                modal: true,
                collision: "",
                isRtl: that._isRtl,
                close: function(e) {
                    that._triggerHide(this.element);
                },
                deactivate: function(e) {
                    e.sender.element.off(NS);
                    e.sender.element.find(KICLOSE).off(NS);
                    e.sender.destroy();
                }
            });

            that._attachPopupEvents(options, popup);

            if (openPopup[0]) {
                popup.open();
            } else {
                if (x === null) {
                    x = $(window).width() - wrapper.width() - options.position.right;
                }

                if (y === null) {
                    y = $(window).height() - wrapper.height() - options.position.bottom;
                }

                popup.open(x, y);
            }

            popup.wrapper.addClass(that._guid).css(extend({margin:0}, that._popupPaddings));

            if (options.position.pinned) {
                popup.wrapper.css("position", "fixed");
                if (openPopup[0]) {
                    that._togglePin(popup.wrapper, true);
                }
            } else if (!openPopup[0]) {
                that._togglePin(popup.wrapper, false);
            }

            if (autoHideAfter > 0) {
                setTimeout(function(){
                    popup.close();
                }, autoHideAfter);
            }
        },

        _togglePin: function(wrapper, pin) {
            var win = $(window),
                sign = pin ? -1 : 1;

            wrapper.css({
                top: parseInt(wrapper.css(TOP), 10) + sign * win.scrollTop(),
                left: parseInt(wrapper.css(LEFT), 10) + sign * win.scrollLeft()
            });
        },

        _attachStaticEvents: function(options, wrapper) {
            var that = this,
                allowHideAfter = options.allowHideAfter,
                attachDelay = !isNaN(allowHideAfter) && allowHideAfter > 0;

            function attachClick(target) {
                target.on(CLICK + NS, proxy(that._hideStatic, that, wrapper));
            }

            if (options.hideOnClick) {
                if (attachDelay) {
                    setTimeout(function(){
                        attachClick(wrapper);
                    }, allowHideAfter);
                } else {
                    attachClick(wrapper);
                }
            } else if (options.button) {
                if (attachDelay) {
                    setTimeout(function(){
                        attachClick(wrapper.find(KICLOSE));
                    }, allowHideAfter);
                } else {
                    attachClick(wrapper.find(KICLOSE));
                }
            }
        },

        _showStatic: function(wrapper, options) {
            var that = this,
                autoHideAfter = options.autoHideAfter,
                animation = options.animation,
                insertionMethod = options.stacking == UP || options.stacking == LEFT ? "prependTo" : "appendTo",
                attachClick;

            wrapper
                .addClass(that._guid)
                [insertionMethod](options.appendTo)
                .hide()
                .kendoAnimate(animation.open || false);

            that._attachStaticEvents(options, wrapper);

            if (autoHideAfter > 0) {
                setTimeout(function(){
                    that._hideStatic(wrapper);
                }, autoHideAfter);
            }
        },

        _hideStatic: function(wrapper) {
            wrapper.kendoAnimate(extend(this.options.animation.close || false, { complete: function() {
                wrapper.off(NS).find(KICLOSE).off(NS);
                wrapper.remove();
            }}));
            this._triggerHide(wrapper);
        },

        _triggerHide: function(element) {
            this.trigger(HIDE, { element: element });
            this.angular("cleanup", function(){
                return { elements: element };
            });
        },

        show: function(content, type) {
            var that = this,
                options = that.options,
                wrapper = $(WRAPPER),
                args, defaultArgs, popup;

            if (!type) {
                type = INFO;
            }

            if (content !== null && content !== undefined && content !== "") {

                if (kendo.isFunction(content)) {
                    content = content();
                }

                defaultArgs = {typeIcon: type, content: ""};

                if ($.isPlainObject(content)) {
                    args = extend(defaultArgs, content);
                } else {
                    args = extend(defaultArgs, {content: content});
                }

                wrapper
                    .addClass(KNOTIFICATION + "-" + type)
                    .toggleClass(KNOTIFICATION + "-button", options.button)
                    .attr("data-role", "alert")
                    .css({width: options.width, height: options.height})
                    .append(that._getCompiled(type)(args));

                that.angular("compile", function(){
                    return {
                        elements: wrapper,
                        data: [{ dataItem: args }]
                    };
                });

                if ($(options.appendTo)[0]) {
                    that._showStatic(wrapper, options);
                } else {
                    that._showPopup(wrapper, options);
                }

                that.trigger(SHOW, {element: wrapper});
            }

            return that;
        },

        info: function(content) {
            return this.show(content, INFO);
        },

        success: function(content) {
            return this.show(content, SUCCESS);
        },

        warning: function(content) {
            return this.show(content, WARNING);
        },

        error: function(content) {
            return this.show(content, ERROR);
        },

        hide: function() {
            var that = this,
                openedNotifications = that.getNotifications();

            if (that.options.appendTo) {
                openedNotifications.each(function(idx, element){
                    that._hideStatic($(element));
                });
            } else {
                openedNotifications.each(function(idx, element){
                    var popup = $(element).data("kendoPopup");
                    if (popup) {
                        popup.close();
                    }
                });
            }

            return that;
        },

        getNotifications: function() {
            var that = this,
                guidElements = $("." + that._guid);

            if (that.options.appendTo) {
                return guidElements;
            } else {
                return guidElements.children("." + KNOTIFICATION);
            }
        },

        setOptions: function(newOptions) {
            var that = this,
                options;

            Widget.fn.setOptions.call(that, newOptions);

            options = that.options;

            if (newOptions.templates !== undefined) {
                that._compileTemplates(options.templates);
            }

            if (newOptions.stacking !== undefined || newOptions.position !== undefined) {
                that._compileStacking(options.stacking, options.position.top);
            }
        },

        destroy: function() {
            Widget.fn.destroy.call(this);
            this.getNotifications().off(NS).find(KICLOSE).off(NS);
        }
    });

    kendo.ui.plugin(Notification);

})(window.kendo.jQuery);




(function($, undefined) {
    var kendo = window.kendo,
        Widget = kendo.ui.Widget,
        Popup = kendo.ui.Popup,
        isFunction = kendo.isFunction,
        isPlainObject = $.isPlainObject,
        extend = $.extend,
        proxy = $.proxy,
        DOCUMENT = $(document),
        isLocalUrl = kendo.isLocalUrl,
        ARIAIDSUFFIX = "_tt_active",
        DESCRIBEDBY = "aria-describedby",
        SHOW = "show",
        HIDE = "hide",
        ERROR = "error",
        CONTENTLOAD = "contentLoad",
        REQUESTSTART = "requestStart",
        KCONTENTFRAME = "k-content-frame",
        TEMPLATE = '<div role="tooltip" class="k-widget k-tooltip#if (!autoHide) {# k-tooltip-closable#}#">#if (!autoHide) {# <div class="k-tooltip-button"><a href="\\#" class="k-icon k-i-close">close</a></div> #}#' +
                '<div class="k-tooltip-content"></div>' +
                '#if (callout){ #<div class="k-callout k-callout-#=dir#"></div>#}#' +
            '</div>',
        IFRAMETEMPLATE = kendo.template(
        "<iframe frameborder='0' class='" + KCONTENTFRAME + "' " +
                "src='#= content.url #'>" +
                    "This page requires frames in order to show content" +
        "</iframe>"),
        NS = ".kendoTooltip",
        POSITIONS = {
            bottom: {
                origin: "bottom center",
                position: "top center"
            },
            top: {
                origin: "top center",
                position: "bottom center"
            },
            left: {
                origin: "center left",
                position: "center right",
                collision: "fit flip"
            },
            right: {
                origin: "center right",
                position: "center left",
                collision: "fit flip"
            },
            center: {
                position: "center center",
                origin: "center center"
            }
        },
        REVERSE = {
            "top": "bottom",
            "bottom": "top",
            "left": "right",
            "right": "left",
            "center": "center"
        },
        DIRCLASSES = {
            bottom: "n",
            top: "s",
            left: "e",
            right: "w",
            center: "n"
        },
        DIMENSIONS = {
            "horizontal": { offset: "top", size: "outerHeight" },
            "vertical": { offset: "left", size: "outerWidth" }
        },
        DEFAULTCONTENT = function(e) {
            return e.target.data(kendo.ns + "title");
        };

    function restoreTitle(element) {
        while(element.length) {
            restoreTitleAttributeForElement(element);
            element = element.parent();
        }
    }

    function restoreTitleAttributeForElement(element) {
        var title = element.data(kendo.ns + "title");
        if (title) {
            element.attr("title", title);
            element.removeData(kendo.ns + "title");
        }
    }

    function saveTitleAttributeForElement(element) {
        var title = element.attr("title");
        if (title) {
            element.data(kendo.ns + "title", title);
            element.attr("title", "");
        }
    }

    function saveTitleAttributes(element) {
        while(element.length && !element.is("body")) {
            saveTitleAttributeForElement(element);
            element = element.parent();
        }
    }

    var Tooltip = Widget.extend({
        init: function(element, options) {
            var that = this,
                axis;

            Widget.fn.init.call(that, element, options);

            axis = that.options.position.match(/left|right/) ? "horizontal" : "vertical";

            that.dimensions = DIMENSIONS[axis];

            that._documentKeyDownHandler = proxy(that._documentKeyDown, that);

            that.element
                .on(that.options.showOn + NS, that.options.filter, proxy(that._showOn, that))
                .on("mouseenter" + NS, that.options.filter, proxy(that._mouseenter, that));

            if (this.options.autoHide) {
                that.element.on("mouseleave" + NS, that.options.filter, proxy(that._mouseleave, that));
            }
        },

        options: {
            name: "Tooltip",
            filter: "",
            content: DEFAULTCONTENT,
            showAfter: 100,
            callout: true,
            position: "bottom",
            showOn: "mouseenter",
            autoHide: true,
            width: null,
            height: null,
            animation: {
                open: {
                    effects: "fade:in",
                    duration: 0
                },
                close: {
                    effects: "fade:out",
                    duration: 40,
                    hide: true
                }
            }
        },

        events: [ SHOW, HIDE, CONTENTLOAD, ERROR, REQUESTSTART ],

        _mouseenter: function(e) {
            saveTitleAttributes($(e.currentTarget));
        },

        _showOn: function(e) {
            var that = this;

            var currentTarget = $(e.currentTarget);
            if (that.options.showOn && that.options.showOn.match(/click|focus/)) {
                that._show(currentTarget);
            } else {
                clearTimeout(that.timeout);

                that.timeout = setTimeout(function() {
                    that._show(currentTarget);
                }, that.options.showAfter);
            }
        },

        _appendContent: function(target) {
            var that = this,
                contentOptions = that.options.content,
                element = that.content,
                showIframe = that.options.iframe,
                iframe;

            if (isPlainObject(contentOptions) && contentOptions.url) {
                if (!("iframe" in that.options)) {
                    showIframe = !isLocalUrl(contentOptions.url);
                }

                that.trigger(REQUESTSTART, { options: contentOptions, target: target });

                if (!showIframe) {
                    element.empty();
                    kendo.ui.progress(element, true);

                    // perform AJAX request
                    that._ajaxRequest(contentOptions);
                } else {
                    element.hide();

                    iframe = element.find("." + KCONTENTFRAME)[0];

                    if (iframe) {
                        // refresh existing iframe
                        iframe.src = contentOptions.url || iframe.src;
                    } else {
                        element.html(IFRAMETEMPLATE({ content: contentOptions }));
                    }

                    element.find("." + KCONTENTFRAME)
                        .off("load" + NS)
                        .on("load" + NS, function(){
                            that.trigger(CONTENTLOAD);
                            element.show();
                        });
                }
            } else if (contentOptions && isFunction(contentOptions)) {
                contentOptions = contentOptions({ sender: this, target: target });
                element.html(contentOptions || "");
            } else {
                element.html(contentOptions);
            }

            that.angular("compile", function(){
                return { elements: element };
            });
        },

        _ajaxRequest: function(options) {
            var that = this;

            jQuery.ajax(extend({
                type: "GET",
                dataType: "html",
                cache: false,
                error: function (xhr, status) {
                    kendo.ui.progress(that.content, false);

                    that.trigger(ERROR, { status: status, xhr: xhr });
                },
                success: proxy(function (data) {
                    kendo.ui.progress(that.content, false);

                    that.content.html(data);

                    that.trigger(CONTENTLOAD);
                }, that)
            }, options));
        },

        _documentKeyDown: function(e) {
            if (e.keyCode === kendo.keys.ESC) {
                this.hide();
            }
        },

        refresh: function() {
            var that = this,
                popup = that.popup;

            if (popup && popup.options.anchor) {
                that._appendContent(popup.options.anchor);
            }
        },

        hide: function() {
            if (this.popup) {
                this.popup.close();
            }
        },

        show: function(target) {
            target = target || this.element;

            saveTitleAttributes(target);
            this._show(target);
        },

        _show: function(target) {
            var that = this,
                current = that.target();

            if (!that.popup) {
                that._initPopup();
            }

            if (current && current[0] != target[0]) {
                that.popup.close();
                that.popup.element.kendoStop(true, true);// animation can be too long to hide the element before it is shown again
            }

            if (!current || current[0] != target[0]) {
                that._appendContent(target);
                that.popup.options.anchor = target;
            }

            that.popup.one("deactivate", function() {
                restoreTitle(target);
                target.removeAttr(DESCRIBEDBY);

                this.element
                    .removeAttr("id")
                    .attr("aria-hidden", true);

                DOCUMENT.off("keydown" + NS, that._documentKeyDownHandler);
            });

            that.popup.open();
        },

        _initPopup: function() {
            var that = this,
                options = that.options,
                wrapper = $(kendo.template(TEMPLATE)({
                    callout: options.callout && options.position !== "center",
                    dir: DIRCLASSES[options.position],
                    autoHide: options.autoHide
                }));

            that.popup = new Popup(wrapper, extend({
                activate: function() {
                    var anchor = this.options.anchor,
                        ariaId = anchor[0].id || that.element[0].id;

                    if (ariaId) {
                        anchor.attr(DESCRIBEDBY, ariaId + ARIAIDSUFFIX);
                        this.element.attr("id", ariaId + ARIAIDSUFFIX);
                    }

                    if (options.callout) {
                        that._positionCallout();
                    }

                    this.element.removeAttr("aria-hidden");

                    DOCUMENT.on("keydown" + NS, that._documentKeyDownHandler);

                    that.trigger(SHOW);
                },
                close: function() {
                    that.trigger(HIDE);
                },
                copyAnchorStyles: false,
                animation: options.animation
            }, POSITIONS[options.position]));

            wrapper.css({
                width: options.width,
                height: options.height
            });

            that.content = wrapper.find(".k-tooltip-content");
            that.arrow = wrapper.find(".k-callout");

            if (options.autoHide) {
                wrapper.on("mouseleave" + NS, proxy(that._mouseleave, that));
            } else {
                wrapper.on("click" + NS, ".k-tooltip-button", proxy(that._closeButtonClick, that));
            }
        },

        _closeButtonClick: function(e) {
            e.preventDefault();
            this.hide();
        },

        _mouseleave: function(e) {
            if (this.popup) {
                var element = $(e.currentTarget),
                    offset = element.offset(),
                    pageX = e.pageX,
                    pageY = e.pageY;

                offset.right = offset.left + element[0].clientWidth;
                offset.bottom = offset.top + element[0].clientHeight;

                if (pageX > offset.left && pageX < offset.right && pageY > offset.top && pageY < offset.bottom) {
                    return;
                }

                this.popup.close();
            } else {
                restoreTitle($(e.currentTarget));
            }
            clearTimeout(this.timeout);
        },

        _positionCallout: function() {
            var that = this,
                position = that.options.position,
                dimensions = that.dimensions,
                offset = dimensions.offset,
                popup = that.popup,
                anchor = popup.options.anchor,
                anchorOffset = $(anchor).offset(),
                arrowBorder = parseInt(that.arrow.css("border-top-width"), 10),
                elementOffset = $(popup.element).offset(),
                cssClass = DIRCLASSES[popup.flipped ? REVERSE[position] : position],
                offsetAmount = anchorOffset[offset] - elementOffset[offset] + ($(anchor)[dimensions.size]() / 2) - arrowBorder;

           that.arrow
               .removeClass("k-callout-n k-callout-s k-callout-w k-callout-e")
               .addClass("k-callout-" + cssClass)
               .css(offset, offsetAmount);
        },

        target: function() {
            if (this.popup) {
                return this.popup.options.anchor;
            }
            return null;
        },

        destroy: function() {
            var popup = this.popup;

            if (popup) {
                popup.element.off(NS);
                popup.destroy();
            }

            this.element.off(NS);

            DOCUMENT.off("keydown" + NS, this._documentKeyDownHandler);

            Widget.fn.destroy.call(this);
        }
    });

    kendo.ui.plugin(Tooltip);
})(window.kendo.jQuery);



return window.kendo;

}, typeof define == 'function' && define.amd ? define : function(_, f){ f(); });