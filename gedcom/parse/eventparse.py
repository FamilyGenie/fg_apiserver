#!/usr/bin/python
# v. 0.5
# eventParse Gedcom to Json

from dateparse import parseDate
from gedcomhelpers import writeToFile, recordsToJson
import gedcom, re, sys, json

argIn = sys.argv[1] # gedcom file input
argOut = sys.argv[2] # json file output
userId = sys.argv[3] 


def main():
    gedfile = gedcom.parse(argIn)
    records = makeRecords(gedfile)
    jsonRecords = recordsToJson(records)
    writeToFile(jsonRecords, argOut)


def makeRecords(filename):
    """
    :rtype: list[]
    """

    eventRecords = []
    for person in filename.individuals:
        eventRecords.append(makePersonEventRecords(person))

    return sum(eventRecords, []) # return the flattened list of lists
        

def makePersonEventRecords(person):
    """
    :rtype: list[]
    """

    attributes = ['event', 'arrival', 'birth', 'death', 'divorce', 'burial', 'residence', 'bar_mitzvah', 'bas_mitzvah', 'blessing', 'christening', 'adult_christening', 'confirmation', 'confirmation_lds', 'cremation', 'graduation', 'immigration', 'naturalization', 'will']
    
    personEvents = []
    for attribute in attributes:
        if checkForAttribute(person, attribute):
            personEvents.append(makeSingleEventRecord(person, attribute))

    return personEvents

def checkForAttribute(person, attribute):
    """
    check if a person has an attribute

    :rtype: bool
    """

    if hasattr(person, attribute):
        return True
    else:
        return False


def makeSingleEventRecord(person, attr):
    """
    create a dict of an event record

    :rtype: dict{}
    """
    buildRecord = {}

    event = getattr(person, attr)

    addDateToRecord(event, buildRecord)
    addTypeToRecord(event, attr, buildRecord)
    addPlaceToRecord(event, buildRecord)
    addIdsToRecord(person, buildRecord)

    return buildRecord


def addDateToRecord(event, record):
    """check that the event has a date and store it"""

    if hasattr(event, 'date'):
        record['eventDate'] = str(parseDate(event.date)[0])
        record['approxDate'] = str(parseDate(event.date)[1])
        record['eventDateUser'] = event.date
    if type(event) == list:
        if hasattr(event[0], 'date'):
            record['eventDate'] = str(parseDate(event[0].date)[0])
            record['approxDate'] = str(parseDate(event[0].date)[1])
            record['eventDateUser'] = event[0].date


def addTypeToRecord(event, attr, record):
    """check what the event type is, and store it"""

    if attr.capitalize() != 'Event':
        record['eventType'] = attr.replace('_', ' ').title()
    else:
        record['eventType'] = event[0].type


def addPlaceToRecord(event, record):
    """check that there is a place record and store it"""

    if hasattr(event, 'place'):
        record['eventPlace'] = event.place
    if type(event) == list:
        if hasattr(event[0], 'place'):
            record['eventPlace'] = event[0].place


def addIdsToRecord(person, record):
    """store the personId and user_id"""

    record['personId'] = person.id
    record['user_id'] = userId
    

if __name__ == '__main__':
    main()
