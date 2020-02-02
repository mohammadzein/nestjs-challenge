import { Datetime } from 'vue-datetime'
import { DateTime } from 'luxon'
import Multiselect from 'vue-multiselect'
import axios from 'axios'


export default {
    name: 'app',

    components: {
        Datetime,
        Multiselect
    },

    data () {
        return {
            mounted: false,
            from: '',
            to: '',
            selectedProjects: [],
            projects: [],
            selectedZones: [],
            zones: [],
            selectedIntersections: [],
            intersections: [],
            days: [],
            selectedDay: '',
            speedAverage: 0,
            violations: []
        }
    },

    methods: {
        // get initial data from the server and mount the app
        init () {
            axios.get('/api/violations').then(response => {
                let { projects, zones, intersections, violations, days } = response.data
                this.projects = projects
                this.zones = zones
                this.intersections = intersections
                this.days = days
                this.violations = violations
                this.mounted = true
            })
        },

        resetFilters () {
            this.from = ''
            this.to = ''
            this.selectedProjects = [],
            this.selectedZones = [],
            this.selectedIntersections = [],
            this.selectedDay = ''
        },
        // get filtered zones based on some zones ids
        filterZones (zones, filteredZones) {
            return zones.filter(zone => filteredZones.includes(zone.id))
        },
        // get filtered intersections based on some intersecions ids
        filterIntersections (intersections, filteredIntersections) {
            return intersections.filter(intersection => filteredIntersections.includes(intersection.id))
        },
        // get filtered violations from the server
        getFilteredViolations () {
            let fromTimestamp = ''
            let toTimestamp = ''
            let intersections = this.selectedIntersections.map(intersection => intersection.id);

            if (this.from) {
                fromTimestamp = DateTime.fromISO(this.from).ts
            }

            if (this.to) {
                toTimestamp = DateTime.fromISO(this.to).ts
            }

            let data = {
                fromTimestamp,
                toTimestamp,
                intersections
            }

            axios.post('/api/violations', data).then(response => {
                this.violations = response.data
                this.mounted = true;
            })
        },

        getAverage (sum, count) {
            let average = 0
            if (count > 0) {
                average = (sum / count).toFixed(2)
            }

            return average
        },
        // filter violations per day
        getViolationsPerDay (violations, day) {
            return violations.filter(violation => violation.day == day)
        }
    },

    mounted () {
        this.init()
    },

    watch: {
        // filter zones when selected Prjects value changes
        selectedProjects (newVal) {
            let zones = newVal.map(function (element) {
                return element.zones
            })

            this.selectedZones = this.filterZones(
                this.zones,
                Array.from(
                    new Set(
                        zones.flat()
                    )
                )
            )
        },
        // filter intersections when selected zones changes 
        selectedZones (newVal) {
            let intersections = newVal.map(function (element) {
                return element.intersections
            })

            this.selectedIntersections = this.filterIntersections(
                this.intersections,
                Array.from(
                    new Set(
                        intersections.flat()
                    )
                )
            )
        },
        // get the violations when selected intersections changes
        selectedIntersections (newVal) {
            this.getFilteredViolations(this.from, this.to, newVal);
        },
        // get the violations when from value changes
        from () {
            this.getFilteredViolations()
        },
        // get the violations when to value changes
        to () {
            this.getFilteredViolations()
        },
        // get violations average when selected day value changes
        selectedDay (newVal) {
            let violations = this.getViolationsPerDay(this.violations, newVal)

            let sum = 0
            for (let index = 0; index < violations.length; index++) {
                sum += violations[index].speed
            }

            this.speedAverage = this.getAverage(sum, violations.length)
        },
        //reset selected day when the violations value changes
        violations () {
            this.selectedDay = ''
        }
    }
}