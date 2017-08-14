/*!
 * JavaScript Cookie v2.1.4
 * https://github.com/ahoura/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Rewritten by Ahoura Ghotbi in typescript using ES6 Class syntax
 * Released under the MIT license
 */

export interface CookiesClassSettings{
	//nothing yet
}

export interface CookiesAPIAttributes{

}

export class CookiesClass {
	
	defaults: CookiesAPIAttributes = {}
	convertor: any = {
		write: false,
		read: false,
	};
	settings: any = {};
	
	constructor(_settings?: CookiesClassSettings, _convertor?) {
		Object.assign(this.convertor, _convertor);
		Object.assign(this.settings, _settings);
	}

	// public methods
	set = function(key, value, attributes?:any){
		return this.api(key, value, attributes);
	};

	get = function (key) {
		return this.api(key);
	};
	getJSON = function (key) {
		return this.api(key, null, null, {
			json: true
		});
	};

	remove = function (key, attributes) {
		this.api(key, '', this.extend(attributes, {
			expires: -1
		}));
	};


	// private methods
	private api = function(key, value?, attributes?:any, settings?: any) {
		var result;
		if (typeof document === 'undefined') {
			return;
		}

		// Write
		if ( arguments.length > 1 
			&& ( ( value !== '' || value !== null )
				&& !Object.keys(attributes).length  ) ) {
			attributes = this.extend({
				path: '/'
			}, this.defaults, attributes);

			if (typeof attributes.expires === 'number') {
				var expires = new Date();
				expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
				attributes.expires = expires;
			}

			// We're using "expires" because "max-age" is not supported by IE
			attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

			try {
				result = JSON.stringify(value);
				if (/^[\{\[]/.test(result)) {
					value = result;
				}
			} catch (e) {}

			if (!this.converter.write) {
				value = encodeURIComponent(String(value))
					.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
			} else {
				value = this.converter.write(value, key);
			}

			key = encodeURIComponent(String(key));
			key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
			key = key.replace(/[\(\)]/g, escape);

			var stringifiedAttributes = '';

			for (var attributeName in attributes) {
				if (!attributes[attributeName]) {
					continue;
				}
				stringifiedAttributes += '; ' + attributeName;
				if (attributes[attributeName] === true) {
					continue;
				}
				stringifiedAttributes += '=' + attributes[attributeName];
			}
			return (document.cookie = key + '=' + value + stringifiedAttributes);
		}

		// Read

		if (!key) {
			result = {};
		}

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling "get()"
		var cookies = document.cookie ? document.cookie.split('; ') : [];
		var rdecode = /(%[0-9A-Z]{2})+/g;
		var i = 0;

		for (; i < cookies.length; i++) {
			var parts = cookies[i].split('=');
			var cookie = parts.slice(1).join('=');

			if (cookie.charAt(0) === '"') {
				cookie = cookie.slice(1, -1);
			}

			try {
				var name = parts[0].replace(rdecode, decodeURIComponent);
				cookie = this.converter.read ?
					this.converter.read(cookie, name) : /*this.converter(cookie, name) ||*/
					cookie.replace(rdecode, decodeURIComponent);

				if ( settings.json ) {
					try {
						cookie = JSON.parse(cookie);
					} catch (e) {}
				}

				if (key === name) {
					result = cookie;
					break;
				}

				if (!key) {
					result[name] = cookie;
				}
			} catch (e) {}
		}

		return result;
	}

	private extend = function() {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

}


export let Cookies = new CookiesClass();
