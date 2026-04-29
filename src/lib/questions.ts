// Static question bank — used when Supabase has no question for today
// or as the seeding source for the database.

export type GradeGroup = 'junior' | 'middle' | 'senior'

export interface Question {
  question: string
  answer: string
  hint: string
}

export const QUESTION_BANK: Record<GradeGroup, Question[]> = {
  junior: [
    { question: "What planet do we live on?", answer: "Earth", hint: "Third planet from the Sun" },
    { question: "How many legs does a spider have?", answer: "8", hint: "More than insects!" },
    { question: "What do plants need to make their food?", answer: "Sunlight", hint: "It comes from the sky every day" },
    { question: "Which planet is called the Red Planet?", answer: "Mars", hint: "It's our neighbour in space" },
    { question: "What is 7 × 8?", answer: "56", hint: "Between 50 and 60" },
    { question: "What gas do humans breathe to stay alive?", answer: "Oxygen", hint: "Trees give us this!" },
    { question: "How many colours are in a rainbow?", answer: "7", hint: "VIBGYOR!" },
    { question: "What do you call water when it is solid?", answer: "Ice", hint: "Put water in a freezer..." },
    { question: "Which animal is the fastest on land?", answer: "Cheetah", hint: "It's a big spotted cat" },
    { question: "How many sides does a hexagon have?", answer: "6", hint: "Like a beehive cell" },
    { question: "What is the largest organ in the human body?", answer: "Skin", hint: "You can see it!" },
    { question: "What pulls objects toward the ground?", answer: "Gravity", hint: "Why things fall down" },
    { question: "How many hours are in one day?", answer: "24", hint: "12 AM to 12 PM and back again" },
    { question: "What do we call the study of living things?", answer: "Biology", hint: "Bio means life" },
  ],
  middle: [
    { question: "What is the chemical symbol for water?", answer: "H2O", hint: "Two hydrogen + one oxygen" },
    { question: "What force keeps us on Earth?", answer: "Gravity", hint: "Newton discovered it with an apple!" },
    { question: "What is the powerhouse of the cell?", answer: "Mitochondria", hint: "It produces ATP energy" },
    { question: "What element has the symbol 'Fe'?", answer: "Iron", hint: "From Latin 'Ferrum'" },
    { question: "What is the formula for area of a circle?", answer: "πr²", hint: "Pi times radius squared" },
    { question: "What is the pH of pure water?", answer: "7", hint: "Neutral — not acid, not base" },
    { question: "How many bones are in the adult human body?", answer: "206", hint: "More than you think!" },
    { question: "What process do plants use to make food?", answer: "Photosynthesis", hint: "Light + CO2 + water" },
    { question: "What is the speed of light?", answer: "3×10⁸ m/s", hint: "Very, very fast" },
    { question: "What type of energy does the Sun produce?", answer: "Solar energy", hint: "Light and heat" },
    { question: "What is the chemical formula for table salt?", answer: "NaCl", hint: "Sodium + Chlorine" },
    { question: "What is the unit of electrical current?", answer: "Ampere", hint: "Named after André Ampere" },
    { question: "What planet has the most moons?", answer: "Saturn", hint: "It also has beautiful rings" },
    { question: "What is 2 to the power of 10?", answer: "1024", hint: "Important in computing!" },
  ],
  senior: [
    { question: "State Newton's Second Law of Motion", answer: "F = ma", hint: "Force = mass × acceleration" },
    { question: "What is Ohm's Law?", answer: "V = IR", hint: "Voltage, Current, Resistance" },
    { question: "What is the chemical formula for glucose?", answer: "C6H12O6", hint: "6 carbons, the sugar of life" },
    { question: "What does DNA stand for?", answer: "Deoxyribonucleic acid", hint: "The molecule of life in every cell" },
    { question: "What is binary for decimal 10?", answer: "1010", hint: "Count in powers of 2" },
    { question: "What is the Pythagorean theorem?", answer: "a² + b² = c²", hint: "For right-angled triangles" },
    { question: "What is the SI unit of electric resistance?", answer: "Ohm", hint: "Symbol: Ω" },
    { question: "Who invented the World Wide Web?", answer: "Tim Berners-Lee", hint: "British computer scientist, 1989" },
    { question: "What type of bond shares electrons?", answer: "Covalent bond", hint: "Opposite of ionic" },
    { question: "What is the derivative of sin(x)?", answer: "cos(x)", hint: "Trigonometric calculus" },
    { question: "What principle states matter cannot be created or destroyed?", answer: "Conservation of mass", hint: "Antoine Lavoisier" },
    { question: "What is the unit of frequency?", answer: "Hertz", hint: "Symbol Hz, cycles per second" },
    { question: "What is an algorithm?", answer: "Step-by-step problem-solving instructions", hint: "Foundation of all computer programs" },
    { question: "What does CPU stand for?", answer: "Central Processing Unit", hint: "The brain of a computer" },
  ],
}

// Deterministic daily pick so everyone sees the same question on a given day
export function getDailyFallbackQuestion(gradeGroup: GradeGroup): Question {
  const questions = QUESTION_BANK[gradeGroup]
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000,
  )
  return questions[dayOfYear % questions.length]
}
