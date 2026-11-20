/**
 * ACCOLADE SCREENLADY - EDITORIALS & ESSAYS CONTROLLER
 * Side-by-side magazine cards with 10-15 line excerpts and full-screen distraction-free reader mode.
 */

// Official Magazine Editorial Articles (Ordered: Article 1 Tantuh on Left, Article 2 Body Shaming on Right)
const DEFAULT_SCREENLADY_EDITORIALS = [
  {
    id: "article-1",
    sortOrder: 1,
    title: "Tantuh: – Celebrating Indian Heritage Through Handcrafted Jewellery",
    headline: "Tantuh: – Celebrating Indian Heritage Through Handcrafted Jewellery",
    author: "Accolade Screenlady Editorial Desk",
    authorRole: "Cover Page Sponsor Focus • October 2026 Issue",
    date: "2026-10-15",
    displayDate: "October 2026 Issue",
    category: "Heritage & Craftsmanship",
    categoryBadge: "🏛️ Heritage & Craftsmanship",
    readTime: "5 Min Read",
    photo: "assets/images/articles/article-1.jpg",
    photoCaption: "Accolade Screenlady Cover Sponsor Feature: Tantuh Handcrafted Jewellery Collection",
    summary: "Tantuh:, a jewellery brand, is the proud sponsor of the cover page of Accolade Screenlady’s October 2026 issue. Blending Indian traditions, artistic brass wirework and contemporary fashion, the brand gives handmade heritage a fresh identity.",
    previewExcerptHtml: `
      <div class="editorial-lead-box" style="margin-bottom: 0.95rem; padding: 0.85rem 1.1rem; font-size: 0.92rem;">
        <strong>(Accolade Screenlady, Mumbai)</strong> Tantuh:, a jewellery brand, is the proud sponsor of the cover page of Accolade Screenlady’s October 2026 issue.
      </div>
      <p>
        Tantuh: is a jewellery brand that beautifully blends Indian traditions, artistic craftsmanship and contemporary fashion. Through its distinctive handcrafted jewellery, the brand strives to give traditional artistry a fresh identity.
      </p>
      <p>
        A special salute to <strong>Prasad Ghodke</strong>, the visionary behind the creation of this brand. We also applaud <strong>Swati Ghodke</strong>, whose feminine perspective, refined taste and discerning eye contribute to making the brand even more exceptional. The dedication and hard work of this husband-and-wife duo are undoubtedly the driving force behind the brand’s success.
      </p>
      <p>
        The philosophy behind Tantuh: is reflected in every piece of jewellery, which seeks to bring alive the beauty of India's cultural heritage, the craftsmanship of skilled artisans and the emotions and stories behind every creation...
      </p>
    `,
    fullContent: `
      <div class="editorial-lead-box">
        <strong>(Accolade Screenlady, Mumbai)</strong> Tantuh:, a jewellery brand, is the proud sponsor of the cover page of Accolade Screenlady’s October 2026 issue.
      </div>

      <p>
        Tantuh: is a jewellery brand that beautifully blends Indian traditions, artistic craftsmanship and contemporary fashion. Through its distinctive handcrafted jewellery, the brand strives to give traditional artistry a fresh identity. A special salute to <strong>Prasad Ghodke</strong>, the visionary behind the creation of this brand. We also applaud <strong>Swati Ghodke</strong>, whose feminine perspective, refined taste and discerning eye contribute to making the brand even more exceptional. The dedication and hard work of this husband-and-wife duo are undoubtedly the driving force behind the brand’s success.
      </p>

      <p>
        The philosophy behind Tantuh: is reflected in every piece of jewellery, which seeks to bring alive the beauty of India's cultural heritage, the craftsmanship of skilled artisans and the emotions and stories behind every creation.
      </p>

      <h2>The Beauty of Jewellery Crafted Through Artistry</h2>

      <p>
        The defining feature of Tantuh: jewellery is its exquisite handcrafted detailing. The jewellery, crafted using brass, reflects traditional artistic influences and intricate patterns. The creative structures shaped through wirework give each piece a distinctive personality.
      </p>

      <p>
        Every piece is not merely an ornament that enhances beauty but a beautiful expression of tradition and art. Through its jewellery designs, the brand strives to honour cultural heritage while giving prominence to artistic creativity.
      </p>

      <h2>A Legacy of Tradition with a Contemporary Interpretation</h2>

      <p>
        In today's ever-evolving fashion world, the need to give traditional jewellery a modern identity is increasingly evident. Tantuh: is a brand moving in precisely this direction.
      </p>

      <p>
        By harmoniously combining traditional aesthetics with contemporary styles, the brand offers modern women an opportunity to choose jewellery that complements their individuality and personal style.
      </p>

      <p>
        Whether paired with traditional attire or modern outfits, artistic jewellery can add a distinctive identity to one's personality. Jewellery, therefore, need not be viewed merely as a fashion accessory; it can also become a medium through which women express their personal taste, individuality and cultural connection.
      </p>

      <h2>Celebrating the Skills of Artisans</h2>

      <p>
        The true beauty of handcrafted creations lies in the human skill, patience and attention to detail that go into making them.
      </p>

      <p>
        Tantuh: places great importance on the artistic abilities of skilled artisans. The brand focuses on preserving the dedication, attention to detail and passion that define traditional craftsmanship.
      </p>

      <p>
        The concept of creating jewellery with a sustainable approach is also an important part of the brand's philosophy. Encouraging traditional skills, highlighting the importance of handmade artistry and keeping our artistic heritage alive through jewellery are central to this vision.
      </p>

      <h2>A Cultural Identity Expressed Through Jewellery</h2>

      <p>
        Today's women look beyond beauty when choosing products that appeal to them. They also value the story behind an object, the process of its creation and the uniqueness it represents.
      </p>

      <p>
        Handcrafted jewellery concepts such as Tantuh: perfectly complement this evolving mindset. By giving traditional craftsmanship a contemporary context, the brand strives to preserve a distinct artistic identity in every piece it creates.
      </p>

      <div class="editorial-quote-card">
        “Tantuh: – A thread of tradition, a touch of artistry and a contemporary expression that complements the individuality of the modern woman!”
      </div>

      <p>
        With a beautiful blend of traditional craftsmanship and a style that resonates with the modern world, Tantuh: aims to establish its own distinctive identity in the world of handcrafted jewellery.
      </p>

      <p style="font-weight: 600; color: #FFFFFF;">
        Because true beauty does not lie merely in the sparkle of jewellery, but also in the art, culture and creativity behind every creation.
      </p>
    `,
    timestamp: 1792100000000
  },
  {
    id: "article-2",
    sortOrder: 2,
    title: "BODY SHAMING AND OBSCENITY: THE DISTORTED REALITY BEHIND THE GLITTERING WORLD OF SOCIAL MEDIA!",
    headline: "BODY SHAMING AND OBSCENITY: THE DISTORTED REALITY BEHIND THE GLITTERING WORLD OF SOCIAL MEDIA!",
    author: "Accolade Screenlady Editorial Council",
    authorRole: "Special Investigative & Analytical Essay • November 2026 Issue",
    date: "2026-11-05",
    displayDate: "November 2026 Issue",
    category: "Social Commentary",
    categoryBadge: "✒️ Social Commentary",
    readTime: "10 Min Read",
    photo: "assets/images/articles/article-2.jpg",
    photoCaption: "Accolade Screenlady Special Investigation: The Distorted Reality Behind Social Media",
    summary: "An in-depth critical analysis examining the toxic intersection of body shaming, viral obscenity, audience double standards, the commercialisation of controversy, and the urgent digital responsibility needed to protect our children.",
    previewExcerptHtml: `
      <div class="editorial-lead-box" style="margin-bottom: 0.95rem; padding: 0.85rem 1.1rem; font-size: 0.92rem;">
        <em>What is the connection between the mindset that finds pleasure in mocking someone else's body and the audience that eagerly consumes obscene content? And who is suffering the most serious consequences of all this? <strong>Our future generations!</strong></em>
      </div>
      <p>
        In today's digital age, social media is no longer merely a medium of communication. It has revolutionised numerous fields, including entertainment, business, advertising, public awareness, education, social movements and personality development.
      </p>
      <p>
        However, when the same platform is misused to defame others, ridicule someone's physical appearance, or earn fame and money through obscene content, the darker side behind this glittering progress becomes evident.
      </p>
      <p>
        The issues of body shaming and obscenity confronting society today are not limited to entertainment. They are closely connected to individual freedom, mental health, social responsibility, values and the future of the next generation...
      </p>
    `,
    fullContent: `
      <div class="editorial-lead-box">
        What is the connection between the mindset that finds pleasure in mocking someone else's body and the audience that eagerly consumes obscene content? To what extent is the growing tendency to go to any lengths to achieve popularity on social media taking society in the wrong direction? And who is suffering the most serious consequences of all this? <strong>Our future generations!</strong>
      </div>

      <p>
        In today's digital age, social media is no longer merely a medium of communication. It has revolutionised numerous fields, including entertainment, business, advertising, public awareness, education, social movements and personality development. However, when the same platform is misused to defame others, ridicule someone's physical appearance, or earn fame and money through obscene content, the darker side behind this glittering progress becomes evident.
      </p>

      <p>
        The issues of body shaming and obscenity confronting society today are not limited to entertainment. They are closely connected to individual freedom, mental health, social responsibility, values and the future of the next generation.
      </p>

      <h2>BODY SHAMING: WHO GAVE YOU THE RIGHT TO COMMENT ON SOMEONE ELSE'S BODY?</h2>

      <p>
        Body shaming refers to humiliating, teasing, insulting or publicly ridiculing someone based on their body structure, complexion, height, weight, facial features, hair, skin, way of smiling, walking style or any other natural physical characteristic.
      </p>

      <p>
        Statements such as, <em>"You have become so fat!"</em>, <em>"How can you become a model with such a dark complexion?"</em>, <em>"You are so short!"</em>, <em>"Your smile looks so strange!"</em> or <em>"You are getting old; why are you still working in the glamour industry?"</em> may appear harmless on the surface, but they can deeply hurt an individual's self-esteem.
      </p>

      <p>
        People making such comments often believe that they are merely joking. Their usual defence is, <em>"We were just having fun. Why are you taking it so seriously?"</em> However, they rarely consider the emotional impact their remarks may have on the person being targeted.
      </p>

      <div class="editorial-callout-box" style="border-left: 4px solid var(--gold-primary, #D4AF37); background: rgba(212, 175, 55, 0.08);">
        <strong style="color: #FFFFFF; font-size: 1.05rem;">Critical Reflection:</strong>
        <p style="margin: 0.5rem 0 0; color: var(--gold-light, #F3E5AB);">Before commenting on someone's body, we must ask ourselves one question: Who has given us the authority to become judges of another person's natural physical appearance?</p>
      </div>

      <p>
        Every individual has a different body structure. Everyone has a unique complexion, height, weight and facial appearance. This is the beauty of nature's diversity. Yet society has created certain fixed standards of beauty. Fair skin, a slim figure, specific facial features and youthful looks are often considered the benchmarks of attractiveness. Those who do not fit into these conventional standards frequently become targets of ridicule.
      </p>

      <p>
        This mindset needs to change because beauty is not limited to external appearance. An individual's achievements, thoughts, confidence, sensitivity and quality of work are equally important.
      </p>

      <h2>FROM ORDINARY PEOPLE TO CELEBRITIES, NO ONE IS SPARED!</h2>

      <p>
        Body shaming is not something experienced only by ordinary people from middle-class families. Working women, entrepreneurs, political leaders, actors, actresses, models and several other public figures also face such comments.
      </p>

      <p>
        The issue becomes particularly visible in the entertainment industry, especially in the case of female artists. Instead of discussing an actress's performance, people often focus on comments about her weight gain, changes in her face, how she no longer looks the way she used to, or how her age has become visible.
      </p>

      <p>
        When an artist delivers an outstanding performance, portrays a powerful character or speaks about a social issue, the discussion should revolve around her work. However, when she is targeted for her body or appearance, it exposes a social mindset that gives greater importance to external beauty than artistic talent.
      </p>

      <p>
        Of course, artists are public figures, and their professional work can be criticised. Their performances can be evaluated. However, there is a clear difference between constructive criticism of someone's work and insulting or ridiculing their physical appearance.
      </p>

      <p>
        Social media has blurred this distinction. Earlier, ridicule might have remained limited to a person's immediate social circle. Today, an insulting comment, photograph or video can reach thousands of people within seconds. Memes are created, jokes are circulated, and the targeted individual may repeatedly have to face the same humiliation.
      </p>

      <p>
        This can lead to a loss of confidence, fear of appearing in public, feelings of inferiority about one's body and increased mental stress. Some people even avoid posting their photographs or attending social gatherings because they fear what others might say.
      </p>

      <div class="editorial-quote-card" style="font-size: 1.08rem; padding: 1.25rem 1.6rem;">
        “This is not merely online humour. In many cases, it is a wound inflicted on someone's self-respect.”
      </div>

      <h2>SOCIAL MEDIA: FREEDOM OF EXPRESSION OR A LICENCE TO INSULT OTHERS?</h2>

      <p>
        Social media has given everyone an opportunity to express their opinions. Anyone can share their thoughts, showcase their talents and reach a large audience. This is undoubtedly one of its positive aspects.
      </p>

      <p>
        <strong>However, freedom of expression does not mean having a licence to insult others.</strong>
      </p>

      <p>
        Today, comments about someone's physical appearance often reach thousands of people. Some users respond with laughing emojis, others post insulting remarks, while some try to attract attention by making even more offensive comments.
      </p>

      <p>
        The dangerous aspect is that such behaviour gradually receives collective approval. Making fun of someone becomes a form of entertainment. A mindset that finds pleasure in another person's suffering begins to appear normal.
      </p>

      <p>
        Many people write things to strangers on social media that they would never dare to say in person. Comments made while hiding behind a screen reach the targeted individual, but the person posting them often remains unaware of their consequences.
      </p>

      <p>
        This can be described as a lack of digital responsibility. Before sharing a post, writing a comment or forwarding a joke, we must ask ourselves: Will this hurt someone? Would we be comfortable saying the same thing directly to the person we are making fun of? Developing the habit of asking these simple questions could reduce many forms of online humiliation.
      </p>

      <h2>THOSE WHO BODY-SHAME OTHERS AND THOSE WHO CONSUME OBSCENE CONTENT: WHY THIS DOUBLE STANDARD?</h2>

      <p>
        Beyond the issue of body shaming, there is another contradiction on social media that deserves attention.
      </p>

      <p>
        On one hand, people ridicule someone for their physical appearance and lecture women about morality based on their clothes or looks. On the other hand, videos centred on sexual attraction, suggestive content or obscenity receive enormous viewership.
      </p>

      <p>
        Many people who post obscene or insulting comments on a woman's video also watch that very video repeatedly, react to it and circulate it among others. Sometimes, even under the pretext of condemning a particular piece of content, they end up promoting it.
      </p>

      <p>
        This raises an important question: <strong>Are we indirectly making popular the very content that we publicly claim to oppose?</strong>
      </p>

      <p>
        In such circumstances, the role of the audience cannot be ignored. A content creator is one part of the social media ecosystem, but the audience that watches, reacts to, shares and discusses that content is equally important. However, not every viewer has the same intention. Some watch out of curiosity, some stay to criticise, while others view it purely for entertainment. A person's mindset cannot be determined solely by the number of followers or reactions on a video.
      </p>

      <p>
        Nevertheless, if we dislike a particular piece of content or find it objectionable, we must consider whether repeatedly watching it, sharing it and contributing to its popularity is appropriate. After all, on social media, attention often becomes a form of currency.
      </p>

      <h2>OBSCENITY, SENSATIONALISM AND THE BOUNDARIES OF FREEDOM OF EXPRESSION</h2>

      <p>
        Today, social media features a wide variety of content. Fashion, modelling, dance, acting, beauty, fitness, humour, relationships and sexual health are among the subjects discussed extensively.
      </p>

      <p>
        It would be incorrect to label every attractive video or video involving physical display as obscene. Similarly, judging someone's character based on their clothing choices, lifestyle or artistic expression is equally wrong.
      </p>

      <p>
        Adults have the freedom to make decisions about their own bodies. However, this freedom does not extend to sharing someone's private moments without consent, making sexually abusive comments, engaging in obscene harassment or exposing minors to inappropriate content. The important considerations here are consent, context, the nature of the content and responsibility.
      </p>

      <p>
        In some content, sexual suggestiveness is used merely as a means of attracting attention. Provocative headlines, gestures or shocking visuals are sometimes employed to draw viewers. Some content creators attempt to exploit audience curiosity and the functioning of social media algorithms to increase their reach.
      </p>

      <p>
        In such situations, the issue is not simply about blaming content creators. It also involves the responsibility of platforms, audience choices, advertisers and society's level of digital literacy. Opposing obscenity does not mean imposing restrictions on women's clothing. Instead, respecting consent, opposing sexual harassment, protecting minors through age-appropriate content controls and encouraging responsible digital behaviour must be given priority.
      </p>

      <h2>MILLIONS OF FOLLOWERS! BUT WHAT ABOUT QUALITY?</h2>

      <p>
        Today, when a social media account has lakhs or even millions of followers, discussions about that person's popularity, influence and financial success begin almost immediately. Videos that go viral within a short period often attract enormous attention.
      </p>

      <p>
        But does popularity automatically mean quality? Do followers necessarily translate into social prestige? Does the number of views determine the social value of content?
      </p>

      <p>
        To understand these questions, we must examine the economics of social media. On many platforms, audience attention is an important resource. Factors such as how long people watch a video, how many reactions it receives and how frequently it is shared can influence how widely the content is distributed.
      </p>

      <p>
        As a result, content that surprises people, creates controversy, provokes emotional reactions or appears provocative can attract greater attention. This does not mean that obscene content is always the most popular. Educational, scientific, social and inspirational content can also achieve tremendous popularity. However, we must ensure that meaningful and quality content does not get pushed aside in the race to grab attention.
      </p>

      <p>
        There are many excellent teachers who explain science in simple language. Doctors create awareness about health. Women entrepreneurs share their business journeys. Artists showcase their talents. Social activists highlight the problems faced by marginalised communities. Career counsellors guide students towards the right opportunities. Such content provides society with knowledge, inspiration and useful information.
      </p>

      <p>
        The question, therefore, is how much time do we actually devote to such meaningful content? How much of our time is wasted reading comments on controversial videos and engaging in unnecessary arguments? What appears on social media is important, but what we choose to stop and watch is equally important.
      </p>

      <h2>THE TENDENCY TO GO TO ANY LENGTHS FOR FAME AND MONEY</h2>

      <p>
        Digital platforms have created opportunities for financial independence for millions of people. Independent content creators, artists, teachers, entrepreneurs and small business owners can establish their own identities. Opportunities to earn through advertisements, sponsorships, collaborations and various commercial activities have also expanded. This is certainly a positive development.
      </p>

      <p>
        However, in this competitive environment, some people become tempted by the idea of achieving instant fame. Once a video goes viral, they may immediately try to create another similar video, produce increasingly provocative content, make controversial statements or insult others simply to attract attention.
      </p>

      <p>
        This can send the wrong message to society: <em>Creating controversy is easier than doing good work; shocking people is more profitable than producing quality content.</em>
      </p>

      <p>
        This conclusion does not apply to all content creators. Many individuals work extremely hard, conduct thorough research and produce excellent content with a strong sense of social responsibility. However, it is worrying that the temptation of instant popularity sometimes makes people ignore quality, reputation and responsibility.
      </p>

      <p>
        When the younger generation is constantly exposed to images of views, followers, expensive possessions and online popularity, there is a possibility that they may develop a distorted definition of success. <strong>Success is not merely about fame. It requires skill, consistency, hard work, knowledge and credibility. Long-lasting quality is far more valuable than temporary viral popularity.</strong>
      </p>

      <h2>EIGHT- TO TEN-YEAR-OLD CHILDREN AND THE GRIP OF SMARTPHONES</h2>

      <p>
        The most concerning aspect of this entire issue is its impact on young children. Today, many children have access to smartphones from a very early age. Mobile phones can be useful for online education, educational videos, communication and entertainment. However, how much they are used, why they are used and what kind of content children access are extremely important considerations.
      </p>

      <p>
        Children aged eight to ten do not necessarily have enough experience to understand everything they encounter on the internet. They may not always know which videos are appropriate, which ones are misleading, which jokes insult others or which online interactions with strangers could be dangerous.
      </p>

      <p>
        At this age, children may be exposed to sexually suggestive or age-inappropriate content, cyberbullying, violent gaming, online fraud and attempts by strangers to establish contact. Not every game or video is harmful. Gaming can help develop problem-solving abilities, strategic thinking and coordination in some children. However, excessive usage can lead to neglect of sleep, studies, physical activity, real-life friendships and family interactions.
      </p>

      <p>
        Parents' concerns are therefore completely understandable. The real issue is not whether children should be given mobile phones. It is about developing healthy habits regarding their use. Parents need to communicate with children about their digital lives, use age-appropriate parental controls, establish screen-time limits and create an environment where children feel comfortable discussing their online experiences.
      </p>

      <p>
        If children happen to watch an inappropriate video or interact with an unknown person, immediately humiliating or punishing them is not always the right approach. Instead, it is more helpful to understand the circumstances behind the experience and explain the importance of online safety.
      </p>

      <div class="editorial-callout-box" style="border-color: var(--gold-primary, #D4AF37); background: radial-gradient(ellipse at top, rgba(212, 175, 55, 0.15) 0%, rgba(14, 14, 20, 0.9) 100%);">
        <p style="margin: 0; font-size: 1.08rem; color: #FFFFFF; font-weight: 600; text-align: center;">
          “When giving children smartphones, do not give them technology alone. Give them the wisdom to distinguish right from wrong, an awareness of safety and a sense of digital responsibility.”
        </p>
      </div>

      <h2>THE RESPONSIBILITY OF PARENTS, TEACHERS AND SOCIETY</h2>

      <p>
        Although parents play an important role in shaping children's digital habits, the entire responsibility cannot be placed on their shoulders alone. Schools, teachers, society, content creators and social media platforms must also fulfil their respective responsibilities.
      </p>

      <p><strong>Parents should pay close attention to the following guidelines:</strong></p>

      <ul class="editorial-checklist">
        <li class="editorial-checklist-item">
          <div class="editorial-checklist-num">1</div>
          <div class="editorial-checklist-text"><strong>Age-Appropriate Independence:</strong> Allow young children to use personal smartphones independently only when age-appropriate and genuinely necessary.</div>
        </li>
        <li class="editorial-checklist-item">
          <div class="editorial-checklist-num">2</div>
          <div class="editorial-checklist-text"><strong>Clear Household Boundaries:</strong> Establish clear household rules regarding mobile phone use before bedtime, constant screen viewing during meals and unnecessary gaming during study hours.</div>
        </li>
        <li class="editorial-checklist-item">
          <div class="editorial-checklist-num">3</div>
          <div class="editorial-checklist-text"><strong>Open Digital Dialogue:</strong> Communicate with children about the videos, games and online platforms they enjoy.</div>
        </li>
        <li class="editorial-checklist-item">
          <div class="editorial-checklist-num">4</div>
          <div class="editorial-checklist-text"><strong>Safety Controls & Filters:</strong> Use parental controls, safe-search features and age-appropriate content settings wherever necessary.</div>
        </li>
        <li class="editorial-checklist-item">
          <div class="editorial-checklist-num">5</div>
          <div class="editorial-checklist-text"><strong>Privacy Education:</strong> Explain to children that they must never share personal information, home addresses, school details or private photographs with strangers.</div>
        </li>
        <li class="editorial-checklist-item">
          <div class="editorial-checklist-num">6</div>
          <div class="editorial-checklist-text"><strong>Wholesome Real-Life Alternatives:</strong> Encourage outdoor games, reading, hobbies, music, art and quality time with family.</div>
        </li>
        <li class="editorial-checklist-item">
          <div class="editorial-checklist-num">7</div>
          <div class="editorial-checklist-text"><strong>Empathetic Support:</strong> If children report online harassment or inappropriate contact, support them instead of blaming them.</div>
        </li>
      </ul>

      <p>
        In addition, schools should provide guidance on digital literacy, online consent, cyberbullying, social media responsibility and the importance of verifying the authenticity of information. Keeping children away from the internet altogether is not a permanent solution. Teaching them how to use it safely, sensibly and responsibly is far more important.
      </p>

      <h2>THE LEGAL POSITION ON BODY SHAMING AND OBSCENITY</h2>

      <p>
        Not every instance of body shaming or obscenity can automatically be classified as an offence under a single law. An inappropriate comment about someone's body, repeated harassment, threats, defamation, sexual harassment and misuse of private photographs are different types of conduct. The applicable legal provisions may vary depending on the circumstances.
      </p>

      <p>
        In India, depending on the nature of the incident, provisions under the <strong>Information Technology Act</strong>, the <strong>Bharatiya Nyaya Sanhita</strong> and other laws relating to sexual harassment, protection of women's dignity, defamation and privacy may apply. Cases involving sexually exploitative content concerning minors can attract particularly serious legal consequences.
      </p>

      <p>
        However, not every offensive online comment automatically amounts to a criminal offence. The actual words, context, intention and applicable legal provisions must be considered.
      </p>

      <div class="editorial-callout-box" style="border-left: 4px solid #38bdf8; background: rgba(56, 189, 248, 0.08);">
        <strong style="color: #FFFFFF; font-size: 1.05rem;">Official Reporting Guidance:</strong>
        <p style="margin: 0.5rem 0 0; color: #E0F2FE;">
          Anyone experiencing online harassment should preserve evidence of the relevant posts or messages, report the content to the platform and, when necessary, seek assistance from the cybercrime department or the police. Complaints can also be registered through India's National Cyber Crime Reporting Portal at <a href="https://cybercrime.gov.in" target="_blank" rel="noopener" style="color: var(--gold-light, #F3E5AB); text-decoration: underline;">cybercrime.gov.in</a>.
        </p>
      </div>

      <p style="font-size: 1.12rem; font-weight: 700; color: #FFFFFF; text-align: center; margin-top: 2rem;">
        Most importantly, fear of legal consequences should not be the only deterrent. Respecting another person's dignity must become an accepted social value and moral responsibility.
      </p>
    `,
    timestamp: 1793716800000
  }
];

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function purgeLegacyMockEditorials() {
  try {
    const raw = localStorage.getItem('screenlady_custom_editorials');
    if (raw) {
      const list = JSON.parse(raw);
      const cleaned = list.filter(item => 
        item && item.id && !item.id.startsWith('editorial-default-')
      );
      if (cleaned.length !== list.length) {
        localStorage.setItem('screenlady_custom_editorials', JSON.stringify(cleaned));
      }
    }

    const delRaw = localStorage.getItem('screenlady_deleted_ids');
    if (delRaw) {
      const deleted = JSON.parse(delRaw).filter(id => 
        id && !id.startsWith('editorial-default-') && id !== 'article-1' && id !== 'article-2'
      );
      localStorage.setItem('screenlady_deleted_ids', JSON.stringify(deleted));
    }
  } catch (e) {
    console.error('Error purging legacy mock data:', e);
  }
}

