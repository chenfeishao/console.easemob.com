// Host
//var baseUrl = 'https://api.easemob.com';
var baseUrl = 'https://a1.easemob.com';

// 初始化加载
$(function() {
	// 支持Crossdomain
	$.support.cors = true;
		
	// 显示已登录用户nd
	$('#user_info').html('<small>Welcome,</small>'+$.cookie('cuserName'));
		
	// 注册按钮状态
	$("#agreeCBox").bind("click", function () {
		if($('#agreeCBox').attr('checked')){
			$('#formSubBtn').addClass('btn-success');
			$('#formSubBtn').disabled = false;
		} else {
			$('#formSubBtn').removeClass('btn-success');
			$('#formSubBtn').disabled = true;
		}
	});
	if($('#agreeCBox').attr('checked')){
		$('#formSubBtn').addClass('btn-success');
		$('#formSubBtn').disabled = false;
	} else {
		$('#formSubBtn').removeClass('btn-success');
		$('#formSubBtn').disabled = true;
	}
}) 

// 获取url参数
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}

// 获得token
function getToken() {
	var access_token = $.cookie('access_token');
	return access_token;
}

// app概况也显示代码
function showCode(boxId){
	// IOS
	if('iosTab' == boxId){
		$('#iosTab').addClass('visible');
		
		var androidTabClassVal = $('#androidTab').attr('class');
		if(androidTabClassVal.indexOf("visible") > -1){
			$('#androidTab').removeClass('visible');
		}
	}
	// Android
	if('androidTab' == boxId){
		$('#androidTab').addClass('visible');
		
		var iosTabClassVal = $('#iosTab').attr('class');
		if(iosTabClassVal.indexOf("visible") > -1){
			$('#iosTab').removeClass('visible');
		}
	}
}

// 显示不同窗口
function show_box(boxId){
	// 登录
	if('login-box' == boxId){
		$('#login-box').addClass('visible');
		
		var oldSignupClassVal = $('#signup-box').attr('class');
		if(oldSignupClassVal.indexOf("visible") > -1){
			$('#signup-box').removeClass('visible');
		}
		
		var oldForgotClassVal = $('#forgot-box').attr('class');
		if(oldForgotClassVal.indexOf("visible") > -1){
			$('#forgot-box').removeClass('visible');
		}
	}
	// 注册
	if('signup-box' == boxId){
		$('#signup-box').addClass('visible');
		
		var oldLoginClassVal = $('#login-box').attr('class');
		if(oldLoginClassVal.indexOf("visible") > -1){
			$('#login-box').removeClass('visible');
		}
		
		var oldForgotClassVal = $('#forgot-box').attr('class');
		if(oldForgotClassVal.indexOf("visible") > -1){
			$('#forgot-box').removeClass('visible');
		}
	}
	// 找回密码
	if('forgot-box' == boxId){
		$('#forgot-box').addClass('visible');
		
		var oldLoginClassVal = $('#login-box').attr('class');
		if(oldLoginClassVal.indexOf("visible") > -1){
			$('#login-box').removeClass('visible');
		}
		
		var oldSignupClassVal = $('#signup-box').attr('class');
		if(oldSignupClassVal.indexOf("visible") > -1){
			$('#signup-box').removeClass('visible');
		}
	}
}
 
// 找回密码表单校验
function resetPasswdFormValidate(){
	// 表单校验
	var email = $('#email').val();
	
	if('' == email){
		$('#emailEMsg').text('请填写用于找回密码的邮箱地址！');
		$('#email').focus();
		return false;
	}
  var emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	if(!emailReg.test(email)){
		$('#emailEMsg').text('请输入有效的邮箱！');
 		$('#email').focus();
		return false;
 	}
 	
 	$('#emailEMsg').text();
 	return true;
}

