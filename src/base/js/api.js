import {getDeviceRatio} from './util.js'

export var DEVICE_RATIO=getDeviceRatio();

export var DOWN_CONFIG={
	threshold:80*DEVICE_RATIO,
	stop:40*DEVICE_RATIO
}
/*上拉配置*/
export var UP_CONFIG={
	threshold:-80*DEVICE_RATIO,
}

  