function getCustomEditorials() {
  try {
    const raw = localStorage.getItem('screenlady_custom_editorials');
    if (raw) return JSON.parse(raw);
    return [];
  } catch (e) {
    console.error('Error reading custom editorials:', e);
    return [];
  }
}

function normalizeEditorial(item) {
  if (!item) return null;
  const id = item.id;
  const title = item.title || item.headline || 'Accolade Screenlady Feature Editorial';
  const headline = item.headline || title;
  const author = item.author || 'Accolade Screenlady Editorial Desk';
  const authorRole = item.authorRole || item.authorDesignation || 'Editorial Feature';
  const authorDesignation = authorRole;
  const date = item.date || '2026-11-18';
  const displayDate = item.displayDate || date;
  const category = item.category || 'Special Feature';
  const categoryBadge = item.categoryBadge || `✦ ${category}`;
  const readTime = item.readTime || '5 Min Read';
  const photo = item.photo || 'assets/images/articles/article-1.jpg';
  const photoCaption = item.photoCaption || title;
  const summary = item.summary || item.pullQuote || '';
  const pullQuote = item.pullQuote || summary;

  let fullContent = item.fullContent || item.fullBody || item.content || '';
  if (!fullContent) {
    fullContent = `<p>${summary || title}</p>`;
  }

  let previewExcerptHtml = item.previewExcerptHtml;
  if (!previewExcerptHtml) {
    previewExcerptHtml = `
      <div class="editorial-lead-box" style="margin-bottom: 0.95rem; padding: 0.85rem 1.1rem; font-size: 0.92rem;">
        <strong>(Accolade Screenlady, Mumbai)</strong> ${summary || title}
      </div>
      ${fullContent}
    `;
  }

  return {
    ...item,
    id,
    title,
    headline,
    author,
    authorRole,
    authorDesignation,
    date,
    displayDate,
    category,
    categoryBadge,
    readTime,
    photo,
    photoCaption,
    summary,
    pullQuote,
    fullContent,
    fullBody: fullContent,
    content: fullContent,
    previewExcerptHtml
  };
}

