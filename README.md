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

