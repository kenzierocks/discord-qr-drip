#!/usr/bin/env node
import Discord, {Guild, GuildMember, Message, Snowflake} from "discord.js";
import * as qr from "qr-image";

const client = new Discord.Client();

function die(msg: string, error: any, code: number = 1) {
    console.error(msg, error || '');
    process.exit(code);
}

function createQr(message: string) {
    return qr.imageSync(message, {type: 'png', ec_level: 'L'});
}

const MILLIS_PER_MINUTE = 60 * 1000;

function* cycle<T>(array: T[]): IterableIterator<T> {
    while (true) {
        for (const x of array) {
            yield x;
        }
    }
}

export function drip(token: string, message: string, interval: number, instant: boolean = false) {
    const messageParts = cycle(message.split(/\r\n|\n/g));

    function dripPart() {
        const part = messageParts.next().value;
        const qr = createQr(part);
        return client.user.setAvatar(qr)
            .then(() => console.log(`Message part sent: '${part}'.`))
            .catch(err => console.error(`Message part dropped: '${part}'.`, err));
    }

    client.on('ready', () => {
        console.log('I am ready!');

        if (instant) {
            dripPart().then(() => {
                throw die("Instantly completed.", null, 0);
            });
        }

        function intervalPromise() {
            setTimeout(() => {
                dripPart().then(intervalPromise)
            }, interval * MILLIS_PER_MINUTE);
        }
        intervalPromise();
    });

    client.login(token)
        .catch(e => die('log-in error!', e));
}
