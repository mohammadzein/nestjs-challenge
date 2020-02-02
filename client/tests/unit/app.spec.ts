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
})
