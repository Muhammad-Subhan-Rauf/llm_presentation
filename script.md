# Speaker Script - "How LLMs Work (The Basics)"

> Navigation: Use Left/Right arrow keys, Space bar, or the on-screen buttons. You can also click the progress dots at the top to jump to any slide.

---

## Slide 1: Introduction - "Demystifying AI & LLMs"

**[Let the title animate in, then begin]**

Welcome, everyone. Today we're going to break down how AI - specifically things like ChatGPT, Claude, and Gemini - actually work under the hood. No coding required, no math degree needed.

There's a quote on screen from Arthur C. Clarke: "Any sufficiently advanced technology is indistinguishable from magic." And that's exactly how AI can feel - like magic. But it's not. It's patterns and numbers. And by the end of today, you'll have a solid picture of what's actually going on.

Now, you'll hear me use the term **LLM** a lot today. That stands for **Large Language Model** - it's just the technical name for the kind of AI that powers ChatGPT, Claude, and similar tools. "Large" because they're massive, "Language" because they work with text, and "Model" because they're mathematical models that learn patterns.

We're covering three big themes - you can see them at the bottom:
- **Neural Networks & Training** - how AI learns from examples
- **From Text to Numbers** - how AI reads language
- **Understanding & Generation** - how AI writes back to you

Everything here is interactive - I'll be clicking things, moving sliders, and showing you how this works live. So let's get into it.

---

## Slide 2: Weights & Parameters

**[Click to this slide - the neural network visualization appears]**

OK so this is a **neural network**. The name sounds fancy, but think of it as a decision-making machine - loosely inspired by how the brain works, where lots of simple connected units work together to make decisions. On the left side, we have three inputs - things like "does it have ears," "does it have fur," "does it have whiskers." On the right, we have three possible answers: Cat, Dog, or Toaster. Yes, Toaster - just for fun. And in the middle, there's a **hidden layer** - it's called "hidden" simply because we don't directly see what it does, it's an intermediate processing step between input and output.

See all those lines connecting the dots? Each line has a number attached to it called a **weight**. A weight is just a number that controls how much influence one node has on another - how strongly one dot "talks to" the next one. Blue lines are positive weights, meaning "yes, pass this signal along." Pink lines are negative, meaning "push against this." Thicker lines mean the weight is a bigger number, so the influence is stronger.

**[Click on a connection]**

When I click a line, I can see the exact weight value and change it with this slider. Watch the bars on the right - as I move this slider, the prediction changes in real time. That's the whole idea: the network's answer is completely controlled by these numbers.

**[Click "What is a Parameter?"]**

Now, you'll hear the word **parameter** a lot in AI. A parameter is just any number the network can adjust during learning - and in a neural network, the weights *are* the parameters. So when people say "GPT-4 has 1.8 trillion parameters," they mean it has 1.8 trillion of these adjustable numbers. This little network has 24. Same concept, incomprehensibly different scale.

**[Click "Randomize"]**

Now watch what happens when I scramble all the weights randomly. The network has no idea what it's doing - it might say "Toaster" when looking at a cat. The numbers are garbage right now.

**[Click "Auto-Tune (Train)"]**

But if I click Auto-Tune - which is basically **training** - watch the weights slowly adjust themselves until the network gets the right answer. Training just means: finding the right values for all those parameters. That's it. That's what takes weeks and costs millions of dollars for something like GPT-4 - finding the right 1.8 trillion numbers.

**[Optionally click "Run Forward Pass" to show the animation]**

I can also run what's called a **forward pass** - that just means pushing data through the network from left to right, layer by layer, to get a prediction. You can see the data flowing through the connections and activating each node.

**[Take questions from audience - "Does anyone have questions about weights or parameters before we move on?"]**

---

## Slide 3: The Training Loop

**[Click to this slide]**

So we saw the network fix itself with "Auto-Tune." But how does that actually work? It follows a loop - 5 steps, repeated over and over. This loop is the core of how *all* AI learns, from the simplest model to ChatGPT.

**[Click "Next Step" for each]**

**Step 1 - Forward Pass.** We just learned this term. The network takes the input and passes it forward through all those weighted connections. At the end, it produces a prediction - its best guess. Right now, that guess is probably wrong. Notice the Accuracy indicator in the top-left - it shows how well the network is doing overall.

**Step 2 - Loss Function.** Now the network needs to know *how wrong* it was. That's what the **loss function** does - it's basically a scoring system that measures the gap between what the network predicted and what the right answer actually is. Think of "loss" as "wrongness" - higher loss means more wrong. You can see it displayed in pink. The goal of all training is to make this number as small as possible.

