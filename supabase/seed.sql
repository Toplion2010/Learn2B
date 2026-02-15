-- ============================================
-- Learn2B Seed Data
-- Run this after the schema migration
-- ============================================

-- Note: You must first create an admin user via Supabase Auth,
-- then update their role here. Replace the UUID below with the actual user ID.
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@learn2b.com';

-- ============================================
-- COURSES
-- ============================================
INSERT INTO public.courses (id, title, slug, description, category, difficulty, is_published, sort_order) VALUES
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'IELTS Speaking Mastery',
  'ielts-speaking-mastery',
  'Master all three parts of the IELTS Speaking test. This comprehensive course covers fluency strategies, topic-specific vocabulary, pronunciation tips, and grammar accuracy techniques used by Band 7+ achievers.',
  'speaking',
  'intermediate',
  true,
  1
),
(
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'IELTS Writing Excellence',
  'ielts-writing-excellence',
  'Develop outstanding Task 1 and Task 2 writing skills. Learn essay structure, coherence and cohesion techniques, academic vocabulary, and how to present complex arguments clearly and effectively.',
  'writing',
  'intermediate',
  true,
  2
);

-- ============================================
-- LESSONS: Speaking Course
-- ============================================
INSERT INTO public.lessons (course_id, title, slug, content, summary, sort_order, points_reward, is_published) VALUES
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Introduction to IELTS Speaking',
  'intro-to-speaking',
  '# Introduction to IELTS Speaking

The IELTS Speaking test is a face-to-face interview lasting 11-14 minutes. It consists of three parts:

## Part 1: Introduction & Interview (4-5 minutes)
The examiner asks you general questions about yourself, your home, work, studies, and familiar topics.

**Key Tips:**
- Answer with 2-3 sentences, not just "yes" or "no"
- Use a range of tenses naturally
- Show enthusiasm and personality

## Part 2: Long Turn (3-4 minutes)
You receive a cue card with a topic. You have 1 minute to prepare and should speak for 1-2 minutes.

**Key Tips:**
- Use the preparation time wisely — make brief notes
- Cover ALL points on the card
- Extend your answers with examples and details

## Part 3: Discussion (4-5 minutes)
The examiner asks deeper questions related to the Part 2 topic.

**Key Tips:**
- Give thoughtful, developed answers
- Use complex vocabulary and structures
- Offer different perspectives

## Assessment Criteria
You are scored on four criteria (each worth 25%):
1. **Fluency and Coherence** — How smoothly you speak
2. **Lexical Resource** — Range and accuracy of vocabulary
3. **Grammatical Range and Accuracy** — Variety of grammar structures
4. **Pronunciation** — Clarity and natural intonation',
  'Overview of the IELTS Speaking test format and scoring criteria',
  1,
  10,
  true
),
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Mastering Part 1: Common Topics',
  'mastering-part1',
  '# Mastering Part 1: Common Topics

Part 1 questions cover familiar topics. Here are the most common ones with model answers.

## Topic: Hometown
**Q: Where are you from?**
> "I come from Baku, the capital city of Azerbaijan. It''s a vibrant city on the Caspian Sea, known for its blend of modern architecture and ancient history. I''ve lived there my whole life and I really enjoy the cultural diversity."

## Topic: Work/Study
**Q: What do you do?**
> "I''m currently a university student, studying computer science. I chose this field because I''ve always been fascinated by technology and how it can solve real-world problems."

## Topic: Hobbies
**Q: What do you do in your free time?**
> "I''m quite into reading, especially non-fiction books about psychology and self-improvement. I also enjoy going for walks in the park — it helps me clear my mind after a long day of studying."

## Key Strategies
1. **Extend your answers** — Don''t just say "I like reading." Say WHY and give details.
2. **Use natural connectors** — "Actually," "To be honest," "Well..."
3. **Show range** — Mix simple and complex sentences
4. **Stay natural** — Don''t memorize scripts; the examiner will notice

## Practice Exercise
Try answering these questions, aiming for 3-4 sentences each:
- Do you prefer living in a city or countryside?
- What kind of music do you like?
- Do you prefer mornings or evenings?',
  'Learn to handle common Part 1 topics with confidence',
  2,
  10,
  true
),
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Part 2: The Cue Card Strategy',
  'part2-cue-card',
  '# Part 2: The Cue Card Strategy

