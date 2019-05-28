
# About

Vue-time-select is a component for easy time selecting, especially on touch screens, with keyboard support.


# Demo

You can check working example on CodePen: [https://codepen.io/pen/oRPvoX](https://codepen.io/KamilDyrek/pen/oRPvoX)


# Installation
 
To install package run:  
```
npm i vue-time-select
```  

You can also use it as plugin directly in browser  
```
<script src="https://unpkg.com/vue-time-select/dist/vueTimeSelect.umd.min.js"></script>
```


# Usage

Declare component globally in your main.js file:

```
import timeSelect from "./components/vue-time-select.vue";

Vue.component('time-select', timeSelect)
```

Or in your vue component:
```
import timeSelect from "./components/vue-time-select.vue";

export  default {
	...
	components: {
		'time-select': timeSelect
	}
}
```

Then in your template:
```
<time-select v-model="time"></time-select>
```

Also, there are optional max-value and min-value props (set in seconds):
```
<time-select v-model="timeFrom" :max-value="timeTo"></time-select>
<time-select v-model="timeTo" :min-value="timeFrom"></time-select>
```

I hope you'll build something great with it! :)