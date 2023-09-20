const aws = require('aws-sdk');

var dynamo = new aws.DynamoDB();
const tableName = process.env.tableName;
const indexName = process.env.indexName;

exports.handler = async (event, context) => {
    //console.log('## ENVIRONMENT VARIABLES: ' + JSON.stringify(process.env));
    //console.log('## EVENT: ' + JSON.stringify(event));

    let requestId = event['request_id'];
    console.log('requestId: ', requestId);    
    
    let msg = "";
    let queryParams = {
        TableName: tableName,
        IndexName: indexName, 
        KeyConditionExpression: "request_id = :requestId",
        ExpressionAttributeValues: {
            ":requestId": {'S': requestId}
        }
    };
    
    try {
        result = await dynamo.query(queryParams).promise();
    
        console.log('result: ', JSON.stringify(result));    

        if(result['Item'])
            msg = result['Item']['msg']['S'];
    } catch (error) {
        console.log(error);
        return;
    } 

    const response = {
        statusCode: 200,
        msg: msg
    };
    return response;
};