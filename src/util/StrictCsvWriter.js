import csvWriter from "csv-writer";

export default class StrictCsvWriter {
    static _normalize_regex = /\/s/g;
    /**
     * Creates a new StrictCsvWriter. This CsvWriter requires all of the fields to be included in each entry, no more, no less.
     * @param {[String]} fields String array of all of the fields to include in the data dump
     * @param {String} path The path to the file to write
     */
    constructor(fields, path) {
        this.fields = fields;
        let header = fields.map(field => {
            return {id: field, title: field};
        });
        this._writer = csvWriter.createObjectCsvWriter({path: path, header: header});
    }

    /**
     * Write a single row to the csv file
     * @param {Object} record The record to add to the csv
     */
    async write(record) {
        this._validate_record(record);
        return this._writer.writeRecords([record]);
    }

    /**
     * Verify that the csv records match the expected fields
     * @param {Object} record The record to add to the csv
     */
    _validate_record(record) {
        record = this._normalize_keys(record);
        let keys_matched = 0;
        for(let key of Object.keys(record)) {
            if(this.fields.includes(key)) {
                keys_matched++;
            } else {
                throw new Error(`Error adding record to csv: Key ${key} not in fields`);
            }
        }
        if (keys_matched != this.fields.length) {
            throw new Error(`Error adding record to csv: incorrect number of fields. Expected ${this.fields.length}, instead got ${keys_matched}`);
        }
    }
};