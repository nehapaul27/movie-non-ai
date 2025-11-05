document.addEventListener('DOMContentLoaded', () => {
  // --- Data: simple movies with showtimes ---
  const movies = [
    { id: 'm1', title: 'Inception', image: 'image3.png', times: ['10:00 AM', '1:30 PM', '7:00 PM'] },
    { id: 'm2', title: 'Avengers', image: 'image2.png', times: ['11:00 AM', '3:00 PM', '9:00 PM'] },
    { id: 'm3', title: 'Interstellar', image: 'image.png', times: ['9:30 AM', '2:00 PM', '6:30 PM'] },
    { id: 'm4', title: 'Spider-Man: No Way Home', image: 'image4.png', times: ['10:30 AM', '1:00 PM', '8:00 PM'] },
    { id: 'm5', title: 'The Batman', image: 'image5.png', times: ['9:00 AM', '12:00 PM', '6:00 PM'] },
    { id: 'm6', title: 'Joker', image: 'image6.png', times: ['11:30 AM', '3:30 PM', '9:30 PM'] },
    { id: 'm7', title: 'Doctor Strange', image: 'image7.png', times: ['10:15 AM', '2:15 PM', '7:15 PM'] },
    { id: 'm8', title: 'Black Panther', image: 'image8.png', times: ['9:45 AM', '1:45 PM', '6:45 PM'] },
    { id: 'm9', title: 'Thor: Love and Thunder', image: 'image9.png', times: ['11:00 AM', '3:00 PM', '8:00 PM'] },
    { id: 'm10', title: 'Guardians of the Galaxy', image: 'image10.png', times: ['10:30 AM', '2:30 PM', '7:30 PM'] }
  ];

  // --- State ---
  let currentMovie = null;
  let currentTime = null;
  const seatState = {}; // key = "movieId|time" -> Set of booked seats

  // --- Elements ---
  const moviesEl = document.getElementById('movies');
  const timesPanel = document.getElementById('times-panel');
  const timesTitle = document.getElementById('times-title');
  const timesList = document.getElementById('times-list');
  const backToMovies = document.getElementById('back-to-movies');
  const seatsPanel = document.getElementById('seats-panel');
  const seatsTitle = document.getElementById('seats-title');
  const seatsGrid = document.getElementById('seats-grid');
  const bookBtn = document.getElementById('book-btn');
  const backToTimes = document.getElementById('back-to-times');
  const info = document.getElementById('info');

  // --- Render movie cards ---
  function renderMovies() {
    moviesEl.innerHTML = '';
    movies.forEach(m => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<img src="${m.image}" alt=""><div class="title">${m.title}</div>`;
      card.addEventListener('click', () => openTimes(m));
      moviesEl.appendChild(card);
    });
  }

  // --- Open showtimes ---
  function openTimes(movie) {
    currentMovie = movie;
    currentTime = null;
    timesTitle.textContent = `Showtimes — ${movie.title}`;
    timesList.innerHTML = '';
    movie.times.forEach(t => {
      const btn = document.createElement('button');
      btn.className = 'btn small';
      btn.textContent = t;
      btn.addEventListener('click', () => openSeats(movie, t));
      timesList.appendChild(btn);
    });
    timesPanel.classList.remove('hidden');
    seatsPanel.classList.add('hidden');
    info.textContent = '';
  }

  // --- Open seats ---
  function openSeats(movie, time) {
    currentTime = time;
    seatsTitle.textContent = `${movie.title} — ${time} (Choose seats)`;
    renderSeats();
    seatsPanel.classList.remove('hidden');
    timesPanel.classList.add('hidden');
    info.textContent = '';
  }

  // --- Render seats grid (1 to 40) ---
  function renderSeats() {
    seatsGrid.innerHTML = '';
    const key = `${currentMovie.id}|${currentTime}`;
    const booked = seatState[key] || new Set();

    for (let i = 1; i <= 40; i++) {
      const seat = document.createElement('div');
      seat.className = 'seat';
      seat.textContent = i;
      if (booked.has(i)) seat.classList.add('booked');
      seat.addEventListener('click', () => {
        if (seat.classList.contains('booked')) return;
        seat.classList.toggle('selected');
      });
      seatsGrid.appendChild(seat);
    }
  }

  // --- Book selected seats ---
  function bookSelected() {
    const selected = Array.from(seatsGrid.querySelectorAll('.seat.selected'));
    if (selected.length === 0) {
      alert('Please select at least one seat.');
      return;
    }

    const key = `${currentMovie.id}|${currentTime}`;
    if (!seatState[key]) seatState[key] = new Set();

    const booked = seatState[key];
    const numbers = [];
    for (const seat of selected) {
      const n = Number(seat.textContent);
      booked.add(n);
      seat.classList.remove('selected');
      seat.classList.add('booked');
      numbers.push(n);
    }

    info.textContent = `✅ Booked seat(s): ${numbers.join(', ')} for ${currentMovie.title} at ${currentTime}`;
  }

  // --- Back buttons ---
  backToMovies.addEventListener('click', () => {
    timesPanel.classList.add('hidden');
    seatsPanel.classList.add('hidden');
    info.textContent = '';
  });

  backToTimes.addEventListener('click', () => {
    seatsPanel.classList.add('hidden');
    timesPanel.classList.remove('hidden');
    info.textContent = '';
  });

  bookBtn.addEventListener('click', bookSelected);

  // --- Initialize ---
  renderMovies();
});
