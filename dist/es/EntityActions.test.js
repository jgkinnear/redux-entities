'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.STRIP_DEEP_COMPARE = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _normalizr = require('normalizr');

var _EntitiesActionTypes = require('./EntitiesActionTypes');

var _EntityActions = require('./EntityActions');

// Setup relationships
var Book = new _normalizr.schema.Entity('books');
var Library = new _normalizr.schema.Entity('libraries');
var Author = new _normalizr.schema.Entity('authors');

Book.define({
	library: Library,
	authors: Author
});

Library.define({
	books: [Book]
});

Author.define({
	books: [Book]
});

var STRIP_DEEP_COMPARE = exports.STRIP_DEEP_COMPARE = {
	//	CASES
	COMPLETELY_SAME_DATA: {
		// STATE
		currentState: {
			entities: {
				pencils: {
					1: { id: 1, requested_at: 1 },
					2: { id: 2, colors: 'white', requested_at: 1 },
					3: { id: 3, multi_colors: ['white', 'blue'], requested_at: 1 },
					4: {
						id: 4,
						description: { a: 1, b: 2, c: 'three' },
						requested_at: 1
					}
				}
			}
		},

		// INPUTS
		normalizedEntities: {
			pencils: {
				1: { id: 1, requested_at: 1 },
				2: { id: 2, colors: 'white', requested_at: 1 },
				3: { id: 3, multi_colors: ['white', 'blue'], requested_at: 1 },
				4: {
					id: 4,
					description: { a: 1, b: 2, c: 'three' },
					requested_at: 1
				}
			}
		},
		// Output
		result: false
	},

	OLDER_INPUT_THAN_CURRENT_STATE: {
		// STATE: Changes to every requested at.
		currentState: {
			entities: {
				pencils: {
					1: { id: 1, requested_at: 2 },
					2: { id: 2, colors: 'white', requested_at: 2 },
					3: { id: 3, multi_colors: ['white', 'blue'], requested_at: 2 },
					4: {
						id: 4,
						description: { a: 1, b: 2, c: 'three' },
						requested_at: 2
					}
				}
			}
		},

		// INPUTS
		normalizedEntities: {
			pencils: {
				1: { id: 1, requested_at: 1 },
				// changes color
				2: { id: 2, colors: 'blue', requested_at: 1 },
				//Adds 'black'
				3: { id: 3, multi_colors: ['white', 'blue', 'black'], requested_at: 1 },
				//Adds d: 'four'
				4: { id: 4, description: { a: 1, b: 2, c: 'three', d: 'four' }, requested_at: 1 }
			}
		},
		// Output
		result: false
	},

	NEWER_INPUT__SAME_DATA: {
		// STATE: Changes to every requested at.
		currentState: {
			entities: {
				pencils: {
					1: { id: 1, requested_at: 2 },
					2: { id: 2, colors: 'white', requested_at: 2 },
					3: { id: 3, multi_colors: ['white', 'blue'], requested_at: 2 },
					4: {
						id: 4,
						description: { a: 1, b: 2, c: 'three' },
						requested_at: 2
					}
				}
			}
		},

		// INPUTS
		normalizedEntities: {
			pencils: {
				1: { id: 1, requested_at: 3 },
				2: { id: 2, colors: 'white', requested_at: 3 },
				3: { id: 3, multi_colors: ['white', 'blue'], requested_at: 3 },
				4: {
					id: 4,
					description: { a: 1, b: 2, c: 'three' },
					requested_at: 3
				}
			}
		},
		// Output
		result: false
	},

	CHANGES_PROPERTIES: {
		// STATE
		currentState: {
			entities: {
				pencils: {
					1: { id: 1, requested_at: 2 },
					2: { id: 2, colors: 'white', requested_at: 2 },
					3: { id: 3, multi_colors: ['white', 'blue'], requested_at: 2 },
					4: {
						id: 4,
						description: { a: 1, b: 2, c: 'three' },
						requested_at: 2
					}
				}
			}
		},

		// INPUTS
		normalizedEntities: {
			pencils: {
				1: { id: 1, requested_at: 3, colors: 'blue' },
				// changes color
				2: { id: 2, colors: 'blue', requested_at: 3 },
				//Remove 'blue'
				3: { id: 3, multi_colors: ['white'], requested_at: 3 },
				//Adds d: 'four'
				4: { id: 4, description: { a: 1, b: 2 }, requested_at: 3 }
			}
		},
		// Output
		result: {
			pencils: {
				'1': { colors: 'blue', id: 1, requested_at: 3 },
				'2': { colors: 'blue', id: 2, requested_at: 3 },
				'3': { id: 3, multi_colors: ['white'], requested_at: 3 },
				'4': { description: { a: 1, b: 2 }, id: 4, requested_at: 3 }
			}
		}
	},

	ERASES_PROPERTIES: {
		// STATE: Changes to every requested at.
		currentState: {
			entities: {
				pencils: {
					1: { id: 1, colors: 'blue', requested_at: 2 },
					2: { id: 2, colors: 'white', requested_at: 2 },
					3: { id: 3, multi_colors: ['white', 'blue'], requested_at: 2 },
					4: {
						id: 4,
						description: { a: 1, b: 3, c: 'three' },
						requested_at: 2
					}
				}
			}
		},

		// INPUTS
		normalizedEntities: {
			pencils: {
				// Change on 'colors': 'blue' -> false
				1: { id: 1, requested_at: 3, colors: false },
				// Colors: 'white' -> null
				2: { id: 2, colors: null, requested_at: 3 },
				// multi_colors: 'undefined'
				3: { id: 3, multi_colors: undefined, requested_at: 3 },
				// deep object 'description'
				4: {
					id: 4,
					description: { a: 1, b: undefined },
					requested_at: 3
				}
			}
		},
		// Output
		result: {
			pencils: {
				'1': { colors: false, id: 1, requested_at: 3 },
				'2': { colors: null, id: 2, requested_at: 3 },
				'3': { id: 3, multi_colors: undefined, requested_at: 3 },
				'4': { description: { a: 1, b: undefined }, id: 4, requested_at: 3 }
			}
		}
	},

	NESTED_ENTITIES__STRIP_OLDER_CHANGES: {
		currentState: {
			entities: {
				meetings: {
					1: { id: 1, races: [1, 2, 3], nextRace: 6, requested_at: 2 }
				},
				races: {
					1: { id: 1, start_date: 1234, requested_at: 2 }
				}
			}
		},

		normalizedEntities: {
			meetings: {
				// Requested in the past
				1: { id: 1, races: [1, 2], nextRace: 5, requested_at: 1 }
			},
			races: {
				// Updates start_date
				1: { id: 1, start_date: 5678, requested_at: 3 }
			}
		},

		result: { races: { '1': { id: 1, requested_at: 3, start_date: 5678 } } }
	},

	NESTED_PROPERTIES_DIFF_REQUESTED_AT: {
		currentState: {
			entities: {
				meetings: {
					1: { id: 1, feature_products: [{ requested_at: 123 }], requested_at: 123 }
				}
			}
		},

		normalizedEntities: {
			meetings: {
				// Requested_at changed in nested property
				1: { id: 1, feature_products: [{ requested_at: 456 }], requested_at: 123 }
			}
		},

		result: { meetings: { '1': { feature_products: [{ requested_at: 456 }], id: 1, requested_at: 123 } } }
	}
};

