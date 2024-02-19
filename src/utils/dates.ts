import {type DateRange, type Matcher} from 'react-day-picker';
import {areIntervalsOverlapping, type Interval} from 'date-fns';

export function checkIfDateRangeOverlapsMatchers(matchers: Matcher[], range: DateRange) {
    if (!(range.to && range.from)) return false;

    for (const matcher of matchers) {
        let interval: Interval<Date> | undefined = undefined;
        if (typeof matcher === 'boolean') {
            if (matcher) interval = {start: new Date(), end: new Date()};
        } else if (Array.isArray(matcher) && matcher[0] && matcher[1]) {
            interval = {start: matcher[0], end: matcher[1]};
        } else if ('from' in matcher && 'to' in matcher && matcher.from && matcher.to) {
            interval = {start: matcher.from, end: matcher.to};
        }
        if (!interval) continue;
        if (areIntervalsOverlapping(interval, {start: range.from, end: range.to})) return true;
    }
    return false;
}