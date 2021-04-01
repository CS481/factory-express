#!/usr/bin/python3
from argparse import ArgumentParser

import pandas
import pyreadstat

def main():
    """Reads a csv file and outptus an spss .sav file that contains the same data"""
    parser = ArgumentParser(description='Converts some ResponseRecords into an SPSS .sav file')
    parser.add_argument('csv_name', nargs=1, type=str, help='The name of the input file')
    parser.add_argument('output_name', nargs=1, type=str, help='The name of the output file')

    args = parser.parse_args()
    csv_name = args.csv_name[0]
    output_name = args.output_name[0]

    records_df = pandas.read_csv(csv_name, sep='|', engine='c')
    pyreadstat.write_sav(records_df, output_name)

if __name__ == "__main__":
    main()