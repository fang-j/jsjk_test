<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String orderId = request.getParameter("orderId");
String state = request.getParameter("state");
String productNo = request.getParameter("productNo");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
 <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=10" />
    <link rel="stylesheet" type="text/css" href=" ../../../media/examples_support/themes/redmond/jquery-ui-1.7.3.custom.css">				
    <link rel="stylesheet" type="text/css" href="../../../jquery-easyui-1.3.5/themes/default/easyui.css">
    <link rel="stylesheet" type="text/css" href="../../../jquery-easyui-1.3.5/themes/icon.css">
    <link rel="stylesheet" type="text/css" href="../../../jquery-easyui-1.3.5/demo/demo.css">
    <script type="text/javascript" src="../../../jquery/jquery-1.8.2.min.js"></script><!-- easyui库 -->		
	<link rel="stylesheet" type="text/css" href="../../../common/timePicker/css/dateTimePicker.css">		
	<script type="text/javascript" src="../../../common/timePicker/js/jquery-ui.js"></script>
	<script type="text/javascript" src="../../../jquery-easyui-1.3.5/jquery.easyui.min.js"></script>
	<script type="text/javascript" src="../../../common/timePicker/js/jquery-ui-slide.min.js"></script>
	<script type="text/javascript" src="../../../common/timePicker/js/jquery-ui-timepicker-addon.js"></script><!--日期控件-->
	<script src="../../../jquery/locale/easyui-lang-zh_CN.js"></script><!-- 分页汉化包 -->	
	<script type="text/javascript" src="../../../common/jquery.cookie-1.4.1.js"></script>
	<script type="text/javascript" src="../../../common/commonFunc.js"></script>
   <title>开通工单查询</title>
   <style type="text/css">
   #outLayer {height: 100%;}
   #northLayer {height: 230px;}
   #detailsTable {background-color:#EEEEEE;}
	table.imagetable th {border-width: 0px;padding: 4px 8px;border-style: solid;border-color: #999999;}
	table.imagetable td {border-width: 0px;padding: 4px 8px;border-style: solid;border-color: #999999;height: 25px;}
	table.imagetable td:first-child{}
	img {cursor: pointer;opacity:1.0;filter:alpha(opacity=100);}
	img:hover {opacity:0.8;filter:alpha(opacity=80);}
</style>
</head>
  
<body style="padding: 0;overflow:hidden">
  <div class="easyui-layout" style="width: 100%;" id="outLayer">
    <div  data-options="region:'north'" id="northLayer" style="padding: 0;overflow:hidden;">
    <div class="panel" style="padding: 0;overflow:hidden;">
    	<div  style="height:95px;">
		    <div id="loadPic" style="margin:0 60;">
		    </div>
    	</div>
    	<div  style="height:135px;overflow:scroll;overflow-x:hidden;">
    		<table style="width:100%;height:100%;border-radius: 5px;" id="detailsTable" class="imagetable">
    			<tr>
    				<td colSpan="4"></td>
    			</tr>
    			<tr>
    				<td style="width:25%"></td>
    				<td style="width:25%"></td>
    				<td style="width:25%"></td>
    				<td style="width:25%"></td>
    			</tr>
    			<tr>
    				<td></td>
    				<td></td>
    				<td></td>
    				<td></td>
    			</tr>
    			<tr>
    				<td></td>
    				<td></td>
    				<td></td>
    				<td></td>
    			</tr>
    			<tr>
    				<td></td>
    				<td></td>
    				<td></td>
    				<td></td>
    			</tr>
    		</table>
    	</div>
    </div>
    </div>
	<div region="center" class="easyui-layout" id="centerLayer" style="border: none;overflow:hidden;">
	<div class="easyui-layout" region="center" style="width:100%;border: none;" id="heightFine">
    <div data-options="region:'north',collapsible:false" style="height:70px;overflow:hidden;" title="查询条件"><!-- fit:true border:solid 0px;height:255px; -->
    	<form id="formTable" style="height: 70px"><!-- 为了重置！ -->
         <table style="width: 100%" border="0">
            <tr>  
            	<td class="tdTopLabel"><label>开通工单编号:</label></td>
                <td class="tdTop"><input type="text" id="orderId" name="orderId"></td>              
                <td class="tdTopLabel"><label>工单起止时间:</label></td>
                <td>
                	<input id="orderCreateTimeStart" name="orderCreateTimeStart" type="text"/>
                	<label>~</label>
                	<input id="orderCreateTimeEnd" name="orderCreateTimeEnd" type="text"/>              	
				</td>
           
                <td colspan="3" style="padding-left: 30px">
                    <a href="javascript:;" onclick="javascript:loadTableData(1,20);" class="easyui-linkbutton" data-options="iconCls:'icon-search'"><span class="buttonTop">查询</span></a>
                    <a href="javascript:;" onclick="javascript:reset();" class="easyui-linkbutton" data-options="iconCls:'icon-reload'"><span class="buttonTop">重置</span></a>
                </td>
            </tr>
        </table>
        </form>
    </div>
    
    <div data-options="region:'center'" style="border:none;"  title="工单列表"><!-- style="border: none" -->
      <table id="complaint-table"></table>
    </div>
</div>
    </div> 
</div>
</body>

<script type="text/javascript">
var orderId = '<%=orderId%>';
var productNo = '<%=productNo%>';
var state = decodeURIComponent(decodeURIComponent('<%=state%>'));
var urlPrefix=state=='在途'?'/order/open/get/dealing/':'/order/open/get/completed/'; 
$(function(){
	//给table的第一行加一条 下方的线条
	$("table.imagetable td:first").css({
		"border-width": "1",
		"border-top": "1",
		"border-left": "1",
		"border-right": "1",
		"color":"#0492f6"
	});
});
</script>
<script type="text/javascript" src="../../../js/maintenanceView/order/openIframe.js"></script><!-- 引用js -->
</html>
