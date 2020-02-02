import { shallowMount } from '@vue/test-utils'
import App from '@/App.vue'

describe('App.vue', () => {
	it('should mount with the data', () => {
		const wrapper = shallowMount(App)
		expect(wrapper.vm.$data.from).toBe('');
		expect(wrapper.vm.$data.to).toBe('');
		expect(wrapper.vm.$data.selectedProjects).toEqual([]);
		expect(wrapper.vm.$data.selectedZones).toEqual([]);
		expect(wrapper.vm.$data.selectedIntersections).toEqual([]);
		expect(wrapper.vm.$data.selectedDay).toBe('');
		expect(wrapper.vm.$data.speedAverage).toBe(0);
	})

	it('should filters the zones based on projects', () => {
		const wrapper = shallowMount(App)
		let zones: {
			id: number,
			name: string,
			intersections: number[]
		}[] = [
            { 
                "id": 1, 
                "name": "DEFAULT",
                "intersections": [1,2,3,4]
            },
            { 
                "id": 2, 
                "name": "DXB",
                "intersections": [1]
            },
            { 
                "id": 3, 
                "name": "AD",
                "intersections": [2]
            },
            { 
                "id": 4, 
                "name": "RAK",
                "intersections": [2, 3]
            }
        ]
	})
})
