(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{124:function(e,t,n){"use strict";n.r(t);var s=n(0),a=n.n(s),c=n(9),r=n.n(c),i=(n(86),n(19)),o=n(12),u=n(26),h=n(24),d=n(69),l=n(70),j=n.n(l),m=function(e){Object(u.a)(n,e);var t=Object(h.a)(n);function n(){var e;return Object(i.a)(this,n),(e=t.call(this)).socket=void 0,e._state=void 0,e.socket=j()("http://".concat(window.location.host.split(":")[0],":3001")),e.socket.on("connect",(function(){return e.emit("reload")})),e.socket.on("disconnect",(function(){return e.emit("reload")})),e.socket.on("welcome",(function(t){e.state=t,e.emit("reload")})),e.socket.on("incorrect-password",(function(){return e.emit("incorrect-password")})),e.socket.on("chat-message",(function(t){e.state&&e.emit("chat-message",t)})),e.socket.on("user-join",(function(t){var n;e.emit("announcement","".concat(t," has joined the chat!")),null===(n=e.state)||void 0===n||n.users.push(t),e.emit("reload")})),e.socket.on("user-leave",(function(t){var n;e.emit("announcement","".concat(t," has left the chat!")),e.state&&(e.state.users=null===(n=e.state)||void 0===n?void 0:n.users.filter((function(e){return e!==t})),e.emit("reload"))})),e}return Object(o.a)(n,[{key:"state",get:function(){return this._state},set:function(e){this._state=e}},{key:"connected",get:function(){return this.socket&&this.socket.active}},{key:"authenticated",get:function(){return void 0!==this.state}},{key:"requestLogin",value:function(e,t){this.socket.emit("login-request",{username:e,password:t})}},{key:"sendMessage",value:function(e){this.socket.emit("chat-message",e)}}]),n}(d.EventEmitter),p=n(4),b=n(125),f=n(159),v=n(160),g=n(165),O=n(161),k=n(166),x=n(162),y=n(6),w=Object(p.a)({root:{color:"#ff0000"}})(b.a),S=function(e){Object(u.a)(n,e);var t=Object(h.a)(n);function n(e){var s;return Object(i.a)(this,n),(s=t.call(this,e)).state={username:"",password:"",error:""},s.props.chathandler.on("incorrect-password",(function(){s.setState({username:s.state.username,password:"",error:"Your password is incorrect!"})})),s}return Object(o.a)(n,[{key:"render",value:function(){var e=this;return Object(y.jsx)(f.a,{container:!0,spacing:0,direction:"column",alignItems:"center",justifyContent:"center",style:{minHeight:"100vh"},children:Object(y.jsxs)(v.a,{elevation:10,style:{padding:50,height:320,width:320,margin:"20px auto"},children:[Object(y.jsx)("h2",{children:"LAET Chat - Sign In"}),Object(y.jsxs)("form",{onSubmit:function(t){t.preventDefault();var n=e.state,s=n.username,a=n.password;e.props.chathandler.requestLogin(s,a)},children:[Object(y.jsx)(g.a,{label:"Username",value:this.state.username,onChange:function(t){return e.setState({username:t.target.value,password:e.state.password,error:""})},fullWidth:!0,required:!0}),Object(y.jsx)(g.a,{label:"Password",type:"password",value:this.state.password,onChange:function(t){return e.setState({username:e.state.username,password:t.target.value,error:""})},fullWidth:!0,required:!0}),Object(y.jsx)(O.a,{control:Object(y.jsx)(k.a,{name:"checkedB",color:"primary"}),label:"Remember me"}),Object(y.jsx)(x.a,{type:"submit",variant:"contained",color:"primary",fullWidth:!0,children:"Sign In"})," ",this.state.error?Object(y.jsx)(w,{children:this.state.error}):Object(y.jsx)(y.Fragment,{})]})]})})}}]),n}(a.a.Component),C=n(164),I=n(163),M=function(e){return Object(y.jsxs)(b.a,{children:[Object(y.jsx)("b",{children:e.sender}),": ",e.content]})},q=function(e){Object(u.a)(n,e);var t=Object(h.a)(n);function n(e){var s;return Object(i.a)(this,n),(s=t.call(this,e)).state={input:"",messages:[]},s}return Object(o.a)(n,[{key:"componentDidMount",value:function(){this.props.chathandler.on("chat-message",this.appendMessage.bind(this)),this.props.chathandler.on("announcement",this.appendAnnouncement.bind(this))}},{key:"appendMessage",value:function(e){var t=this.state,n=t.input,s=t.messages,a=e.sender,c=e.content;s.push(Object(y.jsx)(M,{sender:a,content:c})),this.setState({input:n,messages:s})}},{key:"appendAnnouncement",value:function(e){var t=this.state,n=t.input,s=t.messages;s.push(Object(y.jsx)(b.a,{children:Object(y.jsx)("b",{children:e})})),this.setState({input:n,messages:s})}},{key:"setInput",value:function(e){this.setState({input:e,messages:this.state.messages})}},{key:"render",value:function(){var e=this;return Object(y.jsxs)(f.a,{container:!0,direction:"column",spacing:0,alignItems:"center",justifyContent:"center",children:[this.state.messages.map((function(e,t){return Object(y.jsxs)(f.a,{item:!0,children:[" ",e," "]},t)})),Object(y.jsx)("form",{onSubmit:function(t){t.preventDefault();var n=e.state.input;e.props.chathandler.sendMessage(n),e.setInput("")},children:Object(y.jsxs)(f.a,{item:!0,children:[Object(y.jsx)(g.a,{id:"outlined-basic",label:"Message",value:this.state.input,variant:"outlined",onChange:function(t){return e.setInput(t.target.value)}}),Object(y.jsx)(x.a,{variant:"contained",type:"submit",color:"primary",style:{width:80,height:50},endIcon:Object(y.jsx)(I.a,{}),children:"Send"})]})})]})}}]),n}(a.a.Component),D=new m,F=function(e){Object(u.a)(n,e);var t=Object(h.a)(n);function n(e){var s;return Object(i.a)(this,n),(s=t.call(this,e)).state={authenticated:!1,connected:!1},s}return Object(o.a)(n,[{key:"componentDidMount",value:function(){D.on("reload",this.reload.bind(this))}},{key:"reload",value:function(){var e=D.authenticated,t=D.connected;this.setState({authenticated:e,connected:t})}},{key:"render",value:function(){return this.state.connected?this.state.authenticated?Object(y.jsx)(q,{chathandler:D}):Object(y.jsx)(S,{chathandler:D}):Object(y.jsx)(f.a,{container:!0,alignItems:"center",justifyContent:"center",spacing:0,direction:"column",style:{minHeight:"100vh"},children:Object(y.jsx)(C.a,{})})}}]),n}(a.a.Component),L=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,168)).then((function(t){var n=t.getCLS,s=t.getFID,a=t.getFCP,c=t.getLCP,r=t.getTTFB;n(e),s(e),a(e),c(e),r(e)}))};r.a.render(Object(y.jsx)(a.a.StrictMode,{children:Object(y.jsx)(F,{})}),document.getElementById("root")),L()},86:function(e,t,n){}},[[124,1,2]]]);
//# sourceMappingURL=main.ec06cd73.chunk.js.map