function getAllEditorials() {
  const custom = getCustomEditorials();
  const deletedIds = (typeof window.getScreenladyDeletedIds === 'function') 
    ? window.getScreenladyDeletedIds() 
    : (() => { try { const r = localStorage.getItem('screenlady_deleted_ids'); return r ? JSON.parse(r) : []; } catch(e){ return []; } })();

  // Filter out default items that are overridden by custom items with same ID
  const defaults = DEFAULT_SCREENLADY_EDITORIALS.filter(d => !custom.some(c => c && c.id === d.id));
  const combined = [...custom, ...defaults]
    .map(normalizeEditorial)
    .filter(item => item && !deletedIds.includes(item.id));

  // Sort: custom/newest first, then by sortOrder if available
  combined.sort((a, b) => {
    if (a.sortOrder && b.sortOrder && !a.id.startsWith('editorial-custom-') && !b.id.startsWith('editorial-custom-')) {
      return a.sortOrder - b.sortOrder;
    }
    const dateA = new Date(a.date).getTime() || a.timestamp || 0;
    const dateB = new Date(b.date).getTime() || b.timestamp || 0;
    return dateB - dateA;
  });

  return combined;
}

/**
 * Renders Side-by-Side Editorial Cards with 10-15 line excerpts and "Read Full Article" triggers
 */
