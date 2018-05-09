import * as yargs from "yargs";
import fs from "fs";
import {drip} from "./client";

const args = yargs
    .option('token', {
        alias: 't',
        desc: 'The user token. QRs will be dripped to this user.',
        requiresArg: true,
        string: true,
        demandOption: true
    })
    .option('message', {
        alias: 'm',
        desc: 'The message to drip. Will be dripped line by line. Use @file to include a file.',
        requiresArg: true,
        string: true,
        demandOption: true,
        coerce: (a) => {
            if (typeof a === 'string' && a[0] === '@') {
                const file = a.substring(1);
                if (!fs.existsSync(file)) {
                    throw new Error(`File ${file} does not exist.`);
                }
                return fs.readFileSync(file, 'utf8');
            }
            return a;
        }
    })
    .option('interval', {
        alias: 'i',
        desc: 'The interval between drips, in minutes. Defaults to 4 hours.',
        requiresArg: true,
        number: true,
        default: 4 * 60
    })
    .option('instant', {
        desc: 'Debug option. Instantly fires the first message, then exits.'
    })
    .argv;

drip(args.token, args.message, args.interval, args.instant);
