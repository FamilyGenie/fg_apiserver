import json

def writeToFile(jsonRecords, filename):
    """Write the results of the parsed records to a json file"""
    with open(filename, 'w') as f:
        f.write(jsonRecords)

def recordsToJson(records):
    return json.dumps(records)
