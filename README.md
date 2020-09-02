### Prerequisites

* Node.js 10.x or 12.x
* Less secure app access - Warning: Switch this option for your gmail account to use it for this app's email feature. This option can be turned off for gmail accounts that do not have 2-step Verification enabled. If you really want an active account, you can find the option here https://myaccount.google.com/u/1/lesssecureapps?pli=1.

* Create a `.env` file at the root of the project
    ```
    PORT=8080

    // for email service
    NODEMAILER_SERVICE=smtp.gmail.com
    NODEMAILER_PORT=465
    NODEMAILER_USER=mygmailgmail@mygmail.com
    NODEMAILER_PASS=password
    ```

### Start the server

```
npm i
npm start
```

### API

#### Register `POST /api/users`

Email and password are required. First_name and last_name if not included are set to empty strings. Newly created users have an `account_status: 'INACTIVE'`. User is emailed a token and an activation link for account activation.

```bash
curl --location --request POST 'http://localhost:18999/api/users/' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Authorization: Bearer 5ea494e5-7732-46f6-98a0-96c3101b18b1' \
--data-urlencode 'email=e@mail.com' \
--data-urlencode 'password=pass' \
--data-urlencode 'first_name=1234' \
--data-urlencode 'last_name=qwer'

# 200
{
    "id": "2621bae0-bf79-4b47-8dca-48b700af9813",
    "email": "e@mail.com",
    "first_name": "",
    "last_name": "",
    "account_status": "INACTIVE"
}

# 400
{
    "error": "'email' is required for user registration"
}

# 400
{
    "error": "'password' is required for user registration"
}
```

#### Login `POST /auth/login`

```bash
curl --location --request POST 'http://localhost:18999/auth/login' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'email=e@mail.com' \
--data-urlencode 'password=pass'

# 200
d6d50fd0-5976-4d95-ab43-088692251c65

# 401 - incorrect email/password
{
  "error": "Email or password is incorrect, please try again."
}
```

#### User activation `POST /api/users/activate` `GET /api/users/activate`

Use the activation token or open the activation link emailed to the user.

```bash
# POST
curl --location --request POST 'http://localhost:18999/api/users/activate/' \
--header 'Authorization: Bearer fc7cf408-6fed-4bbd-ac27-f1027db5d300'

# 200
{
    "id": "48fefabd-81c9-4b1e-bbe3-e0abd1c991cc",
    "email": "e@mail.com",
    "first_name": "",
    "last_name": "",
    "account_status": "ACTIVE"
}

# 400 - activation token not found
{
    "error": "Unable to find user for the activation token e4ead626-f247-4398-92a9-48c65f78043"
}

# 400 - no token provided
{
    "error": "Invalid token"
}

# GET
curl --location --request GET 'http://localhost:18999/api/users/activate/?accountActivationToken=fc7cf408-6fed-4bbd-ac27-f1027db5d300'
```

#### Users list `GET /api/users`

Respond with a list of users. If the user has a valid access token, user data includes email and last_name. Otherwise, both are omitted.

```bash
curl --location --request GET 'http://localhost:18999/api/users/' \
--header 'Authorization: Bearer 5ea494e5-7732-46f6-98a0-96c3101b18b1'

# 200
{
    "users": [
        {
            "email": "e@mail.com",
            "first_name": "",
            "last_name": ""
        }
    ]
}

# no token/invalid token
curl --location --request GET 'http://localhost:18999/api/users/'

# 200 - no token
{
    "users": [
        {
            "first_name": ""
        }
    ]
}
```

#### Change password `PATCH /api/users`

```bash
curl --location --request PATCH 'http://localhost:18999/api/users/' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Authorization: Bearer 5ea494e5-7732-46f6-98a0-96c3101b18b1' \
--data-urlencode 'oldpw=pass' \
--data-urlencode 'newpw=word' \
--data-urlencode 'again=word'

# 204 success - no content

# 400
{
    "error": "Incorrect password"
}

# 400
{
    "error": "Passwords don't match"
}
```

### Summary

* Register an email, password, first_name (optional), last_name (optional)
* Email activation
* Login with email and password
* Change password
* Fetch users list
  * Omit some details if no users are logged in
