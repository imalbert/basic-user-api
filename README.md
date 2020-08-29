### API

#### `/auth/login`

##### `POST`
```bash
curl --location --request POST 'http://localhost:18999/auth/login' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'email=albert.s.manuel' \
--data-urlencode 'password=pass'
```

#### `/api/users/activate`

##### `GET`
```bash
curl --location --request GET 'http://localhost:18999/api/users/activate/?accountActivationToken=fc7cf408-6fed-4bbd-ac27-f1027db5d300'
```


#### `/api/users`

##### `GET`
```bash
curl --location --request GET 'http://localhost:18999/api/users/?token=5ea494e5-7732-46f6-98a0-96c3101b18b1'

# no token
curl --location --request GET 'http://localhost:18999/api/users/'
```

##### `POST`
```bash
curl --location --request POST 'http://localhost:18999/api/users/' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Authorization: Bearer 5ea494e5-7732-46f6-98a0-96c3101b18b1' \
--data-urlencode 'email=albert.s.manuel' \
--data-urlencode 'password=pass' \
--data-urlencode 'first_name=1234' \
--data-urlencode 'last_name=qwer'
```

##### `PATCH`
```bash
curl --location --request PATCH 'http://localhost:18999/api/users/' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Authorization: Bearer 5ea494e5-7732-46f6-98a0-96c3101b18b1' \
--data-urlencode 'oldpw=pass' \
--data-urlencode 'newpw=word' \
--data-urlencode 'again=word'
```

### Summary

* Register an email, password, first_name (optional), last_name (optional)
* Email activation
* Login with email and password
* Change password
* Fetch users list
  * Omit some details if no users are logged in

### Prerequisites

* Node.js 10.x or 12.x
* Less secure app access - Warning: Switch this option for your gmail account to use it for this app's email feature. This option can be turned off for gmail accounts that do not have 2-step Verification enabled. If you really want an active account, you can find the option here https://myaccount.google.com/u/1/lesssecureapps?pli=1.

* Create a `.env` file at the root of the project
    ```
    PORT=8080

    // for email service
    NODEMAILER_SERVICE=gmail
    NODEMAILER_PORT=465
    NODEMAILER_USER=mygmailgmail@mygmail.com
    NODEMAILER_PASS=password
    ```

### Start the server

##### `npm i`

##### `npm start`

