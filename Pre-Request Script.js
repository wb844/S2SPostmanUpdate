var CryptoJS = require("crypto-js")
var current_date = new Date().getTime();

var current_token = pm.collectionVariables.get("Auth_Token");
var current_timestamp = pm.collectionVariables.get("token_timestamp");

console.log("Current Date: " + current_date);
console.log("Current Token Timestamp: " + current_timestamp);
console.log("Time Left: " + (current_timestamp - current_date));
if((current_timestamp < current_date) || !current_timestamp || !current_token){
    var client_id = pm.collectionVariables.get("client_id");
    var client_secret = pm.collectionVariables.get("client_secret");
    var auth_url = pm.collectionVariables.get("token_url") + "?grant_type=account_credentials&account_id=" + pm.collectionVariables.get("account_id")
    var basic_auth = client_id + ':' + client_secret

    var rawStr = CryptoJS.enc.Utf8.parse(basic_auth)
    var base64_auth = CryptoJS.enc.Base64.stringify(rawStr)
    console.log(`Encoded  value: ${base64_auth}`)
  
    pm.sendRequest({
    url:  auth_url,
    method: 'POST',
    header: {
        
        'Authorization': ('Basic '+ base64_auth),
    }
    
},function (err, res) {
    pm.collectionVariables.set("Auth_Token", res.json().access_token);
    var token_expires = res.json().expires_in
    var new_timestamp = token_expires * 1000 + current_date;
    pm.collectionVariables.set("token_timestamp", new_timestamp)
    console.log("New Token Timestamp: " + new_timestamp);
    console.log("Access Token: " + res.json().access_token)
});
}