Part 2 is where many candidates struggle. Here''s a proven strategy to handle any cue card confidently.

## The 1-Minute Preparation Strategy

When you receive your cue card, use the 1 minute wisely:
1. **Read all bullet points** (10 seconds)
2. **Jot down key words** for each point (30 seconds)
3. **Think of your opening sentence** (20 seconds)

## Template Structure

Use this framework for ANY cue card:

```
Opening: "I''d like to talk about..."
Point 1: What/Who/Where → Basic description
Point 2: When/How → Context and details
Point 3: Why → Reasons and feelings
Extension: Personal reflection or comparison
```

## Sample Cue Card

**Describe a book you recently read.**
You should say:
- what the book was about
- why you decided to read it
- what you learned from it
- and explain whether you would recommend it

### Model Answer:
> "I''d like to talk about a book called ''Atomic Habits'' by James Clear, which I read about two months ago.
>
> The book is essentially about how small, consistent changes in our daily routines can lead to remarkable results over time. The author uses scientific research and real-life examples to explain how habits are formed and how we can build better ones.
>
> I decided to read it because several of my friends had recommended it, and I was struggling with consistency in my study routine. I thought it might give me some practical strategies.
>
> What I found particularly valuable was the concept of ''habit stacking'' — basically linking a new habit to an existing one. For example, after my morning coffee, I now spend 20 minutes reviewing vocabulary.
>
> I would absolutely recommend this book to anyone who wants to improve their productivity. It''s written in a very accessible way, and the advice is genuinely practical."

## Common Mistakes to Avoid
- Running out of things to say (use the extension technique)
- Speaking too fast (moderate pace = higher fluency score)
- Ignoring bullet points (cover ALL of them)
- Stopping after 1 minute (aim for 1.5-2 minutes)',
  'Master the cue card with a proven preparation strategy',
  3,
  10,
  true
),
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Part 3: Abstract Discussion Skills',
  'part3-discussion',
  '# Part 3: Abstract Discussion Skills

Part 3 tests your ability to discuss abstract ideas. This is where Band 7+ candidates distinguish themselves.

## How Part 3 Differs from Parts 1 & 2
- Questions are more **abstract and analytical**
- Examiner expects **developed opinions**
- You should demonstrate **critical thinking**

## Types of Part 3 Questions

### 1. Opinion Questions
"Do you think technology has improved education?"
> "I''d say it has significantly enhanced education in many ways. For instance, online platforms have made quality education accessible to people in remote areas. However, I also believe there are downsides, such as decreased attention spans..."

### 2. Comparison Questions
"How is education today different from the past?"
> "There''s been a dramatic shift, I think. In the past, education was primarily teacher-centered, with students passively absorbing information. Nowadays, the emphasis is more on interactive learning and critical thinking..."

### 3. Speculation Questions
"How might education change in the future?"
> "I imagine that artificial intelligence will play an increasingly prominent role. We might see personalized learning paths for each student, tailored to their strengths and weaknesses..."

## Advanced Language Techniques
Use these phrases to sound more sophisticated:
- "From my perspective..."
- "This is a nuanced issue because..."
- "On one hand... on the other hand..."
- "I think it largely depends on..."
- "There seems to be a growing trend towards..."

## Practice: Develop Your Answer
For each question, aim for 4-6 sentences covering:
1. Your main opinion
2. A reason or example
3. A contrasting view or additional point
4. A conclusion or summary',
  'Develop abstract thinking and advanced discussion skills',
  4,
  10,
  true
),
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Vocabulary Boosters for Speaking',
  'vocabulary-boosters',
  '# Vocabulary Boosters for Speaking

Using a wide range of vocabulary is essential for achieving Band 7+. Here are key vocabulary sets organized by common IELTS topics.

## Education
- **curriculum** — the subjects and content taught in a course
- **rote learning** — memorizing information through repetition
- **hands-on experience** — practical experience
- **academic pressure** — stress from school/university demands
- **to broaden one''s horizons** — to expand knowledge and experience

