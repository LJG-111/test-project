export default {
    // indexedDB兼容
    indexedDB: window.indexedDB || window.webkitindexedDB || window.msIndexedDB || window.mozIndexedDB,
    dbInit() {
        return new Promise((resolve, reject) => {
            //打开数据库，如果没有就新建一个
            //dbname库的名称，2为版本号，切记，版本号不能为小数，会自动四舍五入
            const connection = this.indexedDB.open('dbname', 2)
            connection.onblocked = function (event) {
                // 如果其他的一些页签加载了该数据库，在我们继续之前需要关闭它们
                alert("请关闭其他由该站点打开的页签！");
            };
            connection.addEventListener('success', (event) => {
                const db = event.target.result;
                db.addEventListener('versionchange', (event) => {
                    console.log('The version of this database has changed');
                });
                db.onversionchange = function () {
                    +   db.close()
                    console.log('Database is outdated, please reload the page.')
                }
            });
            //成功回调
            connection.onsuccess = function (event) {
                console.log('--------------------------indexDb连接成功');
                resolve(event.target.result);
            }
            //
            connection.onupgradeneeded = function (event) {
                const db = event.target.result
                if (!db.objectStoreNames.contains('person')) {
                    //为该数据库创建一个对象仓库，person,主键为id，下面使用调用的时候主要对应主键
                    //autoIncrement 标记会为该仓库开启键生成器。默认该设置是不开启的
                    //使用键生成器，当你向对象仓库新增记录时键会自动生成。对象仓库生成的键往往从 1 开始，然后自动生成的新的键会在之前的键的基础上加 1。生成的键的值从来不会减小，除非数据库操作结果被回滚
                    db.createObjectStore('person',
                        { keyPath: 'id' },
                        // { autoIncrement: true }
                    )
                }
            }
            //失败回调
            connection.onerror = function (err) {
                reject(err)
            }
        })
    },
    //type 方法类型  data第几条
    async dbOperation(type, data) {
        let typeList = ['add', 'get', 'getAll', 'delete', "put"]//方法名字
        //如果传的值不在这个列表中
        if (!typeList.includes(type)) {
            throw new Error(`操作类型错误, 仅支持: ${typeList.toString()} 方法`)
        }
        //事务模式有两个选项 readonly 或 readwrite ，默认为 readonly 模式，只读和写入数据
        const readType = type === 'add' || 'delete' || 'put' ? 'readwrite' : 'readonly'
        const res = await this.dbInit()
        const objectStore = res.transaction('person', readType).objectStore('person')

        const response = new Promise((resolve, reject) => {
            const request = objectStore[type](data)
            request.onsuccess = (res) => {
                resolve(res.target.result)
            }
            request.onerror = (err) => {
                reject(err)
            }
            request.oncomplete = (event) => {
                alert("All done!");
            }

        })
        return response
    },
    //添加数据 根据时间戳作为存储id 也可以使用其他类型的数据 主要是id查询 存储数据从外部传入
    async add() {
        const data = {
            id: new Date().getTime(),
            name: 'name',
            age: 'age',
            email: 'email@11.11'
        }
        await this.dbOperation('add', data);
    },
    //查找数据 参数为id
    async read(id = 1684734788935) {
        return await this.dbOperation('get', id);
    },
    //查找所有数据
    async readAll() {
        return await this.dbOperation('getAll');
    },
    //删除数据
    async deleteData() {
        await this.dbOperation('delete', 1663222119985)
    },
    //更新数据
    async putData() {
        const res = await this.dbOperation('get', 1663222119985)
        res.age = "11111"
        const ress = await this.dbOperation('put', res)
    },
    //删除数据库
    async deleteDb(dbname) {
        var delReq = indexedDB.deleteDatabase(dbname)

        delReq.onerror = function (event) {
            console.log('删除数据库时出错.')
        }

        delReq.onblocked = function (event) {
            console.log('阻止删除数据库.')
        }

        delReq.onsuccess = function (event) {
            console.log('数据库删除成功')
        }
    }
}