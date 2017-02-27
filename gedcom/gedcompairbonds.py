#!/usr/bin/python
# v. 0.2
# gedcomParsePairBonds
"""
Parse a gedcom file into JSON for relationships between spouse
"""

# import requirements
import gedcom # don't forget to build/install
import sys
import re
from datetime import datetime
from parsedate import *

argIn = sys.argv[1]
argOut = sys.argv[2]
userId = sys.argv[3]

def main():

    gedfile = gedcom.parse(argIn)
    writeToJSONfile(gedfile)

    #  getPartners(gedfile)
    #  getMarriageDate(gedfile)
    #  parseOutApprox(gedfile)
    #  parseTime(gedfile)
    #  print makeLength(gedfile)
    #  makeJSONobject(gedfile)

"""''''''''''''''''''''''''''''''''''''''''''''''''''''''"""
####################################################
# TODO: docs
#       Tests
####################################################
"""''''''''''''''''''''''''''''''''''''''''''''''''''''''"""

def makeMarriageRecords(filename):
    """
    Loop throgh the file and create records for each marriage, based on the family information provided

    Create a JSON style record for each record that exists in the gedcom file.
    """

    marriageRecords = []

    for family in filename.families:
        buildRecord = ''

        try:
            buildRecord += '"personOne_id" : "' + family.husband.value + '",\n'
        except AttributeError:
            pass

        try:
            buildRecord += '"personTwo_id" : "' + family.wife.value + '",\n'
        except AttributeError:
            pass

        buildRecord += '"relationshipType" : "Marriage",\n'

        try:
            buildRecord += '"startDate" : "' + str(parseDate(family.marriage[0].date)[0]) + '",\n'
        except IndexError:
            pass

        try:
            buildRecord += '"approxStart": "' + str(parseDate(family.marriage[0].date)[1]) + '",\n'
        except IndexError:
            pass

        try:
            # the divorce record is a part of the individual record and not the family record, so we will have to find the people involved and use their record to get the endDate of the marriage
            for individual in filename.individuals:
                try:
                    husbId = family.husband.value
                    buildRecord += '"endDate" : "' + parseDate(individual.get_by_id(husbId).divorce[0].date)[0] + '",\n'
                    buildRecord += '"approxEnd" : "' + parseDate(individual.get_by_id(husbId).divorce[0].date)[1] + '",\n'
                    break
                except AttributeError:
                    try:
                        wifeId = family.wife.value
                        buildRecord += '"endDate" : "' + parseDate(individual.get_by_id(wifeId).divorce[0].date)[0]
                        buildRecord += '"approxEnd" : "' + parseDate(individual.get_by_id(wifeId).divorce[0].date)[1] + '",\n'
                        break
                    except AttributeError:
                        buildRecord += '"endDate" : null,\n'
                        break

            buildRecord += '"user_id" : "' + userId + '"\n'

            marriageRecords.append(buildRecord)

        except AttributeError:
            pass

    return marriageRecords

def makeLength(filename):
    length = []
    for i in filename.families:
        length.append(i)
    return length

def makeJSONobject(filename):

    mRecords = makeMarriageRecords(filename)

    json = ''
    json += '[ \n'
    for i in range(len(mRecords)):
        json += '{ \n'
        json += mRecords[i]
        if i == (len(mRecords) -1):
            json += '}\n'
        else:
            json += '},\n'
    json += ']'
    return json

def writeToJSONfile(filename):
    json = makeJSONobject(filename)
    f = open(argOut, "w")
    f.write(json)
    f.close()

if __name__ == "__main__":
    main()
