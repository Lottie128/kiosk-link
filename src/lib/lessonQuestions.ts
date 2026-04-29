// Extracted from Drishti RC Jain STEM Lab curriculum PDF.
// One question bank per class (2–10), aligned to the weekly lesson plan.

export interface LessonQuestion {
  week: number
  topic: string
  question: string
  answer: string
  hint: string
}

export const LESSON_QUESTIONS: Record<number, LessonQuestion[]> = {
  // ── Class 2 ── Basic Circuits, Sensors, Simple Coding ─────────────────────
  2: [
    { week: 1,  topic: 'What Is Electricity?',        question: 'What do you need to make electricity flow through a circuit?',              answer: 'A battery, wires, and a closed loop (complete circuit)',       hint: 'Think of the 3 things on your desk...' },
    { week: 2,  topic: 'Switches — On/Off Control',   question: 'What is the difference between a switch and a button?',                     answer: 'A switch stays ON or OFF; a button only works while held',      hint: 'Which one do you hold down?' },
    { week: 3,  topic: 'Sound Output — Buzzers',      question: 'What does a buzzer do when electricity flows through it?',                  answer: 'It makes a beeping or buzzing sound',                           hint: 'Listen when the circuit is complete...' },
    { week: 4,  topic: 'Colorful Light — RGB LEDs',   question: 'What do the letters R, G, B stand for in an RGB LED?',                     answer: 'Red, Green, Blue',                                              hint: 'Three colours that make all other colours!' },
    { week: 5,  topic: 'Brightness Control',          question: 'What component can you use to make an LED brighter or dimmer?',            answer: 'A potentiometer (variable resistor)',                            hint: 'It has a knob you can turn...' },
    { week: 8,  topic: 'Light Sensor (LDR)',          question: 'What does an LDR (Light Dependent Resistor) do in the dark?',              answer: 'Its resistance increases, so less current flows',               hint: 'LDR = Light Dependent Resistor' },
    { week: 9,  topic: 'Touch Sensor',                question: 'Name one real-life gadget that uses a touch sensor.',                      answer: 'Smartphone, elevator button, or smart doorbell',                hint: 'What do you tap every day?' },
    { week: 11, topic: 'Servo Motors',                question: 'What makes a servo motor special compared to a normal DC motor?',          answer: 'A servo rotates to an exact angle and stops there',             hint: 'Think about robot arms and doors...' },
    { week: 13, topic: 'Logic Circuits — AND/OR',     question: 'In an AND gate circuit, when does the LED turn ON?',                      answer: 'Only when BOTH buttons are pressed at the same time',           hint: 'AND means both must be true...' },
    { week: 17, topic: 'Mini Home Automation (Relay)', question: 'What does a relay do in a home automation circuit?',                      answer: 'A relay uses a small signal to switch a bigger circuit ON or OFF', hint: 'It\'s an electrically controlled switch' },
    { week: 14, topic: 'Block Coding — Sequencing',   question: 'What is a "sequence" in block coding?',                                   answer: 'Steps that run in order, one after the other',                  hint: 'First this, then that, then that...' },
    { week: 18, topic: 'Build Your Bot',              question: 'Name three output components you can use in a simple robot.',              answer: 'LED, buzzer, and motor (or servo)',                             hint: 'Things that DO something with electricity' },
  ],

  // ── Class 3 ── Coding + Physical Robotics ─────────────────────────────────
  3: [
    { week: 1,  topic: 'What Is Coding?',             question: 'What is coding, and why do we use it?',                                   answer: 'Coding is writing instructions for a computer to follow; we use it to automate tasks', hint: 'What language do computers understand?' },
    { week: 2,  topic: 'Animation Building',          question: 'What block do you use in PictoBlox to make a sprite move forward?',       answer: '"Move __ steps" block',                                         hint: 'Check the motion section...' },
    { week: 5,  topic: 'Story Making',                question: 'What three things do you need to tell a digital story in PictoBlox?',     answer: 'Motion, looks (costumes/backdrops), and sound blocks',          hint: 'Think about what makes a story...' },
    { week: 6,  topic: 'Interactive Games Part 1',    question: 'What is an "event" in block coding?',                                    answer: 'Something that triggers code to run, like pressing a key or clicking', hint: 'What starts the action?' },
    { week: 8,  topic: 'Getting to Know Hardware',    question: 'Name the three main types of parts in a robotics kit.',                  answer: 'Sensors (input), actuators/motors (output), and a controller (brain)', hint: 'What goes in, what comes out, what thinks?' },
    { week: 9,  topic: 'Building Emotional Robot',    question: 'How can a robot "show" it is happy using hardware?',                     answer: 'A green LED blink, a happy beep sound, or a "smile" motor movement', hint: 'Think output components...' },
    { week: 12, topic: 'Musical Fruit Piano',         question: 'How does a touch sensor turn a banana into a piano key?',                answer: 'When touched, the sensor sends a signal to play a specific note', hint: 'Conductive touch → signal → sound' },
    { week: 15, topic: 'Tobi the Button-Controlled Bot', question: 'What happens in code when a button is pressed?',                    answer: 'An event is triggered and the code for that action runs',        hint: '"When button pressed, do..."' },
    { week: 18, topic: 'Making a Square with Robot',  question: 'What sequence of moves makes a robot drive in a perfect square?',       answer: 'Move forward, turn 90°, repeat 4 times',                        hint: 'A square has 4 equal sides and 4 right angles' },
    { week: 19, topic: 'Robot Control: Wireless',     question: 'What is the advantage of wireless robot control?',                      answer: 'You can control the robot from a distance without a wire connecting you', hint: 'No wires needed!' },
    { week: 22, topic: 'Gripper Robot — Build',       question: 'What two actions does a gripper robot need to perform?',                answer: 'Open and close the gripper to pick up and release an object',   hint: 'Think of a hand...' },
    { week: 25, topic: 'Night Light / Environmental Sensor', question: 'What sensor would you use to build an automatic night light?',  answer: 'An LDR (light sensor) — turns the light ON when it gets dark',  hint: 'What detects darkness?' },
  ],

  // ── Class 4 ── PictoBlox, Microcontrollers, AI intro ──────────────────────
  4: [
    { week: 1,  topic: 'Intro to PictoBlox',          question: 'What is PictoBlox and what can you build with it?',                      answer: 'PictoBlox is a block coding platform for making animations, games, and controlling hardware', hint: 'It\'s like Scratch but with hardware!' },
    { week: 3,  topic: 'Making Shapes — Loops',       question: 'How would you code a triangle using repeat blocks?',                    answer: 'Repeat 3 times: move forward, turn 120 degrees',                hint: 'A triangle has 3 sides and 3 angles that total 360°' },
    { week: 4,  topic: 'If/Else — Sensing in Code',   question: 'What does an "if/else" block do in code?',                             answer: 'If a condition is true, do action A; otherwise do action B',    hint: 'It\'s a decision maker...' },
    { week: 7,  topic: 'Meeting Quarky (Arduino)',    question: 'What is a microcontroller and what does it do?',                        answer: 'A tiny computer on a chip that reads sensors and controls outputs', hint: 'Quarky/Arduino is one — think of it as the robot\'s brain' },
    { week: 9,  topic: 'Traffic Lights',              question: 'What is the correct order of traffic light colours in India?',          answer: 'Red (stop) → Green (go) → Yellow/Amber (slow down)',           hint: 'Think about your road crossing...' },
    { week: 10, topic: 'Dice Roll — Random, Variables', question: 'What is a variable in coding?',                                     answer: 'A named box that stores a value which can change',              hint: 'score = 0; then score = score + 1' },
    { week: 15, topic: 'LED Looping Patterns',        question: 'What is a loop in coding and why is it useful?',                       answer: 'A loop repeats code multiple times, saving you from writing it again and again', hint: '"Repeat 10 times" is a loop' },
    { week: 17, topic: 'Color Sensor',                question: 'How does a color sensor work?',                                        answer: 'It shines light and measures how much bounces back from different colour surfaces', hint: 'Light reflects differently off different colors' },
    { week: 21, topic: 'Face Expression Detector (AI)', question: 'What is AI (Artificial Intelligence)?',                             answer: 'AI is when a computer learns from data to make decisions, like recognising faces', hint: 'It learns by seeing lots of examples' },
    { week: 22, topic: 'Face Tracking Robot',         question: 'What kind of sensor does a face-tracking robot use to find a face?',   answer: 'A camera with AI/vision software',                              hint: 'Think about what humans use to find faces...' },
    { week: 18, topic: 'Mini Mars Rover',             question: 'What sensors would a Mars rover need to avoid obstacles?',             answer: 'Ultrasonic or IR distance sensors, and a camera',               hint: 'What tells it something is in the way?' },
    { week: 6,  topic: 'Animated Storybook Lamp',     question: 'What does it mean to "code an animation" to match hardware?',         answer: 'Making the on-screen sprite do the same action as the physical LED or motor', hint: 'Virtual and physical together!' },
  ],

  // ── Class 5 ── Advanced Sensors, Logic Gates, Data, AI ────────────────────
  5: [
    { week: 3,  topic: 'Loops & Patterns in Code',   question: 'What is the difference between a "repeat" loop and a "forever" loop?',  answer: '"Repeat" runs a set number of times; "forever" runs until stopped', hint: 'One has a limit, one does not' },
    { week: 4,  topic: 'If/Else with Sensors',        question: 'Write a simple if/else rule for a door alarm using an IR sensor.',      answer: 'If IR sensor detects object → buzzer ON; else → buzzer OFF',    hint: 'Sensor detects → action happens' },
    { week: 9,  topic: 'Sequenced Traffic Lights',   question: 'How do you control the timing of traffic lights in code?',              answer: 'Use "wait" blocks between each light state (red → wait → green → wait)', hint: 'Timing is controlled by the wait/delay command' },
    { week: 16, topic: 'Environmental Sensing',       question: 'Name three environmental sensors and what each measures.',              answer: 'LDR (light), temperature sensor (heat), ultrasonic (distance)',  hint: 'Think about what surrounds us...' },
    { week: 17, topic: 'Color/Line Sensor Robot',     question: 'How does a line-following robot stay on a black line?',                answer: 'A color/IR sensor detects the line; code tells motors to steer back if it goes off', hint: 'Sensor reads → correct the direction' },
    { week: 18, topic: 'Weather Station',             question: 'What data does a weather station collect?',                            answer: 'Temperature, light level, humidity (moisture in the air)',       hint: 'What do weather reporters tell us?' },
    { week: 21, topic: 'AI: Face Expression & Recognition', question: 'How does a computer "learn" to recognise a happy face?',       answer: 'It is trained on thousands of photos labelled as "happy" — it spots the pattern', hint: 'Lots of examples → pattern → prediction' },
    { week: 25, topic: 'Logic Gates: AND, OR, NOT',  question: 'What does a NOT gate do to a signal?',                                answer: 'It inverts it — if input is ON, output is OFF; if OFF, output is ON', hint: 'NOT TRUE = FALSE' },
    { week: 22, topic: 'Robotics Data Logging',       question: 'Why would a robot log sensor data to a file?',                        answer: 'To record what happened for review, analysis, or fixing problems later', hint: 'Like a diary for a robot' },
    { week: 19, topic: 'Wireless Data Send/Receive',  question: 'What are two ways a microcontroller can send data wirelessly?',        answer: 'Bluetooth and Wi-Fi',                                            hint: 'Think about how your phone connects...' },
    { week: 6,  topic: 'Digital Bookmark Lamp',       question: 'What is a take-home kit project and why is it valuable?',             answer: 'A project you build at school and take home to demo — shows parents real STEM skills', hint: 'Build it, take it, show it!' },
    { week: 12, topic: 'Door Security System',        question: 'Which sensor is best for detecting if a door has been opened?',       answer: 'A magnetic reed switch or an IR/ultrasonic sensor',             hint: 'Something that detects movement or proximity' },
  ],

  // ── Class 6 ── Python intro, Robotics, AI, IoT ────────────────────────────
  6: [
    { week: 3,  topic: 'Algorithm & Flowchart Basics', question: 'What is an algorithm?',                                              answer: 'A step-by-step set of instructions to solve a problem',         hint: 'Like a recipe for a computer' },
    { week: 4,  topic: 'Pseudocode Practice',          question: 'What is pseudocode?',                                                answer: 'A human-readable description of code using plain language before real coding', hint: 'It reads like English but works like code' },
    { week: 7,  topic: 'Variables & Math Game',        question: 'What is the difference between an integer and a float in coding?',   answer: 'An integer is a whole number (e.g. 5); a float has a decimal (e.g. 5.3)', hint: 'INT = whole, FLOAT = decimal' },
    { week: 14, topic: 'Ultrasonic Distance Demo',     question: 'How does an ultrasonic sensor measure distance?',                    answer: 'It sends a sound pulse and measures how long it takes to bounce back', hint: 'Like a bat using echolocation!' },
    { week: 15, topic: 'Edge Detector Logic',          question: 'What is an edge/cliff sensor used for in robotics?',                 answer: 'It detects when the robot is near the edge of a table or surface, and stops it falling', hint: 'Think of a Roomba near stairs...' },
    { week: 21, topic: 'AI: Face Expression Demo',     question: 'Name two ways AI is used in everyday life.',                        answer: 'Face unlock on phones, voice assistants (Siri/Alexa), spam filters, recommendation systems', hint: 'Look around your home...' },
    { week: 25, topic: 'Logic Gates: AND/OR/NOT',      question: 'In a logic circuit, if A=1 and B=0, what is A OR B?',               answer: '1 (true) — because at least ONE input is true',                hint: 'OR only needs one to be ON' },
    { week: 26, topic: 'Multi-Sensor Fusion Project',  question: 'What does "multi-sensor fusion" mean?',                            answer: 'Combining data from multiple sensors to get a smarter, more accurate result', hint: 'Two sensors know more than one!' },
    { week: 18, topic: 'Mars Rover / Obstacle Bot',    question: 'What programming logic helps a robot navigate around obstacles?',   answer: 'If distance < threshold → stop and turn; else → move forward', hint: 'Sensor data drives the decision' },
    { week: 24, topic: 'Wireless Desk Notifier/Alarm', question: 'How can one microcontroller trigger an LED on ANOTHER microcontroller wirelessly?', answer: 'By sending a wireless signal (Bluetooth/Wi-Fi) that the receiver listens for', hint: 'Transmitter → signal → receiver' },
    { week: 13, topic: 'Physical Sensing: LDR/Touch',  question: 'What is a pull-up resistor and why is it used with a button?',      answer: 'It keeps the signal HIGH by default; the button pulls it LOW — prevents floating values', hint: 'Prevents random noise readings' },
    { week: 20, topic: 'Line/Color Following Robot',   question: 'What does "if color = black, turn left" mean for a robot?',        answer: 'If the sensor reads black (the line), steer left to follow the path', hint: 'Color sensor input → motor output' },
  ],

  // ── Class 7 ── Python, Sorting, AI, Advanced Robotics ────────────────────
  7: [
    { week: 2,  topic: 'Variables in Real Life',      question: 'Give a real-life example of a variable.',                            answer: 'Your age (changes each year), temperature (changes each hour), score in a game', hint: 'What changes over time?' },
    { week: 7,  topic: 'Collections & Arrays',        question: 'What is an array (list) in Python and when would you use one?',      answer: 'An ordered collection of items — e.g. storing 30 student names instead of 30 variables', hint: 'students = ["Aryan", "Priya", "Raj"]' },
    { week: 8,  topic: 'Sorting Algorithms',           question: 'How does Bubble Sort work?',                                        answer: 'It compares pairs of numbers and swaps them if out of order, repeating until sorted', hint: 'Biggest "bubbles up" to the top' },
    { week: 10, topic: 'Functions — Reusable Code',   question: 'What is a function in Python and why use one?',                      answer: 'A named block of code you can call multiple times — prevents repeating the same code', hint: 'def blink(): ...' },
    { week: 13, topic: 'AI Introduction & Ethics',    question: 'What is "bias" in an AI system?',                                   answer: 'When an AI gives unfair results because its training data was unbalanced or unfair', hint: 'Garbage in, garbage out' },
    { week: 15, topic: 'Face Detection with AI',      question: 'What is a dataset in machine learning?',                            answer: 'A large collection of labelled examples used to train a model',  hint: 'The AI learns from this...' },
    { week: 19, topic: 'Speech Recognition',          question: 'How does a voice assistant understand spoken words?',               answer: 'It converts audio to text (speech-to-text) then uses NLP to find the meaning', hint: 'Sound → text → meaning' },
    { week: 20, topic: 'Natural Language Processing', question: 'What does NLP (Natural Language Processing) allow computers to do?', answer: 'Understand, interpret, and respond to human language',          hint: 'This is how chatbots work!' },
    { week: 23, topic: 'Line Following Robot (Part 1)', question: 'What type of sensor is most commonly used for line-following robots?', answer: 'IR (infrared) or color sensors beneath the robot',           hint: 'They detect contrast between black and white' },
    { week: 27, topic: 'Road Safety Device',          question: 'Design a smart traffic solution — what sensors and outputs would it need?', answer: 'Ultrasonic sensor (detect cars), camera (read signs), LED signals and a buzzer', hint: 'Input + process + output' },
    { week: 12, topic: 'Waste Sorting Robot',         question: 'How could an AI-powered robot sort plastic from paper?',            answer: 'A camera identifies the object type, then a servo/motor routes it to the correct bin', hint: 'Vision → classify → act' },
    { week: 21, topic: 'Home Automation System',      question: 'Name three sensors a smart home could use and what each controls.',  answer: 'LDR → auto lights; temp sensor → AC; motion sensor → security alarm', hint: 'Sense → decide → act' },
  ],

  // ── Class 8 ── Python, ML, AI, Data Science, Advanced Robotics ───────────
  8: [
    { week: 2,  topic: 'IF/ELSE & Logic',             question: 'Write an if/else rule in plain English for a temperature alarm at 40°C.', answer: 'If temperature > 40: turn ON buzzer; else: turn OFF buzzer', hint: 'Threshold → action' },
    { week: 3,  topic: 'Logical Operators',           question: 'What does this condition mean: if temp > 35 AND light < 100?',        answer: 'Both must be true — hot AND dark at the same time',             hint: 'AND = both conditions must hold' },
    { week: 7,  topic: 'Python: Basics & Functions',  question: 'What does "def" mean in Python?',                                    answer: 'It defines (creates) a reusable function',                      hint: 'def greet(): print("Hello!")' },
    { week: 8,  topic: 'Data: Lists & Arrays',        question: 'How do you access the 3rd item in a Python list called "scores"?',   answer: 'scores[2] — Python lists start at index 0',                    hint: 'First item is index 0, not 1!' },
    { week: 13, topic: 'Introduction to AI',          question: 'What is the difference between AI and Machine Learning?',            answer: 'AI is the broad concept of smart machines; ML is a technique where machines learn from data', hint: 'ML is a subset of AI' },
    { week: 15, topic: 'Machine Learning — Fundamentals', question: 'What are training data and test data in machine learning?',    answer: 'Training data teaches the model; test data checks how well it learned', hint: 'Study with one set, test with another' },
    { week: 16, topic: 'Machine Learning — Experimentation', question: 'What is overfitting in ML?',                                answer: 'When a model memorises training data so well it fails on new data', hint: 'Too perfect on old data → bad on new data' },
    { week: 19, topic: 'Face Recognition/Tracking',   question: 'What facial features does face recognition AI typically analyse?',   answer: 'Eye distance, nose shape, jawline, and other facial landmarks',  hint: 'What makes every face unique?' },
    { week: 22, topic: 'Optical Character Recognition', question: 'What is OCR and name one real-life use?',                        answer: 'OCR reads text from images — used in number plate recognition, scanning documents', hint: 'Cameras that "read" text' },
    { week: 25, topic: 'Robotics: Chassis & Sensors', question: 'Name the four main subsystems of a robot.',                        answer: 'Sensors (input), processor (brain), actuators/motors (output), power supply', hint: 'Think of a robot as a system...' },
    { week: 30, topic: 'Intro to Data Science',       question: 'What is a "data visualisation" and why is it useful?',             answer: 'A chart or graph representing data so patterns and insights are easy to spot', hint: 'A picture is worth a thousand numbers' },
    { week: 32, topic: 'Ethics, Bias & Safe AI Use',  question: 'Give one example of unethical AI use and how to prevent it.',      answer: 'Biased hiring AI (trained on skewed data) — fixed by using diverse, balanced datasets', hint: 'AI reflects its training data' },
  ],

  // ── Class 9 ── Python Advanced, IoT, Vision AI, Data Viz ─────────────────
  9: [
    { week: 2,  topic: 'Python Animation',            question: 'What Python library is used for drawing shapes and animation (like a bouncing ball)?', answer: 'Turtle (turtle graphics)', hint: 'import turtle' },
    { week: 3,  topic: 'Variables & Data Types',      question: 'What are the four basic data types in Python?',                    answer: 'int (integer), float (decimal), str (string/text), bool (True/False)', hint: 'age=17, pi=3.14, name="Aryan", on=True' },
    { week: 5,  topic: 'Python Functions',            question: 'What is the difference between a parameter and an argument in Python?', answer: 'A parameter is the variable in the function definition; an argument is the value passed when calling it', hint: 'def add(a,b): ← a,b are parameters; add(3,4) ← 3,4 are arguments' },
    { week: 7,  topic: 'File Handling & Data Logging', question: 'Write Python code to write "Hello" to a file.',                  answer: 'with open("file.txt", "w") as f: f.write("Hello")',              hint: 'open(), write(), close() — or use "with"' },
    { week: 9,  topic: 'Intro to Sensors',            question: 'What is the difference between an analog and digital sensor?',    answer: 'Analog gives a continuous range of values (e.g. 0–1023); digital gives only ON or OFF', hint: 'Temperature = analog; button = digital' },
    { week: 10, topic: 'Intro to Actuators',          question: 'What is an actuator? Give two examples.',                         answer: 'Any output device that does physical work — e.g. DC motor, servo motor, buzzer, LED', hint: 'Input = sensors; Output = actuators' },
    { week: 14, topic: 'Advanced Sensors — Color/Gyro', question: 'What does a gyroscope sensor measure?',                        answer: 'Rotational movement and orientation (angle) of the device',      hint: 'Used in phones to detect screen rotation' },
    { week: 18, topic: 'Facial Expression/Recognition Bot', question: 'What is a Convolutional Neural Network (CNN) used for?',   answer: 'Processing images for tasks like face recognition, object detection, and classification', hint: 'It learns visual patterns like edges and shapes' },
    { week: 19, topic: 'Voice & Audio Recognition',   question: 'What does the Python speech_recognition library allow you to do?', answer: 'Convert spoken audio from a microphone into text in Python',    hint: 'Mic → audio → text' },
    { week: 20, topic: 'Web Integration — Python/MQTT', question: 'What is MQTT and why is it used in IoT?',                     answer: 'A lightweight messaging protocol for sending sensor data over the internet between devices', hint: 'Used by smart home devices to talk to servers' },
    { week: 24, topic: 'Python Data Visualization',  question: 'What Python library creates line charts and bar graphs?',          answer: 'matplotlib (specifically matplotlib.pyplot)',                    hint: 'import matplotlib.pyplot as plt' },
    { week: 25, topic: 'AI Ethics, Safety, Bias',     question: 'What is "explainable AI" (XAI)?',                                answer: 'AI that can describe in human terms why it made a decision — increasing trust and accountability', hint: 'Not just WHAT the AI decided, but WHY' },
  ],

  // ── Class 10 ── Python Mastery, ML, CV, NLP, IoT, Advanced AI ────────────
  10: [
    { week: 2,  topic: 'Variables & Operators',       question: 'What is the result of 17 % 5 in Python?',                          answer: '2 (the remainder when 17 is divided by 5)',                      hint: '% is the modulo operator' },
    { week: 3,  topic: 'Functions in Python',         question: 'What is a recursive function? Give a real-life example.',         answer: 'A function that calls itself — e.g. factorial(n) = n × factorial(n-1)', hint: 'A function that solves a smaller version of the same problem' },
    { week: 5,  topic: 'Loops — While & For',         question: 'What is an infinite loop and how do you break out of one?',       answer: 'A loop that never ends (while True:) — use "break" to exit', hint: 'while True: ... if condition: break' },
    { week: 7,  topic: 'Lists & Arrays',              question: 'What is list comprehension in Python? Give an example.',          answer: 'A concise way to create lists: [x*2 for x in range(5)] → [0, 2, 4, 6, 8]', hint: '[expression for item in list]' },
    { week: 10, topic: 'Intro to Physical Computing', question: 'What is the difference between digital OUTPUT and analog INPUT on a microcontroller?', answer: 'Digital output sends ON/OFF (0V or 3.3V); analog input reads a range of voltages (like 0–3.3V)', hint: 'Think: LED vs. temperature sensor' },
    { week: 13, topic: 'Introduction to AI',          question: 'What are the three types of machine learning?',                  answer: 'Supervised, unsupervised, and reinforcement learning',           hint: 'With labels, without labels, and learning from rewards' },
    { week: 16, topic: 'Intro to Machine Learning (2)', question: 'What is a confusion matrix used for?',                        answer: 'Evaluating a classification model — shows true positives, false positives, true negatives, false negatives', hint: 'Shows what the model got right and wrong' },
    { week: 17, topic: 'AI Project Cycle',             question: 'List the 5 steps of an AI project cycle.',                      answer: 'Define problem → Collect data → Train model → Evaluate → Deploy and improve', hint: 'Problem → Data → Train → Test → Deploy' },
    { week: 21, topic: 'Object Detection & Computer Vision', question: 'What is the difference between image classification and object detection?', answer: 'Classification labels the whole image (e.g. "cat"); detection finds AND locates multiple objects in one image', hint: 'One label vs. bounding boxes' },
    { week: 23, topic: 'Speech Recognition (NLP)',    question: 'What is the difference between NLP and NLU?',                    answer: 'NLP processes language broadly; NLU (Natural Language Understanding) specifically focuses on meaning and intent', hint: 'Processing vs. Understanding' },
    { week: 27, topic: 'Neural Networks Intro',       question: 'What does a "neuron" in a neural network do?',                   answer: 'It receives inputs, applies a weight and activation function, then passes output to the next layer', hint: 'Inspired by brain cells' },
    { week: 29, topic: 'Sensor Calibration & Advanced Inputs', question: 'Why must sensors be calibrated before use?',            answer: 'Raw sensor readings have offsets and drift — calibration maps them to accurate real-world values', hint: 'A thermometer must read 0°C in ice water first' },
  ],
}

export function getQuestionsForClass(classNum: number): LessonQuestion[] {
  return LESSON_QUESTIONS[classNum] ?? LESSON_QUESTIONS[5]
}

export function getClassFromName(className: string): number {
  const match = className.match(/\b(\d+)\b/)
  return match ? Math.min(Math.max(parseInt(match[1]), 2), 10) : 5
}
