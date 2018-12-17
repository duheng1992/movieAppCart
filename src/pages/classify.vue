<template>
<div>
   <transition name="slide" mode="out-in">
	   	<div id="wrapper" ref="scrollWrap">
	       <div class="scroller" ref="scroller">
	       		<!-- <div class="goback" key="1"><div class="iconfont icon-back back" @click="$router.back()"></div></div>
	    		<div class="blank" key="2"></div> -->
	      		<ul ref="scrollList">
		  			<router-link class="film-list" v-for="(v,i) in goodsList" :key="v.id" tag="li" :to='{path:"/film-detail/"+v.id}'>
			    		<div class="film-list__img">
		   			   		 <img v-lazy="v.images.small" alt="" />                
			    		</div>
			    		<div class="film-list__detail">
			    			<p class="film-list__detail__title">{{v.title}}</p>
		              		<p class="film-list__detail__director">导演：{{filterDirectors(v.directors)}}</p>
			    			<p class="film-list__detail__year">年份：{{v.year}}<span>{{v.stock}}</span></p>
			    			<p class="film-list__detail__type">类别：{{v.genres.join(" / ")}}<span></span></p>
			    			<p class="film-list__detail__rank">评分：<span>{{v.rating.average}}分</span></p>
			    		</div>    			    		
		  			</router-link>
	      		</ul>
	        </div>
	        <div :name="loadingPosition">
	        	<Loading id="loading"
	        		 v-show="showLoading"
	         		 :class='{pullDownLoading,pullUpLoading,center}'
	         		 ref="loading"
	         		 :loadingWord="loadingWord"
	       		></Loading>	     
	        </div>           
			<foot-nav></foot-nav>
	    </div>
   </transition>
   
</div>
</template>

<script>

import footNav from 'components/foot-nav.vue'
import BScroll from 'better-scroll'
import {getStyle,getDeviceRatio} from '../base/js/util.js'
import {queryMovieByClass} from "../ajax/index.js"
import Loading from 'components/loading.vue'

/*获取当前缩放比*/
const DEVICE_RATIO=getDeviceRatio();

/**
 * 
 * @param threshold 触发事件的阀值，即滑动多少距离触发
 * @param stop 下拉刷新后回滚
 */

 /*下拉配置*/
const DOWN_CONFIG={
	threshold:80*DEVICE_RATIO,
	stop:40*DEVICE_RATIO
}
/*上拉配置*/
const UP_CONFIG={
	threshold:-80*DEVICE_RATIO,
}


export default {
	name:"classify",
    data(){
   		return{
   			type:this.$route.params.type,
   			goodsList:[],
   			scroller:null,
   			center:true,
   			pullDownLoading:false,
   			pullUpLoading:false,
   			showLoading:false,					  			
   			currentPage:0,  
   			loadingWord:"正在加载",
   			loadingPosition:""	,
   			noMoreData:false	
   		}
   },
   components:{
   		Loading,
   		footNav
   },

   mounted(){ 
   		//获取本页面所有ref属性的元素
		const {scroller,scrollWrap,scrollList} = this.$refs;

		/*初始化scroll*/
    	this.scroller = new BScroll(scrollWrap,{
    		click:true,
    		probeType:3,
    		pullDownRefresh:DOWN_CONFIG,
    		pullUpLoad:UP_CONFIG
    	});

    	/*进入页面先获取数据*/
    	this.getData();
	
		/*下拉刷新*/
		this.scroller.on('pullingDown',() => this.pullDown());

		/*上拉加载更多*/
		this.scroller.on('pullingUp',() => this.pullUp());
   } ,
   methods:{
   		//获取电影列表
		getData(){
	    	this.showLoading = true;
	    	var param = {
	            "class": this.type + "?count=10&start=0"
	        }
	    	queryMovieByClass(param).then((res) => {
	          //console.log(res)
	          if(res.data.resCode == '01'){
	            var data = JSON.parse(res.data.resData).subjects;
	            //console.log(typeof data)
	            this.goodsList = data;
	            this.currentPage = 1;
	          } else {
	            this.goodsList = [];
	          }

	          this.showLoading = false;
	        });
	    },
	    //格式化导演列表
        filterDirectors(arr){
	        var name="";         
	        arr.forEach((item,i)=>{
	            if(i==arr.length-1){
	               name+=item.name
	            }else{
	               name+=item.name+" / "
	            }	            
	        })
	        return name                         
	    },

	    //scroller的钩子函数
	    enable(){
	    	this.scroller&&this.scroller.enable()
	    },
	    disable(type){
	    	this.scroller&&this.scroller.disable()
	    },
	    finishPullDown(){
			this.scroller&&this.scroller.finishPullDown()
	    },
	    finishPullUp(){
			this.scroller&&this.scroller.finishPullUp()
	    },
	    refresh(){
			this.scroller&&this.scroller.refresh()
	    },
	    beforeFetch(type){	    	
	    	this[`pull${type}Loading`] = true;	//开启class，动态调整样式

	    	//this[`inPulling${type}`] = true;
	    	this.showLoading = true;
	    	if(type == "Down"){
	    		this.loadingPosition = "top";
	    		this.loadingWord = "正在下拉重新加载...";
	    		this.disable();
	    	}else if(type == "Up"){
				this.loadingPosition = "bot";
		    	this.loadingWord = "正在加载更多...";
		    	this.disable();
	    	}	    	
	    },
	    afterFetch(type){
			this.enable();
	    	this["finishPull" + type]();
	    	this.showLoading = false; 
	    	//setTimeout(()=>{
	    	this[`pull${type}Loading`] = false;	
	   		//},300)    	    	
	    },

	    //下拉
	    pullDown(){   	    	
	    	this.beforeFetch("Down");  
    		var param = {
	            "class": this.type + "?count=10&start=0"
	        }
    		queryMovieByClass(param).then((res) => {
	          //console.log(res)
	          if(res.data.resCode == '01'){
	            var data = JSON.parse(res.data.resData).subjects;
	            //console.log(typeof data)
	            this.goodsList = data;
				this.currentPage = 1;
	          } else {
	            this.goodsList = [];
	          }
	          this.afterFetch("Down");
	          //this.showLoading = false;
	        }); 	  	
	    },

	    //上拉
	    pullUp(){    	
	    	if(!this.noMoreData){
		    	this.beforeFetch("Up");
		    	var param = {
		            "class": this.type + `?count=10&start=${ (this.currentPage++) * 10 }`
		        }
	    		queryMovieByClass(param).then((res) => {
		          //console.log(res)
		          if(res.data.resCode == '01'){
		            var data = JSON.parse(res.data.resData).subjects;
		            //console.log(typeof data)
		            this.goodsList = this.goodsList.concat(data);

		          } else if (res.data.resCode == '03'){
		            //this.goodsList = [];
		            this.noMoreData = true;
		          }
		          this.afterFetch("Up");
		          //this.showLoading = false;
		        });

	    	}    	
	    }         
   },
   watch:{
   		goodsList(){
   			this.$nextTick(()=>{
   				this.scroller.refresh(); 
   			}) 	
   		}
   },
    
}
</script>

