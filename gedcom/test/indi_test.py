import pytest
from indiparse import *

# read in gedcom file

def test_makeRecords():
    pass

def test_makePersonRecord():
    pass

def test_addNameToRecord():
    record = {}
    person = {'name': ('John', 'Doe')}
    addNameToRecord(person, record)
    assert record == {'fName' : 'John', 'lName' : 'Doe'}

def test_addSexToRecord():
    pass

def test_addBirthToRecord():
    pass

def test_addDeathToRecord():
    pass

def test_addIdsToRecord():
    pass