**Step 3 - Backpropagation.** This is a big word, but the idea is simple. **Backpropagation** - or "backprop" for short - means the network traces *backwards* through itself to figure out which weights were most responsible for the error. Watch the pink arrow flow backwards through the network. It's basically assigning blame: "This weight contributed a lot to the mistake, this one didn't." It uses calculus under the hood to calculate exactly how much each weight should change - those calculations are called **gradients** - but the intuition is just: figure out who's at fault and by how much.

**Step 4 - The Optimizer.** Now that we know which weights are to blame and by how much, the **optimizer** does the actual adjusting. It nudges each blamed weight slightly in a better direction. Not by a lot - just a small step. You can see some of the weight values changing on the connections. The reason it takes small steps instead of big leaps is to avoid overshooting - it's like tuning a radio dial carefully instead of spinning it wildly.

**Step 5 - Repeat.** That's one full cycle, which in AI is called an **epoch**. The loss should have dropped slightly. Click again and we start the whole loop over - forward pass, loss, backprop, optimize, repeat.

**[Run through 2-3 more epochs]**

See the chart building in the bottom-right? Each dot is one epoch, and the line is trending downward - the loss is shrinking, meaning the network is getting less wrong over time. The accuracy indicator is improving too. In real AI models, this loop runs millions of times across enormous datasets. GPT-4 was trained on trillions of words of text.

**[Pause - "So that's the training loop. Five steps: guess, measure the error, trace it back, adjust, repeat. Every AI model you've ever used was built this way."]**

---

## Slide 4: From Numbers to Language (Bridge)

**[Click to this slide - the transition visualization appears]**

OK, let's take a breath. So far we've learned how a neural network works - it takes in numbers, multiplies them by weights, and learns by adjusting those weights over and over through the training loop. We showed all of that with a picture of a cat.

But here's the thing - ChatGPT doesn't look at pictures of cats. It reads *text*. And neural networks don't understand text. They only understand numbers.

**[Point to the text-to-numbers visualization]**

So we have a problem. On the left: a sentence - plain English. On the right: what the network actually needs - lists of numbers. How do we get from one to the other? That question mark in the middle is what the next three slides are about.

**[Point to the three roadmap cards]**

We'll solve it in three steps:
1. **Tokenization** - chop the text into small pieces
2. **Embeddings** - give each piece a meaningful set of numbers
3. **Attention** - help those pieces understand how they relate to each other

Don't worry if those terms are new - we'll explain each one. Let's start with tokenization.

---

## Slide 5: Tokenization (Part 4)

**[Click to this slide]**

So step one of turning text into numbers: **tokenization**. The word "token" just means "a piece" or "a chunk." Tokenization is the process of chopping text into these small pieces that the AI can work with. Each piece gets assigned a number - an ID - kind of like a barcode.

**[Point to the default text and the tokenized output]**

Here's a simple sentence: "The quick brown fox jumps over the lazy dog." Below it, you can see how the AI actually sees this - each colored box is one **token**, and the little number underneath is its **token ID**. The AI doesn't see the word "fox" - it sees the number 21125, or whatever ID "fox" is assigned.

**[Toggle from "Subword (BPE)" to "Word-level"]**

The simplest approach is word-level tokenization - make each word its own token. But that causes problems. What if the model encounters a word it's never seen before, like a brand name or a medical term? It has no token for it. It's stuck.

**[Toggle back to "Subword (BPE)" and click the "Subwords" preset]**

So instead, modern AI uses something called **BPE - Byte Pair Encoding**. Don't let the name intimidate you. The idea is simple: instead of whole words, break text into *sub-word pieces*. Look at this example: "unhappily" gets broken into "un," "happi," and "ly." The AI knows what each of those pieces means individually, even if it's never seen "unhappily" as one word before. It's like how you can figure out "un-happi-ly" even if you've never heard the exact word - you know the parts.

The pink tokens are **prefixes** (like "un" and "pre"), the orange ones are **suffixes** (like "ly" and "ing"), and the rest are **stems** - the core of the word.

**[Click "Long word" preset]**

Even this giant medical term - pneumonoultramicroscopicsilicovolcanoconiosis - gets broken into small, manageable pieces. The AI has never seen this word as a whole, but it knows the parts.

**[Click "Multilingual" preset]**

Here's something interesting - "Hello" stays as one token, but Chinese and Arabic text gets split into way more pieces. That's because most AI models were predominantly trained on English text, so English words are more efficiently encoded. Non-English languages often require more tokens to represent the same amount of meaning. It's a real limitation of current models.

