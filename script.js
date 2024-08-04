let input = document.getElementById('inputBox');
let buttons = document.querySelectorAll('button');
let string = "";

function evaluate(expression) {
    try {
        let result = eval(expression);
        input.value = result;
        string = result;
    } catch(e) {
        console.log(e);
        input.value = "Error";
        string = "";
    }
}

buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        if (e.target.innerHTML === '=') {
            evaluate(string);
        } else if (e.target.innerHTML === 'AC') {
            string = ""; 
            input.value = "0"; 
        } else if (e.target.innerHTML === 'DEL') {
            string = string.slice(0, -1);
            input.value = string; 
        } else {
            string += e.target.innerHTML;
            input.value = string; 
        }
    });
});

let microphoneButton = document.querySelector('button.mic');

microphoneButton.addEventListener('click', function() {
    microphoneButton.classList.add('record');

    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = function(event) {
        let transcript = event.results[0][0].transcript.toLowerCase();
        let operations = {
            "plus": "+",
            "minus": "-",
            "multiply": "*",
            "multiplied": "*",
            "divide": "/",
            "divided": "/",
            "remainder": "%",
            "modulus": "%",
            "x": "*",
            "delete": "DEL",
            "clear": "AC"
        };
        let numbers = {
            "zero": "0",
            "one": "1",
            "two": "2",
            "to": "2",
            "three": "3",
            "four": "4",
            "five": "5",
            "six": "6",
            "seven": "7",
            "eight": "8",
            "nine": "9",
            "ten": "10",
            "double zero":"0"
        };

        for (let property in operations) {
            let regex = new RegExp(`\\b${property}\\b`, 'gi');
            transcript = transcript.replace(regex, operations[property]);
        }

        for (let property in numbers) {
            let regex = new RegExp(`\\b${property}\\b`, 'gi');
            transcript = transcript.replace(regex, numbers[property]);
        }

        if (transcript.includes('DEL')) {
            string = string.slice(0, -1);
            input.value = string;
        } else if (transcript.includes('AC')) {
            string = ""; 
            input.value = "0"; 
        } else {
            string = transcript;
            input.value = string;
            setTimeout(() => {
                evaluate(string);
            }, 2000);
        }

        setTimeout(() => {
            microphoneButton.classList.remove('record');
        }, 1500);
    };

    recognition.onerror = function(event) {
        console.error("Speech recognition error: ", event.error);
        microphoneButton.classList.remove('record');
    };
});