<style scoped lang="scss">
   	@import '../base/css/base.scss';
    #wrapper{
    	position: fixed;
    	top:0;
    	bottom:0;	
    	width: 100%;
    	overflow: hidden;
    	background:#fff;
    	z-index: 99999;
		.scroller{
			position: absolute;
			width: 100%;
			&.topPadding{
				top:1rem;
			}	
				
		}
		#loading{
			text-align: center;
			position: absolute;
			z-index: 100;
			width: 100%;
			/* 用&替代元素自身 */
			&.center{			
				top:50%;
				left:50%;
				transform:translate(-50%,-50%);
			}
			&.pullDownLoading{
				position: absolute;
				top:0.7rem;bottom:auto;left:50%;
			}
			&.pullUpLoading{
				position: absolute;
				top:auto;bottom:0.7rem;left:50%;
			}

			
			img{
				margin: 0 auto;
				width: 0.889rem;
				height: 0.889rem;
			}
		}
		.film-list{
	   		padding: 0.3125rem;
	   		position: relative;
	   		border-bottom: 0.0312rem solid #ddd;;
	   		@include flex-center;
	   		.film-list__img{
	   			width:1.7rem;
		   		height: 2.7rem;
		   		img{
					width: 100%;
					height:auto;
		   		}
	   		}
	   		.film-list__detail{
	   			flex:1;
	   			padding:0 0.35rem 0 0.45rem;
	   			p{
	   				@include fz(12px);
	   				padding:0.0312rem 0;
	   				color: #888;
	   				@include t-overflow(2);
	   				span{
	   					color:#77b59c;
	   				}
	   				&.film-list__detail__title{
						padding-bottom: 0.08rem;
	   				}   		
	   			}
	   		}	   			
	   }
    }
   
    .slide-enter-active{
        transition:all 0.4s;
    }
    .slide-enter, .slide-leave-active{
        transform:translate3d(100%,0,0);
        transition:all 0.4s;
    }

	 .top-enter-active,.bot-enter-active{
	    transition:all 0.2s;
	}

	.top-enter, .top-leave-active{
	    transform:translateY(-100%);
	    transition:all 0.2s;
	} 

	.bot-enter, .bot-leave-active{
	    transform:translateY(100%);
	    transition:all 0.2s;
	}

	.back {
	    @include fz(25px);
	    color: #000;

	}

	.goback {
		height: 40px;
		padding: 10px;
		box-sizing: border-box;
		position: fixed;
		top: 0;
		left: 0;
	}

	.blank {
		height: 40px;
	}

</style>
