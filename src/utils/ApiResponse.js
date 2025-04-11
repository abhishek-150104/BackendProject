class ApiResponse {
  constructor(
    statusCode,data,message="Success"
  ){
    this.statusCode=statusCode
    this.data=data
    this.message=message
    this.success = statusCode < 400 //should be less 400 100-199 (informational Responses)   200-299(successFull responses)   300-399(Redirection Messages)  400-499(client error responses)  500-599(server error responses) 
  }
}

export {ApiResponse}