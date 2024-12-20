import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Http from '../../services/Http'
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
    const [metadata, setMetadata] = useState({
        author: "",
        description: "",
        keywords: "",
        othername: "",
        othercontent: "",
        slug: "",
        title: "",
        viewport: ""
    });

    useEffect(() => {
        let curUrl = document.location.pathname.slice(1);
        if (curUrl === "")
            curUrl = "home";
        let params = {
            url: curUrl
        };

        Http.post(`/admin/seos/url`, params).then(res => {
            let data = res.data;
            if (data.success && data.data) {
                setMetadata({
                    ...metadata,
                    author: data.data.author,
                    description: data.data.description,
                    keywords: data.data.keywords,
                    othername: data.data.othername,
                    othercontent: data.data.othercontent,
                    slug: data.data.slug,
                    title: data.data.title,
                    viewport: data.data.viewport,
                })
                document.title = data.data.title;
            } else {
                setMetadata({
                    ...metadata,
                    author: "AnswerSheet",
                    description: "AnswerSheet has HSC study guides, practice questions and exams to help you achieve a band 6 in your HSC subjects. We have syllabus summaries, practice HSC exam-style questions, and sample answers to show you how to write band 6 responses.",
                    keywords: "HSC notes, HSC study guides, syllabus summaries, dot point notes, HSC summaries, HSC English, HSC Physics, HSC maths, HSC Chemistry, HSC Biology",
                    othername: "",
                    othercontent: "",
                    slug: "",
                    title: "AnswerSheet - Privacy Policy",
                    viewport: "width=device-width,initial-scale=1",
                })
            }
        }).catch(err => {
            setMetadata({
                ...metadata,
                author: "AnswerSheet",
                description: "AnswerSheet has HSC study guides, practice questions and exams to help you achieve a band 6 in your HSC subjects. We have syllabus summaries, practice HSC exam-style questions, and sample answers to show you how to write band 6 responses.",
                keywords: "HSC notes, HSC study guides, syllabus summaries, dot point notes, HSC summaries, HSC English, HSC Physics, HSC maths, HSC Chemistry, HSC Biology",
                othername: "",
                othercontent: "",
                slug: "",
                title: "AnswerSheet - Privacy Policy",
                viewport: "width=device-width,initial-scale=1",
            })
        });
    }, []);

    return (
        <>
            <Helmet>
                <title>{metadata.title}</title>
                <meta name="author" content={metadata.author} />
                <meta name="description" content={metadata.description} />
                <meta name="keywords" content={metadata.keywords} />
                <meta name="viewport" content={metadata.viewport} />
                <meta name={metadata.othername} content={metadata.othercontent} />
            </Helmet>
            <div className="privacy-policy-container">
                <Container>
                    <div className="page-content">
                        <h1 className="page-title text-center">Privacy Policy</h1>
                        <div className="description">
                            <p>This website is operated by AnswerSheet Pty Ltd (ACN: 665324541), who trade as AnswerSheet (“AnswerSheet”, “we”, “us”, “our”) under the domain name answersheet.au (“the website”). We are committed to protecting your online privacy and safety. This Privacy Policy explains what information we collect when you use AnswerSheet, how the information will be used, and how you can control the collection, correction and/or deletion of information. This Privacy Policy applies only to information you provide us through the AnswerSheet website. Capitalised terms that are not defined in this Privacy Policy have the meaning given to them in our Terms of Use.</p>
                            <h2 className="sub-title">What We Collect</h2>
                            <h3 className="sub-title">Personal Information</h3>
                            <p>When you register to use the AnswerSheet website, you provide us information about yourself, such as your name, username and e-mail address. You may also provide us with financial payment information, geolocation information, Unique Device ID (UDID), all subject to the applicable privacy settings, if a purchase is made.</p>
                            <h3 className="sub-title">Log File Information</h3>
                            <p>When you use the Service, our servers automatically record certain log file information. These server logs may include information such as your web request, Internet Protocol (“IP”) address, browser type, referring / exit pages and URLs, number of clicks and how you interact with the Service, domain names, landing pages, pages viewed, and other such information. Clear Gifs Information. When you use the Service, we may employ clear gifs (also known as web beacons), which are used to track the usage patterns of our users anonymously. In addition, we may also use clear gifs in HTML-based emails sent to our users to track which emails are opened by recipients. The information is used to enable more accurate reporting, improve the effectiveness of our marketing, and make AnswerSheet better for our users. AnswerSheet uses third party analytics services like Google Analytics to help understand use of the Service. These third party analytics services collect the information sent by your usage of the Service. AnswerSheet stores passwords in a secure database. This password information is encrypted and AnswerSheet cannot access/ view these details.</p>
                            <h3 className="sub-title">Your Rights</h3>
                            <p>As users of the AnswerSheet website, you have the following rights about your data that you provide to AnswerSheet during the user process:</p>
                            <ul>
                                <li>A right to erase: You have full authority for all of your data to be completely erased from our servers. To take this action, please email our support team at support@answersheet.au and the request will be processed within 48 hrs.</li>
                                <li>A right to rectification: You have the right to rectify inaccurate personal data at any time, by either using the My Account link in the website footer, or contacting our support team at support@answersheet.au.</li>
                                <li>A right to restrict processing: You have the right to restrict or suppress your personal data. To do this, please email our support team at support@answersheet.au with the specifics of your request.</li>
                            </ul>
                            <h3 className="sub-title">How We Use Your Information</h3>
                            <p>We use the personal information you submit to operate, maintain, and provide to you the features and functionality of the Service. By providing AnswerSheet your email address and providing consent, you consent to our using the email address to send you Service-related notices and receipts, including any notices required by law, in lieu of communication by postal mail. You also agree that we may send you notifications of activity on the Service to the email address you give us, in accordance with any applicable privacy settings. We may use your email address to send you other messages, such as newsletters, changes to features of the Service, or special offers. If you do not want to receive such email messages, you may opt out by selecting “unsubscribe” at the bottom of our email correspondences. Opting out may prevent you from receiving email messages and updates, improvements, or offers.</p>
                            <h2 className="sub-title">What We Do With Your Information</h2>
                            <h3 className="sub-title">Personally Identifiable Information</h3>
                            <p>AnswerSheet will not rent or sell your personally identifiable information to others. AnswerSheet may share your personally identifiable information with third parties for the purpose of providing the Service to you. If we do this, such third parties’ use of your information will be bound by this Privacy Policy. We may store personal information in locations outside the direct control of AnswerSheet (for instance, on servers or databases co-located with hosting providers). We may also transfer or assign your information in the course of corporate divestitures, mergers, or dissolution. AnswerSheet may disclose your personal information if required to do so by law or subpoena or if we believe that such action is necessary to <br />
                                <ol>
                                    <li> conform to the law, comply with legal process served on us or our affiliates, or investigate, prevent, or take action regarding suspected or actual illegal activities;</li>
                                    <li> to enforce our Terms & Conditions, take precautions against liability, to investigate and defend ourselves against any third-party claims or allegations, to assist government enforcement agencies, or to protect the security or integrity of our site; and </li>
                                    <li> to exercise or protect the rights, property, or personal safety of AnswerSheet, our Users or others.
                                        We may share non-personally identifiable information (such as anonymous usage data, referring/exit pages and URLs, platform types, number of clicks, etc.) with interested third parties to help them understand the usage patterns of AnswerSheet.
                                    </li>
                                </ol>
                            </p>
                            <h3 className="sub-title">How We Protect Your Information</h3>
                            <p>AnswerSheet cares about the integrity and security of your personal information. We keep your personally identifiable information in encrypted form on a secured server behind a firewall. We also use automated and social measures to enhance security, such as analysing account behaviour for fraudulent or otherwise anomalous behaviour, may limit use of site features in response to possible signs of abuse, may remove inappropriate content or links to illegal content, and may suspend or disable accounts for violations of our Terms of Use or Privacy Policy. Although we allow you to set privacy options that limit access to your information, please be aware that no security measures are perfect or impenetrable. We cannot control the actions of other users with whom you share your information. We cannot guarantee that only authorised persons will view your information. We cannot ensure that information you share on Service will not become publicly available. We are not responsible for third party circumvention of any privacy settings or security measures on Service. You can reduce these risks by using common sense security practices such as choosing a strong password, using different passwords for different services. Your privacy settings may also be affected by changes to the functionality of AnswerSheet’s distributors, such as social networks. AnswerSheet is not responsible for the functionality or security measures of any third party.</p>
                            <h3 className="sub-title">Compromise of Personal Information</h3>
                            <p>In the event that personal information is compromised as a result of a breach of security, AnswerSheet will promptly notify those persons whose personal information has been compromised, in accordance with the notification procedures set forth in this Privacy Policy, or as otherwise required by applicable law. You may, of course, decline to submit personally identifiable information through the Service, in which case AnswerSheet may not be able to provide certain services to you. You may update or correct your account information at any time by logging in to your account through the My Account link, located in the website footer. You can review and correct the information about you that AnswerSheet keeps on file by contacting us directly at support@answersheet.au. AnswerSheet does not knowingly collect or solicit personal information from anyone under the age of 13 or knowingly allow such persons to register as Members. If you are under 13, please do not send any information about yourself to us, including your name, address, telephone number, or email address. No one under age 13 is allowed to use the AnswerSheet website or provide any personal information to or on AnswerSheet. If we become aware that we have collected personal information from a child under age 13 without verification of parental consent then we will delete that information as quickly as possible. If you believe that we might have any information from or about a child under 13, please contact us.</p>
                            <p>We are not responsible for the practices employed by websites or applications linked to or from the Service, nor the information or content contained therein. Please remember that when you use a link to go from the Service to another website, our Privacy Policy is no longer in effect. Your browsing and interaction on any other website or application, including those that have a link on our website, is subject to that website’s own rules and policies. Please read over those rules and policies before proceeding.It is our policy to provide notifications, whether such notifications are required by law or are for marketing or other business related purposes, to you via email notice, written or hard copy notice, or through conspicuous posting of such notice on the Service, as determined by AnswerSheet in its sole discretion. We reserve the right to determine the form and means of providing notifications to you, provided that you may opt out of certain means and types of notification as described in this Privacy Policy.</p>
                            <p>AnswerSheet may update its Privacy Policy from time to time, so you should review this Policy periodically. Changes to this Privacy Policy are effective when they are posted on this page. If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this website, please contact us..</p>
                        </div>
                    </div>
                </Container>
            </div>
        </>
    )
}

export default PrivacyPolicy;