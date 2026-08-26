// Quantumult X 脚本 - 排行榜用户列表解析弹窗
// 适用于: /mserver/client/ranking/userList 接口

const $ = new API();

// 判断是否为需要处理的接口
if ($.request && $.request.url.includes('/mserver/client/ranking/userList')) {
    const body = JSON.parse($response.body);
    
    // 检查数据结构
    if (body.code === 0 && body.data && body.data.list) {
        const list = body.data.list;
        const pagination = body.data.pagination;
        
        // 构建弹窗内容
        let message = '';
        
        // 分页信息
        if (pagination) {
            message += `📊 第 ${pagination.page} 页 | 总用户 ${pagination.total} 人\n`;
            message += `${'─'.repeat(20)}\n`;
        }
        
        // 用户列表
        list.forEach((user, index) => {
            const rank = (pagination.page - 1) * pagination.pageSize + index + 1;
            const username = user.username || '未知用户';
            const uid = user.uid || 'N/A';
            const distance = user.distance || '未知距离';
            
            message += `🏅 ${rank}. ${username}\n`;
            message += `   UID: ${uid}\n`;
            message += `   📍 ${distance}\n`;
            
            if (index < list.length - 1) {
                message += `${'─'.repeat(20)}\n`;
            }
        });
        
        // 弹窗显示
        $notify(
            '排行榜用户列表',
            `第 ${pagination.page} 页（共 ${pagination.total} 人）`,
            message
        );
    } else {
        // 数据异常
        $notify(
            '排行榜用户列表',
            '数据解析失败',
            `错误信息: ${body.msg || '未知错误'}\n状态码: ${body.code}`
        );
    }
}

// 完成处理
$.done();

// API 封装
function API() {
    this.request = typeof $request !== 'undefined' ? $request : null;
    this.response = typeof $response !== 'undefined' ? $response : null;
    this.done = () => {
        if (typeof $done === 'function') {
            $done({});
        }
    };
}

// 全局通知函数
function $notify(title, subtitle, message) {
    if (typeof $notification !== 'undefined' && $notification.post) {
        $notification.post(title, subtitle, message);
    } else if (typeof $notify !== 'undefined') {
        $notify(title, subtitle, message);
    } else {
        console.log(`${title} - ${subtitle}\n${message}`);
    }
}