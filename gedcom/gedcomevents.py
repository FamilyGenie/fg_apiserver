#!/usr/bin/python
# v. 0.4
# gedcomParseEvents
"""
Strategy: Declare a set list of event types, loop through individuals in the Gedcom file, and get all existing event information for each person. Store the information in a json file, each object referring to an event

Schema:
{
person_id   : String,    # [person.id]
event_type  : String,    # [person.<eventAttr>]
event_date  : Date,      # Formatted: ISO, [person.<eventAttr>.date]
event_place : String,    # [person.<eventAttr>.place]
}
"""

from datetime import datetime
from parsedate import *
import gedcom
import re
import sys

argIn = sys.argv[1] # gedcom file input
argOut = sys.argv[2] # json file output
userId = sys.argv[3] 

# various event types, in no particular order. global.
attributes = ['event', 'birth', 'death', 'divorce', 'burial', 'residence', 'bar_mitzvah', 'bas_mitzvah', 'blessing', 'christening', 'adult_christening', 'confirmation', 'confirmation_lds', 'cremation', 'graduation', 'immigration', 'naturalization', 'will']

def main():
    gedfile = gedcom.parse(argIn)

    writeToJSONfile(gedfile)

def makeEventRecords(filename):
    """
    Loop through the file and create records for each event for each person.
    
    Loop through each person, and then through each type of event.
    Create a json style record for each record that exists

    PersonId and EventType will exist for every record, while the date and place may or may not exist.

    :returns: json formatted strings of event records
    :rtype: list
    """

    eventRecords = []

    for person in filename.individuals:
        for attribute in attributes:
            buildRecord = '{\n'
            try:
                buildRecord += '"personId" : "' + getattr(person, attribute).parent_id + '",\n'
                buildRecord += '"eventType" : "' + attribute.replace('_', ' ').capitalize() + '",\n'

                try:
                    buildRecord += '"eventDate" : "' + str(parseDate(getattr(person, attribute).date)[0]) + '",\n'
                    buildRecord += '"eventDateUser" : "' + getattr(person, attribute).date + '",\n'
                    buildRecord += '"approxDate" : "' + str(parseDate(getattr(person, attribute).date)[1]) + '",\n'
                except AttributeError:
                    buildRecord += '"eventDate" : null,\n'
                    buildRecord += '"eventDateUser" : null,\n'

                try:
                    buildRecord += '"eventPlace" : "' + getattr(person, attribute).place + '",\n'
                except AttributeError:
                    buildRecord += '"eventPlace" : null,\n'

                buildRecord += '"user_id" : "' + userId + '"\n'
                buildRecord += "}"
                eventRecords.append(buildRecord)
            # AttributeError if the event type does not exist for that person
            except AttributeError:
                pass

    return eventRecords

def makeJSONobject(filename):
    """
    Create a json array from the compiled event records

    :returns: json array of event records
    :rtype: string
    """

    eventRecords = makeEventRecords(filename)
    if eventRecords:
        jsonEvents = '['
        i = 0
        for event in eventRecords:
            if i == len(eventRecords) - 1:
                jsonEvents += event + '\n'
            else:
                jsonEvents += event + ',\n'
            i += 1

        jsonEvents += ']'

        return jsonEvents
    else:
        return '[{}]'

def writeToJSONfile(filename):
    """write the created json object to the output file and save it"""

    json = makeJSONobject(filename)
    f = open(argOut, "w") # creat/open the output file
    f.write(json)
    f.close() # save

if __name__ == "__main__":
    main()
