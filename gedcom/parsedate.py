#!/usr/bin/python
# v 0.1

""" See parseDate for details"""

from datetime import datetime
import re, sys, os

def main ():
    pass

def parseDate(date):
    """
    This will be the most commonly used function, which takes in a single date and then returns it formatted as ISO time
    """
    return formatToISO(formatDateString(date))

def formatDateString(dateString):

    """
    Format the input dateString from wildly varying user input softly into paresable formats
    """
    approx = re.compile('abt\.? |bet\.? |bef\.? |before |about |early |(?<=\d)s|\?|\.', re.IGNORECASE) # common approxomation strings to be entirely removed
    sept = re.compile('sept', re.IGNORECASE) # 'sept' is commonly used as a abbrev for the month, datetime only handles 'sep'
    split = re.compile('([A-Za-z]+)(\d+)', re.IGNORECASE) # not enough spacing between numbers and letters
    spacing = re.compile('\s+|([A-Za-z]+)(\d+)') # extra spacing causes problems in formatting ex '28     June1995' -> '28 June 1995'
    comma = re.compile('\s+,\s|(?<=\d),(?=\d)') # weird comma spacing is annoying too.

    # newDate = split.sub(' ', comma.sub(', ', spacing.sub(' ', sept.sub('sep', approx.sub('', dateString))))).split() # yay chaining... actually no that looks like lisp

    step1 = approx.sub('', dateString)
    step2 = sept.sub('sep', step1)
    step3 = spacing.sub(' ', step2)
    step4 = comma.sub(', ', step3)
    step5 = split.sub(' ', step4)
    step6 = step5.strip()
    newDate = step6

    return newDate

def formatToISO(date):
    """
    formats timestamps into ISO time

    DATE FORMATTING KEY
    %y = two digit year : 97 | 78 | 65
    %Y = four digit year : 1997 | 1978 | 1842
    %m = one/two digit month : 01 | 3 | 11
    %b = (three letter) abbreviated month : Jan | feb | Dec
    %B = full month name : January | February | march
    %d = one/two digit day : 23 | 02 | 31

    %Y-%m-%d = 1995-06-28
    %m/%y/%d = 06/95/28
    %d %b %Y = 28 Jun 1995

    '\xe2\x80\x93' is a dash character (all 3 hex together represents a dash -- the full string)
    """

    dateFormat = ['%Y-%m-%d', '%m/%d/%Y', '%m-%d-%Y', '%d-%m-%Y', '%d/%m/%Y', '%m %d %Y', '%d, %b %Y', '%d %B %Y', '%d %b %Y', '%d %B, %Y', '%b %d, %Y', '%B %d, %Y', '%B %d %Y', '%b %d %Y', '%Y, %b %d', '%Y %m %d', '%Y-%m', '%B %Y', '%b %Y', '%m/%Y', '%b / %Y', '%b/%Y', '%Y']
    years = re.compile('^\d{4} \d{4} \d{4} .+') # for more than 2 years sequentially 1997 1998 1999 ...
    commayrs = re.compile('^\d{4}, \d{4}') # for years separated by a comma 1998, 1999
    dashyrs = re.compile('^\d{4}-\d{4}') # for years separated by a dash # 1998-1999
    ISODate = ''

    if '\xe2\x80\x93' in date or dashyrs.match(date) or commayrs.match(date):
        date1 = int(date[:4])
        date2 = int(date[-4:])
        avgDate = (date1+date2)/2
        ISODate = (str(datetime.strptime(str(avgDate), '%Y')), 'year')
        return ISODate

    elif years.match(date):
        ISODate = (str(datetime.strptime(str(rd[:4]), '%Y')), 'year')
        return ISODate

    else:
        j = 0
        for df in dateFormat:
            try:
                if df == '%Y':
                    ISODate = (str(datetime.strptime(date,df)), 'year')
                    break
                elif ( (df == '%B %Y') or (df == '%b %Y') or (df == '%m/%Y') ):
                    ISODate = (str(datetime.strptime(date,df)), 'month')
                else:
                    ISODate = (str(datetime.strptime(date, df)), 'exact')
                    break
            except ValueError:
                j += 1
                pass
        if j > len(dateFormat) - 1:
            print Exception, "Input Date Format Unknown: " + date
            ISODate = ('', '')
            pass
        return ISODate


if __name__ == "__main__":
    main()