function renderEditorials(filter = 'all') {
  const container = document.getElementById('editorialsFeedContainer');
  const countBadge = document.getElementById('editorialsTotalCount');
  if (!container) return;

  const editorials = getAllEditorials();

  let filtered = editorials;
  if (filter !== 'all') {
    const filterLower = filter.toLowerCase();
    filtered = editorials.filter(item => {
      const cat = (item.category || '').toLowerCase();
      return cat.includes(filterLower);
    });
  }

  if (countBadge) {
    countBadge.textContent = `${filtered.length} ${filtered.length === 1 ? 'Article' : 'Articles'} Published`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; background: rgba(255,255,255,0.02); border: 1px dashed rgba(212,175,55,0.3); border-radius: var(--radius-md);">
        <p style="font-family: var(--font-serif-display); font-size: 1.5rem; color: var(--gold-light); margin-bottom: 0.5rem;">No Articles Found in This Category</p>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">Select "All Editorials" to view published articles.</p>
        <button class="btn btn-gold btn-sm" onclick="renderEditorials('all')">Show All Articles</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((item) => {
    return `
      <article class="editorial-side-card" id="${item.id}">
        
        <div>
          <!-- 1. The Name of Article & Metadata on Top -->
          <header class="editorial-card-header">
            <div class="editorial-card-meta-row">
              <span class="editorial-kicker-pill">${item.categoryBadge || item.category || 'Special Feature'}</span>
              <span class="editorial-meta-date">📅 ${item.displayDate || item.date} • ⏱️ ${item.readTime || '6 Min Read'}</span>
            </div>
            
            <h2 class="editorial-card-title">${item.title}</h2>
            
            <div class="editorial-card-author-line">
              <div class="editorial-avatar-circle">✍️</div>
              <div>
                <span class="editorial-byline-name">${item.author || 'Accolade Screenlady Desk'}</span>
                <span class="editorial-byline-role">${item.authorRole || 'Editorial Feature'}</span>
              </div>
            </div>
          </header>

          <!-- 2. The Photo Fitted in Frame -->
          <div class="editorial-card-photo-box" onclick="openFullScreenReader('${item.id}')" title="Click to Read Full Article">
            <img src="${item.photo}" alt="${item.title}" class="editorial-card-photo-img" loading="lazy">
            <div class="editorial-card-photo-badge">✦ Feature Photo</div>
          </div>

          <!-- 3. Showcase 10 to 15 Lines of Article Excerpt (Clamped cleanly on mobile) -->
          <div class="editorial-card-excerpt-wrap">
            <div class="editorial-card-excerpt">
              ${item.previewExcerptHtml || `<p>${item.summary}</p>`}
            </div>
            <div class="editorial-card-fade-overlay"></div>
          </div>
        </div>

        <!-- 4. Read More Option -> Opens Full Screen Reader -->
        <div class="editorial-card-action-bar">
          <button type="button" class="btn btn-gold editorial-read-btn" onclick="openFullScreenReader('${item.id}')" title="Read Complete Full-Screen Article">
            <span class="btn-text-desktop">📖 Read Full Article (Full Screen) →</span>
            <span class="btn-text-mobile">Read Full 📖</span>
          </button>
        </div>

      </article>
    `;
  }).join('');

  renderQuickJumpBar();
}

/**
 * Open Full Screen Reader for a Specific Article
 */
window.openFullScreenReader = function(id) {
  const editorials = getAllEditorials();
  const item = editorials.find(e => e.id === id);
  if (!item) return;

  const readerModal = document.getElementById('editorialFullScreenReader');
  const readerBody = document.getElementById('readerBodyContainer');
  const whatsappBtn = document.getElementById('readerWhatsappBtn');
  const copyBtn = document.getElementById('readerCopyBtn');
  const progressFill = document.getElementById('readerProgressFill');

  if (!readerModal || !readerBody) return;

  const shareUrl = encodeURIComponent(window.location.origin + window.location.pathname + '#' + item.id);
  const shareTitle = encodeURIComponent(item.title);

  // Update top actions
  if (whatsappBtn) {
    whatsappBtn.href = `https://wa.me/?text=${shareTitle}%20${shareUrl}`;
  }
  if (copyBtn) {
    copyBtn.onclick = () => window.copyArticleLink(item.id);
  }
  if (progressFill) {
    progressFill.style.width = '0%';
  }

  // Find other article for quick switch at the bottom
  const otherItem = editorials.find(e => e.id !== id);

  readerBody.innerHTML = `
    <article class="reader-full-article" id="reader-view-${item.id}">
      
      <!-- Article Header Meta & Title -->
      <header style="margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.85rem; margin-bottom: 1.25rem;">
          <span class="editorial-kicker-pill">${item.categoryBadge || item.category || 'Special Feature'}</span>
          <span style="font-size: 0.9rem; color: var(--gold-light, #F3E5AB); font-weight: 600;">
            📅 ${item.displayDate || item.date} • ⏱️ ${item.readTime || '6 Min Read'}
          </span>
        </div>

        <h1 style="font-family: var(--font-serif-display, 'Cinzel', serif); font-size: clamp(1.85rem, 3.8vw, 2.85rem); line-height: 1.28; color: #FFFFFF; margin-bottom: 1.5rem; text-shadow: 0 2px 10px rgba(0,0,0,0.85);">
          ${item.title}
        </h1>

        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; padding: 1.1rem 1.4rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(212,175,55,0.25); border-radius: 12px;">
          <div style="display: flex; align-items: center; gap: 0.9rem;">
            <div class="editorial-avatar-circle" style="width: 44px; height: 44px; font-size: 1.2rem;">✍️</div>
            <div>
              <div style="font-family: var(--font-serif-display, 'Cinzel', serif); font-size: 1rem; font-weight: 700; color: #FFFFFF;">${item.author}</div>
              <div style="color: var(--gold-light, #F3E5AB); font-size: 0.82rem;">${item.authorRole}</div>
            </div>
          </div>
          <div style="display: flex; gap: 0.6rem; align-items: center;">
            <a href="https://wa.me/?text=${shareTitle}%20${shareUrl}" target="_blank" rel="noopener" class="reader-btn" style="font-size: 0.78rem;">
              💬 Share WhatsApp
            </a>
            <button type="button" class="reader-btn" onclick="window.copyArticleLink('${item.id}')" style="font-size: 0.78rem;">
              🔗 Copy Link
            </button>
          </div>
        </div>
      </header>

      <!-- The Featured Photo on Top of Full Text -->
      <div class="reader-full-photo-wrap">
        <img src="${item.photo}" alt="${item.title}" class="reader-full-photo-img">
        <div class="editorial-photo-caption">
          <span>✦ ${item.photoCaption || 'Accolade Screenlady Official Editorial Publication • Feature Photo'}</span>
        </div>
      </div>

      <!-- The Complete Formatted Article Content -->
      <div class="editorial-feature-prose" style="font-size: 1.14rem; line-height: 1.9; color: #EDE8DE;">
        ${item.fullContent}
      </div>

      <!-- Footer Navigation & Reader Controls -->
      <footer class="reader-footer-nav">
        <div>
          ${otherItem ? `
            <button type="button" class="btn btn-outline-gold" onclick="openFullScreenReader('${otherItem.id}')" style="font-size: 0.9rem; padding: 0.75rem 1.4rem;">
              <span>Next Column: ${escapeHtml(otherItem.title.length > 38 ? otherItem.title.substring(0, 35) + '...' : otherItem.title)} →</span>
            </button>
          ` : ''}
        </div>

        <div style="display: flex; gap: 0.85rem; align-items: center;">
          <button type="button" class="btn btn-gold btn-sm" onclick="document.getElementById('editorialFullScreenReader').scrollTo({ top: 0, behavior: 'smooth' })">
            ↑ Back to Top
          </button>
          <button type="button" class="btn btn-outline-gold btn-sm" onclick="closeFullScreenReader()">
            ✕ Close Reader
          </button>
        </div>
      </footer>

      <!-- Publication Seal -->
      <div style="margin-top: 3.5rem; text-align: center; font-size: 0.85rem; color: #BBB6AD; border-top: 1px solid rgba(212,175,55,0.2); padding-top: 2rem;">
        Published in <strong>Accolade Screenlady Magazine</strong> • Conceptualizer, Publisher & Editor: <strong>Mr. Prashant Chandrakant Sagvekar</strong>
      </div>

    </article>
  `;

  // Display full-screen reader modal
  readerModal.style.display = 'block';
  readerModal.scrollTop = 0;
  document.body.style.overflow = 'hidden';

  // Attach scroll progress listener
  readerModal.onscroll = () => {
    const scrollTop = readerModal.scrollTop;
    const scrollHeight = readerModal.scrollHeight - readerModal.clientHeight;
    const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    const fill = document.getElementById('readerProgressFill');
    if (fill) fill.style.width = Math.min(100, Math.max(0, percent)) + '%';
  };
};

/**
 * Close Full Screen Reader
 */
window.closeFullScreenReader = function() {
  const readerModal = document.getElementById('editorialFullScreenReader');
  if (readerModal) {
    readerModal.style.display = 'none';
  }
  document.body.style.overflow = '';
};

/**
 * Copy article deep-link to clipboard
 */
window.copyArticleLink = function(id) {
  const url = window.location.origin + window.location.pathname + '#' + id;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      alert('✓ Article link copied to clipboard!\n' + url);
    }).catch(() => {
      prompt('Copy article link:', url);
    });
  } else {
    prompt('Copy article link:', url);
  }
};