## Technology
- **cutting-edge** — very advanced, at the forefront
- **to be glued to one''s screen** — to spend too much time on devices
- **digital literacy** — ability to use technology effectively
- **to go viral** — to spread rapidly online
- **a double-edged sword** — something with both advantages and disadvantages

## Environment
- **carbon footprint** — amount of CO2 produced by activities
- **sustainable development** — growth that meets current needs without compromising the future
- **to raise awareness** — to help people understand an issue
- **renewable energy** — energy from sources that don''t run out
- **ecological balance** — the stable state of an ecosystem

## Health & Lifestyle
- **sedentary lifestyle** — a lifestyle with little physical activity
- **work-life balance** — equal time for work and personal life
- **mental well-being** — state of psychological health
- **to keep fit** — to maintain good physical health
- **stress relief** — activities that reduce stress

## Tips for Using Advanced Vocabulary
1. **Don''t overdo it** — use advanced words naturally, not in every sentence
2. **Collocations matter** — learn words in phrases, not isolation
3. **Practice in context** — use new words in your speaking practice
4. **Paraphrase** — show range by saying the same thing different ways
5. **Use idiomatic language sparingly** — one or two idioms per answer is enough',
  'Essential vocabulary sets for common IELTS Speaking topics',
  5,
  10,
  true
);

