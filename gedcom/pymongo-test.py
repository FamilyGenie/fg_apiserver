import pymongo
from pymongo import Connection

mon_con = Connection('localhost', 27017)
mon_db = mon_con.dh

cols = mon_db.collection_names()
for c in cols:
    print c
col = raw_input('Input a collection from the list above to show its field names: ')

collection = mon_db[col].find()

keylist = []
for item in collection:
    for key in item.keys():
        if key not in keylist:
            keylist.append(key)
        if isinstance(item[key], dict):
            for subkey in item[key]:
                subkey_annotated = key + "." + subkey
                if subkey_annotated not in keylist:
                    keylist.append(subkey_annotated)
                    if isinstance(item[key][subkey], dict):
                        for subkey2 in item[subkey]:
                            subkey2_annotated = subkey_annotated + "." + subkey2
                            if subkey2_annotated not in keylist:
                                keylist.append(subkey2_annotated)
        if isinstance(item[key], list):
            for l in item[key]:
                if isinstance(l, dict):
                    for lkey in l.keys():
                        lkey_annotated = key + ".[" + lkey + "]"
                        if lkey_annotated not in keylist:
                            keylist.append(lkey_annotated)
keylist.sort()
for key in keylist:
    keycnt = mon_db[col].find({key:{'$exists':1}}).count()
    print "%-5d\t%s" % (keycnt, key)
