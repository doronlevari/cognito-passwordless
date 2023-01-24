# cognito-passwordless

I had a small system which was practically a fancy form. I let users fill in some details, and click submit. 
So I needed some "email login" to take place, but without the need for the user to set a passwords (and me providing ways to remind passwords)..

1. I wanted some gating factor to make it harder for someone's bot to submit 10000 forms. Email address validation looked like a good solution for that and also improves my form data.
2. I wanted to give people the ability to go back and edit *their* details and resubmit. 


I ride Cognito's "forgot password" validation mechanism to create an email-only login process:
1. The user provides their email address, the Client send it to the Lambda with "SEND" action.
2. the Lambda then validates the email user exists (creates it if not) and runs a "forgotPassword" command on that user. 
3. Cognito then send that email a validation code. 
4. The user provides this validation code, the Client sends it to the Lambda with "AUTH" action.
5. The Lambda runs "confirmForgotPassword" to get Cognito to validate the email code, and when valid, set a long random password to that user. The password (or an error message) is returned it to the Client.
6. The client logs in to this user (email) with that random passowrd. 

A password is used behind the scenes, but the user is only asked for the email validation code.

Possible enhancements: 
1. Schedule a task to run 10 seconds after "AUTH", to change the user's password that was just sent back.  
2. Have a (monthly?) scheduler to rotate passwords for all users. 


## Cognito
Created a User Pool. Username is email address. Validation thru email.
Created an "App Client". 
Worked wtih "Message customizations" to include: 
"Your login code is {####}.". 
It's now a "login code" and not an email validation code, etc. 

## Lambda

### Some initial smoke test:

Edit `test/lambda.test.js` with your email in TEST_EMAIL constant. 
```
# load a CLI creds and profile of a IAM user with enough permissions, in my case I included "AmazonCognitoPowerUser" policy
export AWS_PROFILE=personal
npm test
```
You should get an email.
Edit `test/lambda.test.js` and put the code in CONFIRMATION_CODE constant.
Uncomment the AUTH part, it has "it.only" so only this one will run, no new code is generated, but only the code that you pasted will be verified.  

### Lambda and API Gateway 
Create a Lambda and paste the content of index.js there (it's just one file and no libs.. you can do it!)
Equip the Lmabda role with AmazonCognitoPowerUser policy (or anything narrower of our choice that would be enough...).

API Gateway:
Create a POST method as a LAMBDA PROXY that will, well, proxy requests to your Lambda. I also enaled CORS. As needed.. 


## React:
Followed this excellent tutorial play list: https://www.youtube.com/watch?v=-qo5GFdN-Ck&list=PLaxxQQak6D_eARpHp6JdMq3rvD5A-WU9N
But modified to allow my passwordless login, it doesn't take the password from the user, it logs in with the password provided in the body response from the "AUTH" call to the Lambda. 

Check it out!

