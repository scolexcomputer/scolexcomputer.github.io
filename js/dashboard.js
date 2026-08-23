const tests = {
    fund: {
        title: "💻 Computer Fundamentals",
        tests: [
            {
                name: "Computer Fundamental Test 01",
                id: "FUND01",
                questions: 50
            },
            {
                name: "Computer Fundamental Test 02",
                id: "FUND02",
                questions: 50
            },
            {
                name: "Computer Fundamental Test 03",
                id: "FUND03",
                questions: 50
            },
            {
                name: "Computer Fundamental Test 04",
                id: "FUND04",
                questions: 50
            },
            {
                name: "Computer Fundamental Test 05",
                id: "FUND05",
                questions: 50
            }
        ]
    },

    win: {
        title: "🪟 Windows OS",
        tests: [
            {
                name: "Windows Test 01",
                id: "WIN01",
                questions: 50
            },
            {
                name: "Windows Test 02",
                id: "WIN02",
                questions: 50
            },
            {
                name: "Windows Test 03",
                id: "WIN03",
                questions: 50
            },
            {
                name: "Windows Test 04",
                id: "WIN04",
                questions: 50
            },
            {
                name: "Windows Test 05",
                id: "WIN05",
                questions: 50
            }
        ]
    },

    word: {
        title: "📝 MS Word",
        tests: [
            {
                name: "MS Word Test 01",
                id: "WORD01",
                questions: 50
            },
            {
                name: "MS Word Test 02",
                id: "WORD02",
                questions: 50
            },
            {
                name: "MS Word Test 03",
                id: "WORD03",
                questions: 50
            },
            {
                name: "MS Word Test 04",
                id: "WORD04",
                questions: 50
            },
            {
                name: "MS Word Test 05",
                id: "WORD05",
                questions: 50
            }
        ]
    },

    excel: {
        title: "📊 MS Excel",
        tests: [
            {
                name: "MS Excel Test 01",
                id: "EXCEL01",
                questions: 50
            },
            {
                name: "MS Excel Test 02",
                id: "EXCEL02",
                questions: 50
            },
            {
                name: "MS Excel Test 03",
                id: "EXCEL03",
                questions: 50
            },
            {
                name: "MS Excel Test 04",
                id: "EXCEL04",
                questions: 50
            },
            {
                name: "MS Excel Test 05",
                id: "EXCEL05",
                questions: 50
            },
            {
                name: "MS Excel Test 06",
                id: "EXCEL06",
                questions: 50
            },
            {
                name: "MS Excel Test 07",
                id: "EXCEL07",
                questions: 50
            },
            {
                name: "MS Excel Test 08",
                id: "EXCEL08",
                questions: 50
            },
            {
                name: "MS Excel Test 09",
                id: "EXCEL09",
                questions: 50
            },
            {
                name: "MS Excel Test 10",
                id: "EXCEL10",
                questions: 50
            }
        ]
    },

    ppt: {
        title: "📢 PowerPoint",
        tests: [
            {
                name: "PowerPoint Test 01",
                id: "PPT01",
                questions: 50
            },
            {
                name: "PowerPoint Test 02",
                id: "PPT02",
                questions: 50
            },
            {
                name: "PowerPoint Test 03",
                id: "PPT03",
                questions: 50
            },
            {
                name: "PowerPoint Test 04",
                id: "PPT04",
                questions: 50
            },
            {
                name: "PowerPoint Test 05",
                id: "PPT05",
                questions: 50
            }
        ]
    },

    net: {
        title: "🌐 Internet",
        tests: [
            {
                name: "Internet Test 01",
                id: "NET01",
                questions: 50
            },
            {
                name: "Internet Test 02",
                id: "NET02",
                questions: 50
            },
            {
                name: "Internet Test 03",
                id: "NET03",
                questions: 50
            },
            {
                name: "Internet Test 04",
                id: "NET04",
                questions: 50
            },
            {
                name: "Internet Test 05",
                id: "NET05",
                questions: 50
            }
        ]
    }
};

function showTests(topic) {
    document.getElementById("topicSection").classList.add("hidden");
    document.getElementById("testSection").classList.remove("hidden");

    const data = tests[topic];
    document.getElementById("selectedTopicTitle").innerHTML = data.title;

    let html = "";
    data.tests.forEach(test => {
        html += `
        <div class="card test-card">
            <h4>${test.name}</h4>
            <p class="test-info">
            Total Questions: ${test.questions}
            </p>
            <button class="btn-start" onclick="startTest('${test.id}')">
            Start Test
            </button>
        </div>
        `;
    });

    document.getElementById("testListContainer").innerHTML = html;
}

function goBack() {
    document.getElementById("topicSection").classList.remove("hidden");
    document.getElementById("testSection").classList.add("hidden");
}

function startTest(testId) {
    alert("Selected Test ID: " + testId);
    console.log("Selected Test ID:", testId);
    localStorage.setItem("testId", testId);
    console.log("Stored Test ID:", localStorage.getItem("testId"));
    window.location.href = "mocktest.html";
}