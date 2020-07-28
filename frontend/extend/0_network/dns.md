# dns

domain name system 域名系统

- 域名层级

  ```shell
  www.baidu.com.root
  # host.sld.tld.root root省略，com为顶级域名，baidu为二（次）级域名，www为三级域名（主机名）
  ```

- dns服务器

  ```shell
  dig baidu.com
  dig @8.8.8.8 baidu.com # 指定dns服务器查询并展示查询过程
  dig a baidu.com # 查询a记录
  dig ns baidu.com # 查询ns记录
  cat /etc/resolv.conf # dns服务器列表
  whois baidu.com # 查看域名注册情况
  nslookup
  host baidu.com
  ```

- dns查询
  - 浏览器缓存 -> 系统缓存 -> 路由器缓存 -> ISP DNS缓存
  - 从根域名服务器查询顶级域名的NS记录和A记录（IP地址）
  - 跟域名 -> 顶级 -> 次级的NS和A -> 主机的A -> 缓存
  - CNAME(跳转到另一个域名) NS(域名服务器记录，包含下一级域名信息的服务器地址) A(返回IP地址)

  ![dns](https://derekzhou.oss-cn-hongkong.aliyuncs.com/20200706145459.png)
