'use strict';

/**
 * Exports functions, which are meant to be used as
 * development helpers in the cloud.
 */

module.exports = {

    /**
     * Whenever a new record is saved to the database
     * this function gets called. The purpose is to make
     * sure that the data is sanitized (HTML Escaped).
     * This is being done in order to achieve tough security
     * protection.
     * 
     * @param event
     * 
     * @return {Promise<void>}
     */
    
    sanitizeData(event){

        const record = event.data.val();
        if (record && !record.sanitized) {

            // Run sanitization on the record.
            const sanitized = sanitizeRecord(record);

            // Update the Firebase DB with sanitized record.
            return event.data.adminRef.update(sanitized);
        }
    }
};

/**
 * The helper function, which actually does the processing.
 *
 * @param record
 *
 * @return {*}
 */

function sanitizeRecord(record) {

    // If this is empty, actually there is no data from
    // the user, so there is nothing to sanitize.

    if(!record.data){
        return record;
    }

    for(let member in record.data) {
        if (record.data.hasOwnProperty(member)) {
            record.data[member] = record.data[member].replace(/&/g, '&amp;');
            record.data[member] = record.data[member].replace(/</g, '&lt;');
            record.data[member] = record.data[member].replace(/>/g, '&gt;');
            record.data[member] = record.data[member].replace(/"/g, '&amp;');
            record.data[member] = record.data[member].replace(/'/g, '&#x27;');
            record.data[member] = record.data[member].replace(/\//g, '&#x2F;');
        }
    }

    record.sanitized = true;
    return record;
}