// 找回密码
function resetPasswd(){
	var email = $('#email').val();
	var orgName = $('#orgName').val();
	
	if(resetPasswdFormValidate()){
		$.ajax({
			url:baseUrl + '/management/users/' + email + '/resetpw',
			type:'PUT',
			data:{},
			crossDomain:true,
			success:function(respData){
				// 告知发送邮件
				if(respData.status && respData.status == 'ok') {
					alert('提示!\n\n邮件已发送,请前往邮箱继续找回密码.');
				}
			},
			error:function(respData){
				var str = JSON.stringify(respData.responseText).replace('}','').replace('{','').split(',');
				var tmpArr = new Array();
				var errorMsg = '';
				for(var i = 0; i < str.length; i++) {
					tmpArr.push(str[i].replace(/\\/g,'').replace(/\"/g,'').split(':'));
				}
				for(var i = 0; i < tmpArr.length; i++) {
					if('error_description' == tmpArr[i][0]){
						if(tmpArr[i][1].indexOf("Could not find organization for email") > -1) {
							errorMsg = '该邮箱未注册过环信!';
						}
						if(tmpArr[i][1].indexOf("username") > -1) {
							errorMsg = '请联系系统管理员 !';
						}
					}
				}
				
				alert('提示\n\n' + errorMsg);
			}
		});
	}
}

// 找回密码表单校验
function resetPasswdReqFormValidate(){
	// 表单校验
	var password1 = $('#password1').val();
	var password2 = $('#password2').val();
	
 	if('' == password1){
		alert('提示\n\n密码不能为空！');
		$('#password1').focus();
		return false;
	}
	if(password1.length < 6 || password1.length > 20){
		$('#password1').focus();
		alert('提示\n\n密码长度在6-20个字符之间！');
		return false;
	}
		if(password2 != password1){
		alert('提示\n\n两次输入密码不一致！');
		$('#password2').focus();
		return false;
	}
 	
 	return true;
}

// 设置新密码
function resetPasswdReq(token,uuid){
	var password1=$('#password1').val();
	var	password2=$('#password2').val();
	var d = {
		'password1':password1,
		'password2':password2,
		'token':token
	}
	if(resetPasswdReqFormValidate()){
		$.ajax({
			url:baseUrl + '/management/users/'+uuid+'/resetpw',
			type:'POST',
			data:JSON.stringify(d),
			headers:{
				'Content-Type':'multipart/form-data'
			},
			success:function(respData){
				alert('提示!\n\重置密码成功!');
				window.location.href = 'https://console.easemob.com';
			},
			error:function(data){
				alert('提示!\n\重置密码失败!');
			}
		});
	}
}

// 注册表单校验
function regsFormValidate(){
	// 表单校验
	var regOrgName = $('#regOrgName').val();
	var regUserName = $('#regUserName').val();
	var regEmail = $('#regEmail').val();
	var regPassword = $('#regPassword').val();
	var regRePassword = $('#regRePassword').val();
	var regTel = $('#regTel').val();
	
	if('' == regOrgName){
		$('#regOrgNameSMsg').css('display','none');
		$('#regOrgNameEMsg').text('企业ID名不能为空！');
		//$('#regOrgName').focus();
		return false;
	}
	var regOrgNameRegex = /^(?!-)(?!.*?-$)[a-zA-Z0-9-]+$/;
	if(!regOrgNameRegex.test(regOrgName)){
		$('#regOrgNameSMsg').css('display','none');
	 	$('#regOrgNameEMsg').text('只能使用数字,字母,横线,且不能以横线开头和结尾！');
 		//$('#regOrgName').focus();
		return false;
 	}
 	if(regOrgName != '' && regOrgName.length < 3 || regOrgName.length > 18){
		$('#regOrgNameSMsg').css('display','none');
		$('#regOrgNameEMsg').text('企业ID长度在3-18个字符之间！');	
		//$('#regOrgName').focus();
		return false;
	}
	$('#regOrgNameSMsg').css('display','block');
	
	if('' == regUserName){
		$('#regUserNameSMsg').css('display','none');
		$('#regUserNameEMsg').text('用户名不能为空！');
		//$('#regUserName').focus();
		return false;
	}
	var regUserNameRegex = /^[0-9a-zA-Z]*$/;
	if(!regUserNameRegex.test(regUserName)){
		$('#regUserNameEMsg').text('用户名只能是字母,数字或字母数字组合！');
 		//$('#regUserName').focus();
		return false;
 	}
 	if(regUserName != '' && regUserName.length < 1 || regUserName.length > 18){
		$('#regUserNameSMsg').css('display','none');
		$('#regUserNameEMsg').text('用户长度在1-18个字符之间！');	
		//$('#regUserName').focus();
		return false;
	}
	$('#regUserNameSMsg').css('display','block');
	if('' == regPassword){
		$('#regPasswordSMsg').css('display','none');
		$('#regPasswordEMsg').text('密码不能为空！');
		//$('#regPassword').focus();
		return false;
	}
	if(regPassword.length < 6 || regPassword.length > 20){
		//$('#regPassword').focus();
		$('#regPasswordEMsg').text('密码长度在6-20个字符之间！');
		return false;
	}
	$('#regPasswordSMsg').css('display','block');
	if('' == regRePassword){
		//$('#regRePassword').focus();
		$('#regRePasswordEMsg').text('请再次输入密码！');
		return false;
	}
	if('' != regRePassword && regPassword != regRePassword){
		//$('#regPassword').focus();
		//$('#regRePassword').focus();
		$('#regRePasswordEMsg').text('两次密码不一致!');
		return false;
	}
	var emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	if('' == regEmail){
		$('#regEmailEMsg').text('请输入邮箱！');
		return false;
	}
	if(regEmail != '' && !emailReg.test(regEmail)){
		$('#regEmailEMsg').text('请输入有效的邮箱！');
		return false;
	}
	var regTelReg = /^[0-9]*$/;
	if(regTel != '' && !regTelReg.test(regTel)){
		$('#regTelSEMsg').css('display','none');
		$('#regTelEMsg').text('联系电话号码格式不符合要求！');
		//$('#regEmail').focus();
		return false;
	}
		
	$('#regOrgNameEMsg').text('');
	$('#regUserNameEMsg').text('');	
	$('#regPasswordEMsg').text('');
	$('#regRePasswordEMsg').text('');	
	$('#regEmailEMsg').text('');
	$('#regTelEMsg').text('');
	
	return true;
}
	
// 用户名重复性校验
function isUsernameExist(username){
}	

//注册表单清空
function resetForm(){
	$('#regOrgName').val('');
	$('#regUserName').val('');
	$('#regPassword').val('');
	$('#regRePassword').val('');
	$('#regEmail').val('');
	$('#regTel').val('');
}

// 注册
function formSubmit(){
	var regOrgName = $('#regOrgName').val();
	var regUserName = $('#regUserName').val();
	var regEmail = $('#regEmail').val();
	var regPassword = $('#regPassword').val();
	var mailSuffix = regEmail.substring(regEmail.indexOf('@')+1);
	
	var d = {
		organization:regOrgName,
		username:regUserName,
		email:regEmail,
		password:regPassword
	};
	if(regsFormValidate()){
		// 注册用户信息
		$.ajax({
			url:baseUrl + '/management/organizations',
			type:'POST',
			crossDomain:true,
			headers:{
				'Content-Type':'application/json'
			},
			data:JSON.stringify(d),
			success: function(respData, textStatus, jqXHR) {
				$('#signup-box').removeClass('visible');
				$('#login-box').addClass('visible');
				$('#username').val(regUserName);
			
				// 告知发送邮件
				window.location.href = 'regist_org_success.html?mailSuffix='+mailSuffix+'&regEmail='+regEmail;
			},
			error: function(respData, textStatus, jqXHR) {
				var str = JSON.stringify(respData.responseText).replace('}','').replace('{','').split(',');
				var tmpArr = new Array();
				var errorMsg = '';
				for(var i = 0; i < str.length; i++) {
					tmpArr.push(str[i].replace(/\\/g,'').replace(/\"/g,'').split(':'));
				}
				for(var i = 0; i < tmpArr.length; i++) {
					if('error_description' == tmpArr[i][0]){
						if(tmpArr[i][1].indexOf("path") > -1) {
							errorMsg = '企业ID重复！';
						}
						if(tmpArr[i][1].indexOf("username") > -1) {
							errorMsg = '用户名重复 !';
						}
						if(tmpArr[i][1].indexOf("email") > -1) {
							errorMsg = '邮箱账户重复 !';
						}
					}
				}
				alert('注册失败!\n\n' + errorMsg);
			}
		});
	}
}

// 登录表单校验
function loginFormValidate(){
	// 表单校验
	var loginUserName = $('#username').val();
	var loginPassword = $('#password').val();
	if('' == loginUserName){
		$('#usernameEMsg').text('用户名不能为空！');
		$('#username').focus();
		return false;
	}
	if('' == loginPassword){
		$('#passwordEMsg').text('密码不能为空！');
		$('#password').focus();
		return false;
	}
	
	$('#usernameEMsg').text('');
	$('#passwordEMsg').text('');
	return true;
}

// System管理员登录
function sysAdminLogin() {
	var d = {
		'grant_type':'password',
		'username':$('#username').val(),
		'password':$('#password').val()
	};
	
	if(loginFormValidate()){
			// 登录获取token
			$.ajax({
				url:baseUrl+'/management/token',
				type:'POST',
				data:JSON.stringify(d),
				headers:{
					'Content-Type':'application/json'
				},
				error: function(respData, textStatus, errorThrown) {
					var str = JSON.stringify(respData.responseText).replace('}','').replace('{','').split(',');
					var tmpArr = new Array();
					var errorMsg = '';
					for(var i = 0; i < str.length; i++) {
						tmpArr.push(str[i].replace(/\\/g,'').replace(/\"/g,'').split(':'));
					}
					for(var i = 0; i < tmpArr.length; i++) {
						if('error_description' == tmpArr[i][0]){
							if(tmpArr[i][1].indexOf("User must be confirmed to authenticate") > -1) {
								errorMsg = '登陆失败，账户未激活!';
							}
							if(tmpArr[i][1].indexOf("invalid username or password") > -1) {
								errorMsg = '登陆失败，用户名或者密码错误!';
							}
						}
					}
					alert(errorMsg);
				},
				success: function(respData, textStatus, jqXHR) {
					var access_token = respData.access_token;
					var cuser = respData.user.username;
					var cuserName = respData.user.username;
					var loginuuid = respData.user.uuid;
					var orgName = '';
					var json = respData.user.organizations;
					$.each(json, function(i) {
					    orgName = i;
					});
					
					var date = new Date();
					date.setTime(date.getTime()+(1 * 24 * 60 * 60 * 1000));
					$.cookie('access_token',access_token,{path:'/',expires:date});
					$.cookie('cuser',cuser,{path:'/',expires:date});
					$.cookie('cuserName',cuserName,{path:'/',expires:date});
				  $.cookie('orgName',orgName,{path:'/',expires:date});
				  $.cookie('loginuuid',loginuuid,{path:'/',expires:date});
				  
					window.location.href = 'app_list.html';
				}
		});
	}
}

// ORG管理员登录
function orgAdminLogin() {
	var d = {
		'grant_type':'password',
		'username':$('#username').val(),
		'password':$('#password').val()
	};
	if(loginFormValidate()){
			$('#cont').text('登录中...');
			$('#loginBtn').attr("disabled",true); 
					
			// 登录获取token
			$.ajax({
				url:baseUrl+'/management/token',
				type:'POST',
				data:JSON.stringify(d),
				headers:{
					'Content-Type':'application/json'
				},
				crossDomain:true,
				error: function(respData, textStatus, errorThrown) {
					var str = JSON.stringify(respData.responseText).replace('}','').replace('{','').split(',');
					var tmpArr = new Array();
					var errorMsg = '';
					for(var i = 0; i < str.length; i++) {
						tmpArr.push(str[i].replace(/\\/g,'').replace(/\"/g,'').split(':'));
					}
					for(var i = 0; i < tmpArr.length; i++) {
						if('error_description' == tmpArr[i][0]){
							if(tmpArr[i][1].indexOf("User must be confirmed to authenticate") > -1) {
								errorMsg = '登陆失败，账户未激活!';
								$('#cont').text('登录');
								$('#loginBtn').attr("disabled",false);
							}
							if(tmpArr[i][1].indexOf("invalid username or password") > -1) {
								errorMsg = '登陆失败，用户名或者密码错误!';
								$('#cont').text('登录');
								$('#loginBtn').attr("disabled",false);
							}
						}
					}
					alert(errorMsg);
				},
				success: function(respData, textStatus, jqXHR) {
					var access_token = respData.access_token;
					var cuser = respData.user.username;
					var cuserName = respData.user.username;
					var loginuuid = respData.user.uuid;
					var orgName = '';
					var json = respData.user.organizations;
					$.each(json, function(i) {
					    orgName = i;
					});
					
					var date = new Date();
					date.setTime(date.getTime()+(1 * 24 * 60 * 60 * 1000));
					$.cookie('access_token',access_token,{path:'/',expires:date});
					$.cookie('cuser',cuser,{path:'/',expires:date});
					$.cookie('cuserName',cuserName,{path:'/',expires:date});
				  $.cookie('orgName',orgName,{path:'/',expires:date});
				  $.cookie('loginuuid',loginuuid,{path:'/',expires:date});
				  
					window.location.href = 'app_list.html';
				}
		});
	} else {
		$('#cont').text('登录');
		$('#loginBtn').attr("disabled",false);
	}
}

// APP管理员登录
function appAdminLogin() {
	var appkey = $('#appkey').val();
	// appkey validate
	if('' == appkey){
		$('#appkeyEMsg').text('请输入企业标识！');
		return;
	}
	
	var appkeyRegex = /^(?!-)(?!.*?-$)[a-zA-Z0-9-]+#[0-9a-zA-Z]{1,18}$/;
	if(!appkeyRegex.test(appkey)){
	 	$('#appkeyEMsg').text('只能使用数字,字母,横线,且不能以横线开头和结尾！');
		return;
 	}
  $('appkeyEMsg').text('');
	
	var org = '';
	var app = '';
	
  org = appkey.substring(0, appkey.indexOf('#', 0));
	app = appkey.substring(appkey.indexOf('#', 0) + 1, appkey.length);
	
	var d = {
		'grant_type':'password',
		'username':$('#username').val(),
		'password':$('#password').val()
	};
	
	if(loginFormValidate()){
			// 登录获取token
			$.ajax({
				url:baseUrl+'/' + org + '/' + app + '/token',
				type:'POST',
				data:JSON.stringify(d),
				headers:{
					'Content-Type':'application/json'
				},
				crossDomain:true,
				error: function(respData, textStatus, errorThrown) {
					var str = JSON.stringify(respData.responseText).replace('}','').replace('{','').split(',');
					var tmpArr = new Array();
					var errorMsg = '';
					for(var i = 0; i < str.length; i++) {
						tmpArr.push(str[i].replace(/\\/g,'').replace(/\"/g,'').split(':'));
					}
					for(var i = 0; i < tmpArr.length; i++) {
						if('error_description' == tmpArr[i][0]){
							if(tmpArr[i][1].indexOf("User must be confirmed to authenticate") > -1) {
								errorMsg = '登陆失败，账户未激活!';
							}
							if(tmpArr[i][1].indexOf("invalid username or password") > -1) {
								errorMsg = '登陆失败，用户名或者密码错误!';
							}
						}
					}
					alert(errorMsg);
				},
				success: function(respData, textStatus, jqXHR) {
					var access_token = respData.access_token;
					var cuser = respData.user.username;
					var cuserName = respData.user.username;
					var loginuuid = respData.user.uuid;
					var orgName = '';
					
					var date = new Date();
					date.setTime(date.getTime()+(1 * 24 * 60 * 60 * 1000));
					$.cookie('access_token',access_token,{path:'/',expires:date});
					$.cookie('cuser',cuser,{path:'/',expires:date});
					$.cookie('cuserName',cuserName,{path:'/',expires:date});
				  $.cookie('orgName',org,{path:'/',expires:date});
				  $.cookie('appName',app,{path:'/',expires:date});
				  
					window.location.href = 'appAdmin_profile.html';
				}
		});
	}
}

// 退出登录
function logout() {
	// 销毁cookie
	$.cookie("access_token",null,{path:"/"});
	$.cookie("cuser",null,{path:"/"});
	$.cookie("cuserName",null,{path:"/"});
	$.cookie("orgName",null,{path:"/"});
	
	// 转到登陆页面
	window.location.href = "index.html";
}

// 时间格式转换 1399434332770 -> 
function add0(m){
	return m<10?'0'+m:m;
}
function format(timeST){
	var time = new Date(parseInt(timeST));
	var y = time.getFullYear();
	var m = time.getMonth()+1;
	var d = time.getDate();
	var h = time.getHours();
	var mm = time.getMinutes();
	var s = time.getSeconds();
	return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}

// 登录用户信息
function adminInfo(){
	// get org admin token
	var access_token = $.cookie('access_token');
	var cuser = $.cookie('cuser');
	var orgName = $.cookie('orgName');
	if(!access_token || access_token==''){
		alert('提示\n\n会话已失效,请重新登录!');
		window.location.href = 'index.html';
	} else {
		$.ajax({
			url:baseUrl + '/management/organizations/'+orgName+'/users',
			type:'GET',
			headers:{
				'Authorization':'Bearer '+access_token,
				'Content-Type':'application/json'
			},
			error:function(respData, textStatus, jqXHR){
				alert('提示\n\n数据加载失败,可能是网络原因，请稍后重试!');
			},
			success:function(respData, textStatus, jqXHR){
				$(respData.data).each(function(){
					$('#username').text(this.username);
					$('#email').text(this.email);
				});
			}
		});
	}
}

// 修改登录用户密码表单校验
function updateAdminPasswdFormValidate(){
	// 表单校验
	var oldpassword = $('#oldpassword').val();
	var newpassword = $('#newpassword').val();
	var renewpassword = $('#renewpassword').val();
	
	if('' == oldpassword){
		$('#oldpasswordEMsg').text('原密码不能为空！');
		$('#oldpassword').focus();
		return false;
	}
	$('#oldpasswordEMsg').text('');
	if('' == newpassword){
		$('#newpasswordEMsg').text('新密码不能为空！');
		$('#newpassword').focus();
		return false;
	}
	
	if(newpassword.length < 6 || newpassword.length > 20){
		$('#newpasswordEMsg').text('新密码长度在6-20个字符之间！');
		$('#newpassword').focus();
		return false;
	}
	$('#newpasswordEMsg').text('');
	if(renewpassword != newpassword){
		$('#renewpasswordEMsg').text('两次新密码不一致');
		return false;
	}
	
	$('#renewpasswordEMsg').text('');
	return true;
}

// 修改登录用户密码
validateAccessToken = '';
function updateAdminPasswd(){
	var access_token = $.cookie('access_token');
	var oldpassword = $('#oldpassword').val();
	var	newpassword = $('#newpassword').val();
	var loginuuid = $.cookie('loginuuid');
	var username = $.cookie('cuser');
	var d = {
		'oldpassword':oldpassword,
		'newpassword':newpassword,
	}
	var dtoken = {
		'grant_type':'password',
		'username':username,
		'password':oldpassword
	}
	if(updateAdminPasswdFormValidate()){
		//校验旧密码
		$.ajax({
			url:baseUrl+'/management/token',
			type:'POST',
			data:JSON.stringify(dtoken),
			error: function(jqXHR, textStatus, errorThrown) {
				$('#oldpasswordEMsg').text('原密码不正确!');
			},
			success: function(respData, textStatus, jqXHR) {
				if(respData.access_token == ''){
					return ;
				}
				
				$.ajax({
					url:baseUrl + '/management/users/'+loginuuid+'/password',
					type:'POST',
					data:JSON.stringify(d),
					headers:{
						'Content-Type':'application/json'
					},
					success:function(respData){
						alert('提示!\n\密码修改成功!');
					},
					error:function(data){
						alert('提示!\n\密码修改失败!');
					}
				});
			}
		});
	}
	
}

// app列表页
function toAppList(){
	window.location.href = "app_list.html";
}

// 创建应用表单校验
function createAppFormValidate(){
	// 表单校验
	var appName = $('#appName').val();
	var nick = $('#nick').val();
	var appDesc = $('#appDesc').val();
	
	if('' == appName){
		$('#appNameMsg').text('应用名不能为空！');
		$('#appNameMsg').css('color','red');
		$('#appName').focus();
		return false;
	}
	var appNameRegex = /^[0-9a-zA-Z]*$/;
	if(!appNameRegex.test(appName)){
		$('#appNameMsg').text('应用名称只能是字母,数字或字母数字组合!');
		$('#appNameMsg').css('color','red');
 		$('#appName').focus();
		return false;
 	}
 	$('#appNameMsg').text('输入正确！');
	$('#appNameMsg').css('color','blue');
 	
 	var nickRegex = /^[0-9a-zA-Z-_\u4e00-\u9faf]*$/;
 	if(!nickRegex.test(nick)){
		$('#nickMsg').text('产品名称只能是汉字,字母,数字、横线、下划线及其组合!');
		$('#nickMsg').css('color','red');
 		$('#nick').focus();
		return false;
 	}
 	$('#nickMsg').text('输入正确！');
	$('#nickMsg').css('color','blue');
 
 	var appDescReg = /^[0-9a-zA-Z\u4e00-\u9faf]{0,100}$/;
	if(!appDescReg.test(appDesc)){
		$('#appDescMsg').css('color','red');
		$('#appDesc').focus();
		return false;
	}
	$('#appDescMsg').text('输入正确！');
	$('#appDescMsg').css('color','blue');
 	
	return true;
}

// 创建app
function saveNewApp(){
	// get org admin token
	var access_token = $.cookie('access_token');
	var cuser = $.cookie('cuser');
	var orgName = $.cookie('orgName');
	var appname = $('#appName').val();
	var allow_open_registration = $('input[name="allow_open_registration"]:checked').val();
	var appDesc = $('#appDesc').val();
	
	var dataBody = {
		'name':appname,
		'allow_open_registration':allow_open_registration,
		'appDesc':appDesc
	};
	
	if(!access_token || access_token==''){
		alert('提示\n\n会话已失效,请重新登录!');
		window.location.href = 'index.html';
	} else {
		if(createAppFormValidate()){
			// 保存数据
			$.ajax({
				url:baseUrl+'/management/organizations/'+ orgName +'/applications',
				type:'POST',
				headers:{
					'Authorization':'Bearer '+access_token,
					'Content-Type':'application/json'
				},
				data:JSON.stringify(dataBody),
				error: function(jqXHR, textStatus, errorThrown) {
					alert('提示\n\n应用创建失败!\n更换应用名?');
				},
				success: function(respData, textStatus, jqXHR) {
					alert('app创建成功!');
					$(respData.entities).each(function(){
						window.location.href = 'app_profile.html?appUuid=' + this.uuid;
					});
				}
			});
		}
	}
}

// 分页基础数据
var cursors = {};
var pageNo = 1;
cursors[1] = '';
var total = 0;

// 分页条更新
function updateChatroomPageStatus(){
	var pageLi = $('#pagina').find('li');
	
	// 获取token
	var access_token = $.cookie('access_token');
	var cuser = $.cookie('cuser');
	var orgName = $.cookie('orgName');
	if(!access_token || access_token==''){
		alert('提示\n\n会话已失效,请重新登录!');
		window.location.href = 'login.html';
	} else {
		$.ajax({
			url:baseUrl+'/'+ orgName +'/' + appUuid + '/chatrooms?limit=1000',
			type:'GET',
			headers:{
				'Authorization':'Bearer '+access_token,
				'Content-Type':'application/json'
			},
			error: function(respData, textStatus, jqXHR) {
				//alert('提示\n\n数据加载失败,可能是网络原因，请稍后重试!');
			},
			success: function(respData, textStatus, jqXHR) {
				total = respData.count;
				var totalPage = (total%10==0)?(parseInt(total/10)):(parseInt(total/10)+1);
				
				// 首页
				if(pageNo == 1){
					if(totalPage == 1){
						$(pageLi[0]).hide();
						$(pageLi[1]).hide();
					} else {
						$(pageLi[0]).hide();
						$(pageLi[1]).show();
					}
					// 尾页
				} else if(totalPage ==  pageNo){
					$(pageLi[0]).show();
					$(pageLi[1]).hide();
				}
			}
		});
	}
}

// 分页条更新
function updateUsersPageStatus(){
	var pageLi = $('#paginau').find('li');
	
	// 获取token
	var access_token = $.cookie('access_token');
	var cuser = $.cookie('cuser');
	var orgName = $.cookie('orgName');
	if(!access_token || access_token==''){
		alert('提示\n\n会话已失效,请重新登录!');
		window.location.href = 'login.html';
	} else {
		$.ajax({
			url:baseUrl+'/'+ orgName +'/' + appUuid + '/users?limit=1000',
			type:'GET',
			headers:{
				'Authorization':'Bearer '+access_token,
				'Content-Type':'application/json'
			},
			error: function(jqXHR, textStatus, errorThrown) {
				//alert('提示\n\n数据加载失败,可能是网络原因，请稍后重试!');
			},
			success: function(respData, textStatus, jqXHR) {
				total = respData.count;
				var totalPage = (total%10==0)?(parseInt(total/10)):(parseInt(total/10)+1);
				
				// 首页
				if(pageNo == 1){
					if(totalPage == 1){
						$(pageLi[0]).hide();
						$(pageLi[1]).hide();
					} else {
						$(pageLi[0]).hide();
						$(pageLi[1]).show();
					}
					// 尾页
				} else if(totalPage ==  pageNo){
					$(pageLi[0]).show();
					$(pageLi[1]).hide();
				}
			}
		});
	}
}

// 获取app列表
function getAppList(){
	// get org admin token
	var access_token = $.cookie('access_token');
	var cuser = $.cookie('cuser');
	var orgName = $.cookie('orgName');
	userCount = 0;
	if(!access_token || access_token=='') {
		alert('提示\n\n会话已失效,请重新登录!');
		window.location.href = 'login.html';
	} else {
		$.ajax({
			url:baseUrl+'/management/organizations/'+ orgName +'/applications',
			type:'GET',
			crossDomain:true,
			headers:{
				'Authorization':'Bearer '+access_token,
				'Content-Type':'application/json'
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert('提示\n\n数据加载失败,可能是网络原因，请稍后重试!');
			},
			success: function(respData, textStatus, jqXHR) {
				var appData = jQuery.parseJSON(JSON.stringify(respData.data));
				var uuidArr = [];
				var nameArr = [];
				$.each(appData,function(key,value){
					nameArr.push(key);
					uuidArr.push(value);
					key = key.substring(key.indexOf('/')+1);
					userCount = 0;
					// 获取每个app的用户数
					$.ajax({
						url:baseUrl+'/'+ orgName +'/' + value + '/counters?counter=application.collection.users&pad=true',
						type:'GET',
						async:false,
						headers:{
							'Authorization':'Bearer '+access_token,
							'Content-Type':'application/json'
						},
						error: function(jqXHR, textStatus, errorThrown) {
							alert('提示\n\n数据获取失败!');
						},
						success: function(respData, textStatus, jqXHR) {
							$.each(respData.counters,function(){
								if(this.values.lenght == 0){
									userCount = 0;
								} else {
									$.each(this.values,function(){
										userCount = this.value;
									});
								}
							});
						}
					});
					
					var option = '<tr><td class="text-center"><a href="app_profile.html?appUuid='+value+'">'+key+'</a></td>'+
						 	'<td class="text-center">'+userCount+'</td>'+
					   	//'<td class="text-center">800/500</td>'+
						 	//'<td class="text-center">800/500</td>'+
						 	//'<td class="text-center">800/500</td>'+
						 	'<td class="text-center">上线运行中</td>'+
				 		'</tr>';
					$('#appListBody').append(option);
				});
				
				// 无数据
				var tbody = document.getElementsByTagName("tbody")[0];
				if(!tbody.hasChildNodes()){
					var option = '<tr><td class="text-center" colspan="7">无数据!</td></tr>';
					$('#appListBody').append(option);
				}
			}
		});
	}
}

// 删除某个app
function deleteApp(appUuid){
	var access_token = $.cookie('access_token');
	var cuser = $.cookie('cuser');
	var orgName = $.cookie('orgName');
	if(confirm('确认要删除这个app吗?')){
		$.ajax({
			url:baseUrl+'/management/organizations/'+ orgName +'/applications/' + appUuid,
			type:'DELETE',
			headers:{
				'Authorization':'Bearer '+access_token,
				'Content-Type':'application/json'
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert('提示\n\n数据加载失败,可能是网络原因，请稍后重试!');
			},
			success: function(respData, textStatus, jqXHR) {
				alert('提示\n\napp删除成功!');
				window.location.href = 'app_list.html';
			}
		});
	}
}

// 获取app详情:org管理员登录
function getAppProfile(appUuid){
	// 获取token
	var access_token = $.cookie('access_token');
	var cuser = $.cookie('cuser');
	var orgName = $.cookie('orgName');
	if(!access_token || access_token==''){
		alert('提示\n\n会话已失效,请重新登录!');
		window.location.href = 'login.html';
	} else {
		// 获取app基本信息
		$.ajax({
			url:baseUrl + '/management/organizations/' + orgName + '/applications/' + appUuid,
			type:'GET',
			headers:{
				'Authorization':'Bearer ' + access_token,
				'Content-Type':'application/json'
			},
			error: function(jqXHR, textStatus, errorThrown) {
				//alert('提示\n\n数据加载失败,可能是网络原因，请稍后重试!');
			},
			success: function(respData, textStatus, jqXHR) {
				$(respData.entities).each(function(){
					var uuid = this.uuid;
					var name = this.name;
					var created = format(this.created);
					var modified = format(this.modified);
					var applicationName = this.applicationName;
					var organizationName = this.organizationName;
					var allowOpen = this.allow_open_registration?'开放注册':'授权注册';
					var tag = this.allow_open_registration?'0':'1';
					$('#appKey').text(organizationName+'#'+applicationName);
					$('#xmlandroidAppkey').text(organizationName+'#'+applicationName);
					//$('#xmliosAppkey').text(organizationName+'#'+applicationName);
					$('#created').text(created);
					$('#modified').text(modified);
					$('#allowOpen').text(allowOpen);
					$('#allowOpenHdd').val(tag);
				});
				
				$('#showName').text(respData.applicationName);
			}
		});
		
		// 获取app credential
		//http://a1.easemob.com:80/management/organizations/belo/applications/myapptest/credentials
		$.ajax({
			url: baseUrl + '/' + orgName + '/' + appUuid + '/credentials',
			type:'GET',
			headers:{
				'Authorization':'Bearer ' + access_token,
				'Content-Type':'application/json'
			},
			error: function(jqXHR, textStatus, errorThrown) {
				//alert('提示\n\n数据加载失败,可能是网络原因，请稍后重试!');
			},
			success: function(respData, textStatus, jqXHR) {
				$('#client_id').text(respData.credentials.client_id);
				$('#client_secret').text(respData.credentials.client_secret);
			}
		});
	}
}

// 获取app详情:app管理员登录
function getAppProfileforAppAdmin(appUuid){
	// 获取token
	var access_token = $.cookie('access_token');
	var cuser = $.cookie('cuser');
	var orgName = $.cookie('orgName');
	if(!access_token || access_token==''){
		alert('提示\n\n会话已失效,请重新登录!');
		window.location.href = 'login.html';
	} else {
		$.ajax({
			url:baseUrl+'/management/organizations/'+ orgName +'/applications/' + appUuid,
			type:'GET',
			headers:{
				'Authorization':'Bearer '+access_token,
				'Content-Type':'application/json'
			},
			error: function(jqXHR, textStatus, errorThrown) {
				//alert('提示\n\n数据加载失败,可能是网络原因，请稍后重试!');
			},
			success: function(respData, textStatus, jqXHR) {
				$(respData.entities).each(function(){
					var uuid = this.uuid;
					var name = this.name;
					var created = format(this.created);
					var modified = format(this.modified);
					var applicationName = this.applicationName;
					var organizationName = this.organizationName;
					var allowOpen = this.allow_open_registration?'自由注册':'仅管理员可注册';
					var tag = this.allow_open_registration?'0':'1';
					$('#appKey').text(organizationName+'#'+applicationName);
					$('#xmlandroidAppkey').text(organizationName+'#'+applicationName);
					$('#xmliosAppkey').text(organizationName+'#'+applicationName);
					$('#created').text(created);
					$('#modified').text(modified);
					$('#allowOpen').text(allowOpen);
					$('#allowOpenHdd').val(tag);
				});
				
				$('#showName').text(respData.applicationName);
			}
		});
	}
}

// 切换app注册模式
function changeAllowOpen(){
	var access_token = $.cookie('access_token');
	var orgName = $.cookie('orgName');
	var appKey = $('#appKey').text().replace('#','/');
	var tag = $('#allowOpenHdd').val();

	if(tag == 0){
		allow_open_registration = false;
	} else {
		allow_open_registration = true;
	}
	
	var d = {
		'allow_open_registration':allow_open_registration	
	}

	$.ajax({
		url:baseUrl+'/'+ appKey,
		type:'PUT',
		data:JSON.stringify(d),
		headers:{
			'Authorization':'Bearer ' + access_token,
			'Content-Type':'application/json'
		},
		success:function(respData){
			alert('提示!\n\模式切换成功!');
			//toApppofile();
			$(respData.entities).each(function(){
				var tag = this.allow_open_registration?'0':'1';
				$('#allowOpenHdd').val(tag);
				if(this.allow_open_registration){
					$('#allowOpen').text('开放注册');	
				}else {
					$('#allowOpen').text('授权注册');
				}
			});
		},
		error:function(data){
			alert('提示!\n\模式切换失败!');
		}
	});
	
}

// 创建app管理员
// 用户名
function onBlurCheckUsername(appAdminUsername){
	var appAdminUsernameReg =  /^[0-9a-zA-Z]{1,18}$/;
	if('' == appAdminUsername) {
		$('#appAdminUsernameMsg').text('请输入用户名');
		return false;
	}
	
	if(!appAdminUsernameReg.test(appAdminUsername)){
		$('#appAdminUsernameMsg').text('1-18位长度字符(字母或数字)！');
		return false;
	}
	
	$('#appAdminUsernameMsg').text('');
	return true;
}
// 一次密码
function onBlurCheckPassword(password){
	var passwordReg =  /^[\s\S]{6,14}$/;
	if('' == password) {
		$('#passwordMsg').text('请输入密码');
		return false;
	}
	if(!passwordReg.test(password)){
		$('#passwordMsg').text('6~14位长度任意字符');
		return false;
	}
	$('#passwordMsg').text('');
	return true;
}

// 二次密码
function onBlurCheckConfirmPassword(confirmPassword){
	var password = $('#password').val();
	if('' == confirmPassword) {
		$('#confirmPasswordMsg').text('请再次输入密码！');
		return false;
	}
	if(password != confirmPassword){
		$('#confirmPasswordMsg').text('您两次输入的账号密码不一致!');
		return false;
	}
	
	$('#confirmPasswordMsg').text('');
	return true;
}

// 邮箱
function onBlurCheckEmail(email){
	var emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	if('' == email) {
		$('#emailMsg').text('请输入邮箱');
		return false;
	}
	if(!emailReg.test(email)){
		$('#emailMsg').text('邮箱账号格式非法');
		return false;
	}

	$('#emailMsg').text('');
	return true;
} 
// 提交表单
function saveNewAppAdmin(appUuid){
	var appAdminUsername = $('#appAdminUsername').val();
	var password = $('#password').val();
	var confirmPassword = $('#confirmPassword').val();
	var email = $('#email').val();

	var token = $.cookie('access_token');
	var orgName = $.cookie('orgName');

	var flag = onBlurCheckUsername(appAdminUsername) && onBlurCheckPassword(password) && onBlurCheckConfirmPassword(confirmPassword) &&onBlurCheckEmail(email);
	if(flag){
		// Create a user
		var d ={
			username:appAdminUsername,
			password:password,
			email:email
		};
		$.ajax({
			url:baseUrl + '/' + orgName + '/' + appUuid + '/users',
			type:'POST',
			data:JSON.stringify(d),
			headers:{
				'Authorization':'Bearer ' + token,
				'Content-Type':'application/json'
			},
			success:function(respData){
				// update role
				$.ajax({
					url:baseUrl + '/' + orgName + '/' + appUuid + '/users/'+ appAdminUsername +'/roles/admin',
					type:'POST',
					data:{},
					headers:{
						'Authorization':'Bearer ' + token,
						'Content-Type':'application/json'
					},
					success:function(respData){
						// if success , to app user list
						alert('添加管理员成功!')
						toAppUsersPage();
					},
					error:function(data){
						// if failure , delete the user
						$.ajax({
							url:baseUrl + '/' + orgName + '/' + appUuid + '/users/'+ appAdminUsername,
							type:'DELETE',
							headers:{
								'Authorization':'Bearer ' + token,
								'Content-Type':'application/json'
							},
							success:function(respData){
								alert('添加管理员失败!')
							},
							error:function(data){
							}
						});	
					}
				});	
			},
			error:function(data){
				alert('提示!\n\n添加管理员失败!');
			}
		});	
	}
}

// 获取某个app下的用户
function getAppUserList(appUuid,pageAction){
	// 获取token
	var access_token = $.cookie('access_token');
	var cuser = $.cookie('cuser');
	var orgName = $.cookie('orgName');
	if(!access_token || access_token==''){
		alert('提示\n\n会话已失效,请重新登录!');
		window.location.href = 'login.html';
	} else {
		if('next' == pageAction){
			pageNo += 1;
		} else if('forward' == pageAction){
			pageNo -= 1;
		}
		var temp = '';
		if(typeof(pageAction)!='undefined' && pageAction != ''){	
			temp = '&cursor='+cursors[pageNo];
		}
		$.ajax({
			url:baseUrl+'/'+ orgName +'/' + appUuid + '/users?limit=10' + temp,
			type:'GET',
			headers:{
				'Authorization':'Bearer '+access_token,
				'Content-Type':'application/json'
			},
			error: function(jqXHR, textStatus, errorThrown) {
			},
			success: function(respData, textStatus, jqXHR) {
				// 缓存游标
				if(pageAction!='forward'){
					if(respData.cursor){
						cursors[pageNo+1] = respData.cursor;
					}else{
						cursors[pageNo+1] = null;
					}
				}
				
				$('tbody').html('');
				$(respData.entities).each(function(){
					var username = this.username;
					var created = format(this.created);
					var option = '<tr>'+
								'<td class="text-center">'+username+'</td>'+
							 	'<td class="text-center">'+created+'</td>'+
							 	'<td class="text-center"><a href="#passwordMondify" id="passwdMod${status.index }" onclick="setUsername(\'' + appUuid + '\',\''+ username +'\');" data-toggle="modal" role="button" class="btn btn-mini btn-info">重置密码</a>'+
							 	' | <a  class="btn btn-mini btn-info" href="javascript:deleteAppUser(\''+appUuid+'\',\''+username+'\')">删除</a></td>'+
					 		'</tr>';
					$('#appUserBody').append(option);
				});
				
				// 无数据
				var tbody = document.getElementsByTagName("tbody")[0];
				if(!tbody.hasChildNodes()){
					var option = '<tr><td class="text-center" colspan="7">无数据!</td></tr>';
					$('#appUserBody').append(option);
					var pageLi = $('#paginau').find('li');
					for(var i=0;i<pageLi.length;i++){
						$(pageLi[i]).hide();
					}
					
				} else {
					updateUsersPageStatus();	
				}
			}
		});
	}
}

function setUsername(appUuid,username){
	$('#usernameMondify').val(username);
	$('#appUuidHidd').val(appUuid);
	$('#pwdMondify').val('');
}

// 重置app用户密码
function updateAppUserPassword(){
	var username = $('#usernameMondify').val();
	var orgName = $.cookie('orgName');
	var cname = $.cookie('cuser');
	var token = $.cookie('access_token');
	var appUuid = $('#appUuidHidd').val();
	
  var pwdMondifyVal = $('#pwdMondify').val();
  var pwdMondifytwoVal = $('#pwdMondifytwo').val();
	
	var passwordReg = /^[0-9a-zA-Z]{1,100}$/;
  if(pwdMondifyVal == ''){
  	$('#pwdMondify').focus();
		$('#pwdMondifySpan').html('请输入新密码');
		return;
	} else if(!passwordReg.test(pwdMondifyVal)){
		$('#pwdMondify').focus();
		$('#pwdMondifySpan').html('只能输入1~100位字母或者数字');
		return;
	} else {
		$('#pwdMondifySpan').html('');
		
		if(pwdMondifytwoVal == ''){
			$('#pwdMondifytwo').focus();
			$('#pwdMondifytwoSpan').html('请再次输入新密码');
			return;
		}else if(pwdMondifytwoVal != pwdMondifyVal){
			$('#pwdMondifytwo').focus();
			$('#pwdMondifytwoSpan').html('两次密码不一致');
			return;
		}else {
			$('#pwdMondifySpan').text('');
			$('#pwdMondifytwoSpan').text('');
			
			var d ={
				newpassword:pwdMondifyVal
			};
			$.ajax({
				url:baseUrl + '/' + orgName + '/' + appUuid + '/users/' + username + '/password',
				type:'POST',
				data:JSON.stringify(d),
				headers:{
					'Authorization':'Bearer ' + token,
					'Content-Type':'application/json'
				},
				success:function(respData){
					alert('提示!\n\密码重置成功!');
					$('#pwdMondifySpan').text('');
					$('#pwdMondifytwoSpan').text('');
			    $('#pwdMondify').val('');
			    $('#pwdMondifytwo').val('');
					$('#passwordMondify').modal('hide');
				},
				error:function(data){
					alert('提示!\n\密码重置失败!');
				}
			});
		}
		
	}
}

// 删除app下的用户
function deleteAppUser(appUuid,username){
	var access_token = $.cookie('access_token');
	var orgName = $.cookie('orgName');
	if(confirm('确定要删除此用户吗?')){
		$.ajax({
			url:baseUrl + '/' + orgName +'/' + appUuid + '/users/' + username,
			type:'DELETE',
			headers:{
				'Authorization':'Bearer ' + access_token,
				'Content-Type':'application/json'
			},		
			error:function(){
				alert('提示\n\n删除失败!');
			},
			success:function(respData){
				alert('提示\n\n删除成功!');
				window.location.href = 'app_users.html?appUuid='+appUuid;
			}
		});
	}
}

// 获取app群组列表
function getAppChatrooms(appUuid,pageAction){
	// 获取token
	var access_token = $.cookie('access_token');
	var cuser = $.cookie('cuser');
	var orgName = $.cookie('orgName');
	if(!access_token || access_token==''){
		alert('提示\n\n会话已失效,请重新登录!');
		window.location.href = 'login.html';
	} else {
		if('forward' == pageAction){
			pageNo += 1;
		} else if('next' == pageAction){
			pageNo -= 1;
		}
		
		var tmp = '';
		if(typeof(pageAction)!='undefined' && pageAction != ''){	
			tmp = '&cursor=' + cursors[pageNo];
		}

		$.ajax({
			url:baseUrl+'/'+ orgName +'/' + appUuid + '/chatrooms?limit=10' + tmp,
			type:'GET',
			headers:{
				'Authorization':'Bearer '+access_token,
				'Content-Type':'application/json'
			},		
			error:function(respData){
				alert('提示\n\n数据加载失败,可能是网络原因，请稍后重试!');
			},
			success:function(respData){
				// 缓存游标,下次next时候存新的游标
				if(pageAction!='forward'){
					cursors[pageNo+1] =	respData.cursor;
				} else {
					cursors[pageNo+1] = null;
				}
				
				$('tbody').html('');
				$(respData.entities).each(function(){
						var created = format(this.created);
						var groupname = this.groupname;
						var groupuuid = this.uuid;
						var admin = this.admin;
						var desc = this.desc;
						var grouptype = this.grouptype;
						if(this.grouptype == 'workgroup'){
							grouptype = '工作组';
						} else {
							grouptype = '临时组';
						}
						var members = this.members;
						var option = '<tr>'+
							'<td class="text-center">'+groupname+'</td>'+
						 	'<td class="text-center">'+admin+'</td>'+
					   	'<td class="text-center">'+members.length+'</td>'+
						 	'<td class="text-center">'+desc+'</td>'+
						 	'<td class="text-center">'+grouptype+'</td>'+
						 	'<td class="text-center">'+created+'</td>'+
						 	'<td class="text-center"><a href="javascript:deleteAppChatroom(\''+appUuid+'\',\''+groupuuid+'\')">删除</a></td>'+
				 		'</tr>';
						$('#appChatroomBody').append(option);
				});
				
				var tbody = document.getElementsByTagName("tbody")[0];
				if(!tbody.hasChildNodes()){
					var option = '<tr><td class="text-center" colspan="7">无数据!</td></tr>';
					$('#appChatroomBody').append(option);
					var pageLi = $('#pagina').find('li');
					for(var i=0;i<pageLi.length;i++){
						$(pageLi[i]).hide();
					}
				} else {
					updateChatroomPageStatus();	
				}
			}
		});
	}
	
}

// 删除app下的群组
function deleteAppChatroom(appUuid,groupuuid){
	var access_token = $.cookie('access_token');
	var orgName = $.cookie('orgName');
	
	if(confirm('确定要删除此群组吗?')){
		$.ajax({
			url:baseUrl + '/' + orgName +'/' + appUuid + '/chatrooms/' + groupuuid,
			type:'DELETE',
			headers:{
				'Authorization':'Bearer ' + access_token,
				'Content-Type':'application/json'
			},
			error:function(){
				alert('提示\n\n删除失败!');
			},
			success:function(respData){
				alert('提示\n\n删除成功!');
				window.location.href = 'app_chatrooms.html?appUuid='+appUuid;
			}
		});
	}
}

//============================================================证书 ========================================================================
// 上传证书



// 查询证书信息
function getAppCredentials(appUuid){
	var access_token = $.cookie('access_token');
	var orgName = $.cookie('orgName');
	$.ajax({
			url:baseUrl+'/'+ orgName +'/' + appUuid + '/notifiers',
			type:'GET',
			headers:{
				'Authorization':'Bearer '+access_token,
				'Content-Type':'application/json'
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert('提示\n\n数据加载失败,可能是网络原因，请稍后重试!');
			},
			success: function(respData, textStatus, jqXHR) {
				$('#appCredentialBody').html('');
				
				$(respData.entities).each(function(){
					var name = this.name;
					var credentialId = this.uuid;
					var passphrase = this.passphrase;
					var environment = '';
					if(this.environment == 'DEVELOPMENT') {
						environment = '开发';
					} else if(this.environment == 'PRODUCTION'){
						environment = '生产';
					}
					
					var created = format(this.created);
					var modified = format(this.modified);
					var option = '<tr>'+
							'<td class="text-center">'+name+'</td>'+
						 	'<td class="text-center">'+environment+'</td>'+
					   	'<td class="text-center">'+created+'</td>'+
					   	'<td class="text-center">'+modified+'</td>'+
					   	'<td class="text-center"><a href="javascript:deleteAppCredential(\''+ credentialId + '\',\''+ appUuid +'\')">删除</a></td>'+
				 		'</tr>';
						$('#appCredentialBody').append(option);
				});
				
				$('#showName').text(respData.applicationName);
				$('#fileAppKey').text(respData.applicationName);
				
				if(respData.entities.length == 0){
					var option = '<tr><td class="text-center" colspan="6">暂无证书!</td></tr>';
					$('#appCredentialBody').append(option);
				}
			}
		});
}

// 删除开发者推送证书
function deleteAppCredential(credentialId,appUuid){
	var access_token = $.cookie('access_token');
	var orgName = $.cookie('orgName');
	
	if(confirm('确定删除这个证书吗?')){
		$.ajax({
			url:baseUrl+'/'+ orgName +'/' + appUuid + '/notifiers/' + credentialId,
			type:'DELETE',
			headers:{
				'Authorization':'Bearer ' + access_token,
				'Content-Type':'application/json'
			},
			error: function(jqXHR, textStatus, errorThrown) {
			},
			success: function(respData, textStatus, jqXHR) {
					alert('证书已删除!')	
					getAppCredentials(appUuid);
			}
		});	
	}
}
//=====================================================================================================================================