**[Click "Why subwords?"]**

This expandable box explains the reasoning. The key insight: BPE gives the AI a **vocabulary** of about 50,000 sub-word pieces that can combine to represent virtually any word in any language. It's a clever balance between having a manageable dictionary and being able to handle anything thrown at it.

---

## Slide 6: Embeddings - Tokens to Vectors (Part 5)

**[Click to this slide - the scatter plot appears]**

OK so now we have tokens - pieces of text, each with an ID number. But here's the problem: the number "4829" doesn't tell the AI anything about what the word *means*. The word "cat" might be token 4829 and "dog" might be 2073 - but those numbers don't reflect that cats and dogs are related concepts. Step two fixes that. This is called **embedding**.

An **embedding** is when the AI learns to convert each token into a whole list of numbers - called a **vector**. Now, a vector is just a list of numbers, like [0.12, -0.34, 0.78, 0.56]. In real models, these lists are hundreds or even thousands of numbers long. The magic is that these numbers are arranged so that words with similar meanings get similar vectors - their number lists end up looking alike.

What you're seeing here is a 2D map of these vectors. In reality, the space has hundreds of **dimensions** - meaning each word is described by hundreds of numbers - but we've compressed it down to two dimensions so we can actually visualize it on screen.

**[Hover over "king"]**

Look - when I hover over "king," the closest words are "queen," "prince," and "princess." They're all royalty, so they cluster together in this space. Nobody told the AI "these are all royalty" - it figured it out just by reading tons of text and noticing that these words appear in similar contexts.

**[Hover over "cat"]**

Same here - "cat," "dog," "pet," and "kitten" are all near each other. The AI learned that these are related concepts. And over here, "run," "walk," "jump," and "swim" cluster as action words.

**[Click "Show: king - man + woman = ?"]**

Now here's the really cool part. If these vectors truly capture meaning as numbers, you should be able to do actual math with them. This is called **vector arithmetic**. Let me show you.

**[Step through the vector arithmetic]**

Start with the vector for "king." Subtract the vector for "man" - we're mathematically removing the concept of maleness. Add the vector for "woman" - adding the concept of femaleness. And the result... lands right next to "queen." King minus man plus woman equals queen. The AI learned the concept of gender relationships purely from patterns in text - nobody programmed that in. It emerged from the data.

**[Pause - let this sink in. This is usually the slide that gets the biggest reaction.]**

This is why embeddings are so powerful. They turn words into a mathematical space where meaning has geometry - similar things are close, and relationships are directions.

---

## Slide 7: Attention - How LLMs Focus (Part 6)

**[Click to this slide - the heatmap appears with "it" selected]**

So we've turned words into meaningful number vectors through embeddings. But there's still a problem. Each word's embedding was created in isolation - the vector for "it" is always the same, regardless of context. But look at this sentence: "The cat sat on the mat because **it** was tired."

What does "it" refer to? We know it means the cat. But how does the AI figure that out? The word "it" is five words away from "cat" in the sentence.

That's what **attention** solves - and it's arguably the most important concept in modern AI. The paper that introduced it was literally called "Attention Is All You Need," and it's the breakthrough that made LLMs possible. The idea: the **attention mechanism** lets each word look at every other word in the sentence and decide which ones are important to it. Each word essentially asks "who should I be paying attention to?"

**[Point to the heatmap - "it" row is selected by default]**

This grid is called an **attention heatmap**. Each row is a word, and the brightness of each cell shows how much attention that word pays to the word in that column. I've selected "it." Look on the right - "it" is paying 60% of its attention to "cat." The AI figured out that "it" refers to "cat," even though they're far apart in the sentence. This ability to connect distant related words is called **long-range dependency** - and it's what makes modern AI so much better than older approaches that could only look at nearby words.

**[Click the "mat" row]**

Now look at "mat" - it pays attention to "sat" and "on." That makes sense - the mat is what's being sat on. The attention pattern reflects the meaning.

**[Toggle to Head 2 (Semantics)]**

Real AI models don't just have one attention pattern - they have multiple **attention heads**. Think of each head as a different lens looking at the same sentence. Head 1 here focuses on **syntactic** patterns - that's just a fancy word for sentence structure, like what word comes before or after what. Switch to Head 2, and it's picking up **semantic** relationships - meaning-based connections. Notice how "tired" now pays strong attention to "cat," because semantically, the cat is the one that's tired. Different heads specialize in noticing different kinds of relationships.

**[Point to the Q/K/V cards]**

