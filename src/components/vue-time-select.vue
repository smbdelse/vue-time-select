<template>
  <div ref="wrapper" class="vts_wrapper" @mousemove="onMouseMove">  
    <input type="hidden" :value="value" :name="name">
    <div class="vts_panel">
      <div class="vts_pointer vts_pointer--bg" :style="selectorPos"></div>
    </div>
    <ul ref="ribbon" :style="scroll" class="vts_ribbon" tabindex="0" @keyup="handleKeyboard($event)" @keydown="handleKeyboard($event)">
      <li v-for="t in hours" :key="'step'+t.value" :ref="'step'+t.value" :class="stepState(t.value)" class="vts_value" @click="(t.value < minValue || t.value > maxValue) ? null : $emit('input', t.value)">
        {{t.display}}
      </li>
    </ul>
    <div class="vts_panel">
      <div class="vts_pointer" @touchmove="onPan" @mousedown="onPan" :style="selectorPos"></div>
    </div>
  </div>
</template>

<script>
export default {
name: 'time-select',
    props: {
      name: String,
      value:  Number,
      maxValue: {
        default: 86400,
        type: Number
      }, // max value that's available to set (in seconds)
      minValue: {
        default: 0,
        type: Number
      }, // minimum value that's available to set (in seconds)
    },
    data(){
      return {
        scroll: '', // how far (in pixels) should the stripe with hours be moved according to the current value
        selectorPos: '', // how far to move touch/drag indicator
        currentKeyFlag: '', // stores keypressEvent.key value for keypress action
        stepValue: 1800,
        moving: false,        
        timeModifier: 1
      }
    },
    watch:{
      value(){
        this.calculateScroll()
      }
    },
    created() {
      this.throttle = function (fn, immediate=true) {
        var wait = false;                 
        return function () {
          var args = arguments
          var that = this

          if (!wait) {                  
            if(immediate){fn.apply(that, args)}          
            wait = true;              
            setTimeout(function () { 
              wait = false;  
              if(!immediate){fn.apply(that, args)}               
            }, arguments[arguments.length-1]);
          }
        }
      }
      this.accelerate = this.throttle((stepValue,delay)=>{
        if (this.moving) { 
          let isMax = this.isMax(stepValue)
          if(!isMax) {
            this.alterValue(stepValue)                                    
          }          
          let newDelay = delay - (delay * this.timeModifier * 1.5) + 60
          this.accelerate(this.stepValue, newDelay);
        }
      }, false);
    },
    methods:{
      onMouseMove(event) {
        if (this.moving && this.moving != "keydown") {
          this.onPan(event)
        }
      },     
      onPan(event) {           
        let vm = this,
            dragArea = vm.$refs.wrapper.getBoundingClientRect(),
            dragMax = (dragArea.right - dragArea.left) / 2, 
            clientX = event.type == "touchmove" ? event.touches[0].clientX : event.clientX,         
            delta = (clientX - dragArea.left - dragMax),
            dragLength = Math.abs(delta) >= dragMax ? (delta / Math.abs(delta)) * dragMax : delta

        vm.stepValue = (dragLength / Math.abs(dragLength)) * 1800         
        vm.timeModifier = Math.abs(dragLength) / dragMax         
        vm.calculateSelectorPos(dragLength * 2)

        if (event.type == "mousedown" || (Math.abs(dragLength)/dragMax > .2 && !vm.moving)){
          vm.moving = true
          vm.alterValue(vm.stepValue)
          vm.accelerate(vm.stepValue, 400);          
        } 
      },
      
      // keyboard support
      handleKeyboard(event){
        let vm = this        
        switch (true) {
          case (event.key == "ArrowRight" && event.type == "keydown"):
          case (event.key == "ArrowLeft" && event.type == "keydown"):
            vm.stepValue = (event.key == "ArrowLeft" ? -1 : 1) * 1800
            if (!vm.moving) {
             vm.moving = 'keydown'
             vm.timeModifier = 0.5
             vm.alterValue(vm.stepValue)
             vm.accelerate(vm.stepValue, 400);
            }            
            break;
          case (event.key == "ArrowRight" && event.type == "keyup"):
          case (event.key == "ArrowLeft" && event.type == "keyup"):
            vm.resetActions()
            break;
        }
      },
      
      isMax(val){
        let vm = this,
        state = vm.value
        return (state + val < vm.minValue || state + val > vm.maxValue )
      },
      
        
      alterValue(val){ // adding/subtracting main value of component
        let vm = this,
            state = vm.value
        
        if (!vm.isMax(val)) {
          vm.$emit('input', state + val)
        }                
      },      
      
      resetActions () { // reset of values run when actions are finished
        this.timeModifier = 0
        this.moving = false
        this.calculateSelectorPos(0)
      },
      
      // view-related stuff: how to render active/inactive lements, and set their position
      stepState(val){ //look of active/inactive steps
        let toReturn = ''
        if (val == this.value){
          toReturn = 'vts_value--active'
        } else if (val > this.maxValue || val < this.minValue) {
          toReturn = 'vts_value--inactive'
        }
        
        return toReturn
      },
      calculateSelectorPos(v) {       
        this.selectorPos = {'margin-left': v + 'px'}
      },     
      
      calculateScroll() { // calculating ribbon position
        let margin = 0,
            wrapper = this.$refs.wrapper,
            ribbon = this.$refs.ribbon
  
        if (ribbon && wrapper) {        
          margin = - (ribbon.firstChild.scrollWidth * 49 * this.value / 88200) + ((wrapper.getBoundingClientRect().right - wrapper.getBoundingClientRect().left) / 2) - ribbon.firstChild.scrollWidth / 2
        }             
        this.scroll = {'margin-left': margin + 'px'}
      },
    },
    computed: {      
      hours(){ // Setting list of available hours. It propably could've been done in 10+ other different ways, this is what I came up with at first
        let current = 0,
            hours = []        
        while (current < 49) {
          let halfies = current/2,
              hour = ('0' + Math.floor(halfies)).substr(-2),
              minutes = ('0' + (halfies - Math.floor(halfies)) * 60).substr(-2) 
          hours.push( {
            value: halfies*60*60,
            display: hour + ':' + minutes 
          } )
          current++
        }
        return hours
      }
    },
    mounted(){
      let vm = this
      vm.$nextTick(()=>{
        vm.calculateScroll()        
        window.addEventListener('resize', ()=>{this.calculateScroll()}); 
        window.addEventListener('mouseup', ()=>{this.resetActions()}); 
        window.addEventListener('touchend', ()=>{this.resetActions()}); 
      })
    },
}
</script>

<style>
.vts_wrapper {
    background-color: #e2e8f0;
    position: relative;
    overflow: hidden;
    box-shadow: inset 0 2px 4px 0 rgba(0,0,0,.06);
    font-family: sans-serif;
}
.vts_panel {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    overflow: visible;
}
.vts_pointer {
    width: 4rem;
    height: 4rem;
    border-radius: 9999px;
    pointer-events: auto;
    flex-shrink: 0;        
}
.vts_pointer--bg {
  background-color: #cbd5e0;
}
.vts_ribbon {
    transition-duration: .3s;
    position: relative;
    user-select: none;
    list-style: none;
    display: flex;
    margin: 0;
    padding: 0;
}
.vts_value {
    width: 4rem;
    height: 5rem;
    flex-shrink: 0;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #718096;
}
.vts_value--inactive {
  color: #cbd5e0;
}
.vts_value--active {
  font-weight: 700;
  color: #1a202c;
}
</style>
