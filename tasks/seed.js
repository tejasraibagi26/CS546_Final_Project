const _connection = require("../config/mongoConnection");
const data = require("../data");
const venue = data.venues;
const user = data.user;
const reviews = data.reviews;
const names = [
  "Adam",
  "Alex",
  "Aaron",
  "Ben",
  "Carl",
  "Dan",
  "David",
  "Edward",
  "Fred",
  "Frank",
  "George",
  "Hal",
  "Hank",
  "Ike",
  "John",
  "Jack",
  "Joe",
  "Larry",
  "Monte",
  "Matthew",
  "Mark",
  "Nathan",
  "Otto",
  "Paul",
  "Peter",
  "Roger",
  "Roger",
  "Steve",
  "Thomas",
  "Tim",
  "Ty",
  "Victor",
  "Walter",
  "Anderson",
  "Ashwoon",
  "Aikin",
  "Bateman",
  "Bongard",
  "Bowers",
  "Boyd",
  "Cannon",
  "Cast",
  "Deitz",
  "Dewalt",
  "Ebner",
  "Frick",
  "Hancock",
  "Haworth",
  "Hesch",
  "Hoffman",
  "Kassing",
  "Knutson",
  "Lawless",
  "Lawicki",
  "Mccord",
  "McCormack",
  "Miller",
  "Myers",
  "Nugent",
  "Ortiz",
  "Orwig",
  "Ory",
  "Paiser",
  "Pak",
  "Pettigrew",
  "Quinn",
  "Quizoz",
  "Ramachandran",
  "Resnick",
  "Sagar",
  "Schickowski",
  "Schiebel",
  "Sellon",
  "Severson",
  "Shaffer",
  "Solberg",
  "Soloman",
  "Sonderling",
  "Soukup",
  "Soulis",
  "Stahl",
  "Sweeney",
  "Tandy",
  "Trebil",
  "Trusela",
  "Trussel",
  "Turco",
  "Uddin",
  "Uflan",
  "Ulrich",
  "Upson",
  "Vader",
  "Vail",
  "Valente",
  "Van Zandt",
  "Vanderpoel",
  "Ventotla",
  "Vogal",
  "Wagle",
  "Wagner",
  "Wakefield",
  "Weinstein",
  "Weiss",
  "Woo",
  "Yang",
  "Yates",
  "Yocum",
  "Zeaser",
  "Zeller",
  "Ziegler",
  "Bauer",
  "Baxster",
  "Casal",
  "Cataldi",
  "Caswell",
  "Celedon",
  "Chambers",
  "Chapman",
  "Christensen",
  "Darnell",
  "Davidson",
  "Davis",
  "DeLorenzo",
  "Dinkins",
  "Doran",
  "Dugelman",
  "Dugan",
  "Duffman",
  "Eastman",
  "Ferro",
  "Ferry",
  "Fletcher",
  "Fietzer",
  "Hylan",
  "Hydinger",
  "Illingsworth",
  "Ingram",
  "Irwin",
  "Jagtap",
  "Jenson",
  "Johnson",
  "Johnsen",
  "Jones",
  "Jurgenson",
  "Kalleg",
  "Kaskel",
  "Keller",
  "Leisinger",
  "LePage",
  "Lewis",
  "Linde",
  "Lulloff",
  "Maki",
  "Martin",
  "McGinnis",
  "Mills",
  "Moody",
  "Moore",
  "Napier",
  "Nelson",
  "Norquist",
  "Nuttle",
  "Olson",
  "Ostrander",
  "Reamer",
  "Reardon",
  "Reyes",
  "Rice",
  "Ripka",
  "Roberts",
  "Rogers",
  "Root",
  "Sandstrom",
  "Sawyer",
  "Schlicht",
  "Schmitt",
  "Schwager",
  "Schutz",
  "Schuster",
  "Tapia",
  "Thompson",
  "Tiernan",
  "Tisler",
];

let maxCount = 20;
let addressStart = 100;
let addressEnd = 1400;
let minPrice = 10;
let maxPrice = 100;
let venueApprove = true;
let time = [
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
  "24:00",
];

let sports = [
  "Badminton",
  "Basketball",
  "Baseball",
  "Cricket",
  "Cycling",
  "Football",
  "Frisbee",
  "Golf",
  "Handball",
  "Running",
  "Soccer",
  "Squash",
  "Table Tennis",
  "Tennis",
  "Throwball",
];

let preUplaodedImgNames = [
  "16392530188531.jpeg",
  "16392530374622.jpeg",
  "16392530470623.jpeg",
  "16392530567524.jpeg",
  "16392530657125.jpeg",
  "16392530751376.jpeg",
  "16392530864587.jpeg",
  "16392530983968.jpeg",
  "16392531105529.jpeg",
  "163925312848110.jpeg",
];

