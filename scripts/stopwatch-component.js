const template = document.createElement('template');

template.innerHTML = `
    <div>
		<p name>0<p>
		<p time>0<p>
		<button start>Start</button>
		<button stop>Stop</button>
    </div>
  `;

class Stopwatch extends HTMLElement {
    constructor() {
        super();

        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.incrementTime = this.incrementTime.bind(this);

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.startBtn = this.shadowRoot.querySelector('[start]');
        this.stopBtn = this.shadowRoot.querySelector('[stop]');

        this.timeDisplay = this.shadowRoot.querySelector('[time]');
        this.nameDisplay = this.shadowRoot.querySelector('[name]');
    }

    connectedCallback() {
        this.startBtn.addEventListener('click', this.start);
        this.stopBtn.addEventListener('click', this.stop);

        let state = this.getLocalData('state');

        this.setAttribute('state', state);

        if (state === 'pause') {
            this.startBtn.innerText = 'Resume';
            this.setAttribute('time', this.getLocalData('duration'))
            
        } else if (state === 'start') {
            this.setAttribute('time', this.getDuration());
            this.interval = setInterval(this.incrementTime, 1000);

            this.startBtn.innerText = 'Pause';
        }

        if (!this.hasAttribute('time')) {
            this.setAttribute('time', 0);
        }
    }

    insertZero(time) {
        if (time < 10)
            return "0" + time;

        return time;
    }

    formatTime(second) {
        let divisor = 60 * 60;

        const hour = Math.floor(second / divisor);
        second = second % divisor;
        divisor = divisor / 60;

        const minute = Math.floor(second / divisor);
        second = second % divisor;

        return this.insertZero(hour) + ":" + this.insertZero(minute) + ":" + this.insertZero(second);
    }

    incrementTime() {
        this.setAttribute('time', parseInt(this.getAttribute('time')) + 1);
        this.setLocalData();
    }

    start() {
        const state = this.getAttribute('state');

        if ((state === 'pause') || (state === 'stop')) {
            this.setAttribute('state', 'start');
            this.interval = setInterval(this.incrementTime, 1000);

            this.startBtn.innerText = 'Pause';
        } else if (state === 'start') {
            this.setAttribute('state', 'pause');
            clearInterval(this.interval);

            this.setLocalData();

            this.startBtn.innerText = 'Resume';
        }
    }

    stop() {
        this.setAttribute('state', 'stop');
        clearInterval(this.interval);

        let timer = JSON.parse(localStorage.getItem('timer'));

        for (let i = 0; i<timer.length; i++) {
            if (timer[i].name === this.getAttribute('name')) {
                timer[i].history.push(this.getAttribute('time'));
            }
        }

        localStorage.setItem('timer', JSON.stringify(timer));

        this.setAttribute('time', 0);

        this.setLocalData();

        this.startBtn.innerText = 'Start';
    }

    static get observedAttributes() {
        return ['time'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.nameDisplay.innerText = this.getAttribute('name');
        this.timeDisplay.innerText = this.formatTime(this.getAttribute('time'));
    }

    disconnectedCallback() {
        this.startBtn.removeEventListener('click', this.start);
        this.stopBtn.removeEventListener('click', this.stop);
    }

    getLocalData(key) {
        let state = "";
        let duration = 0

        let timer = JSON.parse(localStorage.getItem('timer'));

        for (let i = 0; i<timer.length; i++) {
            if (timer[i].name === this.getAttribute('name')) {
                state = timer[i].state;
                duration = parseInt(timer[i].time);
            }
        }

        switch (key) {
            case "state" :
                return state;
                break;
            case "duration" :
                return duration;
                break;
        }
    }

    getDuration() {
        let duration = this.getLocalData("duration");
        let closedTime = new Date(localStorage.getItem('closed-time'));

        let totalDuration = ((new Date().getTime() - closedTime.getTime()) / 1000) + duration;
        return Math.floor(totalDuration);
    }

    setLocalData() {
        let timer = JSON.parse(localStorage.getItem('timer'));

        for (let i = 0; i<timer.length; i++) {
            if (timer[i].name === this.getAttribute('name')) {
                timer[i].state = this.getAttribute('state');
                timer[i].time = this.getAttribute('time');
            }
        }

        localStorage.setItem('timer', JSON.stringify(timer));
    }
}

window.customElements.define('stopwatch-custom', Stopwatch);

window.addEventListener('beforeunload', function (e) {
	e.preventDefault()

	localStorage.setItem('closed-time', new Date());
});

// const timer = [
//     {
//         name: "PCD",
//         history: ["5"],
//         state: "start",
//         time: "100",
//     },
//     {
//         name: "WebDev",
//         history: ["100", "3600", "10"],
//         state: "pause",
//         time: "500",
//     }
// ]

// localStorage.setItem('timer', JSON.stringify(timer));
