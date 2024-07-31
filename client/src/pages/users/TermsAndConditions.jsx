import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet";
import "./TermsAndConditions.css";
import Http from '../../services/Http'

const TermsAndConditions = () => {
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
                    title: "AnswerSheet - HSC made easy",
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
                title: "AnswerSheet - HSC made easy",
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
            <div className="terms-and-conditions-container">
                <Container>
                    <div className="page-content">
                        <h1 className="page-title text-center">Terms and Conditions</h1>
                        <div className="description">
                            <p>This website is operated by AnswerSheet Pty Ltd (ACN: 665324541), who trade as AnswerSheet (“AnswerSheet”, “we”, “us”, “our”) under the domain name answersheet.au (“the website”).</p>
                            <p>We offer you the service of AnswerSheet on the condition that you agree to the following terms:</p>
                            <h2 className="sub-title">Intellectual Property Rights</h2>
                            <p>The material contained on the website is protected by copyright. You may use the website for personal and non­commercial purposes only. You acknowledge that the AnswerSheet website, special technology used in connection with the website, AnswerSheet’s services, all software, material, information, communications, text, graphics, links, electronic art, animations, audio, video, photos, and other data available within the website (“AnswerSheet content”) are provided by AnswerSheet or third ­party providers and are the copyrighted works of AnswerSheet and/or such third parties. You may not copy, reproduce, publish, distribute, modify, create derivative works of, rent, lease, sell, transfer, display, transmit, compile or collect in a database, or in any manner commercially exploit any part of the AnswerSheet content or our services in whole or in part unless expressly authorized by AnswerSheet or the relevant third party owner.</p>
                            <p>All material on the AnswerSheet website is for individual use only and account ownership may not be transferred or shared with other people.</p>
                            <p>You may not store any significant portion of any AnswerSheet content or AnswerSheet services or materials in any form. You acknowledge that AnswerSheet and/or third­ party providers remain the owners of the AnswerSheet content and that you do not acquire any intellectual property rights in the AnswerSheet content.</p>
                            <p>All material on the AnswerSheet website has been developed by AnswerSheet. AnswerSheet has been developed independently from the NSW Education Standards Authority (NESA) and NESA does not endorse this website.</p>
                            <h2 className="sub-title">Information Does Not Represent Professional Advice</h2>
                            <p>The material provided on the website is provided as general information only. It is not intended as professional advice and must not be relied upon as such. Prior to entering into a transaction or taking any particular course of action in connection with the website, you should make your own enquiries and seek independent advice tailored to your specific circumstances and objectives.</p>
                            <h2 className="sub-title">Accuracy and Usefulness of Information</h2>
                            <p>All material and information on the website is provided in good faith and is believed to be accurate and current as at the date of publication. However, AnswerSheet provides no warranty or guarantee that any material or information on the website or linked websites will be accurate or complete.</p>
                            <p>AnswerSheet will not be liable for any damages whatsoever whether in an action in contract, negligence or other tort, arising out of or in connection with access to the website or the information and material contained in it. All warranties of any kind are excluded to the maximum extent permitted by law.</p>
                            <p>AnswerSheet makes no guarantee as to the usefulness of the material and information on the website, nor any of the products and services promoted on it or via linked websites. In particular, AnswerSheet makes no guarantee as to the appropriateness of the courses selected by you and no guarantee as to the likelihood of results which may be gained by virtue of any training undertaken.</p>
                            <h2 className="sub-title">Access</h2>
                            <p>You agree and understand that AnswerSheet may prevent or restrict your access to the website for any technical, security and or any other reasons at its absolute discretion. AnswerSheet will advise you as soon as practicable of any restrictions imposed on your access to the website.</p>
                            <h2 className="sub-title">Variation of These Terms</h2>
                            <p>AnswerSheet may vary these Terms at any time. In the event that AnswerSheet varies these Terms, it will provide notice by publishing the varied Terms on the website. You accept that by doing this, AnswerSheet has provided you with sufficient notice of the variation.</p>
                            <h2 className="sub-title">No Warranties or Representations</h2>
                            <p>AnswerSheet does not exclude any rights or remedies available to you under the Trade Practices Act (Cth) or equivalent State legislation that cannot be excluded or restricted. To the extent permissible by law, AnswerSheet makes no warranty or representation (express or implied) regarding the quality, accuracy, reliability, currency, performance, completeness or fitness for purpose of any part of the website or any of the AnswerSheet content.</p>
                            <p>AnswerSheet does not represent or warrant (expressly or impliedly) that the website or any of the AnswerSheet content, or the facilities that make the website and the AnswerSheet content available, will not cause damage, or are free from any computer virus or any other defects or errors, or that your access to the website or any AnswerSheet content will be uninterrupted.</p>
                            <p>To the maximum extent permitted by law, AnswerSheet is not liable (whether in contract, negligence or otherwise) for any loss or damage arising from the use of the website or any of the AnswerSheet content.</p>
                            <p>To the maximum extent permissible by law, AnswerSheet’s liability for breach of any implied warranty or conditions that cannot be excluded is restricted, at AnswerSheet’s option, to:</p>
                            <ul>
                                <li>the re­supply of the relevant goods or services; or</li>
                                <li>the cost of the re­supply of the relevant goods or services; or</li>
                                <li>any amount paid by you to AnswerSheet in respect of the relevant goods or services.</li>
                            </ul>
                            <p>You agree that in no circumstances will AnswerSheet be liable for any indirect, incidental, special and/or consequential losses or damages of whatever nature arising out of your use of the website or of any of the AnswerSheet content (including, but not limited to, losses or damages arising out of, or attributable to, an act or omission by AnswerSheet).</p>
                            <h2 className="sub-title">No Guarantees as to the Service</h2>
                            <p>The website contains downloadable materials and links to external websites. AnswerSheet is not responsible for, and has no control over, the content of downloadable materials or external sites. You understand that AnswerSheet cannot and does not guarantee, warrant or represent that files or software of any kind, or from any source, available for downloading through the website, will be free of infection or viruses, worms, Trojan horses or other code or defects that manifest contaminating or destructive properties.</p>
                            <h2 className="sub-title">Prices and Payments</h2>
                            <p>All prices quoted on the website are quoted in Australian Dollars (“AUD”). A payment to be made to AnswerSheet must always be made in accordance with AnswerSheet’s Terms of Purchase & Refund Policy below. Payments that are received in a currency other than USD will not be accepted and any attempted registration by you in respect of the website or AnswerSheet content will be delayed until correct payment is made. All prices quoted on the website are subject to change without notice. You should confirm the price of a product or service before placing an order for it.</p>
                            <h2 className="sub-title">Links to Third Party Websites</h2>
                            <p>The website may contain links and pointers to other websites operated by third parties. Third party links and pointers are included solely for your convenience. Links to third party websites do not constitute endorsement, sponsorship or approval by AnswerSheet of the content, policies or practices of those third party websites. You agree that by accessing any third party linked website you do so at entirely at your own risk. AnswerSheet will not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with, use or reliance on any goods or services available on or through any third party website.</p>
                            <h2 className="sub-title">Security</h2>
                            <p>When using the World Wide Web, the Internet or third party networks or facilities, you are using networks, facilities and services that are beyond the control of AnswerSheet. You assume all risk and liability of your use of the World Wide Web, the Internet or any such third party networks, including any access to the website via such media.</p>
                            <h2 className="sub-title">Severability</h2>
                            <p>If any part of these Terms is held invalid, illegal or unenforceable, that part shall be severed and the remainder will continue to be valid and enforceable.</p>
                            <h2 className="sub-title">General</h2>
                            <p>The use of the website is governed by, construed and enforced in accordance with the laws of New South Wales, Australia and you irrevocably submit to the non­exclusive jurisdiction of the courts of Queensland, Australia and their respective courts of appeal in that regard.</p>
                            <h2 className="sub-title">Reservation of Rights</h2>
                            <p>Any rights not expressly granted to you herein are reserved by AnswerSheet. For the purposes of this agreement the words “AnswerSheet”, “We”, “Our” and “Us” refer to JIFox Education Pty Ltd and “website” to materials delivered on answersheet.au and other co branded versions of the site.</p>
                            <h2 className="sub-title">Conduct Policy</h2>
                            <p>By using this website, you agree to AnswerSheet’s Conduct Policy below. You must not:</p>
                            <ol>
                                <li>use the the website in breach of any applicable laws or regulations;</li>
                                <li>use the website (or material obtained from the website):
                                    <ul>
                                        <li>to transmit (or authorise the transmission of) “junk mail,” “chain letters,” unsolicited emails,</li>
                                        <li>instant messaging, “spimming,” or “spamming”;</li>
                                        <li>to impersonate any person or entity;</li>
                                        <li>to solicit money, passwords or personal information from any person;</li>
                                        <li>to harm, abuse, harass, stalk, threaten or otherwise offend others; or</li>
                                        <li>for any unlawful purpose;</li>
                                    </ul>
                                </li>
                                <li>use the website to upload, post, transmit or otherwise make available (or attempt to upload, post, transmit or otherwise make available) any material that:
                                    <ul>
                                        <li>is not your original work, or which in any way violates or infringes (or could reasonably be expected to violate or infringe) the intellectual property or other rights of another person;</li>
                                        <li>contains, promotes, or provides information about unlawful activities or conduct;</li>
                                        <li>is, or could reasonably be expected to be, defamatory, obscene, offensive, threatening, abusive, pornographic, vulgar, profane, indecent or otherwise unlawful, including material that racially or religiously vilifies, incites violence or hatred, or is likely to offend, insult or humiliate others based on race, religion, ethnicity, gender, age, sexual orientation or any physical or mental disability;</li>
                                        <li>exploits another person in any manner;</li>
                                        <li>contains nudity, excessive violence, or sexual acts or references;</li>
                                        <li>includes an image or personal information of another person or persons unless you have their consent;</li>
                                        <li>poses or creates a privacy or security risk to any person;</li>
                                        <li>you know or suspect (or ought reasonably to have known or suspected) to be false, misleading or deceptive;</li>
                                        <li>contains large amounts of untargeted, unwanted or repetitive content;</li>
                                        <li>contains restricted or password only access pages, or hidden content;</li>
                                        <li>contains viruses, or other computer codes, files or programs designed to interrupt, limit or destroy the functionality of other computer software or hardware;</li>
                                        <li>advertises, promotes or solicits any goods or services or commercial activities (except where expressly permitted or authorised by us); or</li>
                                        <li>contains financial, legal, medical or other professional advice;</li>
                                    </ul>
                                </li>
                                <li>interfere with, disrupt, or create an undue burden on AnswerSheet;</li>
                                <li>use any robot, spider, or other device or process to retrieve, index, or in any way reproduce, modify or circumvent the navigational structure, security or presentation of the website;</li>
                                <li>use the website with the assistance of any automated scripting tool or software;</li>
                                <li>frame or mirror any part of the website without our prior written authorization;</li>
                                <li>use code or other devices containing any reference to the website to direct other persons to any other web page;</li>
                                <li>except to the extent permitted by law, modify, adapt, sublicense, translate, sell, reverse engineer, decipher, decompile or otherwise disassemble any portion of the website or cause any other person to do so; or</li><li>delete any attributions or legal or proprietary notices on the website.</li>
                            </ol>
                            <h2 className="sub-title">Terms of Purchase & Refund Policy</h2>
                            <p>Before you make a purchase on AnswerSheet’s website, you agree that you have read, understood and agreed to AnswerSheet’s Terms of Purchase & Refund Policy below.</p>
                            <h3 className="sub-title ms-3">Terms of Purchase</h3>
                            <div className="ms-3">
                                <ul>
                                    <li>AnswerSheet will charge your credit/debit card with the subscription fee for the courses that are described on the website before you enter your credit/debit card details.</li>
                                    <li>AnswerSheet accepts Visa, MasterCard and American Express cards.</li>
                                    <li>AnswerSheet does not accept Money Orders, Cash or Cheque payments.</li>
                                    <li>AnswerSheet Registered Users can review their payment history and the courses they have paid for in the “My Account” section of the website.</li>
                                    <li>Tax invoices for the payment of your subscription fees can be sent to you on request.</li>
                                </ul>
                            </div>
                            <h3 className="sub-title ms-3">Refund Policy</h3>
                            <div className="ms-3">
                                <ul>
                                    <li>AnswerSheet offers a 7-day refund policy, reviewed on an individual basis with their customers. Customers have the option to request a refund within 7-days after purchase. However, it is AnswerSheet’s sole discretion to approve the refund.</li>
                                    <li>The 7-day refund policy is valid at all times, except within 2 weeks of the HSC exams.</li>
                                    <li>In the event the HSC exams are cancelled for any reason, AnswerSheet will not necessarily extend their refund policy longer than the 7-day window.</li>
                                    <li>If you have any purchase queries, please contact: support@answersheet.au</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </Container>
            </div >
        </>
    )
}

export default TermsAndConditions;