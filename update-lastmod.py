#!/usr/bin/env python3

"""Update lastmod in YAML frontmatter of a Hugo markdown file.

TODO: Use watchdog and also watch for file changes.
"""


import argparse
import sys
import fileinput
from datetime import datetime
from dateutil import tz


def get_local_isotime():
    """Return a string with the ISO-formatted local time with timezone info."""
    fmt = "%Y-%m-%dT%H:%M:%S"
    offset = datetime.now(tz.tzlocal()).strftime("%z")
    offset = offset[:3] + ":" + offset[3:]
    return datetime.now(tz.tzlocal()).strftime(fmt) + offset


def get_new_lastmod(timestr):
    """Return a new lastmod string given a time as a string."""
    return "lastmod: " + timestr + "\n"

def output(outputstr, buffer):
    """Cache outputstr to buffer (append)."""
    buffer.append(outputstr)


def update_lastmod(filepath):
    """Replace the lastmod YAML property with a current one.

    If no lastmod property is found, one is added to the end of the
    YAML frontmatter block."""

    global verbose, debug, dryrun, output_filename

    new_lastmod = get_new_lastmod(get_local_isotime())
    in_yaml = False
    lastmod_found = False
    filename = None
    output_buffer = []
    
    with fileinput.input(files=filepath) as f_input:
        for line in f_input:

            # save filename if not reading from stdin
            if filename == None:
                if not fileinput.isstdin():
                    filename = fileinput.filename()
                    if verbose or debug:
                        sys.stderr.write("Reading from file: '" + filename + "' ")
                else:
                    if verbose or debug:
                        sys.stderr.write("Reading from stdin: ")
                    filename = False
                if debug:
                    sys.stderr.write("\n")

            if debug:
                sys.stderr.write("DEBUG: " + repr(line) + "\n")
            elif verbose:
                sys.stderr.write(".")

            # start/end of YAML block detected
            # in_yaml == None at beginning, True if we are inside a YAML
            # block. set in_yaml to False when we exit the YAML block. 
            # if at end of YAML block and no lastmod was modified, we insert
            # a lastmod before the end of the to YAML block
            if line.startswith("---"):
                if in_yaml:
                    in_yaml = False
                    if not lastmod_found:
                        output(new_lastmod, output_buffer)
                else:
                    in_yaml = True

            # change an existing lastmod line, don't pass original line
            elif in_yaml and line.startswith("lastmod"):
                lastmod_found = True
                output(new_lastmod, output_buffer)
                continue

            # pass original line
            output(line, output_buffer)


    # if a file was modified. i.e. filename is a string, not False/None
    if filename and verbose:
        sys.stderr.write("\nRead " + str(len(output_buffer)) + " lines from file '" + filename + "'.\n")
    elif verbose:
        sys.stderr.write("\nRead " + str(len(output_buffer)) + " lines from stdin.\n")

    # if no filename was recieved via the flags -o or --output
    # filename will be False is we are reading from stdin
    if output_filename == "":
        output_filename = filename

    # declared for future use. will remain None, or be either a file or stdout
    save_file = None

    # output_filename found
    if output_filename:
        # got an output_filename but dryrun
        if dryrun:
            if verbose:
                sys.stderr.write("Dryrun: Not writing to '" + output_filename + "'\n")
            # no save_file needs to be opened
            save_file = None
        # not a dryrun, so we open the file to save to
        else:
            if verbose:
                sys.stderr.write("Saving to '" + output_filename + "\n")
            save_file = open(output_filename, 'w')
    # file to save to, so we output to stdout
    else:
        save_file = sys.stdout

    if not dryrun:
        for line in output_buffer:
            save_file.write(line)
        if not (save_file is sys.stdout):
            save_file.close()


# run if called from the command line
if __name__ == '__main__':

    parser = argparse.ArgumentParser(prog="update-lastmod.py",
                                     description=
"""Updates the lastmod YAML frontmatter property of a .md file.""")

    # Add the positional option only if we are not reading from stdin
    # ... a hack, I know.
    parser.add_argument('filepath',
                        default="-",
                        nargs='?',
                        help='file to process, will use stdin if not supplied')
    parser.add_argument('-v', '--verbose',
                        action='store_true',
                        dest='verbose',
                        help='verbose output')
    parser.add_argument('-n', '--dryrun',
                        action='store_true',
                        dest='dryrun', 
                        help="don't modify any files")
    parser.add_argument('-d', '--debug', 
                        action='store_true', 
                        dest='debug', 
                        help='output debug info')
    parser.add_argument('-o', '--output',
                        nargs=1,
                        metavar='<file>',
                        default=[''],
                        dest="output_filename",
                        help='file to write output to. defaults to input file or stdout'
                        )
    parser.add_argument('-w', '--watch', 
                        dest='watch_dir',
                        metavar='<dir>',
                        help='watch directory for changes. NOT yet implemented!')

    args = parser.parse_args()

    if args.debug:
        sys.stderr.write(repr(args) + "\n")

    debug = args.debug
    verbose = args.verbose
    dryrun = args.dryrun
    output_filename = args.output_filename[0]

    try:
        update_lastmod(args.filepath)
    except FileNotFoundError:
        sys.stderr.write("Could not find file: '" + args.filepath + "'. Please specify a filepath before options use with stdin.\n")
    except KeyboardInterrupt:
        sys.stderr.write("\nctrl-c recieved.\n")