import IJSONable from "./IJSONable.js";
import { evaluate } from "mathjs";
import BadRequestError from "../exception/BadRequestError.js";

export default class Resource extends IJSONable {
    toJsonObject() {
        return {
            name: this.name,
            equation: this.equation,
            starting_value: this.starting_value
        }
    }

    /**
     * Calculate the new values to set for this resource in a running SimulationInstance
     * @param {StateHistory} history The current turn of the simulationInstance
     * @returns {Number} The new value of the resource
     */
    runEquation(history) {
        return evaluate(this._formatEquation(history));
    }

    runUserEquation(history, current_user) {
        return evaluate(this._formatEquation(history, current_user));
    }

    /**
     * Format the equation, substituting the correct values in
     * Note: 
     *     It might be more efficient to do this formatting during simulation creation,
     *     storing the formatted string with variable names that mathjs understands,
     *     and just using math.evaluate to handle the variables.
     *     But that's a problem for later.
     * @param {StateHistory} history The current turn of the simulationInstance
     * @param {String} current_user The id of the current user, or null if this resource is not a user_resource. Defaults to null.
     * @returns {String} The formatted equation
     */
    _formatEquation(history, current_user=null) {
        // Sort the user_history to make the order deterministic. The actual order does not matter, as long as it is always consistent.
        let user_history = history.user_history;
        // console.log(history);
        user_history.sort((lhs, rhs) => {
            if (lhs.user == rhs.user) {
                return 0;
            } else if (lhs.user > rhs.user) {
                return 1;
            } else { // lhs.user < rhs.user
                return -1;
            }
        });

        // Find all of the parts of the equation that match the ${variable} pattern
        let matches = [...this.equation.matchAll(/\$\{(.*?)\}/g)];

        // Replace all of the ${variable} patterns with their respective values
        let result = this.equation;
        for (let i in matches) {
            let match = matches[i];
            let value = this._extractValue(match[1], history.resources, user_history, current_user);
            result = result.replace(match[0], value);
        }
        return result
    }

    /**
     * Find the values that corresponds with a given variable name
     * TODO: Would be better to throw these equation errors at simulationmodification time
     * @param {String} name Name of the variable
     * @param {Object} resources The resources from the history
     * @param {Object[]} user_history The sorted user_history from the history
     * @param {String} current_user The id of the current user, or null if this resource is not a user_resource
     * @returns The value to place into the formatted equation
     */
    _extractValue(name, resources, user_history, current_user) {
        let names = name.split(".");
        if (names.length == 1) {
            return this._extractResourceValue(names[0], resources);
        } else if (names.length == 2) {
            if (names[0] == "current_user") {
                return this._extractCurrentUserValue(names[1], user_history, current_user);
            } else {
                return this._extractUserValue(names[0], names[1], user_history, current_user);
            }
        } else {
            throw new BadRequestError(`Equation variable ${name} cannot be parsed\nIn equation ${this.equation}`);
        }
    }

    /**
   * Finds the value of a given variable
   * @param {String} name The name of the variable
   * @param {Object[]} resources The resources of the current frame
   * @returns The value identified by name
   */
    _extractResourceValue(name, resources) {
        let result = null;
        for (let key in resources) {
            if (key == name) {
                result = resources[key];
            }
        }
        if (result == null) {
            throw new _BadRequestError.default(`Failed to locate variable with name ${name}\nIn equation ${this.equation}`);
        }
        return result;
    }

    /**
     * Finds the value of a given user_variable for the currently active user
     * @param {String} name The name of the user variable
     * @param {Object[]} user_history The user_history of the current frame
     * @param {String} current_user The id of the current user
     * @returns The value identified by name and current_user
     */
    _extractCurrentUserValue(name, user_history, current_user) {
        if (current_user == null) {
            throw new BadRequestError(`Tried to access current_user of an equation that is not a user_variable\nIn equation ${this.equation}`);
        }
        let result = null;
        user_history.forEach(uh => {
            if (uh.user == current_user) {
                if(name == uh.name) {
                    result = uh.value;
                } else if(name == "response") {
                    result = uh.response;
                }
            }
        });
        if (result == null) {
            throw new BadRequestError(`Failed to locate user_variable with name ${name}\nIn equation ${this.equation}`)
        }
        return result;
    }

    /**
     * Finds the value of a given user_variable for the user identified by an index
     * @param {String} user_index The "userxxx" index that identifies the user
     * @param {String} name The name of the user variable
     * @param {Object[]} user_history The user_history of the current frame
     * @param {String} current_user The id of the current user
     * @returns The value identified by name and user_index
     */
    _extractUserValue(user_index, name, user_history, current_user) {
        // Extract the numerical portion from the name. E.g., if names[0] = user15, index = 15
        let index = Number(user_index.substring(4, user_index.length));
        let curr_user_index = -1;
        let curr_user = '';
        let result = null;
        user_history.forEach(uh => {
            if (curr_user != uh.user && uh.user != current_user) {
                curr_user_index++;
                curr_user = uh.user;
            }
            if (index == curr_user_index && result == null) {
                if (name == uh.name) {
                    result = uh.value;
                } else if (name == "response") {
                    result = uh.response;
                }
            }
        });
        if (result == null) {
            throw new BadRequestError(`Failed to locate user_variable with name ${name}\nIn equation ${this.equation}`)
        }
        return result;
    }
}
