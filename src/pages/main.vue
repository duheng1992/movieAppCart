<template>
<div>
   <transition name="slide" mode="out-in">
  		<keep-alive>
   			<router-view></router-view>	 
   		</keep-alive>
		
   </transition>
   <foot-nav></foot-nav>
</div>
</template>

<script>

import footNav from 'components/foot-nav.vue'

export default {
   components:{
        footNav
   }
}
</script>

<style scoped lang="scss">
   
</style>
