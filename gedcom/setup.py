from setuptools import setup
from sys import platform
setup(
        name='Gedcom To Json',
        version='0.5',
        description='Parse a gedcom file into json for specific use with FamilyGenie',
        url='https://github.com/KingEdwardI/GedcomToJson',
        author='Edward Vetter-Drake',
        author_email='edward.vetterdrake@gmail.com',
        install_requires=[
            'pytest',
            'gedcompy',
            'six'
            ],
        zip_safe=True,
        )
