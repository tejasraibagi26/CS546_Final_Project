const dbConnection = require("../config/mongoConnection");
const { venues } = require("../data");
const data = require("../data");
const venue = data.venues;
const user = data.user;
const reviews = data.reviews;
const booking = data.booking;
const activity = data.activity;
const report = data.report;
const comments = data.comments;

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

let maxCount = 5;
let postCount = 5;
let addressStart = 100;
let addressEnd = 1400;
let minPrice = 10;
let maxPrice = 100;
let venueApprove = true;
let time = [
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

let activityTitles = [
  "Need players to play.",
  "Need frontline player, who can co-operate with others.",
  "Need someone who is a team player!",
  "Need someone who can play with others.",
  "One of our players is injured! Need someone to play for us.",
  "We are looking for players who can join us!",
  "Looking for a beginner to play with us. We all are newbies",
  "Need a professional player to play with us in a major league.",
  "Need a coach who can help us in our training.",
  "We need a moderate level player to be as a backup player.",
];

let activityDescriptions = [
  "We are looking for a player who can play with others.",
  "We are a group of people who are looking for a player who can play with others.",
];

let reportComment = [
  "Rude comment",
  "Inappropriate content",
  "Asking for money",
  "Spam",
  "Disrespectful",
  "Disagree with the rules",
];

let reportTypes = ["Abusive", "Hate", "Rude", "Sexual", "Other"];

let reviewComments = [
  "I agree with this review!",
  "I disagree with this review!",
  "This review is not helpful",
  "This review is helpful",
  "Fake! This is not a real review",
  "This review is fake",
  "Paid review!",
  "Actually could have been better!",
];

let userId = [];
let venueId = [];
let bookingId = [];
let activityId = [];
let ownerId = [];
let reviewId = [];
let password = "Project@123";
let ownerPassword = "Owner@123";
let alreadyBooked = [];

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
  console.log("Starting...");
  const db = await dbConnection();
  await db.dropDatabase();

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
    console.log(`Created User: ${firstName} ${lastName}`);
  }

  for (let i = 0; i < 2; i++) {
    let random = Math.round(Math.random() * names.length);
    let random2 = Math.round(Math.random() * names.length);
    let firstName = `${names[random]}`;
    let lastName = `${names[random2]}`;
    let email = `${names[random].toLowerCase()}@gmail.com`;
    let role = "Owner";
    let age = Number(Math.round(Math.random() * (40 - 18) + 18));
    let genderRandomIdx = Math.round(Math.random() * genders.length);
    let gender = genders[genderRandomIdx];
    if (gender == undefined) gender = genders[0];
    const uploadUser = await user.createUser(
      firstName,
      lastName,
      email,
      ownerPassword,
      age,
      gender,
      role
    );
    ownerId.push(uploadUser.id.toString());
    console.log(`Created Owner : ${firstName} ${lastName}`);
  }

  //Insert admin
  const uploadUser = await user.createUser(
    "Patrick",
    "Hill",
    "admin@gmail.com",
    "Admin@123",
    46,
    "Male",
    "Admin"
  );

  console.log(`Added Admin`);

  // This will create random venues
  for (let i = 0; i < maxCount; i++) {
    let random = Math.round(Math.random() * names.length);
    let fakeName = `${names[random]} Sports Complex`;
    random = Math.round(Math.random() * addressEnd);
    let add = `${random + addressStart} Main St, Hoboken, NJ`;
    let slots = parseInt(Math.round(Math.random() * 10));
    let randomOwner = Math.round(Math.random() * ownerId.length);
    let owner = ownerId[randomOwner];
    if (owner == undefined) owner = ownerId[0];
    let timeObjects = [];
    for (let k = 0; k < time.length; k++) {
      let tempObject = {};
      tempObject.timeSlot = time[k];
      tempObject.slotsAvailable = slots === 0 ? slots + 2 : slots;
      timeObjects.push(tempObject);
    }

    let sportArray = [];
    let maxSports = Math.round(Math.random() * sports.length);
    for (let j = 0; j < maxSports; j++) {
      let random = Math.round(Math.random() * sports.length - 1);
      if (sports[random] !== undefined) sportArray.push(sports[random]);
    }

    let getPrice = Math.round((Math.random() * maxPrice) / 10) * 10;
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
      venueApprove,
      owner
    );

    venueId.push({ id: venueData.toString(), cost: price });

    console.log(`Uploaded ${fakeName}`);
  }

  // This will create random reviews
  for (let k = 0; k < venueId.length; k++) {
    for (let j = 0; j < userId.length; j++) {
      let venue = venueId[k];
      let reviewIdx = Math.round(Math.random() * reviewsArr.length);
      if (reviewsArr[reviewIdx] === undefined) reviewIdx = 0;
      let review = reviewsArr[reviewIdx];
      let addRev = await reviews.addReview(
        userId[j],
        venue.id,
        review.text,
        review.rating,
        ""
      );

      reviewId.push(addRev.reviewId.toString());
      console.log(`Added review for ${venue.id}`);
    }
  }

  // This will add bookings
  for (let i = 0; i < maxCount; i++) {
    let random = Math.floor(Math.random() * userId.length);
    let user_id = userId[random];
    let sT = ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00"];
    let eT = ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
    let startTime = sT[Math.floor(Math.random() * sT.length)];
    let endTime = eT[Math.floor(Math.random() * eT.length)];
    let date = "2021-12-31";
    let price = venue.cost;
    let shortET = parseInt(endTime.split(":")[0]);
    let shortST = parseInt(startTime.split(":")[0]);
    let cost = price * (shortET - shortST);

    for (let k = 0; k < venueId.length; k++) {
      const addBooking = await booking.create(
        venueId[k].id,
        user_id,
        startTime,
        endTime,
        date,
        cost.toString()
      );

      console.log(`Created Booking with id ${addBooking.bookingId}`);

      bookingId.push(addBooking.bookingId);
    }
  }

  //Create activity feed
  for (let i = 0; i < maxCount; i++) {
    let randomIdx = Math.floor(Math.random() * activityTitles.length);
    let activityTitle = activityTitles[randomIdx];
    let randomIdx2 = Math.floor(Math.random() * activityDescriptions.length);
    let activityDescription = activityDescriptions[randomIdx2];
    let playerReq = Math.floor(Math.random() * 10);
    if (playerReq === 0) playerReq = 1;
    let createdBy = userId[Math.floor(Math.random() * userId.length)];
    let random = Math.floor(Math.random() * venueId.length);
    let venueReq = venueId[random].id;
    let booking = bookingId[random];
    const addActivity = await activity.createActivity(
      activityTitle,
      activityDescription,
      playerReq,
      createdBy,
      venueReq,
      booking.toString()
    );

    console.log(`Created Activity with id ${addActivity._id}`);
    activityId.push(addActivity._id.toString());
  }

  // Create reports
  for (let i = 0; i < 5; i++) {
    let typeVote = Math.floor(Math.random() * 2);
    let user_id = userId[Math.floor(Math.random() * userId.length)];
    if (user_id === undefined) user_id = userId[0];
    let reportContent =
      reportComment[Math.floor(Math.random() * reportComment.length)];
    let reportType =
      reportTypes[Math.floor(Math.random() * reportTypes.length)];
    if (typeVote === 0) {
      // Upload report as post
      let id = activityId[Math.floor(Math.random() * activityId.length - 1)];
      if (id == undefined) id = activityId[0].toString();

      let type = "post";
      const addReport = await report.reportVenue(
        id.toString(),
        user_id.toString(),
        reportContent,
        reportType,
        type
      );
      console.log(`Created Report for ${type} with id ${addReport.id}`);
    } else {
      // Upload report as venue
      let id =
        venueId[Math.floor(Math.random() * venueId.length)].id.toString();
      if (id == undefined) id = venueId[0].id.toString();
      let type = "venues";

      const addReport = await report.reportVenue(
        id.toString(),
        user_id.toString(),
        reportContent,
        reportType,
        type
      );
      console.log(`Created Report for ${type} with id ${addReport.id}`);
    }
  }

  // Create comments
  for (let i = 0; i < venueId.length; i++) {
    let venue_id = venueId[i].id.toString();
    let user_id = userId[Math.floor(Math.random() * userId.length)];
    let review_id = reviewId[i];
    let txt = reviewComments[Math.floor(Math.random() * reviewComments.length)];
    const addRev = await comments.addComment(user_id, review_id, venue_id, txt);
    console.log(`Added comment with ${addRev.id}`);
  }

  console.log("Closing DB Connection");
  await db.close();
  console.log("Done");
};

main().catch((err) => console.log(err));
