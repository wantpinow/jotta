import asyncio

import aiohttp

# async def get(session: aiohttp.ClientSession, **kwargs) -> dict:
#     # url = "http://0.0.0.0:8000"
#     url = "https://wantpinow-jotta-dev--batching-test-fastapi-app.modal.run"
#     print(f"Requesting {url}")
#     resp = await session.request("GET", url=url)
#     data = await resp.json()
#     print(data)
#     return data


async def get_question(session: aiohttp.ClientSession, question: str) -> dict:
    url = "https://wantpinow-jotta-dev--llama3.modal.run/completion/" + question
    print(f"Requesting {url}")
    resp = await session.request("GET", url=url)
    data = await resp.json()
    print(data)
    return data


questions = [
    # Generic assistant questions
    "What are you?",
    "What can you do?",
    # Coding
    "Implement a Python function to compute the Fibonacci numbers.",
    "Write a Rust function that performs binary exponentiation.",
    "How do I allocate memory in C?",
    "What are the differences between Javascript and Python?",
    "How do I find invalid indices in Postgres?",
    "How can you implement a LRU (Least Recently Used) cache in Python?",
    "What approach would you use to detect and prevent race conditions in a multithreaded application?",
    "Can you explain how a decision tree algorithm works in machine learning?",
    "How would you design a simple key-value store database from scratch?",
    "How do you handle deadlock situations in concurrent programming?",
    "What is the logic behind the A* search algorithm, and where is it used?",
    "How can you design an efficient autocomplete system?",
    "What approach would you take to design a secure session management system in a web application?",
    "How would you handle collision in a hash table?",
    "How can you implement a load balancer for a distributed system?",
    "Implement a Python class for a doubly linked list.",
    "Write a Haskell function that generates prime numbers using the Sieve of Eratosthenes.",
    "Develop a simple HTTP server in Rust.",
    # Literate and creative writing
    "What is the fable involving a fox and grapes?",
    "Who does Harry turn into a balloon?",
    "Write a story in the style of James Joyce about a trip to the Australian outback in 2083 to see robots in the beautiful desert.",
    "Write a tale about a time-traveling historian who's determined to witness the most significant events in human history.",
    "Describe a day in the life of a secret agent who's also a full-time parent.",
    "Create a story about a detective who can communicate with animals.",
    "What is the most unusual thing about living in a city floating in the clouds?",
    "In a world where dreams are shared, what happens when a nightmare invades a peaceful dream?",
    "Describe the adventure of a lifetime for a group of friends who found a map leading to a parallel universe.",
    "Tell a story about a musician who discovers that their music has magical powers.",
    "In a world where people age backwards, describe the life of a 5-year-old man.",
    "Create a tale about a painter whose artwork comes to life every night.",
    "What happens when a poet's verses start to predict future events?",
    "Imagine a world where books can talk. How does a librarian handle them?",
    "Tell a story about an astronaut who discovered a planet populated by plants.",
    "Describe the journey of a letter traveling through the most sophisticated postal service ever.",
    "Write a tale about a chef whose food can evoke memories from the eater's past.",
    "Write a poem in the style of Walt Whitman about the modern digital world.",
    "Create a short story about a society where people can only speak in metaphors.",
    "What are the main themes in Dostoevsky's 'Crime and Punishment'?",
    # History and Philosophy
    "What were the major contributing factors to the fall of the Roman Empire?",
    "How did the invention of the printing press revolutionize European society?",
    "What are the effects of quantitative easing?",
    "How did the Greek philosophers influence economic thought in the ancient world?",
    "What were the economic and philosophical factors that led to the fall of the Soviet Union?",
    "How did decolonization in the 20th century change the geopolitical map?",
    "What was the influence of the Khmer Empire on Southeast Asia's history and culture?",
    "What led to the rise and fall of the Mongol Empire?",
    "Discuss the effects of the Industrial Revolution on urban development in 19th century Europe.",
    "How did the Treaty of Versailles contribute to the outbreak of World War II?",
    "What led to the rise and fall of the Mongol Empire?",
    "Discuss the effects of the Industrial Revolution on urban development in 19th century Europe.",
    "How did the Treaty of Versailles contribute to the outbreak of World War II?",
    "Explain the concept of 'tabula rasa' in John Locke's philosophy.",
    "What does Nietzsche mean by 'ressentiment'?",
    "Compare and contrast the early and late works of Ludwig Wittgenstein. Which do you prefer?",
    "How does the trolley problem explore the ethics of decision-making in critical situations?",
    # Thoughtfulness
    "Describe the city of the future, considering advances in technology, environmental changes, and societal shifts.",
    "In a dystopian future where water is the most valuable commodity, how would society function?",
    "If a scientist discovers immortality, how could this impact society, economy, and the environment?",
    "What could be the potential implications of contact with an advanced alien civilization?",
    "Describe how you would mediate a conflict between two roommates about doing the dishes using techniques of non-violent communication.",
    "If you could design a school curriculum for the future, what subjects would you include to prepare students for the next 50 years?",
    "How would society change if teleportation was invented and widely accessible?",
    "Consider a future where artificial intelligence governs countries. What are the potential benefits and pitfalls?",
    # Math
    "What is the product of 9 and 8?",
    "If a train travels 120 kilometers in 2 hours, what is its average speed?",
    "Think through this step by step. If the sequence a_n is defined by a_1 = 3, a_2 = 5, and a_n = a_(n-1) + a_(n-2) for n > 2, find a_6.",
    "Think through this step by step. Calculate the sum of an arithmetic series with first term 3, last term 35, and total terms 11.",
    "Think through this step by step. What is the area of a triangle with vertices at the points (1,2), (3,-4), and (-2,5)?",
    "Think through this step by step. Solve the following system of linear equations: 3x + 2y = 14, 5x - y = 15.",
    # Facts
    "Who was Emperor Norton I, and what was his significance in San Francisco's history?",
    "What is the Voynich manuscript, and why has it perplexed scholars for centuries?",
    "What was Project A119 and what were its objectives?",
    "What is the 'Dyatlov Pass incident' and why does it remain a mystery?",
    "What is the 'Emu War' that took place in Australia in the 1930s?",
    "What is the 'Phantom Time Hypothesis' proposed by Heribert Illig?",
    "Who was the 'Green Children of Woolpit' as per 12th-century English legend?",
    "What are 'zombie stars' in the context of astronomy?",
    "Who were the 'Dog-Headed Saint' and the 'Lion-Faced Saint' in medieval Christian traditions?",
    "What is the story of the 'Globsters', unidentified organic masses washed up on the shores?",
    "Which countries in the European Union use currencies other than the Euro, and what are those currencies?",
    # Multilingual
    "战国时期最重要的人物是谁?",
    "Tuende hatua kwa hatua. Hesabu jumla ya mfululizo wa kihesabu wenye neno la kwanza 2, neno la mwisho 42, na jumla ya maneno 21.",
    "Kannst du die wichtigsten Eigenschaften und Funktionen des NMDA-Rezeptors beschreiben?",
    "¿Cuáles son los principales impactos ambientales de la deforestación en la Amazonía?",
    "Décris la structure et le rôle de la mitochondrie dans une cellule.",
    "Какие были социальные последствия Перестройки в Советском Союзе?",
    # Economics and Business
    "What are the principles of behavioral economics and how do they influence consumer choices?",
    "Discuss the impact of blockchain technology on traditional banking systems.",
    "What are the long-term effects of trade wars on global economic stability?",
    "What is the law of supply and demand?",
    "Explain the concept of inflation and its typical causes.",
    "What is a trade deficit, and why does it matter?",
    "How do interest rates affect consumer spending and saving?",
    "What is GDP and why is it important for measuring economic health?",
    "What is the difference between revenue and profit?",
    "Describe the role of a business plan in startup success.",
    "How does market segmentation benefit a company?",
    "Explain the concept of brand equity.",
    "What are the advantages of franchising a business?",
    "What are Michael Porter's five forces and how do they impact strategy for tech startups?",
    # Science and Technology
    "Discuss the potential impacts of quantum computing on data security.",
    "How could CRISPR technology change the future of medical treatments?",
    "Explain the significance of graphene in the development of future electronics.",
    "How do renewable energy sources compare to fossil fuels in terms of environmental impact?",
    "What are the most promising technologies for carbon capture and storage?",
    "Explain why the sky is blue.",
    "What is the principle behind the operation of a microwave oven?",
    "How does Newton's third law apply to rocket propulsion?",
    "What causes iron to rust?",
    "Describe the process of photosynthesis in simple terms.",
    "What is the role of a catalyst in a chemical reaction?",
    "What is the basic structure of a DNA molecule?",
    "How do vaccines work to protect the body from disease?",
    "Explain the significance of mitosis in cellular reproduction.",
    "What are tectonic plates and how do they affect earthquakes?",
    "How does the greenhouse effect contribute to global warming?",
    "Describe the water cycle and its importance to Earth's climate.",
    "What causes the phases of the Moon?",
    "How do black holes form?",
    "Explain the significance of the Big Bang theory.",
    "What is the function of the CPU in a computer system?",
    "Explain the difference between RAM and ROM.",
    "How does a solid-state drive (SSD) differ from a hard disk drive (HDD)?",
    "What role does the motherboard play in a computer system?",
    "Describe the purpose and function of a GPU.",
    "What is TensorRT? What role does it play in neural network inference?",
]


async def main(**kwargs):
    async with aiohttp.ClientSession() as session:
        tasks = []
        for question in questions:
            tasks.append(get_question(session=session, question=question))
        htmls = await asyncio.gather(*tasks, return_exceptions=True)
        return htmls


if __name__ == "__main__":
    asyncio.run(main())

# 61 seconds when
