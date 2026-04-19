
const fs = require('fs');
const path = require('path');

const talks = [
    {
        title: "Introduction to Serverless Architectures",
        speakers: ["Alice Johnson"],
        category: ["Cloud", "Architecture"],
        duration: 60,
        description: "An overview of serverless computing, its benefits, and common use cases."
    },
    {
        title: "Deep Dive into Node.js Event Loop",
        speakers: ["Bob Williams", "Charlie Davis"],
        category: ["Node.js", "Performance"],
        duration: 60,
        description: "Understanding the core mechanism of Node.js and how to write non-blocking code effectively."
    },
    {
        title: "Frontend Frameworks: A Comparison",
        speakers: ["Diana Miller"],
        category: ["Frontend", "Web Development"],
        duration: 60,
        description: "Comparing popular frontend frameworks like React, Angular, and Vue.js."
    },
    {
        title: "Securing Your Web Applications",
        speakers: ["Eve Brown"],
        category: ["Security", "Web Development"],
        duration: 60,
        description: "Best practices for securing web applications against common vulnerabilities."
    },
    {
        title: "State Management in Modern React",
        speakers: ["Frank Green"],
        category: ["React", "Frontend"],
        duration: 60,
        description: "Exploring different state management patterns and libraries in React."
    },
    {
        title: "Introduction to WebAssembly",
        speakers: ["Grace Hall"],
        category: ["WebAssembly", "Performance"],
        duration: 60,
        description: "A beginner-friendly introduction to WebAssembly and its potential."
    }
];

function formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function generateSchedule(talks) {
    let currentTime = new Date();
    currentTime.setHours(10, 0, 0, 0); // Event starts at 10:00 AM

    const schedule = [];
    let talkIndex = 0;

    for (let i = 0; i < talks.length + 1; i++) { // +1 for lunch break
        if (i === 3) { // After the 3rd talk, insert lunch
            const lunchStartTime = new Date(currentTime.getTime());
            currentTime.setMinutes(currentTime.getMinutes() + 60); // 1 hour lunch
            const lunchEndTime = new Date(currentTime.getTime());
            schedule.push({
                type: 'break',
                title: 'Lunch Break',
                startTime: formatTime(lunchStartTime),
                endTime: formatTime(lunchEndTime),
                duration: 60,
                category: ["Food", "Networking"]
            });
            // Add an implicit 10-minute transition after lunch before the next talk
            currentTime.setMinutes(currentTime.getMinutes() + 10);
            continue;
        }

        const talk = talks[talkIndex];
        const talkStartTime = new Date(currentTime.getTime());
        currentTime.setMinutes(currentTime.getMinutes() + talk.duration);
        const talkEndTime = new Date(currentTime.getTime());

        schedule.push({
            type: 'talk',
            ...talk,
            startTime: formatTime(talkStartTime),
            endTime: formatTime(talkEndTime)
        });

        talkIndex++;

        // Add 10-minute transition after each talk, except the very last one
        if (talkIndex < talks.length) {
            currentTime.setMinutes(currentTime.getMinutes() + 10);
        }
    }
    return schedule;
}

const eventSchedule = generateSchedule(talks);

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tech Talks Event Schedule</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }
        h1 {
            color: #0056b3;
            text-align: center;
            margin-bottom: 30px;
        }
        .search-container {
            margin-bottom: 20px;
            text-align: center;
        }
        .search-container input {
            padding: 10px;
            width: 70%;
            max-width: 400px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
        }
        .schedule-item {
            border: 1px solid #eee;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 5px;
            background-color: #f9f9f9;
        }
        .schedule-item.talk {
            border-left: 5px solid #007bff;
        }
        .schedule-item.break {
            border-left: 5px solid #28a745;
            background-color: #e2f9e6;
        }
        .item-time {
            font-weight: bold;
            color: #555;
            margin-bottom: 5px;
        }
        .item-title {
            font-size: 20px;
            color: #0056b3;
            margin-bottom: 5px;
        }
        .item-speakers {
            font-style: italic;
            color: #666;
            margin-bottom: 5px;
        }
        .item-category span {
            display: inline-block;
            background-color: #e0e7ff;
            color: #0056b3;
            padding: 3px 8px;
            border-radius: 3px;
            margin-right: 5px;
            font-size: 0.9em;
        }
        .item-description {
            margin-top: 10px;
            line-height: 1.6;
        }
        .hidden {
            display: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Tech Talks Event Schedule</h1>

        <div class="search-container">
            <input type="text" id="categorySearch" placeholder="Search by category (e.g., Node.js, Cloud)">
        </div>

        <div id="schedule">
            <!-- Schedule items will be rendered here by JavaScript -->
        </div>
    </div>

    <script>
        const scheduleData = ${JSON.stringify(eventSchedule, null, 2)};

        function renderSchedule(data) {
            const scheduleDiv = document.getElementById('schedule');
            scheduleDiv.innerHTML = ''; // Clear previous results

            data.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('schedule-item', item.type);
                itemDiv.setAttribute('data-category', (item.category || []).map(c => c.toLowerCase()).join(' '));

                let content = `<div class="item-time">\$\{item.startTime} - \$\{item.endTime}</div>`;

                if (item.type === 'talk') {
                    content += `<div class="item-title">\$\{item.title}</div>
                                <div class="item-speakers">Speakers: \$\{item.speakers.join(', ')}</div>`;
                } else if (item.type === 'break') {
                    content += `<div class="item-title">\$\{item.title}</div>`;
                }

                if (item.category && item.category.length > 0) {
                    content += `<div class="item-category">`;
                    item.category.forEach(cat => {
                        content += `<span>\$\{cat}</span>`;
                    });
                    content += `</div>`;
                }
                
                if (item.description) {
                    content += `<div class="item-description">\$\{item.description}</div>`;
                }

                itemDiv.innerHTML = content;
                scheduleDiv.appendChild(itemDiv);
            });
        }

        function filterSchedule() {
            const searchTerm = document.getElementById('categorySearch').value.toLowerCase();
            const items = document.querySelectorAll('.schedule-item');

            items.forEach(item => {
                const categories = item.getAttribute('data-category');
                if (categories.includes(searchTerm) || searchTerm === '') {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        }

        document.addEventListener('DOMContentLoaded', () => {
            renderSchedule(scheduleData);
            document.getElementById('categorySearch').addEventListener('keyup', filterSchedule);
        });
    </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), htmlContent);
console.log('index.html generated successfully!');
