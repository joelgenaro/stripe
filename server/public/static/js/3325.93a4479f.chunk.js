"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[3325],{32517:function(e,s,t){t(47313);s.Z=t.p+"static/media/google.87be52cb772ef2969ce42e13a2d37b7c.svg"},37074:function(e,s,t){t.d(s,{Z:function(){return r}});var a=t(21366),n=t(46417),r=function(e){var s=e.className,t=e.name,r=e.icon,i=e.type,o=e.placeholder,l=e.onChange,c=e.onBlur,d=e.readOnly,u=e.required,m=e.value,h=e.disabled,p=(e.touched,e.errors),g=void 0===p?"":p;return(0,n.jsxs)(a.Z.Group,{className:["position-relative "+s],children:[(0,n.jsx)("i",{className:r}),(0,n.jsx)(a.Z.Control,{type:i,name:t,placeholder:o,readOnly:d,required:u,onChange:l,onBlur:c,disabled:h,value:m,isInvalid:!!g[t]}),(0,n.jsx)(a.Z.Control.Feedback,{type:"invalid",children:g[t]})]})}},23325:function(e,s,t){t.r(s),t.d(s,{default:function(){return k}});var a=t(74165),n=t(15861),r=t(1413),i=t(70885),o=t(47313),l=t(58467),c=t(2135),d=t(85554),u=t(28337),m=t(34491),h=t(90182),p=t(7410),g=t(3463),v=t(22102),f=t(21366),x=t(93298),w=t(37074),y=t(12840),j=t(28831);var S=t.p+"static/media/illustration3.57627c48061a398b2db9fc3b9578c53a.svg",b=t(32517),C=t(24751),Z=t(46417),k=function(){var e=(0,l.s0)(),s=(0,d.I0)(),t=(0,o.useState)(0),k=(0,i.Z)(t,2),N=k[0],H=k[1],q=(0,o.useState)(60),E=(0,i.Z)(q,2),A=E[0],I=E[1],L=(0,o.useState)({}),B=(0,i.Z)(L,2),O=B[0],P=B[1],F=(0,o.useState)({author:"",description:"",keywords:"",other:"",slug:"",title:"",viewport:""}),R=(0,i.Z)(F,2),W=R[0],z=R[1];(0,o.useEffect)((function(){var e=document.location.pathname.slice(1);""===e&&(e="home");var s={url:e};C.Z.post("/admin/seos/url",s).then((function(e){var s=e.data;s.success&&s.data?(z((0,r.Z)((0,r.Z)({},W),{},{author:s.data.author,description:s.data.description,keywords:s.data.keywords,other:s.data.other,slug:s.data.slug,title:s.data.title,viewport:s.data.viewport})),document.title=s.data.title):z((0,r.Z)((0,r.Z)({},W),{},{author:"AnswerSheet",description:"AnswerSheet has HSC study guides, practice questions and exams to help you achieve a band 6 in your HSC subjects. We have syllabus summaries, practice HSC exam-style questions, and sample answers to show you how to write band 6 responses.",keywords:"HSC notes, HSC study guides, syllabus summaries, dot point notes, HSC summaries, HSC English, HSC Physics, HSC maths, HSC Chemistry, HSC Biology",other:"",slug:"",title:"AnswerSheet - Login",viewport:"width=device-width, initial-scale=1.0"}))})).catch((function(e){z((0,r.Z)((0,r.Z)({},W),{},{author:"AnswerSheet",description:"AnswerSheet has HSC study guides, practice questions and exams to help you achieve a band 6 in your HSC subjects. We have syllabus summaries, practice HSC exam-style questions, and sample answers to show you how to write band 6 responses.",keywords:"HSC notes, HSC study guides, syllabus summaries, dot point notes, HSC summaries, HSC English, HSC Physics, HSC maths, HSC Chemistry, HSC Biology",other:"",slug:"",title:"AnswerSheet - Login",viewport:"width=device-width, initial-scale=1.0"}))}))}),[]),(0,o.useEffect)((function(){var e,s=null!==(e=window.localStorage.getItem("leftSeconds"))&&void 0!==e?e:60;s<60&&s>0&&(H(5),I(s))}),[]);var G=g.Ry({email:g.Z_("Enter your email.").email("Enter a valid email.").required("Email is required."),password:g.Z_("Enter your password.").required("Password is required.")}),V=function(){var t=(0,n.Z)((0,a.Z)().mark((function t(n,r){var i,o,l;return(0,a.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return i=r.resetForm,t.next=3,C.Z.post("login",n);case 3:if(o=t.sent,!(l=o.data).status){t.next=13;break}return i(),m.Am.success(l.msg),t.next=10,s((0,u.r4)({user:l.user,token:l.token}));case 10:l.user.role>0?e("/admin/users"):e("/subjects"),t.next=15;break;case 13:l.wrongInfo&&H((function(e){return e+1})),N<5&&m.Am.error(l.msg);case 15:case"end":return t.stop()}}),t)})));return function(e,s){return t.apply(this,arguments)}}();(0,o.useEffect)((function(){if(5===N){I(60);var e=setInterval((function(){return I((function(e){return e-1}))}),1e3);P(e)}}),[N]),(0,o.useEffect)((function(){A<0&&(P(clearInterval(O)),H(0),window.localStorage.setItem("leftSeconds",0)),window.localStorage.setItem("leftSeconds",A)}),[A]);var _=(0,y.Nq)({onSuccess:function(){var t=(0,n.Z)((0,a.Z)().mark((function t(n){var r,i;return(0,a.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,C.Z.post("login/google",n);case 2:if(r=t.sent,!(i=r.data).status){t.next=11;break}return m.Am.success(i.msg),t.next=8,s((0,u.r4)({user:i.user,token:i.token}));case 8:i.user.role>0?e("/admin/users"):e("/subjects"),t.next=12;break;case 11:m.Am.error(i.msg);case 12:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),onError:function(e){m.Am.error(e.toString())}});return(0,Z.jsxs)(Z.Fragment,{children:[(0,Z.jsxs)(h.q,{children:[(0,Z.jsx)("title",{children:W.title}),(0,Z.jsx)("meta",{name:"author",content:W.author}),(0,Z.jsx)("meta",{name:"description",content:W.description}),(0,Z.jsx)("meta",{name:"keywords",content:W.keywords}),(0,Z.jsx)("meta",{name:"viewport",content:W.viewport}),(0,Z.jsx)("meta",{name:"other",content:W.other})]}),(0,Z.jsx)("div",{className:"login-container",children:(0,Z.jsx)(v.Z,{children:(0,Z.jsxs)("div",{className:"page-content",children:[(0,Z.jsx)("div",{className:"page-left-content",children:(0,Z.jsx)(j.LazyLoadImage,{src:S,alt:"Login"})}),(0,Z.jsx)("div",{className:"page-right-content",children:(0,Z.jsxs)("div",{className:"login-form",children:[N>4&&A>0?(0,Z.jsxs)("p",{className:"text-danger",children:["Try again after ",A," seconds."]}):null,(0,Z.jsx)("h1",{className:"page-title",children:"Welcome back"}),(0,Z.jsx)(p.J9,{validationSchema:G,validateOnChange:!1,validateOnBlur:!1,onSubmit:V,initialValues:{email:"",password:""},children:function(e){var s=e.handleSubmit,t=e.handleChange,a=e.values,n=e.touched,r=e.errors;return(0,Z.jsxs)(f.Z,{noValidate:!0,onSubmit:s,className:"mt-4",children:[(0,Z.jsx)("div",{className:"d-grid",children:(0,Z.jsxs)(x.Z,{variant:"primary",className:"google-signin-btn",onClick:_,disabled:A>0&&N>4,children:[(0,Z.jsx)(j.LazyLoadImage,{src:b.Z,alt:"google",style:{marginRight:15}}),"Sign in with Google"]})}),(0,Z.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"center"},children:[(0,Z.jsx)("div",{style:{flex:1},children:(0,Z.jsx)("hr",{})}),(0,Z.jsx)("div",{className:"py-2 px-3 fw-bold text-dark",children:"OR"}),(0,Z.jsx)("div",{style:{flex:1},children:(0,Z.jsx)("hr",{})})]}),(0,Z.jsx)("p",{className:"mb-4",children:"Please enter your details."}),(0,Z.jsx)(w.Z,{className:"mb-4",required:!0,name:"email",icon:"fa fa-envelope",type:"email",placeholder:"Email",onChange:t,value:a.email,touched:n,errors:r,disabled:A>0&&N>4}),(0,Z.jsx)(w.Z,{className:"mb-3",required:!0,name:"password",icon:"fa fa-lock",type:"password",placeholder:"Password",onChange:t,value:a.password,touched:n,errors:r,disabled:A>0&&N>4}),(0,Z.jsxs)("p",{className:"mb-1",children:["Don't have an account? ",(0,Z.jsx)(c.Link,{className:"",to:"/signup",children:"Sign up free"})]}),(0,Z.jsx)("p",{className:"mb-4",children:(0,Z.jsx)(c.Link,{className:"",to:"/forgot-password",children:"Forgot password?"})}),(0,Z.jsx)("div",{className:"d-grid",children:(0,Z.jsx)(x.Z,{variant:"primary",type:"submit",disabled:A>0&&N>4,children:"Log in"})})]})}})]})})]})})})]})}}}]);