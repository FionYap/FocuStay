document.addEventListener('DOMContentLoaded', function() {
    const SUPABASE_URL = 'https://xwqpajgkaisdsgpjwgxv.supabase.co'
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3cXBhamdrYWlzZHNncGp3Z3h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MDI2NjUsImV4cCI6MjA1ODM3ODY2NX0.idcUSCAPko6F0G2XxQAbutY4DkuDYPGXpEx2P3367KA'

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    let timer;
    let timeLeft = 1500;
    let isRunning = false;
    let phase = "work";
    let pomodoroCount = 0;
    let shortBreakCount = 0;
    let longBreakCount = 0;
    let workTime = 25;
    let restTime = 5;
    let longRestTime = 15;

    // Random Daily Quote
    const quotes = [
        "Success is not final; failure is not fatal; it is the courage to continue that counts. – Winston Churchill",
        "Don’t stop when you’re tired. Stop when you’re done. – Wesley Snipes",
        "The journey of a thousand miles begins with one step. – Lao Tzu",
        "Always take another step. If this is to no avail take another, and yet another. One step at a time is not too difficult. – Og Mandino",
        "Formula for success: rise early, work hard, strike oil. – J.Paul Getty",
        "Work hard in silence and let success be your noise. – Anonymous",
        "The path to success is to take massive, determined action. – Tony Robbins",
        "Man cannot discover new oceans unless he has the courage to lose sight of the shore. – Andre Gide",
        "Action is the foundational key to all success. – Pablo Picasso",
        "Push yourself, because no one else is going to do it for you. – Anonymous"
    ];

    function getDailyQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        document.getElementById("daily-quote").textContent = quotes[randomIndex];
    }

    // Initialize your functions
    getDailyQuote();

    // Login functionality
    const loginIcon = document.getElementById("login-icon");
    const loginModal = document.getElementById("login-modal");
    const closeLoginModal = document.getElementById("close-login-modal");
    const loginButton = document.getElementById("login-button");
    const registerButton = document.getElementById("register-button");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    // Add all your event listeners here
    loginIcon.addEventListener("click", () => {
        loginModal.style.display = "block";
    });

    closeLoginModal.addEventListener("click", () => {
        loginModal.style.display = "none";
    });

    loginButton.addEventListener("click", async () => {
        const email = emailInput.value;
        const password = passwordInput.value;
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            })
            
            if (error) throw error
            
            console.log('Logged in:', data)
            loginModal.style.display = "none";
        } catch (error) {
            console.error('Error:', error.message)
            alert('Login failed: ' + error.message)
        }
    });

    registerButton.addEventListener("click", async () => {
        const email = emailInput.value;
        const password = passwordInput.value;
        
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password
            })
            
            if (error) throw error
            
            console.log('Signed up:', data)
            loginModal.style.display = "none";
            alert('Please check your email to confirm your account')
        } catch (error) {
            console.error('Error:', error.message)
            alert('Registration failed: ' + error.message)
        }
    });

    // Wallpaper List
    document.getElementById("wallpaper-switcher").addEventListener("click", function () {
        document.getElementById("wallpaper-list-modal").style.display = "block";
    });

    const wallpaperItems = document.querySelectorAll(".wallpaper-item");
    wallpaperItems.forEach(item => {
        item.addEventListener("click", function () {
            const wallpaperSrc = item.getAttribute("data-src");
            document.getElementById("custom-background").style.backgroundImage = `url('${wallpaperSrc}')`;
            document.getElementById("wallpaper-list-modal").style.display = "none";
        });
    });

    // Theme Switcher
    const themeSwitcher = document.getElementById("theme-switcher");
    themeSwitcher.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
    });

    // Playlist Functionality
    const musicControl = document.getElementById("music-control");
    const playlistModal = document.getElementById("playlist-modal");
    const backgroundMusic = document.getElementById("background-music");

    musicControl.addEventListener("click", function () {
        playlistModal.style.display = "block";
    });

    const playlistItems = document.querySelectorAll(".playlist-item");
    playlistItems.forEach(item => {
        item.addEventListener("click", function () {
            const songSrc = item.getAttribute("data-src");
            backgroundMusic.src = songSrc;
            backgroundMusic.play();
            playlistModal.style.display = "none";
            musicControl.textContent = "🔊";
        });
    });

    // Ring Bells
    const startBell = document.getElementById("start-bell");
    const endBell = document.getElementById("end-bell");

    function playStartBell() {
        startBell.play();
    }

    function playEndBell() {
        endBell.play();
    }

    // Update Title Bar with Countdown
    function updateTitle() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.title = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} - Study Focus`;
    }

    // Existing Timer Logic
    document.getElementById("start").addEventListener("click", function () {
        if (!isRunning) {
            timer = setInterval(updateTimer, 1000);
            isRunning = true;
            playStartBell(); // Play start bell
        }
    });

    document.getElementById("reset").addEventListener("click", function () {
        clearInterval(timer);
        isRunning = false;
        timeLeft = workTime * 60;
        phase = "work";
        updateDisplay();
    });

    document.getElementById("open-settings").addEventListener("click", function () {
        document.getElementById("settings-modal").style.display = "block";
    });

    document.getElementById("save-settings").addEventListener("click", function () {
        workTime = parseInt(document.getElementById("work-time").value);
        restTime = parseInt(document.getElementById("rest-time").value);
        longRestTime = parseInt(document.getElementById("long-rest-time").value);
        timeLeft = workTime * 60;
        updateDisplay();
        document.getElementById("settings-modal").style.display = "none";
    });

    document.getElementById("add-task").addEventListener("click", function () {
        const taskInput = document.getElementById("task-input");
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            const taskList = document.getElementById("task-list");
            const li = document.createElement("li");
            li.textContent = taskText;
            taskList.appendChild(li);
            taskInput.value = "";
        }
    });

    // Modify Tasks Functionality
    let isModifyMode = false;

    document.getElementById("modify-tasks").addEventListener("click", function () {
        const taskList = document.getElementById("task-list");
        const tasks = taskList.querySelectorAll("li");

        if (!isModifyMode) {
            // Add delete buttons to each task
            tasks.forEach(task => {
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.addEventListener("click", function () {
                    taskList.removeChild(task);
                });
                task.appendChild(deleteButton);
            });
            isModifyMode = true; // Enter modify mode
        } else {
            // Remove delete buttons from each task
            tasks.forEach(task => {
                const deleteButton = task.querySelector("button");
                if (deleteButton) {
                    task.removeChild(deleteButton);
                }
            });
            isModifyMode = false; // Exit modify mode
        }
    });

    function updateTimer() {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
            updateTitle(); // Update title bar
        } else {
            clearInterval(timer);
            isRunning = false;
            playEndBell(); // Play end bell
            transitionPhase();
        }
    }

    function updateDisplay() {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        document.getElementById("timer").textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function transitionPhase() {
        if (phase === "work") {
            pomodoroCount++;
            if (pomodoroCount % 4 === 0) {
                phase = "longBreak";
                timeLeft = longRestTime * 60;
                longBreakCount++;
            } else {
                phase = "shortBreak";
                timeLeft = restTime * 60;
                shortBreakCount++;
            }
        } else {
            phase = "work";
            timeLeft = workTime * 60;
        }
        document.getElementById("frequency-record").textContent = `Pomodoro: ${pomodoroCount} | Short Break: ${shortBreakCount} | Long Break: ${longBreakCount}`;
        timer = setInterval(updateTimer, 1000);
        isRunning = true;
    }
});