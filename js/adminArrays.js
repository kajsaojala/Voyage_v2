let adminUsersArray = [
        {
            id: 1,
            username: 'mandy1',
            profilePic: '../images/stockImages/person_1.jpg',
        },
        {
            id: 2,
            username: 'travelCharlie',
            profilePic: '../images/stockImages/person_2.jpg',
        },
        {
            id: 3,
            username: 'backpacker_m',
            profilePic: '../images/stockImages/person_3.jpg',
        },
    ]

// array för 15 fake polaroider
let adminPolaroidArray = [
    {
        postID: 1,
        creatorID: 1,
        coverImg: '../images/stockImages/travel_1.jpg',
        country: 'Turkey',
        title: 'Air baloons in Cappadocia',
    },
    {
        postID: 2,
        creatorID: 2,
        coverImg: '../images/stockImages/travel_2.jpg',
        country: 'Spain',
        title: 'My hike on La Gomera',
    },
    {
        postID: 3,
        creatorID: 3,
        coverImg: '../images/stockImages/travel_3.jpg',
        country: 'Indonesia',
        title: 'Stunning sunsets on Bali',
    },
    {
        postID: 4,
        creatorID: 3,
        coverImg: '../images/stockImages/travel_4.jpg',
        country: 'USA',
        title: 'Coast to Coast with Doggo',
    },
    {
        postID: 5,
        creatorID: 1,
        coverImg: '../images/stockImages/travel_5.jpg',
        country: 'Greece',
        title: 'Island hoping with my best friend',
    },
    {
        postID: 6,
        creatorID: 2,
        coverImg: '../images/stockImages/travel_6.jpg',
        country: 'Filipines',
        title: 'We found heaven',
    },
    {
        postID: 7,
        creatorID: 3,
        coverImg: '../images/stockImages/travel_7.jpg',
        country: 'Thailand',
        title: 'My favourite hotels in Thailand',
    },
    {
        postID: 8,
        creatorID: 1,
        coverImg: '../images/stockImages/travel_8.jpg',
        country: 'Scotland',
        title: 'We reached The Old man if Storr',
    },
    {
        postID: 9,
        creatorID: 2,
        coverImg: '../images/stockImages/travel_9.jpg',
        country: 'Austria',
        title: 'Four months in the Alps',
    },
    {
        postID: 10,
        creatorID: 2,
        coverImg: '../images/stockImages/travel_10.jpg',
        country: 'Italy',
        title: 'Venice in August',
    },
    {
        postID: 11,
        creatorID: 3,
        coverImg: '../images/stockImages/travel_11.jpg',
        country: 'Turkey',
        title: 'Roadtrip around Turkey',
    },
    {
        postID: 12,
        creatorID: 1,
        coverImg: '../images/stockImages/travel_12.jpg',
        country: 'Greece',
        title: 'A week at the sea',
    },
    {
        postID: 13,
        creatorID: 1,
        coverImg: '../images/stockImages/travel_13.jpg',
        country: 'Jordan',
        title: 'Magical Wadi Rum',
    },
    {
        postID: 14,
        creatorID: 2,
        coverImg: '../images/stockImages/travel_14.jpg',
        country: 'Australia',
        title: 'One year abroad',
    },
    {
        postID: 15,
        creatorID: 3,
        coverImg: '../images/stockImages/travel_15.jpg',
        country: '?',
        title: 'My favourite ancient places',
    },

]


//array för resekategorier som visas som cirklar på homepage
//Fråga: lägga till en array för varje kategori där vi appendar postIDs eller ska vi ladda upp polaroiderna
//genom att jämföra alla postIDs travelCategory med den travelcategory man klickat på?
let travelCategoriesArray = [
    {
        travelCategory: "Backpacking",
        categoryID: "1",
        categoryIcon: "../images/stockImages/icons/backpack.png"
    },
    {
        travelCategory: "Boat adventure",
        categoryID: "2",
        categoryIcon: "../images/stockImages/icons/boat.png"
    },
    {
        travelCategory: "Culture trip",
        categoryID: "3",
        categoryIcon: "../images/stockImages/icons/mosque.png"
    },
    {
        travelCategory: "Safari",
        categoryID: "4",
        categoryIcon: "../images/stockImages/icons/safari.png"
    },
    {
        travelCategory: "Vacation",
        categoryID: "5",
        categoryIcon: "../images/stockImages/icons/vacation.png"
    },
    {
        travelCategory: "Skiing",
        categoryID: "6",
        categoryIcon: "../images/stockImages/icons/skiing.png"
    },
    {
        travelCategory: "Hiking",
        categoryID: "7",
        categoryIcon: "../images/stockImages/icons/hiking.png"
    },
    {
        travelCategory: "Road trip",
        categoryID: "8",
        categoryIcon: "../images/stockImages/icons/road-trip.png"
    },
    {
        travelCategory: "City",
        categoryID: "9",
        categoryIcon: "../images/stockImages/icons/city.png"
    },
    {
        travelCategory: "Other",
        categoryID: "10",
        categoryIcon: "../images/stockImages/icons/other.png"
    }
]


//ska denna uppdateras när man tar bort en post om det var den ända som fanns för det landet? och ska det läggas till land när man väljer ett som inte finns? 
//har skapat dem som objekt just nu ifall vi behöver mer nycklar, om det ej behövs kan de stå som strängar bara också /kaj
/*let countriesArray = [ 
    {
        name: "Turkey"
    },
    {
        name: "Morocco"
    },
    {
        name: "Greece"
    },
    {
        name: "Spain"
    },
    {
        name: "Italy"
    },
    {
        name: "Costa Rica"
    },
    {
        name: "USA"
    },
    {
        name: "Tanzania"
    }
]*/
