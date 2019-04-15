iframeStopResize();
var openImg = [
  {
    'nodeName': '方案审核', imgPrefix: 'open_14', value: null,
    names: ['定单审核预调度', '派发设计单', '', '线路方案设计', '线路方案审核', '省部方案审核',
      '省部审核', '定单审核']
  },
  {
    'nodeName': '管线施工', imgPrefix: 'open_3', value: null,
    names: ['派发测试单', '派发施工单', '施工预约', '挂起确认', '挂起审核', '解除挂起', '管线施工',
      '管线施工资源入库(绿色)', '施工审核', '管线资源入库', '管线资源入库审核']
  },
  {
    'nodeName': '资源配置', imgPrefix: 'open_8', value: null,
    names: ['光路调度', '光路调度(绿色)', '资源配置', '电路确认', '资源配置异常审核',
      '资源配置异常制作(补录专线)', '省干传输资源配置']
  },
  {
    'nodeName': '数据制作', imgPrefix: 'open_7', value: null,
    names: ['互联网数据制作', '公网IP分配', '语音数据制作', 'MPLS-VPN数据制作', '局数据配置',
      '局数据确认', '数据制作(地市GRE隧道)', "MPLS-VPN数据制作", "GPRS核心网局数据配置",
      "HLR局数据配置(省中心)", "HLR局数据配置(无锡中心)"]
  },
  {
    'nodeName': '客户端设备安装', imgPrefix: 'open_5', value: null,
    names: ['测试预约', '客户侧设备安装与测试', '客户侧设备安装业务测试', '客户测业务调测',
      '客户侧设备安装业务测试(绿色)', '客户侧测试异常审核', '客户侧业务测试']
  },
  {
    'nodeName': '告警验证', imgPrefix: 'open_1', value: null,
    names: ['告警验证受理', '告警验证审核']
  },
  {
    'nodeName': '照片上传', imgPrefix: 'open_13', value: null,
    names: ['照片上传受理', '照片上传审核']
  },
  {
    'nodeName': '省公司质检', imgPrefix: 'open_12', value: null,
    names: ['验收申请', '省部竣工验收审核', '竣工省部确认', '竣工省部审核']
  }
];
var detailKeyArr = [{ key: 'username', keyName: '环节处理人：' }, { key: 'phoneNum', keyName: '环节处理人电话：' },
  { key: 'startTime', keyName: '环节开始时间：' }, { key: 'endTime', keyName: '环节结束时间：' },
  { key: 'dealType', keyName: '处理结果：' }];
