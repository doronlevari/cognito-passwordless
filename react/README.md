# React sample

Followed https://reactjs.org/tutorial/tutorial.html

To run 
```
cd my-app
npm start
```


Tutorial play list: https://www.youtube.com/watch?v=-qo5GFdN-Ck&list=PLaxxQQak6D_eARpHp6JdMq3rvD5A-WU9N
I followed 1,2,3 and 8 

https://www.youtube.com/watch?v=-qo5GFdN-Ck
https://www.youtube.com/watch?v=4rn4qDWeW_k
https://github.com/AlexzanderFlores/Worn-Off-Keys-Cognito-Tutorials

https://www.npmjs.com/package/amazon-cognito-identity-js

Form design, HTML:
https://www.sanwebe.com/2014/08/css-html-forms-designs

Deploy React to S3: https://medium.com/boca-code/deploy-your-react-app-to-aws-s3-bucket-and-with-ci-cd-1c9ce03023c2
npm run build
export AWS_PROFILE=personal
npm run deploy
aws cloudfront create-invalidation --distribution-id E1NAZ7J61IFBEX --paths "/*"



http://boston-sunday-river1.s3-website-us-east-1.amazonaws.com/

Make HTTPS:
In Godady, move Domain Servicing to Route53: https://jryancanty.medium.com/domain-by-godaddy-dns-by-route53-fc7acf2f5580
OLD:
ns17.domaincontrol.com.	
ns18.domaincontrol.com.	

Cert and CloudFront: https://channaly.medium.com/how-to-host-static-website-with-https-using-amazon-s3-251434490c59 (start with Link to your Domain and secure it with a valid https cert)

Requested one cert for both:
*.levari.co
levari.co

Then CloudFront stuff are not always up to date, I used https://aws.amazon.com/premiumsupport/knowledge-center/cloudfront-https-requests-s3/ and https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html#routing-to-cloudfront-distribution-config



Lambda...

Lambda + API Gateway: https://www.youtube.com/watch?v=0AavA8HmQ3s
Lambda and request parameters: https://www.youtube.com/watch?v=8l4Vevs5iCs
Same Lambda but with Cognito Auth: https://www.youtube.com/watch?v=48maKOJiaSo&list=PLaxxQQak6D_eARpHp6JdMq3rvD5A-WU9N&index=8

Dynamo, CRUD API: https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-dynamo-db.html
Did Lambda Proxy integration
API GW CloudWatch: https://aws.amazon.com/premiumsupport/knowledge-center/api-gateway-cloudwatch-logs/
To overcome CORS, I had to add header "Access-Control-Allow-Origin": "*" to the GET response from the Lambda!!



Not used yet:
https://blog.appsignal.com/2022/03/23/build-serverless-apis-with-nodejs-and-aws-lambda.html
https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-command-reference-sam-build.html





curl https://7bq3nfzehh.execute-api.us-east-1.amazonaws.com/dev/reservation -d '{"kaka":"pipi"}' -X POST -H 'Content-Type: application/json'
curl https://7bq3nfzehh.execute-api.us-east-1.amazonaws.com/dev/reservation/doronlevari@gmail.com -H 'Content-Type: application/json'

curl -X POST https://7bq3nfzehh.execute-api.us-east-1.amazonaws.com/dev/auth -d '{"httpMethod": "POST","body": "{\"type\":\"SEND\",\"email\":\"doron@levarire.com\"}"}'