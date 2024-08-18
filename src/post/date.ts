import { postContents } from '@/constants.js';
import { stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { clamp } from '@/utils/clamp.js';

/* Post date can be specified in three ways:
 * - As a shorthand string, '01-01-24 03:41pm'
 * - As a simple object, { date: '01-01-24', time: '03:41pm' }
 * - As null/undefined; in which case, date is inferred from the mtime of 'post.md'. */

export type PostDate =
  | string
  | { date: string; time: string; }
  | null
  | undefined;

const dayRe  = /(\d{1,2})-(\d{1,2})-(\d{2,4})/;
const timeRe = /(\d{1,2})(?:\:(\d{1,2}))?(am|pm)/i;

/* Note: Assumes a schema-validated PostDate value. */
export async function parsePostDate(postFolder: string, input: PostDate): Promise<Date> {
  if (input === null || input === undefined || input === 'auto') {
    return inferPostDate(postFolder);
  }
  const isString = typeof input === 'string';
  const day  = isString ? parseDay(input)  : parseDay(input.date);
  const time = isString ? parseTime(input) : parseTime(input.time);

  if (!day || !time) {
    throw new Error('todo: handle this.');
  }
  return new Date(day.day, day.month - 1, day.year, time.hours, time.minutes);
}

function parseDay(input: string) {
  const dayMatch = dayRe.exec(input);
  if (dayMatch === null) {
    return null; /* todo: return either monad. */
  }
  const month = clamp(Number(dayMatch[1]), 1, 12);
  const day   = clamp(Number(dayMatch[2]), 1, 31);
  const year  = getYear(dayMatch[3]);

  return {
    month: month,
    day:   day,
    year:  year,
  };
}

function getYear(year: string): number {
  return Number(year) + ((year.length === 4) ? 0 : 2000);
}

function parseTime(input: string) {
  const timeMatch = timeRe.exec(input);
  if (timeMatch === null) {
    return null;
  }
  const isPM    = /pm/i.test(timeMatch[3]);
  const hours   = getHour(timeMatch[1], isPM);
  const minutes = Number(timeMatch[2]);

  return {
    hours:   hours,
    minutes: minutes,
  };
}

function getHour(hour: string, isPM: boolean): number {
  const hourNum = Number(hour);
  if (hourNum === 12) {
    return isPM ? 12 : 0;
  }
  return clamp(hourNum + (isPM ? 12 : 0), 0, 23);
}

async function inferPostDate(folder: string): Promise<Date> {
  const postPath = resolve(folder, postContents);
  const stats    = await stat(postPath);
  return stats.mtime;
}
