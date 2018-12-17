# 简易vueCart购物车

> 技术栈：vue + vuex + node(改进回调的express) + mysql

## 开发调试

后台: localhost:8888

web端: localhost:8088

调用豆瓣API: 	"https://douban.uieee.com/v2/movie", "https://api.douban.com/v2/movie"

电影数据从豆瓣获取，后端node代码用于跨域获取数据，源代码见我的另一篇github：nodejs后台支持

登陆信息从mysql获取，数据库里需要有字段：username 和 password;

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## 登入界面：
 ![image](https://github.com/duheng1992/movieAppCart/static/index.PNG)
