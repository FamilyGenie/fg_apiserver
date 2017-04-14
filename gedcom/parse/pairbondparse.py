#!/usr/bin/python
# v. 0.5
# pairBondParse Gedcom to Json
"""
Parse a gedcom file into JSON for pairbond records
"""

from dateparse import parseDate
from gedcomhelpers import writeToFile, recordsToJson
import gedcom, time, re, sys, os, json

# System arguments
argIn = sys.argv[1]
argOut = sys.argv[2]
userId = sys.argv[3]

def main():
    gedfile = gedcom.parse(argIn)
    records = makeRecords(gedfile)
    jsonRecords = recordsToJson(records)
    writeToFile(jsonRecords, argOut)
            

def makeRecords(filename):
    """"""
    
    buildRecords = []
    for family in filename.families:
        if len(makeMarriageRecord(filename, family).keys()) > 0:
            buildRecords.append(makeMarriageRecord(filename, family))

    return buildRecords
            
        
def makeMarriageRecord(filename, family):
    """"""

    buildMarriageRecord = {}
    
    if family.has_husband and family.has_wife:
        addPersonOneId(family, buildMarriageRecord)
        addPersonTwoId(family, buildMarriageRecord)
    else:
        return {}

    if checkForMarriage(family):
        try:
            addStartDate(family, buildMarriageRecord)
            addEndDate(filename, family, buildMarriageRecord)
        except AttributeError:
            pass

    addRelationshipType(buildMarriageRecord)
    addUserId(buildMarriageRecord)


    return buildMarriageRecord


def addPersonOneId(family, record):
    """"""

    record['personOne_id'] = family.husband.value


def addPersonTwoId(family, record):
    """"""

    record['personTwo_id'] = family.wife.value


def addStartDate(family, record):
    """"""

    if family.marriage[0] != None and family.marriage[0].date != None:
        record['startDateUser'] = family.marriage[0].date
        record['startDate'] = str(parseDate(family.marriage[0].date)[0])
        record['approxStart'] = str(parseDate(family.marriage[0].date)[1])

            
def addEndDate(filename, family, record):
    """"""

    # TODO: replace try/except with if/else
    for individual in filename.individuals:
        try:
            husbId = family.husband.value
            if individual.get_by_id(husbId).divorce[0].date != None: 
                record['endDateUser'] = individual.get_by_id(husbId).divorce[0].date
                record['endDate'] = str(parseDate(individual.get_by_id(husbId).divorce[0].date)[0])
                record['approxEnd'] = str(parseDate(individual.get_by_id(husbId).divorce[0].date)[1])
                break
        except AttributeError:
            try:
                wifeId = family.wife.value
                if individual.get_by_id(wifeId).divorce[0].date != None:
                    record['endDateUser'] = individual.get_by_id(wifeId).divorce[0].date
                    record['endDate'] = str(parseDate(individual.get_by_id(wifeId).divorce[0].date)[0])
                    record['approxEnd'] = str(parseDate(individual.get_by_id(wifeId).divorce[0].date)[1])
                    break
            except AttributeError:
                pass
            break


def addRelationshipType(record):
    """"""

    record['relationshipType'] = 'Marriage'


def addUserId(record):
    """"""

    record['user_id'] = userId


def checkForMarriage(family):
    if len(family.marriage) > 0 and family.marriage[0] != None:
        return True
    else:
        return False



if __name__ == '__main__':
    main()

