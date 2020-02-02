<template>
  <div id="app">
    <div class="container" v-if="mounted">
      <div class="d-flex flex-wrap justify-content-between">
        <div class="card border-dark mt-3" style="min-width: 475px">
          <div class="card-body">
            <h5 class="font-weight-bold text-left">Filters Panel</h5>
            <div class="d-flex justify-content-between mt-5">
              <label for="from">From:</label>
              <datetime 
                v-model="from" 
                format="yyyy-MM-dd HH:mm"
                type='datetime'
                input-id='from'>
              </datetime>
              <label for="to">To:</label>
              <datetime 
                v-model="to" 
                type='datetime'
                input-id='to'>
              </datetime>
            </div>
            <div class="d-flex mt-4">
              <multiselect 
                v-model="selectedProjects" 
                :options="projects"
                label='name' 
                :multiple="true" 
                :close-on-select="false" 
                :clear-on-select="false" 
                :preserve-search="true" 
                placeholder="Select Project/Projects" 
                track-by="id">
              </multiselect>
            </div>
            <div class="d-flex mt-4">
              <multiselect 
                v-model="selectedZones" 
                :options="zones"
                label='name' 
                :multiple="true" 
                :close-on-select="false" 
                :clear-on-select="false" 
                :preserve-search="true" 
                placeholder="Select Zone/Zones" 
                track-by="id">
              </multiselect>
            </div>
            <div class="d-flex mt-4">
              <multiselect 
                v-model="selectedIntersections" 
                :options="intersections"
                label='name' 
                :multiple="true" 
                :close-on-select="false" 
                :clear-on-select="false" 
                :preserve-search="true" 
                placeholder="Select Intersection/Intersections" 
                track-by="id">
              </multiselect>
            </div>
            <div class="d-flex mt-5">
              <button @click="resetFilters" type="button" class="btn btn-warning">Reset Filters</button>
            </div>
          </div>
        </div>

        <div class="card border-dark mt-3" style="min-width: 475px">
          <div class="card-body">
            <h5 class="font-weight-bold text-left">Violation List</h5>
              <div class="table-wrapper">
                <table class="table table-bordered mt-5">
                  <thead>
                    <tr>
                      <th scope="col">Id</th>
                      <th scope="col">Violation Time</th>
                      <th scope="col">Violation Speed</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="violation in violations" :key="violation.id">
                      <th scope="row">{{ violation.id }}</th>
                      <td>{{ violation.time }}</td>
                      <td>{{ violation.speed }}</td>
                    </tr>

                  </tbody>
                </table>
              </div>
              <p class="font-weight-bold text-left">Total Violations {{ violations.length }}</p>
              <div class="d-flex mt-4">
                <multiselect 
                  v-model="selectedDay" 
                  :options="days"
                  :close-on-select="false" 
                  :clear-on-select="false" 
                  :preserve-search="true" 
                  placeholder="Select Day">
                </multiselect>
                <p>Average Speed {{speedAverage}} Km/H</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.table-wrapper {
  height: 300px;
  overflow-y: auto;
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style src="vue-datetime/dist/vue-datetime.css"></style>