describe('createAction :: Creates action object', function () {
	it('Basic action is formed correctly', function () {
		expect((0, _EntityActions.createAction)('SET_VALUE', 2)).toEqual({
			type: 'SET_VALUE',
			payload: 2
		});
	});

	it('Options are added correctly', function () {
		expect((0, _EntityActions.createAction)('SET_VALUE', 2, { x: 4 })).toEqual({
			type: 'SET_VALUE',
			payload: 2,
			x: 4
		});
	});
});

describe('Entity action helpers', function () {
	it('should build the correct structure for merge entities', function () {
		expect((0, _EntityActions.mergeEntities)({})).toMatchObject({
			entities: {},
			type: _EntitiesActionTypes.MERGE_ENTITIES
		});
	});

	it('should build the correct structure for update entities', function () {
		expect((0, _EntityActions.updateEntities)({})).toMatchObject({
			entities: {},
			type: _EntitiesActionTypes.UPDATE_ENTITIES
		});
	});
});

describe('ActionHelpers::stripDeepCompare', function () {
	expect((0, _EntityActions.stripDeepCompare)(STRIP_DEEP_COMPARE.COMPLETELY_SAME_DATA.normalizedEntities, STRIP_DEEP_COMPARE.COMPLETELY_SAME_DATA.currentState)).toBe(STRIP_DEEP_COMPARE.COMPLETELY_SAME_DATA.result);

	expect((0, _EntityActions.stripDeepCompare)(STRIP_DEEP_COMPARE.OLDER_INPUT_THAN_CURRENT_STATE.normalizedEntities, STRIP_DEEP_COMPARE.OLDER_INPUT_THAN_CURRENT_STATE.currentState)).toBe(STRIP_DEEP_COMPARE.OLDER_INPUT_THAN_CURRENT_STATE.result);

	expect((0, _EntityActions.stripDeepCompare)(STRIP_DEEP_COMPARE.NEWER_INPUT__SAME_DATA.normalizedEntities, STRIP_DEEP_COMPARE.NEWER_INPUT__SAME_DATA.currentState)).toBe(STRIP_DEEP_COMPARE.NEWER_INPUT__SAME_DATA.result);

	expect((0, _EntityActions.stripDeepCompare)(STRIP_DEEP_COMPARE.CHANGES_PROPERTIES.normalizedEntities, STRIP_DEEP_COMPARE.CHANGES_PROPERTIES.currentState)).toMatchObject(STRIP_DEEP_COMPARE.CHANGES_PROPERTIES.result);

	expect((0, _EntityActions.stripDeepCompare)(STRIP_DEEP_COMPARE.ERASES_PROPERTIES.normalizedEntities, STRIP_DEEP_COMPARE.ERASES_PROPERTIES.currentState)).toMatchObject(STRIP_DEEP_COMPARE.ERASES_PROPERTIES.result);

	expect((0, _EntityActions.stripDeepCompare)(STRIP_DEEP_COMPARE.NESTED_ENTITIES__STRIP_OLDER_CHANGES.normalizedEntities, STRIP_DEEP_COMPARE.NESTED_ENTITIES__STRIP_OLDER_CHANGES.currentState)).toMatchObject(STRIP_DEEP_COMPARE.NESTED_ENTITIES__STRIP_OLDER_CHANGES.result);

	expect((0, _EntityActions.stripDeepCompare)(STRIP_DEEP_COMPARE.NESTED_PROPERTIES_DIFF_REQUESTED_AT.normalizedEntities, STRIP_DEEP_COMPARE.NESTED_PROPERTIES_DIFF_REQUESTED_AT.currentState)).toMatchObject(STRIP_DEEP_COMPARE.NESTED_PROPERTIES_DIFF_REQUESTED_AT.result);
});

