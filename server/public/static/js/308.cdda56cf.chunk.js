"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[308],{74316:function(e,t,s){s(47313);t.Z=s.p+"static/media/success_register.538b6c5dc7c348c0c7f701ac0b18dc2f.svg"},70308:function(e,t,s){s.r(t),s.d(t,{default:function(){return h}});var a=s(1413),r=s(70885),i=s(47313),n=s(22102),o=s(65832),c=s(90182),d=s(24751),l=s(28831),u=s(74316),m=s(46417),h=function(){var e=(0,i.useState)({author:"",description:"",keywords:"",other:"",slug:"",title:"",viewport:""}),t=(0,r.Z)(e,2),s=t[0],h=t[1];return(0,i.useEffect)((function(){var e=document.location.pathname.slice(1);""===e&&(e="home");var t={url:e};d.Z.post("/admin/seos/url",t).then((function(e){var t=e.data;t.success&&t.data?(h((0,a.Z)((0,a.Z)({},s),{},{author:t.data.author,description:t.data.description,keywords:t.data.keywords,other:t.data.other,slug:t.data.slug,title:t.data.title,viewport:t.data.viewport})),document.title=t.data.title):h((0,a.Z)((0,a.Z)({},s),{},{author:"AnswerSheet",description:"AnswerSheet has HSC study guides, practice questions and exams to help you achieve a band 6 in your HSC subjects. We have syllabus summaries, practice HSC exam-style questions, and sample answers to show you how to write band 6 responses.",keywords:"HSC notes, HSC study guides, syllabus summaries, dot point notes, HSC summaries, HSC English, HSC Physics, HSC maths, HSC Chemistry, HSC Biology",other:"",slug:"",title:"AnswerSheet - HSC made easy",viewport:"width=device-width, initial-scale=1.0"}))})).catch((function(e){h((0,a.Z)((0,a.Z)({},s),{},{author:"AnswerSheet",description:"AnswerSheet has HSC study guides, practice questions and exams to help you achieve a band 6 in your HSC subjects. We have syllabus summaries, practice HSC exam-style questions, and sample answers to show you how to write band 6 responses.",keywords:"HSC notes, HSC study guides, syllabus summaries, dot point notes, HSC summaries, HSC English, HSC Physics, HSC maths, HSC Chemistry, HSC Biology",other:"",slug:"",title:"AnswerSheet - HSC made easy",viewport:"width=device-width, initial-scale=1.0"}))}))}),[]),(0,m.jsxs)(m.Fragment,{children:[(0,m.jsxs)(c.q,{children:[(0,m.jsx)("title",{children:s.title}),(0,m.jsx)("meta",{name:"author",content:s.author}),(0,m.jsx)("meta",{name:"description",content:s.description}),(0,m.jsx)("meta",{name:"keywords",content:s.keywords}),(0,m.jsx)("meta",{name:"viewport",content:s.viewport}),(0,m.jsx)("meta",{name:"other",content:s.other})]}),(0,m.jsx)("div",{className:"confirm-email-container d-flex align-items-center justify-content-center",children:(0,m.jsx)(n.Z,{className:"d-flex align-items-center justify-content-center",children:(0,m.jsx)(o.Z,{style:{flexBasis:500,textAlign:"center",padding:20},children:(0,m.jsxs)(o.Z.Body,{children:[(0,m.jsx)(l.LazyLoadImage,{src:u.Z,alt:"Successful Register",width:160}),(0,m.jsx)("h3",{children:"Sign up successful"}),(0,m.jsx)("p",{style:{fontSize:20},children:"Check your email for a validation link."})]})})})})]})}},65832:function(e,t,s){s.d(t,{Z:function(){return A}});var a=s(1413),r=s(45987),i=s(46123),n=s.n(i),o=s(47313),c=s(68524),d=s(28864),l=s(96205),u=s(46417),m=["bsPrefix","className","variant","as"],h=o.forwardRef((function(e,t){var s=e.bsPrefix,i=e.className,o=e.variant,d=e.as,l=void 0===d?"img":d,h=(0,r.Z)(e,m),f=(0,c.vE)(s,"card-img");return(0,u.jsx)(l,(0,a.Z)({ref:t,className:n()(o?"".concat(f,"-").concat(o):f,i)},h))}));h.displayName="CardImg";var f=h,y=s(15614),p=["bsPrefix","className","as"],v=o.forwardRef((function(e,t){var s=e.bsPrefix,i=e.className,d=e.as,l=void 0===d?"div":d,m=(0,r.Z)(e,p),h=(0,c.vE)(s,"card-header"),f=(0,o.useMemo)((function(){return{cardHeaderBsPrefix:h}}),[h]);return(0,u.jsx)(y.Z.Provider,{value:f,children:(0,u.jsx)(l,(0,a.Z)((0,a.Z)({ref:t},m),{},{className:n()(i,h)}))})}));v.displayName="CardHeader";var x=v,w=["bsPrefix","className","bg","text","border","body","children","as"],C=(0,l.Z)("h5"),S=(0,l.Z)("h6"),b=(0,d.Z)("card-body"),g=(0,d.Z)("card-title",{Component:C}),Z=(0,d.Z)("card-subtitle",{Component:S}),H=(0,d.Z)("card-link",{Component:"a"}),j=(0,d.Z)("card-text",{Component:"p"}),k=(0,d.Z)("card-footer"),N=(0,d.Z)("card-img-overlay"),P=o.forwardRef((function(e,t){var s=e.bsPrefix,i=e.className,o=e.bg,d=e.text,l=e.border,m=e.body,h=e.children,f=e.as,y=void 0===f?"div":f,p=(0,r.Z)(e,w),v=(0,c.vE)(s,"card");return(0,u.jsx)(y,(0,a.Z)((0,a.Z)({ref:t},p),{},{className:n()(i,v,o&&"bg-".concat(o),d&&"text-".concat(d),l&&"border-".concat(l)),children:m?(0,u.jsx)(b,{children:h}):h}))}));P.displayName="Card",P.defaultProps={body:!1};var A=Object.assign(P,{Img:f,Title:g,Subtitle:Z,Body:b,Link:H,Text:j,Header:x,Footer:k,ImgOverlay:N})}}]);