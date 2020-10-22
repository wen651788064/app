var ws = require('nodejs-websocket');


let messageData = {
    policeList: [],
    thiefList: [],
};
const server = ws.createServer((connect)=>{
    connect.on('text',(str)=>{
        let data = JSON.parse(str);
        console.log(data);
        switch (data.type) {
            case 'message':
                messageData.thiefList = data.thiefList;
                messageData.policeList = data.policeList;

                boardcast(JSON.stringify({
                    type:'chatterList',
                    list:getAllChatter()
                }));
                break;
            case 'move':
                boardcast(JSON.stringify({
                    type:'chat',
                    message: data.message
                }));
                break;
            case 'login':
                boardcast(JSON.stringify({
                    type:'login',
                    list: getAllChatter()
                }));
                break;
            default:
                break;
        }
    });

    //关闭链接的时候
    // connect.on('close',()=>{
    //
    //     //离开房间
    //     boardcast(JSON.stringify({
    //         type:'serverInformation',
    //     }));
    //
    //     boardcast(JSON.stringify({
    //         type:'chatterList',
    //         list: getAllChatter()
    //     }))
    // });

    //错误处理
    connect.on('error',(err)=>{
        console.log(err);
    })

}).listen(3000,()=>{
    console.log("running")
});

const boardcast = (str) =>{
    server.connections.forEach((connect)=>{
        connect.sendText(str)
    })
};

const getAllChatter = ()=>{
    let j = {};
    server.connections.forEach((connect)=>{
        j = {
            thiefList: messageData.thiefList,
            policeList: messageData.policeList,
        }
    });
    return j;
};