-- ============================================
-- LESSONS: Writing Course
-- ============================================
INSERT INTO public.lessons (course_id, title, slug, content, summary, sort_order, points_reward, is_published) VALUES
(
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'Understanding IELTS Writing Tasks',
  'understanding-writing-tasks',
  '# Understanding IELTS Writing Tasks

The IELTS Academic Writing test has two tasks that must be completed in 60 minutes.

## Task 1 (20 minutes, 150+ words)
You describe visual information — a graph, chart, table, diagram, or map.

**You should:**
- Summarize the main trends, differences, or stages
- Compare and contrast data where relevant
- NOT give your opinion

## Task 2 (40 minutes, 250+ words)
You write an essay in response to a point of view, argument, or problem.

**Essay types include:**
1. **Opinion (Agree/Disagree)** — "To what extent do you agree or disagree?"
2. **Discussion** — "Discuss both views and give your opinion."
3. **Problem & Solution** — "What are the problems and how can they be solved?"
4. **Advantages & Disadvantages** — "What are the advantages and disadvantages?"

## Scoring Criteria (Each 25%)
1. **Task Achievement/Response** — Did you answer the question fully?
2. **Coherence and Cohesion** — Is your essay well-organized?
3. **Lexical Resource** — Range and accuracy of vocabulary
4. **Grammatical Range and Accuracy** — Variety of sentence structures

## Time Management
- Task 1: **20 minutes** (it''s worth less than Task 2)
- Task 2: **40 minutes** (it contributes more to your score)
- Always finish Task 2 first if you''re running out of time',
  'Overview of IELTS Writing Task 1 and Task 2 formats',
  1,
  10,
  true
),
(
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'Task 2: Essay Structure Template',
  'task2-essay-structure',
  '# Task 2: Essay Structure Template

A well-structured essay is crucial for a high score. Here''s a proven template.

## The 4-Paragraph Structure

### Paragraph 1: Introduction (2-3 sentences)
1. Paraphrase the question
2. State your thesis/position

**Example:**
> "It is often argued that university education should be free for all students. While there are valid arguments on both sides, I believe that governments should subsidize higher education to a significant extent."

### Paragraph 2: Body Paragraph 1 (5-7 sentences)
1. Topic sentence (your first main point)
2. Explanation
3. Example
4. Result/Impact

### Paragraph 3: Body Paragraph 2 (5-7 sentences)
1. Topic sentence (your second main point)
2. Explanation
3. Example
4. Result/Impact

### Paragraph 4: Conclusion (2-3 sentences)
1. Restate your position (in different words)
2. Summary of key points or final thought

## Linking Words to Use
- **Adding:** Furthermore, Moreover, In addition, Additionally
- **Contrasting:** However, Nevertheless, On the other hand, Conversely
- **Cause/Effect:** Consequently, As a result, Therefore, Hence
- **Examples:** For instance, For example, Such as, To illustrate
- **Concluding:** In conclusion, To summarize, Overall, All things considered

## Common Mistakes
- Writing a one-sided essay for a "discuss both views" question
- Not having a clear thesis statement
- Using informal language ("gonna", "kids", "stuff")
- Going off topic in body paragraphs
- Writing fewer than 250 words',
  'A proven 4-paragraph structure for Task 2 essays',
  2,
  10,
  true
),
(
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'Task 1: Describing Graphs and Charts',
  'task1-graphs-charts',
  '# Task 1: Describing Graphs and Charts

Task 1 requires you to describe visual data objectively.

## Structure for Graph/Chart Essays

### Opening (1-2 sentences)
Paraphrase the question — describe what the graph shows.
> "The bar chart illustrates the number of tourists visiting five European cities between 2015 and 2020."

### Overview (2-3 sentences)
Identify the KEY trends or features. This is the most important paragraph.
> "Overall, Paris consistently attracted the most visitors, while Athens saw the most significant growth during this period."

### Details (2 paragraphs)
Group similar data points and describe specific figures.

## Key Language for Describing Trends

### Upward Trends
- increased / rose / grew / climbed / surged
- a significant increase / a sharp rise / a steady growth

### Downward Trends
- decreased / fell / dropped / declined / plummeted
- a gradual decline / a sharp fall / a significant drop

### Stability
- remained stable / stayed constant / plateaued
- fluctuated slightly / leveled off

### Degree
- dramatically / significantly / considerably
- slightly / marginally / gradually / steadily

## Example Sentence Patterns
- "The number of X **rose dramatically** from 100 to 500 between 2015 and 2020."
- "There was a **gradual decline** in Y, from 80% to 60%."
- "X and Y followed **a similar trend**, both increasing over the period."
- "In contrast, Z **remained relatively stable** at approximately 200."',
  'How to describe visual data effectively in Task 1',
  3,
  10,
  true
),
(
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'Academic Vocabulary for Writing',
  'academic-vocabulary',
  '# Academic Vocabulary for Writing

Using formal, academic vocabulary is essential for Writing Tasks 1 and 2.

## Replacements for Common Words

| Basic Word | Academic Alternative |
|-----------|---------------------|
| good | beneficial, advantageous, favorable |
| bad | detrimental, adverse, harmful |
| big | substantial, considerable, significant |
| small | minimal, negligible, marginal |
| important | crucial, vital, essential |
| show | demonstrate, indicate, illustrate |
| get | obtain, acquire, attain |
| give | provide, offer, contribute |
| think | consider, argue, maintain |
| use | utilize, employ, implement |

## Useful Academic Phrases

### Introducing ideas
- "It is widely acknowledged that..."
- "There is a growing consensus that..."
- "Research has consistently shown that..."

### Expressing opinion
- "From my perspective..."
- "I would argue that..."
- "It seems reasonable to suggest that..."

### Concession
- "While it is true that..., it is important to consider..."
- "Admittedly, ..., however..."
- "Despite the fact that..."

### Giving examples
- "A case in point is..."
- "This is exemplified by..."
- "To illustrate this point..."

## Words to AVOID in Academic Writing
- Contractions (don''t → do not)
- Informal words (kids → children, stuff → materials)
- Slang or colloquialisms
- Overly emotional language
- First person "I think" (use "It could be argued")

## Practice
Rewrite these sentences using academic vocabulary:
1. "Lots of people think social media is bad for kids."
2. "The government should do something about pollution."
3. "It''s good to learn another language."',
  'Essential academic vocabulary and formal language for IELTS Writing',
  4,
  10,
  true
),
(
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'Sample Essays with Analysis',
  'sample-essays',
  '# Sample Essays with Analysis

Let''s analyze a Band 8 essay to understand what examiners look for.

## Question
> "Some people believe that the best way to improve public health is by increasing the number of sports facilities. Others think this has little effect and other measures are needed. Discuss both views and give your opinion."

## Band 8 Model Answer

**Introduction:**
> "The question of how to improve public health is a matter of significant debate. While some advocate for expanding sports infrastructure, others contend that alternative strategies would be more effective. This essay will examine both perspectives before presenting my own view."

**Body Paragraph 1 (Sports Facilities):**
> "Proponents of increasing sports facilities argue that greater access to gyms, swimming pools, and playing fields would encourage more people to exercise regularly. This is not without merit; research from the World Health Organization suggests that physical inactivity is the fourth leading risk factor for global mortality. By making exercise more convenient and accessible, particularly in underserved communities, governments could potentially address this issue. Furthermore, community sports centres often serve as social hubs, which can improve mental well-being alongside physical health."

**Body Paragraph 2 (Other Measures):**
> "However, critics of this approach point out that simply building facilities does not guarantee usage. Public health campaigns, dietary education, and healthcare accessibility may yield more substantial results. For instance, countries like Japan have implemented comprehensive school nutrition programs that have significantly reduced childhood obesity rates without relying primarily on sports facilities. Moreover, addressing mental health, reducing pollution, and ensuring access to clean water arguably have a more direct impact on overall public health."

**Conclusion:**
> "In conclusion, while expanding sports facilities can contribute to improved public health, I believe a multifaceted approach that includes education, healthcare access, and environmental measures is more likely to produce lasting results. Governments should invest in a combination of strategies rather than focusing on any single solution."

## Why This is Band 8

**Task Response:** ✅ Both views discussed, clear opinion given
**Coherence:** ✅ Clear structure, logical progression, good linking
**Vocabulary:** ✅ "proponents," "not without merit," "multifaceted," "yield"
**Grammar:** ✅ Complex sentences, conditionals, passive voice used naturally',
  'Detailed analysis of a Band 8 IELTS Writing Task 2 essay',
  5,
  10,
  true
);