$(document).ready(function () {
  $("#orderCreateTimeStart").datetimepicker({
    showHour: true, showMinute: true, showTime: true,
    showWeek: false, timeFormat: 'hh:mm:ss', dateFormat: 'yyyy-MM-dd'
  });
  $("#orderCreateTimeEnd").datetimepicker({
    showHour: true, showMinute: true, showTime: true,
    showWeek: false, timeFormat: 'hh:mm:ss', dateFormat: 'yyyy-MM-dd'
  });
  var height = getPageHeight();
  var tableH = height - 327;
  $("#complaint-table").datagrid({
    striped: true, height: tableH, singleSelect: true, rownumbers: true,
    pagination: true, nowrap: false, pageSize: pageSize, showFooter: true,
    loadMsg: '正在加载...', emptyMsg: '无数据',
    columns: [[
      {
        title: '开通工单号',
        field: 'orderId',
        width: 100
      }, {
        title: '订购工单号',
        field: 'crmOrderId',
        width: 150,
        formatter: function (val, rec) {
          return '<a href="http://10.40.95.25/e2epboss/external/external-customer-manager'
            + '!groupOrdercmSerach?username=huawei&password=1q2w3e$R&idParams='
            + val + '" target="blank">' + val + '</a>';
        }
      }, {
        title: '集团客户编号',
        field: 'customerCode',
        width: 100
      }, {
        title: '集团客户名称',
        field: 'customerName',
        width: 260
      }, {
        title: '专线类型',
        field: 'lineType',
        width: 100
      }, {
        title: '客户服务等级',
        field: 'customerServiceLevel',
        width: 80
      }, {
        title: '工单主题',
        field: 'orderTopic',
        width: 300
      }, {
        title: '当前环节',
        field: 'openJointOrderInfos.taskDescription',
        hidden: true,
        width: 200,
        formatter: function (val, rec) {
          if (rec.openJointOrderInfos == null
            || rec.openJointOrderInfos.length == 0) {
            return null;
          } else {
            return rec.openJointOrderInfos[0].taskDescription;
          }
        }
      }, {
        title: '当前操作人',
        field: 'openJointOrderInfos.username',
        hidden: true,
        width: 120,
        formatter: function (val, rec) {
          if (rec.openJointOrderInfos == null
            || rec.openJointOrderInfos.length == 0) {
            return null;
          } else {
            return rec.openJointOrderInfos[0].username;
          }
        }
      }, {
        title: '联系电话',
        field: 'openJointOrderInfos.phoneNum',
        hidden: true,
        width: 100,
        formatter: function (val, rec) {
          if (rec.openJointOrderInfos == null
            || rec.openJointOrderInfos.length == 0) {
            return null;
          } else {
            return rec.openJointOrderInfos[0].phoneNum;
          }
        }
      }, {
        title: '工单开始时间',
        field: 'orderCreateTime',
        width: 150
      }, {
        title: '工单完结时间',
        field: 'orderDealedTime',
        width: 150
      }]],
    onClickRow: function (rowIndex, rowData) {
      loadNodeInfoHanlder();
    }, onLoadSuccess: function (data) {
      $('#complaint-table').datagrid('selectRow', 0);
      loadNodeInfoHanlder();
    }
  });
  //加载table数据
  loadTableData(1, pageSize);
  var pager = $('#complaint-table').datagrid('getPager');
  if (pager) {
    $(pager).pagination({
      showRefresh: false,
      onSelectPage: function (pageNumber, pageSize) {
        loadTableData(pageNumber, pageSize);
      }
    });
  }
});

/*加载表格数据*/
function loadTableData(pageNumber, pageSize) {
  var params = JSON.stringify(getSeachParams());
  var _url = Query_URL + urlPrefix + (pageNumber - 1) * pageSize + '/' + pageSize;
  _url += "?token=" + $.cookie("token");
  $.ajax({
    url: _url, data: params, type: 'POST', cache: false, contentType: 'application/json',
    beforeSend: function () {
      $.messager.progress();//显示进度条
    }, complete: function () {
      $.messager.progress('close');//关闭进度条
    }, error: function (response) {
      alert('查询失败，' + response.responseText);
    }, success: function (response) {
      //response内容示例:{"total":0,"rows":[],"statusCode":1,"message":"success"}
      if (response.total === 0) {
        if (state === '在途') {
          document.getElementById('loadPic').innerHTML = "<div style='text-align: center;line-height:100px'><span style='color: black;text-align: center;'>当前客户无在途工单</span></div>";
        } else {
          document.getElementById('loadPic').innerHTML = "<div style='text-align: center;line-height:100px'><span style='color: black;text-align: center;'>该客户无历史工单</span></div>";
        }
        return;
      }
      $("#complaint-table").datagrid('loadData', response);
    }
  });
}

