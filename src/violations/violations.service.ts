import { Injectable } from '@nestjs/common';
import { parse } from 'querystring';
let data = require('../../data/data.json');
let fs = require('fs');
var { DateTime } = require('luxon');

@Injectable()
export class ViolationsService {
    init(): Promise<any> {
        let [projects, zones, intersections, violations] = data
        let initialData = {
            projects: projects.projects,
            zones: zones.zones,
            intersections: intersections.intersections,
            violations: violations.violations,
            days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        }
        return new Promise(resolve => {
            resolve( initialData );
        });
    }

    filtered (filters: {
        fromTimestamp: number, 
        toTimestamp: number, 
        intersections: number[]
    }): Promise<any>{
        let violations = this.getViolations()
        let filteredViolations = this.filterViolations(violations, filters)
        
        return new Promise(resolve => {
            resolve( filteredViolations );
        });
    }

    getViolations (): { 
        id: number,
        time: string,
        speed: number,
        intersection: number,
        key: number,
        day: string,
    }[] {
        let [,,, violations] = data
        violations = violations.violations
        
        let parsedViolations = []
        for (let index = 0; index < violations.length; index++) {
            const violation = violations[index]

            let dateTime = this.fixDateTime(violation.time)
            let timeParsed = this.parseDate(dateTime)

            if (!timeParsed.invalid) {
                parsedViolations.push({
                    id: violation.id,
                    time: dateTime,
                    speed: violation.speed,
                    intersection: violation.intersection,
                    key: timeParsed.ts,
                    day: timeParsed.weekdayLong
                })
            }

        }

        return parsedViolations
    }

    filterViolations (violations: { key: number, intersection: number }[],
        filters: {
            fromTimestamp: number, 
            toTimestamp: number, 
            intersections: number[]
    }) {
        if (filters.intersections.length) {
            violations = violations.filter(violation => filters.intersections.includes(violation.intersection))
        }

        if (filters.fromTimestamp) {
            violations = violations.filter(violation => filters.fromTimestamp <= violation.key)
        }

        if (filters.toTimestamp) {
            violations = violations.filter(violation => filters.toTimestamp >= violation.key)
        }

        return violations
    }

    parseDate (date: string): {invalid: object | null, ts: number, weekdayLong: string} {
        return DateTime.fromFormat(date, 'yyyy-MM-d HH:mm:ss')
    }

    fixDateTime (dateTime: string): string {
        let dateTimeArr = dateTime.split(' ')
        let date = dateTimeArr[0].split('-')
        let days = (+date[date.length - 1]) + 1

        date[date.length -1 ] = days.toString()
        return date.join('-').concat(' ',dateTimeArr[1])
    }
}