describe('removeObjectInArraySlice()', function () {
	it('should remove a selection with the specified ID from the list', function () {
		var obj = [{
			type: 'type-1',
			id: 9
		}, {
			type: 'type-1',
			id: 10
		}, {
			type: 'type-1',
			id: 11
		}];

		var results = [{
			type: 'type-1',
			id: 9
		}, {
			type: 'type-1',
			id: 11
		}];

		expect((0, _EntityActions.removeObjectInArraySlice)(10, obj)).toEqual(results);
	});
});

describe('replaceObjectInArraySlice()', function () {
	it('should replace a selection with the specified list', function () {
		var obj = [{
			type: 'type-1',
			id: 9
		}, {
			type: 'type-1',
			id: 10
		}, {
			type: 'type-1',
			id: 11
		}];

		var replace = {
			type: 'place',
			id: 10
		};

		var results = [{
			type: 'type-1',
			id: 9
		}, replace, {
			type: 'type-1',
			id: 11
		}];

		expect((0, _EntityActions.replaceObjectInArraySlice)(replace, obj)).toEqual(results);
	});
});

describe('relationshipSelectorHelpers::getSchemaRelations', function () {
	it('should build a tree with all relationship keys', function () {
		var result = (0, _EntityActions.getSchemaRelations)(Book);
		expect(result).toEqual(expect.arrayContaining(['authors', 'books', 'libraries']));
		expect(result.length).toBe(3);
	});
});

describe('relationshipSelectorHelpers::buildEntitySchema', function () {

	it('should build a memoized function', function () {
		expect(_typeof((0, _EntityActions.buildEntitySchema)(Book))).toBe('function');
	});

	it('should extract the correct key and value pairs from a entity tree when the result of the function is called', function () {

		var getBookEntities = (0, _EntityActions.buildEntitySchema)(Book);
		var entities = {
			books: {},
			people: {},
			authors: {},
			libraries: {}
		};

		var result = getBookEntities(entities);
		expect(result).toMatchObject({
			books: {},
			authors: {},
			libraries: {}
		});
	});

	it('should memoize the result until values in the entity have changed', function () {

		var getBookEntities = (0, _EntityActions.buildEntitySchema)(Book);
		var entities = {
			people: {
				1: {}
			},
			books: {
				1: {
					author: 1,
					library: 1
				}
			},
			authors: {
				1: {
					books: [1]
				}
			},
			libraries: {
				1: {
					books: [1]
				}
			}
		};

		var result1 = getBookEntities(entities);
		var result2 = getBookEntities(entities);
		expect(result1).toEqual(result2);

		// Change people, which should still stay the same
		entities.people = {};
		var result3 = getBookEntities(entities);
		expect(result1).toEqual(result3);

		// Change the entities object, but keep the values of the relationship keys the same
		entities = {
			authors: entities.authors,
			books: entities.books,
			libraries: entities.libraries
		};
		var result4 = getBookEntities(entities);
		expect(result1 === result4).toBe(true);

		// Change authors and the results should no longer be the same
		entities = {};
		var result5 = getBookEntities(entities);
		expect(result1 === result5).toBe(false);
	});
});