-- ============================================
-- ASSIGNMENTS
-- ============================================
INSERT INTO public.assignments (title, description, assignment_type, course_id, points_reward, is_published) VALUES
(
  'Writing Task 2: Opinion Essay on Education',
  '## Task

**Some people believe that children should be taught only academic subjects at school, while others argue that practical skills such as cooking and financial management are equally important.**

**To what extent do you agree or disagree?**

### Instructions:
- Write at least 250 words
- Use the 4-paragraph structure from the course
- Include at least 2 body paragraphs with examples
- Use formal, academic language
- Proofread your work before submitting',
  'writing_task2',
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  20,
  true
),
(
  'Writing Task 1: Bar Chart Description',
  '## Task

**The bar chart below shows the percentage of adults who used different forms of transport to travel to work in a European city in 1960, 1980, and 2000.**

Summarize the information by selecting and reporting the main features, and make comparisons where relevant.

### Data:
| Transport | 1960 | 1980 | 2000 |
|-----------|------|------|------|
| Car | 20% | 35% | 55% |
| Bus | 40% | 30% | 15% |
| Bicycle | 25% | 20% | 10% |
| Walk | 15% | 15% | 20% |

### Instructions:
- Write at least 150 words
- Include an overview paragraph
- Describe key trends and comparisons
- Use appropriate data description language',
  'writing_task1',
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  20,
  true
),
(
  'Speaking Part 2: Describe a Skill You Learned',
  '## Cue Card

**Describe a skill you learned that you found useful.**

You should say:
- what the skill is
- when and where you learned it
- how you learned it
- and explain why you found it useful

### Instructions:
- Write your response as if you were speaking (natural, conversational tone)
- Aim for 200-300 words (equivalent to 1.5-2 minutes of speaking)
- Cover ALL four bullet points
- Use the cue card strategy from the course
- Include personal examples and details',
  'speaking_part2',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  20,
  true
),
(
  'Speaking Part 3: Discussion on Learning and Education',
  '## Discussion Questions

Answer the following Part 3 questions in detail. Write your responses as natural spoken answers.

**Questions:**
1. What skills do you think will be important in the future?
2. How has the way people learn changed compared to the past?
3. Do you think schools should teach life skills? Why or why not?
4. How important is it for adults to continue learning throughout their lives?

### Instructions:
- Answer ALL four questions
- Write 3-5 sentences per question
- Use advanced vocabulary and complex structures
- Give reasons, examples, and different perspectives
- Use linking phrases like "From my perspective...", "On the other hand..."',
  'speaking_part3',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  20,
  true
);