/*获取搜索框中的参数*/
function getSeachParams() {
  var params = {};
  params.orderId = (orderId != "null") ? orderId : $("#orderId").val();
  params.orderCreateTimeStart = $("#orderCreateTimeStart").val();
  params.orderCreateTimeEnd = $("#orderCreateTimeEnd").val();
  if (state == '超时')
    params.outTime = state;
  return params;
}//根据选定工单 加载环节Imgage 最新环节的信息
function loadNodeInfoHanlder() {
  var row = $('#complaint-table').datagrid('getSelected');
  if (row == null || row == undefined
    || row.openJointOrderInfos == null || row.openJointOrderInfos == undefined) return;
  var nodeArr = row.openJointOrderInfos;
  var nodeArrlen = 0;
  $.each(openImg, function (index, item) {//重置所有环节的数据
    item.value = null;
  });
  var lastestNodeObj = {};//该工单最新一个环节信息
  if (row.openJointOrderInfos.length > 0) {
    lastestNodeObj = row.openJointOrderInfos[0];
  }
  var lastestNodeName = '';//该工单最新一个环节的节点名称
  $.each(openImg, function (index2, item2) {
    $.each(item2.names, function (index3, item3) {
      $.each(nodeArr, function (index, item) {
        if (item.taskDescription == item3) {
          if (item2.value == null) {
            item2.value = item;
            nodeArrlen++;
          } else if (item2.value.endTime < item.endTime) {
            //取该环节下 环节结束时间最大的一个作为该环节的环节信息
            item2.value = item;
          }
        }
        if (lastestNodeObj.taskDescription == item3) {
          lastestNodeName = item2.nodeName;
        }
      });
    });
    if (item2.nodeName == '省公司质检' && item2.value != null) {//省公司质检 环节 取工单完成事件
      item2.value.startTime = row.orderCreateTime;
      item2.value.endTime = row.orderDealedTime;
    }
  });
  var isOrderCompleted = true;
  if (row.orderDealedTime == "" || row.orderDealedTime == null || row.orderDealedTime == undefined) {
    nodeArrlen = openImg.length;//工单未完成
    isOrderCompleted = false;
  }
  loadNodeImgHandler(nodeArrlen, isOrderCompleted);
  loadSingleNodeInfoHandler(lastestNodeName);//默认呈现最新一条环节明细
}//环节Image渲染
function loadNodeImgHandler(nodeArrlen, isOrderCompleted) {
  var winWidth = getPageWidth();
  var shortPicLength = 60;
  var longPicLength = 65;
  var pointLength = (winWidth - 120 - longPicLength - shortPicLength * (nodeArrlen - 1)) / nodeArrlen;
  var htmlStr = "<table><tr>";
  var imgFlag = "NOW";
  $.each(openImg, function (index, item) {
    imgFlag = item.value == null ? "NO" : "NOW";
    if (!isOrderCompleted || (isOrderCompleted && item.value != null)) {
      htmlStr += index > 0 ? "<td style='width:" + pointLength + ";background:url(\"../../images/sheet/ok-point.png\");'></td>" : "";
      htmlStr += "<td><img height='90%' src='../../images/sheet/" + item.imgPrefix + imgFlag;
      htmlStr += ".png' name='" + item.nodeName + "'></td>";
    }
  });
  document.getElementById('loadPic').innerHTML = htmlStr + "</tr></table>";
}//加载特定环节信息
function loadSingleNodeInfoHandler(nodeName_) {
  $("#detailsTable tr td").html("");
  $("#detailsTable td:eq(0)").html("&nbsp;&nbsp;&nbsp;&nbsp;>>&nbsp;&nbsp;" + nodeName_);
  if (nodeName_ == "") return;
  $.each(openImg, function (index, item) {
    if (nodeName_ == item.nodeName) {
      $.each(detailKeyArr, function (index2, item2) {
        $("#detailsTable td:eq(" + (index2 + 1) + ")").html(item2.keyName + item.value[item2.key]);
      });
    }
  });
}

// 点击查看事件
$(document).on("click", "img", function (val) {
  if ($(this)[0]['src'].indexOf('NO.png') > -1) return;
  loadSingleNodeInfoHandler($(this)[0]['name']);
});

/*重置搜索框中的内容*/
function reset() {
  $('#formTable')[0].reset();
}
