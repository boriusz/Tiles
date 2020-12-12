const board = document.querySelector('.container');
const blankImage = document.createElement('img');
const overlay = document.querySelector('.overlay');
const submit = document.querySelector('input[type="submit"]');
const highscore = document.querySelector('.highscores');
const image_source_template = 'resources/images/image';
const ps = document.querySelectorAll('p');
const scrollable = document.querySelector('.images_container');
blankImage.style = `display: none;`;
let size, intervalOn, interwal;
board.style.height = `${document.querySelector('img').height}px`;
board.style.width = `${document.querySelector('img').width}px`;
const splitting = {
    image: function () {
        let image = document.createElement('img');
        image.src = image_source_template + `${this.current_image}.jpg`;
        return image
    },
    current_image: 1,
    to_move: 0,
    skip_image: function () {
        document.querySelector('.prev').onclick = function prev_skip() {
            splitting.to_move -= 100;
            if (splitting.current_image === 1) {
                splitting.current_image = 4;
                scrollable.scrollLeft = 1000
            } else {
                splitting.current_image -= 1
            }
            splitting.go(false);

        };
        document.querySelector('.next').onclick = function next_skip() {
            splitting.to_move += 100;
            if (splitting.current_image === 4) {
                splitting.current_image = 1;
                splitting.to_move = 400;
                splitting.go(true);
                let wait_interval = setInterval(function () {
                    if (scrollable.scrollLeft === 400) {
                        scrollable.scrollLeft = 0;
                        splitting.to_move = 0;
                        clearInterval(wait_interval)
                    }
                },1)
            } else {
                splitting.current_image += 1;
                splitting.go(true);
            }
        };
    },
    go: function (flag) {
        document.querySelector('.prev').onclick = null
        document.querySelector('.next').onclick = null
        clearInterval(interwal)
        if (splitting.to_move === - 100) splitting.to_move = 300
        let target = splitting.to_move;
        if (flag) interwal = setInterval(right , 10)
        else interwal = setInterval(left , 10)
        function right() {
            scrollable.scrollBy(2, 0)
            if (scrollable.scrollLeft >= target){
                clearInterval(interwal)
                splitting.skip_image()
            }
        }
        function left() {
            scrollable.scrollBy(-2, 0)
            if (scrollable.scrollLeft <= target){
                clearInterval(interwal)
                splitting.skip_image()

            }
        }

    },
    imageSplit: function () {
        let image = this.image();
        let pieces = [];
        for (let y = 0; y < size; ++y) {
            for (let x = 0; x < size; ++x) {
                let canvas = document.createElement('canvas');
                canvas.width = Math.round(image.width / size * 100) / 100;
                canvas.height = Math.round(image.width / size * 100) / 100;
                let context = canvas.getContext('2d');
                context.drawImage(image, x * image.width / size, y * image.height / size, image.width / size, image.height / size, 0, 0, canvas.width, canvas.height);
                pieces.push({
                    item: canvas.toDataURL(),
                    targetCol: y,
                    targetRow: x,
                    targetId: (y * size) + x
                });
            }
        }
        return pieces;
    },
    addTiles: function () {
        let pieces = this.imageSplit();
        let image = this.image();
        board.innerHTML = '';
        board.style.width = `${Math.floor(image.width / size) * size}px`;
        board.style.height = `${Math.floor(image.height / size) * size}px`;
        pieces.pop();
        let white = document.createElement('img');
        white.src = `resources/images/white.png`;
        white.width = Math.round(image.width / size * 100) / 100;
        white.height = Math.round(image.width / size * 100) / 100;
        white.classList = 'empty';
        white.setAttribute('targetCol', `${size - 1}`);
        white.setAttribute('targetRow', `${size - 1}`);
        pieces.forEach(piece => {
            let img = document.createElement('img');
            img.src = piece.item;
            img.setAttribute('targetCol', piece.targetCol);
            img.setAttribute('targetRow', piece.targetRow);
            img.id = piece.targetId + 1;
            board.appendChild(img);
        });
        board.children[0].insertAdjacentElement('beforebegin', blankImage);
        board.appendChild(white);
    }
};
splitting.skip_image();
const buttons = document.querySelectorAll('.game_starters');
buttons.forEach(button => {
    button.addEventListener('click', function () {
        size = this.size;
        splitting.addTiles();
        game.start();
    });
});
function interval() {
    game.move(true);
}
const game = {
    start: function () {
        game.reset();
        this.mixBoard();
        game.start_timeout = setTimeout(this.startTimer, size * 2000);
    },
    reset: function () {
        clearInterval(intervalOn);
        clearInterval(game.interval);
        clearTimeout(game.timeout);
        clearTimeout(game.start_timeout);
        // document.querySelector('#timer').innerHTML = '';
    },
    startTimer: () => {
        game.moveCounter = 0;
        game.interval = setInterval(function () {
            game.time = Date.now() - game.startTime;
            document.querySelector('#timer').innerHTML = `
<img src="resources/images/cyferki/c${game.getProperTime(game.time)[0][0]}.gif" alt="${game.getProperTime(game.time)[0][0]}">
<img src="resources/images/cyferki/c${game.getProperTime(game.time)[0][1]}.gif" alt="${game.getProperTime(game.time)[0][0]}">
<img src="resources/images/cyferki/colon.gif" alt=":">
<img src="resources/images/cyferki/c${game.getProperTime(game.time)[1][0]}.gif" alt="${game.getProperTime(game.time)[1][0]}">
<img src="resources/images/cyferki/c${game.getProperTime(game.time)[1][1]}.gif" alt="${game.getProperTime(game.time)[1][1]}">
<img src="resources/images/cyferki/colon.gif" alt=":">
<img src="resources/images/cyferki/c${game.getProperTime(game.time)[2][0]}.gif" alt="${game.getProperTime(game.time)[2][0]}">
<img src="resources/images/cyferki/c${game.getProperTime(game.time)[2][1]}.gif" alt="${game.getProperTime(game.time)[2][1]}">
<img src="resources/images/cyferki/dot.gif" alt=".">
<img src="resources/images/cyferki/c${game.getProperTime(game.time)[3][0]}.gif" alt="${game.getProperTime(game.time)[3][0]}">
<img src="resources/images/cyferki/c${game.getProperTime(game.time)[3][1]}.gif" alt="${game.getProperTime(game.time)[3][1]}">
<img src="resources/images/cyferki/c${game.getProperTime(game.time)[3][2]}.gif" alt="${game.getProperTime(game.time)[3][2]}">
`;
        }, 1);
    },
    getProperTime: function (time) {
        time = parseInt(time);
        let milliseconds = (time % 1000),
            seconds = Math.floor((time / 1000) % 60),
            minutes = Math.floor((time / (1000 * 60)) % 60),
            hours = Math.floor((time / (1000 * 60 * 60)) % 24);
        milliseconds = (milliseconds < 10) ? "00" + milliseconds : (milliseconds < 100) ? "0" + milliseconds : milliseconds.toString();
        hours = (hours < 10) ? "0" + hours : hours.toString();
        minutes = (minutes < 10) ? "0" + minutes : minutes.toString();
        seconds = (seconds < 10) ? "0" + seconds : seconds.toString();
        return [hours, minutes, seconds, milliseconds]
    },
    setupListeners: function () {
        let images = document.querySelectorAll('.container > img');
        images.forEach(image => {
            image.addEventListener('click', () => {
                this.move(false, image);
            })
        });
    },
    mixBoard: function () {
        intervalOn = setInterval(interval, 1);
        game.timeout = setTimeout(function () {
            clearInterval(intervalOn);
            game.setupListeners();
            game.startTime = Date.now();
        }, size * 2000)
    },
    move: function (help, newThis) {
        let canAlreadyCheck = false;
        let images = document.querySelectorAll('.container > img');
        let whiteTile = document.querySelector('.empty');
        if (!help) canAlreadyCheck = true;
        else newThis = images[Math.round((Math.random() * ((size * size) - 1)) + 1)];
        let didMove = false;
        if (newThis.className) {}
        else {
            let thisIndex = Array.prototype.indexOf.call(images, newThis);
            let whiteIndex = Array.prototype.indexOf.call(images, whiteTile);
            let imageBeforeThis = images[thisIndex - 1];
            let imageBeforeWhite = images[whiteIndex - 1];
            let clickable = [];
            if (whiteIndex % size === 1) clickable = [-size, size, 1];
            else if (whiteIndex % size === 0) clickable = [-size, size, -1];
            else clickable = [-size, size, -1, 1];
            if (clickable.find(possibility => whiteIndex + possibility === thisIndex)) {
                game.moveCounter += 1;
                imageBeforeThis.insertAdjacentElement('afterend', whiteTile);
                imageBeforeWhite.insertAdjacentElement('afterend', newThis);
                didMove = true
            }
            images = document.querySelectorAll('.container > img');
            if (canAlreadyCheck) {
                let flag = true;
                for (let image of images) {
                    if (image.id) {
                        if (!(Number(image.id) === Array.prototype.indexOf.call(images, image))) {
                            flag = false;
                            break
                        }
                    }
                }
                if (flag) game.gameCompleted()
            }
        }
        return didMove
    },
    gameCompleted: function () {
        document.querySelector('.X').addEventListener('click', function hideOverlay() {
            overlay.style.visibility = 'hidden';
        });
        submit.disabled = false;
        document.querySelector('#nick').disabled = false;
        let image = document.createElement('img');
        image.src = image_source_template + `${splitting.current_image}.jpg`;
        board.innerHTML = '';
        board.appendChild(image);
        clearInterval(game.interval);
        overlay.style.visibility = "visible";
        let time = game.getProperTime(game.time);
        time = time.join(':');
        time = time.substring(0, 8) + '.' + time.substring(9);
        if (cookies.getCookie(`highscores${size}`)) cookies.displayCookie(size, 0);
        else cookies.displayCookie(0, 0);
        document.querySelector('.difficulty_level').innerText = `Wynik w grze ${size}x${size}`;
        document.querySelector('.time').innerText = `Twój czas to ${time}`;
        document.querySelector('.moves').innerText = `Ukończyłeś grę w ${game.moveCounter} ruchach.`;
        submit.addEventListener('click', function saveScore(e) {
            let time = game.getProperTime(game.time);
            time = time.join(':');
            time = time.substring(0, 8) + '.' + time.substring(9);
            if (e) e.preventDefault();
            let prev;
            let nick = document.querySelector('#nick').value;
            if (!nick) nick = 'N/A';
            nick = encodeURIComponent(nick)
            if (cookies.getCookie(`highscores${size}`)) {
                prev = JSON.parse(cookies.getCookie(`highscores${size}`));
            } else {
                prev = [];
            }
            prev.push({ nick: encodeURIComponent(nick), time: time, clicks: game.moveCounter });
            document.querySelector('form').reset();
            cookies.setCookie(`highscores${size}`, `${JSON.stringify(prev)}`);
            cookies.displayCookie(size, 0);
            document.querySelector('#nick').disabled = true;
            this.disabled = true;
            this.removeEventListener('click', saveScore)
        });
        game.reset()
    }
};
const cookies = {
    setCookie: (cname, cvalue) => {
        document.cookie = cname + "=" + cvalue + ";path=/";
        let cooks = JSON.parse(cookies.getCookie(cname));
        cooks.sort((a, b) => parseFloat(a.time.replaceAll(":", '')) - parseFloat(b.time.replaceAll(":", '')));
        if (cooks.length > 10) {
            while (cooks.length > 10) {
                cooks.pop()
            }
            console.log(cooks)
            cookies.setCookie(cname, `${JSON.stringify(cooks)}`)
        }
    },
    getCookie: (cname) => {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
        }
        return "";
    },
    displayCookie: (size, where) => { // where = 0=> końcowa plansza, 1 => tabela wyników
        if (size === 0 && where === 0) highscore.innerHTML = 'Jesteś pierwszy/a';
        else if (size === 0 && where === 1) document.querySelector('.scores').innerHTML = 'Brak wyników';
        else {
            let cook = JSON.parse(cookies.getCookie(`highscores${size}`));
            cook.sort((a, b) => parseFloat(a.time.replaceAll(":", '')) - parseFloat(b.time.replaceAll(":", '')));
            let text = `<ol>`;
            for (let c of cook){
                text += `<li>${decodeURIComponent(c.nick)} - ${c.time}   ruchy: ${c.clicks}</li>`;
            }
            text += `</ol>`;
            if (where === 0) highscore.innerHTML = text;
            else document.querySelector('.scores').innerHTML = text;
        }
    }
};
document.querySelector('.open_score').addEventListener('click', function openScoreboard() {
    document.querySelector('.score_board').style.visibility = 'visible';
    if (cookies.getCookie(`highscores${2}`)) cookies.displayCookie(2, 1);
    else cookies.displayCookie(0, 1)
});
document.querySelector('.closer').addEventListener('click', function closeScoreboard() {
    document.querySelector('.score_board').style.visibility = 'hidden';
    document.querySelector('#scoreboard').reset()

});
const radios = document.querySelectorAll('input[type="radio"]');
radios.forEach(radio => {
    radio.addEventListener('click', function openExact() {
        if (cookies.getCookie(`highscores${this.getAttribute('size')}`)) cookies.displayCookie(this.getAttribute('size'), 1);
        else cookies.displayCookie(0, 1)
    })
});
