// Small built-in dataset used in DEMO MODE (no API key or TMDB unreachable).
// Poster images are not included: the app draws a local placeholder instead.
const m = (n, title, year, rating, language, genreIds, popularity, overview) => ({
  id: `demo-${n}`, title, year: String(year), date: `${year}-01-01`, rating, overview,
  poster: null, backdrop: null, genreIds, language, popularity, demo: true,
});

export const DEMO_MOVIES = [
  m(1, 'Inception', 2010, 8.4, 'en', [28, 878, 12], 95, 'A thief who steals secrets through dreams is offered one last job: planting an idea inside a target\'s mind.'),
  m(2, 'Interstellar', 2014, 8.4, 'en', [12, 18, 878], 92, 'Explorers travel through a wormhole in search of a new home for humanity as Earth fails.'),
  m(3, 'The Dark Knight', 2008, 8.5, 'en', [18, 28, 80, 53], 98, 'Batman faces the Joker, a criminal mastermind who pushes Gotham into chaos.'),
  m(4, 'Spirited Away', 2001, 8.5, 'ja', [16, 10751, 14], 80, 'A girl wanders into a world of spirits and must work in a bathhouse to free her parents.'),
  m(5, 'Toy Story', 1995, 8.0, 'en', [16, 35, 10751], 75, 'A cowboy doll feels threatened when a new space ranger toy becomes his owner\'s favourite.'),
  m(6, 'The Notebook', 2004, 7.9, 'en', [10749, 18], 60, 'A young couple from different backgrounds fall in love over one summer in the 1940s.'),
  m(7, 'Get Out', 2017, 7.6, 'en', [27, 9648, 53], 70, 'A visit to his girlfriend\'s family estate reveals a disturbing secret to a young photographer.'),
  m(8, 'A Quiet Place', 2018, 7.4, 'en', [27, 878, 53], 66, 'A family must live in silence to hide from creatures that hunt by sound.'),
  m(9, 'Mad Max: Fury Road', 2015, 7.6, 'en', [28, 12, 878], 78, 'In a desert wasteland, a rebel driver and a drifter race to escape a tyrant warlord.'),
  m(10, 'Forrest Gump', 1994, 8.5, 'en', [35, 18, 10749], 85, 'A kind-hearted man unwittingly takes part in defining moments of American history.'),
  m(11, 'La La Land', 2016, 7.9, 'en', [35, 18, 10749, 10402], 72, 'A jazz pianist and an aspiring actress chase their dreams and fall in love in Los Angeles.'),
  m(12, 'Arrival', 2016, 7.6, 'en', [18, 878], 64, 'A linguist is recruited to communicate with aliens whose ships have appeared around the world.'),
  m(13, 'Shutter Island', 2010, 8.2, 'en', [18, 53, 9648], 68, 'A US marshal investigates a patient\'s disappearance from a remote psychiatric hospital.'),
  m(14, 'The Conjuring', 2013, 7.5, 'en', [27, 53], 62, 'Paranormal investigators help a family terrorised by a dark presence in their farmhouse.'),
  m(15, 'Paddington 2', 2017, 7.8, 'en', [10751, 35, 12], 58, 'Paddington\'s search for the perfect gift lands him in prison after a theft he did not commit.'),
  m(16, '3 Idiots', 2009, 8.4, 'hi', [35, 18], 82, 'Three engineering students navigate friendship and pressure, led by a free-thinking rebel.'),
  m(17, 'Dangal', 2016, 8.3, 'hi', [18, 28], 74, 'A former wrestler trains his daughters to become world-class champions.'),
  m(18, 'Zindagi Na Milegi Dobara', 2011, 8.0, 'hi', [35, 18, 10749], 63, 'Three friends set off on a road trip across Spain that changes how they see life.'),
  m(19, 'Andhadhun', 2018, 8.2, 'hi', [53, 35, 80], 69, 'A pianist who pretends to be blind becomes entangled in a murder and a web of lies.'),
  m(20, 'Tumbbad', 2018, 7.6, 'hi', [27, 14], 55, 'A greedy man hunts for a forgotten god\'s treasure, with terrifying consequences.'),
  m(21, 'Lagaan', 2001, 8.1, 'hi', [18, 12, 10402], 57, 'Villagers take on their British rulers in a cricket match to cancel a crushing tax.'),
  m(22, 'Sairat', 2016, 7.6, 'mr', [10749, 18], 61, 'A fisherman\'s son and a landlord\'s daughter fall in love across a deep caste divide.'),
  m(23, 'Natsamrat', 2016, 8.2, 'mr', [18], 52, 'A retired stage actor\'s life unravels after he gives away his possessions to his children.'),
  m(24, 'Court', 2014, 7.7, 'mr', [18, 80], 48, 'A folk singer is put on trial in an absurd case that exposes flaws in the legal system.'),
  m(25, 'Ventilator', 2016, 7.4, 'mr', [35, 18, 10751], 50, 'A family gathers at a hospital as its patriarch lies on a ventilator, revealing old tensions.'),
];
