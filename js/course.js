const coursesData = {
    "adca": {
        title: "ADCA",
        subtitle: "Advanced Diploma in Computer Application",
        duration: "12 Months",
        fee: "₹7,500",
        exam: "Theory + Practical + Viva",
        certificate: "Available",
        col1: [
            { title: "Computer Fundamentals", topics: ["Introduction to Computer", "History & Generations of Computer", "Types of Computer", "Hardware & Software", "Input & Output Devices", "Memory Units", "CPU & Storage Devices"] },
            { title: "Windows Operating System", topics: ["Desktop & Taskbar", "Start Menu", "File & Folder Management", "Control Panel", "System Settings", "Shortcut Keys"] },
            { title: "Microsoft Office", topics: ["MS Word", "MS Excel", "MS PowerPoint", "Advanced Formatting", "Mail Merge", "Advanced Excel Functions", "Charts & Reports"] },
            { title: "Internet & Email", topics: ["Internet Basics", "Web Browser", "Search Engine", "Email Creation", "Online Services", "Digital Payment"] },
            { title: "Tally Prime with GST", topics: ["Company Creation", "Groups & Ledgers", "Voucher Entry", "Inventory Management", "GST Configuration", "Purchase & Sales", "Bank Reconciliation", "Balance Sheet", "GST Reports", "Payroll"] }
        ],
        col2: [
            { title: "DTP (Desktop Publishing)", topics: ["Adobe Photoshop", "CorelDRAW", "Page Maker", "Image Editing", "Logo Designing", "Banner Designing"] },
            { title: "Programming Languages", topics: ["C Language", "C++ Programming", "Python Programming", "Basic Java Programming", "Programming Logic", "Problem Solving"] },
            { title: "Web Designing", topics: ["HTML", "CSS", "Website Structure", "Web Page Designing", "Basic Responsive Design"] },
            { title: "Database Management", topics: ["Introduction to Database", "MS Access", "Tables & Queries", "Forms & Reports"] },
            { title: "Project Work & Revision", topics: ["Practical Assignment", "Live Project", "Revision Classes", "Mock Test"] },
            { title: "Final Examination & Certificate", topics: ["Theory Examination", "Practical Examination", "Viva", "Course Completion Certificate"] }
        ]
    },
    "dca": {
        title: "DCA",
        subtitle: "Diploma in Computer Application",
        duration: "06 Months",
        fee: "₹3,600",
        exam: "Theory + Practical + Viva",
        certificate: "Available",
        col1: [
            { title: "Computer Fundamentals", topics: ["Introduction to Computer", "History & Generations of Computer", "Types of Computer", "Hardware & Software", "Input & Output Devices", "Memory Units", "CPU & Storage Devices"] },
            { title: "Windows Operating System", topics: ["Desktop & Taskbar", "Start Menu", "File & Folder Management", "Control Panel", "Personalization", "Shortcut Keys"] },
            { title: "Microsoft Word", topics: ["Creating Documents", "Text Formatting", "Tables", "Pictures & Shapes", "Header & Footer", "Mail Merge"] },
            { title: "Microsoft Excel", topics: ["Workbook & Worksheet", "Cell Formatting", "Formulas & Functions", "Charts", "Sorting & Filtering", "Conditional Formatting"] }
        ],
        col2: [
            { title: "Microsoft PowerPoint", topics: ["Creating Presentation", "Slide Design", "Animations", "Transitions", "Slide Show"] },
            { title: "Internet & Email", topics: ["Internet Basics", "Web Browser", "Search Engine", "Email Creation", "Email Attachment"] },
            { title: "DOS (Disk Operating System)", topics: ["Internal Commands", "External Commands", "Directory Commands", "File Management"] },
            { title: "Project Work & Revision", topics: ["Practical Assignment", "Live Project", "Revision Classes", "Mock Test"] },
            { title: "Final Examination & Certificate", topics: ["Theory Examination", "Practical Examination", "Viva", "Course Completion Certificate"] }
        ]
    },
    "dca-t": {
        title: "DCA-T",
        subtitle: "Diploma in Computer Application with Tally Prime",
        duration: "09 Months",
        fee: "₹5,400",
        exam: "Theory + Practical + Viva",
        certificate: "Available",
        col1: [
            { title: "Computer Fundamentals", topics: ["Introduction to Computer", "History & Generations of Computer", "Types of Computer", "Hardware & Software", "Input & Output Devices", "Memory Units", "CPU & Storage Devices"] },
            { title: "Windows Operating System", topics: ["Desktop & Taskbar", "Start Menu", "File & Folder Management", "Control Panel", "Personalization", "Shortcut Keys"] },
            { title: "Microsoft Word", topics: ["Creating Documents", "Text Formatting", "Tables & Borders", "Pictures & Shapes", "Header & Footer", "Mail Merge"] },
            { title: "Microsoft Excel", topics: ["Workbook & Worksheet", "Cell Formatting", "Formulas & Functions", "Charts", "Sorting & Filtering", "Conditional Formatting"] }
        ],
        col2: [
            { title: "Microsoft PowerPoint", topics: ["Creating Presentation", "Slide Design", "Animations", "Transitions", "Slide Show"] },
            { title: "Internet & Email", topics: ["Internet Basics", "Web Browser", "Search Engine", "Email Creation", "Email Attachment"] },
            { title: "DOS (Disk Operating System)", topics: ["Internal Commands", "External Commands", "Directory Commands", "File Management"] },
            { title: "Tally Prime with GST", topics: ["Introduction to Tally Prime", "Company Creation", "Groups & Ledgers", "Voucher Entry", "Inventory Management", "GST Configuration", "Purchase & Sales Entry", "Bank Reconciliation", "Profit & Loss Account", "Balance Sheet", "GST Reports"] },
            { title: "Project Work & Revision", topics: ["Practical Assignment", "Live Accounting Project", "Revision Classes", "Mock Test"] },
            { title: "Final Examination & Certificate", topics: ["Theory Examination", "Practical Examination", "Viva", "Course Completion Certificate"] }
        ]
    },
    "dtp": {
        title: "DTP",
        subtitle: "Desktop Publishing",
        duration: "06 Months",
        fee: "₹4,500",
        exam: "Theory + Practical + Viva",
        certificate: "Available",
        col1: [
            { title: "Computer Fundamentals", topics: ["Introduction to Computer", "Hardware & Software", "Input & Output Devices", "Memory Units", "Storage Devices", "Operating System Basics"] },
            { title: "Windows Operating System", topics: ["Desktop & Icons", "Start Menu", "File & Folder Management", "Control Panel", "Shortcut Keys"] },
            { title: "Microsoft Word", topics: ["Document Creation", "Text Formatting", "Page Setup", "Tables & Borders", "Images & Shapes", "Printing Documents"] },
            { title: "Adobe Photoshop", topics: ["Introduction to Photoshop", "Tools & Toolbox", "Layers Management", "Image Editing", "Photo Retouching", "Background Designing", "Poster & Banner Design"] },
            { title: "CorelDRAW", topics: ["Introduction to CorelDRAW", "Drawing Tools", "Shape & Text Tools", "Logo Designing", "Visiting Card Design", "Certificate Design"] }
        ],
        col2: [
            { title: "PageMaker / Layout Designing", topics: ["Introduction to PageMaker", "Page Setup", "Text Formatting", "Master Page", "News Paper Designing", "Book & Magazine Layout"] },
            { title: "Graphic Designing", topics: ["Banner Designing", "Poster Designing", "Advertisement Designing", "Flex Designing", "Creative Designing"] },
            { title: "Printing Technology", topics: ["Printer Types", "Color Printing", "Page Arrangement", "Print Settings", "PDF Creation"] },
            { title: "Internet & Email", topics: ["Internet Basics", "Email Creation", "File Upload & Download", "Online Services"] },
            { title: "Project Work & Revision", topics: ["Practical Assignment", "Live Designing Project", "Revision Classes", "Mock Test"] },
            { title: "Final Examination & Certificate", topics: ["Theory Examination", "Practical Examination", "Viva", "Course Completion Certificate"] }
        ]
    },
    "clanguage": {
        title: "C Language",
        subtitle: "Programming in C Language",
        duration: "03 Months",
        fee: "₹3,000",
        exam: "Theory + Practical + Viva",
        certificate: "Available",
        col1: [
            { title: "Introduction to C Language", topics: ["History of C Language", "Features of C Language", "Structure of C Program", "Compiler & Interpreter", "Writing First C Program"] },
            { title: "Basic Concepts of C", topics: ["Character Set", "Keywords & Identifiers", "Constants & Variables", "Data Types", "Operators"] },
            { title: "Input & Output Functions", topics: ["printf() Function", "scanf() Function", "Formatted Input & Output", "Escape Sequences"] },
            { title: "Control Statements", topics: ["If Statement", "If-Else Statement", "Nested If", "Switch Statement", "Conditional Operator"] },
            { title: "Looping Statements", topics: ["For Loop", "While Loop", "Do-While Loop", "Nested Loops"] }
        ],
        col2: [
            { title: "Arrays & Strings", topics: ["One Dimensional Array", "Two Dimensional Array", "String Handling", "String Functions"] },
            { title: "Functions", topics: ["Introduction to Functions", "Library Functions", "User Defined Functions", "Function Arguments", "Return Values"] },
            { title: "Pointers", topics: ["Introduction to Pointer", "Pointer Variables", "Pointer Operations", "Uses of Pointer"] },
            { title: "Structure & File Handling", topics: ["Structure in C", "Union", "File Creation", "Reading & Writing Files"] },
            { title: "Project Work & Revision", topics: ["Practical Programs", "Mini Project", "Revision Classes", "Mock Test"] },
            { title: "Final Examination & Certificate", topics: ["Theory Examination", "Practical Examination", "Viva", "Course Completion Certificate"] }
        ]
    },
    "c++": {
        title: "C++",
        subtitle: "Basic Programming in C++",
        duration: "03 Months",
        fee: "₹3,000",
        exam: "Theory + Practical + Viva",
        certificate: "Available",
        col1: [
            { title: "Introduction to C++", topics: ["History of C++ Language", "Features of C++", "Difference Between C & C++", "Structure of C++ Program", "Writing First C++ Program"] },
            { title: "Basic Concepts of C++", topics: ["Tokens in C++", "Keywords & Identifiers", "Variables & Constants", "Data Types", "Operators"] },
            { title: "Input & Output", topics: ["cin Statement", "cout Statement", "Formatting Output", "Basic Program Practice"] },
            { title: "Control Statements", topics: ["If Statement", "If-Else Statement", "Nested If", "Switch Statement"] },
            { title: "Looping Statements", topics: ["For Loop", "While Loop", "Do-While Loop", "Nested Loop"] }
        ],
        col2: [
            { title: "Functions in C++", topics: ["Introduction to Function", "Function Declaration", "Function Calling", "Return Values"] },
            { title: "Arrays & Strings", topics: ["One Dimensional Array", "Two Dimensional Array", "String Handling", "Basic Programs"] },
            { title: "Object Oriented Programming Basics", topics: ["Introduction to OOP", "Class & Object", "Data Members", "Member Functions"] },
            { title: "Constructor & Inheritance Basics", topics: ["Introduction to Constructor", "Types of Constructor", "Basic Inheritance Concept"] },
            { title: "Project Work & Revision", topics: ["Practical Programs", "Mini Project", "Revision Classes", "Mock Test"] },
            { title: "Final Examination & Certificate", topics: ["Theory Examination", "Practical Examination", "Viva", "Course Completion Certificate"] }
        ]
    },
    "java": {
        title: "Java",
        subtitle: "Basic Programming in Java",
        duration: "03 Months",
        fee: "₹3,000",
        exam: "Theory + Practical + Viva",
        certificate: "Available",
        col1: [
            { title: "Introduction to Java", topics: ["History of Java", "Features of Java", "Applications of Java", "Java Environment Setup", "Writing First Java Program"] },
            { title: "Java Basic Concepts", topics: ["Java Tokens", "Keywords & Identifiers", "Variables & Constants", "Data Types", "Operators"] },
            { title: "Input & Output in Java", topics: ["Scanner Class", "Reading User Input", "Printing Output", "Basic Programs"] },
            { title: "Control Statements", topics: ["If Statement", "If-Else Statement", "Nested If", "Switch Statement"] },
            { title: "Looping Statements", topics: ["For Loop", "While Loop", "Do-While Loop", "Nested Loop"] }
        ],
        col2: [
            { title: "Arrays & Strings", topics: ["One Dimensional Array", "Two Dimensional Array", "String Handling", "String Methods"] },
            { title: "Methods in Java", topics: ["Introduction to Methods", "Method Declaration", "Method Calling", "Return Values"] },
            { title: "Object Oriented Programming (OOP)", topics: ["Introduction to OOP", "Class & Object", "Encapsulation", "Inheritance Basics", "Polymorphism Basics"] },
            { title: "Exception Handling & File Basics", topics: ["Introduction to Exception", "Try & Catch", "File Handling Basics", "Reading & Writing Files"] },
            { title: "Project Work & Revision", topics: ["Practical Programs", "Mini Project", "Revision Classes", "Mock Test"] },
            { title: "Final Examination & Certificate", topics: ["Theory Examination", "Practical Examination", "Viva", "Course Completion Certificate"] }
        ]
    },
    "python": {
        title: "Python",
        subtitle: "Basic Programming in Python",
        duration: "03 Months",
        fee: "₹3,000",
        exam: "Theory + Practical + Viva",
        certificate: "Available",
        col1: [
            { title: "Introduction to Python", topics: ["History of Python", "Features of Python", "Applications of Python", "Installing Python", "Writing First Python Program"] },
            { title: "Python Basic Concepts", topics: ["Python Syntax", "Keywords & Identifiers", "Variables", "Data Types", "Comments"] },
            { title: "Operators & Expressions", topics: ["Arithmetic Operators", "Relational Operators", "Logical Operators", "Assignment Operators", "Expressions"] },
            { title: "Input & Output", topics: ["Input Function", "Output Function", "Type Conversion", "Basic Programs"] },
            { title: "Decision Making & Loops", topics: ["If Statement", "If-Else Statement", "Nested If", "For Loop", "While Loop"] }
        ],
        col2: [
            { title: "Python Data Structures", topics: ["List", "Tuple", "Set", "Dictionary", "String Handling"] },
            { title: "Functions in Python", topics: ["Introduction to Functions", "Creating Functions", "Function Arguments", "Return Values"] },
            { title: "Object Oriented Programming", topics: ["Class & Object", "Constructor", "Inheritance Basics", "Encapsulation"] },
            { title: "File Handling & Exception Handling", topics: ["File Creation", "Reading Files", "Writing Files", "Exception Handling Basics"] },
            { title: "Mini Project & Revision", topics: ["Practical Programs", "Mini Project", "Revision Classes", "Mock Test"] },
            { title: "Final Examination & Certificate", topics: ["Theory Examination", "Practical Examination", "Viva", "Course Completion Certificate"] }
        ]
    }
};

