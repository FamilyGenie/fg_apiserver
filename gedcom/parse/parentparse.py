#!/usr/bin/python
# v. 0.5
# parentParse Gedcom to Json
"""
Parse a gedcom file into JSON for parental relationship records
"""
from dateparse import parseDate
from gedcomhelpers import writeToFile, recordsToJson
import gedcom, re, sys, os, json

argIn  = sys.argv[1]
argOut = sys.argv[2]
userId = sys.argv[3]

def main():
    gedfile = gedcom.parse(argIn)
    records = makeRecords(gedfile)
    jsonRecords = recordsToJson(records)
    writeToFile(jsonRecords, argOut)

def makeRecords(filename):

    buildRecords = []
    for person in filename.individuals:
        if person.has_mother:
            buildRecords.append(makeMaternalRecords(person))
        if person.has_father:
            buildRecords.append(makePaternalRecords(person))
    return buildRecords

def makeMaternalRecords(person):
    """"""

    buildMaternalRecord = {}

    addParentChildId(person, 'mother', buildMaternalRecord)
    addStartDate(person, buildMaternalRecord)
    addEndDate(person, buildMaternalRecord)
    addRelType('Mother', buildMaternalRecord)
    addUserId(buildMaternalRecord)

    return buildMaternalRecord


def makePaternalRecords(person):

    buildPaternalRecord = {}

    addParentChildId(person, 'father', buildPaternalRecord)
    addStartDate(person, buildPaternalRecord)
    addEndDate(person, buildPaternalRecord)
    addRelType('Father', buildPaternalRecord)
    addUserId(buildPaternalRecord)

    return buildPaternalRecord

def addParentChildId(person, pType, record):
    record['child_id'] = person.id
    record['parent_id'] = getattr(person, pType).id

def addStartDate(person, record):
    if hasattr(person, 'birth'):
        if hasattr(person.birth, 'date'):
            record['startDate'] = str(parseDate(person.birth.date)[0])
            record['approxStart'] = str(parseDate(person.birth.date)[1])
            record['startDateUser'] = person.birth.date
            

def addEndDate(person, record):
    if hasattr(person, 'death'):
        if hasattr(person.death, 'date'):
            record['endDate'] = str(parseDate(person.death.date)[0])
            record['approxEnd'] = str(parseDate(person.death.date)[1])
            record['endDateUser'] = person.death.date

def addRelType(relType, record):
    record['relationshipType'] = relType
    record['subType'] = 'Biological'

def addUserId(record):
    record['user_id'] = userId


if __name__ == '__main__':
    main()

