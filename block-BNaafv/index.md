writeCode

#### Community Forum

This application lists all API endpoints for creating a community forum.

API API specifications have been provided below for all the routes required for the application.

Typically, a returned `User` document from the API should look like

```js
{
  "user": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "email": "qwerty@gmail.com",
    "username": "qwerty"
  }
}
```

Typically, a returned `Profile` document from the API should look like

```js
{
  "profile": {
    "name": "Qwerty",
    "username": "qwerty",
    "image": "some image url",
    "bio": "tell me something about yourself"
  }
}
```

List of `all questions` should look like

```js
{
  "questions": [
    {
      "tags": [
        "nodejs",
        "event-loop"
      ],
      "_id": "5ee88c476ca3063848ffec69",
      "title": "what is event loop",
      "description": "describe event loop in detail",
      "author": {
        "_id": "5ee48a5bc6ebc40c5f1b7251",
        "username": "ravi"
      },
      "createdAt": "2020-06-16T09:09:27.563Z",
      "updatedAt": "2020-06-16T09:09:27.563Z",
      "slug": "what-is-event-loop",
    },
    {
      "tags": [
        "nodejs",
        "streams"
      ],
      "_id": "5ee892fcc15117398049baa0",
      "title": "what are streams in Node.js ?",
      "description": "describe streams in detail",
      "author": {
        "_id": "5ee48a5bc6ebc40c5f1b7251",
        "username": "ravi"
      },
      "createdAt": "2020-06-16T09:38:04.834Z",
      "updatedAt": "2020-06-16T09:38:04.834Z",
      "slug": "what-are-streams-in-nodejs",
    }
  ]
}
```

Single `question details` should look like

```js
{
  "question": {
    "tags": [
      "nodejs",
      "event-loop"
    ],
    "answers": [
      {
        "_id": "5ee8982bdfda543a917d93c8",
        "text": "Event loop manages node.js async operations",
        "author": {
            "_id": "5ee48a5bc6ebc40c5f1b7251",
            "username": "qwerty"
        },
        "createdAt": "2020-06-16T10:00:11.363Z",
        "updatedAt": "2020-06-16T10:00:11.363Z",
        "__v": 0
      }
    ],
    "_id": "5ee88c476ca3063848ffec69",
    "title": "what is event loop",
    "description": "describe event loop in detail",
    "author": {
      "_id": "5ee48a5bc6ebc40c5f1b7251",
      "username": "asdfg"
    },
    "createdAt": "2020-06-16T09:09:27.563Z",
    "updatedAt": "2020-06-16T10:00:11.376Z",
    "slug": "what-is-event-loop",
    "__v": 0
  }
}
```

A single answer will be like

```js
{
  "_id": "5ee9acbcd98b1243bbc183bc",
  "text": "Event loop spawns 4 sperate threads for async ops",
  "author": {
      "_id": "5ee48a5bc6ebc40c5f1b7251",
      "username": "qwerty"
  },
  "questionId": "5ee9a59812b8c4425eb12a4a"
  "createdAt": "2020-06-17T05:40:12.609Z",
  "updatedAt": "2020-06-17T05:40:12.609Z",
}
```

`List of answers` will be represented as

```js
{
  "answers": [
      {
          "_id": "5ee9a5f6de3ea642c94ff18d",
          "text": "Event loop manages node.js async operations",
          "author": {
              "_id": "5ee48a5bc6ebc40c5f1b7251",
              "username": "qwerty"
          },
          "createdAt": "2020-06-17T05:11:18.395Z",
          "updatedAt": "2020-06-17T05:11:18.395Z",
          "__v": 0
      },
      {
          "_id": "5ee9acbcd98b1243bbc183bc",
          "text": "Event loop spawns 4 sperate threads for async ops",
          "author": {
              "_id": "5ee48a5bc6ebc40c5f1b7251",
              "username": "max"
          },
          "createdAt": "2020-06-17T05:40:12.609Z",
          "updatedAt": "2020-06-17T05:40:12.609Z",
          "__v": 0
      }
  ]
}
```

##### for authenticated request, add token in req headers

```
Authorization: add jwt token here
```

- All routes prefix /api in their endpoint

- sample routes will be like
  - /api/users/login
  - /api/questions

#### Register User

- method -> POST
- pathname -> /users/register
- required fields are
  - username, email, password
- optional fields are
  - name, image, bio

It should return user document according to above `User` specs.

#### Login User

- method -> POST
- pathname -> /users/login
- required fields are
  - email, password
- no optional fields

It should return user document according to above `User` specs.

#### Current User

- method -> GET
- pathname -> /users/current-user
- authentication required(token)

It should return user document according to above `User` specs.

#### Profile Information

- method -> GET
- pathname -> /profile/:username
- authentication optional

It should return user document according to above `Profile` specs.

#### Update Profile

- method -> PUT
- pathname -> /profile/:username
- authentication required
- optional arguments are
  - username, name, bio, image, email

It should return user document according to above `Profile` specs.

#### Create Question

- method -> POST
- pathname -> /questions
- authentication required
- required fields are
  - title
  - author
  - slug
- optional fields are
  - description
  - tags

It should return the `Question` which was created.

#### List Questions

- method -> GET
- pathname -> /questions
- authentication optional

It should return an array of `All Question` in the above specified format.

#### Update question

- method -> PUT
- pathname -> /questions/:questionId
- authentication required

- optional fields are
  - description
  - tags
  - title

It should return the `Question` which was updated.

#### Delete Question

- method -> DELETE
- pathname -> /questions/:slug
- authentication required

It should return deleted `Question`.
It should also delete associated answers.

#### Add answer

- method -> POST
- pathname -> /questions/:questionId/answers
- authentication required

- required fileds are
  - text answer
  - author

It should return an `Answer`

#### List answers

- method -> GET
- pathname -> /questions/:questionId/answers
- authentication required

It should return an `array of answers`

#### Update answer

- method -> PUT
- pathname -> /answers/:answerId
- authentication required
- required field
  - answer text

It should return an `Answer`.

#### Delete answer

- method -> DELETE
- pathname -> /answers/:answerId
- authentication required

It should return deleted `Answer`.
It should also remove the reference from other model documents.

#### List tags

- method -> GET
- pathname -> /tags
- authentication optional

It should return an array of all tags used.

```js
{
  "tags": [
    "nodejs",
    "streams",
    "react"
  ]
}
```

Further add endpoints for following actions

- follow/unfollow other user
- upvote questions/answers
- add comments on questions/answers
- admin dashboard
  - admin registration/login
  - admin can track/block users
  - admin can track all questions at a time
