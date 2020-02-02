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

        filterZones (zones) {
            this.selectedZones = this.zones.filter(zone => zones.includes(zone.id))
        },

        filterIntersections (intersections) {
            this.selectedIntersections = this.intersections.filter( intersection => intersections.includes(intersection.id))
        },

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
        }
    },

    mounted () {
        this.init()
    },

    watch: {
        selectedProjects (newVal) {
            let zones = newVal.map(function (element) {
                return element.zones
            })

            this.filterZones(
                Array.from(
                    new Set(
                        zones.flat()
                    )
                )
            )
        },

        selectedZones (newVal) {
            let intersections = newVal.map(function (element) {
                return element.intersections
            })

            this.filterIntersections(
                Array.from(
                    new Set(
                        intersections.flat()
                    )
                )
            )
        },

        selectedIntersections (newVal) {
            this.getFilteredViolations(this.from, this.to, newVal);
        },

        from () {
            this.getFilteredViolations()
        },

        to () {
            this.getFilteredViolations()
        },

        selectedDay (newVal) {
            let violations = this.violations.filter(violation => violation.day == newVal)

            let sum = 0
            for (let index = 0; index < violations.length; index++) {
                sum += violations[index].speed
            }

            if (violations.length > 0) {
                this.speedAverage =  (sum / violations.length).toFixed(2)
            } else {
                this.speedAverage = 0
            }
        },

        violations () {
            this.selectedDay = ''
        }
    }
}