import https from './request'

//设置个对象，就不用一个个暴露了，直接暴露对象
let apiFun = {
    getVideo: data => https.net('/api/getHaoKanVideo', data, 'get'),
    saveJcInfo: data => https.net('/api/saveJcInfo', data),
    getContent1: data => https.net('/content1', data, 'get'),
};

export default apiFun;