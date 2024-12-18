import { AlpacaConfig } from '@/config/alpaca-config';
import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import { tryStat } from '@/safe/io';
import { clamp } from '@/utils/clamp';

/* Post date should be a string of form: '01-01-24 03:41pm'
 * When post date is undefined/null date is inferred from the mtime of 'post.md'. */

type Day = {
  month: number;
  day:   number;
  year:  number;
};

type Time = {
  hours:   number;
  minutes: number;
};

const dayRe  = /\b(\d{1,2})[-\/](\d{1,2})[-\/](\d{2,4})\b/;
const timeRe = /\b(\d{1,2})\:(\d{1,2})(am|pm)\b/i;

/* Note: Assumes a schema-validated date value: string, null or undefined. */
export async function getPostDate(
  config: AlpacaConfig,
  folder: string,
  input: string | null| undefined
): Promise<Either<string, Date>> {
  if (input === null || input === undefined || input === 'auto') {
    if (config['never-infer-date']) {
      return either.left<string, Date>(
        `Couldn't get post date from "${folder}": Post date cannot be inferred!`
      );
    }
    return inferPostDate(folder);
  }
  return parsePostDate(input);
}

/* A pure function; never does IO, unlike getPostDate(). */
export function parsePostDate(input: string): Either<string, Date> {
  return either.bind(
    parseDay(input),
    day => either.bind(
      parseTime(input),
      time => createDate(day, time)
    )
  );
}

function parseDay(input: string): Either<string, Day> {
  const dayMatch = dayRe.exec(input);
  if (dayMatch === null) {
    return either.left(`Couldn't parse day from string "${input}"!`);
  }
  const month = clamp(Number(dayMatch[1]), 1, 12);
  const day   = clamp(Number(dayMatch[2]), 1, 31);
  const year  = getYear(dayMatch[3]);

  return either.right({
    month: month,
    day:   day,
    year:  year,
  });
}

function parseTime(input: string): Either<string, Time> {
  const timeMatch = timeRe.exec(input);
  if (timeMatch === null) {
    return either.left(`Couldn't parse time from string "${input}"!`);
  }
  const isPM    = /pm/i.test(timeMatch[3]);
  const hours   = getHour(timeMatch[1], isPM);
  const minutes = Number(timeMatch[2]);

  return either.right({
    hours:   hours,
    minutes: minutes,
  });
}

async function inferPostDate(path: string): Promise<Either<string, Date>> {
  const stats = await tryStat(path);
  return either.fmap(s => s.mtime, stats);
}

function createDate({ day, month, year }: Day, { hours, minutes }: Time): Either<string, Date> {
  return either.right(new Date(year, day, month - 1, hours, minutes));
}

function getYear(year: string): number {
  return Number(year) + ((year.length === 4) ? 0 : 2000);
}

function getHour(hour: string, isPM: boolean): number {
  const hourNum = Number(hour);
  if (hourNum === 12) {
    return isPM ? 12 : 0;
  }
  return clamp(hourNum + (isPM ? 12 : 0), 0, 23);
}

export function isValidDate(input: string): boolean {
  return !!input && dayRe.test(input) && timeRe.test(input);
}