function renderList(items) {
    return items.map(item => `
        <li>
            <b>${item.title}</b>
            <ul>
                ${item.topics.map(t => `<li>${t}</li>`).join('')}
            </ul>
        </li>
    `).join('');
}

function renderCourse(courseKey, element) {
    const data = coursesData[courseKey] || coursesData['adca'];
    const displayArea = document.getElementById('course-display-area');

    // Highlight tab button
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (element) {
        element.classList.add('active');
    }

    // Sync URL query without reloading
    history.pushState(null, '', `course.html?course=${courseKey}`);
    document.title = `${data.title} | Scolex Computer Classes`;

    // Build structural DOM layout
    displayArea.innerHTML = `
        <div class="header">
            <h1>${data.title}</h1>
            <h2>${data.subtitle}</h2>
        </div>

        <div class="info">
            <div class="card">
                <h3>⏱ Duration</h3>
                <p>${data.duration}</p>
            </div>
            <div class="card">
                <h3>💰 Fee</h3>
                <p>${data.fee}</p>
            </div>
            <div class="card">
                <h3>📝 Examination</h3>
                <p>${data.exam}</p>
            </div>
            <div class="card">
                <h3>📜 Certificate</h3>
                <p>${data.certificate}</p>
            </div>
        </div>

        <div class="content">
            <h2>Course Contents</h2>
            <div class="course-list">
                <div>
                    <ol>${renderList(data.col1)}</ol>
                </div>
                <div>
                    <ol start="${data.col1.length + 1}">${renderList(data.col2)}</ol>
                </div>
            </div>
        </div>

        <div class="footer">
            <a href="../html/admission.html" class="btn">Apply for Admission</a>
        </div>
    `;
}

// Initialize state on DOM Load
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedCourse = urlParams.get('course') || 'adca';

    // Find tab matching selected key
    const activeTab = Array.from(document.querySelectorAll('.tab-btn')).find(btn => 
        btn.getAttribute('onclick')?.includes(`'${selectedCourse}'`)
    );

    renderCourse(selectedCourse, activeTab);
});