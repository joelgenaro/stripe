"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[9031],{45121:function(e,s,t){t(47313);s.Z=t.p+"static/media/topic_icon.674d7a069d9a50cf055d868733388dfd.svg"},76754:function(e,s,t){t.d(s,{Z:function(){return d}});var n=t(70885),a=t(47313),r=t(53768),i=t(65832),c=t(93298),l=t(41965),o=t(46417),d=function(e){var s=e.questions,t=e.superRole,d=(0,a.useRef)(0),u=(0,a.useState)(!1),h=(0,n.Z)(u,2),m=h[0],p=h[1],x=(0,a.useState)(!1),j=(0,n.Z)(x,2),y=j[0],b=j[1],f=(0,a.useState)(""),v=(0,n.Z)(f,2),g=v[0],w=v[1],S=(0,a.useState)(""),Z=(0,n.Z)(S,2),C=Z[0],H=Z[1],k=function(e){var s=e%12;return 0===s?"label-default":1===s?"label-primary":2===s?"label-info":3===s?"label-success":4===s?"label-danger":5===s?"label-warning":6===s?"label-purple":7===s?"label-dark-blue":8===s?"label-dark-yellow":9===s?"label-dark-green":10===s?"label-dark-red":11===s?"label-light-red":void 0};return(0,o.jsx)(o.Fragment,{children:(0,o.jsxs)("div",{className:"quesion-field",children:[(0,o.jsx)(r.Z,{defaultActiveKey:"0",children:s.map((function(e,s){return(0,o.jsx)(o.Fragment,{children:t>=e.permission&&(0,o.jsx)(i.Z,{style:{marginBottom:20},children:(0,o.jsxs)(r.Z.Item,{eventKey:s,children:[(0,o.jsx)(r.Z.Header,{children:(0,o.jsx)("div",{ref:d,dangerouslySetInnerHTML:{__html:e.name}})}),(0,o.jsxs)(r.Z.Body,{children:[(0,o.jsxs)("dl",{className:"action-button-container",children:[(0,o.jsx)("dt",{children:(0,o.jsxs)("p",{children:[(0,o.jsx)("b",{children:"Total marks: "})," ",e.totalMarks]})}),(0,o.jsx)("dt",{className:"mt-3",children:(0,o.jsxs)("p",{children:[(0,o.jsx)("b",{children:"Syllabus reference: "})," ",e.syllabusRef]})}),(0,o.jsx)("dt",{className:"mt-3",children:(0,o.jsx)(c.Z,{variant:"outline-primary",size:"sm",onClick:function(){return s=e.markingCrit,p(!0),void w(s);var s},style:{width:"100%"},children:"Marking criteria"})}),(0,o.jsx)("dt",{className:"mt-3",children:(0,o.jsx)(c.Z,{variant:"outline-danger",size:"sm",onClick:function(){return s=e.sampleSolution,b(!0),void H(s);var s},style:{width:"100%"},children:"Sample solution"})}),(0,o.jsx)("div",{className:"mt-3",children:e.tags.map((function(e,s){return(0,o.jsxs)("span",{className:"label ".concat(k(s)),style:{marginRight:3},children:[" ",e]},s)}))})]}),(0,o.jsx)("div",{ref:d,className:"mt-3 lecture-content",dangerouslySetInnerHTML:{__html:e.content}})]})]})},s)})}))}),(0,o.jsx)(l.Z,{show:m,className:"view-modal",size:"xl",onHide:function(){return p(!1)},"aria-labelledby":"contained-modal-title-vcenter",centered:!0,children:(0,o.jsxs)(l.Z.Body,{children:[(0,o.jsx)(l.Z.Title,{children:(0,o.jsx)("h1",{children:"Marking criteria"})}),(0,o.jsx)(i.Z,{className:"mb-3",children:(0,o.jsx)(i.Z.Body,{children:(0,o.jsx)("div",{ref:d,dangerouslySetInnerHTML:{__html:g}})})}),(0,o.jsx)("button",{className:"btn-close",onClick:function(){return p(!1)}})]})}),(0,o.jsx)(l.Z,{show:y,className:"view-modal",size:"xl",onHide:function(){return b(!1)},"aria-labelledby":"contained-modal-title-vcenter",centered:!0,children:(0,o.jsxs)(l.Z.Body,{children:[(0,o.jsx)(l.Z.Title,{children:(0,o.jsx)("h1",{children:"Sample solution"})}),(0,o.jsx)(i.Z,{className:"mb-3",children:(0,o.jsx)(i.Z.Body,{children:(0,o.jsx)("div",{ref:d,dangerouslySetInnerHTML:{__html:C}})})}),(0,o.jsx)("button",{className:"btn-close",onClick:function(){return b(!1)}})]})})]})})}},39031:function(e,s,t){t.r(s),t.d(s,{default:function(){return f}});var n=t(74165),a=t(15861),r=t(1413),i=t(70885),c=t(47313),l=t(22102),o=t(65832),d=t(85554),u=t(24751),h=t(34491),m=t(58467),p=t(2135),x=t(90182),j=t(45121),y=t(76754),b=t(46417),f=function(){var e=(0,m.UO)(),s=(0,m.s0)(),t=(0,d.v9)((function(e){return e.user.user})),f=(0,c.useState)({}),v=(0,i.Z)(f,2),g=v[0],w=v[1],S=(0,c.useState)(0),Z=(0,i.Z)(S,2),C=Z[0],H=Z[1],k=(0,c.useState)([]),N=(0,i.Z)(k,2),_=N[0],T=N[1],q=(0,c.useState)({author:"",description:"",keywords:"",other:"",slug:"",title:"",viewport:""}),B=(0,i.Z)(q,2),A=B[0],M=B[1];return(0,c.useEffect)((function(){var e=document.location.pathname.slice(1);""===e&&(e="home");var s={url:e};u.Z.post("/admin/seos/url",s).then((function(e){var s=e.data;s.success&&s.data?(M((0,r.Z)((0,r.Z)({},A),{},{author:s.data.author,description:s.data.description,keywords:s.data.keywords,other:s.data.other,slug:s.data.slug,title:s.data.title,viewport:s.data.viewport})),document.title=s.data.title):M((0,r.Z)((0,r.Z)({},A),{},{author:"AnswerSheet",description:"AnswerSheet has HSC study guides, practice questions and exams to help you achieve a band 6 in your HSC subjects. We have syllabus summaries, practice HSC exam-style questions, and sample answers to show you how to write band 6 responses.",keywords:"HSC notes, HSC study guides, syllabus summaries, dot point notes, HSC summaries, HSC English, HSC Physics, HSC maths, HSC Chemistry, HSC Biology",other:"",slug:"",title:"AnswerSheet - HSC made easy",viewport:"width=device-width, initial-scale=1.0"}))})).catch((function(e){M((0,r.Z)((0,r.Z)({},A),{},{author:"AnswerSheet",description:"AnswerSheet has HSC study guides, practice questions and exams to help you achieve a band 6 in your HSC subjects. We have syllabus summaries, practice HSC exam-style questions, and sample answers to show you how to write band 6 responses.",keywords:"HSC notes, HSC study guides, syllabus summaries, dot point notes, HSC summaries, HSC English, HSC Physics, HSC maths, HSC Chemistry, HSC Biology",other:"",slug:"",title:"AnswerSheet - HSC made easy",viewport:"width=device-width, initial-scale=1.0"}))}))}),[]),(0,c.useEffect)((function(){window.scrollTo(0,0)}),[]),(0,c.useEffect)((function(){(0,a.Z)((0,n.Z)().mark((function s(){var a,r;return(0,n.Z)().wrap((function(s){for(;;)switch(s.prev=s.next){case 0:if(a=e.year,r=e.subject,e.topic,!t._id){s.next=8;break}return s.next=4,u.Z.get("check-membership-slug",{params:{user:t._id,yearSlug:a,subjectSlug:r}});case 4:!0===s.sent.data.result?H(2):H(1),s.next=9;break;case 8:H(0);case 9:case"end":return s.stop()}}),s)})))()}),[]),(0,c.useEffect)((function(){var t=function(){var t=(0,a.Z)((0,n.Z)().mark((function t(){var a,r,i,c,l,o;return(0,n.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a=e.year,r=e.subject,i=e.module,c=e.topic,t.next=3,u.Z.get("topics/get-topic-by-slug",{params:{year_slug:a,subject_slug:r,module_slug:i,topic_slug:c}});case 3:l=t.sent,(o=l.data).success?(w(o.data),T(o.questions)):(h.Am.error(o.msg),s("/subjects"));case 6:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();t()}),[]),(0,b.jsxs)(b.Fragment,{children:[(0,b.jsxs)(x.q,{children:[(0,b.jsx)("title",{children:A.title}),(0,b.jsx)("meta",{name:"author",content:A.author}),(0,b.jsx)("meta",{name:"description",content:A.description}),(0,b.jsx)("meta",{name:"keywords",content:A.keywords}),(0,b.jsx)("meta",{name:"viewport",content:A.viewport}),(0,b.jsx)("meta",{name:"other",content:A.other})]}),(0,b.jsx)("div",{className:"sub-topics-container",children:(0,b.jsxs)(l.Z,{children:[(0,b.jsx)(o.Z,{className:"mb-4",children:(0,b.jsxs)(o.Z.Body,{className:"pt-5 px-5 pb-4",children:[(0,b.jsx)("h1",{className:"topic-title",children:g.name}),g.description&&(0,b.jsx)("p",{children:g.description}),(0,b.jsx)("div",{className:"sub-topic-list",children:g.subTopics&&g.subTopics.map((function(s,t){return(0,b.jsx)("div",{className:"d-grid",children:(0,b.jsxs)(p.Link,{className:"btn btn-primary learn-btn",to:"/".concat(e.year,"/").concat(e.subject,"/").concat(e.module,"/").concat(e.topic,"/").concat(s.slug),children:[(0,b.jsx)("img",{src:j.Z,alt:"Icon"})," ",(0,b.jsx)("span",{children:s.name})]})},t)}))})]})}),(0,b.jsx)(y.Z,{questions:_,superRole:C})]})})]})}}}]);