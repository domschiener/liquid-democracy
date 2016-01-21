# About the Tests

More coming soon

Create a test function that basically creates 3 randomized json objects:
  - One for the poll (uservotes)
  - One for the delegates
  - One for the users



Delegates:
{
   "_id":"bsJf6XjTKTPtnEFYb",
   "delegate":{
      "description":"Very cool ey",
      "domain":[
         "finance"
      ],
      "userID":"bsJf6XjTKTPtnEFYb",
      "username":"domschiener",
      "profile_pic":"https://avatars.githubusercontent.com/u/9785885?v=3",
      "name":"Dominik Messiah",
      "link":"https://github.com/domschiener"
   },
   "delegations":[
      {
         "domain":"finance",
         "user":"HvJf6XjTKTPtnEFYb"
      }
   ]
}


Uservotes:
{
   "_id":"xsTKkv8yY29HY5cTY",
   "vote":[
      {
         "voter":"kBDJXksEPgaNmi6Hk",
         "option":"15",
         "poll":"xsTKkv8yY29HY5cTY",
         "votedAt":         ISODate("2016-01-19T09:39:01.792         Z")
      },
   ]
}{
   "_id":"PBQ2GDp4bXkk8jB5S",
   "vote":[
      {
         "voter":"kBDJXksEPgaNmi6Hk",
         "option":"Yes",
         "poll":"PBQ2GDp4bXkk8jB5S",
         "votedAt":         ISODate("2016-01-19T15:35:17.103         Z")
      }
   ]
}


users
{
   "_id":"HvJf6XjTKTPtnEFYb",
   "createdAt":   ISODate("2016-01-19T16:35:48.335   Z"),
   "services":{
      "github":{
         "id":9785885,
         "accessToken":"ab589249c97cab582573460f84ee061464a1c98f",
         "email":"dom@fileyy.com",
         "username":"domschiener",
         "emails":[
            {
               "email":"dom@fileyy.com",
               "primary":true,
               "verified":true
            }
         ]
      },
      "resume":{
         "loginTokens":[
            {
               "when":               ISODate("2016-01-19T16:35:48.337               Z"),
               "hashedToken":"L2Ye8DJemIJ/mfhqgYN30DdgxAJSUq41NSbH5neeUP4="
            }
         ]
      }
   },
   "profile":{
      "name":"Dominik Schiener"
   },
   "delegate":true,
   "description":"fdsafdsa",
   "profile_pic":"https://avatars.githubusercontent.com/u/9785885?v=3",
   "expertise":[
      "finance"
   ],
   "delegates":[
      {
         "delegate":null,
         "domain":[
            "finance"
         ]
      },
      {
         "delegate":"bsJf6XjTKTPtnEFYb",
         "domain":[
            "finance"
         ]
      }
   ]
}