Under the hood, attention works with three components - **Query**, **Key**, and **Value**, or Q, K, V for short. Here's the intuition: the **Query** is what a word is looking for - "I need to find who I'm referring to." The **Key** is what each word advertises about itself - "I'm a noun, I'm an animal." And the **Value** is the actual information that gets passed along once a match is found. Each word creates all three, and they get compared to decide where attention flows. The comparison uses something called a **dot product** - which is just a way of measuring how similar two vectors are - followed by **softmax**, which just converts the similarity scores into percentages that add up to 100%.

**[Pause - "This mechanism - attention - is THE reason modern AI works as well as it does. Everything else is important, but attention is the breakthrough."]**

---

## Slide 8: Interactive LLM Playground

**[Click to this slide - the terminal interface appears]**

OK, now for the fun part. We've seen all the pieces - tokenization, embeddings, and attention. Now let's see the end result: how ChatGPT actually generates text. This is a simplified version, but the core principle is exactly the same. This is what's called **autoregressive generation** - a fancy term that just means "generate one word at a time, then use what you just wrote to pick the next one."

The prompt is "The future of AI is" - and we're going to predict what comes next.

**[Click "Predict"]**

The AI looks at everything written so far and produces a **probability distribution** over possible next tokens. That just means it assigns a likelihood to every possible next word - you can see the candidates on the right with their percentages. It picks the most likely one and adds it to the output.

**[Click "Predict" a few more times]**

Each time, it reads everything from the beginning again - including what it just generated - and picks the next most likely word. That's literally all ChatGPT does - predict the next token, over and over, really fast. When you see it "typing" a response, it's producing one token at a time.

**[Adjust the Temperature slider to 0.3]**

Now, see the **temperature** slider? In AI, temperature controls how "creative" versus "predictable" the output is. At 0.3, the probability distribution is very **peaked** - meaning the top choice has almost all the probability, and the AI almost always picks it. Very safe, very predictable, but also repetitive.

**[Slide Temperature to 1.8]**

At 1.8, the distribution gets **flattened** - the probabilities spread out more evenly, so lower-ranked words now have a real chance of being selected. This is where you get creative, surprising, and sometimes weird outputs. When people say "turn up the temperature" in AI settings, this is literally what they mean - it's spreading out the probability distribution.

**[Click different Top-K values]**

**Top-K** is another sampling control. The "K" just refers to a number - how many candidates to consider. With K=1, the model only considers the single most likely token, so the output is completely **deterministic** - meaning it'll produce the same output every time. With K=3, it picks randomly from the top 3. With K=10, it has 10 options to choose from. Lower K means more focused and predictable; higher K means more variety and surprise.

**[Click "Auto" to show continuous generation]**

Auto mode generates one token per second. This is basically what you see when ChatGPT is "typing" - it's doing this exact process one token at a time, just much faster than what we're seeing here.

**[Let it run for a few seconds, then stop. Invite audience to suggest prompts if time allows.]**

---

## Slide 9: The Transformer Architecture

**[Click to this slide - the pipeline diagram appears]**

So now let's zoom out and see the whole picture. This is the **Transformer** - the architecture, meaning the overall design, that powers every major AI model today. The name comes from that "Attention Is All You Need" paper from 2017. Everything we've learned fits together here as a pipeline.

**[Click each block from top to bottom]**

Follow the flow: text comes in at the top. The **Tokenizer** chops it into sub-word pieces - that's what we saw in Slide 5. The **Embedding** layer turns each piece into a meaningful vector - Slide 6. Then **Self-Attention** lets all the pieces communicate with each other - Slide 7. It's called "self-attention" because the sentence is attending to *itself*, not some external input. After that comes a **Feed-Forward network** - this is basically a small neural network, like the one from Slide 2, that processes each position independently and adds additional learned transformations.

And here's the key architectural insight - those Self-Attention and Feed-Forward blocks are wrapped together as a single unit called a **transformer block**, and that block repeats over and over. GPT-3 stacks 96 of these blocks on top of each other. Each layer refines the understanding a bit more - early layers tend to learn basic grammar, middle layers learn meaning, and later layers learn complex reasoning patterns.

At the bottom, the output layer produces a **probability distribution** over all possible next tokens - which is what we saw in the Playground.

**[Point to the Model Scale Comparison]**

Look at the scale comparison. GPT-2 in 2019 had 1.5 billion parameters - considered impressive at the time. GPT-3 jumped to 175 billion. Llama 3 is at 405 billion. And GPT-4 is estimated at 1.8 *trillion* - that's over a thousand times bigger than GPT-2. This chart uses a **logarithmic scale**, which means each step is a multiplication rather than an addition - the actual gaps between these models are enormous. Bigger models can learn more complex patterns, but they also need vastly more data and computing power to train.