function renderQuickJumpBar() {
  const container = document.querySelector('.editorial-quick-jump-bar');
  if (!container) return;
  const editorials = getAllEditorials();
  container.innerHTML = `
    <span class="jump-bar-label">✦ Read Full Screen:</span>
    ${editorials.map((e, idx) => `
      <button type="button" class="jump-pill" onclick="openFullScreenReader('${e.id}')" style="cursor: pointer; border: none;" title="${e.title}">
        <span>${idx === 0 ? '💎' : idx === 1 ? '📱' : '✒️'} ${e.title.length > 34 ? e.title.substring(0, 31) + '...' : e.title}</span>
      </button>
    `).join('')}
  `;
}

/**
 * Initialize Editorials Page
 */
function initEditorialsPage() {
  purgeLegacyMockEditorials();
  renderEditorials('all');
  renderQuickJumpBar();

  // Filter Buttons
  const filterBtns = document.querySelectorAll('.editorials-filter-btn, .editorial-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter') || 'all';
      renderEditorials(cat);
    });
  });

  // Keyboard shortcut: Escape closes reader
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeFullScreenReader();
    }
  });

  // Check URL Hash for deep link and open full-screen reader automatically
  if (window.location.hash) {
    const targetId = window.location.hash.substring(1);
    const exists = getAllEditorials().some(e => e.id === targetId);
    if (exists) {
      setTimeout(() => {
        window.openFullScreenReader(targetId);
      }, 350);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initEditorialsPage();
});
