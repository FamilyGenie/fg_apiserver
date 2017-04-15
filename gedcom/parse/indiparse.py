#!/usr/bin/python
# v. 0.5
# indiParse Gedcom to Json
"""
Parse a gedcom file into JSON for a persons records 
"""
from dateparse import parseDate
from gedcomhelpers import writeToFile, recordsToJson
import gedcom, time, re, sys, os, json


def main():
    gedfile = parseGedcomFile(argIn)
    records = makeRecords(gedfile)
    jsonRecords = recordsToJson(records)
    writeToFile(jsonRecords, argOut)

def parseGedcomFile(filename):
    """parse the gedcom file and return the result"""
    return gedcom.parse(filename)

def makeRecords(filename):
    """
    create a list of individual records stored in dicts

    :rtype: list[dict{}]
    """

    indiRecords = []
    for person in filename.individuals:
        indiRecords.append(makePersonRecord(person))
    return indiRecords


def makePersonRecord(person):
    """
    create a dict of an individuals records

    :rtype: dict{}
    """

    buildRecord = {}

    addNameToRecord(person, buildRecord)
    addSexToRecord(person, buildRecord)
    addBirthToRecord(person, buildRecord)
    addDeathToRecord(person, buildRecord)
    addIdsToRecord(person, buildRecord)

    return buildRecord


def addNameToRecord(person, record):
    """check that a person has a name record and store it in the dict."""

    try:
        if person.name[0] != None:
            record['fName'] = person.name[0]
        if person.name[1] != None:
            record['lName'] = person.name[1]
    except:
        pass


def addSexToRecord(person, record):
    """check for gender record and store it"""

    if hasattr(person, 'sex'):
        record['sexAtBirth'] = person.sex.replace('"', '\\"')
    elif hasattr(person, 'gender'):
        record['sexAtBirth'] = person.gender.replace('"', '\\"')


def addBirthToRecord(person, record):
    """check for birth records and store them"""

    if hasattr(person, 'birth'):
        if hasattr(person.birth, 'date'):
            record['birthDate'] = str(parseDate(person.birth.date)[0])
            record['approxBirth'] = str(parseDate(person.birth.date)[1])
            record['birthDateUser'] = person.birth.date
        if hasattr(person.birth, 'place'):
            record['birthPlace'] = person.birth.place


def addDeathToRecord(person, record):
    """check for death records and store them"""

    if hasattr(person, 'death'):
        if hasattr(person.death, 'date'):
            record['deathDate'] = str(parseDate(person.death.date)[0])
            record['approxDeath'] = str(parseDate(person.death.date)[1])
            record['deathDateUser'] = person.death.date
        if hasattr(person.death, 'place'):
            record['deathPlace'] = person.death.place


def addIdsToRecord(person, record):
    """store the personId and user_id"""

    record['personId'] = person.id
    record['user_id'] = userId



if __name__ == '__main__':
    # System arguments
    argIn = sys.argv[1]
    argOut = sys.argv[2]
    userId = sys.argv[3]
    main()