let genders = [
  "Male",
  "Female",
  "Binary",
  "Non Binary",
  "Trans",
  "Gay",
  "Bisexual",
  "Prefer not to respond",
];
let userId = [];
let venueId = [];

let password = "CS546_Project";

let reviewsArr = [
  {
    text: "Amazing place to hangout with your friends. Highly Recommend this place!",
    rating: 5,
  },
  {
    text: "Good venue, nice sports, great atmosphere.",
    rating: 5,
  },
  {
    text: "Could have been better. The place is small and crowded.",
    rating: 3,
  },
  {
    text: "The place is small",
    rating: 3,
  },
  {
    text: "Good place, equipment is good",
    rating: 4,
  },
  {
    text: "Don't know why this is even listed here!",
    rating: 1,
  },
  {
    text: "This place stinks!!",
    rating: 1,
  },
  {
    text: "Shut down this place!",
    rating: 1,
  },
  {
    text: "Amazing place, food could be improved.",
    rating: 4,
  },
  {
    text: "Got kicked out for not having a valid ID. I mean come on! I live in the US what more id do you need?",
    rating: 1,
  },
  {
    text: "No security box to keep items!",
    rating: 1,
  },
  {
    text: "This place is a mess!",
    rating: 1,
  },
  {
    text: "Okayish, will probably think of coming back",
    rating: 3,
  },
  {
    text: "Very rude staff. I don't like this place.",
    rating: 1,
  },
  {
    text: "Paid 200$ for a game and was not satisfied. I don't know what to say.",
    rating: 2,
  },
];

const main = async () => {
  //This will create the users with the same password
  for (let i = 0; i < maxCount; i++) {
    let random = Math.round(Math.random() * names.length);
    let random2 = Math.round(Math.random() * names.length);
    let firstName = `${names[random]}`;
    let lastName = `${names[random2]}`;
    let email = `${names[random].toLowerCase()}@gmail.com`;
    let role = "User";
    let age = Number(Math.round(Math.random() * (40 - 18) + 18));
    let genderRandomIdx = Math.round(Math.random() * genders.length);
    let gender = genders[genderRandomIdx];
    if (gender == undefined) gender = genders[0];
    const uploadUser = await user.createUser(
      firstName,
      lastName,
      email,
      password,
      age,
      gender,
      role
    );
    userId.push(uploadUser.id.toString());
    console.log(`Uploaded ${firstName} ${lastName}`);
  }

  // This will create random venues
  for (let i = 0; i < maxCount; i++) {
    let random = Math.round(Math.random() * names.length);
    let fakeName = `${names[random]} Sports Complex`;
    random = Math.round(Math.random() * addressEnd);
    let add = `${random + addressStart} Main St, Hoboken, NJ`;
    let slots = parseInt(Math.round(Math.random() * 10));
    let maxTimeObjects = Math.round(Math.random() * time.length);
    let timeObjects = [];
    for (let j = 0; j < maxTimeObjects; j++) {
      let tempObject = {};
      let randomTime = Math.round(Math.random() * time.length - 1);
      if (time[randomTime] != undefined) {
        tempObject.timeSlot = time[randomTime];
        tempObject.slotsAvailable = slots === 0 ? slots + 2 : slots;
        timeObjects.push(tempObject);
      }
    }
    let sportArray = [];
    let maxSports = Math.round(Math.random() * sports.length);
    for (let j = 0; j < maxSports; j++) {
      let random = Math.round(Math.random() * sports.length - 1);
      if (sports[random] !== undefined) sportArray.push(sports[random]);
    }
    let getPrice = Math.round(Math.random() * maxPrice);
    let price = getPrice < 10 ? parseInt(minPrice) : parseInt(getPrice);
    let randomImageIdx = Math.round(Math.random() * preUplaodedImgNames.length);
    let image = preUplaodedImgNames[randomImageIdx];
    if (image === undefined) image = preUplaodedImgNames[0];
    const arr = [fakeName, add, timeObjects, sportArray, price, image];
    const venueData = await venue.createNewVenue(
      fakeName,
      add,
      timeObjects,
      sportArray,
      price,
      image,
      venueApprove
    );

    venueId.push(venueData.toString());

    console.log(`Uploaded ${fakeName}`);
  }

  // This will create random reviews
  for (let i = 0; i < maxCount; i++) {
    let random = Math.round(Math.random() * userId.length);
    let random2 = Math.round(Math.random() * venueId.length);
    let user = userId[random];
    let venue = venueId[random2];
    let reviewIdx = Math.round(Math.random() * reviewsArr.length);
    if (reviewsArr[reviewIdx] === undefined) reviewIdx = 0;
    let review = reviewsArr[reviewIdx];
    await reviews.addReview(user, venue, review.text, review.rating);
    console.log(`Uploaded review for ${userId}`);
  }

  console.log(venueId);
  console.log(userId);
  console.log("Closing DB Connection");
  await _connection.closeConnection();
};

main();
