import EntityReducer from './EntityReducer';
import {
	MERGE_ENTITIES,
	REMOVE_ENTITIES,
	REPLACE_ENTITIES,
	RESET_ENTITIES,
	UPDATE_ENTITIES,
} from './EntitiesActionTypes';
import { buildEntitySchema } from './EntityActions';

export default class Entity {
	/**
	 * The Key in which the entity is stored under. This is the key within the redux store, as well the key for
	 * relationship references
	 */
	key = undefined;

	/**
	 * The Entity Controller to provide context for the Entity
	 */
	context = undefined;

	/**
	 * The relationship definitions
	 */
	relationships = undefined;

	/**
	 * Function to return the schema for the entity based on the provided entities
	 */
	entitySchema = undefined;

	/**
	 * A function to process incoming entities
	 */
	processStrategy = undefined;

	/**
	 * The attribute to be used to uniquely identify the entity
	 */
	idAttribute = 'id';

	/**
	 * The type of actions the entity can handle.
	 * TODO: Currently this order is important as it maps to the EntityReducer. This structure should be changed to be
	 *       more explicit
	 * @type {*[]}
	 */
	types = [MERGE_ENTITIES, REMOVE_ENTITIES, REPLACE_ENTITIES, RESET_ENTITIES, UPDATE_ENTITIES];

	/**
	 * Constructor
	 *
	 * @param options
	 */
	constructor(options = {}) {
		this.reducer = this.reducer.bind(this);

		const copyProps = ['idAttribute', 'context', 'key', 'relationships', 'processStrategy', 'reducer'];
		copyProps.forEach((prop) => {
			if (options[prop] !== undefined) {
				this[prop] = options[prop];
			}
		});
	}

	/**
	 * Generate the schema for the entity based on it's relationships
	 */
	generateEntitySchema = () => {
		this.entitySchema = buildEntitySchema(this.getSchema());
	};

	/**
	 * Get the registered normalizr schema
	 *
	 * @param key
	 * @returns {*}
	 */
	getSchema = () => {
		return this.context.getSchema(this.key);
	};

	/**
	 * Set the context for an instance.
	 *
	 * @param context
	 */
	setContext = (context) => {
		this.context = context;
	};

	/**
	 * Normalize and Denormalize method maps. Uses the context to perform the actions so that is has the other
	 * entities for relationships
	 */
	normalize = (data) => this.context.normalize(this.key, data);
	denormalize = (data) => this.context.denormalize(this.key, data);

	/**
	 * Action method mapping
	 *
	 * The context (EntityController) was originally built to provide all of the functionality for the library, and this
	 * Entity class was meant to be used to provide advanced customization.
	 *
	 * TODO: Consider moving all logic for these actions (as well as normalize/denormalize) into this class and leave the
	 *       EntityController to just be a registry for the entities
	 *
	 */
	merge = (data) => this.context.merge(this.key, data);
	update = (data) => this.context.update(this.key, data);
	reset = (data) => this.context.reset(this.key, data);
	replace = (data) => this.context.replace(this.key, data);
	remove = (data) => this.context.remove(this.key, data);

	/**
	 * Creates the reducer to be used in the EntityReducer. It automatically creates the entity reducer with the
	 * appropriate relations. This method is mostly used for the `allReducers` method on the EntityController.
	 *
	 * @returns {function(*=, *)}
	 */
	reducer() {
		return EntityReducer(Object.keys(this.relationships || {}), this.types);
	};
}