---

## Slide 10: Conclusion - "From Weights to Wisdom?"

**[Click to this slide - elements animate in]**

Let's bring it all together. We started with a tiny neural network - 24 parameters that learned to tell a cat from a toaster. We learned the training loop: forward pass to make a prediction, loss function to measure the error, backpropagation to trace the error back, optimizer to adjust the weights, and repeat. Then we crossed over to language - we learned how tokenization splits text into sub-word pieces, how embeddings turn those pieces into meaningful vectors, and how the attention mechanism lets those vectors understand context and relationships. We put it all together in the Transformer architecture and saw autoregressive generation in action - predicting one token at a time.

**[Point to the concept recap cards]**

These six cards are your cheat sheet - weights, training, tokens, embeddings, attention, and the transformer. If you remember these six concepts, you understand the fundamentals of how every modern LLM works.

**[Point to the Key Takeaways]**

Five things to take away:
1. LLMs are **statistical pattern matchers** - they predict the next token based on patterns learned from massive amounts of text
2. **Attention** is the breakthrough - it lets the model understand context and connect related words across long distances
3. AI reads **tokens**, not words - it breaks text into sub-word pieces using BPE
4. **Temperature** and **top-k** are sampling controls that determine how creative or predictable the output is
5. **Scale** matters - more parameters and more training data yield more capable models, but with enormous computational cost

**[Point to the limitations callout]**

And one really important thing to remember: LLMs can **hallucinate** - that's the term for when AI confidently produces information that's completely wrong. It happens because the model is a pattern matcher, not a fact database. It generates text that *sounds* right based on patterns, but it has no concept of truth. It doesn't "understand" things the way you and I do. So always verify what AI tells you, especially for anything important.

Thank you! I'm happy to take questions. And feel free to come up afterward and play with any of the interactive slides.

---

## Tips for the Speaker

- **Pacing:** Don't rush the demos - they're the most engaging part. Let the audience watch the animations play out. You have plenty of time.
- **Teaching jargon:** Every technical term is explained inline the first time it appears. When you say a term, slow down slightly and emphasize the explanation. Repeat the term after explaining it: "...that's called backpropagation. Backprop traces backwards through the network..."
- **The Bridge slide (Slide 4):** Use this as a check-in. "Everyone following so far? Any questions about what we've covered? Good. Now we're going to see how this applies to language." This is a natural moment to take questions.
- **Audience interaction:** On the Neural Network slide, ask "What do you think will happen if I randomize the weights?" On the Playground, ask someone to suggest a prompt. On Embeddings, ask "What do you think will be near 'cat'?"
- **Simplify on the fly:** If the audience looks lost on Attention, skip the Q/K/V details and just focus on the heatmap demo - "each word looks at every other word and decides what's relevant." The visual is enough.
- **Don't fear questions:** If someone asks something you're not sure about, it's fine to say "Great question - that gets into deeper territory than we're covering today, but the short answer is..."
- **If something goes wrong:** Every slide works independently. Use the progress dots at the top to skip ahead if needed.
- **Keyboard shortcuts:** Left/Right arrows navigate. Space goes forward. Don't press these while typing in a text input.
- **Estimated timing:**
  - Slide 1 (Intro): 2-3 minutes
  - Slide 2 (Weights): 5-7 minutes (take your time explaining parameters, weights, hidden layers)
  - Slide 3 (Training): 6-7 minutes (lots of new terms: loss, backprop, gradients, optimizer, epoch)
  - Slide 4 (Bridge): 2-3 minutes (breather + audience check-in)
  - Slide 5 (Tokenization): 4-5 minutes (explain BPE, vocabulary, token IDs)
  - Slide 6 (Embeddings): 5-6 minutes (explain vectors, dimensions, vector arithmetic - king/queen is a highlight)
  - Slide 7 (Attention): 5-7 minutes (explain heatmap, heads, Q/K/V, dot product, softmax)
  - Slide 8 (Playground): 5-6 minutes (explain temperature, top-k, probability distribution, autoregressive)
  - Slide 9 (Transformer): 3-4 minutes (recap pipeline, explain transformer blocks, logarithmic scale)
  - Slide 10 (Conclusion): 3-4 minutes (recap all terms, hallucination)
  - **Total: ~42-52 minutes** (fits comfortably in a 40-50 minute slot, with flex for more or fewer audience questions)
