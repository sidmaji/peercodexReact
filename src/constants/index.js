// Profanity and slur filter list for message validation
export const BAD_WORDS = [
    'fuck', 'shit', 'bitch', 'arse', 'asshole', 'ass',
    'asshole',  'bastard', 'bitch', 'b00b','bollocks', 'bugger', 'bullshit', 'crap', 'damn', 'frigger', 'nigga', 'bastard', 'dick', 'cunt', 'nigger', 'nigga','fag', 'sex','slut', 'whore', 'retard', 'chink', 'spic', 'kike', 'gook', 'coon', 'dyke', 'tranny', 'twat', 'paki', 'wop', 'wetback', 'homo', 'queer', 'negro', 'cripple', 'spazz', 'gimp', 'mongoloid', 'gypsy', 'pimp', 'rapist', 'molest', 'pedo', 'pedophile', 'terrorist', 'isis', 'nazis', 'hitler', 'kkk', 'faggot', 'motherfucker', 'jackass', 'douche', 'douchebag', 'arsehole', 'bollocks', 'bugger', 'bloody', 'wanker', 'tosser', 'prick', 'slag', 'git', 'muppet', 'nonce', 'pillock', 'twit', 'twat', 'yid', 'zipperhead', 'abo', 'ape', 'beaner', 'camel jockey', 'golliwog', 'jap', 'jungle bunny', 'kaffir', 'oreo', 'porch monkey', 'raghead', 'redskin', 'sambo', 'sand nigger', 'shemale', 'towel head', 'tranny', 'wetback', 'zipperhead'
];
// Allowed test emails for signup bypass (case-insensitive)
export const ALLOWED_TEST_EMAILS = new Set([
    'wfmgift1@gmail.com',
    'wfmgift11@gmail.com',
    'wfmgift7@gmail.com',
    '00sidaddy00@gmail.com',
    'somebodyimportant0@gmail.com',
    'siddhant.maji@gmail.com',
    'arsh.maji@gmail.com',
    'arshia.gulati@gmail.com',
    'ryan.maji19@gmail.com'
])
// Academic subjects and constants for PeerCodex platform

export const AP_SUBJECTS = [
    'AP Biology',
    'AP Chemistry',
    'AP Physics 1',
    'AP Physics 2',
    'AP Physics C',
    'AP Calculus AB',
    'AP Calculus BC',
    'AP Statistics',
    'AP Computer Science A',
    'AP Computer Science Principles',
    'AP English Language',
    'AP English Literature',
    'AP US History',
    'AP World History',
    'AP European History',
    'AP Government',
    'AP Economics (Macro)',
    'AP Economics (Micro)',
    'AP Psychology',
    'AP Sociology',
    'AP French',
    'AP Spanish',
    'AP German',
    'AP Latin',
    'AP Chinese',
    'AP Art History',
    'AP Studio Art',
    'AP Music Theory',
    'AP Environmental Science',
    'AP Human Geography',
]

// Common high schools and colleges for dropdown
export const SCHOOLS = [
    // High Schools
    'Independence High School',
    'Liberty High School',
].sort()

// Grade level options for dropdown
export const GRADE_LEVELS = ['9th Grade (Freshman)', '10th Grade (Sophomore)', '11th Grade (Junior)', '12th Grade (Senior)']

export const USER_ROLES = {
    STUDENT: 'student',
}

// Simplified role options (only student now)
export const ROLE_OPTIONS = [
    {
        id: USER_ROLES.STUDENT,
        title: 'Student',
        description: 'I am a student looking to connect with peers',
        icon: '🎓',
    },
]
