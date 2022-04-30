<strong>
    <h2 align="center">NeuMusic    
    </br>
    <img src = "./source/img/icon.png" height="128px" weight="128px">
    </h2>
</strong>
<p align="center">
    一个新拟态风格的第三方网易云音乐播放器
</p>

##Demo

http://music.msfs2020.com/

## 特性

- 原生html + javascript/jQuery + css 开发
- 纯静态网页
- 支持网易云账号(手机/邮箱)登录
- 新拟态风格

## 软件截图

![](./source/img/cut1.png)

![](./source/img/cut3.png)

![](./source/img/cut2.png)

![](./source/img/cut4.png)

## 部署

1. 克隆代码到本地

   ```sh
   git clone https://github.com/timlzh/NeuMusic.git
   ```
   国内可用镜像站`git clone https://hub.fastgit.org/timlzh/NeuMusic.git`访问更快
   
2. 部署[Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)

   部署网易云 API，详情参见 [Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)

3. 部署网页(本地直接打开index.html会导致访问错误)

4. 在网页中输入api地址，一定不要忘了地址最后的/
   
   如: `http://127.0.0.1:3000/`
   
   如果你是在本地部署的api，则api地址为`"http://localhost:3000/"`
   
   可以填写我提供的试用地址``"http://msfs2020.com:3000/"``

## 贡献者

@[Timlzh](https://github.com/timlzh/)

## 鸣谢

[qier222/YesPlayMusic](https://github.com/qier222/YesPlayMusic)

[Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)



